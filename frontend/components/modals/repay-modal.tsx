"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useCreditContract } from "@/hooks/use-contract"

interface RepayModalProps {
  outstandingBalance: number
  onClose: () => void
  onRepay?: (amount: number) => void
}

export function RepayModal({ outstandingBalance, onClose, onRepay }: RepayModalProps) {
  const [amount, setAmount] = useState(outstandingBalance.toString())
  const [loading, setLoading] = useState(false)
  const { repay } = useCreditContract()

  const parsedAmount = Number.parseFloat(amount) || 0

  const handleRepay = async () => {
    if (!parsedAmount || parsedAmount <= 0 || parsedAmount > outstandingBalance) return

    setLoading(true)
    try {
      const hash = await repay(parsedAmount)
      if (hash) {
        onRepay?.(parsedAmount)
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Repay Loan</h2>
            <button onClick={onClose} className="p-1 hover:bg-card rounded transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Repayment Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60"
                  max={outstandingBalance}
                />
                <button
                  onClick={() => setAmount(outstandingBalance.toString())}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary hover:text-primary/80"
                >
                  MAX
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Outstanding Balance: {outstandingBalance.toFixed(2)} SHM
              </p>
            </div>

            {parsedAmount > 0 && (
              <div className="bg-card/50 border border-border/40 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount to Pay</span>
                  <span className="font-medium text-foreground">{parsedAmount.toFixed(2)} SHM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining Balance</span>
                  <span className="font-medium text-accent">{(outstandingBalance - parsedAmount).toFixed(2)} SHM</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleRepay}
              disabled={!parsedAmount || parsedAmount <= 0 || parsedAmount > outstandingBalance || loading}
              className="flex-1"
            >
              {loading ? "Processing..." : "Repay"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
