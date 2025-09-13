import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials"
import { CTASection } from "@/components/cta-sections"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -left-28 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,var(--accent)/0.22,transparent)] blur-3xl" />
        <div className="absolute top-1/4 -right-32 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,var(--secondary)/0.18,transparent)] blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/2 -translate-x-1/2 h-[28rem] w-[56rem] rounded-[60%] bg-[radial-gradient(closest-side,var(--primary)/0.07,transparent)] blur-2xl" />
      </div>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
