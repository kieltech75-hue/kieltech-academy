import React, { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { 
  User, 
  browserLocalPersistence,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  setPersistence,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  collection,
  addDoc,
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { TestResultRecord } from '../types/curriculum';
import { AcademicActivityType } from '../types/adminActivity';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_TIMEOUT_MS = 2_147_000_000;

interface CourseProgress {
  currentStageId?: number;
  completedStageIds?: number[];
  unlockedStageIds?: number[];
  defensePassed?: boolean;
  defenseScore?: number;
  conferredDiplomaDate?: string;
  testScores?: Record<string, number>;
  updatedAt?: string;
}

export interface StudentProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'student' | 'faculty' | 'admin';
  studentId: string;
  currentCourseId?: string;
  matriculationDate: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: StudentProfile | null;
  loading: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncCourseProgressToCloud: (courseId: string, progress: {
    currentStageId: number;
    completedStageIds: number[];
    unlockedStageIds: number[];
    defensePassed: boolean;
    defenseScore?: number;
    conferredDiplomaDate?: string;
    testScores?: Record<string, number>;
  }) => Promise<void>;
  loadCourseProgressFromCloud: (courseId: string) => Promise<CourseProgress | null>;
  syncCurrentCourseToCloud: (courseId: string) => Promise<void>;
  loadMostRecentCourseIdFromCloud: () => Promise<string | null>;
  syncTestResultToCloud: (result: TestResultRecord) => Promise<void>;
  loadTestResultsFromCloud: () => Promise<TestResultRecord[]>;
  recordAcademicActivity: (event: {
    type: AcademicActivityType;
    courseId?: string;
    courseName?: string;
    stageId?: number;
    assessmentType?: 'stage_test' | 'graduation_exam';
    score?: number;
    totalQuestions?: number;
    percentage?: number;
    passed?: boolean;
    lessonTitle?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate deterministic-looking academic student ID
function generateStudentId(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = (hash * 31 + uid.charCodeAt(i)) & 0xffffffff;
  }
  const num = Math.abs(hash % 90000) + 10000;
  return `KT-${num}`;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recordAcademicActivity: AuthContextType['recordAcademicActivity'] = useCallback(async (event) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, 'academicActivity'), {
        actorUid: auth.currentUser.uid,
        ...event,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Could not record academic activity (${event.type}):`, error);
    }
  }, []);

  // Sync / create profile in Firestore
  const syncUserProfile = async (firebaseUser: User): Promise<StudentProfile> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snap = await getDoc(userDocRef);
      const now = new Date().toISOString();

      if (snap.exists()) {
        const data = snap.data() as StudentProfile;
        await updateDoc(userDocRef, { updatedAt: now });
        return data;
      } else {
        const studentId = generateStudentId(firebaseUser.uid);
        const newProfile: StudentProfile = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Student'),
          ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
          role: 'student',
          studentId,
          matriculationDate: now,
          createdAt: now,
          updatedAt: now,
        };
        await setDoc(userDocRef, newProfile);
        return newProfile;
      }
    } catch (err) {
      console.error('Error syncing user profile in Firestore:', err);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
      if (currentUser) {
        try {
          const token = await currentUser.getIdTokenResult();
          const authenticatedAt = Date.parse(token.authTime);
          if (!Number.isFinite(authenticatedAt)) {
            throw new Error('Firebase did not provide a valid authentication timestamp.');
          }

          const expireSession = async () => {
            const remaining = authenticatedAt + SESSION_DURATION_MS - Date.now();
            if (remaining > 0) {
              sessionTimerRef.current = setTimeout(expireSession, Math.min(remaining, MAX_TIMEOUT_MS));
              return;
            }
            try {
              await fbSignOut(auth);
              setAuthModalOpen(true);
            } catch (error) {
              console.error('Could not end the expired student session:', error);
            }
          };

          if (authenticatedAt + SESSION_DURATION_MS <= Date.now()) {
            await fbSignOut(auth);
            setUser(null);
            setProfile(null);
            setAuthModalOpen(true);
            setLoading(false);
            return;
          }

          sessionTimerRef.current = setTimeout(
            expireSession,
            Math.min(authenticatedAt + SESSION_DURATION_MS - Date.now(), MAX_TIMEOUT_MS)
          );
          setUser(currentUser);
          const prof = await syncUserProfile(currentUser);
          setProfile(prof);
        } catch (e) {
          console.error('Failed to load profile on auth state change:', e);
          setUser(currentUser);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const prof = await syncUserProfile(res.user);
        setProfile(prof);
        setAuthModalOpen(false);
        await recordAcademicActivity({ type: 'sign-in' });
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (res.user) {
        const prof = await syncUserProfile(res.user);
        setProfile(prof);
        setAuthModalOpen(false);
        await recordAcademicActivity({ type: 'sign-in' });
      }
    } catch (error: any) {
      console.error('Email Sign-In Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (res.user) {
        if (name.trim()) {
          await updateProfile(res.user, { displayName: name.trim() });
        }
        const prof = await syncUserProfile(res.user);
        setProfile(prof);
        setAuthModalOpen(false);
        await recordAcademicActivity({ type: 'account-created' });
      }
    } catch (error: any) {
      console.error('Email Sign-Up Error:', error);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: any) {
      console.error('Password Reset Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await recordAcademicActivity({ type: 'sign-out' });
      await fbSignOut(auth);
      setProfile(null);
      setUser(null);
    } catch (error: any) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  };

  const syncCourseProgressToCloud = async (courseId: string, progress: {
    currentStageId: number;
    completedStageIds: number[];
    unlockedStageIds: number[];
    defensePassed: boolean;
    defenseScore?: number;
    conferredDiplomaDate?: string;
    testScores?: Record<string, number>;
  }) => {
    if (!user) return;
    const progDocRef = doc(db, 'users', user.uid, 'progress', courseId);
    await setDoc(progDocRef, {
      userId: user.uid,
      courseId,
      currentStageId: progress.currentStageId,
      completedStageIds: progress.completedStageIds,
      unlockedStageIds: progress.unlockedStageIds,
      defensePassed: progress.defensePassed,
      defenseScore: progress.defenseScore ?? null,
      conferredDiplomaDate: progress.conferredDiplomaDate ?? null,
      testScores: progress.testScores ?? {},
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  };

  const loadCourseProgressFromCloud = async (courseId: string) => {
    if (!user) return null;
    const progDocRef = doc(db, 'users', user.uid, 'progress', courseId);
    const snap = await getDoc(progDocRef);
    return snap.exists() ? snap.data() as CourseProgress : null;
  };

  const syncCurrentCourseToCloud = async (courseId: string) => {
    if (!user) return;
    const now = new Date().toISOString();
    await updateDoc(doc(db, 'users', user.uid), { currentCourseId: courseId, updatedAt: now });
    setProfile((previous) => previous ? { ...previous, currentCourseId: courseId, updatedAt: now } : previous);
  };

  const loadMostRecentCourseIdFromCloud = async () => {
    if (!user) return null;
    const progressSnapshot = await getDocs(collection(db, 'users', user.uid, 'progress'));
    const latestProgress = progressSnapshot.docs
      .map((progressDoc) => progressDoc.data() as CourseProgress & { courseId: string })
      .sort((first, second) => (second.updatedAt || '').localeCompare(first.updatedAt || ''))[0];
    return latestProgress?.courseId || null;
  };

  const syncTestResultToCloud = async (result: TestResultRecord) => {
    if (!user) return;
    const serializableResult = JSON.parse(JSON.stringify(result)) as TestResultRecord;
    await setDoc(doc(db, 'users', user.uid, 'results', result.id), {
      ...serializableResult,
      userId: user.uid,
    });
  };

  const loadTestResultsFromCloud = async () => {
    if (!user) return [];
    const resultsSnapshot = await getDocs(collection(db, 'users', user.uid, 'results'));
    return resultsSnapshot.docs
      .map((resultDoc) => resultDoc.data() as TestResultRecord)
      .sort((first, second) => second.timestamp - first.timestamp);
  };

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    authModalOpen,
    setAuthModalOpen,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    signOut,
    syncCourseProgressToCloud,
    loadCourseProgressFromCloud,
    syncCurrentCourseToCloud,
    loadMostRecentCourseIdFromCloud,
    syncTestResultToCloud,
    loadTestResultsFromCloud,
    recordAcademicActivity,
  }), [user, profile, loading, authModalOpen, recordAcademicActivity]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
