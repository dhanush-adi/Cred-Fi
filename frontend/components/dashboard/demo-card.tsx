"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, Loader2 } from "lucide-react"

interface DemoCardProps {
  id: string
  name: string
  description: string
  requiredCreditScore: number
  userCreditScore: number
  loading?: boolean
  onTest?: () => void
}

export function DemoCard({
  id,
  name,
  description,
  requiredCreditScore,
  userCreditScore,
  loading = false,
  onTest,
}: DemoCardProps) {
  const isLocked = userCreditScore < requiredCreditScore

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-bold text-foreground mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Requires score:</span>
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            isLocked ? "bg-error/20 text-error" : "bg-accent/20 text-accent"
          }`}
        >
          {requiredCreditScore}+
        </span>
      </div>

      <Button
        disabled={isLocked || loading}
        onClick={onTest}
        className="w-full"
        variant={isLocked ? "ghost" : "default"}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Testing...
          </>
        ) : isLocked ? (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Locked
          </>
        ) : (
          "Test"
        )}
      </Button>
    </Card>
  )
}
