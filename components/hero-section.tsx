import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
// import { ElectricWire } from "@/components/electric-wire"
import { HeroBackground } from "@/components/hero-background"

export function HeroSection() {
  return (
    <section className="py-20 sm:py-32 relative">
      <HeroBackground />

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement */}
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-xs">
            <span className="text-muted-foreground">✨ New: Calls API + Phone numbers</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl text-balance">
            Ship production <span className="text-gradient">voice agents</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-7 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Assistants, Calls, Phone Numbers, Webhooks, and File Extraction—backed by sub‑second latency and a live dashboard. Build in minutes, go live with confidence.
          </p>

          <div className="mt-8 flex items-center justify-center gap-x-3">
            <Button className="px-5 shadow-sm hover:shadow" asChild>
              <Link href="/dashboard">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
              </Link>
            </Button>
            <Button variant="ghost" className="hover:bg-accent/50" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Decorative electric wire */}
          {/* <div className="mt-10 hidden sm:block">
            <ElectricWire />
          </div> */}

          {/* Hero visual */}
          <div className="mt-14 relative">
            <div className="mx-auto max-w-4xl">
              <div className="relative rounded-2xl bg-card border border-border p-6 shadow-sm">
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
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">Latency</div>
                      <div className="mt-1 text-lg font-medium">320ms</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">CSAT</div>
                      <div className="mt-1 text-lg font-medium">4.8/5</div>
                    </div>
                    <div className="rounded-lg border p-3">
                      <div className="text-xs text-muted-foreground">Resolution</div>
                      <div className="mt-1 text-lg font-medium">82%</div>
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
