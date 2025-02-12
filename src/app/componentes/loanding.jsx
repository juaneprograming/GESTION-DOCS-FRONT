"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import Lottie from "lottie-react"
import loadingAnimation from "@/app/colombiaJson/Loadingjson.json"


export default function Loading({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const maxDuration = 100 // duración máxima en ms (5 segundos)
    const increment = 1 // cantidad de incremento por intervalo

    const updateProgress = () => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          return 100
        }
        return prev + increment
      })
    }

    const timer = setInterval(updateProgress, maxDuration / 100) // Aproximadamente 100 incrementos en 5 segundos

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="mb-4">
      <Lottie animationData={loadingAnimation} loop={true} />
      </div>
      <div className="text-xl font-semibold mb-4 text-primary">Cargando...</div>
      <div className="w-64 mb-4">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="text-sm text-muted-foreground flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Cargando... {Math.round(progress)}%
      </div>
    </div>
  )
}

