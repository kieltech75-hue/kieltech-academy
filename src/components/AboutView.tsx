import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Code2,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { COURSES } from '../data/coursesCurriculum';

const sectionClass = 'rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6';
const headingClass = 'text-lg font-bold text-white';
const bodyClass = 'mt-2 text-sm leading-6 text-slate-300';

export const AboutView: React.FC = () => (
  <article className="mx-auto w-full max-w-5xl space-y-6">
    <header className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">About the learning platform</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">KielTech Academy</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
        A self-paced software engineering learning portal with structured course stages, examples,
        practice assessments, saved lessons, and progress tracking. Use this page to understand how
        the learning workspace works and what its records and credentials mean.
      </p>
    </header>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-amber-400" />
        <h2 className={headingClass}>What you can learn</h2>
      </div>
      <p className={bodyClass}>
        Courses are organized into backend and frontend engineering tracks. Each course contains
        progressive stages with explanations, examples, and related practice. The course catalogue
        currently includes:
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((course) => (
          <li key={course.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Code2 className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>{course.name}</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-400">{course.description}</p>
          </li>
        ))}
      </ul>
      <p className={bodyClass}>
        Choose a track and course from the sidebar. Work through the available stages, revisit
        saved lessons, and use the course selector to move between topics.
      </p>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        <h2 className={headingClass}>Learning, assessments, and progress</h2>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        <li>Study a stage’s lessons and examples before attempting its knowledge checks.</li>
        <li>Assessment results are shown in the Academic Transcript Portal; unanswered items may count as incorrect.</li>
        <li>Some later course content is locked until its prerequisites are completed.</li>
        <li>Use the bookmark control on a lesson to save it in the sidebar for later review.</li>
        <li>Course completion indicators and generated diplomas are records inside this learning app, not official university credits or externally accredited qualifications.</li>
      </ul>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <UserRound className="h-5 w-5 text-cyan-400" />
        <h2 className={headingClass}>Accounts and saved work</h2>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-white">Using an account</h3>
          <p className={bodyClass}>
            Sign in with Google through Firebase, or register with email and password. Email/password
            accounts must verify their email before sign-in. Password resets and verification links
            are delivered by the configured email service when it is available.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Guest and signed-in data</h3>
          <p className={bodyClass}>
            Some learning state is stored in this browser. When signed in, supported profile,
            progress, and assessment records can also sync to the academy’s Firestore database.
            Browser-only data may not follow you to another device, and clearing browser storage can
            remove local-only records.
          </p>
        </div>
      </div>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-amber-400" />
        <h2 className={headingClass}>Privacy and security</h2>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        <li>Authentication is handled by Firebase; the app does not need your Google password.</li>
        <li>Account-based features store the profile details and learning records needed to provide sign-in, saved progress, results, and administration.</li>
        <li>Cookie or browser storage consent controls are available when shown; essential browser storage supports app settings and learning state.</li>
        <li>Never share your password, email app password, or other private credentials. Official admin tools are for authorized administrators only.</li>
      </ul>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-purple-400" />
        <h2 className={headingClass}>Academic scope</h2>
      </div>
      <p className={bodyClass}>
        The course material is educational and intended for independent study. References to
        academic standards describe curriculum design goals; they do not mean KielTech Academy is
        accredited by ABET, ACM, or a university. App-generated completion records and diplomas do
        not replace formal qualifications.
      </p>
    </section>

    <section className={sectionClass}>
      <div className="flex items-center gap-2">
        <CircleHelp className="h-5 w-5 text-cyan-400" />
        <h2 className={headingClass}>Need help?</h2>
      </div>
      <p className={bodyClass}>
        For account access, first check your email’s spam folder for verification or reset messages.
        If email delivery or cloud syncing is unavailable, those features depend on the academy’s
        server and Firebase configuration and may need administrator attention.
      </p>
      <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-400">
        <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
        <span>No public support address or help desk is configured in the app at this time.</span>
      </p>
      <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <Mail className="h-4 w-4 text-slate-500" />
        <span>Account emails are private and sent to the address associated with the account.</span>
      </p>
    </section>
  </article>
);
