"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

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

export default function DemoPage() {
  const { address, isConnected } = useWallet()
  const [creditScore, setCreditScore] = useState(0)
  const [userBalance, setUserBalance] = useState(0)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [activityLog, setActivityLog] = useState<Array<{ timestamp: string; action: string; result: string }>>([])
  const [loading, setLoading] = useState(true)

  // Fetch user data when wallet connects
  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false)
      return
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/${address}`
        )
        if (response.ok) {
          const data = await response.json()
          setCreditScore(data.creditScore || 0)
          setUserBalance(data.balance || 0)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [address, isConnected])

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

  if (!isConnected) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Contract Demos</h1>
          <p className="text-muted-foreground mt-2">Test smart contract interactions on Shardeum</p>
        </div>
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground">Please connect your wallet to run contract demos.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">Contract Demos</h1>
        <p className="text-muted-foreground mt-2">
          Test smart contract interactions on Shardeum • Credit Score: {creditScore} • Balance: {userBalance.toFixed(2)} SHM
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      {/* Run Complete Flow Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleRunComplete}
          disabled={loadingId === "complete"}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
          {demoContracts.map((contract) => {
            const isAccessible = creditScore >= contract.requiredCreditScore
            return (
              <Card key={contract.id} className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{contract.name}</h3>
                  <p className="text-sm text-muted-foreground">{contract.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Required Credit Score: {contract.requiredCreditScore}
                  {isAccessible ? (
                    <span className="ml-2 text-green-600">✓ Accessible</span>
                  ) : (
                    <span className="ml-2 text-red-600">✗ Locked</span>
                  )}
                </div>
                <Button
                  onClick={() => handleTest(contract.id)}
                  disabled={loadingId === contract.id || !isAccessible}
                  className="w-full"
                >
                  {loadingId === contract.id ? "Running..." : "Test"}
                </Button>
              </Card>
            )
          })}
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
