import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any, token: string) => void;
}

const GOOGLE_CLIENT_ID = '406817513870-g70h24bmi8216l6i1kpibd7nodgd9lhh.apps.googleusercontent.com';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Google OAuth Credential response
  const handleGoogleCallback = async (response: any) => {
    if (!response || !response.credential) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google Login failed.');
      }

      localStorage.setItem('vishlink_token', data.token);
      localStorage.setItem('vishlink_user', JSON.stringify(data.user));
      onSuccess(data.user, data.token);
      onClose();

    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign In failed.');
    } finally {
      setLoading(false);
    }
  };

  // Load Google Identity Services script
  useEffect(() => {
    if (!isOpen) return;

    const initializeGoogleScript = () => {
      if ((window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
          });

          const btnEl = document.getElementById('google-signin-button-div');
          if (btnEl) {
            btnEl.innerHTML = '';
            (window as any).google.accounts.id.renderButton(btnEl, {
              theme: 'outline',
              size: 'large',
              width: 340,
              text: 'continue_with',
              shape: 'pill',
            });
          }
        } catch (e) {
          console.error('Google Accounts ID Init error:', e);
        }
      }
    };

    if (!(window as any).google?.accounts?.id) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleScript;
      document.head.appendChild(script);
    } else {
      setTimeout(initializeGoogleScript, 100);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload =
      mode === 'login'
        ? { emailOrUsername: email, password }
        : { email, username, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('vishlink_token', data.token);
      localStorage.setItem('vishlink_user', JSON.stringify(data.user));
      onSuccess(data.user, data.token);
      onClose();

    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleClick = () => {
    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.prompt();
    } else {
      setErrorMsg('Google Sign-In is initializing. Please try again in a second.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all border border-rose-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#e15b70] to-[#f49db0] text-white shadow-md shadow-rose-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'login' ? 'Welcome Back to VishLink' : 'Create VishLink Account'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {mode === 'login'
              ? 'Enter your credentials or use Google to sign in.'
              : 'Sign up to create & save your personalized wishing websites.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Tab Selector */}
        <div className="mb-6 flex rounded-2xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
              mode === 'login' ? 'bg-white text-[#e15b70] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
              mode === 'register' ? 'bg-white text-[#e15b70] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Kunal Vishu"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-[#e15b70] focus:outline-hidden focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {mode === 'login' ? 'Email Address or Username' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={mode === 'login' ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'login' ? 'Enter email or username' : 'name@example.com'}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-[#e15b70] focus:outline-hidden focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-[#e15b70] focus:outline-hidden focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e15b70] to-[#d4485e] py-3 text-sm font-bold text-white shadow-md shadow-rose-200 hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? (
              <span>Please wait...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="h-4 w-4" /> Log In
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-slate-400">or continue with</span>
        </div>

        {/* Official Google Sign-In Button Container */}
        <div className="flex flex-col items-center justify-center min-h-[44px]">
          <div id="google-signin-button-div" className="flex justify-center" />
          <button
            type="button"
            onClick={handleCustomGoogleClick}
            className="mt-2 text-xs font-semibold text-[#e15b70] hover:underline cursor-pointer"
          >
            Use Google One Tap Sign-In
          </button>
        </div>
      </div>
    </div>
  );
};
