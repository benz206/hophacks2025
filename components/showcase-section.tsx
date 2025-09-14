"use client"

import { Card } from "@/components/ui/card"
import { AmbientGradient } from "@/components/ambient-gradient"
import { TypewriterText } from "@/components/ui/typewriter"
import * as React from "react"

export function ShowcaseSection() {
  const transcript = React.useMemo(
    () => [
      { role: "User", text: "Call the customer and check order status.", agent: false },
      { role: "Agent", text: "Calling now. I can also email a receipt—should I?", agent: true },
      { role: "User", text: "Yes, send it and text them a survey link.", agent: false },
      { role: "Agent", text: "Receipt emailed and SMS sent. Anything else?", agent: true },
    ],
    []
  )

  const [visibleCount, setVisibleCount] = React.useState(0)

  React.useEffect(() => {
    // Stagger rows so typewriter reads naturally
    const timers: number[] = []
    const baseDelay = 200
    transcript.forEach((row, idx) => {
      const perChar = 18 // ms per char, roughly matching TypewriterText default
      const prevChars = transcript
        .slice(0, idx)
        .reduce((n, r) => n + r.text.length, 0)
      const delay = baseDelay + prevChars * perChar + idx * 150
      timers.push(window.setTimeout(() => setVisibleCount((v) => Math.max(v, idx + 1)), delay))
    })
    return () => timers.forEach((t) => clearTimeout(t))
  }, [transcript])

  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Build, monitor, and iterate
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Live transcript, analytics, and tools—built in. Gemini call summaries and a Supabase‑backed dashboard.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="rounded-xl border border-border shadow-none lg:col-span-2 relative overflow-hidden">
            <AmbientGradient seed="showcase-main" />
            <div className="p-5">
              <div className="text-xs text-muted-foreground mb-3">Live Transcript</div>
              <div className="space-y-3 text-sm">
                {transcript.slice(0, visibleCount).map((row, idx) => (
                  <TranscriptRow key={idx} role={row.role} text={row.text} agent={row.agent} />
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-xl border border-border shadow-none">
              <div className="p-5">
                <div className="text-xs text-muted-foreground">Session Analytics</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <Metric label="Latency" value="320ms" />
                  <Metric label="Turns" value="12" />
                  <Metric label="Resolution" value="82%" />
                  <Metric label="CSAT" value="4.8/5" />
                </div>
              </div>
            </Card>

            <Card className="rounded-xl border border-border shadow-none">
              <div className="p-5">
                <div className="text-xs text-muted-foreground">Tools Used</div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>SMS</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">success</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>DTMF</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">success</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>API Request: checkOrderStatus</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">success</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Google Calendar: availability.check</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">queued</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Google Calendar: event.create</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">success</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Transfer Call</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">idle</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function TranscriptRow({ role, text, agent = false }: { role: string; text: string; agent?: boolean }) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-start gap-3">
      <div className="text-xs text-muted-foreground mt-1">{role}</div>
      <div className={agent ? "rounded-lg bg-accent/30 border border-border px-3 py-2" : "rounded-lg bg-muted px-3 py-2"}>
        <TypewriterText text={text} />
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-base font-medium">{value}</div>
    </div>
  )
}


