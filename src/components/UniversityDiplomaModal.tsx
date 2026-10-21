import React, { useRef } from 'react';
import { CertificateData } from '../types/curriculum';
import { Award, ShieldCheck, Download, Printer, X, Sparkles, Building2, CheckCircle } from 'lucide-react';
import { KielTechLogo } from './KielTechLogo';

interface UniversityDiplomaModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: CertificateData;
}

export const UniversityDiplomaModal: React.FC<UniversityDiplomaModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-10 my-8 text-slate-100">
        {/* Top actions */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Official University Credential Verification
              </h3>
              <p className="text-xs text-slate-400">
                Accredited Academic Degree Award · Credential ID: {certificate.certificateId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Parchment Diploma Frame */}
        <div
          ref={printRef}
          className="relative bg-gradient-to-b from-stone-900 via-slate-900 to-stone-950 border-4 border-double border-amber-500/60 rounded-xl p-8 sm:p-12 text-center shadow-inner overflow-hidden"
        >
          {/* Subtle watermark background seal */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5">
            <Building2 className="w-96 h-96 text-amber-300" />
          </div>

          {/* Academic Crest / Header */}
          <div className="space-y-2 relative z-10">
            <KielTechLogo className="w-16 h-16 object-contain mb-1" />

            <div className="text-xs font-mono tracking-[0.3em] uppercase text-amber-400 font-bold">
              KielTech Academy
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl text-amber-100 font-bold tracking-tight">
              Degree of Software Engineering Mastery
            </h1>
            <p className="text-xs font-serif italic text-stone-300">
              By Authority of the Academic Council & The Department of Computer Science
            </p>
          </div>

          {/* Body citation */}
          <div className="my-8 sm:my-10 space-y-4 max-w-2xl mx-auto relative z-10 text-stone-200">
            <p className="text-xs uppercase tracking-widest text-stone-400 font-mono">
              Be it known that upon the recommendation of the Faculty,
            </p>

            <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300 underline decoration-amber-500/40 underline-offset-8">
              {certificate.studentName}
            </div>

            <p className="text-xs text-stone-400 font-mono">
              Student ID: <span className="text-stone-200 font-bold">{certificate.studentId}</span>
            </p>

            <p className="text-sm sm:text-base font-serif leading-relaxed text-stone-300">
              has satisfactorily completed all rigorous academic coursework, comprehensive blind-coding assessments, and the final 60-question defense in
            </p>

            <div className="py-2">
              <span className="text-lg sm:text-xl font-bold font-mono text-white bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-lg">
                {certificate.courseCode}: {certificate.courseName}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-serif text-stone-300">
              and is hereby awarded this University Credential with <strong className="text-amber-300">{certificate.honorsStanding}</strong>, achieving a Final Grade of <strong className="text-emerald-400">{certificate.finalGrade}</strong> (Cumulative GPA: {certificate.gpa.toFixed(2)}).
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-amber-500/30 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end relative z-10">
            {/* Chancellor signature */}
            <div className="space-y-1">
              <div className="font-serif italic text-base text-amber-200 border-b border-stone-600 pb-1 max-w-[180px] mx-auto">
                Prof. Alistair Vance, Ph.D.
              </div>
              <div className="text-[11px] font-mono uppercase text-stone-400 tracking-wider">
                Chancellor & Provost
              </div>
            </div>

            {/* University Seal Medal */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center p-1 bg-amber-950/40 text-amber-400 shadow-md">
                <div className="w-16 h-16 rounded-full border border-amber-400/80 flex flex-col items-center justify-center text-[8px] font-mono uppercase font-bold tracking-tighter text-center leading-tight">
                  <ShieldCheck className="h-4 w-4 mb-0.5 text-amber-300" />
                  <span>Official</span>
                  <span>Seal 2026</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-stone-400 mt-1">Accredited Academic Standard</span>
            </div>

            {/* Dean signature */}
            <div className="space-y-1">
              <div className="font-serif italic text-base text-amber-200 border-b border-stone-600 pb-1 max-w-[180px] mx-auto">
                Dr. Eleanor Wright, D.Sc.
              </div>
              <div className="text-[11px] font-mono uppercase text-stone-400 tracking-wider">
                Dean of Computer Science
              </div>
            </div>
          </div>

          {/* Verification Code Footer */}
          <div className="mt-8 pt-4 border-t border-stone-800 text-[10px] font-mono text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Conferred Date: {certificate.completionDate}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="h-3 w-3" /> Cryptographically Verified: {certificate.verificationCode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
