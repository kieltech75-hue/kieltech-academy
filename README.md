<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# KielTech Academy

KielTech Academy is a React/Vite learning portal served by an Express server. AI-powered features and Gemini integration are disabled.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

## Firebase Hosting

The app uses Firebase Authentication and Cloud Firestore. Firebase Hosting serves the static Vite build; it does not run the Express server.

1. Install dependencies: `npm install`
2. Sign in to Firebase CLI: `npx firebase-tools login`
3. Build the site: `npm run build`
4. Deploy the site and Firestore rules to the configured `kieltech` project: `npx firebase-tools deploy --only hosting,firestore:rules`

The Hosting configuration publishes `dist`, routes client-side URLs to `index.html`, and applies cache headers to built assets. Review `firestore.rules` before deploying; they restrict student access to the student's own records, allow administrators to read student and learning records, and deny all other paths by default. No Gemini API key or AI service is required.

For local development, run `npm run dev`. For a standalone Express deployment, `npm start` serves the build from `dist`.

## Reviewed Curriculum Refresh

The GitHub Actions workflow in `.github/workflows/curriculum-refresh.yml` checks one trusted official source for each of the ten courses on January 1 and July 1 (09:00 UTC). It can also be started manually from the repository's **Actions** tab. A check records source metadata and a content fingerprint only; it does not copy external lesson text, edit courses, publish lessons, or change exam questions. The first check records a baseline, and later source changes create review proposals in Firestore. All ten source checks must complete for the workflow job to succeed.

To enable the scheduled workflow without Firebase Cloud Functions:

1. Push this project to the default branch of a GitHub repository and ensure GitHub Actions is enabled.
2. Create a dedicated Google Cloud service account for the `kieltech` project and grant it only the **Cloud Datastore User** (`roles/datastore.user`) role needed to read and write the curriculum monitor/proposal documents.
3. Create a JSON key for that service account, then add its entire JSON content as a GitHub repository Actions secret named `FIREBASE_SERVICE_ACCOUNT`. Do not commit the key or paste it into source files, workflow logs, or chat. Rotate or revoke the key if it is ever exposed.
4. Open **Actions → Curriculum source refresh → Run workflow** to run and verify the first job. Scheduled runs will then execute in January and July.

GitHub-hosted runner usage is free for public repositories; private repositories use the free Actions minutes included in their GitHub plan. This workflow does not deploy or invoke Firebase Functions. The existing admin page's manual refresh and publish/reject operations still use Firebase callable Functions and will not work until those backend callables are deployed or replaced by a separate authenticated backend. An administrator reviews each proposal, writes original teaching content (overview, prerequisites, basics, progressive lessons with two explained examples each, advanced and extra topics, source reference, and a lesson-based knowledge check), then explicitly publishes or rejects it. Only published updates appear to authenticated students. These supplementary knowledge checks do not modify official assessment scores. Existing course stages, student progress, and official exams remain unchanged.

## Admin Operations Dashboard

An account whose Firestore `users/{uid}` profile has `role: "admin"` sees the **Admin** button in the header. The dashboard provides recent student profiles, synced course progress, assessment outcomes, and a timeline of selected learning and account events; the Curriculum review button opens the existing proposal workflow. Reports are capped at 250 records per category. Assessment history and progress are read from the existing per-user `results` and `progress` subcollections.

The activity timeline records sign-ins, account creation and sign-outs, course and stage selections, assessment starts and submissions, and lesson bookmark changes. It is academic telemetry, not a tamper-proof security audit log; it does not collect code answers, keystrokes, or private content. Students can create only events attributed to their own account, while only administrators can read the global activity collection.

Deploy the updated Firestore rules before using the dashboard against the hosted Firebase project:

```sh
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

The rules authorize admin reads using the Firestore profile role and do not allow users to change their own role. The index definitions support the dashboard's latest progress and assessment queries. New activity logging and dashboard reads will not work against the hosted project until the rules and indexes are deployed and the indexes finish building.
