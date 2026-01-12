"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"
import { VERIFICATION_PROVIDERS } from "@/lib/constants"
import { initiateIncomeVerification } from "@/lib/api"

interface IncomeVerificationModalProps {
  walletAddress: string
  onClose: () => void
  onSuccess?: () => void
}

export function IncomeVerificationModal({ walletAddress, onClose, onSuccess }: IncomeVerificationModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!selectedProvider) return

    setLoading(true)
    setError(null)

    try {
      const result = await initiateIncomeVerification(walletAddress, selectedProvider)
      if (result) {
        onSuccess?.()
        onClose()
      }
    } catch (err) {
      setError("Failed to initiate verification. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Verify Income</h2>
            <button onClick={onClose} className="p-1 hover:bg-card rounded transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Connect your bank account to verify your monthly income and boost your credit score.
          </p>

          <div className="space-y-2 mb-6">
            {VERIFICATION_PROVIDERS.map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`w-full p-4 rounded-lg border-2 transition text-left font-medium ${
                  selectedProvider === provider
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/40 hover:border-border text-muted-foreground"
                }`}
              >
                {provider}
              </button>
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/40 text-error text-sm mb-4">{error}</div>
          )}

          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={!selectedProvider || loading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
