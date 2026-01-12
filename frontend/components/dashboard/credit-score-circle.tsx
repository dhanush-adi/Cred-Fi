"use client"

import { useEffect, useState } from "react"

interface CreditScoreCircleProps {
  score: number
  maxScore?: number
  size?: number
  animated?: boolean
}

export function CreditScoreCircle({ score, maxScore = 100, size = 200, animated = true }: CreditScoreCircleProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score)

  useEffect(() => {
    if (!animated) return

    let current = 0
    const interval = setInterval(() => {
      current += Math.ceil(score / 20)
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(interval)
      } else {
        setDisplayScore(current)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [score, animated])

  const percentage = (displayScore / maxScore) * 100
  const circumference = 2 * Math.PI * (size / 2 - 10)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Determine color based on score
  let color = "#ef4444" // building
  if (displayScore >= 80)
    color = "#10b981" // excellent
  else if (displayScore >= 60)
    color = "#3b82f6" // good
  else if (displayScore >= 40) color = "#f59e0b" // fair

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 10} fill="none" stroke="#2d2d5f" strokeWidth="8" />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-bold text-foreground">{displayScore}</p>
        <p className="text-sm text-muted-foreground">out of {maxScore}</p>
      </div>
    </div>
  )
}
