'use client'

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

// components/ProgressStepper.jsx
export const ProgressStepper = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex justify-center space-x-80">
        {steps.map((stepItem, stepIdx) => (
          <li key={stepItem.name} className={cn(stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "", "relative")}>
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  currentStep > stepItem.id
                    ? "bg-primary"
                    : currentStep === stepItem.id
                      ? "border-2 border-primary"
                      : "border-2 border-gray-300",
                )}
              >
                {currentStep > stepItem.id ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span className={cn("text-sm", currentStep === stepItem.id ? "text-primary" : "text-gray-500")}>
                    {stepItem.id}
                  </span>
                )}
              </div>
              {stepIdx !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-0 top-4 -z-10 h-0.5 w-full",
                    currentStep > stepItem.id ? "bg-primary" : "bg-gray-300",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "absolute left-0 top-10 w-max text-sm",
                currentStep === stepItem.id ? "text-primary font-medium" : "text-gray-500",
              )}
            >
              {stepItem.name}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}