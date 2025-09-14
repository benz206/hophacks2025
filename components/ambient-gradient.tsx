import * as React from "react"
import { cn } from "@/lib/utils"

type AmbientVariant = "violet" | "blue" | "sunset" | "emerald"

type AmbientGradientProps = {
  className?: string
  variant?: AmbientVariant
  seed?: number | string
  palette?: keyof typeof palettes
}

const variantToStops: Record<AmbientVariant, { line: string; a: string; b: string; c: string }> = {
  violet: {
    line: "via-[oklch(0.68_0.18_280_/_0.8)]",
    a: "bg-[radial-gradient(ellipse_at_center,oklch(0.76_0.24_280/_0.85),transparent_60%)]",
    b: "bg-[radial-gradient(ellipse_at_center,oklch(0.8_0.22_330/_0.8),transparent_60%)]",
    c: "bg-[radial-gradient(ellipse_at_center,oklch(0.74_0.2_240/_0.78),transparent_60%)]",
  },
  blue: {
    line: "via-[oklch(0.72_0.16_230_/_0.75)]",
    a: "bg-[radial-gradient(ellipse_at_center,oklch(0.84_0.18_230/_0.82),transparent_60%)]",
    b: "bg-[radial-gradient(ellipse_at_center,oklch(0.8_0.16_210/_0.72),transparent_60%)]",
    c: "bg-[radial-gradient(ellipse_at_center,oklch(0.88_0.14_250/_0.68),transparent_60%)]",
  },
  sunset: {
    line: "via-[oklch(0.84_0.24_50_/_0.7)]",
    a: "bg-[radial-gradient(ellipse_at_center,oklch(0.88_0.28_30/_0.82),transparent_60%)]",
    b: "bg-[radial-gradient(ellipse_at_center,oklch(0.84_0.26_350/_0.75),transparent_60%)]",
    c: "bg-[radial-gradient(ellipse_at_center,oklch(0.9_0.22_70/_0.65),transparent_60%)]",
  },
  emerald: {
    line: "via-[oklch(0.8_0.2_160_/_0.75)]",
    a: "bg-[radial-gradient(ellipse_at_center,oklch(0.9_0.22_160/_0.85),transparent_60%)]",
    b: "bg-[radial-gradient(ellipse_at_center,oklch(0.86_0.2_140/_0.78),transparent_60%)]",
    c: "bg-[radial-gradient(ellipse_at_center,oklch(0.92_0.18_180/_0.7),transparent_60%)]",
  },
}

export const palettes = {
  aurora: ["oklch(0.86 0.16 330 / 0.85)", "oklch(0.88 0.12 280 / 0.85)", "oklch(0.9 0.1 210 / 0.85)"],
  lagoon: ["oklch(0.86 0.13 220 / 0.85)", "oklch(0.9 0.13 180 / 0.85)", "oklch(0.92 0.11 120 / 0.85)"],
  candy: ["oklch(0.86 0.22 20 / 0.85)", "oklch(0.86 0.2 330 / 0.85)", "oklch(0.9 0.18 290 / 0.85)"],
  sundown: ["oklch(0.84 0.23 30 / 0.85)", "oklch(0.88 0.18 350 / 0.85)", "oklch(0.86 0.16 310 / 0.85)"],
  sunrise: ["oklch(0.95 0.22 85 / 0.85)", "oklch(0.96 0.18 55 / 0.85)", "oklch(0.97 0.1 20 / 0.85)"],
  mint: ["oklch(0.94 0.12 150 / 0.85)", "oklch(0.96 0.1 120 / 0.85)", "oklch(0.97 0.08 90 / 0.85)"],
  grape: ["oklch(0.88 0.18 300 / 0.85)", "oklch(0.86 0.16 320 / 0.85)", "oklch(0.9 0.12 260 / 0.85)"],
  dusk: ["oklch(0.9 0.12 260 / 0.85)", "oklch(0.9 0.12 300 / 0.85)", "oklch(0.94 0.08 20 / 0.85)"],
  peach: ["oklch(0.95 0.16 40 / 0.85)", "oklch(0.96 0.12 20 / 0.85)", "oklch(0.98 0.06 95 / 0.85)"],
  aurum: ["oklch(0.95 0.18 90 / 0.85)", "oklch(0.96 0.14 80 / 0.85)", "oklch(0.98 0.08 70 / 0.85)"],
} as const

function hashSeed(seed: number | string): number {
  const s = typeof seed === "number" ? String(seed) : seed
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function AmbientGradient({ className, variant = "violet", seed, palette }: AmbientGradientProps) {
  // If a named palette is provided, render a linear gradient card background
  if (palette) {
    const p = palettes[palette]
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(135deg, ${p[0]} 0%, ${p[1]} 50%, ${p[2]} 100%)`,
          }}
        />
      </div>
    )
  }

  if (!seed) {
    const stops = variantToStops[variant]
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
        <div className={cn("absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent to-transparent", stops.line)} />
        <div className="absolute -inset-16">
          <div className={cn("absolute -left-10 -top-10 h-64 w-64 rounded-full blur-3xl", stops.a)} />
          <div className={cn("absolute right-0 bottom-0 h-72 w-72 rounded-full blur-3xl", stops.b)} />
          <div className={cn("absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl", stops.c)} />
        </div>
      </div>
    )
  }

  const h = hashSeed(seed)
  const baseHue = (h % 360)
  const hueA = baseHue
  const hueB = (baseHue + 48) % 360
  const hueC = (baseHue + 312) % 360
  const hueD = (baseHue + 180) % 360
  const lineHue = (baseHue + 12) % 360

  // base subtle values
  const lA0 = 0.88, cA0 = 0.16, aA0 = 0.5
  const lB0 = 0.9, cB0 = 0.14, aB0 = 0.42
  const lC0 = 0.92, cC0 = 0.12, aC0 = 0.36
  const lD0 = 0.9, cD0 = 0.1, aD0 = 0.28
  const lLine0 = 0.78, cLine0 = 0.12, aLine0 = 0.35

  // slight, deterministic variation per seed
  const jitter = (n: number, span: number) => ((n % (span * 2)) - span) / 100
  const lA = lA0, cA = Math.max(0, cA0 + jitter(h >>> 10, 6)), aA = Math.max(0.2, aA0 + jitter(h >>> 11, 8))
  const lB = lB0, cB = Math.max(0, cB0 + jitter(h >>> 12, 6)), aB = Math.max(0.18, aB0 + jitter(h >>> 13, 8))
  const lC = lC0, cC = Math.max(0, cC0 + jitter(h >>> 14, 6)), aC = Math.max(0.14, aC0 + jitter(h >>> 15, 8))
  const lD = lD0, cD = Math.max(0, cD0 + jitter(h >>> 18, 5)), aD = Math.max(0.12, aD0 + jitter(h >>> 19, 8))
  const lLine = lLine0, cLine = Math.max(0, cLine0 + jitter(h >>> 16, 6)), aLine = Math.max(0.15, aLine0 + jitter(h >>> 17, 10))

  // sizes
  const s1 = 180 + (h % 80) // px
  const s2 = 200 + ((h >>> 5) % 90)
  const s3 = 170 + ((h >>> 9) % 80)
  const s4 = 120 + ((h >>> 11) % 60)

  // choose corners and line side to avoid visible repetition
  const corner1 = (h >>> 2) & 3
  const corner2 = (h >>> 4) & 3
  const lineOnLeft = ((h >>> 8) & 1) === 0

  const offA = 8 + ((h >>> 3) % 18)
  const offB = 6 + ((h >>> 6) % 16)

  const blob1Pos: React.CSSProperties =
    corner1 === 0 ? { left: `-${offA}px`, top: `-${offA}px` } :
    corner1 === 1 ? { right: `-${offA}px`, top: `-${offA}px` } :
    corner1 === 2 ? { left: `-${offA}px`, bottom: `-${offA}px` } :
                    { right: `-${offA}px`, bottom: `-${offA}px` }

  const blob2Pos: React.CSSProperties =
    corner2 === 0 ? { left: `-${offB}px`, top: `-${offB}px` } :
    corner2 === 1 ? { right: `-${offB}px`, top: `-${offB}px` } :
    corner2 === 2 ? { left: `-${offB}px`, bottom: `-${offB}px` } :
                    { right: `-${offB}px`, bottom: `-${offB}px` }

  const left3Pct = 35 + ((h >>> 6) % 30) // 35%..65%
  const top3Pct = 25 + ((h >>> 7) % 40)  // 25%..65%
  const left4Pct = 20 + ((h >>> 9) % 60) // 20%..80%
  const top4Pct = 15 + ((h >>> 10) % 55) // 15%..70%

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className="absolute inset-y-0 w-px"
        style={{
          [lineOnLeft ? 'left' : 'right']: 0,
          backgroundImage: `linear-gradient(to bottom, transparent, oklch(${lLine} ${cLine} ${lineHue} / ${aLine}), transparent)`
        } as React.CSSProperties}
      />
      <div className="absolute inset-0">
        <div
          className="absolute rounded-full blur-3xl"
          style={{ ...blob1Pos, width: `${s1}px`, height: `${s1}px`, background: `radial-gradient(ellipse at center, oklch(${lA} ${cA} ${hueA} / ${aA}), transparent 70%)` }}
        />
        <div
          className="absolute rounded-full blur-3xl"
          style={{ ...blob2Pos, width: `${s2}px`, height: `${s2}px`, background: `radial-gradient(ellipse at center, oklch(${lB} ${cB} ${hueB} / ${aB}), transparent 70%)` }}
        />
        <div
          className="absolute -translate-x-1/2 rounded-full blur-3xl"
          style={{ left: `${left3Pct}%`, top: `${top3Pct}%`, width: `${s3}px`, height: `${s3}px`, background: `radial-gradient(ellipse at center, oklch(${lC} ${cC} ${hueC} / ${aC}), transparent 70%)` }}
        />
        <div
          className="absolute -translate-x-1/2 rounded-full blur-3xl"
          style={{ left: `${left4Pct}%`, top: `${top4Pct}%`, width: `${s4}px`, height: `${s4}px`, background: `radial-gradient(ellipse at center, oklch(${lD} ${cD} ${hueD} / ${aD}), transparent 72%)` }}
        />
      </div>
    </div>
  )
}


