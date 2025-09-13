import * as React from "react"
import { cn } from "@/lib/utils"

type Orientation = "horizontal" | "vertical"

type ElectricWireProps = {
  className?: string
  /** Duration for one travel cycle in ms */
  speedMs?: number
  /** Use a perfectly straight line instead of a bezier curve */
  straight?: boolean
  /** Orientation of the wire */
  orientation?: Orientation
}

type CSSVarStyle = React.CSSProperties & Record<string, string>

export function ElectricWire({
  className,
  speedMs = 4800,
  straight = false,
  orientation = "horizontal",
}: ElectricWireProps) {
  const isHorizontal = orientation === "horizontal"

  const viewBox = isHorizontal ? "0 0 800 100" : "0 0 100 800"
  const basePath = isHorizontal
    ? "M0 50 C 120 10, 200 90, 320 50 S 520 10, 640 50 S 760 90, 800 50"
    : "M50 0 C 10 120, 90 200, 50 320 S 10 520, 50 640 S 90 760, 50 800"
  const straightPath = isHorizontal ? "M0 50 L800 50" : "M50 0 L50 800"
  const d = straight ? straightPath : basePath

  const style: CSSVarStyle = { "--electric-speed": `${speedMs}ms` }

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={cn(isHorizontal ? "w-full h-12" : "h-full w-10", className)}
      aria-hidden="true"
      focusable="false"
      style={style}
    >
      <path d={d} className="fill-none stroke-current text-muted-foreground/30" strokeWidth={2} />
      <path
        d={d}
        className="fill-none stroke-current text-primary electric-glow"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  )
}


