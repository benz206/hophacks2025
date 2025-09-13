'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmitMagic(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      if (error) throw error;
      setMessage('Check your email for the magic link.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send magic link';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getSupabaseBrowserClient();
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Navigate to dashboard on success
        router.replace('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          // If email confirmation is disabled, user may be signed in immediately
          router.replace('/dashboard');
        } else {
          setMessage('Account created. Check your email to confirm.');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication error';
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'OAuth error';
      setMessage(msg);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Sign in</h1>

      <section className="space-y-3">
        <h2 className="font-medium">Email + password</h2>
        <form onSubmit={onSubmitPassword} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full border rounded px-3 py-2"
            required
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="signin"
                checked={mode === 'signin'}
                onChange={() => setMode('signin')}
              />
              Sign in
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="signup"
                checked={mode === 'signup'}
                onChange={() => setMode('signup')}
              />
              Sign up
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded bg-black text-white disabled:opacity-50"
          >
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </section>

      <div className="h-[1px] bg-neutral-200" />

      <section className="space-y-3">
        <h2 className="font-medium">Magic link</h2>
        <form onSubmit={onSubmitMagic} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded bg-black text-white disabled:opacity-50"
          >
            Send magic link
          </button>
        </form>
      </section>

      <div className="h-[1px] bg-neutral-200" />

      <section>
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full h-10 rounded border"
        >
          Continue with Google
        </button>
      </section>

      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
