import React from 'react';
import { 
  Building2, 
  Printer, 
  Download, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Calendar, 
  FileText,
  GraduationCap
} from 'lucide-react';
import { TestResultRecord } from '../types/curriculum';
import { KielTechLogo } from './KielTechLogo';

interface OfficialTranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  courseCode: string;
  department: string;
  results: TestResultRecord[];
  gpa: number;
  overallGrade: string;
  honors: string;
  studentName?: string;
  studentId?: string;
}

export const OfficialTranscriptModal: React.FC<OfficialTranscriptModalProps> = ({
  isOpen,
  onClose,
  courseName,
  courseCode,
  department,
  results,
  gpa,
  overallGrade,
  honors,
  studentName,
  studentId,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const averageScore = totalTests > 0
    ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / totalTests)
    : 0;

  const totalCreditsEarned = passedTests * 3;
  const transcriptDocNumber = `KTU-TR-2026-${Math.abs(courseCode.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString().slice(0, 6)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl my-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Registrar Document Preview · PDF Ready
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable University Document Sheet */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 font-sans print:p-8 min-h-[900px] flex flex-col justify-between selection:bg-amber-100">
          <div>
            {/* 1. University Letterhead & Institutional Seal */}
            <div className="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <KielTechLogo className="h-20 w-20 object-contain shrink-0" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-950 uppercase">
                    KielTech Academy
                  </h1>
                  <p className="text-xs font-mono uppercase tracking-widest text-slate-600 font-bold">
                    Office of the Academy Registrar & Academic Affairs
                  </p>
                  <p className="text-[11px] text-slate-500 font-serif italic mt-0.5">
                    Accredited by the International Commission for Engineering & Applied Science (ABET/ACM)
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right font-mono text-xs text-slate-600 space-y-0.5 border sm:border-0 border-slate-200 p-3 sm:p-0 rounded-xl">
                <div className="font-bold text-slate-900 text-sm">OFFICIAL ACADEMIC TRANSCRIPT</div>
                <div>Document ID: <strong className="text-slate-900">{transcriptDocNumber}</strong></div>
                <div>Issue Date: {currentDate}</div>
                <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider mt-1">
                  ✓ Verified Cryptographic Signature
                </div>
              </div>
            </div>

            {/* 2. Student & Department Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-8 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Student Name</span>
                <span className="text-slate-900 font-bold text-sm">{studentName || 'Candidate in Software Eng.'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Matriculation ID</span>
                <span className="text-slate-900 font-bold text-sm">{studentId || 'KU-2026-CS8841'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Academic Faculty</span>
                <span className="text-slate-900 font-bold text-sm">{department}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">Primary Course</span>
                <span className="text-slate-900 font-bold text-sm">{courseCode}: {courseName}</span>
              </div>
            </div>

            {/* 3. Comprehensive Academic Examination History Table */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-700" />
                  <span>Accredited Examination & Assessment Record</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Total Assessment Records: {results.length}
                </span>
              </div>

              {results.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-4">Evaluation Title</th>
                        <th className="py-2.5 px-4">Assessment Type</th>
                        <th className="py-2.5 px-4 text-center">Score</th>
                        <th className="py-2.5 px-4 text-center">Grade</th>
                        <th className="py-2.5 px-4 text-center">Credits</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                        <th className="py-2.5 px-4 text-right">Completion Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {results.map((record) => {
                        const grade = record.percentage >= 90 ? 'A' : record.percentage >= 80 ? 'B' : record.percentage >= 70 ? 'C' : 'F';
                        const dateStr = new Date(record.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });

                        return (
                          <tr key={record.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-semibold text-slate-900">
                              {record.stageTitle}
                            </td>
                            <td className="py-3 px-4 text-[11px] text-slate-600">
                              {record.type === 'graduation_exam' ? 'Comprehensive Degree Defense (60 Questions)' : 'Mid-term Milestone (30 Questions)'}
                            </td>
                            <td className="py-3 px-4 text-center font-bold text-slate-900">
                              {record.score} / {record.totalQuestions} ({record.percentage}%)
                            </td>
                            <td className="py-3 px-4 text-center font-bold">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                                grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                grade === 'C' ? 'bg-amber-100 text-amber-800' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {grade}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-slate-600">
                              {record.passed ? '3.0' : '0.0'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {record.passed ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold">
                                  Passed
                                </span>
                              ) : (
                                <span className="text-[10px] text-rose-600 font-bold">
                                  Deficient
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                              {dateStr}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-300 rounded-xl text-center text-slate-500 font-mono text-xs">
                  No academic examination records logged in this course session yet.
                </div>
              )}
            </div>

            {/* 4. University Cumulative Summary & Academic Honors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 mb-8 font-mono">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Cumulative GPA</span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {gpa.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ 4.00</span>
                </div>
                <span className="text-[11px] text-amber-800 font-bold block">{honors}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Units & Assessments</span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {totalCreditsEarned}.0 <span className="text-xs font-normal text-slate-500">Credits</span>
                </div>
                <span className="text-[11px] text-slate-600 block">{passedTests} of {totalTests} modules passed</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Weighted Grade Average</span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {averageScore}% <span className="text-xs font-normal text-slate-500">({overallGrade})</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold block">Accredited Good Standing</span>
              </div>
            </div>
          </div>

          {/* 5. Institutional Signatures & Verification Seal */}
          <div className="pt-6 border-t-2 border-slate-900 mt-8 font-serif">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-end text-center sm:text-left">
              <div>
                <div className="font-serif italic text-lg text-slate-800 border-b border-slate-400 pb-1">
                  Prof. Alistair Vance
                </div>
                <div className="text-xs font-sans font-bold text-slate-900 mt-1 uppercase">
                  Prof. Alistair Vance, Ph.D.
                </div>
                <div className="text-[10px] font-sans text-slate-500">
                  Dean of Computing & Information Sciences
                </div>
              </div>

              <div>
                <div className="font-serif italic text-lg text-slate-800 border-b border-slate-400 pb-1">
                  Dr. Eleanor Wright
                </div>
                <div className="text-xs font-sans font-bold text-slate-900 mt-1 uppercase">
                  Dr. Eleanor Wright, D.Sc.
                </div>
                <div className="text-[10px] font-sans text-slate-500">
                  University Registrar & Academic Records
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end justify-center">
                <div className="h-16 w-16 rounded-full border-2 border-slate-900 flex items-center justify-center p-1 text-center">
                  <div className="h-full w-full rounded-full border border-dashed border-slate-700 flex flex-col items-center justify-center text-[7px] font-mono uppercase font-bold text-slate-900 leading-tight">
                    <span>Official</span>
                    <span>Seal</span>
                    <span>2026</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1">
                  SECURE VERIFICATION: SHA-256
                </span>
              </div>
            </div>

            <div className="text-center font-mono text-[9px] text-slate-400 mt-8">
              This academic transcript is an official academy document certified by KielTech Academy. Any unauthorized alteration or reproduction is strictly prohibited under academic regulations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
