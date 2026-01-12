"use client"

import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi"
import { useCallback, useEffect, useState } from "react"

export function useWallet() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const currentChainId = useChainId()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Debug: Log available connectors
    if (connectors.length > 0) {
      console.log("Available connectors:", connectors.map(c => ({ name: c.name, id: c.id })))
    } else {
      console.warn("No connectors available - wagmi may not be properly initialized")
    }
  }, [connectors])

  const connectMetaMask = useCallback(() => {
    const metaMaskConnector = connectors.find((c) => c.name === "MetaMask")
    if (metaMaskConnector) {
      console.log("Connecting with MetaMask...")
      connect({ connector: metaMaskConnector })
    } else {
      console.warn("MetaMask connector not found. Available connectors:", connectors.map(c => c.name))
    }
  }, [connect, connectors])

  const connectWalletConnect = useCallback(() => {
    const wcConnector = connectors.find((c) => c.name === "WalletConnect")
    if (wcConnector) {
      console.log("Connecting with WalletConnect...")
      connect({ connector: wcConnector })
    } else {
      console.warn("WalletConnect connector not found. Available connectors:", connectors.map(c => c.name))
    }
  }, [connect, connectors])

  const connectCoinbase = useCallback(() => {
    const cbConnector = connectors.find((c) => c.name === "Coinbase Wallet")
    if (cbConnector) {
      console.log("Connecting with Coinbase Wallet...")
      connect({ connector: cbConnector })
    } else {
      console.warn("Coinbase connector not found. Available connectors:", connectors.map(c => c.name))
    }
  }, [connect, connectors])

  const isWrongNetwork = isConnected && currentChainId !== 8119

  return {
    address,
    isConnected,
    isMounted,
    isWrongNetwork,
    connectMetaMask,
    connectWalletConnect,
    connectCoinbase,
    disconnect,
    status,
    error,
    connectors, // Expose connectors for debugging
  }
}
