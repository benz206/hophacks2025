import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials"
import { CTASection } from "@/components/cta-sections"
import { Footer } from "@/components/footer"
import { Steps } from "@/components/steps"
import { LogosBar } from "@/components/logos-bar"
import { StatsSection } from "@/components/stats-section"
import { ShowcaseSection } from "@/components/showcase-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <LogosBar />
        <StatsSection />
        <FeaturesSection />
        <ShowcaseSection />
        <Steps />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
