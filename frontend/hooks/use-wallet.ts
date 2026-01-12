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
  }, [])

  const connectMetaMask = useCallback(() => {
    const metaMaskConnector = connectors.find((c) => c.name === "MetaMask")
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector })
    }
  }, [connect, connectors])

  const connectWalletConnect = useCallback(() => {
    const wcConnector = connectors.find((c) => c.name === "WalletConnect")
    if (wcConnector) {
      connect({ connector: wcConnector })
    }
  }, [connect, connectors])

  const connectCoinbase = useCallback(() => {
    const cbConnector = connectors.find((c) => c.name === "Coinbase Wallet")
    if (cbConnector) {
      connect({ connector: cbConnector })
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
  }
}
