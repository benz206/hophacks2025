"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AmbientGradient } from "@/components/ambient-gradient";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: "violet" | "blue" | "sunset";
  className?: string;
};

export function StatCard({ label, value, hint, accent = "violet", className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <AmbientGradient variant={accent} className="opacity-70" />
      <CardHeader className="relative">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}


