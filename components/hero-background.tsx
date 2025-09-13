import * as React from "react"
import { cn } from "@/lib/utils"

type HeroBackgroundProps = {
  className?: string
}

export function HeroBackground({ className }: HeroBackgroundProps) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden>
      <div className="pointer-events-none absolute -inset-20">
        <div className="absolute left-[10%] top-[10%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.85_0.06_250/_0.7),transparent_60%)] blur-3xl animate-blob" />
        <div className="absolute right-[5%] top-[30%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.85_0.06_110/_0.6),transparent_60%)] blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[5%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.85_0.06_20/_0.55),transparent_60%)] blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="grid h-full w-full grid-cols-12 opacity-[0.08]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-border/50" />
          ))}
        </div>
      </div>
    </div>
  )
}


