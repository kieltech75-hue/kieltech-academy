import React, { useState, useRef, useEffect } from 'react';
import { 
  PanelLeftClose, 
  PanelLeft, 
  RotateCcw, 
  Award, 
  Sun, 
  Moon, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  ChevronDown, 
  FileText,
  Home,
  ClipboardCheck
} from 'lucide-react';
import { KielTechLogo } from './KielTechLogo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onBrandClick: () => void;
  activeView?: string;
  onNavigateHome?: () => void;
  courseName?: string;
  courseCode?: string;
  categoryName?: string;
  completedStagesCount: number;
  totalStages: number;
  hasGraduated?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
  onSwitchTrack?: () => void;
  onOpenDiploma?: () => void;
  onOpenResults?: () => void;
  onOpenCurriculumReview?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBrandClick,
  activeView = 'stage',
  onNavigateHome,
  courseName,
  courseCode,
  categoryName,
  completedStagesCount,
  totalStages,
  hasGraduated,
  theme,
  onToggleTheme,
  isSidebarOpen = true,
  onToggleSidebar,
  onOpenMobileSidebar,
  onSwitchTrack,
  onOpenDiploma,
  onOpenResults,
  onOpenCurriculumReview,
}) => {
  const handleToggle = onToggleSidebar || onOpenMobileSidebar;
  const { user, profile, signOut, setAuthModalOpen } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="w-full max-w-[1536px] mx-auto flex min-h-[5.25rem] py-3 items-center justify-between px-4 sm:px-8 gap-4 sm:gap-8">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Sidebar Toggle (Only show if not on home page, or always available) */}
          {activeView !== 'home' && handleToggle && (
            <button
              onClick={handleToggle}
              className={`p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/60 shadow-xs cursor-pointer flex items-center justify-center shrink-0 ${
                isSidebarOpen ? 'bg-slate-900/80 text-amber-300 border-amber-500/30' : 'bg-slate-950/60'
              }`}
              title={isSidebarOpen ? "Collapse curriculum sidebar (laptop & mobile)" : "Expand curriculum sidebar (laptop & mobile)"}
              aria-label={isSidebarOpen ? "Collapse Navigation Sidebar" : "Expand Navigation Sidebar"}
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </button>
          )}

          {/* Brand wordmark: KielTech Academy */}
          <button
            onClick={onNavigateHome || onBrandClick}
            className="group flex items-center gap-3 sm:gap-4 text-left focus:outline-none cursor-pointer min-w-0"
            title="Go to KielTech Academy Home"
          >
            <KielTechLogo className="h-11 w-11 sm:h-12 sm:w-12 object-contain shrink-0 group-hover:scale-105 transition-transform" />
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
                KielTech Academy
              </span>
              <span className="hidden xl:inline-flex items-center text-[10px] font-mono uppercase bg-amber-400/10 text-amber-300 border border-amber-400/20 px-2 py-0.5 rounded font-bold tracking-wider whitespace-nowrap">
                School of Engineering
              </span>
            </div>
          </button>

          {/* Home navigation */}
          <div className="hidden lg:flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  activeView === 'home'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </button>
            )}
          </div>
        </div>

        {/* Right side: Active Course Badge + Theme Toggle + Auth + Progress */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Official Diploma Button */}
          {hasGraduated && onOpenDiploma && (
            <button
              onClick={onOpenDiploma}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer animate-pulse"
            >
              <Award className="h-4 w-4" />
              <span>Official Diploma</span>
            </button>
          )}

          {/* Course Switch Button (when inside curriculum) */}
          {courseName && activeView !== 'home' && (
            <button
              onClick={onSwitchTrack}
              title="Click to switch academic department or course"
              className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:border-amber-400/60 hover:bg-slate-800 transition-all text-left cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 uppercase font-mono text-[10px] font-bold">
                    {courseCode || (categoryName === 'backend' ? 'CS-301' : 'CS-210')}
                  </span>
                  <span className="text-slate-600 font-mono text-[10px]">·</span>
                  <span className="text-amber-400 font-mono text-[10px] uppercase font-bold">
                    {categoryName === 'backend' ? 'Backend' : 'Frontend'}
                  </span>
                </div>
                <span className="font-bold text-white flex items-center gap-1 text-[11px]">
                  {courseName}
                  <RotateCcw className="h-3 w-3 text-slate-400" />
                </span>
              </div>
            </button>
          )}

          {profile?.role === 'admin' && onOpenCurriculumReview && (
            <button
              aria-current={activeView === 'curriculum-review' || activeView === 'admin' ? 'page' : undefined}
              aria-label="Open admin dashboard"
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-bold transition-colors sm:px-3 ${
                activeView === 'curriculum-review'
                  || activeView === 'admin'
                  ? 'border-amber-400/60 bg-amber-500/20 text-amber-200'
                  : 'border-amber-500/40 bg-slate-900/90 text-amber-300 hover:border-amber-400/70 hover:bg-amber-500/10'
              }`}
              onClick={onOpenCurriculumReview}
              title="Open admin dashboard"
              type="button"
            >
              <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
              <span>Admin</span>
            </button>
          )}

          {/* Global Theme Toggle Button (Icon only) */}
          <button
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'University Light' : 'Dark'} Theme`}
            title={`Switch to ${theme === 'dark' ? 'University Light' : 'Dark'} Theme`}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 hover:border-amber-400/60 text-slate-200 transition-all cursor-pointer shadow-sm shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400" />
            )}
          </button>

          {/* Authentication Badge / Sign-In Button */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-amber-500/40 bg-slate-900/90 hover:bg-slate-800 hover:border-amber-400 transition-all cursor-pointer shadow-sm"
                aria-label="Student Account Menu"
              >
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.displayName}
                    className="h-7 w-7 rounded-lg object-cover border border-amber-400/40 shrink-0"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center font-mono shrink-0 shadow-xs">
                    {profile?.displayName?.charAt(0).toUpperCase() || 'S'}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <span className="text-xs font-bold text-white block max-w-[120px] truncate leading-tight">
                    {profile?.displayName || 'Student'}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 block leading-tight">
                    {profile?.studentId || 'KT-Candidate'}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                        Matriculated
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white mt-1 truncate">
                      {profile?.displayName}
                    </p>
                    <p className="text-xs text-slate-400 truncate font-mono">
                      {profile?.email}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Student ID</span>
                      <span className="text-amber-400 font-bold">{profile?.studentId}</span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {onOpenResults && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenResults();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <FileText className="h-4 w-4 text-emerald-400" />
                        <span>Official Transcript</span>
                      </button>
                    )}

                    {hasGraduated && onOpenDiploma && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenDiploma();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 rounded-xl transition-colors text-left cursor-pointer"
                      >
                        <Award className="h-4 w-4 text-amber-400" />
                        <span>Conferred University Diploma</span>
                      </button>
                    )}
                  </div>

                  <div className="p-1 pt-1.5 border-t border-slate-800">
                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await signOut();
                        onNavigateHome?.();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold font-mono transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95 shrink-0"
              title="Login / Sign up with Google or Email"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login/ Sign up</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
