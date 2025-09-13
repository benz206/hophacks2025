"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type Appearance = "light" | "dark"

type ThemeContextValue = {
  appearance: Appearance
  setAppearance: (next: Appearance) => void
  toggleAppearance: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemPreference(): Appearance {
  if (typeof window === "undefined") return "light"
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function readStoredAppearance(): Appearance | null {
  try {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null
    if (stored === "light" || stored === "dark") return stored
  } catch {}
  return null
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>("light")

  useEffect(() => {
    const initial = readStoredAppearance() ?? getSystemPreference()
    setAppearanceState(initial)
  }, [])

  useEffect(() => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    if (appearance === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    try {
      window.localStorage.setItem("theme", appearance)
    } catch {}
  }, [appearance])

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const stored = readStoredAppearance()
      if (!stored) {
        setAppearanceState(getSystemPreference())
      }
    }
    mq.addEventListener?.("change", handler)
    return () => mq.removeEventListener?.("change", handler)
  }, [])

  const setAppearance = useCallback((next: Appearance) => {
    setAppearanceState(next)
  }, [])

  const toggleAppearance = useCallback(() => {
    setAppearanceState((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ appearance, setAppearance, toggleAppearance }),
    [appearance, setAppearance, toggleAppearance]
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeAppearance() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useThemeAppearance must be used within ThemeProvider")
  return ctx
}


