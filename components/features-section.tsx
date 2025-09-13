
import { Card } from "@/components/ui/card"

import { Brain, Zap, Shield, BarChart3, Globe, Clock } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "Natural Conversations",
    description: "Advanced AI that understands context, emotion, and intent for human-like interactions.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-second response times with real-time processing for seamless conversations.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance with SOC 2, HIPAA, and GDPR standards.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Comprehensive insights into call performance, customer satisfaction, and agent efficiency.",
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Support for 40+ languages with native accent recognition and cultural context.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Never miss a call with always-on voice agents that scale with your business needs.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Everything you need for voice automation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Powerful features that make voice agents indistinguishable from human representatives.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="rounded-xl border border-border shadow-none hover:shadow-sm transition-shadow">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
