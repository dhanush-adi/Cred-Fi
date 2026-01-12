"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, AlertCircle } from "lucide-react"

interface SendTransactionModalProps {
  balance: number
  onClose: () => void
  onSend?: (recipient: string, amount: number) => void
}

export function SendTransactionModal({ balance, onClose, onSend }: SendTransactionModalProps) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const parsedAmount = Number.parseFloat(amount) || 0
  const isValid = recipient.match(/^0x[a-fA-F0-9]{40}$/) && parsedAmount > 0 && parsedAmount <= balance

  const handleSend = async () => {
    if (!isValid) return

    setLoading(true)
    try {
      onSend?.(recipient, parsedAmount)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Send SHM</h2>
            <button onClick={onClose} className="p-1 hover:bg-card rounded transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60"
                  max={balance}
                />
                <button
                  onClick={() => setAmount(balance.toString())}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary hover:text-primary/80"
                >
                  MAX
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available: {balance.toFixed(2)} SHM</p>
            </div>

            {parsedAmount > 0 && (
              <div className="bg-card/50 border border-border/40 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">{parsedAmount.toFixed(2)} SHM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium text-foreground">{(balance - parsedAmount).toFixed(2)} SHM</span>
                </div>
              </div>
            )}

            {recipient && !recipient.match(/^0x[a-fA-F0-9]{40}$/) && (
              <div className="bg-warning/10 border border-warning/40 rounded-lg p-3 flex gap-2">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-xs text-warning">Invalid Ethereum address format</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={!isValid || loading} className="flex-1">
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
