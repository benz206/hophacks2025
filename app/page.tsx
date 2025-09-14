import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CTASection } from "@/components/cta-sections"
import { Footer } from "@/components/footer"
import { SectionBackground } from "@/components/section-background"
import { Steps } from "@/components/steps"
import { ShowcaseSection } from "@/components/showcase-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <SectionBackground>
          <HeroSection />
        </SectionBackground>
        <SectionBackground>
          <FeaturesSection />
        </SectionBackground>
        <SectionBackground>
          <ShowcaseSection />
        </SectionBackground>
        <SectionBackground>
          <Steps />
        </SectionBackground>
        <SectionBackground>
          <CTASection />
        </SectionBackground>
      </main>
      <Footer />
    </div>
  )
}
