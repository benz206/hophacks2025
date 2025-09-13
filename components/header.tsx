import { Button } from "@radix-ui/themes"
import { ThemeToggle } from "./theme-toggle"
import { Phone, Menu } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 bg-foreground text-background rounded-md">
            <Phone className="h-3.5 w-3.5" />
          </div>
          <span className="text-base font-semibold tracking-tight">Cogent</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="2" className="hidden md:inline-flex" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="2" variant="surface" asChild>
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="ghost" size="2" className="md:hidden" aria-label="Open menu">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
