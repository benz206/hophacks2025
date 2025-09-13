import { Button } from "@radix-ui/themes"
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
            <Button size="3" className="inline-flex items-center">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="3" className="inline-flex items-center">
              Schedule Demo
            </Button>
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  )
}
