import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Spin up a voice agent in minutes
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-7 text-muted-foreground text-pretty">
            Create an assistant, claim a phone number, and start taking calls. Use webhooks and the API to integrate with your stack.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-3">
            <Button className="inline-flex items-center" asChild>
              <Link href="/dashboard">
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" className="inline-flex items-center" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>

          <div className="mt-4 text-xs sm:text-sm text-muted-foreground">
            Sub‑second latency • Real-time analytics • Webhooks
          </div>
        </div>
      </div>
    </section>
  )
}
