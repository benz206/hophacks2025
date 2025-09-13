import { ElectricWire } from "@/components/electric-wire"
import { AmbientGradient } from "@/components/ambient-gradient"
import Link from "next/link"
import { Bot, Phone, Rocket, CheckCircle2, ArrowRight } from "lucide-react"

type Step = {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  helperTitle: string;
  helperBody: string;
  helperBullets: string[];
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
    helperBullets: ["Pick a template", "Set the voice", "Add a tool"],
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
    helperBullets: ["Buy a number", "Assign an agent", "Place a test call"],
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
    helperBullets: ["Run a trial call", "Share the number", "Monitor analytics"],
    accent: "sunset",
    icon: Rocket,
  },
]

export function Steps() {
  return (
    <section aria-label="How it works" className="py-20 sm:py-28 bg-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="space-y-14 sm:space-y-16">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="relative grid grid-cols-[1fr_auto_1fr] items-stretch gap-x-6 sm:gap-x-10">
                {/* Single horizontal electricity connecting step and tip */}
                <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0">
                  <ElectricWire orientation="horizontal" straight speedMs={7000} />
                </div>

                {/* Step card as full link */}
                <Link
                  href={step.ctaHref}
                  className="relative z-10 block rounded-xl border border-border bg-card p-5 shadow-sm overflow-hidden transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <AmbientGradient variant={step.accent} className="opacity-60" />
                  <div className="relative flex items-start gap-4">
                    <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Step {i + 1}</div>
                      <div className="mt-1 font-medium text-foreground">{step.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
                      <div className="mt-3 text-xs text-primary underline">{step.ctaText}</div>
                    </div>
                  </div>
                </Link>

                {/* Center spacer (keeps layout and wire gap) */}
                <div />

                {/* Helper card redesigned */}
                <div className="relative z-10 rounded-xl border bg-card p-5 overflow-hidden">
                  <AmbientGradient variant={step.accent} className="opacity-50" />
                  <div className="relative">
                    <div className="text-xs text-muted-foreground">{step.helperTitle}</div>
                    <div className="mt-1 text-sm text-foreground/90">{step.helperBody}</div>
                    <ul className="mt-3 grid gap-2">
                      {step.helperBullets.map((b, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={step.ctaHref} className="mt-4 inline-flex items-center text-sm text-primary underline">
                      {step.ctaText}
                      <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                  {/* Connection dot on helper */}
                  <div className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_theme(colors.primary.DEFAULT)] z-10" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


