import React from 'react';
import { 
  Building2, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Server, 
  Layout, 
  GraduationCap, 
  ShieldCheck, 
  FileText, 
  Code2, 
  Cpu, 
  Sparkles, 
  Terminal, 
  Lock, 
  Users,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { KielTechLogo } from './KielTechLogo';
import { COURSES } from '../data/coursesCurriculum';
import { LanguageCourse } from '../types/curriculum';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onGetStarted: () => void;
  onExploreCurriculum: () => void;
  onSelectCourseDirect?: (course: LanguageCourse) => void;
  currentCourse: LanguageCourse;
}

export const HomePage: React.FC<HomePageProps> = ({
  onGetStarted,
  onExploreCurriculum,
  onSelectCourseDirect,
  currentCourse,
}) => {
  const { user, profile } = useAuth();

  const backendCourses = COURSES.filter((c) => c.category === 'backend');
  const frontendCourses = COURSES.filter((c) => c.category === 'frontend');

  return (
    <div className="w-full flex flex-col items-center">
      {/* =========================================================================
          1. HERO SECTION: ACADEMY PRESENTATION & PRIMARY CALL TO ACTION
         ========================================================================= */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-12 sm:pb-20 text-center overflow-hidden">
        {/* Ambient Academic Glow Effects */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl -z-10" />

        {/* Institutional Accreditation Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 font-mono shadow-sm mb-6 animate-in fade-in slide-in-from-top-3">
          <Building2 className="h-4 w-4" />
          <span>ABET / ACM Aligned Computing Curricula · School of Engineering</span>
        </div>

        {/* Official Academy Emblem */}
        <div className="flex justify-center mb-6">
          <KielTechLogo className="h-24 w-24 sm:h-28 sm:w-28 object-contain" />
        </div>

        {/* Main Title & Value Proposition */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Academic Mastery in <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Software Engineering</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans">
          Welcome to <strong className="text-white font-bold">KielTech Academy</strong>, a collegiate computing platform delivering structured university-level syllabi, timed proctored mid-terms, interactive code sandboxes, and 60-question comprehensive degree defenses.
        </p>

        {/* Authenticated Student Banner (if logged in) */}
        {user && (
          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs font-mono text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Matriculated Student: <strong className="text-white">{profile?.displayName || user.email}</strong></span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400">ID: {profile?.studentId || 'KT-Active'}</span>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95 group"
          >
            <span>{user ? 'Choose Major & Continue Learning' : 'Get Started'}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onExploreCurriculum}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-600 text-slate-200 font-bold text-sm sm:text-base transition-all cursor-pointer"
          >
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>Explore Academic Syllabus</span>
          </button>
        </div>

        {/* Trust & Accreditation Stats Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80 text-center font-mono">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">11</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Collegiate Courses</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">2 Tracks</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Systems & Web Majors</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">60-Q</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Degree Defense Exam</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">100%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Verified Diplomas</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CORE ACADEMIC PILLARS: WHAT MAKES KIELTECH ACADEMY DISTINCT
         ========================================================================= */}
      <section className="w-full bg-slate-950/70 border-y border-slate-800/80 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Rigorous University Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Engineered Like a Tier-One Computer Science Degree
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
              KielTech Academy bypasses superficial tutorials to provide in-depth conceptual mechanics, mathematical underpinnings, and rigorous evaluation benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Pillar 1: Theoretical Depth */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-lg hover:border-amber-400/50 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Systems & Theory Foundation</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Dive deep into pointer indirection, stack vs heap allocation, AST parse trees, garbage collection internals, and zero-cost abstractions across backend & frontend languages.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-amber-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Memory Inspector & Sandboxes</span>
              </div>
            </div>

            {/* Pillar 2: Proctored Assessments */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-lg hover:border-cyan-400/50 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Timed Mid-Terms & Defense</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Clear 30-question rigorous assessments per stage and the final 60-question comprehensive Degree Defense. Every exam is timed and graded with 4.0 GPA academic standing.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-cyan-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Blind-Coding Viva Voce</span>
              </div>
            </div>

            {/* Pillar 3: Structured Learning */}
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-lg hover:border-purple-400/50 transition-all group">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Structured Learning Paths</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Follow focused course modules, save important lessons, and track your progress from foundational concepts through degree examinations.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-mono text-purple-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Progress Tracking & Saved Lessons</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS: ONBOARDING & LEARNING PIPELINE
         ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            Admissions & Matriculation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            The KielTech Matriculation Process
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            A frictionless, student-first onboarding journey with secure data governance:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <div className="text-3xl font-black font-mono text-amber-500/30 mb-2">01</div>
            <h4 className="text-base font-bold text-white mb-2">Student Matriculation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click <strong>Get Started</strong> to sign in with Google SSO or your email address to establish your student record and receive your Student ID.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <div className="text-3xl font-black font-mono text-cyan-500/30 mb-2">02</div>
            <h4 className="text-base font-bold text-white mb-2">Academic Cookie Consent</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configure session and cookie preferences to enable cloud synchronization for your course grades and code buffers without third-party tracking.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <div className="text-3xl font-black font-mono text-emerald-500/30 mb-2">03</div>
            <h4 className="text-base font-bold text-white mb-2">Major Track Selection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose between <strong>Backend Systems Engineering</strong> or <strong>Frontend Web Architecture</strong> and enroll in your primary language course.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
            <div className="text-3xl font-black font-mono text-purple-500/30 mb-2">04</div>
            <h4 className="text-base font-bold text-white mb-2">Exams & University Diploma</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete the curriculum stages, clear the 60-question degree defense, and receive your cryptographically verified transcript and diploma.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. DEPARTMENTAL OFFERINGS: BACKEND & FRONTEND PREVIEW
         ========================================================================= */}
      <section className="w-full bg-slate-950/80 border-t border-slate-800/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Departmental Major Pathways
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                Explore Available Degree Curricula
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-2 md:mt-0">
              ABET / ACM Computing Curricular Framework
            </p>
          </div>

          {/* Track 1: Backend Systems */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Division of Systems & Distributed Engineering</h3>
                <p className="text-xs text-slate-400">Low-level memory management, concurrency, OS primitives, and distributed backends.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {backendCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded">
                        {course.courseCode}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{course.credits || 4} Semester Credits</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">{course.name}</h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectCourseDirect) {
                        onSelectCourseDirect(course);
                      } else {
                        onGetStarted();
                      }
                    }}
                    className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer w-full text-left"
                  >
                    <span>Enroll in Course</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Track 2: Frontend Web Architecture */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Layout className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Division of Frontend Web Architecture</h3>
                <p className="text-xs text-slate-400">Component state machines, Virtual DOM reconciliation, TypeScript type systems, and reactive paradigms.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {frontendCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-400/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold uppercase bg-blue-400/10 text-blue-400 border border-blue-400/20 px-2 py-0.5 rounded">
                        {course.courseCode}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{course.credits || 4} Semester Credits</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">{course.name}</h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectCourseDirect) {
                        onSelectCourseDirect(course);
                      } else {
                        onGetStarted();
                      }
                    }}
                    className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer w-full text-left"
                  >
                    <span>Enroll in Course</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. FINAL CALL TO ACTION BANNER
         ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="home-final-cta relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 p-8 sm:p-14 shadow-2xl overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold uppercase text-amber-300">
              <Award className="h-4 w-4" />
              <span>Matriculation Open for All Candidates</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Begin Your Software Engineering Studies Today
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Step into the lecture hall, test your skills against strict mid-terms, follow your course progress, and defend your degree.
            </p>

            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={onGetStarted}
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
