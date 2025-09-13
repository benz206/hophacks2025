import { ElectricWire } from "@/components/electric-wire"

type Step = { title: string; description: string }

const steps: Step[] = [
  { title: "Create agent", description: "Configure voice, tools, and routing." },
  { title: "Connect number", description: "Provision a phone number in seconds." },
  { title: "Go live", description: "Receive calls and view analytics." },
]

export function Steps() {
  return (
    <section aria-label="How it works" className="py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-6 sm:gap-x-10">
          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <div className="text-sm text-muted-foreground">Step {i + 1}</div>
                <div className="mt-1 font-medium text-foreground">{step.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-stretch" aria-hidden>
              <ElectricWire orientation="vertical" straight speedMs={8000} className="h-full" />
            </div>
          </div>

          <div className="space-y-10 invisible sm:visible">
            {steps.map((step, i) => (
              <div key={i} className="rounded-xl border border-dashed border-border/60 p-4 text-muted-foreground">
                Helper
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


