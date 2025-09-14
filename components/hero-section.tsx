import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
// import { ElectricWire } from "@/components/electric-wire"
import { HeroBackground } from "@/components/hero-background"
import { StatCard, UsageChart } from "@/components/dashboard/overview-cards"
import { AmbientGradient } from "@/components/ambient-gradient"
import AgentsDemo from "@/components/dashboard/agents-demo"
import { CallsTable } from "@/components/dashboard/calls-table"
import { fakeCalls } from "@/lib/fake-data"

export function HeroSection() {
  // Fake monthly usage data to mirror dashboard chart
  const usageData = [
    { date: "01", calls: 2, minutes: 6 },
    { date: "02", calls: 3, minutes: 7 },
    { date: "03", calls: 1, minutes: 3 },
    { date: "04", calls: 5, minutes: 12 },
    { date: "05", calls: 4, minutes: 10 },
    { date: "06", calls: 6, minutes: 15 },
    { date: "07", calls: 3, minutes: 8 },
    { date: "08", calls: 7, minutes: 18 },
    { date: "09", calls: 5, minutes: 12 },
    { date: "10", calls: 8, minutes: 20 },
    { date: "11", calls: 4, minutes: 9 },
    { date: "12", calls: 6, minutes: 14 },
  ]
  return (
    <section className="py-20 sm:py-32 relative">
      <HeroBackground />

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement */}
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-background/70 px-3 py-1 text-xs">
            <span className="text-muted-foreground">✨ Now live: Dashboard, Webhooks, and File Extraction</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl text-balance">
            Smart Agent for Your Calls
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-7 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Assistants, Calls, Phone Numbers, Files, and Webhooks—backed by sub‑second latency, live analytics, and a Supabase‑backed dashboard. OpenAI on calls, Gemini for summaries. Build in minutes, go live with confidence.
          </p>

          <div className="mt-8 flex items-center justify-center gap-x-3">
            <Button className="px-5 shadow-sm hover:shadow" asChild>
              <Link href="/dashboard">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden={true} strokeWidth={1.75} />
              </Link>
            </Button>
            <Button variant="outline" className="hover:bg-accent/50" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-4 w-4" aria-hidden={true} strokeWidth={1.75} />
                Watch Demo
              </Link>
            </Button>
          </div>
          <div className="mt-14 relative">
            <div className="mx-auto max-w-[1600px]">
              <div className="relative rounded-2xl bg-card border border-border p-6 shadow-sm overflow-hidden">
                <AmbientGradient variant="blue" className="opacity-60" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    </div>
                    <div className="text-xs text-muted-foreground">Overview</div>
                  </div>

                  {/* Overview metrics (hardcoded) to match dashboard StatCards */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <StatCard label="Total calls" value="128" hint="All calls this month" accent="emerald" />
                    <StatCard label="Minutes" value="342" hint="This month" accent="violet" />
                    <StatCard label="Avg duration" value="2m" hint="Per successful call" accent="blue" />
                    <StatCard label="Success rate" value="82%" hint="Completed vs total" accent="sunset" />
                  </div>

                  {/* Mirror dashboard layout: Recent calls + Usage */}
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <section className="rounded-xl border p-5 bg-card">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-medium">Recent calls</h2>
                        <Link href="/dashboard/calls" className="text-sm text-primary underline">View all</Link>
                      </div>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">Support Assistant</div>
                            <div className="text-muted-foreground">→ +1 555‑123‑4567</div>
                          </div>
                          <div className="text-muted-foreground">2m ago</div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">Sales Assistant</div>
                            <div className="text-muted-foreground">→ +1 555‑987‑6543</div>
                          </div>
                          <div className="text-muted-foreground">5m ago</div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="font-medium">Tech Support</div>
                            <div className="text-muted-foreground">→ +1 555‑000‑1212</div>
                          </div>
                          <div className="text-muted-foreground">12m ago</div>
                        </div>
                      </div>
                    </section>
                    <section className="rounded-xl border p-5 bg-card">
                      <h2 className="text-base sm:text-lg font-medium">Usage</h2>
                      <p className="mt-1 text-sm text-muted-foreground">You used 342 minutes across 128 calls this month.</p>
                      <div className="mt-4">
                        <UsageChart data={usageData} />
                      </div>
                      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
                        <div className="rounded-md border bg-muted/30 p-3">
                          <div className="text-xs text-muted-foreground whitespace-nowrap">Avg duration</div>
                          <div className="mt-1 text-base font-semibold whitespace-nowrap">2 min</div>
                          <div className="mt-0.5 text-[10px] text-muted-foreground">Per successful call</div>
                        </div>
                        <div className="rounded-md border bg-muted/30 p-3">
                          <div className="text-xs text-muted-foreground whitespace-nowrap">Success rate</div>
                          <div className="mt-1 text-base font-semibold whitespace-nowrap">82%</div>
                          <div className="mt-0.5 text-[10px] text-muted-foreground">Completed vs total</div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* End dashboard mirror */}
                </div>
              </div>
            </div>
            {/* Embedded demos below the hero mirror */}
            <div className="mx-auto max-w-[1600px] mt-10 space-y-8 text-left">
              <section className="space-y-3">
                <h2 className="text-lg font-medium">Agents</h2>
                <AgentsDemo />
              </section>
              <section className="space-y-3">
                <h2 className="text-lg font-medium">Calls</h2>
                <CallsTable calls={fakeCalls} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
