"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeAppearance } from "@/components/theme-provider";
import { HeroBackground } from "@/components/hero-background";
import { Eye, EyeOff, Github, Lock, Mail, CheckCircle2 } from "lucide-react";

type AuthTab = "signin" | "signup" | "magic";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M12 12.545h10.545c.091.545.182 1.273.182 2.182 0 4.455-2.909 7.636-7.091 7.636-4.273 0-7.818-3.545-7.818-7.909s3.545-7.909 7.818-7.909c2.182 0 3.818.727 5.091 1.818l-2.182 2.182c-.545-.364-1.636-1.091-2.909-1.091-2.636 0-4.909 2.182-4.909 5 0 2.818 2.273 5 4.909 5 2.273 0 3.636-1.364 4.091-3.182h-4.091v-2.727z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { appearance } = useThemeAppearance();
  const isDark = appearance === "dark";
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function signInWithOAuth(provider: "google" | "github") {
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
      <div className="relative">
        <HeroBackground />
        <div className="container mx-auto px-4 py-10">
          <div className="grid min-h-[80dvh] items-center gap-10 lg:grid-cols-2">
            <div className="hidden lg:block">
              <div className="mx-auto max-w-lg relative overflow-hidden rounded-2xl border border-border bg-card p-6">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[oklch(0.68_0.15_280_/_0.7)] to-transparent" aria-hidden />
                <div className="pointer-events-none absolute -inset-16" aria-hidden>
                  <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.2_280/_0.8),transparent_60%)] blur-3xl" />
                  <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.18_330/_0.75),transparent_60%)] blur-3xl" />
                  <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.16_240/_0.7),transparent_60%)] blur-3xl" />
                </div>
                <div className="relative">
                  <div className="inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-xs">
                    <span className="text-muted-foreground">Welcome back</span>
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Sign in and get building
                  </h1>
                  <p className="mt-3 text-base text-muted-foreground">
                    Access your dashboard to create agents, provision numbers, and track live calls.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                      <span>Realtime analytics and transcripts</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                      <span>Sub‑second latency, production‑ready</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                      <span>Secure by default with SOC 2 practices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
                    <div>
                      <div className={`transform transition-all duration-300 ease-out ${activeTab === "signin" ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"}`}>
                        <form onSubmit={onSubmitPassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-9" />
                              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-9 pr-9" />
                              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <Button type="submit" className={`w-full ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`} disabled={loading} aria-busy={loading}>
                            {loading ? "Please wait…" : "Sign in"}
                          </Button>
                        </form>
                      </div>

                      <div className={`transform transition-all duration-300 ease-out ${activeTab === "signup" ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"}`}>
                        <form onSubmit={onSubmitPassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-9" />
                              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Input id="password" type={showPassword ? "text" : "password"} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-9 pr-9" />
                              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground">
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <Button type="submit" className={`w-full ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`} disabled={loading} aria-busy={loading}>
                            {loading ? "Creating…" : "Create account"}
                          </Button>
                        </form>
                      </div>

                      <div className={`transform transition-all duration-300 ease-out ${activeTab === "magic" ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 opacity-0 -translate-y-2"}`}>
                        <form onSubmit={onSubmitMagic} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-9" />
                              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                            </div>
                          </div>
                          <Button type="submit" className={`w-full ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`} disabled={loading} aria-busy={loading}>
                            {loading ? "Sending…" : "Send magic link"}
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
                      className={`w-full grid grid-cols-[1.25rem_1fr_1.25rem] items-center gap-0 ${isDark ? "border-neutral-800 bg-background text-foreground hover:bg-neutral-900" : "border-neutral-200 bg-background text-foreground hover:bg-neutral-50"}`}
                      disabled={loading}
                      onClick={() => signInWithOAuth("google")}
                    >
                      <span className="flex items-center justify-center"><GoogleIcon className="h-4 w-4" /></span>
                      <span className="text-center">Continue with Google</span>
                      <span aria-hidden="true" className="block w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      className={`w-full grid grid-cols-[1.25rem_1fr_1.25rem] items-center gap-0 ${isDark ? "border-neutral-800 bg-background text-foreground hover:bg-neutral-900" : "border-neutral-200 bg-background text-foreground hover:bg-neutral-50"}`}
                      disabled={loading}
                      onClick={() => signInWithOAuth("github")}
                    >
                      <span className="flex items-center justify-center"><Github className="h-4 w-4" aria-hidden="true" /></span>
                      <span className="text-center">Continue with GitHub</span>
                      <span aria-hidden="true" className="block w-5 h-5" />
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
      </div>
    </div>
  );
}
