import Image from "next/image";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

async function signOut() {
  'use server';
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
}

export default async function Home() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="font-sans min-h-screen grid grid-rows-[auto_1fr_auto] p-8 sm:p-12 gap-10">
      <header className="w-full flex items-center justify-between text-sm">
        <div className="font-semibold">HopHacks</div>
        {user ? (
          <div className="flex items-center gap-3">
            <Link className="rounded border px-3 h-9 flex items-center" href="/dashboard">Dashboard</Link>
            <form action={signOut}>
              <div className="flex items-center gap-3">
                <span className="text-neutral-600">{user.email}</span>
                <button className="rounded border px-3 h-9">Sign out</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link className="rounded border px-3 h-9 flex items-center" href="/login">Sign in</Link>
          </div>
        )}
      </header>

      <main className="row-start-2 w-full max-w-4xl mx-auto grid gap-8">
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Build something great, fast</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Next.js + Supabase starter wired with auth, SSR, and a clean UI so you can focus on your hack.
          </p>
          <div className="flex items-center justify-center gap-3">
            {!user ? (
              <Link className="rounded bg-black text-white px-4 h-10 flex items-center" href="/login">Get started</Link>
            ) : (
              <Link className="rounded bg-black text-white px-4 h-10 flex items-center" href="/dashboard">Open dashboard</Link>
            )}
            <a
              className="rounded border px-4 h-10 flex items-center"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
          </div>
        </section>

        <section className="rounded border p-6 grid gap-4">
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
              Deploy now
            </a>
            <a
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read our docs
            </a>
          </div>
        </section>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          Learn
        </a>
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Examples
        </a>
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
