import React, { useState, useEffect, useRef } from 'react';
import { CourseStage, TestResultRecord } from '../types/curriculum';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  ArrowRight, 
  Sparkles,
  Timer,
  Clock
} from 'lucide-react';
import { IncompleteSubmissionModal } from './IncompleteSubmissionModal';

interface StageTestViewProps {
  courseId: string;
  courseName: string;
  stage: CourseStage;
  onSubmitResult: (record: TestResultRecord) => void;
  onReturnToStage: () => void;
}

export const StageTestView: React.FC<StageTestViewProps> = ({
  courseId,
  courseName,
  stage,
  onSubmitResult,
  onReturnToStage,
}) => {
  const { midStageTest } = stage;
  const questions = midStageTest.questions;

  // Official Mid-Stage Test: Exactly 30 Minutes (1800s) for 30 Questions
  const TEST_DURATION_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(TEST_DURATION_SECONDS);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [codeAnswers, setCodeAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    questions.forEach((q) => {
      if (q.type === 'coding' && q.starterCode) {
        initial[q.id] = q.starterCode;
      }
    });
    return initial;
  });

  const [submittedResult, setSubmittedResult] = useState<TestResultRecord | null>(null);
  const [isSubmitConfirmationOpen, setIsSubmitConfirmationOpen] = useState(false);
  const submissionStartedRef = useRef(false);

  // References to access up-to-date state inside the timer callback
  const selectedAnswersRef = useRef(selectedAnswers);
  selectedAnswersRef.current = selectedAnswers;
  const codeAnswersRef = useRef(codeAnswers);
  codeAnswersRef.current = codeAnswers;
  const submittedResultRef = useRef(submittedResult);
  submittedResultRef.current = submittedResult;

  const handleSubmit = (autoSubmittedDueToTime = false) => {
    if (submittedResultRef.current || submissionStartedRef.current) return;
    submissionStartedRef.current = true;
    setIsSubmitConfirmationOpen(false);

    let correctCount = 0;
    const currentSelections = selectedAnswersRef.current;
    const currentCode = codeAnswersRef.current;

    const userAnswers = questions.map((q) => {
      const selected = currentSelections[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        selectedOption: selected ?? -1,
        isCorrect: Boolean(isCorrect),
        codeAnswer: currentCode[q.id],
      };
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 70;

    const record: TestResultRecord = {
      id: `test-${Date.now()}`,
      courseId,
      courseName,
      stageId: stage.id,
      stageTitle: stage.title,
      type: 'stage_test',
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      passed,
      timestamp: Date.now(),
      userAnswers,
    };

    if (autoSubmittedDueToTime) {
      setIsTimeUp(true);
    }

    setSubmittedResult(record);
    onSubmitResult(record);
  };

  // Countdown timer effect
  useEffect(() => {
    if (submittedResult) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submittedResult]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submittedResult || isTimeUp) return; // Prevent changing after submission or timeout
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const unansweredQuestionNumbers = questions.reduce<number[]>((unanswered, question, index) => {
    const hasAnswer = question.type === 'coding'
      ? Boolean(codeAnswers[question.id]?.trim() && codeAnswers[question.id] !== question.starterCode)
      : selectedAnswers[question.id] !== undefined;
    if (!hasAnswer) unanswered.push(index + 1);
    return unanswered;
  }, []);

  const requestSubmit = () => {
    if (unansweredQuestionNumbers.length > 0) {
      setIsSubmitConfirmationOpen(true);
      return;
    }
    handleSubmit();
  };

  // Formatting minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = timeLeft > 0 && timeLeft <= 60;
  const isCritical = timeLeft > 0 && timeLeft <= 30;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Test Header Notice with Live Countdown Timer */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Active Assessment Environment · {stage.stageNumber}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                  <Clock className="h-3 w-3 text-amber-400" />
                  <span>30-Minute Timed Test (30 Questions)</span>
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{midStageTest.testTitle}</h1>
              <p className="text-sm text-slate-300">
                {midStageTest.instructions}
              </p>
              <p className="text-xs text-amber-300 font-medium pt-1">
                🔒 Stage teachings are locked. The test will auto-submit when the countdown reaches 00:00.
              </p>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex flex-col items-center md:items-end shrink-0">
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border backdrop-blur-md transition-all shadow-md ${
                submittedResult
                  ? 'border-slate-800 bg-slate-900/80 text-slate-400'
                  : isCritical
                  ? 'border-rose-500/80 bg-rose-950/80 text-rose-300 animate-pulse ring-2 ring-rose-500/50'
                  : isUrgent
                  ? 'border-amber-500/80 bg-amber-950/80 text-amber-300'
                  : 'border-slate-700 bg-slate-900/90 text-slate-200'
              }`}
            >
              <Timer
                className={`h-5 w-5 ${
                  submittedResult
                    ? 'text-slate-500'
                    : isCritical
                    ? 'text-rose-400 animate-bounce'
                    : isUrgent
                    ? 'text-amber-400'
                    : 'text-amber-400'
                }`}
              />
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {submittedResult ? 'Status' : isCritical ? 'Time Warning!' : 'Time Remaining'}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight tabular-nums">
                  {submittedResult ? 'Finished' : formattedTime}
                </div>
              </div>
            </div>
            {!submittedResult && (
              <span className="text-[11px] text-amber-300/80 font-mono mt-1">
                Allocated: 30 min (30 Questions)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Auto-submission alert when timer expired */}
      {isTimeUp && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs text-rose-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>
            <strong>Time has expired!</strong> Your responses have been automatically submitted and evaluated by the system.
          </span>
        </div>
      )}

      {/* Result Card when submitted */}
      {submittedResult && (
        <div
          className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-md shadow-xl animate-fadeIn ${
            submittedResult.passed
              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-100'
              : 'border-rose-500/40 bg-rose-950/40 text-rose-100'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl ${
                  submittedResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {submittedResult.passed ? (
                  <CheckCircle2 className="h-10 w-10" />
                ) : (
                  <XCircle className="h-10 w-10" />
                )}
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Backend Evaluation Result
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  {submittedResult.passed ? 'Stage Milestone Passed!' : 'Need More Practice'}
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  You scored {submittedResult.score} out of {submittedResult.totalQuestions} ({submittedResult.percentage}%).
                  {submittedResult.passed
                    ? ' Great job! This result has been recorded in your Result Portal.'
                    : ' You need 70% to pass. Review explanations below and retry.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onReturnToStage}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Back to Teachings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const userAnswer = selectedAnswers[q.id];
          const isSubmitted = !!submittedResult;
          const isCorrect = isSubmitted && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`rounded-2xl border bg-slate-900/80 p-6 shadow-md transition-colors ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  Question {qIndex + 1} of {questions.length}
                </span>

                {q.topicTag && (
                  <span className="text-xs font-medium text-slate-400">
                    Lesson topic: {q.topicTag}
                  </span>
                )}

                {isSubmitted && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    <span>{isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}</span>
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-3 leading-snug">{q.question}</h3>

              {/* Optional Coding sandbox if question is code-based */}
              {q.type === 'coding' && (
                <div className="mb-4 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden font-mono text-xs">
                  <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2 border-b border-slate-700 text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-amber-400" />
                      <span>Code Workspace</span>
                    </span>
                    {q.hint && <span className="text-slate-400 text-[11px]">Hint: {q.hint}</span>}
                  </div>
                  <textarea
                    rows={5}
                    value={codeAnswers[q.id] || ''}
                    disabled={isSubmitted}
                    onChange={(e) => setCodeAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-full p-4 bg-transparent text-emerald-300 focus:outline-none resize-y font-mono"
                  />
                </div>
              )}

              {/* Options selection */}
              <div className="space-y-2.5">
                {q.options?.map((opt, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  const isRightAnswer = q.correctIndex === optIndex;

                  let optionStyles = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50';

                  if (isSubmitted) {
                    if (isRightAnswer) {
                      optionStyles = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-200 font-semibold';
                    } else if (isSelected && !isRightAnswer) {
                      optionStyles = 'border-rose-500/80 bg-rose-500/10 text-rose-200';
                    } else {
                      optionStyles = 'border-slate-800/60 bg-slate-950/30 text-slate-500';
                    }
                  } else if (isSelected) {
                    optionStyles = 'border-amber-400 bg-amber-500/10 text-white font-medium ring-1 ring-amber-400';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left text-sm transition-all ${optionStyles}`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <div className="flex-1">
                        <div>{opt.text}</div>
                        {isSubmitted && (isRightAnswer || isSelected) && (
                          <div className="text-xs text-slate-400 mt-1 pt-1 border-t border-slate-800/80">
                            {opt.explanation}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit footer */}
      {!submittedResult && (
        <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
          <div className="text-xs text-slate-400">
            {questions.length - unansweredQuestionNumbers.length} of {questions.length} questions answered
          </div>
          <button
            onClick={requestSubmit}
            disabled={isTimeUp || submissionStartedRef.current}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
          >
            <span>Submit Test for Evaluation</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
      {isSubmitConfirmationOpen && unansweredQuestionNumbers.length > 0 && !submittedResult && (
        <IncompleteSubmissionModal
          unansweredQuestionNumbers={unansweredQuestionNumbers}
          timeLeft={timeLeft}
          onCancel={() => setIsSubmitConfirmationOpen(false)}
          onConfirm={() => handleSubmit()}
        />
      )}
    </div>
  );
};
