import { Phone } from "lucide-react"
import Link from "next/link"
import { AmbientGradient } from "@/components/ambient-gradient"
import Image from "next/image"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-border bg-background">
      <AmbientGradient variant="violet" className="opacity-25" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Image src="/blacklogo.png" alt="Hermes" width={28} height={28} className="block dark:hidden" />
              <Image src="/whitelogo.png" alt="Hermes" width={28} height={28} className="hidden dark:block" />
              <span className="text-base font-semibold tracking-tight">Hermes</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              Intelligent voice agents that transform customer interactions.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Product</h3>
            <ul className="mt-3 grid gap-2">
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-0.5"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-0.5"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">© {year} Hermes. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex gap-5">
            <a
              href="https://github.com/benz206/hophacks2025"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md p-1"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
