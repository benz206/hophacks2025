import { ReactNode } from "react"

type SectionBackgroundProps = {
  children: ReactNode
  className?: string
}

export function SectionBackground({ children, className }: SectionBackgroundProps) {
  const combined = className ? `relative isolate ${className}` : "relative isolate"
  return (
    <section className={combined}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute -bottom-24 right-0 h-[40rem] w-[40rem] rounded-full bg-blue-500/20 dark:bg-blue-400/15 blur-[160px]" />
        <div className="absolute top-1/2 -left-24 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.08),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_65%)]" />
      </div>
      {children}
    </section>
  )
}


