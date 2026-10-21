import React, { useState } from 'react';
import { DomainTrack, LanguageCourse } from '../types/curriculum';
import { COURSES } from '../data/coursesCurriculum';
import { 
  Server, 
  Layout, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  Layers, 
  Shield, 
  FileCode2, 
  Atom, 
  Palette,
  Building2,
  GraduationCap,
  BookOpen,
  LogIn,
  UserCheck
} from 'lucide-react';
import { KielTechLogo } from './KielTechLogo';
import { useAuth } from '../context/AuthContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onSelectLanguage: (course: LanguageCourse) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onSelectLanguage }) => {
  const [selectedTrack, setSelectedTrack] = useState<DomainTrack | null>(null);
  const { user, profile, setAuthModalOpen } = useAuth();

  if (!isOpen) return null;

  const backendCourses = COURSES.filter((c) => c.category === 'backend');
  const frontendCourses = COURSES.filter((c) => c.category === 'frontend');
  const availableLanguages = selectedTrack === 'backend' ? backendCourses : frontendCourses;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Server': return <Server className="h-6 w-6" />;
      case 'Cpu': return <Cpu className="h-6 w-6" />;
      case 'Code2': return <Code2 className="h-6 w-6" />;
      case 'Shield': return <Shield className="h-6 w-6" />;
      case 'Layers': return <Layers className="h-6 w-6" />;
      case 'FileCode2': return <FileCode2 className="h-6 w-6" />;
      case 'Atom': return <Atom className="h-6 w-6" />;
      case 'Palette': return <Palette className="h-6 w-6" />;
      default: return <Code2 className="h-6 w-6" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto overscroll-contain rounded-2xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl my-8 text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Modal Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="flex justify-center mb-1">
            <KielTechLogo className="h-16 w-16 object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 font-mono">
            <Building2 className="h-3.5 w-3.5" />
            <span>KielTech Academy · Academic Matriculation Portal</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-amber-400">KielTech Academy</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            School of Engineering & Computer Science · ABET-Aligned Computing Curricula
          </p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mx-auto pt-2" />
        </div>

        {/* Student Matriculation Sign-In Banner */}
        <div className="mt-6 relative z-10">
          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/40 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Matriculated Student: {profile?.displayName || user.email}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                      Cloud Verified
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Student ID: <span className="text-amber-400 font-bold">{profile?.studentId || 'KT-Active'}</span> · Academic records will sync automatically
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                Ready to Enroll
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-950/80 to-slate-950/80 border border-amber-500/30 shadow-md">
              <div className="text-left space-y-0.5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                    Matriculate Before Learning (Recommended)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sign in with Google or your academic email to preserve your transcripts, test scores, and conferred university diploma across all sessions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold font-mono transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95 shrink-0"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In / Matriculate</span>
              </button>
            </div>
          )}
        </div>

        {/* Step 1: Select Track */}
        <div className="mt-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Step 1: Select Departmental Major Pathway
            </h3>
            {selectedTrack && (
              <button
                onClick={() => setSelectedTrack(null)}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
              >
                Change Department
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Backend Track Option */}
            <button
              onClick={() => setSelectedTrack('backend')}
              className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTrack === 'backend'
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md">
                <Server className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">Backend Systems Engineering</span>
                  {selectedTrack === 'backend' && (
                    <CheckCircle2 className="h-5 w-5 text-amber-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Memory hierarchy, zero-cost abstractions, network protocols, concurrent runtime architectures, and distributed systems.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] font-mono text-slate-300">
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-301 Python</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-401 Rust</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-340 Go</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-250 Java</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-450 C++</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-470 C#</span>
                </div>
              </div>
            </button>

            {/* Frontend Track Option */}
            <button
              onClick={() => setSelectedTrack('frontend')}
              className={`flex items-start gap-4 p-5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTrack === 'frontend'
                  ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-1 ring-blue-400'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-slate-950 font-bold shadow-md">
                <Layout className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">Frontend Web Architecture</span>
                  {selectedTrack === 'frontend' && (
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Formal type theory, fiber reconciliation algorithms, state machines, and high-performance user interfaces.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] font-mono text-slate-300">
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-210 JS</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-320 TS</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-330 React</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-332 Vue</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded">CS-202 HTML/CSS</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Choose Language when track is selected */}
        {selectedTrack && (
          <div className="mt-8 space-y-4 pt-6 border-t border-slate-800 animate-fadeIn">
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 font-mono">
                Step 2: Enroll in {selectedTrack === 'backend' ? 'Systems Engineering' : 'Web Architecture'} Course:
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Each course confers official academic credit upon clearing 30-question mid-terms, syllabus modules, and the 60-Question Comprehensive Defense.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableLanguages.map((course) => (
                <button
                  key={course.id}
                  onClick={() => onSelectLanguage(course)}
                  className="group relative flex flex-col p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-amber-400/80 hover:bg-slate-800/60 transition-all text-left shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: course.accentBg, color: course.color }}
                    >
                      {getIcon(course.iconName)}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      {course.courseCode || 'CS-301'}
                    </span>
                  </div>

                  <span className="text-base font-bold text-white mt-3 group-hover:text-amber-400 transition-colors">
                    {course.name}
                  </span>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {course.credits || 4} Semester Credits · {course.department}
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400 font-mono">
                    <span>Enroll in Course</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
