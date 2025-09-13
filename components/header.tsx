import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { Phone, Sparkles, Star, Tag } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 bg-foreground text-background rounded-md">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.75} />
          </div>
          <span className="text-base font-semibold tracking-tight">Cogent</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Features
          </Link>
          <Link href="/#testimonials" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            Testimonials
          </Link>
          <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            Pricing
          </Link>
          
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button className="hidden md:inline-flex ml-1 md:ml-2" asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
