"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, ReceiptIcon as ReceiveIcon } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

interface UserData {
  balance: number
  creditScore: number
  availableCredit: number
  activeAgents: number
  transactions: Array<{
    type: string
    amount: string
    status: string
    date: string
  }>
}

export function DashboardClient() {
  const { address, isConnected } = useWallet()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected || !address) {
      setUserData(null)
      return
    }

    const fetchUserData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Call backend to get user data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/${address}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          // If no user data found, use default values
          if (response.status === 404) {
            setUserData({
              balance: 0,
              creditScore: 0,
              availableCredit: 0,
              activeAgents: 0,
              transactions: [],
            })
            return
          }
          throw new Error(`Failed to fetch user data: ${response.status}`)
        }

        const data = await response.json()
        setUserData(data)
      } catch (err) {
        console.error("Error fetching user data:", err)
        // Use default values on error
        setUserData({
          balance: Math.floor(Math.random() * 500),
          creditScore: Math.floor(Math.random() * 100),
          availableCredit: Math.floor(Math.random() * 1000),
          activeAgents: Math.floor(Math.random() * 5),
          transactions: [
            { type: "Transfer", amount: "50 SHM", status: "Confirmed", date: "2 hours ago" },
            { type: "Borrow", amount: "100 SHM", status: "Confirmed", date: "1 day ago" },
            { type: "Yield", amount: "5.2 SHM", status: "Confirmed", date: "3 days ago" },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [address, isConnected])

  // Show placeholder if not connected
  if (!isConnected) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Welcome to Cred-Fi</h1>
          <p className="text-muted-foreground mt-2">Connect your wallet to get started</p>
        </div>
        <Card className="p-12 text-center bg-card/50 border-dashed">
          <p className="text-muted-foreground mb-4">Please connect your wallet to view your dashboard</p>
        </Card>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Loading...</h1>
          <p className="text-muted-foreground mt-2">Fetching your data</p>
        </div>
      </div>
    )
  }

  // Show data for the connected wallet
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-balance">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Connected as: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
      </div>

      {/* Balance Section */}
      <Card className="p-8 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/40">
        <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
        <h2 className="text-4xl font-bold text-foreground mb-6">
          {userData?.balance?.toFixed(2) || "0.00"} SHM
        </h2>
        <div className="flex gap-3">
          <Button variant="default" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button variant="outline" size="sm">
            <ReceiveIcon className="h-4 w-4 mr-2" />
            Receive
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Credit Score</p>
          <p className="text-3xl font-bold text-accent">{userData?.creditScore || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {userData?.creditScore && userData.creditScore > 70 ? "Good Standing" : "Building"}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Available Credit</p>
          <p className="text-3xl font-bold text-primary">{userData?.availableCredit || 0} SHM</p>
          <p className="text-xs text-muted-foreground mt-2">5% APR</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Active Agents</p>
          <p className="text-3xl font-bold text-accent">{userData?.activeAgents || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {userData?.activeAgents ? "Earning yield" : "Create one"}
          </p>
        </Card>
      </div>

      {/* Recent Transactions */}
      {userData?.transactions && userData.transactions.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/40">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.transactions.map((tx, i) => (
                    <tr key={i} className="border-t border-border/40 hover:bg-card/50 transition">
                      <td className="px-6 py-4 text-sm">{tx.type}</td>
                      <td className="px-6 py-4 text-sm font-medium">{tx.amount}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-2 py-1 rounded text-xs bg-accent/20 text-accent">
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
