
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
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Everything you need for voice automation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Powerful features that make voice agents indistinguishable from human representatives.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow rounded-xl"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <feature.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-lg font-semibold">{feature.title}</div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
