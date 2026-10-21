import React, { useState } from 'react';
import { SPECIALIZATION_TRACKS } from '../data/stagesData';
import { SpecializationTrack } from '../types/stages';
import { Briefcase, Terminal, ArrowRight, CheckCircle2, DollarSign, Layers } from 'lucide-react';
import { executePython, ExecutionResult } from '../utils/pythonRunner';

interface SpecializationsViewProps {
  onOpenRunnerWithCode: (code: string) => void;
  onSelectStage: (stageId: number) => void;
}

export const SpecializationsView: React.FC<SpecializationsViewProps> = ({
  onOpenRunnerWithCode,
  onSelectStage,
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(SPECIALIZATION_TRACKS[0].id);
  const [trackResults, setTrackResults] = useState<Record<string, ExecutionResult>>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const activeTrack = SPECIALIZATION_TRACKS.find((t) => t.id === selectedTrackId) || SPECIALIZATION_TRACKS[0];

  const handleRunTrackCode = async (track: SpecializationTrack) => {
    setIsRunning(true);
    try {
      const res = await executePython(track.exampleCode);
      setTrackResults((prev) => ({ ...prev, [track.id]: res }));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono uppercase tracking-wider">
          <Briefcase className="h-4 w-4" />
          <span>Stage 06 Career Specializations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Applied Real-World Python Tracks
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Python powers diverse industries. Once you master Stages 01 to 05, pick your target career
          specialization to build industry-grade projects and high-value domain expertise.
        </p>
      </div>

      {/* Track Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SPECIALIZATION_TRACKS.map((track) => {
          const isSelected = selectedTrackId === track.id;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrackId(track.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-amber-400 bg-slate-900/90 shadow-md ring-1 ring-amber-400/40'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
              }`}
            >
              <div className="text-[11px] font-mono font-semibold text-amber-400 uppercase">
                {track.role.split('/')[0]}
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{track.title}</h3>
              <div className="text-xs text-slate-400 mt-2 font-mono tabular-nums">
                {track.salaryRange}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Track Detailed Showcase */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Track Profile & Requirements */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-mono">
                <span>Target Role: {activeTrack.role}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activeTrack.salaryRange}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">{activeTrack.title}</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {activeTrack.description}
              </p>
            </div>

            {/* Core Libraries */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Core Industry Libraries & Tooling
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-200">
                {activeTrack.coreLibraries.map((lib, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-amber-300"
                  >
                    {lib}
                  </span>
                ))}
              </div>
            </div>

            {/* Typical Engineering Tasks */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Typical Engineering Deliverables
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {activeTrack.typicalTasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Pathway */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Recommended Stage Milestones
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {activeTrack.roadmapStages.map((stg, sIdx) => (
                  <span key={sIdx} className="text-slate-300 font-medium">
                    {stg}{sIdx < activeTrack.roadmapStages.length - 1 ? ' ⟶ ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Code Sample */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 bg-slate-900/90">
                <div className="text-xs font-mono text-slate-300 font-semibold">
                  {activeTrack.title} Snippet
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenRunnerWithCode(activeTrack.exampleCode)}
                    className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    Open in REPL
                  </button>

                  <button
                    onClick={() => handleRunTrackCode(activeTrack)}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1 rounded transition-colors shadow-xs"
                  >
                    <Terminal className="h-3 w-3" />
                    <span>{isRunning ? 'Running...' : 'Execute'}</span>
                  </button>
                </div>
              </div>

              {/* Code */}
              <div className="p-4 font-mono text-xs text-slate-200 overflow-x-auto bg-slate-950">
                <pre className="whitespace-pre leading-relaxed">{activeTrack.exampleCode}</pre>
              </div>

              {/* Console Output */}
              {trackResults[activeTrack.id] && (
                <div className="border-t border-slate-800 bg-slate-900/90 p-4 font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="text-emerald-400 font-semibold">Live Output</span>
                    <span className="tabular-nums">Time: {trackResults[activeTrack.id].executionTimeMs}ms</span>
                  </div>
                  <div className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                    {trackResults[activeTrack.id].output}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
