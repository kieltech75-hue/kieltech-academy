import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { refreshTrustedSources } from './curriculumRefresh';

const projectId = process.env.FIREBASE_PROJECT_ID;
if (projectId !== 'kieltech') {
  throw new Error('FIREBASE_PROJECT_ID must be set to kieltech.');
}

initializeApp({
  credential: applicationDefault(),
  projectId,
});

async function main() {
  const result = await refreshTrustedSources('github-actions');
  console.log(JSON.stringify(result));
  if (result.checked !== 10 || result.failures.length > 0) {
    throw new Error(`Curriculum refresh incomplete: checked ${result.checked}/10 sources; ${result.failures.length} failed.`);
  }
}

main().catch((error: unknown) => {
  console.error('Curriculum refresh job failed:', error);
  process.exitCode = 1;
});
