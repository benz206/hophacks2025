"use client"

import * as React from "react"

type Stat = {
  label: string
  value: number
  suffix?: string
  from?: number
}

function useAnimatedNumber(target: number, durationMs = 1200, from = 0) {
  const [value, setValue] = React.useState(from)
  React.useEffect(() => {
    let raf: number
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs, from])
  return value
}

const stats: Stat[] = [
  { label: "Avg latency", value: 320, suffix: "ms" },
  { label: "First call setup", value: 5, suffix: "min" },
  { label: "Automated resolution", value: 82, suffix: "%" },
  { label: "Languages", value: 40, suffix: "+" },
]

export function StatsSection() {
  return (
    <section aria-label="platform stats" className="py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />)
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value, suffix = "", from = 0 }: Stat) {
  const animated = useAnimatedNumber(value, 1400, from)
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className="text-3xl font-semibold tracking-tight">
        {animated}
        <span className="ml-0.5 text-xl align-middle text-muted-foreground">{suffix}</span>
      </div>
      <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  )
}


