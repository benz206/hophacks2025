import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Bot, Phone, LogOut, Phone as PhoneIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const NavLink = ({ href, children, icon: Icon, isActive }: { href: string; children: React.ReactNode; icon: React.ElementType; isActive: boolean }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive ? "bg-accent/20 text-foreground" : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );

  // Determine active path on server using headers().pathname is not available here,
  // but Next will mark active via startsWith using request.url in middleware. As a
  // lightweight approach, rely on Link styling on client as well.

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-r bg-muted/10 px-3 py-4 hidden md:flex md:flex-col">
        <Link href="/" className="px-2 py-1 flex items-center gap-2 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-foreground text-background transition-transform group-hover:-translate-y-0.5">
            <PhoneIcon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
          </div>
          <span className="text-lg font-semibold tracking-tight">Cogent</span>
        </Link>
        <div className="mt-2 flex justify-end">
          <ThemeToggle />
        </div>
        <nav className="mt-2 grid gap-1">
          {/* Overview */}
          {/* Active styles will be applied on client by Next <Link> prefetch state; keep server neutral */}
          <NavLink href="/dashboard" icon={Home} isActive={false}>Overview</NavLink>
          <NavLink href="/dashboard/agents" icon={Bot} isActive={false}>Agents</NavLink>
          <NavLink href="/dashboard/calls" icon={Phone} isActive={false}>Calls</NavLink>
        </nav>
        <div className="mt-auto pt-4">
          <form action={async () => {
            'use server'
            const supabase = await getSupabaseServerClient();
            await supabase.auth.signOut();
            redirect('/');
          }}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </form>
        </div>
      </aside>
      <div className="flex flex-col min-h-screen">
        <div className="border-b px-4 py-2 flex items-center justify-end md:hidden">
          <ThemeToggle />
        </div>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}


