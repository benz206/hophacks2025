"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SwitchProps = {
  checked?: boolean
  onCheckedChange?: (value: boolean) => void
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function Switch({ className, checked = false, onCheckedChange, disabled, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      data-slot="switch"
      onClick={(e) => {
        props.onClick?.(e)
        onCheckedChange?.(!checked)
      }}
      className={cn(
        "inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        checked ? "bg-primary dark:bg-primary-foreground" : "bg-input dark:bg-input/80",
        className
      )}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          checked ? "translate-x-[calc(100%-2px)] bg-primary-foreground dark:bg-primary" : "translate-x-0 bg-foreground dark:bg-foreground"
        )}
      />
    </button>
  )
}

export { Switch }
