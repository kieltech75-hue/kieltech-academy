import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  GraduationCap,
  List,
  Lock,
} from 'lucide-react';
import { BookmarkedLesson, CourseStage } from '../types/curriculum';
import { getCoreConceptTeachingNotes } from '../data/curriculumTeachingNotes';
import { PublishedCourseUpdates } from './PublishedCourseUpdates';

interface StageTeachingViewProps {
  courseId: string;
  userId?: string;
  onNavigateToStage: (stageId: number) => void;
  courseName: string;
  courseCode?: string;
  department?: string;
  stage: CourseStage;
  totalStages: number;
  isStageTestPassed: boolean;
  hasGraduatedCourse: boolean;
  bookmarkedLessonIds?: string[];
  onToggleBookmark?: (lesson: Omit<BookmarkedLesson, 'savedAt'>) => void;
  onReadyForTest: () => void;
  onReadyToGraduate: () => void;
  onNextStage: () => void;
}

export const StageTeachingView: React.FC<StageTeachingViewProps> = ({
  courseId,
  userId,
  onNavigateToStage,
  courseName,
  courseCode = 'CS-301',
  department = 'Department of Computer Science',
  stage,
  totalStages,
  isStageTestPassed,
  hasGraduatedCourse,
  bookmarkedLessonIds = [],
  onToggleBookmark,
  onReadyForTest,
  onReadyToGraduate,
  onNextStage,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const additionalModules = stage.learningModules ?? [];
  const conceptNotes = getCoreConceptTeachingNotes(courseId, stage);

  const handleCopy = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Could not copy lesson code:', error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <header className="space-y-5 border-b border-slate-800 pb-7">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
          <span>{courseName}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{stage.stageNumber}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-amber-300">
            {courseCode}
          </span>
          <span>{department}</span>
          <span aria-hidden="true">·</span>
          <span>{stage.level}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {stage.durationHours}
          </span>
          {isStageTestPassed && (
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Mid-term passed
            </span>
          )}
          {hasGraduatedCourse && (
            <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-1 text-purple-300">
              <GraduationCap className="h-3.5 w-3.5" />
              Degree defense passed
            </span>
          )}
        </div>

        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-medium text-amber-300">{stage.tagline}</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{stage.title}</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">{stage.summary}</p>
        </div>
      </header>

      <nav aria-label="On this page" className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <List className="h-4 w-4 text-amber-300" />
          On this page
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a className="text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-amber-300" href="#learning-objectives">Core concepts explained</a>
          {stage.codeExamples.length > 0 && (
            <a className="text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-amber-300" href="#worked-examples">Worked examples</a>
          )}
          {stage.gotchas.length > 0 && (
            <a className="text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-amber-300" href="#common-mistakes">Common mistakes</a>
          )}
          <a className="text-slate-300 underline decoration-slate-600 underline-offset-4 hover:text-amber-300" href="#stage-assessment">Stage assessment</a>
        </div>
      </nav>

      <section id="learning-objectives" className="scroll-mt-6 space-y-4">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Lesson notes</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Core concepts explained</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Read each explanation first. The worked examples that follow apply these ideas in {courseName}.
          </p>
        </div>
        <ol className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/60">
          {stage.coreConcepts.map((concept, index) => (
            <li key={`${stage.id}-concept-${index}`} className="flex gap-4 p-4 sm:p-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-300">
                {index + 1}
              </span>
              <div className="max-w-3xl space-y-2">
                <h3 className="text-base font-semibold leading-6 text-white">{concept}</h3>
                <p className="text-sm leading-7 text-slate-300">{conceptNotes[index]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <PublishedCourseUpdates
        courseId={courseId}
        stageId={stage.id}
        userId={userId}
        onNavigateToStage={onNavigateToStage}
      />

      {stage.codeExamples.length > 0 && (
        <section id="worked-examples" className="scroll-mt-6 space-y-5">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Follow along</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Worked examples</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Read the code, compare it with the expected output, and use the explanation to connect it to the lesson.
            </p>
          </div>

          {stage.codeExamples.map((example, index) => {
            const bookmarkId = `stage-${stage.id}-lab-${index}`;
            return (
              <article key={bookmarkId} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 px-4 py-4 sm:px-5">
                  <div className="max-w-3xl">
                    <p className="text-xs font-medium text-amber-300">Example {index + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{example.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{example.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {onToggleBookmark && (
                      <button
                        type="button"
                        onClick={() => onToggleBookmark({
                          id: bookmarkId,
                          type: 'lab_example',
                          courseId: courseCode,
                          courseName,
                          stageId: stage.id,
                          stageTitle: stage.title,
                          title: example.title,
                          category: 'Worked example',
                          description: example.description,
                          codeSnippet: example.code,
                        })}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
                        aria-label={bookmarkedLessonIds.includes(bookmarkId) ? 'Remove bookmark' : 'Bookmark example'}
                      >
                        {bookmarkedLessonIds.includes(bookmarkId)
                          ? <BookmarkCheck className="h-3.5 w-3.5" />
                          : <Bookmark className="h-3.5 w-3.5" />}
                        <span>{bookmarkedLessonIds.includes(bookmarkId) ? 'Saved' : 'Save'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => void handleCopy(example.code, index)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-300"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copiedIndex === index ? 'Copied' : 'Copy code'}
                    </button>
                  </div>
                </header>

                <div className={`grid gap-px bg-slate-800 ${example.output ? 'lg:grid-cols-2' : ''}`}>
                  <div className="min-w-0 bg-slate-950 p-4 sm:p-5">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Code</h4>
                    <pre className="overflow-x-auto whitespace-pre text-sm leading-6 text-slate-200"><code>{example.code}</code></pre>
                  </div>
                  {example.output && (
                    <div className="min-w-0 bg-slate-950 p-4 sm:p-5">
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Expected output</h4>
                      <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-emerald-200"><code>{example.output}</code></pre>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-800 px-4 py-4 sm:px-5">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <BookOpen className="h-4 w-4 text-amber-300" />
                    Explanation
                  </h4>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{example.explanation}</p>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {stage.gotchas.length > 0 && (
        <section id="common-mistakes" className="scroll-mt-6 space-y-5">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">Troubleshooting</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Common mistakes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Compare the problematic approach with the recommended correction, then read why the difference matters.
            </p>
          </div>
          {stage.gotchas.map((gotcha, index) => (
            <article key={`${stage.id}-gotcha-${index}`} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
              <h3 className="text-base font-semibold text-white">{gotcha.title}</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="min-w-0 rounded-lg border border-rose-500/20 bg-rose-950/20 p-3.5">
                  <span className="mb-2 block text-xs font-semibold text-rose-300">Avoid this</span>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-6 text-rose-100"><code>{gotcha.badCode}</code></pre>
                </div>
                <div className="min-w-0 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3.5">
                  <span className="mb-2 block text-xs font-semibold text-emerald-300">Prefer this</span>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-6 text-emerald-100"><code>{gotcha.goodCode}</code></pre>
                </div>
              </div>
              <p className="max-w-3xl text-sm leading-7 text-slate-300">{gotcha.explanation}</p>
            </article>
          ))}
        </section>
      )}

      <section id="stage-assessment" className="scroll-mt-6 space-y-4 border-t border-slate-800 pt-7">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Check your understanding</p>
            <h2 className="mt-1 text-xl font-bold text-white">Stage mid-term assessment</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Take the 30-question assessment on the concepts, examples, and common mistakes covered in this stage. You need 70% to pass.
            </p>
            {isStageTestPassed && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                You passed this stage’s mid-term.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onReadyForTest}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300"
          >
            {isStageTestPassed ? 'Review mid-term result' : 'Begin mid-term'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {isStageTestPassed ? (
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">Assessment unlocked</p>
                <h2 className="mt-1 text-xl font-bold text-white">KielTech Academy Degree Defense</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Take the 60-question course-wide exam for {courseCode}: {courseName}. It covers lesson concepts, examples, and common pitfalls across all four stages.
                </p>
              </div>
              <button
                type="button"
                onClick={onReadyToGraduate}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-purple-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-400"
              >
                Enter degree defense
                <GraduationCap className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 px-1 text-sm text-slate-400">
            <Lock className="h-4 w-4 shrink-0" />
            Pass this stage’s mid-term to unlock the course-wide degree defense.
          </p>
        )}
      </section>

      {additionalModules.length > 0 && isStageTestPassed && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Additional course resources</h2>
          {additionalModules.map((module) => (
            <article key={module.id} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{module.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{module.category} · {module.duration}</p>
                </div>
                {onToggleBookmark && (
                  <button
                    type="button"
                    onClick={() => onToggleBookmark({
                      id: module.id,
                      type: 'curriculum_module',
                      courseId: courseCode,
                      courseName,
                      stageId: stage.id,
                      stageTitle: stage.title,
                      title: module.title,
                      category: module.category,
                      description: module.description,
                    })}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 hover:text-amber-300"
                  >
                    {bookmarkedLessonIds.includes(module.id)
                      ? <BookmarkCheck className="h-3.5 w-3.5" />
                      : <Bookmark className="h-3.5 w-3.5" />}
                    {bookmarkedLessonIds.includes(module.id) ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>
              <p className="text-sm leading-6 text-slate-300">{module.description}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                {module.keyTopics.map((topic) => <li key={topic}>{topic}</li>)}
              </ul>
            </article>
          ))}
        </section>
      )}

      {hasGraduatedCourse && stage.id < totalStages && (
        <section className="flex flex-col gap-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Next in the course</p>
            <h2 className="mt-1 text-lg font-bold text-white">Continue to Stage 0{stage.id + 1}</h2>
            <p className="mt-1 text-sm text-slate-300">You passed the degree defense for this stage.</p>
          </div>
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
          >
            Continue to next stage
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {hasGraduatedCourse && stage.id === totalStages && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-sm text-emerald-200">
          <Award className="h-5 w-5 shrink-0" />
          You have passed the degree defense and completed all stages in this course.
        </div>
      )}
    </div>
  );
};
