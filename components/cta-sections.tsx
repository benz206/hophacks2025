// Replaced shadcn Button with native buttons
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Ready to transform your customer interactions?
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
            Join thousands of companies using Cogent to deliver exceptional voice experiences. Get started in minutes
            with our simple API.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button className="h-10 md:h-11 px-4 md:px-6 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 inline-flex items-center text-sm md:text-base">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="h-10 md:h-11 px-4 md:px-6 rounded-md border border-border bg-background hover:bg-accent/5 inline-flex items-center text-sm md:text-base">
              Schedule Demo
            </button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  )
}
