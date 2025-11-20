// src/components/ui/input.tsx (CORRECTED)

import * as React from "react"
import type { InputHTMLAttributes, FC } from "react"; // Added type imports
import { cn } from "@/lib/utils"

// Define custom props to include the optional label
interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; 
}

// Update the component definition to use the new props
const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type, label, ...props }, ref) => { // Destructure 'label'
    return (
      <div className="space-y-1">
        {/* Render the label if it exists */}
        {label && (
          <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }