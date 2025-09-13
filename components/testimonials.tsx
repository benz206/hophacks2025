"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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
    <section id="testimonials" className="py-20 sm:py-28 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Trusted by industry leaders
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
            See how companies are transforming their customer interactions with Cogent.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => {
              const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                testimonial.author,
              )}`
              return (
                <Card key={index} className="rounded-xl border border-border shadow-none">
                  <div className="p-5">
                    <blockquote className="text-sm sm:text-base text-foreground">&quot;{testimonial.content}&quot;</blockquote>
                    <div className="mt-5 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={avatarUrl}
                          alt={testimonial.author}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                        <AvatarFallback>
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{testimonial.author}</div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
