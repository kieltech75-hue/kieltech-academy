import React, { useState } from 'react';
import { Stage } from '../types/stages';
import { CheckCircle2, ArrowRight, Clock, BookOpen, Code, Terminal, ChevronRight } from 'lucide-react';

interface RoadmapViewProps {
  stages: Stage[];
  completedStageIds: number[];
  onToggleComplete: (stageId: number) => void;
  onSelectStage: (stageId: number) => void;
  onOpenRunnerWithCode: (code: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  stages,
  completedStageIds,
  onToggleComplete,
  onSelectStage,
  onOpenRunnerWithCode,
}) => {
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredStages = stages.filter((stage) => {
    if (levelFilter === 'all') return true;
    return stage.level.toLowerCase() === levelFilter.toLowerCase();
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="text-xs font-semibold text-amber-400 font-mono tracking-wider uppercase">
            Sequential Mastery Pathway
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-1 tracking-tight">
            The Python Learning Roadmap
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Each stage builds upon the mental models of the previous. Progress systematically
            from fundamental syntax to underlying runtime mechanics and specialization tracks.
          </p>
        </div>

        {/* Filter controls: functional button tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          {['all', 'beginner', 'intermediate', 'advanced', 'mastery'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                levelFilter === lvl
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Roadmap Stage Cards */}
      <div className="relative space-y-8">
        {/* Subtle connector line */}
        <div className="hidden lg:block absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-amber-400 via-blue-500 to-emerald-400 -z-10" />

        {filteredStages.map((stage) => {
          const isCompleted = completedStageIds.includes(stage.id);
          const firstSnippet = stage.topics[0]?.codeSnippets[0];

          return (
            <div
              key={stage.id}
              className={`relative rounded-xl border transition-all duration-200 ${
                isCompleted
                  ? 'border-emerald-500/40 bg-slate-900/40'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Stage Identity & Metadata */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl font-mono text-xl font-bold transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-amber-400 border border-slate-700'
                        }`}
                      >
                        {stage.stageNumber}
                      </div>
                      <div>
                        {/* Unboxed metadata */}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-slate-200">{stage.level}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="tabular-nums">{stage.durationHours}</span>
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-0.5">{stage.title}</h3>
                      </div>
                    </div>

                    <p className="text-xs text-amber-300/90 font-medium italic">
                      "{stage.tagline}"
                    </p>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {stage.summary}
                    </p>

                    {/* Mental Model Callout */}
                    <div className="rounded-lg bg-slate-950/70 border border-slate-800/80 p-3.5 space-y-1">
                      <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider font-mono">
                        Core Mental Model
                      </div>
                      <p className="text-xs text-slate-300 leading-normal">
                        {stage.mentalModel}
                      </p>
                    </div>

                    {/* Progress Toggle */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => onToggleComplete(stage.id)}
                        className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                          isCompleted
                            ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300 hover:bg-emerald-900/40'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}
                        />
                        <span>{isCompleted ? 'Completed' : 'Mark as Complete'}</span>
                      </button>

                      <button
                        onClick={() => onSelectStage(stage.id)}
                        className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <span>Deep Dive Curriculum</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle Column: Core Modules & Curriculum Breakdown */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Curriculum Modules ({stage.topics.length})
                    </div>

                    <div className="space-y-2.5">
                      {stage.topics.map((topic, idx) => (
                        <div
                          key={topic.id}
                          className="rounded-lg bg-slate-950/50 border border-slate-800/60 p-3 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">
                              {stage.stageNumber}.{idx + 1} {topic.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {topic.summary}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-400">
                            {topic.concepts.slice(0, 2).map((c, i) => (
                              <span key={i} className="text-slate-400">
                                • {c.split(':')[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2">
                      <span>Quiz: {stage.quizzes.length} Questions</span>
                      <span aria-hidden="true">·</span>
                      <span>Challenge: {stage.challenge.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>1 Capstone Project</span>
                    </div>
                  </div>

                  {/* Right Column: Code Preview & Fast Run Affordance */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-400">
                          {firstSnippet ? firstSnippet.title : 'Representative Code'}
                        </span>
                        {firstSnippet && (
                          <button
                            onClick={() => onOpenRunnerWithCode(firstSnippet.code)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                          >
                            <Terminal className="h-3 w-3" />
                            <span>Run in REPL</span>
                          </button>
                        )}
                      </div>

                      <div className="rounded-lg bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed max-h-56">
                        <pre className="text-emerald-400/90 whitespace-pre">
                          {firstSnippet ? firstSnippet.code.slice(0, 320) + (firstSnippet.code.length > 320 ? '\n# ...' : '') : '# Code preview'}
                        </pre>
                      </div>
                    </div>

                    {/* Capstone teaser */}
                    <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-3 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                        Capstone Project
                      </div>
                      <div className="text-xs font-semibold text-white">
                        {stage.project.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {stage.project.subtitle} · Est: {stage.project.timeEstimate}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectStage(stage.id)}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition-colors"
                    >
                      <span>Open Full Stage {stage.stageNumber} Details</span>
                      <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
