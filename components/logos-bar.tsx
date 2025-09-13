import * as React from "react"

const logos = [
  { name: "TechFlow", src: "/vercel.svg", width: 92 },
  { name: "GrowthLabs", src: "/next.svg", width: 92 },
  { name: "ServicePro", src: "/globe.svg", width: 92 },
  { name: "Northwind", src: "/window.svg", width: 92 },
]

export function LogosBar() {
  return (
    <section aria-label="Trusted by" className="py-8">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
            {logos.map((logo) => (
              // Using next/image would require import; simple img keeps it lightweight.
              <img key={logo.name} src={logo.src} alt={logo.name} width={logo.width} height={28} loading="lazy" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


