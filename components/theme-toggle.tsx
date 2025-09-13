"use client"

import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useThemeAppearance } from "./theme-provider"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function ThemeToggle() {
  const { appearance, toggleAppearance } = useThemeAppearance()
  const checked = appearance === "dark"

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">Toggle dark mode</span>
      <div className="relative inline-flex h-6 w-11 items-center">
        <Switch checked={checked} onCheckedChange={toggleAppearance} aria-label="Toggle dark mode">
          <VisuallyHidden>Dark mode</VisuallyHidden>
        </Switch>
      </div>
    </label>
  )
}


