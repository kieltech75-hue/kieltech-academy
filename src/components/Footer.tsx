import React from 'react';
import { Building2, ShieldCheck, Cookie } from 'lucide-react';
import { KielTechLogo } from './KielTechLogo';

interface FooterProps {
  onBrandClick?: () => void;
  onOpenCookies?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onBrandClick, onOpenCookies }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-6 lg:px-8 text-xs font-mono">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <button
          onClick={onBrandClick}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <KielTechLogo className="h-8 w-8 object-contain shrink-0 group-hover:scale-105 transition-transform" />
          <div>
            <span className="text-sm font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors block">
              KielTech Academy
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              School of Engineering & Computer Science
            </span>
          </div>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1 text-slate-300">
            <Building2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Accredited Academic Standard</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>ABET & ACM Aligned</span>
          </span>
          {onOpenCookies && (
            <>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={onOpenCookies}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer underline decoration-dotted"
              >
                <Cookie className="h-3 w-3 text-amber-400" />
                <span>Cookie Preferences</span>
              </button>
            </>
          )}
        </div>

        <div className="text-slate-500 text-[10px] text-center md:text-right">
          School of Engineering & Computer Science
          <div className="text-slate-600">© 2026 KielTech Academy · All Rights Reserved</div>
        </div>
      </div>
    </footer>
  );
};
