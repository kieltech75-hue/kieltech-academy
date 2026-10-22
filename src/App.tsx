/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { COURSES, getStagesForCourse, getGraduationExamForCourse } from './data/coursesCurriculum';
import { LanguageCourse, CourseStage, TestResultRecord, CertificateData, BookmarkedLesson } from './types/curriculum';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WelcomeModal } from './components/WelcomeModal';
import { StageTeachingView } from './components/StageTeachingView';
import { StageTestView } from './components/StageTestView';
import { ResultPortal } from './components/ResultPortal';
import { GraduationExamView } from './components/GraduationExamView';
import { UniversityDiplomaModal } from './components/UniversityDiplomaModal';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './components/HomePage';
import { CookieConsentModal } from './components/CookieConsentModal';
import { CurriculumReviewView } from './components/CurriculumReviewView';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutView } from './components/AboutView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { OwnerManagementView } from './components/OwnerManagementView';

type AppView = 'home' | 'stage' | 'test' | 'results' | 'exam' | 'about' | 'privacy-policy' | 'admin' | 'curriculum-review' | 'owner-management';

export default function App() {
  const { 
    user, 
    profile, 
    loading: authLoading,
    authModalOpen, 
    setAuthModalOpen, 
    syncCourseProgressToCloud, 
    loadCourseProgressFromCloud,
    syncCurrentCourseToCloud,
    loadMostRecentCourseIdFromCloud,
    syncTestResultToCloud,
    loadTestResultsFromCloud,
    recordAcademicActivity,
  } = useAuth();

  // Saved active course or default to Python backend
  const [selectedCourse, setSelectedCourse] = useState<LanguageCourse>(() => {
    try {
      const saved = localStorage.getItem('kieltech_selected_course');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = COURSES.find((c) => c.id === parsed.id);
        if (match) return match;
      }
    } catch {}
    return COURSES[0]; // Python default (CS-301)
  });
  const previousCourseId = useRef(selectedCourse.id);
  const restoredAccountId = useRef<string | null>(null);

  // Track if welcome modal should show (track and course selection)
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(false);

  // Cookie consent state
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('kieltech_cookie_consent');
    } catch {
      return false;
    }
  });

  // Cookie Modal display state
  const [showCookieModal, setShowCookieModal] = useState<boolean>(false);

  // Onboarding sequence tracker ('auth' -> 'cookies' -> 'track_select')
  const [isOnboardingFlow, setIsOnboardingFlow] = useState<boolean>(false);
  const [loadedProgressKey, setLoadedProgressKey] = useState<string | null>(null);
  const [accountCourseRestored, setAccountCourseRestored] = useState<boolean>(false);

  // Stages for currently selected course
  const courseStages = getStagesForCourse(selectedCourse.id);
  const [currentStageId, setCurrentStageId] = useState<number>(1);

  // Active view state:
  // 'home' = institutional website overview & admissions presentation
  // 'stage' = viewing stage teachings
  // 'test' = viewing locked stage test
  // 'results' = student Academic Transcript Portal
  // 'exam' = graduation examination defense
  const [activeView, setActiveView] = useState<AppView>('home');
  const previousAdminReturnView = useRef<AppView>('home');
  const lastViewedStageActivity = useRef<string | null>(null);

  // Mobile sidebar toggle state
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  // Laptop / Desktop sidebar toggle state (persisted in localStorage, default true)
  const [isSidebarOpenDesktop, setIsSidebarOpenDesktop] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('kieltech_sidebar_desktop_open');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const handleToggleSidebar = () => {
    // If on small screen / mobile viewport, toggle mobile drawer
    if (window.innerWidth < 1024) {
      setIsSidebarOpenMobile((prev) => !prev);
    } else {
      // On laptop / desktop viewport, toggle collapsible sidebar
      setIsSidebarOpenDesktop((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('kieltech_sidebar_desktop_open', String(next));
        } catch {}
        return next;
      });
    }
  };

  // Diploma Modal state
  const [activeDiplomaModal, setActiveDiplomaModal] = useState<CertificateData | null>(null);

  // Global Theme: 'dark' (default) or 'light' (high-contrast University Light), persisted in localStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('kieltech_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch {}
    return 'dark';
  });

  // Persist theme to localStorage and document root
  useEffect(() => {
    try {
      localStorage.setItem('kieltech_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Completed stage IDs stored in state and localStorage
  const [completedStageIds, setCompletedStageIds] = useState<number[]>(() => {
    try {
      const key = `kieltech_completed_stages_${selectedCourse.id}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Unlocked stage IDs: starts with [1]. Next stages are unlocked ONLY after passing the degree exam!
  const [unlockedStageIds, setUnlockedStageIds] = useState<number[]>(() => {
    try {
      const key = `kieltech_unlocked_stages_${selectedCourse.id}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  // Whether user has passed the graduation degree exam for this course
  const [hasGraduatedCourse, setHasGraduatedCourse] = useState<boolean>(() => {
    try {
      const key = `kieltech_graduated_${selectedCourse.id}`;
      return localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  });

  // Test Results Record stored per user in localStorage
  const [testResults, setTestResults] = useState<TestResultRecord[]>(() => {
    try {
      const saved = localStorage.getItem('kieltech_student_test_results');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarked lessons/modules stored per student across courses in localStorage
  const [bookmarkedLessons, setBookmarkedLessons] = useState<BookmarkedLesson[]>(() => {
    try {
      const saved = localStorage.getItem('kieltech_bookmarked_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!user) {
      restoredAccountId.current = null;
      setAccountCourseRestored(false);
      setLoadedProgressKey(null);
      return;
    }

    if (!profile || restoredAccountId.current === user.uid) return;
    restoredAccountId.current = user.uid;
    let isCurrent = true;
    setAccountCourseRestored(false);

    const restoreCourse = async () => {
      let courseId = profile.currentCourseId;
      if (!courseId) {
        try {
          const savedSelection = localStorage.getItem('kieltech_selected_course');
          if (savedSelection) courseId = JSON.parse(savedSelection).id;
        } catch {}
      }
      if (!courseId) courseId = await loadMostRecentCourseIdFromCloud() || undefined;
      if (!isCurrent) return;

      const savedCourse = COURSES.find((course) => course.id === courseId);
      if (savedCourse) {
        setSelectedCourse(savedCourse);
        setActiveView('stage');
        if (!profile.currentCourseId) {
          syncCurrentCourseToCloud(savedCourse.id)
            .catch((error) => console.error('Could not restore the saved course to the student account:', error));
        }
        let acceptedOnThisDevice = false;
        try {
          acceptedOnThisDevice = Boolean(localStorage.getItem('kieltech_cookie_consent'));
        } catch {}
        if (!acceptedOnThisDevice) setShowCookieModal(true);
      }
      setAccountCourseRestored(true);
    };

    restoreCourse()
      .catch((error) => {
        console.error('Could not restore the student course from the account:', error);
        if (isCurrent) setAccountCourseRestored(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [user, profile, loadMostRecentCourseIdFromCloud, syncCurrentCourseToCloud]);

  useEffect(() => {
    if (authLoading || !user) return;
    let isCurrent = true;
    loadTestResultsFromCloud()
      .then((cloudResults) => {
        if (!isCurrent) return;
        setTestResults((currentResults) => {
          const resultsById = new Map(currentResults.map((result) => [result.id, result]));
          cloudResults.forEach((result) => resultsById.set(result.id, result));
          return Array.from(resultsById.values()).sort((first, second) => second.timestamp - first.timestamp);
        });
      })
      .catch((error) => console.error('Could not load academic results from the student account:', error));
    return () => {
      isCurrent = false;
    };
  }, [authLoading, user, loadTestResultsFromCloud]);

  // Sync bookmarkedLessons to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kieltech_bookmarked_lessons', JSON.stringify(bookmarkedLessons));
    } catch {}
  }, [bookmarkedLessons]);

  const handleToggleBookmark = (item: Omit<BookmarkedLesson, 'savedAt'>) => {
    const exists = bookmarkedLessons.some((bookmark) => bookmark.id === item.id);
    setBookmarkedLessons((previous) => exists
      ? previous.filter((bookmark) => bookmark.id !== item.id)
      : [{ ...item, savedAt: Date.now() }, ...previous]);
    recordAcademicActivity({
      type: exists ? 'lesson-unbookmarked' : 'lesson-bookmarked',
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      stageId: item.stageId,
      lessonTitle: item.title,
    });
  };

  const handleRemoveBookmark = (lessonId: string) => {
    const bookmark = bookmarkedLessons.find((item) => item.id === lessonId);
    setBookmarkedLessons((prev) => prev.filter((b) => b.id !== lessonId));
    if (bookmark) {
      recordAcademicActivity({
        type: 'lesson-unbookmarked',
        courseId: bookmark.courseId,
        courseName: bookmark.courseName,
        stageId: bookmark.stageId,
        lessonTitle: bookmark.title,
      });
    }
  };

  const handleSelectBookmarkedLesson = (lesson: BookmarkedLesson) => {
    // If the bookmark is from another course, optionally switch course if available
    const matchingCourse = COURSES.find((c) => c.id === lesson.courseId || c.courseCode === lesson.courseId || c.name === lesson.courseName);
    if (matchingCourse && matchingCourse.id !== selectedCourse.id) {
      setSelectedCourse(matchingCourse);
    }
    setCurrentStageId(lesson.stageId);
    setActiveView('stage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync completion and unlock states when course changes
  useEffect(() => {
    try {
      localStorage.setItem('kieltech_selected_course', JSON.stringify(selectedCourse));
    } catch {}

    if (previousCourseId.current === selectedCourse.id) return;
    previousCourseId.current = selectedCourse.id;

    try {
      const keyCompleted = `kieltech_completed_stages_${selectedCourse.id}`;
      const savedCompleted = localStorage.getItem(keyCompleted);
      setCompletedStageIds(savedCompleted ? JSON.parse(savedCompleted) : []);

      const keyUnlocked = `kieltech_unlocked_stages_${selectedCourse.id}`;
      const savedUnlocked = localStorage.getItem(keyUnlocked);
      setUnlockedStageIds(savedUnlocked ? JSON.parse(savedUnlocked) : [1]);

      const keyGrad = `kieltech_graduated_${selectedCourse.id}`;
      setHasGraduatedCourse(localStorage.getItem(keyGrad) === 'true');

      setCurrentStageId(1);
      setActiveView('stage');
    } catch {}
  }, [selectedCourse]);

  // Sync completedStageIds to localStorage
  useEffect(() => {
    try {
      const key = `kieltech_completed_stages_${selectedCourse.id}`;
      localStorage.setItem(key, JSON.stringify(completedStageIds));
    } catch {}
  }, [completedStageIds, selectedCourse.id]);

  // Sync unlockedStageIds to localStorage
  useEffect(() => {
    try {
      const key = `kieltech_unlocked_stages_${selectedCourse.id}`;
      localStorage.setItem(key, JSON.stringify(unlockedStageIds));
    } catch {}
  }, [unlockedStageIds, selectedCourse.id]);

  // Sync hasGraduatedCourse to localStorage
  useEffect(() => {
    try {
      const key = `kieltech_graduated_${selectedCourse.id}`;
      localStorage.setItem(key, hasGraduatedCourse ? 'true' : 'false');
    } catch {}
  }, [hasGraduatedCourse, selectedCourse.id]);

  // Sync testResults to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kieltech_student_test_results', JSON.stringify(testResults));
    } catch {}
  }, [testResults]);

  // Load cloud progress before allowing local state to be written back to the account.
  useEffect(() => {
    if (!user || profile?.currentCourseId !== selectedCourse.id) return;
    const progressKey = `${user.uid}:${selectedCourse.id}`;
    let isCurrent = true;
    setLoadedProgressKey(null);
    loadCourseProgressFromCloud(selectedCourse.id)
      .then((cloudData) => {
        if (!isCurrent) return;
        if (cloudData) {
          if (typeof cloudData.currentStageId === 'number') setCurrentStageId(cloudData.currentStageId);
          if (Array.isArray(cloudData.completedStageIds)) {
            setCompletedStageIds((previous) => Array.from(new Set([...previous, ...cloudData.completedStageIds!])));
          }
          if (Array.isArray(cloudData.unlockedStageIds)) {
            setUnlockedStageIds((previous) => Array.from(new Set([...previous, ...cloudData.unlockedStageIds!])));
          }
          if (cloudData.defensePassed) setHasGraduatedCourse(true);
        }
        setLoadedProgressKey(progressKey);
      })
      .catch((error) => console.error('Could not load course progress from the student account:', error));
    return () => {
      isCurrent = false;
    };
  }, [user, profile?.currentCourseId, selectedCourse.id, loadCourseProgressFromCloud]);

  // Sync course progress to Cloud Firestore on progress change
  useEffect(() => {
    if (!user || profile?.currentCourseId !== selectedCourse.id || loadedProgressKey !== `${user.uid}:${selectedCourse.id}`) return;
    syncCourseProgressToCloud(selectedCourse.id, {
      currentStageId,
      completedStageIds,
      unlockedStageIds,
      defensePassed: hasGraduatedCourse,
    }).catch((error) => console.error('Could not save course progress to the student account:', error));
  }, [user, profile?.currentCourseId, loadedProgressKey, selectedCourse.id, completedStageIds, unlockedStageIds, hasGraduatedCourse, currentStageId, syncCourseProgressToCloud]);

  // Handlers for Home Page Onboarding Flow (Get Started -> Auth -> Cookies -> Track Selection)
  const handleGetStarted = () => {
    setIsOnboardingFlow(true);
    // 1. If not logged in yet -> Open Sign In / Sign Up Modal
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    // 2. If logged in but hasn't confirmed cookie preferences -> Open Cookie Consent
    if (!hasAcceptedCookies) {
      setShowCookieModal(true);
      return;
    }

    // 3. Logged in and cookies accepted -> Open Course & Track Selection
    setShowWelcomeModal(true);
  };

  // Automatically advance onboarding when student signs in
  useEffect(() => {
    if (user && profile && accountCourseRestored && isOnboardingFlow) {
      setAuthModalOpen(false);
      if (!hasAcceptedCookies) {
        setShowCookieModal(true);
      } else {
        const savedCourse = COURSES.find((course) => course.id === profile.currentCourseId);
        if (savedCourse) {
          setSelectedCourse(savedCourse);
          setActiveView('stage');
          setShowWelcomeModal(false);
        } else {
          setShowWelcomeModal(true);
        }
        setIsOnboardingFlow(false);
      }
    }
  }, [user, profile, accountCourseRestored, isOnboardingFlow, hasAcceptedCookies, setAuthModalOpen]);

  // Proceed as guest from AuthModal
  const handleContinueAsGuest = () => {
    setAuthModalOpen(false);
    if (!hasAcceptedCookies) {
      setShowCookieModal(true);
    } else {
      setShowWelcomeModal(true);
      setIsOnboardingFlow(false);
    }
  };

  // Handle Cookie Acceptance
  const handleAcceptCookies = () => {
    setHasAcceptedCookies(true);
    setShowCookieModal(false);
    const savedCourse = COURSES.find((course) => course.id === profile?.currentCourseId);
    if (user && savedCourse) {
      setSelectedCourse(savedCourse);
      setActiveView('stage');
      setIsOnboardingFlow(false);
    } else {
      setShowWelcomeModal(true);
    }
  };

  // Handle course selection from Welcome Modal
  const handleSelectLanguage = (course: LanguageCourse) => {
    setSelectedCourse(course);
    setShowWelcomeModal(false);
    setIsOnboardingFlow(false);
    setActiveView('stage');
    recordAcademicActivity({
      type: 'course-selected',
      courseId: course.id,
      courseName: course.name,
    });
    if (user) {
      syncCurrentCourseToCloud(course.id)
        .catch((error) => console.error('Could not save the selected course to the student account:', error));
    }
    try {
      localStorage.setItem('kieltech_has_visited', 'true');
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Record a completed test or graduation exam
  const handleRecordTestResult = (record: TestResultRecord) => {
    recordAcademicActivity({
      type: 'assessment-submitted',
      courseId: record.courseId,
      courseName: record.courseName,
      stageId: record.stageId,
      assessmentType: record.type,
      score: record.score,
      totalQuestions: record.totalQuestions,
      percentage: record.percentage,
      passed: record.passed,
    });
    setTestResults((prev) => [record, ...prev]);
    if (user) {
      syncTestResultToCloud(record)
        .catch((error) => console.error('Could not save the assessment result to the student account:', error));
    }

    // If passed stage test, mark stage as completed
    if (record.type === 'stage_test' && record.passed && record.stageId) {
      setCompletedStageIds((prev) =>
        prev.includes(record.stageId!) ? prev : [...prev, record.stageId!]
      );
    }

    // If passed graduation exam, set graduation status and unlock next stages!
    if (record.type === 'graduation_exam' && record.passed) {
      setHasGraduatedCourse(true);
      // Unlock next stage upon passing graduation exam
      if (currentStageId < courseStages.length) {
        const nextStageId = currentStageId + 1;
        setUnlockedStageIds((prev) =>
          prev.includes(nextStageId) ? prev : [...prev, nextStageId]
        );
      }
    }
  };

  const handleSelectStage = (stageId: number) => {
    setCurrentStageId(stageId);
    setActiveView('stage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user || activeView !== 'stage') return;
    const activityKey = `${user.uid}:${selectedCourse.id}:${currentStageId}`;
    if (lastViewedStageActivity.current === activityKey) return;
    lastViewedStageActivity.current = activityKey;
    recordAcademicActivity({
      type: 'stage-viewed',
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      stageId: currentStageId,
    });
  }, [user, activeView, selectedCourse.id, selectedCourse.name, currentStageId, recordAcademicActivity]);

  const currentStage =
    courseStages.find((s) => s.id === currentStageId) || courseStages[0];

  const graduationExam = getGraduationExamForCourse(selectedCourse.id);

  // Check if current stage has passed its mid-way test
  const isCurrentStageTestPassed =
    completedStageIds.includes(currentStage.id) ||
    testResults.some(
      (r) =>
        r.courseId === selectedCourse.id &&
        r.stageId === currentStage.id &&
        r.type === 'stage_test' &&
        r.passed
    );

  const handlePromoteToNextStage = () => {
    if (currentStageId < courseStages.length) {
      const nextId = currentStageId + 1;
      setUnlockedStageIds((prev) => (prev.includes(nextId) ? prev : [...prev, nextId]));
      setCurrentStageId(nextId);
      setActiveView('stage');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveView('stage');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenUniversityDiploma = () => {
    const passedExams = testResults.filter((r) => r.type === 'graduation_exam' && r.passed);
    const latestPass = passedExams[0];
    const scoreVal = latestPass ? latestPass.percentage : 88;

    const diploma: CertificateData = {
      certificateId: `KU-DIP-${(latestPass?.id || '2026').slice(-8).toUpperCase()}`,
      studentName: profile?.displayName || user?.displayName || 'Candidate in Software Engineering',
      studentId: profile?.studentId || 'KT-2026-CS8841',
      courseName: selectedCourse.name,
      courseCode: selectedCourse.courseCode || 'CS-301',
      completionDate: latestPass
        ? new Date(latestPass.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'October 2026',
      honorsStanding: scoreVal >= 90 ? 'Magna Cum Laude (High Honors)' : 'Academic Honors Standing',
      finalGrade: scoreVal >= 90 ? 'A' : 'B+',
      gpa: scoreVal >= 90 ? 3.9 : 3.4,
      institution: 'KielTech Academy',
      chancellor: 'Prof. Alistair Vance, Ph.D.',
      dean: 'Dr. Eleanor Wright, D.Sc.',
      verificationCode: `SHA256:7f3b${Date.now().toString().slice(-6)}e2a`,
    };

    setActiveDiplomaModal(diploma);
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'theme-light bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-200 transition-colors duration-200`}>
      {/* Student Authentication Modal (Google & Email Sign-In) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setIsOnboardingFlow(false);
        }}
        onContinueAsGuest={handleContinueAsGuest}
      />

      {/* Academic Cookie & Session Storage Modal */}
      <CookieConsentModal
        isOpen={showCookieModal}
        onAccept={handleAcceptCookies}
        onClose={() => setShowCookieModal(false)}
      />

      {/* Official Diploma Modal */}
      {activeDiplomaModal && (
        <UniversityDiplomaModal
          isOpen={!!activeDiplomaModal}
          onClose={() => setActiveDiplomaModal(null)}
          certificate={activeDiplomaModal}
        />
      )}

      {/* Welcome Modal for track & language selection */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Top Navigation Bar */}
      <Navbar
        onBrandClick={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeView={activeView}
        onNavigateHome={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        courseName={selectedCourse.name}
        courseCode={selectedCourse.courseCode}
        categoryName={selectedCourse.category}
        completedStagesCount={completedStageIds.length}
        totalStages={courseStages.length}
        hasGraduated={hasGraduatedCourse}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isSidebarOpen={isSidebarOpenDesktop}
        onToggleSidebar={handleToggleSidebar}
        onOpenMobileSidebar={() => setIsSidebarOpenMobile(true)}
        onSwitchTrack={() => setShowWelcomeModal(true)}
        onOpenDiploma={handleOpenUniversityDiploma}
        onOpenResults={() => {
          setActiveView('results');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onToggleAdminPage={() => {
          if (profile?.role !== 'admin' && profile?.role !== 'owner') return;
          if (activeView === 'admin' || activeView === 'curriculum-review' || activeView === 'owner-management') {
            setActiveView(previousAdminReturnView.current);
          } else {
            previousAdminReturnView.current = activeView;
            setActiveView('admin');
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Primary Layout Router: Home Page vs Academic Workspace */}
      {activeView === 'home' ? (
        <main className="flex-1 w-full min-w-0">
          <HomePage
            onGetStarted={handleGetStarted}
            onExploreCurriculum={handleGetStarted}
            onSelectCourseDirect={(course) => {
              if (user) {
                setSelectedCourse(course);
              }
              handleGetStarted();
            }}
            currentCourse={selectedCourse}
          />
        </main>
      ) : activeView === 'admin' || activeView === 'curriculum-review' || activeView === 'owner-management' ? (
        profile?.role === 'admin' || profile?.role === 'owner' ? (
          <div className="mx-auto flex w-full max-w-7xl flex-1 transition-all duration-300">
            <Sidebar
              course={selectedCourse}
              stages={courseStages}
              currentStageId={currentStageId}
              completedStageIds={completedStageIds}
              unlockedStageIds={unlockedStageIds}
              activeView="stage"
              hasGraduated={hasGraduatedCourse}
              bookmarkedLessons={bookmarkedLessons}
              onSelectStage={handleSelectStage}
              onSelectBookmarkedLesson={handleSelectBookmarkedLesson}
              onRemoveBookmark={handleRemoveBookmark}
              onOpenResults={() => {
                setActiveView('results');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAbout={() => {
                setActiveView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenPrivacyPolicy={() => {
                setActiveView('privacy-policy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenExam={() => {
                if (!isCurrentStageTestPassed) return;
                recordAcademicActivity({
                  type: 'degree-defense-started',
                  courseId: selectedCourse.id,
                  courseName: selectedCourse.name,
                  stageId: currentStageId,
                });
                setActiveView('exam');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDiploma={handleOpenUniversityDiploma}
              onChangeCourse={() => setShowWelcomeModal(true)}
              onSelectCourse={(course) => handleSelectLanguage(course)}
              isOpenMobile={isSidebarOpenMobile}
              onCloseMobile={() => setIsSidebarOpenMobile(false)}
              isOpenDesktop={isSidebarOpenDesktop}
              onToggleDesktop={handleToggleSidebar}
            />
            <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
              {activeView === 'admin' ? (
                  <AdminDashboard
                    adminId={user?.uid ?? profile.id}
                    onOpenCurriculumReview={() => setActiveView('curriculum-review')}
                    isOwner={profile.role === 'owner'}
                    onManageAdmins={() => setActiveView('owner-management')}
                  />
                ) : activeView === 'owner-management' ? (
                  profile.role === 'owner'
                    ? <OwnerManagementView />
                    : <AdminDashboard
                      adminId={user?.uid ?? profile.id}
                      onOpenCurriculumReview={() => setActiveView('curriculum-review')}
                    />
                ) : (
                  <CurriculumReviewView adminId={user?.uid ?? profile.id} />
                )}
            </main>
          </div>
        ) : (
          <main className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 py-12">
            <section className="w-full rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 text-center">
              <h1 className="text-xl font-bold text-white">Admin access required</h1>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This page is available only to accounts with the administrator or owner role.
              </p>
              <button
                className="mt-5 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-300"
                onClick={() => setActiveView('home')}
                type="button"
              >
                Return home
              </button>
            </section>
          </main>
        )
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto transition-all duration-300">
          <Sidebar
            course={selectedCourse}
            stages={courseStages}
            currentStageId={currentStageId}
            completedStageIds={completedStageIds}
            unlockedStageIds={unlockedStageIds}
            activeView={activeView}
            hasGraduated={hasGraduatedCourse}
            bookmarkedLessons={bookmarkedLessons}
            onSelectStage={handleSelectStage}
            onSelectBookmarkedLesson={handleSelectBookmarkedLesson}
            onRemoveBookmark={handleRemoveBookmark}
            onOpenResults={() => {
              setActiveView('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAbout={() => {
              setActiveView('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPrivacyPolicy={() => {
              setActiveView('privacy-policy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenExam={() => {
              recordAcademicActivity({
                type: 'degree-defense-started',
                courseId: selectedCourse.id,
                courseName: selectedCourse.name,
                stageId: currentStageId,
              });
              setActiveView('exam');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDiploma={handleOpenUniversityDiploma}
            onChangeCourse={() => setShowWelcomeModal(true)}
            onSelectCourse={(course) => handleSelectLanguage(course)}
            isOpenMobile={isSidebarOpenMobile}
            onCloseMobile={() => setIsSidebarOpenMobile(false)}
            isOpenDesktop={isSidebarOpenDesktop}
            onToggleDesktop={() => handleToggleSidebar()}
          />

          {/* Content Pane */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeView === 'about' && <AboutView />}
          {activeView === 'privacy-policy' && <PrivacyPolicyView />}
          {/* View 1: Normal Stage Teachings */}
          {activeView === 'stage' && (
            <StageTeachingView
              courseId={selectedCourse.id}
              userId={user?.uid}
              onNavigateToStage={(stageId) => {
                setCurrentStageId(stageId);
                setActiveView('stage');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              courseName={selectedCourse.name}
              courseCode={selectedCourse.courseCode}
              department={selectedCourse.department}
              stage={currentStage}
              totalStages={courseStages.length}
              isStageTestPassed={isCurrentStageTestPassed}
              hasGraduatedCourse={hasGraduatedCourse}
              bookmarkedLessonIds={bookmarkedLessons.map((b) => b.id)}
              onToggleBookmark={handleToggleBookmark}
              onReadyForTest={() => {
                recordAcademicActivity({
                  type: 'stage-test-started',
                  courseId: selectedCourse.id,
                  courseName: selectedCourse.name,
                  stageId: currentStageId,
                });
                setActiveView('test');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReadyToGraduate={() => {
                if (!isCurrentStageTestPassed) return;
                recordAcademicActivity({
                  type: 'degree-defense-started',
                  courseId: selectedCourse.id,
                  courseName: selectedCourse.name,
                  stageId: currentStageId,
                });
                setActiveView('exam');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNextStage={handlePromoteToNextStage}
            />
          )}

          {/* View 2: Locked Stage Test */}
          {activeView === 'test' && (
            <StageTestView
              courseId={selectedCourse.id}
              courseName={selectedCourse.name}
              stage={currentStage}
              onSubmitResult={handleRecordTestResult}
              onReturnToStage={() => {
                setActiveView('stage');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* View 3: Result Portal */}
          {activeView === 'results' && (
            <ResultPortal
              courseName={selectedCourse.name}
              courseCode={selectedCourse.courseCode}
              department={selectedCourse.department}
              results={testResults.filter((r) => r.courseId === selectedCourse.id)}
              onBackToCourse={() => {
                setActiveView('stage');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onClearHistory={() => {
                setTestResults((prev) => prev.filter((r) => r.courseId !== selectedCourse.id));
              }}
            />
          )}

          {/* View 4: Graduation Examination with Code Playground */}
          {activeView === 'exam' && isCurrentStageTestPassed && (
            <GraduationExamView
              courseId={selectedCourse.id}
              courseName={selectedCourse.name}
              currentStageId={currentStageId}
              totalStages={courseStages.length}
              exam={graduationExam}
              onSubmitResult={handleRecordTestResult}
              onBackToCourse={() => {
                setActiveView('stage');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onPromoteToNextStage={handlePromoteToNextStage}
            />
          )}

          {activeView === 'exam' && !isCurrentStageTestPassed && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
              <h2 className="text-lg font-bold text-white">Mid-term pass required</h2>
              <p className="mt-2 text-sm text-slate-300">
                Pass this stage’s mid-term assessment to unlock the degree defense.
              </p>
              <button
                type="button"
                onClick={() => setActiveView('stage')}
                className="mt-4 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300"
              >
                Return to course
              </button>
            </div>
          )}

        </main>
      </div>
      )}

      <Footer
        onBrandClick={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCookies={() => setShowCookieModal(true)}
      />
    </div>
  );
}
