import React from 'react';

interface HeroSectionProps {
  completedCount: number;
  totalStages?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  completedCount,
  totalStages = 6,
}) => {
  const percentage = Math.min(100, Math.round((completedCount / totalStages) * 100));

  // Circular progress gauge (radius: 40, circumference: 2 * pi * 40 ≈ 251.327)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Visual Progress Tracker Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* Circular Gauge */}
          <div className="relative flex-shrink-0">
            <svg className="w-28 h-28 sm:w-32 sm:h-32 -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-800/80 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-amber-400 stroke-current transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight tabular-nums">
                {percentage}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest -mt-0.5">
                Done
              </span>
            </div>
          </div>

          {/* Details & Multi-stage segment bar */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Python Learning Progress
                </span>
                <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {completedCount} of {totalStages} Stages Completed
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-400 font-mono">Status</div>
                <div className="text-sm font-semibold text-amber-300">
                  {percentage === 0
                    ? 'Ready to Start'
                    : percentage === 100
                    ? 'All Stages Mastered'
                    : `${totalStages - completedCount} stages remaining`}
                </div>
              </div>
            </div>

            {/* Stage segments */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-full bg-slate-950 p-0.5 border border-slate-800 overflow-hidden flex gap-1.5">
                {Array.from({ length: totalStages }).map((_, index) => {
                  const isStageComplete = index < completedCount;
                  return (
                    <div
                      key={index}
                      className={`flex-1 h-full rounded-full transition-all duration-500 ${
                        isStageComplete
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.35)]'
                          : 'bg-slate-800/80 hover:bg-slate-700/80'
                      }`}
                      title={`Stage 0${index + 1}: ${isStageComplete ? 'Completed' : 'Pending'}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-0.5">
                <span>Stage 01</span>
                <span>Stage 02</span>
                <span>Stage 03</span>
                <span>Stage 04</span>
                <span>Stage 05</span>
                <span>Stage 06</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
