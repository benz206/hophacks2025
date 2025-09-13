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
            <Recharts.Area type="monotone" dataKey="calls" stroke="hsl(var(--primary))" fill="url(#areaCalls)" strokeWidth={2.25} />
            <Recharts.Line type="monotone" dataKey="calls" stroke="hsl(var(--primary))" strokeWidth={3} strokeOpacity={1} dot={false} activeDot={{ r: 3.5 }} />
            <Recharts.Area type="monotone" dataKey="minutes" stroke="hsl(var(--foreground))" fill="url(#areaMinutes)" strokeWidth={2} />
            <Recharts.Line type="monotone" dataKey="minutes" stroke="hsl(var(--foreground))" strokeWidth={2.5} strokeOpacity={0.95} dot={false} activeDot={{ r: 3.25 }} />
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


