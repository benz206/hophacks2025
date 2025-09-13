import { Card } from "@/components/ui/card"

export function ShowcaseSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            See your agent in action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Live transcript, analytics, and tools—built in. Ship fast with production primitives.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="rounded-xl border border-border shadow-none lg:col-span-2">
            <div className="p-5">
              <div className="text-xs text-muted-foreground mb-3">Live Transcript</div>
              <div className="space-y-3 text-sm">
                <TranscriptRow role="User" text="Hi, I need to reschedule my appointment." />
                <TranscriptRow role="Agent" text="Absolutely. What date and time works best for you?" agent />
                <TranscriptRow role="User" text="Next Tuesday in the afternoon." />
                <TranscriptRow role="Agent" text="I found a 2:30 PM slot next Tuesday. Should I confirm it?" agent />
                <TranscriptRow role="User" text="Yes please." />
                <TranscriptRow role="Agent" text="Done. You’ll receive a confirmation text. Anything else I can help with?" agent />
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-xl border border-border shadow-none">
              <div className="p-5">
                <div className="text-xs text-muted-foreground">Session Analytics</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <Metric label="Sentiment" value="Positive" />
                  <Metric label="Duration" value="03:12" />
                  <Metric label="Turns" value="12" />
                  <Metric label="Compliance" value="99%" />
                </div>
              </div>
            </Card>

            <Card className="rounded-xl border border-border shadow-none">
              <div className="p-5">
                <div className="text-xs text-muted-foreground">Tools Used</div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Calendar API</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">success</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>CRM Lookup</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">success</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>SMS Notify</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">queued</span>
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
        <span className={agent ? "text-foreground" : "text-foreground"}>{text}</span>
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


