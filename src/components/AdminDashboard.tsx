import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  collectionGroup,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  Activity,
  AlertCircle,
  Award,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
} from 'lucide-react';
import { db } from '../lib/firebase';
import type { AcademicActivityEvent } from '../types/adminActivity';
import type { TestResultRecord } from '../types/curriculum';
import type { StudentProfile } from '../context/AuthContext';

interface AdminDashboardProps {
  adminId: string;
  onOpenCurriculumReview: () => void;
}

interface AdminCourseProgress {
  id: string;
  userId: string;
  courseId: string;
  currentStageId?: number;
  completedStageIds?: number[];
  unlockedStageIds?: number[];
  defensePassed?: boolean;
  updatedAt?: string;
}

interface AdminResult extends TestResultRecord {
  userId: string;
}

type DashboardTab = 'overview' | 'students' | 'progress' | 'assessments' | 'activity';

const tabs: Array<{ id: DashboardTab; label: string; icon: React.ReactNode }> = [
  { id: 'overview', label: 'Overview', icon: <Activity className="h-4 w-4" /> },
  { id: 'students', label: 'Students', icon: <Users className="h-4 w-4" /> },
  { id: 'progress', label: 'Course progress', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'assessments', label: 'Assessments', icon: <Award className="h-4 w-4" /> },
  { id: 'activity', label: 'Activity', icon: <ClipboardCheck className="h-4 w-4" /> },
];

function formatDate(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value
    && typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (Number.isFinite(date.getTime())) return date.toLocaleString();
  }
  return 'Not recorded';
}

function eventDescription(event: AcademicActivityEvent): string {
  switch (event.type) {
    case 'sign-in': return 'Signed in';
    case 'account-created': return 'Created an account';
    case 'sign-out': return 'Signed out';
    case 'course-selected': return `Selected ${event.courseName || event.courseId || 'a course'}`;
    case 'stage-viewed': return `Opened Stage ${event.stageId ?? ''} of ${event.courseName || event.courseId || 'a course'}`;
    case 'stage-test-started': return `Started a stage assessment · Stage ${event.stageId ?? ''}`;
    case 'degree-defense-started': return `Started the degree defense · Stage ${event.stageId ?? ''}`;
    case 'assessment-submitted':
      return `Submitted ${event.assessmentType === 'stage_test' ? 'a stage assessment' : 'a degree defense'} · ${event.score ?? 0}/${event.totalQuestions ?? 0} (${event.percentage ?? 0}%) · ${event.passed ? 'passed' : 'not passed'}`;
    case 'lesson-bookmarked': return `Bookmarked ${event.lessonTitle || 'a lesson'}`;
    case 'lesson-unbookmarked': return `Removed bookmark for ${event.lessonTitle || 'a lesson'}`;
  }
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminId,
  onOpenCurriculumReview,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [progress, setProgress] = useState<AdminCourseProgress[]>([]);
  const [results, setResults] = useState<AdminResult[]>([]);
  const [activity, setActivity] = useState<AcademicActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];
    const subscriptions: Array<{
      key: string;
      subscribe: (next: (snapshot: { docs: Array<{ id: string; data: () => Record<string, unknown> }> }) => void,
        fail: (error: Error) => void) => () => void;
      onData: (snapshot: { docs: Array<{ id: string; data: () => Record<string, unknown> }> }) => void;
    }> = [
      {
        key: 'students',
        subscribe: (next, fail) => onSnapshot(
          query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(250)),
          next,
          fail,
        ),
        onData: (snapshot) => setStudents(snapshot.docs.map((userDoc) => ({
          ...userDoc.data(),
          id: userDoc.id,
        } as unknown as StudentProfile))),
      },
      {
        key: 'progress',
        subscribe: (next, fail) => onSnapshot(
          query(collectionGroup(db, 'progress'), orderBy('updatedAt', 'desc'), limit(250)),
          next,
          fail,
        ),
        onData: (snapshot) => setProgress(snapshot.docs.map((progressDoc) => ({
          ...progressDoc.data(),
          id: progressDoc.id,
        } as unknown as AdminCourseProgress))),
      },
      {
        key: 'results',
        subscribe: (next, fail) => onSnapshot(
          query(collectionGroup(db, 'results'), orderBy('timestamp', 'desc'), limit(250)),
          next,
          fail,
        ),
        onData: (snapshot) => setResults(snapshot.docs.map((resultDoc) => ({
          ...resultDoc.data(),
          id: resultDoc.id,
        } as unknown as AdminResult))),
      },
      {
        key: 'activity',
        subscribe: (next, fail) => onSnapshot(
          query(collection(db, 'academicActivity'), orderBy('createdAt', 'desc'), limit(250)),
          next,
          fail,
        ),
        onData: (snapshot) => setActivity(snapshot.docs.map((eventDoc) => ({
          ...eventDoc.data(),
          id: eventDoc.id,
        } as unknown as AcademicActivityEvent))),
      },
    ];

    for (const subscription of subscriptions) {
      unsubscribers.push(subscription.subscribe(
        (snapshot) => {
          subscription.onData(snapshot);
          setErrors((current) => {
            const next = { ...current };
            delete next[subscription.key];
            return next;
          });
          setLoading(false);
        },
        (error) => {
          console.error(`Could not load admin ${subscription.key}:`, error);
          setErrors((current) => ({
            ...current,
            [subscription.key]: error.message,
          }));
          setLoading(false);
        },
      ));
    }
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  const studentsById = useMemo(
    () => new Map(students.map((student) => [student.id, student])),
    [students],
  );
  const filteredStudents = useMemo(() => {
    const search = studentSearch.trim().toLocaleLowerCase();
    if (!search) return students;
    return students.filter((student) => (
      student.displayName?.toLocaleLowerCase().includes(search)
      || student.email?.toLocaleLowerCase().includes(search)
      || student.studentId?.toLocaleLowerCase().includes(search)
    ));
  }, [students, studentSearch]);
  const activeLearnerCount = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return new Set(activity
      .filter((event) => event.type !== 'sign-out'
        && event.createdAt?.seconds * 1000 >= cutoff)
      .map((event) => event.actorUid)).size;
  }, [activity]);
  const passRate = results.length
    ? Math.round((results.filter((result) => result.passed).length / results.length) * 100)
    : 0;

  const failureMessages = Object.entries(errors);

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-20">
      <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Academic operations</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Admin dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Review student enrollment, learning progress, assessment outcomes, and recent course activity.
            Student records are visible only to authorized administrators.
          </p>
          <p className="mt-2 text-xs text-slate-500">Administrator account: {adminId}</p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition-colors hover:bg-amber-500/20"
          onClick={onOpenCurriculumReview}
          type="button"
        >
          <GraduationCap className="h-4 w-4" />
          Curriculum review
        </button>
      </header>

      {failureMessages.length > 0 && (
        <div className="space-y-2 rounded-xl border border-rose-500/30 bg-rose-950/20 p-4" role="alert">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-200">
            <AlertCircle className="h-4 w-4" />
            Some admin reports could not be loaded
          </div>
          <ul className="space-y-1 text-xs leading-5 text-rose-200/80">
            {failureMessages.map(([key, message]) => (
              <li key={key}><strong className="capitalize">{key}:</strong> {message}</li>
            ))}
          </ul>
          <p className="text-xs text-rose-200/70">
            If you just enabled administrator access, reload after signing in and deploy the updated Firestore rules before accessing other students’ records.
          </p>
        </div>
      )}

      <nav aria-label="Admin dashboard sections" className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-500/15 text-amber-200'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'overview' && (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Student accounts', value: students.length, detail: 'Up to 250 most recent profiles', icon: <Users className="h-5 w-5 text-sky-300" /> },
              { label: 'Active learners', value: activeLearnerCount, detail: 'From loaded activity events in the last 30 days', icon: <Activity className="h-5 w-5 text-emerald-300" /> },
              { label: 'Assessments recorded', value: results.length, detail: 'Up to 250 recent results', icon: <Award className="h-5 w-5 text-amber-300" /> },
              { label: 'Pass rate', value: `${passRate}%`, detail: 'Across the loaded recent results', icon: <GraduationCap className="h-5 w-5 text-purple-300" /> },
            ].map((metric) => (
              <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-5" key={metric.label}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-slate-400">{metric.label}</p>{metric.icon}
                </div>
                <p className="mt-3 text-3xl font-bold text-white">{loading ? '…' : metric.value}</p>
                <p className="mt-1 text-xs text-slate-500">{metric.detail}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h2 className="font-semibold text-white">Latest student activity</h2>
              <RecentActivity events={activity.slice(0, 8)} studentsById={studentsById} />
              <button className="mt-3 text-sm font-medium text-amber-300 hover:text-amber-200" onClick={() => setActiveTab('activity')} type="button">
                View activity timeline
              </button>
            </section>
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h2 className="font-semibold text-white">Recent assessment outcomes</h2>
              <ResultTable results={results.slice(0, 8)} studentsById={studentsById} />
              <button className="mt-3 text-sm font-medium text-amber-300 hover:text-amber-200" onClick={() => setActiveTab('assessments')} type="button">
                View assessment records
              </button>
            </section>
          </div>
        </section>
      )}

      {activeTab === 'students' && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Student accounts</h2>
              <p className="mt-1 text-xs text-slate-400">Showing up to 250 most recently created profiles.</p>
            </div>
            <input
              aria-label="Search students"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 sm:max-w-sm"
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder="Search name, email, or student ID"
              value={studentSearch}
            />
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400">
                <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Student ID</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Current course</th><th className="px-4 py-3">Joined</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3"><span className="block font-medium text-white">{student.displayName || 'Student'}</span><span className="text-xs text-slate-400">{student.email}</span></td>
                    <td className="px-4 py-3 font-mono text-xs text-amber-200">{student.studentId || '—'}</td>
                    <td className="px-4 py-3 text-xs capitalize text-slate-300">{student.role || 'student'}</td>
                    <td className="px-4 py-3 text-slate-300">{student.currentCourseId || 'Not selected'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{formatDate(student.createdAt)}</td>
                  </tr>
                ))}
                {!loading && filteredStudents.length === 0 && (
                  <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={5}>No student accounts match this search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'progress' && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Course progress</h2>
            <p className="mt-1 text-xs text-slate-400">Latest 250 synced course records, ordered by update time.</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase text-slate-400">
                <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Current stage</th><th className="px-4 py-3">Stages completed</th><th className="px-4 py-3">Degree defense</th><th className="px-4 py-3">Last updated</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {progress.map((record) => (
                  <tr key={`${record.userId}-${record.courseId}`}>
                    <td className="px-4 py-3 text-white">{studentsById.get(record.userId)?.displayName || record.userId}</td>
                    <td className="px-4 py-3 text-slate-300">{record.courseId}</td>
                    <td className="px-4 py-3 text-slate-300">{record.currentStageId ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-300">{record.completedStageIds?.length ?? 0}</td>
                    <td className="px-4 py-3 text-slate-300">{record.defensePassed ? 'Passed' : 'Not passed'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{formatDate(record.updatedAt)}</td>
                  </tr>
                ))}
                {!loading && progress.length === 0 && (
                  <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={6}>No synced course progress is available yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'assessments' && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Assessment results</h2>
            <p className="mt-1 text-xs text-slate-400">Latest 250 result records. This view reports submitted scores and pass status.</p>
          </div>
          <ResultTable results={results} studentsById={studentsById} />
        </section>
      )}

      {activeTab === 'activity' && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Academic activity timeline</h2>
            <p className="mt-1 text-xs text-slate-400">Latest 250 recorded sign-ins, course views, assessment activity, and bookmark changes.</p>
          </div>
          <RecentActivity events={activity} studentsById={studentsById} detailed />
          {!loading && activity.length === 0 && !errors.activity && (
            <p className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-400">
              No activity has been recorded yet. New learning and account events will appear here.
            </p>
          )}
          <p className="text-xs leading-5 text-slate-500">
            This is an academic activity log, not a complete security audit trail. It records key student actions only; it does not track keystrokes or private content.
          </p>
        </section>
      )}
    </div>
  );
};

function RecentActivity({
  events,
  studentsById,
  detailed = false,
}: {
  events: AcademicActivityEvent[];
  studentsById: Map<string, StudentProfile>;
  detailed?: boolean;
}) {
  return (
    <ol className={`mt-3 divide-y divide-slate-800 ${detailed ? 'rounded-xl border border-slate-800 bg-slate-950/40' : ''}`}>
      {events.map((event) => {
        const student = studentsById.get(event.actorUid);
        return (
          <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4" key={event.id}>
            <div className="min-w-0">
              <p className="text-sm text-slate-200">{eventDescription(event)}</p>
              <p className="mt-1 truncate text-xs text-slate-400">
                {student?.displayName || 'Student'}{student?.email ? ` · ${student.email}` : ` · ${event.actorUid}`}
              </p>
            </div>
            <time className="shrink-0 text-xs text-slate-500">{formatDate(event.createdAt?.seconds * 1000)}</time>
          </li>
        );
      })}
      {detailed && events.length === 0 && <li className="p-5 text-sm text-slate-400">No activity recorded yet.</li>}
    </ol>
  );
}

function ResultTable({
  results,
  studentsById,
}: {
  results: AdminResult[];
  studentsById: Map<string, StudentProfile>;
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase text-slate-400">
          <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Assessment</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Result</th><th className="px-4 py-3">Submitted</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950/50">
          {results.map((result) => (
            <tr key={result.id}>
              <td className="px-4 py-3"><span className="block text-white">{studentsById.get(result.userId)?.displayName || result.userId}</span><span className="text-xs text-slate-500">{studentsById.get(result.userId)?.email}</span></td>
              <td className="px-4 py-3 text-slate-300">{result.type === 'stage_test' ? `Stage ${result.stageId ?? '—'} test` : 'Degree defense'}</td>
              <td className="px-4 py-3 text-slate-300">{result.courseName}</td>
              <td className="px-4 py-3 font-mono text-slate-200">{result.score}/{result.totalQuestions} · {result.percentage}%</td>
              <td className={`px-4 py-3 text-xs font-semibold ${result.passed ? 'text-emerald-300' : 'text-rose-300'}`}>{result.passed ? 'Passed' : 'Not passed'}</td>
              <td className="px-4 py-3 text-xs text-slate-400">{formatDate(result.timestamp)}</td>
            </tr>
          ))}
          {results.length === 0 && (
            <tr><td className="px-4 py-8 text-center text-slate-400" colSpan={6}>No submitted assessment results are available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
