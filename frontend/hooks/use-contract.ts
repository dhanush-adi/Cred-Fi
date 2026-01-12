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
      const debt = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.flexCreditCore as `0x${string}`,
        abi: FLEX_CREDIT_CORE_ABI,
        functionName: "getDebt",
        args: [address],
      })) as bigint

      const balance = (await publicClient.readContract({
        address: CONTRACT_ADDRESSES.flexCreditCore as `0x${string}`,
        abi: FLEX_CREDIT_CORE_ABI,
        functionName: "getBalance",
        args: [address],
      })) as bigint

      return {
        debt: Number(debt) / 1e18,
        balance: Number(balance) / 1e18,
      }
    } catch (error) {
      console.error("Error fetching borrow data:", error)
      return null
    }
  }, [publicClient, address])

  const borrow = useCallback(
    async (amount: number) => {
      if (!walletClient || !address) return null

      try {
        const amountWei = BigInt(Math.floor(amount * 1e18))

        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESSES.flexCreditCore as `0x${string}`,
          abi: FLEX_CREDIT_CORE_ABI,
          functionName: "borrow",
          args: [amountWei],
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
        const amountWei = BigInt(Math.floor(amount * 1e18))

        const hash = await walletClient.writeContract({
          address: CONTRACT_ADDRESSES.flexCreditCore as `0x${string}`,
          abi: FLEX_CREDIT_CORE_ABI,
          functionName: "repay",
          args: [amountWei],
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

  return { getBorrow, borrow, repay }
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
