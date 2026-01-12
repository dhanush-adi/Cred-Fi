"use client"

import { Menu, X, LogOut } from "lucide-react"
import { useState } from "react"
import { NetworkBadge } from "./network-badge"
import { CreditBadge } from "./credit-badge"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"

interface TopNavProps {
  walletAddress?: string
  creditScore?: number
  onMenuToggle: (open: boolean) => void
  onDisconnect?: () => void
}

export function TopNav({ walletAddress, creditScore = 0, onMenuToggle, onDisconnect }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { address, isConnected, disconnect, connectMetaMask } = useWallet()
  
  // Use actual wallet address if connected, otherwise use passed prop
  const displayAddress = isConnected ? address : walletAddress

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
    onMenuToggle(!menuOpen)
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleDisconnect = () => {
    disconnect()
    if (onDisconnect) {
      onDisconnect()
    }
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-md glass-dark">
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent"></div>
          <span className="font-bold text-lg text-foreground">Cred-Fi</span>
        </div>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-4">
          {creditScore > 0 && <CreditBadge score={creditScore} />}
          <NetworkBadge />
          {isConnected && displayAddress ? (
            <div className="px-3 py-1 rounded-lg bg-card border border-border/40">
              <p className="text-sm font-mono text-muted-foreground">{truncateAddress(displayAddress)}</p>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={connectMetaMask}>
              Connect Wallet
            </Button>
          )}
          {isConnected && (
            <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="sm:hidden p-2" onClick={toggleMenu}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border/40 px-4 py-4 flex flex-col gap-3">
          {creditScore > 0 && <CreditBadge score={creditScore} />}
          <NetworkBadge />
          {isConnected && displayAddress ? (
            <div className="px-3 py-1 rounded-lg bg-card border border-border/40">
              <p className="text-sm font-mono text-muted-foreground">{truncateAddress(displayAddress)}</p>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={connectMetaMask}>
              Connect Wallet
            </Button>
          )}
          {isConnected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="text-destructive hover:bg-destructive/10 justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          )}
        </div>
      )}
    </nav>
  )
}
