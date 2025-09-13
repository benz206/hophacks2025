import { ElectricWire } from "@/components/electric-wire"
import { AmbientGradient } from "@/components/ambient-gradient"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Bot, Phone, Rocket } from "lucide-react"

type Step = {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  helperTitle: string;
  helperBody: string;
  accent: "violet" | "blue" | "sunset";
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    title: "Create agent",
    description: "Configure voice, tools, and routing.",
    ctaText: "Open agents",
    ctaHref: "/dashboard/agents",
    helperTitle: "Tip",
    helperBody: "Start from a template, then tweak voice, tools, and disclaimers.",
    accent: "violet",
    icon: Bot,
  },
  {
    title: "Connect number",
    description: "Provision a phone number in seconds.",
    ctaText: "Open settings",
    ctaHref: "/dashboard/settings",
    helperTitle: "Why connect?",
    helperBody: "Enable inbound and outbound calls with a dedicated number.",
    accent: "blue",
    icon: Phone,
  },
  {
    title: "Go live",
    description: "Receive calls and view analytics.",
    ctaText: "View calls",
    ctaHref: "/dashboard/calls",
    helperTitle: "Next steps",
    helperBody: "Test a call, then share the number with your team.",
    accent: "sunset",
    icon: Rocket,
  },
]

export function Steps() {
  return (
    <section aria-label="How it works" className="py-20 sm:py-28 bg-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-6 sm:gap-x-10">
          <div className="space-y-10">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={i} className="relative rounded-xl border border-border bg-card p-5 shadow-sm overflow-hidden">
                  <AmbientGradient variant={step.accent} className="opacity-60" />
                  <div className="relative flex items-start gap-4">
                    <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Step {i + 1}</div>
                      <div className="mt-1 font-medium text-foreground">{step.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
                      <div className="mt-3">
                        <Button size="sm" asChild>
                          <Link href={step.ctaHref}>{step.ctaText}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-stretch" aria-hidden>
              <ElectricWire orientation="vertical" straight speedMs={8000} className="h-full" />
            </div>
          </div>

          <div className="space-y-10 invisible sm:visible">
            {steps.map((step, i) => (
              <div key={i} className="rounded-xl border border-dashed border-border/60 p-4">
                <div className="text-xs text-muted-foreground">{step.helperTitle}</div>
                <div className="mt-1 text-sm text-foreground/90">{step.helperBody}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


