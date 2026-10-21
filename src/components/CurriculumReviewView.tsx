import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { AlertCircle, CheckCircle2, ExternalLink, Send, XCircle } from 'lucide-react';
import { COURSES } from '../data/coursesCurriculum';
import { db } from '../lib/firebase';
import {
  CurriculumProposal,
  CurriculumUpdateContent,
} from '../types/curriculumUpdates';

interface CurriculumReviewViewProps {
  adminId: string;
}

interface LessonDraft {
  title: string;
  explanation: string;
  firstCode: string;
  firstExplanation: string;
  secondCode: string;
  secondExplanation: string;
}

interface QuestionDraft {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

interface CurriculumFormDraft {
  stageId: number;
  title: string;
  summary: string;
  meaning: string;
  prerequisites: string;
  basics: string;
  lessons: LessonDraft[];
  assessment: QuestionDraft[];
  advanced: string;
  extras: string;
  onlineExampleTitle: string;
  onlineExampleSummary: string;
}

const emptyLesson = (): LessonDraft => ({
  title: '',
  explanation: '',
  firstCode: '',
  firstExplanation: '',
  secondCode: '',
  secondExplanation: '',
});

function createDraft(proposal?: CurriculumProposal): CurriculumFormDraft {
  return {
    stageId: proposal?.stageId ?? 1,
    title: proposal?.title ?? (proposal ? `New knowledge for ${proposal.courseName}` : ''),
    summary: proposal?.summary ?? '',
    meaning: '',
    prerequisites: '',
    basics: '',
    lessons: [emptyLesson()],
    assessment: [{ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }],
    advanced: '',
    extras: '',
    onlineExampleTitle: proposal?.sourceTitle ?? '',
    onlineExampleSummary: proposal
      ? 'Review the latest material published by the trusted source. This reference informs this proposed lesson; it is not copied course content.'
      : '',
  };
}

function lines(value: string): string[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export const CurriculumReviewView: React.FC<CurriculumReviewViewProps> = ({ adminId }) => {
  const [proposals, setProposals] = useState<CurriculumProposal[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CurriculumFormDraft>(() => createDraft());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const selectedProposal = proposals.find((proposal) => proposal.id === selectedId);
  const functions = useMemo(() => getFunctions(undefined, 'us-central1'), []);

  useEffect(() => {
    const proposalsQuery = query(
      collection(db, 'curriculumProposals'),
      where('status', '==', 'pending'),
    );
    return onSnapshot(
      proposalsQuery,
      (snapshot) => {
        const loaded = snapshot.docs.map((proposalDoc) => ({
          ...proposalDoc.data(),
          id: proposalDoc.id,
        } as CurriculumProposal));
        loaded.sort((first, second) => second.detectedAt.localeCompare(first.detectedAt));
        setProposals(loaded);
        setLoading(false);
        setSelectedId((current) => current && loaded.some((proposal) => proposal.id === current)
          ? current
          : loaded[0]?.id ?? null);
      },
      (snapshotError) => {
        console.error('Could not load curriculum proposals:', snapshotError);
        setError(`Could not load review proposals: ${snapshotError.message}`);
        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    setDraft(createDraft(selectedProposal));
    setError(null);
    setNotice(null);
  }, [selectedProposal?.id]);

  const updateDraft = <K extends keyof CurriculumFormDraft>(key: K, value: CurriculumFormDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateQuestion = (index: number, patch: Partial<QuestionDraft>) => {
    setDraft((current) => ({
      ...current,
      assessment: current.assessment.map((question, questionIndex) => questionIndex === index
        ? { ...question, ...patch }
        : question),
    }));
  };

  const updateLesson = (index: number, key: keyof LessonDraft, value: string) => {
    setDraft((current) => ({
      ...current,
      lessons: current.lessons.map((lesson, lessonIndex) => lessonIndex === index
        ? { ...lesson, [key]: value }
        : lesson),
    }));
  };

  const rejectProposal = async () => {
    if (!selectedProposal) return;
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const reject = httpsCallable<{ proposalId: string }, { rejected: boolean }>(
        functions,
        'rejectCurriculumProposal',
      );
      await reject({ proposalId: selectedProposal.id });
      setNotice('Proposal rejected. No student-facing lesson or exam content was changed.');
    } catch (reviewError) {
      console.error('Could not reject curriculum proposal:', reviewError);
      setError(reviewError instanceof Error ? reviewError.message : 'Could not reject this proposal.');
    } finally {
      setBusy(false);
    }
  };

  const publishProposal = async () => {
    if (!selectedProposal) return;
    setError(null);
    setNotice(null);

    const lessonErrors = draft.lessons.some((lesson) => (
      !lesson.title.trim()
      || !lesson.explanation.trim()
      || !lesson.firstCode.trim()
      || !lesson.firstExplanation.trim()
      || !lesson.secondCode.trim()
      || !lesson.secondExplanation.trim()
    ));
    if (!draft.title.trim() || !draft.summary.trim() || !draft.meaning.trim()
      || !draft.onlineExampleTitle.trim() || !draft.onlineExampleSummary.trim()
      || draft.lessons.length === 0 || lessonErrors
      || draft.assessment.length === 0
      || draft.assessment.some((question) => !question.question.trim()
        || question.options.some((option) => !option.trim())
        || !question.explanation.trim())) {
      setError('Complete the title, summary, language overview, source note, two explained examples per lesson, and at least one answered knowledge-check question before publishing.');
      return;
    }

    const content: CurriculumUpdateContent = {
      meaning: draft.meaning.trim(),
      prerequisites: lines(draft.prerequisites),
      basics: lines(draft.basics),
      lessons: draft.lessons.map((lesson) => ({
        title: lesson.title.trim(),
        explanation: lesson.explanation.trim(),
        examples: [
          { code: lesson.firstCode.trim(), explanation: lesson.firstExplanation.trim() },
          { code: lesson.secondCode.trim(), explanation: lesson.secondExplanation.trim() },
        ],
      })) as CurriculumUpdateContent['lessons'],
      assessment: draft.assessment.map((question) => ({
        ...question,
        question: question.question.trim(),
        options: question.options.map((option) => option.trim()) as QuestionDraft['options'],
        explanation: question.explanation.trim(),
      })),
      advanced: lines(draft.advanced),
      extras: lines(draft.extras),
      onlineExamples: [{
        title: draft.onlineExampleTitle.trim(),
        summary: draft.onlineExampleSummary.trim(),
        url: selectedProposal.sourceUrl,
      }],
    };

    setBusy(true);
    try {
      const publish = httpsCallable(functions, 'publishCurriculumProposal');
      await publish({
        proposalId: selectedProposal.id,
        stageId: draft.stageId,
        title: draft.title.trim(),
        summary: draft.summary.trim(),
        content,
      });
      setNotice('Reviewed curriculum update published. Students in this course can now see the new lesson notice.');
    } catch (publishError) {
      console.error('Could not publish curriculum proposal:', publishError);
      setError(publishError instanceof Error ? publishError.message : 'Could not publish this curriculum update.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-20">
      <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Administrator workspace</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Curriculum source review</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Official sources are checked on a six-month schedule. Source changes create proposals only;
            write and review original lessons here before anything is published to students.
          </p>
          <p className="mt-2 text-xs text-slate-500">Signed in as administrator {adminId}</p>
        </div>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition-colors hover:bg-amber-500/20"
          href="https://github.com/kieltech9-coder/kieltech-academy/actions/workflows/curriculum-refresh.yml"
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4" />
          Check sources in GitHub Actions
        </a>
      </header>
      <p className="text-sm leading-6 text-slate-400">
        Start a manual source check from the GitHub Actions page. Detected changes appear here as review proposals; no lessons or exams are changed automatically.
      </p>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-sm text-rose-200" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm text-emerald-200" role="status">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.5fr)]">
        <aside className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Pending proposals ({proposals.length})</h2>
          {loading && <p className="text-sm text-slate-400">Loading source proposals…</p>}
          {!loading && proposals.length === 0 && (
            <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm leading-6 text-slate-400">
              No pending source changes. A first source check records a baseline; later changes create proposals for review.
            </p>
          )}
          {proposals.map((proposal) => (
            <button
              aria-pressed={proposal.id === selectedId}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${
                proposal.id === selectedId
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
              key={proposal.id}
              onClick={() => setSelectedId(proposal.id)}
              type="button"
            >
              <span className="block text-sm font-semibold text-white">{proposal.courseName}</span>
              <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-400">{proposal.sourceTitle}</span>
              <span className="mt-2 block text-[11px] text-slate-500">
                Detected {new Date(proposal.detectedAt).toLocaleString()}
              </span>
            </button>
          ))}
        </aside>

        <section className="min-w-0 space-y-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
          {selectedProposal ? (
            <>
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Source change · review required</p>
                <h2 className="text-xl font-bold text-white">{selectedProposal.sourceTitle}</h2>
                <p className="text-sm text-slate-400">
                  {selectedProposal.courseName} · checked {new Date(selectedProposal.fetchedAt).toLocaleString()}
                  {selectedProposal.sourcePublishedDate ? ` · source date ${selectedProposal.sourcePublishedDate}` : ''}
                </p>
                <a className="break-all text-sm text-sky-300 underline underline-offset-2" href={selectedProposal.sourceUrl} rel="noreferrer" target="_blank">
                  Open official source
                </a>
                <p className="text-xs leading-5 text-slate-500">
                  The checker stores source metadata and a link, not copied article text. Confirm the reference and author original teaching content.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-medium text-slate-300">
                  Course
                  <select
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                    disabled
                    value={selectedProposal.courseId}
                  >
                    {COURSES.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300">
                  Course stage
                  <select
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                    onChange={(event) => updateDraft('stageId', Number(event.target.value))}
                    value={draft.stageId}
                  >
                    {[1, 2, 3, 4].map((stageId) => <option key={stageId} value={stageId}>Stage {stageId}</option>)}
                  </select>
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300 sm:col-span-2">
                  Student-facing update title
                  <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('title', event.target.value)} value={draft.title} />
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300 sm:col-span-2">
                  Update summary
                  <textarea className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('summary', event.target.value)} value={draft.summary} />
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300 sm:col-span-2">
                  What the language or technology is and where it is used
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('meaning', event.target.value)} value={draft.meaning} />
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300">
                  Prerequisites (one per line)
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('prerequisites', event.target.value)} value={draft.prerequisites} />
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300">
                  Basic knowledge (one concept per line)
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('basics', event.target.value)} value={draft.basics} />
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">Gradual teaching and examples</h3>
                  <button className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800" onClick={() => updateDraft('lessons', [...draft.lessons, emptyLesson()])} type="button">
                    Add lesson
                  </button>
                </div>
                {draft.lessons.map((lesson, index) => (
                  <article className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4" key={index}>
                    <h4 className="text-sm font-semibold text-amber-200">Lesson {index + 1}</h4>
                    <input aria-label={`Lesson ${index + 1} title`} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" onChange={(event) => updateLesson(index, 'title', event.target.value)} placeholder="Lesson title" value={lesson.title} />
                    <textarea aria-label={`Lesson ${index + 1} explanation`} className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" onChange={(event) => updateLesson(index, 'explanation', event.target.value)} placeholder="Explain the concept before showing the examples" value={lesson.explanation} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-300">Example 1</p>
                        <textarea aria-label={`Lesson ${index + 1} example 1 code`} className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-emerald-200" onChange={(event) => updateLesson(index, 'firstCode', event.target.value)} placeholder="Code or worked example" value={lesson.firstCode} />
                        <textarea aria-label={`Lesson ${index + 1} example 1 explanation`} className="min-h-16 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" onChange={(event) => updateLesson(index, 'firstExplanation', event.target.value)} placeholder="Explain the outcome" value={lesson.firstExplanation} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-300">Example 2</p>
                        <textarea aria-label={`Lesson ${index + 1} example 2 code`} className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-emerald-200" onChange={(event) => updateLesson(index, 'secondCode', event.target.value)} placeholder="Code or worked example" value={lesson.secondCode} />
                        <textarea aria-label={`Lesson ${index + 1} example 2 explanation`} className="min-h-16 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white" onChange={(event) => updateLesson(index, 'secondExplanation', event.target.value)} placeholder="Explain the outcome" value={lesson.secondExplanation} />
                      </div>
                    </div>
                    {draft.lessons.length > 1 && (
                      <button className="text-xs text-rose-300 hover:text-rose-200" onClick={() => updateDraft('lessons', draft.lessons.filter((_, lessonIndex) => lessonIndex !== index))} type="button">
                        Remove lesson
                      </button>
                    )}
                  </article>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-medium text-slate-300">
                  Advanced topics (one per line)
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('advanced', event.target.value)} value={draft.advanced} />
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300">
                  Extra lessons and real-world applications (one per line)
                  <textarea className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('extras', event.target.value)} value={draft.extras} />
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300">
                  Trusted online example/reference title
                  <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('onlineExampleTitle', event.target.value)} value={draft.onlineExampleTitle} />
                </label>
                <label className="space-y-1 text-xs font-medium text-slate-300">
                  Original note about the online reference
                  <textarea className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white" onChange={(event) => updateDraft('onlineExampleSummary', event.target.value)} value={draft.onlineExampleSummary} />
                </label>
              </div>

              <section className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Practice and assessment</h3>
                    <p className="mt-1 text-xs text-slate-400">Create knowledge checks based only on the lesson content above.</p>
                  </div>
                  <button className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800" onClick={() => updateDraft('assessment', [...draft.assessment, { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }])} type="button">
                    Add question
                  </button>
                </div>
                {draft.assessment.map((question, index) => (
                  <article className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4" key={index}>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-sky-200">Knowledge check {index + 1}</h4>
                      {draft.assessment.length > 1 && (
                        <button className="text-xs text-rose-300 hover:text-rose-200" onClick={() => updateDraft('assessment', draft.assessment.filter((_, questionIndex) => questionIndex !== index))} type="button">
                          Remove
                        </button>
                      )}
                    </div>
                    <input aria-label={`Question ${index + 1}`} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" onChange={(event) => updateQuestion(index, { question: event.target.value })} placeholder="Question based on the lesson" value={question.question} />
                    <div className="grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <div className="flex items-start gap-2 text-xs text-slate-300" key={optionIndex}>
                          <input aria-label={`Mark option ${String.fromCharCode(65 + optionIndex)} correct`} checked={question.correctIndex === optionIndex} name={`correct-answer-${index}`} onChange={() => updateQuestion(index, { correctIndex: optionIndex })} type="radio" />
                          <label className="w-full">
                            <span>Option {String.fromCharCode(65 + optionIndex)}</span>
                            <input aria-label={`Question ${index + 1} option ${String.fromCharCode(65 + optionIndex)}`} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" onChange={(event) => {
                              const options = [...question.options] as QuestionDraft['options'];
                              options[optionIndex] = event.target.value;
                              updateQuestion(index, { options });
                            }} value={option} />
                          </label>
                        </div>
                      ))}
                    </div>
                    <textarea aria-label={`Question ${index + 1} answer explanation`} className="min-h-16 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" onChange={(event) => updateQuestion(index, { explanation: event.target.value })} placeholder="Explain why the selected answer is correct" value={question.explanation} />
                  </article>
                ))}
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 px-4 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-950/40 disabled:opacity-50" disabled={busy} onClick={rejectProposal} type="button">
                  <XCircle className="h-4 w-4" /> Reject proposal
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-50" disabled={busy} onClick={publishProposal} type="button">
                  <Send className="h-4 w-4" /> Publish reviewed update
                </button>
              </div>
            </>
          ) : (
            <div className="flex min-h-52 items-center justify-center text-center text-sm text-slate-400">
              Select a pending proposal to review its source and author the student-facing lesson.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
