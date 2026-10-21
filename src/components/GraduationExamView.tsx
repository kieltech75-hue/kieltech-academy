import React, { useState, useEffect, useRef } from 'react';
import { GraduationExam, TestResultRecord } from '../types/curriculum';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  Timer,
  Clock,
  AlertCircle
} from 'lucide-react';
import { IncompleteSubmissionModal } from './IncompleteSubmissionModal';

interface GraduationExamViewProps {
  courseId: string;
  courseName: string;
  currentStageId: number;
  totalStages: number;
  exam: GraduationExam;
  onSubmitResult: (record: TestResultRecord) => void;
  onBackToCourse: () => void;
  onPromoteToNextStage: () => void;
}

export const GraduationExamView: React.FC<GraduationExamViewProps> = ({
  courseId,
  courseName,
  currentStageId,
  totalStages,
  exam,
  onSubmitResult,
  onBackToCourse,
  onPromoteToNextStage,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedResult, setSubmittedResult] = useState<TestResultRecord | null>(null);
  const [missedTopicsList, setMissedTopicsList] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isSubmitConfirmationOpen, setIsSubmitConfirmationOpen] = useState(false);
  const submissionStartedRef = useRef(false);

  // Official University Examination: Exactly 60 Minutes (3600s) for 60 Questions
  const EXAM_DURATION_SECONDS = 60 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(EXAM_DURATION_SECONDS);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // References to access up-to-date state inside countdown callback
  const selectedAnswersRef = useRef(selectedAnswers);
  selectedAnswersRef.current = selectedAnswers;
  const submittedResultRef = useRef(submittedResult);
  submittedResultRef.current = submittedResult;

  const handleSelectOption = (questionId: string, optIndex: number) => {
    if (submittedResult || isTimeUp) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optIndex }));
  };

  const handleSubmit = (autoSubmittedDueToTime = false) => {
    if (submittedResultRef.current || submissionStartedRef.current) return;
    submissionStartedRef.current = true;
    setIsSubmitConfirmationOpen(false);
    setIsEvaluating(true);

    setTimeout(() => {
      let correct = 0;
      const missedTopics: string[] = [];
      const currentSelected = selectedAnswersRef.current;

      const userAnswers = exam.questions.map((q) => {
        const selected = currentSelected[q.id];
        const isCorrect = q.type === 'multiple_choice' && selected === q.correctIndex;
        if (isCorrect) {
          correct++;
        } else if (!missedTopics.includes(q.topicTag)) {
          missedTopics.push(q.topicTag);
        }

        return {
          questionId: q.id,
          selectedOption: q.type === 'multiple_choice' ? selected ?? -1 : -1,
          isCorrect: Boolean(isCorrect),
          executionFeedback: isCorrect ? 'Correct curriculum answer.' : 'Incorrect or unsupported answer.',
        };
      });

      const percentage = Math.round((correct / exam.questions.length) * 100);
      const passed = percentage >= exam.passingScore;

      const record: TestResultRecord = {
        id: `grad-${Date.now()}`,
        courseId,
        courseName,
        stageId: currentStageId,
        type: 'graduation_exam',
        score: correct,
        totalQuestions: exam.questions.length,
        percentage,
        passed,
        missedTopics,
        timestamp: Date.now(),
        userAnswers,
      };

      if (autoSubmittedDueToTime) {
        setIsTimeUp(true);
      }

      setMissedTopicsList(missedTopics);
      setSubmittedResult(record);
      setIsEvaluating(false);
      onSubmitResult(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  // Countdown timer effect (60 minutes = 3600 seconds)
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

  const handleRepeatExam = () => {
    submissionStartedRef.current = false;
    setSelectedAnswers({});
    setTimeLeft(EXAM_DURATION_SECONDS);
    setIsTimeUp(false);
    setSubmittedResult(null);
    setMissedTopicsList([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check answering completion
  const mcqQuestions = exam.questions.filter((q) => q.type === 'multiple_choice');
  const totalAnswered = mcqQuestions.filter((q) => selectedAnswers[q.id] !== undefined).length;
  const unansweredQuestionNumbers = exam.questions.reduce<number[]>((unanswered, question, index) => {
    if (question.type === 'multiple_choice' && selectedAnswers[question.id] === undefined) {
      unanswered.push(index + 1);
    }
    return unanswered;
  }, []);

  const requestSubmit = () => {
    if (unansweredQuestionNumbers.length > 0) {
      setIsSubmitConfirmationOpen(true);
      return;
    }
    handleSubmit();
  };

  // Time calculations for 60-minute duration
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = timeLeft > 0 && timeLeft <= 600; // Under 10 minutes
  const isCritical = timeLeft > 0 && timeLeft <= 180; // Under 3 minutes

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Exam Header with Live 60-Minute Countdown Clock */}
      <div className="rounded-2xl border-2 border-purple-500/50 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-6 sm:p-8 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-purple-500/20 text-purple-400 rounded-2xl shrink-0">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-mono font-bold text-purple-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>60-Question Course Graduation Exam</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 border border-purple-500/30 px-2.5 py-1 text-[11px] font-mono text-purple-200">
                  <Clock className="h-3 w-3 text-purple-400" />
                  <span>60-Minute Timed Exam</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {exam.title}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed pt-1">
                {exam.instructions}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-2">
                <span>Course: <strong className="text-white">{courseName}</strong></span>
                <span>·</span>
                <span>Total Questions: <strong className="text-amber-400">{exam.questions.length} Multiple Choice</strong></span>
                <span>·</span>
                <span>Passing Threshold: <strong className="text-emerald-400">{exam.passingScore}%</strong></span>
              </div>
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
                  : 'border-purple-500/40 bg-purple-950/60 text-purple-200'
              }`}
            >
              <Timer
                className={`h-5 w-5 ${
                  submittedResult
                    ? 'text-slate-500'
                    : isCritical
                    ? 'text-rose-400 animate-bounce'
                    : 'text-purple-400'
                }`}
              />
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {submittedResult ? 'Status' : isCritical ? 'Final Minutes!' : 'Defense Time Remaining'}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight tabular-nums">
                  {submittedResult ? 'Submitted' : formattedTime}
                </div>
              </div>
            </div>
            {!submittedResult && (
              <span className="text-[11px] text-purple-300/80 font-mono mt-1">
                Allocated: 60 min (60 Questions)
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
            <strong>Time has expired!</strong> The 60-minute examination window has concluded and your answers have been submitted for scoring.
          </span>
        </div>
      )}

      {/* GRADUATION OUTCOME HANDLER:
          If user passes -> Congratulate & promote
          If user fails -> Personalized message indicating specific topics missed + 'Return to Learning' button navigating back to teaching modules */}
      {submittedResult && (
        <div
          className={`rounded-2xl border p-6 sm:p-8 shadow-2xl backdrop-blur-md animate-fadeIn ${
            submittedResult.passed
              ? 'border-emerald-500/50 bg-emerald-950/50'
              : 'border-rose-500/50 bg-rose-950/50'
          }`}
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="flex items-start gap-5">
                <div
                  className={`p-4 rounded-2xl shrink-0 ${
                    submittedResult.passed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {submittedResult.passed ? (
                    <Award className="h-12 w-12" />
                  ) : (
                    <AlertTriangle className="h-12 w-12" />
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Course exam results
                  </span>

                  {submittedResult.passed ? (
                    <>
                      <h2 className="text-2xl font-extrabold text-emerald-300">
                        🎉 Congratulations! You passed the course exam!
                      </h2>
                      <p className="text-sm text-slate-200 max-w-xl leading-relaxed">
                        Outstanding achievement! You scored <strong>{submittedResult.score} / {submittedResult.totalQuestions} ({submittedResult.percentage}%)</strong> and demonstrated strong understanding of the course material. 
                        {currentStageId < totalStages
                          ? ' You are officially certified and promoted to the next stage in your engineering curriculum!'
                          : ' You have completed all curriculum stages for this discipline with honors!'}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-extrabold text-rose-300">
                        Course passing score not reached
                      </h2>
                      <p className="text-sm text-slate-200 max-w-xl leading-relaxed">
                        You scored <strong>{submittedResult.percentage}%</strong> ({submittedResult.score} of {submittedResult.totalQuestions} questions correct). 
                        The graduation passing threshold is <strong>{exam.passingScore}%</strong>.
                        Review the topics listed below, then try the exam again.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {submittedResult.passed ? (
                  <>
                    <button
                      onClick={onBackToCourse}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors cursor-pointer"
                    >
                      View Curriculum
                    </button>
                    {currentStageId < totalStages && (
                      <button
                        onClick={onPromoteToNextStage}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-400/20 cursor-pointer"
                      >
                        <span>Promote to Stage 0{currentStageId + 1}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {/* Return to Learning Button navigating back to specific teaching modules */}
                    <button
                      onClick={onBackToCourse}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-400/20 cursor-pointer"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Return to Learning Modules</span>
                    </button>
                    <button
                      onClick={handleRepeatExam}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Repeat Exam</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* If Failed: Personalized breakdown of specific topics missed */}
            {!submittedResult.passed && missedTopicsList.length > 0 && (
              <div className="mt-4 pt-6 border-t border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Personalized Academic Diagnostic: {missedTopicsList.length} Specific Topics Missed</span>
                </div>
                <p className="text-xs text-slate-300">
                  Based on your answers, you missed questions in the following specific syllabus topics. Click <strong>"Return to Learning Modules"</strong> to review these lessons before repeating the examination:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                  {missedTopicsList.map((topic, tIdx) => (
                    <div
                      key={tIdx}
                      className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/30 bg-rose-950/30 text-xs font-semibold text-rose-200"
                    >
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 1: ARCHITECTURAL MULTIPLE CHOICE QUESTIONS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-mono text-xs font-bold">
                1
              </span>
              <span>Course Curriculum Assessment (Q1 - Q{mcqQuestions.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose the answer that best matches the lessons from this course.
            </p>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg">
            {mcqQuestions.length} Questions
          </span>
        </div>

        {mcqQuestions.map((q, idx) => {
          const userAnswer = selectedAnswers[q.id];
          const isSubmitted = !!submittedResult;
          const isCorrect = isSubmitted && userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`rounded-2xl border bg-slate-900/80 p-6 shadow-md transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-rose-500/40 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-lg">
                  Question {idx + 1} of {exam.questions.length}
                </span>

                {q.topicTag && (
                  <span className="text-xs font-medium text-slate-400">
                    Lesson topic: {q.topicTag}
                  </span>
                )}

                {isSubmitted && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
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

              <h3 className="text-base font-bold text-white mb-4 leading-snug">{q.question}</h3>

              {/* Options */}
              <div className="space-y-2">
                {q.options?.map((opt, optIndex) => {
                  const isSelected = userAnswer === optIndex;
                  const isRightAnswer = q.correctIndex === optIndex;

                  let optStyles = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40';

                  if (isSubmitted) {
                    if (isRightAnswer) {
                      optStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-200 font-semibold';
                    } else if (isSelected && !isRightAnswer) {
                      optStyles = 'border-rose-500 bg-rose-500/10 text-rose-200';
                    } else {
                      optStyles = 'border-slate-800/50 bg-slate-950/20 text-slate-500';
                    }
                  } else if (isSelected) {
                    optStyles = 'border-purple-400 bg-purple-500/10 text-white font-medium ring-1 ring-purple-400';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all ${optStyles}`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold ${
                          isSelected ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <div className="flex-1">
                        <div>{opt.text}</div>
                        {isSubmitted && (isRightAnswer || isSelected) && (
                          <div className="text-xs text-slate-400 mt-1.5 pt-1.5 border-t border-slate-800/80">
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

      {/* Examination Submit Footer */}
      {!submittedResult && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs text-slate-400">
              Answered <strong className="text-white">{totalAnswered}</strong> of {mcqQuestions.length} multiple-choice questions
            </div>
            <div className="text-[11px] text-amber-400 font-mono">
              Unanswered questions are scored as incorrect.
            </div>
          </div>

          <button
            onClick={requestSubmit}
            disabled={isEvaluating || submissionStartedRef.current}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-extrabold transition-all shadow-lg ${
              !isEvaluating && !submissionStartedRef.current
                ? 'bg-purple-500 hover:bg-purple-400 text-white cursor-pointer shadow-purple-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isEvaluating ? (
              <span>Scoring answers...</span>
            ) : (
              <>
                <span>Submit {exam.questions.length}-Question Graduation Exam</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
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
