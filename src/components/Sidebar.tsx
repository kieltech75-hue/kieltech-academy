import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Layers, 
  BarChart3, 
  ChevronRight, 
  ChevronDown,
  X,
  RotateCcw,
  Lock,
  Building2,
  FileText,
  Server,
  Layout,
  Code2,
  Cpu,
  Shield,
  FileCode2,
  Atom,
  Palette,
  Sparkles,
  ArrowRight,
  PanelLeftClose,
  HelpCircle,
  Info,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Trash2,
} from 'lucide-react';
import { LanguageCourse, CourseStage, BookmarkedLesson } from '../types/curriculum';
import { COURSES } from '../data/coursesCurriculum';
import { KielTechLogo } from './KielTechLogo';

interface SidebarProps {
  course: LanguageCourse;
  stages: CourseStage[];
  currentStageId: number;
  completedStageIds: number[];
  unlockedStageIds: number[];
  activeView: 'stage' | 'test' | 'results' | 'exam' | 'about' | 'privacy-policy';
  hasGraduated?: boolean;
  bookmarkedLessons?: BookmarkedLesson[];
  onSelectStage: (stageId: number) => void;
  onSelectBookmarkedLesson?: (lesson: BookmarkedLesson) => void;
  onRemoveBookmark?: (lessonId: string) => void;
  onOpenResults: () => void;
  onOpenExam: () => void;
  onOpenAbout: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenDiploma?: () => void;
  onChangeCourse: () => void;
  onSelectCourse?: (newCourse: LanguageCourse) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isOpenDesktop?: boolean;
  onToggleDesktop?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  course,
  stages,
  currentStageId,
  completedStageIds,
  unlockedStageIds,
  activeView,
  hasGraduated,
  bookmarkedLessons = [],
  onSelectStage,
  onSelectBookmarkedLesson,
  onRemoveBookmark,
  onOpenResults,
  onOpenExam,
  onOpenAbout,
  onOpenPrivacyPolicy,
  onOpenDiploma,
  onChangeCourse,
  onSelectCourse,
  isOpenMobile,
  onCloseMobile,
  isOpenDesktop = true,
  onToggleDesktop,
}) => {
  // State for whether the track switcher dropdown or course list is open
  const [activeTrack, setActiveTrack] = useState<'backend' | 'frontend'>(
    course.category === 'frontend' ? 'frontend' : 'backend'
  );
  const [showCourseSelector, setShowCourseSelector] = useState<boolean>(false);

  // Sync activeTrack when selected course category changes externally
  React.useEffect(() => {
    setActiveTrack(course.category === 'frontend' ? 'frontend' : 'backend');
  }, [course.category]);

  const backendCourses = COURSES.filter((c) => c.category === 'backend');
  const frontendCourses = COURSES.filter((c) => c.category === 'frontend');
  const activeTrackCourses = activeTrack === 'backend' ? backendCourses : frontendCourses;

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="h-4 w-4" />;
      case 'Server': return <Server className="h-4 w-4" />;
      case 'Cpu': return <Cpu className="h-4 w-4" />;
      case 'Layers': return <Layers className="h-4 w-4" />;
      case 'Shield': return <Shield className="h-4 w-4" />;
      case 'FileCode2': return <FileCode2 className="h-4 w-4" />;
      case 'Atom': return <Atom className="h-4 w-4" />;
      case 'Palette': return <Palette className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 lg:top-20 bottom-0 left-0 z-40 bg-slate-900/95 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out lg:sticky lg:h-[calc(100vh-5rem)] overflow-hidden shrink-0 ${
          isOpenMobile ? 'translate-x-0 w-80' : '-translate-x-full w-80'
        } ${
          isOpenDesktop ? 'lg:translate-x-0 lg:w-80 lg:opacity-100' : 'lg:translate-x-0 lg:w-0 lg:opacity-0 lg:pointer-events-none lg:border-r-0'
        }`}
      >
        <div className="w-80 flex flex-col h-full">
        {/* =========================================================================
            1. PROFESSIONAL UNIVERSITY TRACK & DEPARTMENT SELECTOR (Backend vs Frontend)
           ========================================================================= */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Academic Engineering Track</span>
            </span>
            <div className="flex items-center gap-1">
              {onToggleDesktop && (
                <button
                  onClick={onToggleDesktop}
                  className="hidden lg:flex p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                  aria-label="Collapse Sidebar"
                  title="Collapse Sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                aria-label="Close Sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Segmented Switcher Tab: Backend vs Frontend */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTrack('backend');
                setShowCourseSelector(true);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTrack === 'backend'
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Server className={`h-3.5 w-3.5 ${activeTrack === 'backend' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Backend</span>
              <span className="text-[10px] font-mono opacity-60">({backendCourses.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTrack('frontend');
                setShowCourseSelector(true);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTrack === 'frontend'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layout className={`h-3.5 w-3.5 ${activeTrack === 'frontend' ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>Frontend</span>
              <span className="text-[10px] font-mono opacity-60">({frontendCourses.length})</span>
            </button>
          </div>

          {/* Quick Course Dropdown / Switcher Bar */}
          <div className="mt-2.5">
            <button
              onClick={() => setShowCourseSelector(!showCourseSelector)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span 
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                  style={{ backgroundColor: `${course.color}20`, color: course.color }}
                >
                  {getCourseIcon(course.iconName)}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate flex items-center gap-1.5">
                    <span>{course.name}</span>
                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-800 px-1 py-0.2 rounded">
                      {course.courseCode || 'CS-301'}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showCourseSelector ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {/* Expanded Course Picker inside Sidebar */}
            {showCourseSelector && (
              <div className="mt-1.5 p-1.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 shadow-xl animate-in fade-in duration-150">
                <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 font-semibold flex items-center justify-between">
                  <span>Enrolled Courses in {activeTrack === 'backend' ? 'Backend' : 'Frontend'}</span>
                  <button 
                    onClick={onChangeCourse} 
                    className="text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer text-[10px]"
                  >
                    <span>Full Catalog</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </button>
                </div>
                {activeTrackCourses.map((c) => {
                  const isCurrent = c.id === course.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        if (onSelectCourse) {
                          onSelectCourse(c);
                        }
                        setShowCourseSelector(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30 font-bold'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px]"
                          style={{ backgroundColor: `${c.color}20`, color: c.color }}
                        >
                          {getCourseIcon(c.iconName)}
                        </span>
                        <span>{c.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">
                        {c.courseCode}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            2. SCROLLABLE SYLLABUS CURRICULUM MODULES
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Section: Stages */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              <span className="flex items-center gap-1.5 font-mono">
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                <span>Curriculum Modules</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {completedStageIds.length}/{stages.length} Cleared
              </span>
            </div>

            <div className="space-y-1.5">
              {stages.map((stage) => {
                const isActive = activeView === 'stage' && currentStageId === stage.id;
                const isCompleted = completedStageIds.includes(stage.id);
                const isUnlocked = unlockedStageIds.includes(stage.id);

                return (
                  <button
                    key={stage.id}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (!isUnlocked) return;
                      onSelectStage(stage.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                      !isUnlocked
                        ? 'opacity-40 cursor-not-allowed bg-slate-950/40 text-slate-600'
                        : isActive
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md cursor-pointer'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold ${
                          !isUnlocked
                            ? 'bg-slate-900 text-slate-600'
                            : isActive
                            ? 'bg-slate-950 text-amber-400'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {!isUnlocked ? (
                          <Lock className="h-3 w-3" />
                        ) : isCompleted && !isActive ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          stage.id
                        )}
                      </span>
                      <div className="truncate">
                        <div className="text-xs truncate">{stage.title}</div>
                        <div
                          className={`text-[10px] truncate font-mono ${
                            !isUnlocked
                              ? 'text-slate-600'
                              : isActive
                              ? 'text-slate-900/80 font-medium'
                              : 'text-slate-400'
                          }`}
                        >
                          {!isUnlocked ? 'Prerequisite Required' : `${stage.level} · ${stage.durationHours}`}
                        </div>
                      </div>
                    </div>

                    {isUnlocked && (
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isActive ? 'text-slate-950 translate-x-0.5' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =========================================================================
              2.5. MY SAVED LESSONS (BOOKMARKED CONCEPTS & LABS)
             ========================================================================= */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300/90 font-mono flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-amber-400" />
                <span>My Saved Lessons</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                {bookmarkedLessons.length}
              </span>
            </div>

            {bookmarkedLessons.length === 0 ? (
              <div className="p-3 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center">
                <p className="text-[11px] text-slate-500">
                  No bookmarks yet. Click the bookmark icon in any module or lab to save difficult concepts.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                {bookmarkedLessons.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-center justify-between p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 transition-all text-left"
                  >
                    <button
                      onClick={() => {
                        if (onSelectBookmarkedLesson) {
                          onSelectBookmarkedLesson(item);
                        } else {
                          onSelectStage(item.stageId);
                        }
                        onCloseMobile();
                      }}
                      className="flex-1 min-w-0 pr-2 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 truncate max-w-[85px]">
                          Stage 0{item.stageId}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-sans">
                        {item.description}
                      </p>
                    </button>

                    {onRemoveBookmark && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBookmark(item.id);
                        }}
                        title="Remove from saved lessons"
                        className="p-1 text-slate-500 hover:text-rose-400 rounded-lg transition-colors opacity-70 hover:opacity-100 cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* =========================================================================
              4. ACADEMIC PORTALS, EXAMS & UNIVERSITY VERIFICATION
             ========================================================================= */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 block mb-2 font-mono">
              Academic Portals & Defense
            </span>

            {/* Result Portal */}
            <button
              onClick={() => {
                onOpenResults();
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeView === 'results'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <span>Academic Transcript Portal</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded">
                Official
              </span>
            </button>

            {/* Ready to Graduate / Comprehensive Exam */}
            <button
              onClick={() => {
                onOpenExam();
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeView === 'exam'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <GraduationCap className="h-4 w-4 text-purple-400" />
                <span>60-Question Degree Defense</span>
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 rounded">
                Strict
              </span>
            </button>

            {/* Conferred University Diploma */}
            {hasGraduated && onOpenDiploma && (
              <button
                onClick={() => {
                  onOpenDiploma();
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl text-left text-xs sm:text-sm font-semibold bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer shadow-sm animate-pulse"
              >
                <span className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>Conferred University Diploma</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
                  Verified
                </span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                onOpenAbout();
                onCloseMobile();
              }}
              aria-current={activeView === 'about' ? 'page' : undefined}
              className={`w-full flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs font-semibold transition-colors cursor-pointer ${
                activeView === 'about'
                  ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200'
                  : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Info className="h-4 w-4 text-cyan-400" />
              <span>About KielTech Academy</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenPrivacyPolicy();
                onCloseMobile();
              }}
              aria-current={activeView === 'privacy-policy' ? 'page' : undefined}
              className={`mt-1 w-full flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs font-semibold transition-colors cursor-pointer ${
                activeView === 'privacy-policy'
                  ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                  : 'border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            4. PROFESSIONAL UNIVERSITY FOOTER SEAL & STANDARDS
           ========================================================================= */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/80 text-[11px] text-slate-400 space-y-1 font-mono shrink-0">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span className="flex items-center gap-2">
              <KielTechLogo className="h-5 w-5 object-contain shrink-0" />
              <span>KielTech Academy</span>
            </span>
            <span className="text-slate-500 text-[10px]">ABET / ACM</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">
            {course.department || 'College of Engineering & Computer Science'}
          </p>
        </div>
        </div>
      </aside>
    </>
  );
};
