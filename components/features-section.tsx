
import { Card } from "@/components/ui/card"
import { AmbientGradient } from "@/components/ambient-gradient"

import { Brain, Zap, Shield, BarChart3, Globe, Clock, Phone, Webhook, Files } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Assistants",
    description: "Create AI agents with tools, memory, and guardrails. Deploy from the dashboard or API.",
  },
  {
    icon: Phone,
    title: "Calls API",
    description: "Programmatically start, receive, and manage calls with real-time events and transcripts.",
  },
  {
    icon: Globe,
    title: "Phone Numbers",
    description: "Provision numbers in seconds and route inbound calls to your agents.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Subscribe to call lifecycle events and integrate with your stack reliably.",
  },
  {
    icon: Files,
    title: "File Extraction",
    description: "Extract structured data from uploads and feed it into your agent context.",
  },
  {
    icon: Zap,
    title: "Low Latency",
    description: "Sub‑second turn-taking for natural conversations that don’t feel robotic.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Everything you need to launch voice agents
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Production primitives to build, connect, and operate AI voice agents—end to end.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const seeds = [
                "feature-rose",
                "feature-lagoon",
                "feature-sunset",
                "feature-aurora",
                "feature-mint",
                "feature-dusk",
              ] as const
              const seed = seeds[idx] ?? `feature-${idx}`
              return (
              <Card key={feature.title} className="relative overflow-hidden rounded-xl border border-border shadow-none hover:shadow-sm transition-shadow">
                <AmbientGradient seed={seed} />
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/30 border border-border">
                      <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" strokeWidth={1.75} />
                    </div>
                    <div className="text-base font-medium">{feature.title}</div>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
