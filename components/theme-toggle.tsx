"use client"

import { Moon, Sun } from "lucide-react"
import * as Switch from "@radix-ui/react-switch"
import { useThemeAppearance } from "./theme-provider"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function ThemeToggle() {
  const { appearance, toggleAppearance } = useThemeAppearance()
  const checked = appearance === "dark"

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">Toggle dark mode</span>
      <div className="relative inline-flex h-6 w-11 items-center">
        <Switch.Root
          checked={checked}
          onCheckedChange={toggleAppearance}
          className="peer h-6 w-11 rounded-full bg-muted data-[state=checked]:bg-accent outline-none transition-colors"
          aria-label="Toggle dark mode"
        >
          <VisuallyHidden>Dark mode</VisuallyHidden>
          <Switch.Thumb
            className="grid h-5 w-5 translate-x-0.5 place-items-center rounded-full bg-background shadow transition-transform data-[state=checked]:translate-x-[22px]"
          >
            {checked ? (
              <Moon className="h-3.5 w-3.5 text-foreground" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-foreground" />
            )}
          </Switch.Thumb>
        </Switch.Root>
      </div>
    </label>
  )
}


