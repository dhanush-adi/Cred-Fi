import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, ReceiptIcon as ReceiveIcon } from "lucide-react"

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-balance">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Manage your credit, agents, and portfolio</p>
      </div>

      {/* Balance Section */}
      <Card className="p-8 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/40">
        <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
        <h2 className="text-4xl font-bold text-foreground mb-6">250.5 SHM</h2>
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
          <p className="text-3xl font-bold text-accent">72</p>
          <p className="text-xs text-muted-foreground mt-2">Good Standing</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Available Credit</p>
          <p className="text-3xl font-bold text-primary">500 SHM</p>
          <p className="text-xs text-muted-foreground mt-2">5% APR</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Active Agents</p>
          <p className="text-3xl font-bold text-accent">2</p>
          <p className="text-xs text-muted-foreground mt-2">Earning yield</p>
        </Card>
      </div>

      {/* Recent Transactions */}
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
                {[
                  { type: "Transfer", amount: "50 SHM", status: "Confirmed", date: "2 hours ago" },
                  { type: "Borrow", amount: "100 SHM", status: "Confirmed", date: "1 day ago" },
                  { type: "Yield", amount: "5.2 SHM", status: "Confirmed", date: "3 days ago" },
                ].map((tx, i) => (
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
    </div>
  )
}
