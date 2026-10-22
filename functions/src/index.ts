import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { refreshTrustedSources } from './curriculumRefresh';

initializeApp();

const db = getFirestore();
const REGION = 'us-central1';

async function hasAdminAccess(uid: string): Promise<boolean> {
  const roleSnapshot = await db.collection('user_roles').doc(uid).get();
  if (roleSnapshot.exists) {
    return roleSnapshot.data()?.role === 'admin' || roleSnapshot.data()?.role === 'CEO & Founder';
  }
  const legacyProfile = await db.collection('users').doc(uid).get();
  return legacyProfile.data()?.role === 'admin';
}

export const scheduledCurriculumRefresh = onSchedule(
  {
    schedule: '0 9 1 */6 *',
    timeZone: 'UTC',
    region: REGION,
    timeoutSeconds: 300,
    memory: '512MiB',
  },
  async () => {
    await refreshTrustedSources('scheduled-refresh');
  },
);

export const requestCurriculumRefresh = onCall(
  { region: REGION, timeoutSeconds: 300, memory: '512MiB' },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in with an administrator account to refresh sources.');
    }
    if (!await hasAdminAccess(request.auth.uid)) {
      throw new HttpsError('permission-denied', 'Only curriculum administrators can refresh sources.');
    }

    return refreshTrustedSources(`admin:${request.auth.uid}`);
  },
);

export const publishCurriculumProposal = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in with an administrator account to publish curriculum updates.');
    }
    if (!await hasAdminAccess(request.auth.uid)) {
      throw new HttpsError('permission-denied', 'Only curriculum administrators can publish curriculum updates.');
    }

    const proposalId = request.data?.proposalId;
    const content = request.data?.content;
    if (typeof proposalId !== 'string' || !proposalId || !content || typeof content !== 'object') {
      throw new HttpsError('invalid-argument', 'A proposal and reviewed teaching content are required.');
    }
    const proposalRef = db.collection('curriculumProposals').doc(proposalId);
    const publishedAt = new Date().toISOString();

    await db.runTransaction(async (transaction) => {
      const proposalSnapshot = await transaction.get(proposalRef);
      if (!proposalSnapshot.exists || proposalSnapshot.data()?.status !== 'pending') {
        throw new HttpsError('failed-precondition', 'This proposal has already been reviewed.');
      }
      const proposal = proposalSnapshot.data()!;
      const courseId = proposal.courseId;
      const stageId = Number(request.data?.stageId);
      const title = request.data?.title;
      const summary = request.data?.summary;

      if (!Number.isInteger(stageId) || stageId < 1 || stageId > 4
        || typeof title !== 'string' || !title.trim()
        || typeof summary !== 'string' || !summary.trim()
        || !isValidTeachingContent(content)) {
        throw new HttpsError('invalid-argument', 'Teaching content, stage, title, summary, two examples per lesson, and a source link are required.');
      }

      const updateRef = db.collection('publishedCurriculumUpdates').doc(proposalId);
      transaction.create(updateRef, {
        proposalId,
        courseId,
        courseName: proposal.courseName,
        sourceUrl: proposal.sourceUrl,
        sourceTitle: proposal.sourceTitle,
        sourcePublishedDate: proposal.sourcePublishedDate ?? null,
        fetchedAt: proposal.fetchedAt,
        status: 'published',
        detectedAt: proposal.detectedAt,
        stageId,
        title: title.trim(),
        summary: summary.trim(),
        content,
        publishedAt,
        publishedBy: request.auth!.uid,
      });
      transaction.update(proposalRef, {
        status: 'published',
        stageId,
        title: title.trim(),
        summary: summary.trim(),
        content,
        publishedAt,
        reviewedBy: request.auth!.uid,
        reviewedAt: publishedAt,
      });
    });

    return { published: true };
  },
);

function isValidTeachingContent(content: Record<string, unknown>): boolean {
  const lessons = content.lessons;
  const sources = content.onlineExamples;
  return typeof content.meaning === 'string' && content.meaning.trim().length > 0
    && Array.isArray(content.prerequisites)
    && Array.isArray(content.basics)
    && Array.isArray(lessons) && lessons.length > 0
    && lessons.every((lesson) => {
      if (!lesson || typeof lesson !== 'object') return false;
      const item = lesson as { title?: unknown; explanation?: unknown; examples?: unknown };
      return typeof item.title === 'string' && item.title.trim().length > 0
        && typeof item.explanation === 'string' && item.explanation.trim().length > 0
        && Array.isArray(item.examples) && item.examples.length >= 2
        && item.examples.slice(0, 2).every((example) => {
          if (!example || typeof example !== 'object') return false;
          const value = example as { code?: unknown; explanation?: unknown };
          return typeof value.code === 'string' && typeof value.explanation === 'string'
            && value.explanation.trim().length > 0;
        });
    })
    && Array.isArray(content.assessment) && content.assessment.length > 0
    && content.assessment.every((question) => {
      if (!question || typeof question !== 'object') return false;
      const value = question as {
        question?: unknown;
        options?: unknown;
        correctIndex?: unknown;
        explanation?: unknown;
      };
      return typeof value.question === 'string' && value.question.trim().length > 0
        && Array.isArray(value.options) && value.options.length === 4
        && value.options.every((option) => typeof option === 'string' && option.trim().length > 0)
        && Number.isInteger(value.correctIndex) && Number(value.correctIndex) >= 0 && Number(value.correctIndex) < 4
        && typeof value.explanation === 'string' && value.explanation.trim().length > 0;
    })
    && Array.isArray(content.advanced)
    && Array.isArray(content.extras)
    && Array.isArray(sources) && sources.length > 0
    && sources.every((source) => {
      if (!source || typeof source !== 'object') return false;
      const value = source as { title?: unknown; summary?: unknown; url?: unknown };
      if (typeof value.title !== 'string' || typeof value.summary !== 'string' || typeof value.url !== 'string') {
        return false;
      }
      try {
        const url = new URL(value.url);
        return url.protocol === 'https:';
      } catch {
        return false;
      }
    });
}

export const rejectCurriculumProposal = onCall(
  { region: REGION },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Sign in with an administrator account to review proposals.');
    }
    if (!await hasAdminAccess(request.auth.uid)) {
      throw new HttpsError('permission-denied', 'Only curriculum administrators can review proposals.');
    }
    const proposalId = request.data?.proposalId;
    if (typeof proposalId !== 'string' || !proposalId) {
      throw new HttpsError('invalid-argument', 'A proposal ID is required.');
    }
    const proposalRef = db.collection('curriculumProposals').doc(proposalId);
    await db.runTransaction(async (transaction) => {
      const proposal = await transaction.get(proposalRef);
      if (!proposal.exists || proposal.data()?.status !== 'pending') {
        throw new HttpsError('failed-precondition', 'This proposal has already been reviewed.');
      }
      transaction.update(proposalRef, {
        status: 'rejected',
        reviewedBy: request.auth!.uid,
        reviewedAt: new Date().toISOString(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    return { rejected: true };
  },
);
