"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import * as React from "react";
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

type UsagePoint = { date: string; calls: number; minutes: number };

const Recharts = {
  ResponsiveContainer: dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false }),
  AreaChart: dynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false }),
  Area: dynamic(() => import("recharts").then(m => m.Area), { ssr: false }),
  Line: dynamic(() => import("recharts").then(m => m.Line), { ssr: false }),
  Dot: dynamic(() => import("recharts").then(m => m.Dot), { ssr: false }),
  XAxis: dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false }),
  YAxis: dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false }),
  CartesianGrid: dynamic(() => import("recharts").then(m => m.CartesianGrid), { ssr: false }),
  Tooltip: dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false }),
};

export function UsageChart({ data }: { data: UsagePoint[] }) {
  // Decide which series has the greater magnitude this month
  const maxCalls = data.length ? Math.max(...data.map((d) => d.calls)) : 0;
  const maxMinutes = data.length ? Math.max(...data.map((d) => d.minutes)) : 0;
  const showKey: keyof UsagePoint = maxCalls >= maxMinutes ? "calls" : "minutes";

  // Stroke and fill settings
  const strokeColor = showKey === "calls" ? "hsl(var(--primary))" : "hsl(var(--foreground))";
  const fillId = showKey === "calls" ? "url(#areaCalls)" : "url(#areaMinutes)";
  const lineStrokeWidth = 2; // reduced thickness
  const areaStrokeWidth = 1.5; // reduced thickness

  return (
    <Card className="relative overflow-hidden">
      <AmbientGradient variant="blue" className="opacity-50" />
      <CardHeader className="relative">
        <CardTitle className="text-sm text-muted-foreground">This month</CardTitle>
      </CardHeader>
      <CardContent className="relative h-56">
        <Recharts.ResponsiveContainer width="100%" height="100%">
          <Recharts.AreaChart data={data} margin={{ left: 8, right: 8, top: 4, bottom: 0 }}>
            <Rechartsdefs />
            <Recharts.CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <Recharts.XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
            <Recharts.YAxis tickLine={false} axisLine={false} width={28} />
            <Recharts.Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
            {/* Only render the series with the greater max value */}
            <Recharts.Area type="monotone" dataKey={showKey as any} stroke={strokeColor} fill={fillId} strokeWidth={areaStrokeWidth} />
            <Recharts.Line type="monotone" dataKey={showKey as any} stroke={strokeColor} strokeWidth={lineStrokeWidth} strokeOpacity={1} dot={false} activeDot={{ r: 3 }} />
          </Recharts.AreaChart>
        </Recharts.ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function Rechartsdefs() {
  return (
    <svg>
      <defs>
        <linearGradient id="areaCalls" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.04} />
        </linearGradient>
        <linearGradient id="areaMinutes" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.12} />
          <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.03} />
        </linearGradient>
      </defs>
    </svg>
  );
}


