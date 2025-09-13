import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      {/* Subtle background wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_0%,hsl(0_0%_100%/_0.8),transparent)]" />

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement */}
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-xs">
            <span className="text-muted-foreground">✨ New: Generative voice AI</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl text-balance">
            Voice agents that <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">handle calls</span> like humans
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-7 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Deploy intelligent voice agents that understand context, handle complex conversations, and elevate customer experiences at scale.
          </p>

          <div className="mt-8 flex items-center justify-center gap-x-3">
            <Button className="px-5" asChild>
              <Link href="/dashboard">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Hero visual */}
          <div className="mt-14 relative">
            <div className="mx-auto max-w-4xl">
              <div className="relative rounded-xl bg-card border border-border p-6 shadow-sm">
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    </div>
                    <div className="text-xs text-muted-foreground">Live Call Dashboard</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Customer Support - Line 1</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2:34 active</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Sales Inquiry - Line 2</span>
                      </div>
                      <span className="text-xs text-muted-foreground">1:12 active</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        <span className="text-sm text-muted-foreground">Technical Support - Line 3</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
