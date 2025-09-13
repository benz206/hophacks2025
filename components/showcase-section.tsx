import { Card } from "@/components/ui/card"
import { AmbientGradient } from "@/components/ambient-gradient"

export function ShowcaseSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Build, monitor, and iterate
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            Live transcript, analytics, and tools—built in. Manage assistants and calls from the dashboard or API.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="rounded-xl border border-border shadow-none lg:col-span-2 relative overflow-hidden">
            <AmbientGradient seed="showcase-main" />
            <div className="p-5">
              <div className="text-xs text-muted-foreground mb-3">Live Transcript</div>
              <div className="space-y-3 text-sm">
                <TranscriptRow role="User" text="Call the customer and check order status." />
                <TranscriptRow role="Agent" text="Calling now. I can also email a receipt—should I?" agent />
                <TranscriptRow role="User" text="Yes, send it and text them a survey link." />
                <TranscriptRow role="Agent" text="Receipt emailed and SMS sent. Anything else?" agent />
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
                    <span>CRM Lookup</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">success</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>SMS Notify</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">queued</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Webhook: call.updated</span>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">sent</span>
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


