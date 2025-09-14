import { Card } from "@/components/ui/card";
import { AmbientGradient } from "@/components/ambient-gradient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = { title: "Pricing • Hermes" };

export default function PricingPage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-48 right-0 h-[40rem] w-[40rem] rounded-full bg-blue-500/15 dark:bg-blue-400/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_65%)]" />
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Pricing</h1>
          <p className="mt-3 text-muted-foreground">Simple, transparent pricing. Start free, scale as you grow.</p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory -mx-4 px-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:snap-none md:mx-0 md:px-0">
          <Card className="relative h-full p-6 sm:p-7 flex flex-col border-foreground/10 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shrink-0 snap-center min-w-[85%] sm:min-w-[70%] md:min-w-0">
            <AmbientGradient seed="pricing-starter" />
            <div className="mt-2 flex items-center justify-between gap-2">
              <h2 className="text-lg font-medium">Free</h2>
              <div className="inline-block rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs">Free</div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">For testing and prototypes</p>
            <div className="mt-6 text-3xl font-semibold">$0</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />1 agent</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />100 minutes/month</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />Email support</li>
            </ul>
            <div className="mt-auto pt-6">
              <Button className="w-full" asChild>
                <Link href="/login">Get started</Link>
              </Button>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6 sm:p-7 flex flex-col h-full border-foreground/10 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 md:order-2 shrink-0 snap-center min-w-[85%] sm:min-w-[70%] md:min-w-0">
            <AmbientGradient variant="blue" />
            <div className="mt-2 flex items-center justify-between gap-2">
              <h2 className="text-lg font-medium">Enterprise</h2>
              <div className="inline-block rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs">Custom</div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">For large organizations</p>
            <div className="mt-6 text-3xl font-semibold">Custom</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />Unlimited agents</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />Volume pricing</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />SOC 2, HIPAA, GDPR</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />Dedicated support</li>
            </ul>
            <div className="mt-auto pt-6">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/demo">Request demo</Link>
              </Button>
            </div>
          </Card>

          <Card className="relative overflow-hidden p-6 sm:p-7 border-primary/50 ring-1 ring-primary/25 flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:order-3 shrink-0 snap-center min-w-[85%] sm:min-w-[70%] md:min-w-0">
            <AmbientGradient seed="pricing-pro" />
            <div className="mt-2 flex items-center justify-between gap-2">
              <h2 className="text-lg font-medium">Pro</h2>
              <div className="inline-block rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs">Most popular</div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">For growing teams</p>
            <div className="mt-6 text-3xl font-semibold">$20<span className="text-base font-normal text-muted-foreground">/mo</span></div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />Up to 3 agents</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />1,000 minutes/month</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />Analytics dashboard</li>
              <li className="flex items-start gap-2"><Check className="mt-0.5 size-4 text-primary" />Priority support</li>
            </ul>
            <div className="mt-auto pt-6">
              <Button className="w-full" asChild>
                <Link href="/login">Start free trial</Link>
              </Button>
            </div>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


