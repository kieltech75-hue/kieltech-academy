import { createHash } from 'node:crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

const USER_AGENT = 'KielTechAcademy-CurriculumRefresh/1.0 (+https://kieltech-academy.web.app)';

const trustedSources = [
  { courseId: 'python', courseName: 'Python', url: 'https://docs.python.org/3/whatsnew/index.html' },
  { courseId: 'nodejs', courseName: 'Node.js / Express', url: 'https://nodejs.org/en/blog/' },
  { courseId: 'golang', courseName: 'Go (Golang)', url: 'https://go.dev/doc/devel/release' },
  { courseId: 'java', courseName: 'Java / Spring Boot', url: 'https://inside.java/feed.xml' },
  { courseId: 'rust', courseName: 'Rust', url: 'https://blog.rust-lang.org/feed.xml' },
  { courseId: 'javascript', courseName: 'JavaScript', url: 'https://github.com/tc39/ecma262/commits/main.atom' },
  { courseId: 'typescript', courseName: 'TypeScript', url: 'https://devblogs.microsoft.com/typescript/feed/' },
  { courseId: 'react', courseName: 'React', url: 'https://react.dev/blog' },
  { courseId: 'vue', courseName: 'Vue.js', url: 'https://blog.vuejs.org/' },
  { courseId: 'html-css', courseName: 'HTML & CSS', url: 'https://developer.mozilla.org/en-US/blog/' },
] as const;

function cleanMarkup(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

function firstTagValue(document: string, tagNames: string[]): string | undefined {
  for (const tagName of tagNames) {
    const match = document.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}\\s*>`, 'i'));
    if (match?.[1]) return cleanMarkup(match[1]).slice(0, 300);
  }
  return undefined;
}

function firstMetaValue(document: string, propertyNames: string[]): string | undefined {
  for (const property of propertyNames) {
    const match = document.match(new RegExp(`<meta\\s+[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i'));
    if (match?.[1]) return cleanMarkup(match[1]).slice(0, 300);
  }
  return undefined;
}

async function fetchSource(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/atom+xml, application/rss+xml, application/xml, text/html',
      'User-Agent': USER_AGENT,
    },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`Trusted source returned HTTP ${response.status}: ${url}`);
  }

  const body = (await response.text()).slice(0, 500_000);
  const entry = body.match(/<(item|entry)\b[^>]*>[\s\S]*?<\/\1\s*>/i)?.[0];
  const title = (entry ? firstTagValue(entry, ['title']) : undefined)
    || firstTagValue(body, ['h2', 'h1'])
    || firstTagValue(body, ['title'])
    || firstMetaValue(body, ['og:title', 'twitter:title'])
    || new URL(url).hostname;
  const publishedDate = (entry ? firstTagValue(entry, ['published', 'updated', 'pubDate', 'date']) : undefined)
    || firstTagValue(body, ['published', 'updated', 'pubDate', 'lastBuildDate'])
    || firstMetaValue(body, ['article:published_time', 'article:modified_time']);
  const etag = response.headers.get('etag');
  const lastModified = response.headers.get('last-modified');
  const contentSignal = etag || lastModified || `${title}|${publishedDate || ''}|${body
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/\s+/g, ' ')
    .slice(0, 12_000)}`;
  const fingerprint = createHash('sha256').update(contentSignal).digest('hex');

  return {
    title,
    publishedDate,
    fingerprint,
    lastModified,
  };
}

export async function refreshTrustedSources(triggeredBy: string) {
  const db = getFirestore();
  const fetchedAt = new Date().toISOString();
  let checked = 0;
  let proposalsCreated = 0;
  const failures: string[] = [];

  await Promise.all(trustedSources.map(async (source) => {
    try {
      const sourceState = await fetchSource(source.url);
      const monitorRef = db.collection('curriculumSourceMonitors').doc(source.courseId);
      const monitorSnapshot = await monitorRef.get();

      if (!monitorSnapshot.exists) {
        await monitorRef.set({
          courseId: source.courseId,
          sourceUrl: source.url,
          fingerprint: sourceState.fingerprint,
          sourceTitle: sourceState.title,
          sourcePublishedDate: sourceState.publishedDate ?? null,
          checkedAt: fetchedAt,
        });
      } else {
        const previous = monitorSnapshot.data();
        if (previous?.fingerprint !== sourceState.fingerprint) {
          const proposalRef = db.collection('curriculumProposals')
            .doc(`${source.courseId}-${previous?.fingerprint?.slice(0, 8) || 'baseline'}-${sourceState.fingerprint.slice(0, 8)}-${fetchedAt.slice(0, 10)}`);
          const batch = db.batch();
          batch.set(proposalRef, {
            courseId: source.courseId,
            courseName: source.courseName,
            sourceUrl: source.url,
            sourceTitle: sourceState.title,
            sourcePublishedDate: sourceState.publishedDate ?? null,
            sourceLastModified: sourceState.lastModified ?? null,
            fetchedAt,
            detectedAt: fetchedAt,
            detectedBy: triggeredBy,
            status: 'pending',
          });
          batch.set(monitorRef, {
            courseId: source.courseId,
            sourceUrl: source.url,
            fingerprint: sourceState.fingerprint,
            sourceTitle: sourceState.title,
            sourcePublishedDate: sourceState.publishedDate ?? null,
            checkedAt: fetchedAt,
          });
          await batch.commit();
          proposalsCreated += 1;
        } else {
          await monitorRef.update({ checkedAt: fetchedAt });
        }
      }
      checked += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${source.courseId}: ${message}`);
      logger.error('Curriculum source refresh failed', {
        courseId: source.courseId,
        sourceUrl: source.url,
        error: message,
      });
    }
  }));

  logger.info('Curriculum source refresh completed', {
    triggeredBy,
    checked,
    proposalsCreated,
    failures,
  });
  return { checked, proposalsCreated, failures };
}
