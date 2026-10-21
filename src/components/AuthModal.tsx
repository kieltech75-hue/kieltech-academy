import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KielTechLogo } from './KielTechLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest?: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onContinueAsGuest,
  title = 'Student Matriculation & SSO',
  subtitle = 'Sign in to persist your academic transcript, exam scores, and conferred university diploma.'
}) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed before completing.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('The sign-in popup was blocked by your browser. Please allow popups for this site or try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized in Firebase. Please add this domain under Firebase Console > Authentication > Settings > Authorized domains.');
      } else {
        setError(err.message || 'Failed to authenticate with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSent(false);

    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      setError('Please provide a valid student or institutional email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await sendPasswordReset(emailTrimmed);
        setResetSent(true);
      } catch (err: any) {
        console.error('Password Reset Error:', err);
        if (err.code === 'auth/user-not-found') {
          setError('No student account found with this email address.');
        } else if (err.code === 'auth/invalid-email') {
          setError('Invalid email address format.');
        } else {
          setError(err.message || 'Failed to dispatch password reset email.');
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your full legal student name for official records.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(emailTrimmed, password);
      } else {
        await signUpWithEmail(emailTrimmed, password, name.trim());
      }
      onClose();
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid academic email or password credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email is already matriculated. Please sign in instead.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password provider is not yet activated in Firebase Console. Please use 1-Click Google Sign-In above, or enable Email/Password under Firebase Console > Authentication > Sign-in method.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please include letters and numbers.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed sign-in attempts. Account access is temporarily throttled. Please try again shortly or reset your password.');
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle decorative top aura */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors z-20 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="pt-7 px-6 pb-4 text-center border-b border-slate-800 relative z-10 shrink-0">
          <div className="flex justify-center mb-3">
            <KielTechLogo className="h-14 w-14 object-contain" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span>KielTech Academic SSO</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">
            {mode === 'forgot' ? 'Reset Student Password' : title}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-sm mx-auto">
            {mode === 'forgot' 
              ? 'Enter your student email address to receive an official password reset link.'
              : subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 relative z-10 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 text-xs animate-in slide-in-from-top-1 leading-relaxed">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetSent && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs animate-in slide-in-from-top-1 leading-relaxed">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>A password reset link has been dispatched to your email address. Please check your inbox and spam folders.</span>
            </div>
          )}

          {/* 1-Click Google Sign-In Button */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-slate-300 active:scale-[0.99]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-700" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative px-3 bg-slate-900 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  or university credentials
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(null); setResetSent(false); }}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); setResetSent(false); }}
                  className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Register Account
                </button>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Student Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Student Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@kieltech.edu or personal email"
                  required
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Security Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); setResetSent(false); }}
                      className="text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    disabled={isLoading}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Processing Request...</span>
                </>
              ) : mode === 'signin' ? (
                <>
                  <span>Sign In to Student Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : mode === 'signup' ? (
                <>
                  <GraduationCap className="h-4 w-4" />
                  <span>Matriculate & Create Account</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Send Password Reset Link</span>
                </>
              )}
            </button>

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); setResetSent(false); }}
                className="w-full flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 hover:text-white font-mono py-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Back to Sign In</span>
              </button>
            )}

            {onContinueAsGuest && mode !== 'forgot' && (
              <button
                type="button"
                onClick={onContinueAsGuest}
                className="w-full text-center text-xs text-slate-400 hover:text-amber-300 font-mono py-1.5 transition-colors cursor-pointer mt-1"
              >
                Or proceed as Candidate / Guest Student →
              </button>
            )}
          </form>

          {/* Academic Privacy Guarantee */}
          <div className="pt-2 text-center text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>ABAC Zero-Trust Cloud Storage • End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
