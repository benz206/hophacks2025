import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Home, Phone, Sparkles, Tag, LogIn } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 bg-foreground text-background rounded-md">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.75} />
          </div>
          <span className="text-base font-semibold tracking-tight">Hermes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            Home
          </Link>
          <Link href="/#features" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Features
          </Link>
          <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            Pricing
          </Link>
          
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button className="hidden md:inline-flex ml-1 md:ml-2" asChild>
            <Link href="/login" className="inline-flex items-center gap-1.5">
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Log in
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
