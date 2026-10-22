import React from 'react';
import {
  BookOpen,
  Cookie,
  Database,
  ExternalLink,
  FileText,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

const sectionClass = 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6';
const headingClass = 'text-lg font-bold text-white';
const bodyClass = 'mt-2 text-sm leading-6 text-slate-300';
const listClass = 'mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300 marker:text-cyan-400';

export const PrivacyPolicyView: React.FC = () => (
  <article className="mx-auto w-full max-w-5xl space-y-6">
    <header className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Privacy</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Privacy Policy</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
        This policy explains what information KielTech Academy processes when you browse, create an
        account, study courses, or use assessments. It describes the current application behavior
        and service configuration, which may change as the platform evolves.
      </p>
      <p className="mt-4 text-xs font-mono text-slate-400">Effective date: October 21, 2026</p>
    </header>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-cyan-400" />
        <h2 className={headingClass}>Information processed</h2>
      </div>
      <ul className={listClass}>
        <li>
          <strong className="text-white">Account details:</strong> Firebase account identifier,
          email address, display name, profile photo when provided by your sign-in provider,
          student identifier, account role, and course/profile timestamps.
        </li>
        <li>
          <strong className="text-white">Learning records:</strong> selected courses, stage progress
          and completion, bookmarks, assessment scores and outcomes, and submitted assessment
          responses. Some exam records may include code answers and execution feedback.
        </li>
        <li>
          <strong className="text-white">Academic activity:</strong> account creation, sign-ins and
          sign-outs, course or stage selections, assessment starts and submissions, and lesson
          bookmark changes. Events can include the related course, stage, score, and timestamp.
        </li>
        <li>
          <strong className="text-white">Browser settings:</strong> theme, selected course, sidebar
          preference, locally stored progress/results/bookmarks, and your cookie preference choice.
        </li>
      </ul>
      <p className={bodyClass}>
        The app does not intentionally collect keystrokes or unsent drafts. Submitted assessment
        answers are part of assessment records; avoid entering sensitive personal information into
        course or code-answer fields.
      </p>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <Cookie className="h-5 w-5 text-amber-400" />
        <h2 className={headingClass}>Cookies and local browser storage</h2>
      </div>
      <p className={bodyClass}>
        KielTech Academy uses browser storage for sign-in persistence and to remember course
        selections, progress, results, bookmarks, display settings, and cookie preferences. Firebase
        Authentication is configured for local persistence; the app applies a session timeout of
        about 30 days. Browser-only data may be lost if you clear site data or change devices.
      </p>
      <p className={bodyClass}>
        The Cookie Preferences dialog stores your selected categories in this browser. Its optional
        analytics category is reserved for future use; the current app does not connect that choice
        to an analytics service. Functional preferences are also stored locally by the app regardless
        of the selected category. Use the Cookie Preferences link in the page footer to review the
        available choices.
      </p>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-emerald-400" />
        <h2 className={headingClass}>How information is used</h2>
      </div>
      <ul className={listClass}>
        <li>To provide account sign-in, identity, saved learning progress, and assessment history.</li>
        <li>To show your transcript and support authorized academic administration features.</li>
        <li>To maintain and troubleshoot the learning platform and its account features.</li>
        <li>To send requested email verification and password-reset links when the server-side email service is configured.</li>
      </ul>
      <p className={bodyClass}>
        The application has no connected advertising or analytics service. The academic activity
        records above are account-linked operational records, not anonymous product analytics.
      </p>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-amber-400" />
        <h2 className={headingClass}>Services and sharing</h2>
      </div>
      <p className={bodyClass}>
        Firebase Authentication and Cloud Firestore provide sign-in and cloud data storage. If you
        choose Google sign-in, Google handles the identity-provider interaction; KielTech Academy
        does not receive your Google password. Firebase Hosting serves the published website.
      </p>
      <p className={bodyClass}>
        Authorized administrators may access student profiles, progress, assessment results, and
        academic activity for platform administration. If custom email delivery is enabled on the
        server, the configured SMTP provider processes the recipient address and the requested
        verification or reset email. Email action links are generated through Firebase Admin.
      </p>
      <p className={bodyClass}>
        The curriculum refresh process stores trusted-source metadata and links for review; it is
        designed not to copy article text. Course links may lead to third-party sites with their own
        privacy practices.
      </p>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <ExternalLink className="h-4 w-4 shrink-0 text-slate-500" />
        <span>Third-party services process information under their own terms and privacy notices.</span>
      </p>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5 text-purple-400" />
        <h2 className={headingClass}>Your choices and data retention</h2>
      </div>
      <ul className={listClass}>
        <li>You can sign out and manage the cookie preference choice saved in this browser.</li>
        <li>Clearing browser storage removes local copies, but does not delete information already stored in Firestore.</li>
        <li>The app currently has no self-service account or cloud-record deletion tool.</li>
        <li>Cloud records may remain until removed through authorized platform administration; no fixed retention period is currently published.</li>
      </ul>
      <p className={bodyClass}>
        For a question or request about account information, contact the platform administrator
        through the support channel you used to access KielTech Academy. No public privacy contact
        email address is currently configured in the app.
      </p>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-cyan-400" />
        <h2 className={headingClass}>Security and policy updates</h2>
      </div>
      <p className={bodyClass}>
        Authentication and database access are provided by Firebase, with access controls intended
        to restrict account records to the account holder and authorized administrators. No online
        service can guarantee absolute security. This policy may be updated when application
        behavior or providers change; the effective date above will be revised when that happens.
      </p>
    </section>
  </article>
);
