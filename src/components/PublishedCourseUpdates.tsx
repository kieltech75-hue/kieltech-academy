import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { AlertCircle, Bell, BookOpen, CheckCircle2, ExternalLink } from 'lucide-react';
import { db } from '../lib/firebase';
import { PublishedCurriculumUpdate } from '../types/curriculumUpdates';

interface PublishedCourseUpdatesProps {
  courseId: string;
  stageId: number;
  userId?: string;
  onNavigateToStage: (stageId: number) => void;
}

export const PublishedCourseUpdates: React.FC<PublishedCourseUpdatesProps> = ({
  courseId,
  stageId,
  userId,
  onNavigateToStage,
}) => {
  const [updates, setUpdates] = useState<PublishedCurriculumUpdate[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, Record<number, number>>>({});

  useEffect(() => {
    if (!userId) {
      setUpdates([]);
      setSeenIds(new Set());
      return;
    }

    const updatesQuery = query(
      collection(db, 'publishedCurriculumUpdates'),
      where('courseId', '==', courseId),
    );
    const unsubscribeUpdates = onSnapshot(
      updatesQuery,
      (snapshot) => {
        setUpdates(snapshot.docs.map((updateDoc) => ({
          ...updateDoc.data(),
          id: updateDoc.id,
        } as PublishedCurriculumUpdate)).sort(
          (first, second) => second.publishedAt.localeCompare(first.publishedAt),
        ));
        setError(null);
      },
      (snapshotError) => {
        console.error('Could not load published course updates:', snapshotError);
        setError(`Could not load approved course updates: ${snapshotError.message}`);
      },
    );
    const unsubscribeSeen = onSnapshot(
      collection(db, 'users', userId, 'curriculumNotices'),
      (snapshot) => setSeenIds(new Set(snapshot.docs.map((notice) => notice.id))),
      (snapshotError) => {
        console.error('Could not load course update notice status:', snapshotError);
        setError(`Could not load course update notice status: ${snapshotError.message}`);
      },
    );

    return () => {
      unsubscribeUpdates();
      unsubscribeSeen();
    };
  }, [courseId, userId]);

  const unreadUpdates = useMemo(
    () => updates.filter((update) => !seenIds.has(update.id)),
    [updates, seenIds],
  );
  const stageUpdates = updates.filter((update) => update.stageId === stageId);

  const markSeen = async (updateId: string) => {
    if (!userId) return;
    setMarkingId(updateId);
    setError(null);
    try {
      await setDoc(
        doc(db, 'users', userId, 'curriculumNotices', updateId),
        { updateId, seenAt: new Date().toISOString() },
        { merge: true },
      );
    } catch (markError) {
      console.error('Could not mark curriculum update as reviewed:', markError);
      setError(markError instanceof Error ? markError.message : 'Could not save this notice status.');
    } finally {
      setMarkingId(null);
    }
  };

  if (!userId) return null;

  return (
    <div className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-200" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {unreadUpdates.length > 0 && (
        <section aria-label="New course knowledge" className="rounded-xl border border-sky-500/30 bg-sky-950/30 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Bell aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">New course knowledge</p>
                <p className="mt-1 text-sm leading-6 text-slate-200">
                  {unreadUpdates.length} reviewed update{unreadUpdates.length === 1 ? '' : 's'} for this course.
                  Latest: <strong>{unreadUpdates[0].title}</strong>
                </p>
              </div>
            </div>
            <button
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-300"
              onClick={() => onNavigateToStage(unreadUpdates[0].stageId)}
              type="button"
            >
              <BookOpen className="h-4 w-4" /> View Stage {unreadUpdates[0].stageId}
            </button>
          </div>
        </section>
      )}

      {stageUpdates.length > 0 && (
        <section aria-label="Approved curriculum updates for this stage" className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">Reviewed course updates</p>
            <h2 className="mt-1 text-2xl font-bold text-white">New course knowledge</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              These original lessons were reviewed before publication. Online references are linked for further reading.
            </p>
          </div>

          {stageUpdates.map((update) => (
            <article className="space-y-5 rounded-2xl border border-sky-500/20 bg-slate-900/70 p-5 sm:p-6" key={update.id}>
              <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs text-sky-300">
                    Published {new Date(update.publishedAt).toLocaleDateString()} · Stage {update.stageId}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">{update.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{update.summary}</p>
                </div>
                <button
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-sky-500/30 px-3 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/10 disabled:opacity-60"
                  disabled={seenIds.has(update.id) || markingId === update.id}
                  onClick={() => markSeen(update.id)}
                  type="button"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {seenIds.has(update.id) ? 'Reviewed' : markingId === update.id ? 'Saving…' : 'Mark as reviewed'}
                </button>
              </header>

              <section className="space-y-2">
                <h4 className="font-semibold text-white">What this technology is</h4>
                <p className="text-sm leading-7 text-slate-300">{update.content.meaning}</p>
              </section>

              {update.content.prerequisites.length > 0 && (
                <section className="space-y-2">
                  <h4 className="font-semibold text-white">Prerequisites</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                    {update.content.prerequisites.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
                  </ul>
                </section>
              )}

              {update.content.basics.length > 0 && (
                <section className="space-y-2">
                  <h4 className="font-semibold text-white">Basic knowledge</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                    {update.content.basics.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
                  </ul>
                </section>
              )}

              <section className="space-y-4">
                <h4 className="font-semibold text-white">Gradual lessons</h4>
                {update.content.lessons.map((lesson, lessonIndex) => (
                  <article className="space-y-3 border-l-2 border-sky-500/40 pl-4" key={`${lessonIndex}-${lesson.title}`}>
                    <div>
                      <h5 className="font-semibold text-sky-100">{lesson.title}</h5>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{lesson.explanation}</p>
                    </div>
                    {lesson.examples.slice(0, 2).map((example, exampleIndex) => (
                      <div className="overflow-hidden rounded-xl border border-slate-800" key={exampleIndex}>
                        <div className="border-b border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300">
                          Worked example {exampleIndex + 1}
                        </div>
                        <pre className="overflow-x-auto bg-slate-950/70 p-4 text-xs leading-6 text-emerald-200"><code>{example.code}</code></pre>
                        <p className="px-4 py-3 text-sm leading-6 text-slate-300">{example.explanation}</p>
                      </div>
                    ))}
                  </article>
                ))}
              </section>

              {update.content.advanced.length > 0 && (
                <section className="space-y-2">
                  <h4 className="font-semibold text-white">Upgrading your knowledge</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                    {update.content.advanced.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
                  </ul>
                </section>
              )}

              {update.content.extras.length > 0 && (
                <section className="space-y-2">
                  <h4 className="font-semibold text-white">Extra lessons and real-world applications</h4>
                  <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
                    {update.content.extras.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
                  </ul>
                </section>
              )}

              <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-950/10 p-4">
                <div>
                  <h4 className="font-semibold text-white">Knowledge check</h4>
                  <p className="mt-1 text-xs text-slate-400">Practice questions are based on this reviewed update and do not change your official exam result.</p>
                </div>
                {update.content.assessment.map((question, questionIndex) => {
                  const selectedOption = practiceAnswers[update.id]?.[questionIndex];
                  const isAnswered = selectedOption !== undefined;
                  return (
                    <article className="space-y-2 border-t border-slate-800 pt-3" key={`${questionIndex}-${question.question}`}>
                      <h5 className="text-sm font-medium text-slate-100">{questionIndex + 1}. {question.question}</h5>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {question.options.map((option, optionIndex) => {
                          const isCorrect = optionIndex === question.correctIndex;
                          const isSelected = selectedOption === optionIndex;
                          const resultStyles = isAnswered
                            ? isCorrect
                              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                              : isSelected
                                ? 'border-rose-500/40 bg-rose-950/30 text-rose-200'
                                : 'border-slate-800 text-slate-500'
                            : 'border-slate-700 text-slate-300 hover:border-amber-400/60 hover:bg-slate-800';
                          return (
                            <button
                              className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${resultStyles}`}
                              disabled={isAnswered}
                              key={optionIndex}
                              onClick={() => setPracticeAnswers((current) => ({
                                ...current,
                                [update.id]: {
                                  ...current[update.id],
                                  [questionIndex]: optionIndex,
                                },
                              }))}
                              type="button"
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </button>
                          );
                        })}
                      </div>
                      {isAnswered && (
                        <p className={`text-xs leading-5 ${selectedOption === question.correctIndex ? 'text-emerald-200' : 'text-rose-200'}`}>
                          {selectedOption === question.correctIndex ? 'Correct. ' : 'Not quite. '}
                          {question.explanation}
                        </p>
                      )}
                    </article>
                  );
                })}
              </section>

              <section className="space-y-2 border-t border-slate-800 pt-4">
                <h4 className="font-semibold text-white">Online source examples</h4>
                {update.content.onlineExamples.map((example) => (
                  <div className="rounded-lg bg-slate-950/60 p-3" key={example.url}>
                    <a className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 underline underline-offset-2" href={example.url} rel="noreferrer" target="_blank">
                      {example.title} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{example.summary}</p>
                    <p className="mt-1 break-all text-[11px] text-slate-500">{example.url}</p>
                  </div>
                ))}
              </section>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};
