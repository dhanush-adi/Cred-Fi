"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditScoreCircle } from "./credit-score-circle"
import { Download, Lock } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useWriteContract, useSwitchChain } from "wagmi"
import { CONFIDENTIAL_SCORE_ABI } from "@/lib/contract-abi"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { encryptScore } from "@/lib/fhevm"
import { baseSepolia } from "viem/chains"

interface CreditData {
  creditScore: number
  factors: Array<{
    name: string
    value: number
    weight: number
  }>
}

export function CreditPageClient() {
  const { address, isConnected } = useWallet()
  const { writeContractAsync } = useWriteContract()
  const { switchChainAsync } = useSwitchChain()
  
  const [creditData, setCreditData] = useState<CreditData | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const handleConfidentialVerify = async () => {
    if (!creditData || !address) return;
    setVerifying(true);
    try {
      console.log("Switching to Base Sepolia for Inco...");
      await switchChainAsync({ chainId: baseSepolia.id });

      console.log("Encrypting score...", creditData.creditScore);
      // Encrypt the visible score to send it confidentially to the chain
      // Note: contractAddress should be the real deployed address
      const encryptedHandle = await encryptScore(
        creditData.creditScore, 
        CONTRACT_ADDRESSES.confidentialScore, 
        address
      );

      console.log("Sending transaction...");
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.confidentialScore as `0x${string}`,
        abi: CONFIDENTIAL_SCORE_ABI,
        functionName: "setScore",
        args: [encryptedHandle], // Correctly passing the bytes handle
      });
      
      alert("Score encrypted and verified on-chain confidentially!");
    } catch (e) {
      console.error("Verification failed:", e);
      alert("Verification failed. See console.");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!isConnected || !address) {
      setCreditData(null)
      return
    }

    const fetchCreditData = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/${address}`
        )

        if (response.ok) {
          const data = await response.json()
          setCreditData({
            creditScore: data.creditScore,
            factors: [
              { name: "On-chain Activity", value: (data.creditScore * 1.2) % 100, weight: 30 },
              { name: "Wallet Balance", value: (data.creditScore * 0.9) % 100, weight: 25 },
              { name: "Income Verification", value: (data.creditScore * 0.85) % 100, weight: 30 },
              { name: "Transaction History", value: (data.creditScore * 1.05) % 100, weight: 15 },
            ],
          })
        }
      } catch (error) {
        console.error("Error fetching credit data:", error)
        setCreditData({
          creditScore: 0,
          factors: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCreditData()
  }, [address, isConnected])

  if (!isConnected) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Credit Profile</h1>
          <p className="text-muted-foreground mt-2">Connect your wallet to view your credit score</p>
        </div>
      </div>
    )
  }

  if (loading || !creditData) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-balance">Loading Credit Profile...</h1>
        </div>
      </div>
    )
  }

  const getStatus = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 70) return "Good Standing"
    if (score >= 50) return "Fair"
    return "Building"
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">Credit Profile</h1>
        <p className="text-muted-foreground mt-2">View your credit score and factors</p>
      </div>

      {/* Credit Score Display */}
      <Card className="p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex items-center justify-center">
          <CreditScoreCircle score={creditData.creditScore} size={200} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">{getStatus(creditData.creditScore)}</h2>
          <p className="text-muted-foreground mb-6">
            Your credit profile shows your financial activity and payment history based on your wallet address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Income Verification
            </Button>
            <Button 
                variant="secondary" 
                className="w-full sm:w-auto"
                onClick={handleConfidentialVerify}
                disabled={verifying}
              >
                <Lock className="mr-2 h-4 w-4" />
                {verifying ? "Encrypting on Inco..." : "Verify Confidentially (Inco)"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Score Breakdown */}
      <div>
        <h3 className="text-xl font-bold mb-4">Score Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {creditData.factors.map((factor, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-foreground">{factor.name}</p>
                  <p className="text-sm text-muted-foreground">{factor.weight}% weight</p>
                </div>
                <p className="text-2xl font-bold text-accent">{Math.round(factor.value)}</p>
              </div>
              <div className="w-full bg-card h-2 rounded-full overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full transition-all"
                  style={{ width: `${Math.min(factor.value, 100)}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
