"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditScoreCircle } from "./credit-score-circle"
import { Download, Lock, TrendingUp } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useWriteContract, useSwitchChain } from "wagmi"
import { CONFIDENTIAL_SCORE_ABI } from "@/lib/contract-abi"
import { CONTRACT_ADDRESSES } from "@/lib/constants"
import { baseSepolia } from "viem/chains"
import { BorrowModal } from "@/components/modals/borrow-modal"
import { RepayModal } from "@/components/modals/repay-modal"
import { useCreditContract } from "@/hooks/use-contract"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
import { BackgroundGradient } from "@/components/ui/background-gradient"

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
  const { getBorrow, setupCredit } = useCreditContract()
  
  const [creditData, setCreditData] = useState<CreditData | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [settingUp, setSettingUp] = useState(false)
  const [borrowData, setBorrowData] = useState<{ debt: number; balance: number; limit?: number; income?: number } | null>(null)
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [showRepayModal, setShowRepayModal] = useState(false)
  const [shmBalance, setShmBalance] = useState(0) // Shardeum native token balance
  
  // Demo funding address with SHM tokens
  const DEMO_FUNDING_ADDRESS = '0x2962B9266a48E8F83c583caD27Be093f231781b8' as const

  const handleConfidentialVerify = async () => {
    if (!creditData || !address) return;
    setVerifying(true);
    try {
      console.log("Switching to Base Sepolia for Inco...");
      await switchChainAsync({ chainId: baseSepolia.id });

      console.log("Requesting encryption from backend...");
      
      // Call backend API to encrypt the score (no heavy libraries on frontend!)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/inco/encrypt-score`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score: creditData.creditScore,
            contractAddress: CONTRACT_ADDRESSES.confidentialScore,
            userAddress: address
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Encryption failed on backend');
      }

      const { encryptedHandle } = await response.json();
      console.log("✅ Received encrypted handle from backend");

      console.log("Sending transaction...");
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.confidentialScore as `0x${string}`,
        abi: CONFIDENTIAL_SCORE_ABI,
        functionName: "setScore",
        args: [encryptedHandle],
      });
      
      alert("Score encrypted and verified on-chain confidentially!");
    } catch (e: any) {
      console.error("Verification failed:", e);
      const errorMessage = e.response?.data?.message || e.message || "Unknown error";
      if (errorMessage.includes('temporarily unavailable') || errorMessage.includes('gateway')) {
        alert("⚠️ Inco encryption service is temporarily unavailable.\n\nThe Inco Lightning gateway may be down. Please try again later.");
      } else {
        alert("Verification failed. See console for details.");
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleSetupCredit = async (incomeBucket: number) => {
    if (!setupCredit) return
    setSettingUp(true)
    try {
      const hash = await setupCredit(incomeBucket)
      if (hash) {
        console.log("Credit setup transaction:", hash)
        // Refresh credit data after setup
        setTimeout(async () => {
          const borrowInfo = await getBorrow()
          if (borrowInfo) {
            setBorrowData(borrowInfo)
          }
        }, 3000)
      }
    } catch (error) {
      console.error("Error setting up credit:", error)
    } finally {
      setSettingUp(false)
    }
  }

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

        // Fetch borrow/debt data
        try {
          const borrowInfo = await getBorrow()
          if (borrowInfo) {
            setBorrowData(borrowInfo)
          }
        } catch (error: any) {
          // Set default values if contract call fails
          console.log('ℹ️ Using default credit values')
          setBorrowData({ debt: 0, balance: 0, limit: 0, income: 0 })
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
  }, [address, isConnected, getBorrow])

  // Calculate SHM amount based on credit score
  const getShmAmount = (score: number) => {
    if (score >= 70) return 200 // Good/Excellent score: 200 SHM
    if (score >= 40) return 33  // Fair score: 33 SHM
    return 0
  }

  // Fetch native SHM balance and calculate demo amount
  useEffect(() => {
    const fetchShmBalance = async () => {
      if (!creditData) return
      
      // Calculate SHM amount based on credit score
      const demoAmount = getShmAmount(creditData.creditScore)
      setShmBalance(demoAmount)
    }

    fetchShmBalance()
  }, [creditData])

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

  // Calculate eligible credit based on credit score (in SHM)
  const getEligibleCredit = (score: number) => {
    if (score >= 70) return 200 // Good/Excellent: 200 SHM
    if (score >= 40) return 33  // Fair: 33 SHM
    return 0 // Building: needs improvement
  }

  const eligibleCredit = creditData ? getEligibleCredit(creditData.creditScore) : 0
  const hasInitialized = borrowData && borrowData.limit !== undefined && borrowData.limit > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">Credit Profile</h1>
        <p className="text-muted-foreground mt-2">View your credit score and factors</p>
      </div>

      {/* Credit Score Display */}
      <BackgroundGradient className="rounded-[22px] p-1">
        <Card className="p-8 flex flex-col sm:flex-row items-center justify-between gap-8 bg-background border-0">
          <CardContainer className="inter-var">
            <CardBody className="relative group/card w-auto h-auto">
              <CardItem translateZ="100" className="w-full">
                <CreditScoreCircle score={creditData.creditScore} size={200} />
              </CardItem>
            </CardBody>
          </CardContainer>
          <CardContainer className="flex-1 inter-var">
            <CardBody className="relative group/card w-auto h-auto">
              <CardItem translateZ="50">
                <h2 className="text-2xl font-bold mb-4">{getStatus(creditData.creditScore)}</h2>
              </CardItem>
              <CardItem translateZ="60">
                <p className="text-muted-foreground mb-6">
                  Your credit profile shows your financial activity and payment history based on your wallet address: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </CardItem>
              <CardItem translateZ="70" className="flex flex-wrap gap-4">
                <Button className="w-full sm:w-auto transform hover:scale-105 transition-all duration-200">
                  <Download className="h-4 w-4 mr-2" />
                  Income Verification
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto transform hover:scale-105 transition-all duration-200"
                  onClick={handleConfidentialVerify}
                  disabled={verifying}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {verifying ? "Encrypting on Inco..." : "Verify Confidentially (Inco)"}
                </Button>
              </CardItem>
            </CardBody>
          </CardContainer>
        </Card>
      </BackgroundGradient>

      {/* Score Breakdown */}
      <div>
        <h3 className="text-xl font-bold mb-4">Score Breakdown</h3>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {creditData.factors.map((factor, i) => (
            <CardContainer key={i} className="inter-var w-full">
              <CardBody className="relative group/card hover:shadow-2xl hover:shadow-primary/10 bg-card border border-border/40 w-full h-full rounded-xl p-6">
                <CardItem translateZ="50" className="w-full">
                  <div className="flex justify-between items-start mb-4 w-full">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{factor.name}</p>
                      <p className="text-sm text-muted-foreground">{factor.weight}% weight</p>
                    </div>
                    <CardItem translateZ="100" className="shrink-0">
                      <p className="text-2xl font-bold text-accent">{Math.round(factor.value)}</p>
                    </CardItem>
                  </div>
                </CardItem>
                <CardItem translateZ="60" className="w-full">
                  <div className="w-full bg-card h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-linear-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(factor.value, 100)}%` }}
                    />
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>

      {/* Credit Line Info */}
      <BackgroundGradient className="rounded-[22px] p-1">
        <Card className="p-6 border-0 bg-background">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Credit Line</h3>
              <p className="text-sm text-muted-foreground">
                {hasInitialized 
                  ? "Your active credit line based on your income tier" 
                  : `Based on your ${creditData.creditScore} credit score, you're eligible for up to ${eligibleCredit.toFixed(0)} SHM`
                }
              </p>
              {hasInitialized && borrowData && typeof borrowData.limit === 'number' && borrowData.limit > 0 && (
                <p className="text-sm font-medium text-primary mt-2">
                  Active Limit: {borrowData.limit.toFixed(2)} SHM
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <CardContainer className="inter-var w-full">
              <CardBody className="w-auto h-auto">
                <CardItem translateZ="50">
                  <p className="text-sm text-muted-foreground mb-2">{hasInitialized ? "Available Credit" : "Eligible For"}</p>
                </CardItem>
                <CardItem translateZ="100">
                  <p className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                    {hasInitialized ? (borrowData?.balance.toFixed(2) || "0.00") : eligibleCredit.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">SHM</p>
                </CardItem>
              </CardBody>
            </CardContainer>
            <CardContainer className="inter-var w-full">
              <CardBody className="w-full h-auto">
                <CardItem translateZ="50">
                  <p className="text-sm text-muted-foreground mb-2">{hasInitialized ? "Borrowed Amount" : "Current Debt"}</p>
                </CardItem>
                <CardItem translateZ="100">
                  <p className="text-3xl font-bold text-warning">
                    {borrowData ? borrowData.debt.toFixed(2) : "0.00"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">SHM</p>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>

          {borrowData && borrowData.balance > 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Credit Utilization</p>
              <div className="w-full bg-secondary/40 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-linear-to-r from-accent via-primary to-primary h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min((borrowData.debt / (borrowData.balance + borrowData.debt)) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          )}

          {borrowData && borrowData.balance > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <Button 
                className="w-full bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/50"
                onClick={() => setShowBorrowModal(true)}
              >
                Borrow
              </Button>
              <Button 
                variant="outline" 
                className="w-full bg-transparent transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowRepayModal(true)}
                disabled={!borrowData || borrowData.debt <= 0}
              >
                Repay
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <p className="text-sm text-muted-foreground mb-1">
                Choose your credit tier to activate:
              </p>
              <p className="text-xs text-primary font-medium">
                💡 Recommended: {creditData.creditScore >= 70 ? "200 SHM" : creditData.creditScore >= 40 ? "33 SHM" : "Build your score first"} based on your {creditData.creditScore} credit score
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSetupCredit(200)}
                  disabled={settingUp}
                  className="h-auto py-4 flex flex-col items-center gap-1"
                >
                  <span className="text-2xl font-bold">200 SHM</span>
                  <span className="text-xs text-muted-foreground">High Credit Tier</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSetupCredit(33)}
                  disabled={settingUp}
                  className="h-auto py-4 flex flex-col items-center gap-1"
                >
                  <span className="text-2xl font-bold">33 SHM</span>
                  <span className="text-xs text-muted-foreground">Standard Tier</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </BackgroundGradient>

      {/* Modals */}
      {showBorrowModal && borrowData && (
        <BorrowModal
          availableCredit={borrowData.balance}
          apr={12}
          onClose={() => setShowBorrowModal(false)}
          onBorrow={() => {
            // Refresh data after borrow
            getBorrow().then(data => data && setBorrowData(data))
          }}
        />
      )}

      {showRepayModal && borrowData && (
        <RepayModal
          outstandingBalance={borrowData.debt}
          onClose={() => setShowRepayModal(false)}
          onRepay={() => {
            // Refresh data after repay
            getBorrow().then(data => data && setBorrowData(data))
          }}
        />
      )}
    </div>
  )
}
