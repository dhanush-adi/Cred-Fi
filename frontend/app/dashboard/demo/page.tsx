"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DemoCard } from "@/components/dashboard/demo-card"
import { Play } from "lucide-react"

const demoContracts = [
  {
    id: "1",
    name: "Credit Analysis",
    description: "Compute your comprehensive credit score",
    requiredCreditScore: 0,
  },
  {
    id: "2",
    name: "Borrow SHM",
    description: "Take a loan from the credit pool",
    requiredCreditScore: 40,
  },
  {
    id: "3",
    name: "Deploy Agent Wallet",
    description: "Create a new autonomous agent",
    requiredCreditScore: 50,
  },
  {
    id: "4",
    name: "DEX Swap",
    description: "Swap tokens using DEX integration",
    requiredCreditScore: 60,
  },
  {
    id: "5",
    name: "Yield Farm",
    description: "Stake tokens for yield rewards",
    requiredCreditScore: 40,
  },
  {
    id: "6",
    name: "Marketplace Purchase",
    description: "Buy items using credit",
    requiredCreditScore: 30,
  },
]

const creditScore = 72

export default function DemoPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [activityLog, setActivityLog] = useState<Array<{ timestamp: string; action: string; result: string }>>([])

  const handleTest = async (contractId: string) => {
    setLoadingId(contractId)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const contract = demoContracts.find((c) => c.id === contractId)
    const timestamp = new Date().toLocaleTimeString()

    setActivityLog([
      {
        timestamp,
        action: contract?.name || "Unknown",
        result: "0x" + Math.random().toString(16).substring(2, 18),
      },
      ...activityLog,
    ])

    setLoadingId(null)
  }

  const handleRunComplete = async () => {
    setLoadingId("complete")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const timestamp = new Date().toLocaleTimeString()
    setActivityLog([
      {
        timestamp,
        action: "Complete Flow Execution",
        result: "0x" + Math.random().toString(16).substring(2, 18),
      },
      ...activityLog,
    ])

    setLoadingId(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">Contract Demos</h1>
        <p className="text-muted-foreground mt-2">Test smart contract interactions on Shardeum</p>
      </div>

      {/* Run Complete Flow Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleRunComplete}
          disabled={loadingId === "complete"}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          size="lg"
        >
          <Play className="h-4 w-4 mr-2" />
          Run Complete Flow
        </Button>
      </div>

      {/* Demo Contracts Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Demos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoContracts.map((contract) => (
            <DemoCard
              key={contract.id}
              {...contract}
              userCreditScore={creditScore}
              loading={loadingId === contract.id}
              onTest={() => handleTest(contract.id)}
            />
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
        <Card>
          {activityLog.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No activity yet. Run a contract demo to see results here.</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {activityLog.map((log, idx) => (
                <div key={idx} className={`p-4 ${idx !== activityLog.length - 1 ? "border-b border-border/40" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{log.result}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
