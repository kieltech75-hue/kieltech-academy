import React, { useState } from 'react';
import { TestResultRecord, CertificateData } from '../types/curriculum';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Calendar, 
  GraduationCap, 
  ArrowRight,
  AlertTriangle,
  Building2,
  FileText,
  Printer,
  ShieldCheck,
  Percent,
  CheckCircle,
  Download
} from 'lucide-react';
import { UniversityDiplomaModal } from './UniversityDiplomaModal';
import { OfficialTranscriptModal } from './OfficialTranscriptModal';
import { useAuth } from '../context/AuthContext';

interface ResultPortalProps {
  courseName: string;
  courseCode?: string;
  department?: string;
  results: TestResultRecord[];
  onBackToCourse: () => void;
  onClearHistory: () => void;
}

export const ResultPortal: React.FC<ResultPortalProps> = ({
  courseName,
  courseCode = 'CS-301',
  department = 'Department of Computer Science',
  results,
  onBackToCourse,
  onClearHistory,
}) => {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const { profile } = useAuth();

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const averageScore = totalTests > 0
    ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / totalTests)
    : 0;

  // University Cumulative GPA Calculation (Scale 4.0)
  const calculateGPA = (percentage: number): { gpa: number; grade: string; honors: string } => {
    if (percentage >= 95) return { gpa: 4.0, grade: 'A+', honors: 'Summa Cum Laude (Highest Honors)' };
    if (percentage >= 90) return { gpa: 3.9, grade: 'A', honors: 'Magna Cum Laude (High Honors)' };
    if (percentage >= 85) return { gpa: 3.7, grade: 'A-', honors: 'Cum Laude (Honors)' };
    if (percentage >= 80) return { gpa: 3.3, grade: 'B+', honors: 'Dean\'s Commendation' };
    if (percentage >= 75) return { gpa: 3.0, grade: 'B', honors: 'Academic Good Standing' };
    if (percentage >= 70) return { gpa: 2.7, grade: 'B-', honors: 'Accredited Pass' };
    if (percentage >= 60) return { gpa: 2.0, grade: 'C', honors: 'Remediation Required' };
    return { gpa: 0.0, grade: 'F', honors: 'Academic Re-examination Required' };
  };

  const cumulativeGPA = totalTests > 0 ? calculateGPA(averageScore) : { gpa: 0.0, grade: 'N/A', honors: 'Enrolled' };

  const graduationPasses = results.filter((r) => r.type === 'graduation_exam' && r.passed);
  const latestGradPass = graduationPasses[0];

  const handleOpenDiploma = (examRecord?: TestResultRecord) => {
    const record = examRecord || latestGradPass;
    const scoreVal = record ? record.percentage : averageScore;
    const gpaInfo = calculateGPA(scoreVal);

    const diplomaData: CertificateData = {
      certificateId: `KU-DIP-${(record?.id || Date.now()).toString().slice(-8).toUpperCase()}`,
      studentName: profile?.displayName || 'Candidate in Software Engineering',
      studentId: profile?.studentId || 'KT-2026-CS8841',
      courseName,
      courseCode,
      completionDate: record ? new Date(record.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'October 2026',
      honorsStanding: gpaInfo.honors,
      finalGrade: gpaInfo.grade,
      gpa: gpaInfo.gpa,
      institution: 'KielTech Academy',
      chancellor: 'Prof. Alistair Vance, Ph.D.',
      dean: 'Dr. Eleanor Wright, D.Sc.',
      verificationCode: `SHA256:8f9a2b${(record?.timestamp || Date.now()).toString().slice(-6)}c1d`,
    };

    setSelectedCertificate(diplomaData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Official Diploma Modal */}
      {selectedCertificate && (
        <UniversityDiplomaModal
          isOpen={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          certificate={selectedCertificate}
        />
      )}

      {/* Official Academic Transcript Modal (PDF-Style UI) */}
      <OfficialTranscriptModal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        courseName={courseName}
        courseCode={courseCode}
        department={department}
        results={results}
        gpa={cumulativeGPA.gpa}
        overallGrade={cumulativeGPA.grade}
        honors={cumulativeGPA.honors}
        studentName={profile?.displayName}
        studentId={profile?.studentId}
      />

      {/* University Transcript Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 font-mono">
            <Building2 className="h-3.5 w-3.5" />
            <span>KielTech Academy Registrar's Office</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            Official Academic Transcript & Records
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-mono">
            Course ID: <strong className="text-white">{courseCode}</strong> · {department}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Student: <span className="text-slate-300 font-medium">{profile?.displayName || 'Undergraduate Candidate'} (ID: {profile?.studentId || 'KT-Candidate'})</span> · Matriculated Semester
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download Official Transcript Button */}
          <button
            onClick={() => setIsTranscriptModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer hover:scale-105"
            title="Download formatted university PDF transcript"
          >
            <Download className="h-4 w-4" />
            <span>Download Official Transcript</span>
          </button>

          {latestGradPass && (
            <button
              onClick={() => handleOpenDiploma()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>View Conferred Diploma</span>
            </button>
          )}

          {totalTests > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Reset Record Log
            </button>
          )}

          <button
            onClick={onBackToCourse}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <span>Back to Syllabus</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Academic Standing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* GPA Metric */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1 shadow-md">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
            Cumulative GPA
          </span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {cumulativeGPA.gpa.toFixed(2)} <span className="text-sm font-normal text-slate-500">/ 4.00</span>
          </div>
          <p className="text-[11px] text-amber-300/80 font-mono truncate">{cumulativeGPA.honors}</p>
        </div>

        {/* Grade Metric */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1 shadow-md">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Letter Grade
          </span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {cumulativeGPA.grade}
          </div>
          <p className="text-[11px] text-slate-500">Weighted Average: {averageScore}%</p>
        </div>

        {/* Milestones Passed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1 shadow-md">
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
            Exams Accredited
          </span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {passedTests} <span className="text-base text-slate-400 font-normal">/ {totalTests}</span>
          </div>
          <p className="text-[11px] text-slate-500">Achieved 70%+ threshold</p>
        </div>

        {/* Degree Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-1 shadow-md">
          <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
            Degree Standing
          </span>
          <div className="text-base font-bold text-white mt-1 flex items-center gap-1.5">
            {latestGradPass ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Defense Conferred
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Building2 className="h-4 w-4" /> Matriculated (In Progress)
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Degree: Software Engineering</p>
        </div>
      </div>

      {/* University Transcript Ledger */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Official University Examination Log</span>
          </h3>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>Registrar Logged: {results.length} Sessions</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> ABET Standards Monitored
            </span>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BarChart3 className="h-12 w-12 text-slate-600 mx-auto" />
            <div className="text-base font-bold text-white">No Examination Sessions Recorded</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Complete the 30-question mid-term assessment on any syllabus stage or enter the 60-Question Comprehensive Defense to establish your official university transcript.
            </p>
            <button
              onClick={onBackToCourse}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              <span>Begin Module 01 Assessment</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {results.map((item) => {
              const gradeDetail = calculateGPA(item.percentage);

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        item.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {item.type === 'graduation_exam' ? (
                        <GraduationCap className="h-5 w-5" />
                      ) : item.passed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                          {item.type === 'graduation_exam'
                            ? `${courseCode} Comprehensive Degree Defense (60 Questions)`
                            : `${courseCode}.${item.stageId} Mid-term Assessment (30 Questions)`}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                            item.passed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {item.passed ? `PASSED (${gradeDetail.grade})` : 'FAILED'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-1">
                        {item.stageTitle || (item.type === 'graduation_exam' ? 'Comprehensive 60-Question Examination' : 'Mid-term 30-Question Assessment')}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span>Course: {item.courseName}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span>·</span>
                        <span>Credit Points: {gradeDetail.gpa.toFixed(1)}</span>
                      </div>

                      {/* Missed topics summary if recorded */}
                      {item.missedTopics && item.missedTopics.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                          <span className="text-rose-400 font-semibold flex items-center gap-1 font-mono">
                            <AlertTriangle className="h-3 w-3" /> Syllabus Deficiencies:
                          </span>
                          {item.missedTopics.slice(0, 3).map((topic, i) => (
                            <span key={i} className="bg-slate-900 border border-rose-500/20 px-2 py-0.5 rounded text-rose-200 font-mono text-[10px]">
                              {topic}
                            </span>
                          ))}
                          {item.missedTopics.length > 3 && (
                            <span className="text-slate-500 font-mono text-[10px]">
                              +{item.missedTopics.length - 3} more topics
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6 shrink-0 gap-2">
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                        {item.percentage}%
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.score} / {item.totalQuestions} Assertions Correct
                      </div>
                    </div>

                    {item.type === 'graduation_exam' && item.passed && (
                      <button
                        onClick={() => handleOpenDiploma(item)}
                        className="text-[11px] font-mono text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Award className="h-3 w-3" />
                        <span>Diploma Credential</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
