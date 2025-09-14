"use client"

import { Card } from "@/components/ui/card"
import { AmbientGradient } from "@/components/ambient-gradient"
import { TypewriterText } from "@/components/ui/typewriter"
import * as React from "react"

export function ShowcaseSection() {
  const transcript = React.useMemo(
    () => [
      { "role": "Agent", "text": "Hello, I’m calling on behalf of the policyholder to file a new claim.", "agent": true },
      { "role": "Insurance Rep", "text": "Of course. Can you provide the policy number?", "agent": false },
      { "role": "Agent", "text": "Yes, it’s 4829137.", "agent": true },
      { "role": "Insurance Rep", "text": "Thank you. When and where did the accident occur?", "agent": false },
      { "role": "Agent", "text": "It was on August 12th, downtown near 5th and Main.", "agent": true },
      { "role": "Insurance Rep", "text": "Were there any injuries involved?", "agent": false },
      { "role": "Agent", "text": "No injuries, just vehicle damage. Could you issue a claim number?", "agent": true },
      { "role": "Insurance Rep", "text": "Of course. The claim number is 1234567.", "agent": false },
      { "role": "Agent", "text": "Thank you.", "agent": true },
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

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6">
          <Card className="rounded-xl border border-border shadow-none relative overflow-hidden">
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
        </div>
      </div>
    </section>
  )
}

function TranscriptRow({ role, text, agent = false }: { role: string; text: string; agent?: boolean }) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-start gap-3">
      <div className="text-xs text-muted-foreground mt-1">{role}</div>
      <div className={agent ? "rounded-md bg-accent/30 border border-border px-2.5 py-1.5 text-xs" : "rounded-md bg-muted px-2.5 py-1.5 text-xs"}>
        <TypewriterText text={text} />
      </div>
    </div>
  )
}
