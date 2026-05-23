"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { KeyRound, Mail, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  // Redirect to dashboard if session already exists
  useEffect(() => {
    const checkSession = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Supabase is not configured yet. Please set environment variables.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-gray-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-300/30 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-purple-300/30 rounded-full blur-[80px]" />

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 hover:rotate-6 transition-transform">
            C
          </div>
          <h1 className="text-2xl font-black text-slate-800">Admin Console</h1>
          <p className="text-sm text-gray-500 mt-1">Classy Missy Collection Dashboard</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex gap-3 items-start text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">Configuration Required</p>
              Please set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local` to enable login.
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={!isSupabaseConfigured}
                placeholder="admin@classymissy.gy"
                className="w-full bg-white/50 border border-gray-200 focus:border-transparent focus:ring-2 focus:ring-pink-500 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-800 outline-none transition-all disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={!isSupabaseConfigured}
                placeholder="••••••••"
                className="w-full bg-white/50 border border-gray-200 focus:border-transparent focus:ring-2 focus:ring-pink-500 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-800 outline-none transition-all disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs font-medium text-red-500 bg-red-50 border border-red-100 p-3 rounded-xl">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-pink-500/20 active:scale-95 disabled:opacity-50 disabled:hover:shadow-none disabled:active:scale-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
