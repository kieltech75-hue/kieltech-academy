import React, { useState } from 'react';
import { Stage } from '../types/stages';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Terminal,
  AlertTriangle,
  Play,
  HelpCircle,
  Code2,
  FolderGit2,
  BookOpen,
  Copy,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { executePython, ExecutionResult } from '../utils/pythonRunner';

interface StageDetailViewProps {
  stage: Stage;
  stagesCount: number;
  isCompleted: boolean;
  onToggleComplete: (stageId: number) => void;
  onSelectStage: (stageId: number) => void;
  onBackToRoadmap: () => void;
  onOpenRunnerWithCode: (code: string) => void;
}

export const StageDetailView: React.FC<StageDetailViewProps> = ({
  stage,
  stagesCount,
  isCompleted,
  onToggleComplete,
  onSelectStage,
  onBackToRoadmap,
  onOpenRunnerWithCode,
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'gotchas' | 'quiz' | 'challenge' | 'project'>('modules');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(stage.topics[0]?.id || '');
  const [snippetOutputs, setSnippetOutputs] = useState<Record<string, ExecutionResult>>({});
  const [runningSnippet, setRunningSnippet] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  // Challenge state
  const [challengeCode, setChallengeCode] = useState<string>(stage.challenge.starterCode);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHintIndex, setShowHintIndex] = useState<number>(-1);
  const [challengeOutput, setChallengeOutput] = useState<ExecutionResult | null>(null);
  const [isRunningChallenge, setIsRunningChallenge] = useState<boolean>(false);

  // Copy helper
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleRunSnippet = async (snippetTitle: string, code: string) => {
    setRunningSnippet(snippetTitle);
    try {
      const res = await executePython(code);
      setSnippetOutputs((prev) => ({ ...prev, [snippetTitle]: res }));
    } finally {
      setRunningSnippet(null);
    }
  };

  const handleRunChallenge = async () => {
    setIsRunningChallenge(true);
    try {
      const res = await executePython(challengeCode);
      setChallengeOutput(res);
    } finally {
      setIsRunningChallenge(false);
    }
  };

  const activeTopic = stage.topics.find((t) => t.id === selectedTopicId) || stage.topics[0];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Navigation breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <button
          onClick={onBackToRoadmap}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Stages Roadmap</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Quick jump prev/next stage */}
          {stage.id > 1 && (
            <button
              onClick={() => onSelectStage(stage.id - 1)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
            >
              ← Stage {stage.id - 1 < 10 ? `0${stage.id - 1}` : stage.id - 1}
            </button>
          )}

          <button
            onClick={() => onToggleComplete(stage.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
              isCompleted
                ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{isCompleted ? 'Stage Mastered' : 'Mark as Complete'}</span>
          </button>

          {stage.id < stagesCount && (
            <button
              onClick={() => onSelectStage(stage.id + 1)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
            >
              Stage {stage.id + 1 < 10 ? `0${stage.id + 1}` : stage.id + 1} →
            </button>
          )}
        </div>
      </div>

      {/* Stage Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 font-mono text-slate-950 font-bold text-lg">
            {stage.stageNumber}
          </span>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-amber-400">{stage.level} Stage</span>
              <span aria-hidden="true">·</span>
              <span>Est. {stage.durationHours}</span>
              <span aria-hidden="true">·</span>
              <span>{stage.topics.length} In-Depth Modules</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {stage.title}
            </h1>
          </div>
        </div>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          {stage.summary}
        </p>

        {/* Mental Model Box */}
        <div className="rounded-lg bg-slate-950/80 border border-amber-400/20 p-4 space-y-1">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider font-mono">
            Governing Mental Model
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {stage.mentalModel}
          </p>
        </div>

        {/* Prerequisites */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
          <span className="font-semibold text-slate-300">Prerequisites:</span>
          {stage.prerequisites.map((p, i) => (
            <span key={i} className="text-slate-400">
              {p}{i < stage.prerequisites.length - 1 ? ' ·' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'modules'
              ? 'border-amber-400 text-amber-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Curriculum Modules ({stage.topics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gotchas')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'gotchas'
              ? 'border-amber-400 text-amber-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span>Under The Hood & Gotchas</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'border-amber-400 text-amber-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Knowledge Check ({stage.quizzes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('challenge')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'challenge'
              ? 'border-amber-400 text-amber-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>Hands-on Challenge ({stage.challenge.difficulty})</span>
        </button>

        <button
          onClick={() => setActiveTab('project')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'project'
              ? 'border-amber-400 text-amber-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FolderGit2 className="h-4 w-4" />
          <span>Capstone Project Blueprint</span>
        </button>
      </div>

      {/* Tab 1: Curriculum Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Module Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 px-1">
              Select Module
            </div>
            {stage.topics.map((topic, idx) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  selectedTopicId === topic.id
                    ? 'border-amber-400/60 bg-slate-900 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-400 font-semibold">
                    {stage.stageNumber}.{idx + 1}
                  </span>
                  <span className="text-[11px] text-slate-400">{topic.codeSnippets.length} snippets</span>
                </div>
                <div className="font-semibold text-sm mt-1">{topic.title}</div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{topic.summary}</p>
              </button>
            ))}
          </div>

          {/* Module Detailed Content */}
          <div className="lg:col-span-8 space-y-6">
            {activeTopic && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
                <div>
                  <div className="text-xs font-mono text-amber-400 font-semibold uppercase">
                    Module Overview
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">{activeTopic.title}</h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">{activeTopic.summary}</p>
                </div>

                {/* Key Concepts List */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Key Concepts to Internalize
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                    {activeTopic.concepts.map((concept, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-amber-400 font-mono mt-0.5">•</span>
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Runnable Code Snippets */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Interactive Runnable Snippets
                  </div>

                  {activeTopic.codeSnippets.map((snippet, sIdx) => {
                    const output = snippetOutputs[snippet.title];
                    const isRunning = runningSnippet === snippet.title;

                    return (
                      <div
                        key={sIdx}
                        className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden space-y-0"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-900/80">
                          <div>
                            <div className="text-xs font-bold text-white">{snippet.title}</div>
                            <div className="text-[11px] text-slate-400">{snippet.description}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(snippet.code, snippet.title)}
                              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                              title="Copy code"
                            >
                              {copiedSnippet === snippet.title ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => onOpenRunnerWithCode(snippet.code)}
                              className="text-[11px] font-medium text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                              REPL Editor
                            </button>

                            <button
                              onClick={() => handleRunSnippet(snippet.title, snippet.code)}
                              disabled={isRunning}
                              className="flex items-center gap-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1 rounded transition-colors shadow-xs"
                            >
                              <Play className="h-3 w-3 fill-slate-950" />
                              <span>{isRunning ? 'Running...' : 'Run Here'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Code Display */}
                        <div className="p-4 font-mono text-xs overflow-x-auto text-slate-200 bg-slate-950">
                          <pre className="whitespace-pre">{snippet.code}</pre>
                        </div>

                        {/* Interactive Execution Output */}
                        {output && (
                          <div className="border-t border-slate-800 bg-slate-900/90 p-4 space-y-1 font-mono text-xs">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="text-emerald-400 font-semibold">STDOUT Output</span>
                              <span className="tabular-nums">Executed in {output.executionTimeMs}ms ({output.engine})</span>
                            </div>
                            {output.error ? (
                              <div className="text-rose-400 whitespace-pre-wrap">{output.error}</div>
                            ) : (
                              <div className="text-emerald-300 whitespace-pre-wrap">{output.output}</div>
                            )}
                          </div>
                        )}

                        <div className="border-t border-slate-800/80 px-4 py-2.5 bg-slate-900/40 text-xs text-slate-400">
                          <span className="font-semibold text-slate-300">Explanation: </span>
                          {snippet.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Gotchas & Under The Hood */}
      {activeTab === 'gotchas' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
            <h3 className="text-lg font-bold text-white">Under The Hood: Common Pitfalls & CPython Nuances</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Many runtime bugs arise from misunderstandings of how CPython manages memory references,
              default parameters, and scope bindings. Compare common anti-patterns with idiomatic patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {stage.topics
              .filter((t) => t.gotcha)
              .map((topic, gIdx) => {
                const gotcha = topic.gotcha!;
                return (
                  <div
                    key={gIdx}
                    className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden space-y-4 p-6"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                      <h4 className="text-base font-bold text-white">{gotcha.title}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Bad pattern */}
                      <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-4 space-y-2 font-mono text-xs">
                        <div className="text-rose-400 font-bold uppercase tracking-wider text-[11px] font-sans flex items-center justify-between">
                          <span>Anti-Pattern / Buggy Code</span>
                          <span>❌ Common Trap</span>
                        </div>
                        <pre className="text-rose-200 overflow-x-auto whitespace-pre leading-relaxed">
                          {gotcha.badCode}
                        </pre>
                      </div>

                      {/* Idiomatic pattern */}
                      <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4 space-y-2 font-mono text-xs">
                        <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] font-sans flex items-center justify-between">
                          <span>Idiomatic Pythonic Fix</span>
                          <span>✅ Safe & Fast</span>
                        </div>
                        <pre className="text-emerald-200 overflow-x-auto whitespace-pre leading-relaxed">
                          {gotcha.goodCode}
                        </pre>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      <span className="font-semibold text-amber-400">Why this happens: </span>
                      {gotcha.explanation}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab 3: Knowledge Check / Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
            <h3 className="text-lg font-bold text-white">Stage {stage.stageNumber} Knowledge Check</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Test your understanding of the mental models and core semantics taught in this stage.
            </p>
          </div>

          <div className="space-y-6">
            {stage.quizzes.map((q, qIndex) => {
              const selectedOption = selectedAnswers[q.id];
              const isAnswered = selectedOption !== undefined;
              const isCorrect = selectedOption === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-mono font-semibold text-amber-400 uppercase">
                      Question {qIndex + 1} of {stage.quizzes.length}
                    </span>
                    {isAnswered && (
                      <span
                        className={`text-xs font-semibold ${
                          isCorrect ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isCorrect ? '✓ Correct' : '✕ Review Explanation'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                    {q.question}
                  </p>

                  {q.code && (
                    <div className="rounded-lg bg-slate-950 p-3 font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto">
                      <pre>{q.code}</pre>
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-2.5 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedOption === optIndex;
                      const isRightOption = optIndex === q.correctIndex;

                      let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                      if (isAnswered) {
                        if (isRightOption) {
                          btnStyle = 'border-emerald-600 bg-emerald-950/30 text-emerald-200 font-medium';
                        } else if (isOptionSelected) {
                          btnStyle = 'border-rose-600 bg-rose-950/30 text-rose-200 font-medium';
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => {
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIndex }));
                          }}
                          className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-colors ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-slate-400">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation upon answering */}
                  {isAnswered && (
                    <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="font-semibold text-amber-400">
                        Explanation:
                      </div>
                      <p>{q.options[q.correctIndex].explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Hands-on Challenge */}
      {activeTab === 'challenge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Challenge Description */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-amber-400 uppercase">
                  Coding Challenge
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {stage.challenge.difficulty} Difficulty
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">{stage.challenge.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {stage.challenge.description}
              </p>

              {/* Hints */}
              {stage.challenge.hints.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase font-mono">
                    Progressive Hints
                  </div>
                  {stage.challenge.hints.map((hint, hIdx) => (
                    <div key={hIdx}>
                      {showHintIndex >= hIdx ? (
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-amber-300/90">
                          <span className="font-semibold">Hint {hIdx + 1}: </span>
                          {hint}
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowHintIndex(hIdx)}
                          className="text-xs text-amber-400 hover:text-amber-300 underline"
                        >
                          Reveal Hint {hIdx + 1}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Solution reveal */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{showSolution ? 'Hide Reference Solution' : 'View Reference Solution'}</span>
                </button>

                {showSolution && (
                  <div className="mt-3 rounded-lg bg-slate-950 p-3.5 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                    <pre className="whitespace-pre">{stage.challenge.solutionCode}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Editor & Tester */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-900">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">solution.py</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChallengeCode(stage.challenge.starterCode)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
                  >
                    Reset Starter Code
                  </button>

                  <button
                    onClick={handleRunChallenge}
                    disabled={isRunningChallenge}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 px-4 py-1.5 text-xs font-bold text-slate-950 transition-colors shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5 fill-slate-950" />
                    <span>{isRunningChallenge ? 'Running...' : 'Run & Test'}</span>
                  </button>
                </div>
              </div>

              {/* Code Area */}
              <textarea
                value={challengeCode}
                onChange={(e) => setChallengeCode(e.target.value)}
                rows={12}
                className="w-full bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-200 focus:outline-none resize-y selection:bg-amber-400/20"
                spellCheck={false}
              />

              {/* Execution Console */}
              {challengeOutput && (
                <div className="border-t border-slate-800 bg-slate-900/90 p-4 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="text-emerald-400 font-semibold">Test Execution Results</span>
                    <span className="tabular-nums">Time: {challengeOutput.executionTimeMs}ms</span>
                  </div>
                  {challengeOutput.error ? (
                    <div className="text-rose-400 whitespace-pre-wrap">{challengeOutput.error}</div>
                  ) : (
                    <div className="text-emerald-300 whitespace-pre-wrap">{challengeOutput.output}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Capstone Project Blueprint */}
      {activeTab === 'project' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-semibold text-amber-400 uppercase">
                Stage {stage.stageNumber} Capstone Project
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Difficulty: {stage.project.difficulty}</span>
                <span aria-hidden="true">·</span>
                <span>Time: {stage.project.timeEstimate}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white">{stage.project.title}</h3>
            <p className="text-xs font-medium text-amber-300/80 italic">{stage.project.subtitle}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{stage.project.description}</p>

            {/* Architecture specifications */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Architectural Requirements
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stage.project.architecture.map((arch, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-mono font-bold">{aIdx + 1}.</span>
                    <span>{arch}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Learned */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Skills Validated
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {stage.project.skillsLearned.map((s, idx) => (
                  <span key={idx} className="text-slate-300">
                    • {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Starter Code */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Starter Scaffold Code
                </span>
                <button
                  onClick={() => onOpenRunnerWithCode(stage.project.starterCode)}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Open Scaffold in REPL</span>
                </button>
              </div>

              <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                <pre className="whitespace-pre">{stage.project.starterCode}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
