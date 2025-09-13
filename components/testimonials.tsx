import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    content:
      "Cogent transformed our customer service. Our voice agents handle 80% of calls without human intervention, and customer satisfaction has never been higher.",
    author: "Sarah Chen",
    role: "VP of Customer Experience",
    company: "TechFlow",
    avatar: "/professional-woman-diverse.png",
  },
  {
    content:
      "The natural conversation flow is incredible. Customers often don't realize they're talking to an AI until we tell them. It's been a game-changer for our sales team.",
    author: "Marcus Rodriguez",
    role: "Head of Sales",
    company: "GrowthLabs",
    avatar: "/professional-man.png",
  },
  {
    content:
      "Implementation was seamless, and the analytics dashboard gives us insights we never had before. We've reduced call handling costs by 60% while improving quality.",
    author: "Emily Watson",
    role: "Operations Director",
    company: "ServicePro",
    avatar: "/confident-business-woman.png",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Trusted by industry leaders
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            See how companies are transforming their customer interactions with Cogent.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-background border-border">
                <CardContent className="p-6">
                  <blockquote className="text-foreground">"{testimonial.content}"</blockquote>
                  <div className="mt-6 flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                      <AvatarFallback>
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
