import { Button } from "@radix-ui/themes"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5" />

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement banner */}
          <div className="mb-8 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm">
            <span className="text-muted-foreground">✨ Introducing new generative voice AI capabilities</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
            Voice agents that{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              handle calls
            </span>{" "}
            like humans
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
            Deploy intelligent voice agents that understand context, handle complex conversations, and provide
            exceptional customer experiences at scale.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="3" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="3">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Hero visual */}
          <div className="mt-16 relative">
            <div className="mx-auto max-w-4xl">
              <div className="relative rounded-xl bg-card border border-border p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="text-sm text-muted-foreground">Live Call Dashboard</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Customer Support - Line 1</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2:34 active</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Sales Inquiry - Line 2</span>
                      </div>
                      <span className="text-sm text-muted-foreground">1:12 active</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        <span className="text-sm text-muted-foreground">Technical Support - Line 3</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
