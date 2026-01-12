"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pause, Play, MoreVertical } from "lucide-react"

interface AgentCardProps {
  id: string
  name: string
  type: string
  icon: string
  status: "active" | "paused"
  dailyLimit: number
  reputation: number
  performance: number
  deployed: boolean
  onDeploy?: () => void
  onPause?: () => void
  onResume?: () => void
}

export function AgentCard({
  id,
  name,
  type,
  icon,
  status,
  dailyLimit,
  reputation,
  performance,
  deployed,
  onDeploy,
  onPause,
  onResume,
}: AgentCardProps) {
  return (
    <Card className="p-6 hover:border-primary/40 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">{icon}</div>
          <div>
            <h3 className="font-bold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-card rounded transition">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">Status</p>
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
              status === "active" ? "bg-accent/20 text-accent" : "bg-muted/40 text-muted-foreground"
            }`}
          >
            {status === "active" ? "Active" : "Paused"}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Daily Limit</span>
          <span className="text-foreground font-medium">{dailyLimit} SHM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Reputation</span>
          <span className="text-foreground font-medium">{reputation}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Performance</span>
          <span className="text-foreground font-medium">{performance}%</span>
        </div>
      </div>

      <div className="flex gap-2">
        {!deployed ? (
          <Button onClick={onDeploy} className="w-full">
            Deploy Agent
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={status === "active" ? onPause : onResume}
              className="flex-1 bg-transparent"
            >
              {status === "active" ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              Transactions
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
