"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeAppearance } from "@/components/theme-provider";

type AuthTab = "signin" | "signup" | "magic";

export default function LoginPage() {
  const router = useRouter();
  const { appearance } = useThemeAppearance();
  const isDark = appearance === "dark";
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signInWithOAuth(provider: "google") {
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OAuth error";
      setMessage(msg);
      setLoading(false);
    }
  }

  async function onSubmitPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getSupabaseBrowserClient();
      if (activeTab === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/dashboard");
      } else if (activeTab === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          router.replace("/dashboard");
        } else {
          setMessage("Account created. Check your email to confirm.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitMagic(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      if (error) throw error;
      setMessage("Check your email for the magic link.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send magic link";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="container mx-auto flex min-h-[100dvh] flex-col items-center justify-center px-4">
        <div className="mx-auto w-full max-w-md">

          <Card className="border-border/70 bg-card text-card-foreground shadow-sm">
            <CardHeader>
              <CardTitle className="text-center">{activeTab === "signup" ? "Create your account" : activeTab === "magic" ? "Sign in with a magic link" : "Sign in to your account"}</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                {activeTab === "signup"
                  ? "Start building with us—no credit card required."
                  : activeTab === "magic"
                  ? "We will email you a secure sign-in link."
                  : "Enter your credentials to continue."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 grid grid-cols-3 rounded-lg border border-border bg-muted p-1 text-sm">
                <button
                  className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${activeTab === "signin" ? (isDark ? "bg-white text-black" : "bg-black text-white") : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("signin")}
                  type="button"
                >
                  Sign in
                </button>
                <button
                  className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${activeTab === "signup" ? (isDark ? "bg-white text-black" : "bg-black text-white") : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("signup")}
                  type="button"
                >
                  Sign up
                </button>
                <button
                  className={`cursor-pointer rounded-md px-3 py-2 transition-colors ${activeTab === "magic" ? (isDark ? "bg-white text-black" : "bg-black text-white") : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setActiveTab("magic")}
                  type="button"
                >
                  Magic link
                </button>
              </div>

              <div className="relative">
                <div className="min-h-[240px]">
                  <div className={`transform transition-all duration-300 ease-out ${activeTab === "signin" ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"}`}>
                    <form onSubmit={onSubmitPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                      <Button type="submit" className={`w-full ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`} disabled={loading}>
                        Sign in
                      </Button>
                    </form>
                  </div>

                  <div className={`transform transition-all duration-300 ease-out ${activeTab === "signup" ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"}`}>
                    <form onSubmit={onSubmitPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                      <Button type="submit" className={`w-full ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`} disabled={loading}>
                        Create account
                      </Button>
                    </form>
                  </div>

                  <div className={`transform transition-all duration-300 ease-out ${activeTab === "magic" ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"}`}>
                    <form onSubmit={onSubmitMagic} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                      <Button type="submit" className={`w-full ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`} disabled={loading}>
                        Send magic link
                      </Button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-[1px] flex-1 bg-border" />
              </div>

              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className={`w-full ${isDark ? "border-neutral-800 bg-background text-foreground hover:bg-neutral-900" : "border-neutral-200 bg-background text-foreground hover:bg-neutral-50"}`}
                  disabled={loading}
                  onClick={() => signInWithOAuth("google")}
                >
                  Continue with Google
                </Button>
              </div>

              {message && <p className="mt-4 text-center text-sm text-muted-foreground">{message}</p>}
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our <a className="underline underline-offset-4" href="/terms">Terms</a> and <a className="underline underline-offset-4" href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
