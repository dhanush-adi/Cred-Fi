"use client"

import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { useCallback } from "react"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { FLEX_CREDIT_CORE_ABI, AGENT_WALLET_FACTORY_ABI, CREDIT_ORACLE_ABI } from "@/lib/contract-abi"

export function useCreditContract() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const getBorrow = useCallback(async () => {
    if (!publicClient || !address) return null

    try {
      console.log('📡 Fetching credit info from contract:', CONTRACT_ADDRESSES.flexCreditCore)
      console.log('👤 User address:', address)
      
      const creditInfo = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.flexCreditCore as `0x${string}`,
        abi: FLEX_CREDIT_CORE_ABI,
        functionName: "getCreditInfo",
        args: [address],
      })) as [bigint, bigint, bigint, bigint]

      console.log('✅ Credit info received:', creditInfo)

      const [income, limit, used, available] = creditInfo

      return {
        debt: Number(used) / 1e6, // USDC has 6 decimals
        balance: Number(available) / 1e6,
        limit: Number(limit) / 1e6,
        income: Number(income),
      }
    } catch (error: any) {
      // This is expected when credit hasn't been initialized yet
      const isNotInitialized = error.message?.includes('returned no data') || error.message?.includes('0x')
      
      if (isNotInitialized) {
        console.log('ℹ️ Credit not initialized on-chain yet. Choose an income tier to get started.')
      } else {
        console.warn('⚠️ Could not fetch credit data:', error.message || error)
      }
      
      // Return default values instead of null to prevent UI errors
      return {
        debt: 0,
        balance: 0,
        limit: 0,
        income: 0,
      }
    }
  }, [publicClient, address])

  const borrow = useCallback(
    async (amount: number) => {
      if (!walletClient || !address) return null

      try {
        const amountUsdc = BigInt(Math.floor(amount * 1e6)) // USDC has 6 decimals

        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESSES.flexCreditCore as `0x${string}`,
          abi: FLEX_CREDIT_CORE_ABI,
          functionName: "useCredit",
          args: [amountUsdc],
          account: address,
        })

        return hash
      } catch (error) {
        console.error("Error borrowing:", error)
        return null
      }
    },
    [walletClient, address],
  )

  const repay = useCallback(
    async (amount: number) => {
      if (!walletClient || !address) return null

      try {
        const amountUsdc = BigInt(Math.floor(amount * 1e6)) // USDC has 6 decimals

        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESSES.flexCreditCore as `0x${string}`,
          abi: FLEX_CREDIT_CORE_ABI,
          functionName: "repayCredit",
          args: [amountUsdc],
          account: address,
        })

        return hash
      } catch (error) {
        console.error("Error repaying:", error)
        return null
      }
    },
    [walletClient, address],
  )

  const setupCredit = useCallback(
    async (incomeBucket: number) => {
      if (!walletClient || !address) return null

      try {
        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESSES.flexCreditCore as `0x${string}`,
          abi: FLEX_CREDIT_CORE_ABI,
          functionName: "initializeCredit",
          args: [BigInt(incomeBucket)],
          account: address,
        })

        return hash
      } catch (error) {
        console.error("Error setting up credit:", error)
        return null
      }
    },
    [walletClient, address],
  )

  return { getBorrow, borrow, repay, setupCredit }
}

export function useAgentContract() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const deployAgent = useCallback(
    async (agentType: number, dailyLimit: number) => {
      if (!walletClient || !address) return null

      try {
        const limitWei = BigInt(Math.floor(dailyLimit * 1e18))

        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESSES.agentWalletFactory as `0x${string}`,
          abi: AGENT_WALLET_FACTORY_ABI,
          functionName: "deployAgent",
          args: [agentType, limitWei],
          account: address,
        })

        return hash
      } catch (error) {
        console.error("Error deploying agent:", error)
        return null
      }
    },
    [walletClient, address],
  )

  return { deployAgent }
}

export function useCreditOracle() {
  const { address } = useAccount()
  const publicClient = usePublicClient()

  const getCreditScore = useCallback(async () => {
    if (!publicClient || !address) return null

    try {
      const score = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.creditOracle as `0x${string}`,
        abi: CREDIT_ORACLE_ABI,
        functionName: "getCreditScore",
        args: [address],
      })) as bigint

      return Number(score)
    } catch (error) {
      console.error("Error fetching credit score:", error)
      return null
    }
  }, [publicClient, address])

  return { getCreditScore }
}
