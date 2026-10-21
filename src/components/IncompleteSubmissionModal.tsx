import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface IncompleteSubmissionModalProps {
  unansweredQuestionNumbers: number[];
  timeLeft: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const IncompleteSubmissionModal: React.FC<IncompleteSubmissionModalProps> = ({
  unansweredQuestionNumbers,
  timeLeft,
  onCancel,
  onConfirm,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const questionList = unansweredQuestionNumbers.join(', ');

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="incomplete-submission-title"
        aria-modal="true"
        className="w-full max-w-lg space-y-5 rounded-2xl border border-amber-500/40 bg-slate-900 p-6 text-slate-100 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-amber-500/10 p-2.5 text-amber-300">
            <AlertTriangle aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white" id="incomplete-submission-title">
              Submit with unanswered questions?
            </h2>
            <p className="text-sm leading-6 text-slate-300">
              You still have question{unansweredQuestionNumbers.length === 1 ? '' : 's'} {questionList} unanswered.
              If you submit now, those questions will be marked incorrect.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
          <Clock aria-hidden="true" className="h-4 w-4 text-amber-300" />
          <span>Time remaining: <strong className="font-mono text-white">{formattedTime}</strong></span>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            onClick={onCancel}
            type="button"
          >
            Cancel and keep answering
          </button>
          <button
            className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300"
            onClick={onConfirm}
            type="button"
          >
            Submit anyway
          </button>
        </div>
      </section>
    </div>
  );
};
