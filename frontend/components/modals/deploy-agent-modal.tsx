"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"
import { useAgentContract } from "@/hooks/use-contract"

const AGENT_TYPES = [
  { id: 0, name: "Trading", description: "Automated trading strategies" },
  { id: 1, name: "Yield", description: "Yield farming optimization" },
  { id: 2, name: "Payment", description: "Payment routing" },
  { id: 3, name: "Shopping", description: "Shopping assistant" },
]

interface DeployAgentModalProps {
  onClose: () => void
  onSuccess?: (agentType: string) => void
}

export function DeployAgentModal({ onClose, onSuccess }: DeployAgentModalProps) {
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [dailyLimit, setDailyLimit] = useState("1000")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { deployAgent } = useAgentContract()

  const selectedAgent = AGENT_TYPES.find((a) => a.id === selectedType)

  const handleDeploy = async () => {
    if (selectedType === null || !dailyLimit) return

    setLoading(true)
    setError(null)

    try {
      const hash = await deployAgent(selectedType, Number.parseFloat(dailyLimit))
      if (hash) {
        onSuccess?.(selectedAgent?.name || "Agent")
        onClose()
      }
    } catch (err) {
      setError("Failed to deploy agent. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Deploy Agent</h2>
            <button onClick={onClose} className="p-1 hover:bg-card rounded transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm text-muted-foreground block mb-3">Select Agent Type</label>
              <div className="space-y-2">
                {AGENT_TYPES.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedType(agent.id)}
                    className={`w-full p-3 rounded-lg border-2 transition text-left ${
                      selectedType === agent.id
                        ? "border-primary bg-primary/10"
                        : "border-border/40 hover:border-border"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedType !== null && (
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Daily Limit (SHM)</label>
                <input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 text-foreground focus:outline-none focus:border-primary/60"
                  min="100"
                  step="100"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/40 text-error text-sm mb-4">{error}</div>
          )}

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleDeploy}
              disabled={selectedType === null || !dailyLimit || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                "Deploy"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
