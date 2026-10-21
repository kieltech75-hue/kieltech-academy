import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cookie, 
  Lock, 
  Sliders, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Info,
  ArrowRight,
  Database,
  Code2
} from 'lucide-react';
import { KielTechLogo } from './KielTechLogo';

export interface CookiePreferences {
  essential: boolean;     // always true
  functional: boolean;    // workspace, code buffers, theme
  analytics: boolean;     // optional anonymous usage measurement
  acceptedAt: string;
}

interface CookieConsentModalProps {
  isOpen: boolean;
  onAccept: (prefs: CookiePreferences) => void;
  onClose?: () => void;
}

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
  isOpen,
  onAccept,
  onClose,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  if (!isOpen) return null;

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      acceptedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('kieltech_cookie_consent', JSON.stringify(prefs));
    } catch {}
    onAccept(prefs);
  };

  const handleAcceptEssentialOnly = () => {
    const prefs: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      acceptedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('kieltech_cookie_consent', JSON.stringify(prefs));
    } catch {}
    onAccept(prefs);
  };

  const handleSaveCustom = () => {
    const prefs: CookiePreferences = {
      essential: true,
      functional,
      analytics,
      acceptedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('kieltech_cookie_consent', JSON.stringify(prefs));
    } catch {}
    onAccept(prefs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-modal-title"
      >
        {/* Decorative Top Accent Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800 text-center relative z-10 shrink-0">
          <div className="flex justify-center mb-3">
            <KielTechLogo className="h-12 w-12 object-contain" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 mb-2">
            <Cookie className="h-3.5 w-3.5 text-amber-400" />
            <span>Academic Privacy & Data Governance</span>
          </div>

          <h2 id="cookie-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Academic Cookie & Session Storage Policy
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-lg mx-auto leading-relaxed">
            Before choosing your major curriculum track, review how this browser stores your sign-in session and how your academic progress is saved to your account.
          </p>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 space-y-4 overflow-y-auto relative z-10 flex-1 text-xs">
          {/* Quick Notice Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Zero Advertising • Zero Third-Party Tracker Selling</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              We do not sell student data or use advertising trackers. When you sign in, this browser can remember your session for up to 30 days. Course selection, stage progress, and assessment results are saved to your account so you can continue on another device after signing in there.
            </p>
          </div>

          {/* Toggle Details Button */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 transition-colors text-slate-300 font-mono text-[11px] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-amber-400" />
              <span>{showDetails ? 'Hide Detailed Preference Categories' : 'Review & Customize Category Preferences'}</span>
            </span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Detailed Categories */}
          {showDetails && (
            <div className="space-y-3 pt-1 animate-in slide-in-from-top-2">
              {/* Category 1: Essential (Required) */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-400" />
                    <span className="font-bold text-white text-xs">1. Strictly Necessary & Academic Records</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Always Active
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Required for Firebase Authentication and account-based academic records, including course progress, stage completion, and assessment results. These records sync to your account across devices when you sign in.
                </p>
              </div>

              {/* Category 2: Functional (Workspace & Preferences) */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-blue-400" />
                    <span className="font-bold text-white text-xs">2. Workspace State & UI Preferences</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={functional}
                      onChange={(e) => setFunctional(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Remembers this browser’s course and display preferences, including the theme and sidebar state. These preferences are stored on this device and are separate from your account’s academic progress.
                </p>
              </div>

              {/* Category 3: Optional Analytics */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">3. Optional Usage Analytics</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  This preference is reserved for anonymous product-usage measurement. It does not control your academic records, which are necessary to provide your account and course progress.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 shrink-0">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 order-2 sm:order-1">
            <Info className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span>Preferences can be adjusted at any time in the footer.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
            {showDetails ? (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Save Selected
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAcceptEssentialOnly}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700/80 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                Essential Only
              </button>
            )}

            <button
              type="button"
              onClick={handleAcceptAll}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-98"
            >
              <span>Accept & Choose Major</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
