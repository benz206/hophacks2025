import { Phone, Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Phone className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Cogent</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a href="#docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            className="hidden md:inline-flex h-9 px-3 rounded-md border border-transparent bg-transparent text-foreground hover:bg-accent/10 text-sm"
            type="button"
          >
            Log in
          </button>
          <button
            className="h-9 px-3 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 text-sm"
            type="button"
          >
            Get Started
          </button>
          <button
            className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent/10"
            type="button"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
