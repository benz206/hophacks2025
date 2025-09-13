import { Card } from "@/components/ui/card";
import { AmbientGradient } from "@/components/ambient-gradient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Pricing • Cogent" };

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Pricing</h1>
        <p className="mt-3 text-muted-foreground">Simple, transparent pricing. Start free, scale as you grow.</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden p-6">
          <AmbientGradient seed="pricing-starter" />
          <h2 className="text-lg font-medium">Starter</h2>
          <p className="mt-1 text-sm text-muted-foreground">For testing and prototypes</p>
          <div className="mt-6 text-3xl font-semibold">$0</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>1 agent</li>
            <li>100 minutes/month</li>
            <li>Email support</li>
          </ul>
          <Button className="mt-6 w-full" asChild>
            <Link href="/login">Get started</Link>
          </Button>
        </Card>

        <Card className="relative overflow-hidden p-6 border-primary/40">
          <AmbientGradient seed="pricing-growth" />
          <div className="inline-block rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs">Most popular</div>
          <h2 className="mt-2 text-lg font-medium">Growth</h2>
          <p className="mt-1 text-sm text-muted-foreground">For growing teams</p>
          <div className="mt-6 text-3xl font-semibold">$99<span className="text-base font-normal text-muted-foreground">/mo</span></div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Up to 5 agents</li>
            <li>5,000 minutes/month</li>
            <li>Analytics dashboard</li>
            <li>Priority support</li>
          </ul>
          <Button className="mt-6 w-full" asChild>
            <Link href="/login">Start free trial</Link>
          </Button>
        </Card>

        <Card className="relative overflow-hidden p-6">
          <AmbientGradient seed="pricing-enterprise" />
          <h2 className="text-lg font-medium">Enterprise</h2>
          <p className="mt-1 text-sm text-muted-foreground">For large organizations</p>
          <div className="mt-6 text-3xl font-semibold">Custom</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Unlimited agents</li>
            <li>Volume pricing</li>
            <li>SOC 2, HIPAA, GDPR</li>
            <li>Dedicated support</li>
          </ul>
          <Button className="mt-6 w-full" variant="outline" asChild>
            <Link href="/demo">Request demo</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}


