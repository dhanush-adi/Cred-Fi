"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, X } from "lucide-react"

interface WalletConnectButtonProps {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

export function WalletConnectButton({ variant = "default", size = "default" }: WalletConnectButtonProps) {
  const { address, isConnected, connectMetaMask, connectWalletConnect, connectCoinbase, disconnect, isMounted } =
    useWallet()
  const [showModal, setShowModal] = useState(false)

  if (!isMounted) return null

  if (isConnected && address) {
    return (
      <Button onClick={() => disconnect()} variant="outline" size={size}>
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    )
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant={variant === "default" ? "default" : "outline"}
        size={size}
        className={
          variant === "default"
            ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            : ""
        }
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>

      {/* Wallet Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Connect Wallet</h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-card rounded transition">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    connectMetaMask()
                    setShowModal(false)
                  }}
                  className="w-full p-4 rounded-lg border border-border/40 hover:bg-card/50 transition text-left flex items-center justify-between"
                >
                  <span className="font-medium">MetaMask</span>
                  <span className="text-2xl">🦊</span>
                </button>

                <button
                  onClick={() => {
                    connectWalletConnect()
                    setShowModal(false)
                  }}
                  className="w-full p-4 rounded-lg border border-border/40 hover:bg-card/50 transition text-left flex items-center justify-between"
                >
                  <span className="font-medium">WalletConnect</span>
                  <span className="text-2xl">🔗</span>
                </button>

                <button
                  onClick={() => {
                    connectCoinbase()
                    setShowModal(false)
                  }}
                  className="w-full p-4 rounded-lg border border-border/40 hover:bg-card/50 transition text-left flex items-center justify-between"
                >
                  <span className="font-medium">Coinbase Wallet</span>
                  <span className="text-2xl">🪙</span>
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-6 text-center">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
