'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        if (!name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        result = await register(email, password, name);
      }

      if (result.success) {
        onOpenChange(false);
        setEmail('');
        setPassword('');
        setName('');
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        onOpenChange(false);
        // If not already on home page, push to home or dashboard
        // But since this is a modal, often we just close it and let state update
        // However, if we want to force navigation:
        // router.push('/'); 
      } else {
        setError(result.error || 'Google Sign In failed');
      }
    } catch (error: any) {
      setError(`Error: ${error?.message || 'Something went wrong with Google Sign-in'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111] border border-white/5 text-white max-w-md rounded-3xl p-8 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            {isLogin ? 'Sign In' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-white/60 text-center">
            {isLogin
              ? 'Welcome back! Sign in to continue.'
              : 'Join Mormat Waves and start your music journey.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 mb-6 hover:bg-gray-200 transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
          </button>

          {/* Divider */}
          <div className="relative mb-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative bg-[#111] px-4 text-sm text-white/40">
              Or {isLogin ? 'sign in' : 'sign up'} with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-[#FF6B35]/50 focus:outline-none transition-colors placeholder:text-white/40"
                  placeholder="Full Name*"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-[#FF6B35]/50 focus:outline-none transition-colors placeholder:text-white/40"
                placeholder="Email*"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-[#FF6B35]/50 focus:outline-none transition-colors placeholder:text-white/40"
                placeholder="Password*"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg py-2 px-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl mt-6 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up for Free'}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (isLogin) {
                  onOpenChange(false);
                  router.push('/signup');
                } else {
                  setIsLogin(true);
                  setError('');
                }
              }}
              className="text-sm text-white/40 hover:text-[#FF6B35] transition-colors"
            >
              {isLogin
                ? (
                  <>
                    Don't have an account? <span className="text-[#FF6B35] font-bold">Sign up</span>
                  </>
                )
                : (
                  <>
                    Already have an account? <span className="text-[#FF6B35] font-bold">Sign in</span>
                  </>
                )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
