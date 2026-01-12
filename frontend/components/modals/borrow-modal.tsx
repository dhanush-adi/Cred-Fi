"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Info } from "lucide-react"
import { useCreditContract } from "@/hooks/use-contract"

interface BorrowModalProps {
  availableCredit: number
  apr: number
  onClose: () => void
  onBorrow?: (amount: number) => void
}

export function BorrowModal({ availableCredit, apr, onClose, onBorrow }: BorrowModalProps) {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { borrow } = useCreditContract()

  const parsedAmount = Number.parseFloat(amount) || 0
  const monthlyPayment = parsedAmount * (apr / 100 / 12 / (1 - Math.pow(1 + apr / 100 / 12, -12)))
  const totalCost = monthlyPayment * 12

  const handleBorrow = async () => {
    if (!parsedAmount || parsedAmount <= 0 || parsedAmount > availableCredit) return

    setLoading(true)
    try {
      const hash = await borrow(parsedAmount)
      if (hash) {
        onBorrow?.(parsedAmount)
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
            <h2 className="text-xl font-bold">Borrow SHM</h2>
            <button onClick={onClose} className="p-1 hover:bg-card rounded transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Amount to Borrow</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60"
                  max={availableCredit}
                />
                <button
                  onClick={() => setAmount(availableCredit.toString())}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-primary hover:text-primary/80"
                >
                  MAX
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available: {availableCredit.toFixed(2)} SHM</p>
            </div>

            {parsedAmount > 0 && (
              <>
                <div className="bg-card/50 border border-border/40 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">APR</span>
                    <span className="font-medium text-foreground">{apr}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Payment</span>
                    <span className="font-medium text-foreground">{monthlyPayment.toFixed(2)} SHM</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border/40">
                    <span className="text-muted-foreground">Total Cost (12 months)</span>
                    <span className="font-bold text-accent">{totalCost.toFixed(2)} SHM</span>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/40 rounded-lg p-3 flex gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-primary">You'll need to repay this loan within 12 months.</p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleBorrow}
              disabled={!parsedAmount || parsedAmount <= 0 || parsedAmount > availableCredit || loading}
              className="flex-1"
            >
              {loading ? "Processing..." : "Borrow"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
