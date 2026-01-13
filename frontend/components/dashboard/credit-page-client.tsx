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
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-5xl font-semibold tracking-tight bg-linear-to-br from-foreground via-foreground to-foreground/70 bg-clip-text">
            Credit Profile
          </h1>
          <p className="text-base text-muted-foreground/80">
            Connect your wallet to view your credit score
          </p>
        </div>
      </div>
    )
  }

  if (loading || !creditData) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-5xl font-semibold tracking-tight bg-linear-to-br from-foreground via-foreground to-foreground/70 bg-clip-text animate-pulse">
            Loading Credit Profile...
          </h1>
          <div className="h-2 w-48 bg-muted/30 rounded-full animate-pulse" />
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
    <div className="space-y-6 pb-8">
      {/* Hero Section */}
      <div className="space-y-2">
        <h1 className="text-5xl font-semibold tracking-tight bg-linear-to-br from-foreground via-foreground to-foreground/70 bg-clip-text">
          Credit Profile
        </h1>
        <p className="text-base text-muted-foreground/80">
          View your credit score and factors
        </p>
      </div>

      {/* Credit Score Display */}
      <BackgroundGradient className="rounded-3xl p-0.5">
        <Card className="p-8 flex flex-col sm:flex-row items-center justify-between gap-8 bg-card/50 backdrop-blur-xl border-0 rounded-3xl">
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
                <h2 className="text-3xl font-semibold mb-4 tracking-tight">{getStatus(creditData.creditScore)}</h2>
              </CardItem>
              <CardItem translateZ="60">
                <p className="text-muted-foreground/90 mb-6 leading-relaxed">
                  Your credit profile shows your financial activity and payment history based on your wallet address: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </CardItem>
              <CardItem translateZ="70" className="flex flex-wrap gap-3">
                <Button className="w-full sm:w-auto shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
                  <Download className="h-4 w-4 mr-2" />
                  Income Verification
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={handleConfidentialVerify}
                  disabled={verifying}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {verifying ? "Encrypting..." : "Verify with Inco"}
                </Button>
              </CardItem>
            </CardBody>
          </CardContainer>
        </Card>
      </BackgroundGradient>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold tracking-tight">Score Breakdown</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {creditData.factors.map((factor, i) => (
            <CardContainer key={i} className="inter-var w-full">
              <CardBody className="relative group/card hover:shadow-xl hover:shadow-primary/5 bg-card/30 backdrop-blur-sm border border-border/40 w-full h-full rounded-2xl p-6 transition-all duration-300">
                <CardItem translateZ="50" className="w-full">
                  <div className="flex justify-between items-start mb-4 w-full">
                    <div className="flex-1">
                      <p className="font-medium text-foreground/90 text-sm">{factor.name}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{factor.weight}% weight</p>
                    </div>
                    <CardItem translateZ="100" className="shrink-0">
                      <p className="text-3xl font-semibold text-primary">{Math.round(factor.value)}</p>
                    </CardItem>
                  </div>
                </CardItem>
                <CardItem translateZ="60" className="w-full">
                  <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-linear-to-r from-primary via-primary to-accent h-full rounded-full transition-all duration-700 ease-out"
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
      <BackgroundGradient className="rounded-3xl p-0.5">
        <Card className="p-6 border-0 bg-card/50 backdrop-blur-xl rounded-3xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">Credit Line</h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {hasInitialized 
                  ? "Your active credit line based on your income tier" 
                  : `Based on your ${creditData.creditScore} credit score, you're eligible for up to ${eligibleCredit.toFixed(0)} SHM`
                }
              </p>
              {hasInitialized && borrowData && typeof borrowData.limit === 'number' && borrowData.limit > 0 && (
                <p className="text-sm font-medium text-primary">
                  Active Limit: {borrowData.limit.toFixed(2)} SHM
                </p>
              )}
            </div>
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground/80 mb-3 uppercase tracking-wider font-medium">
                {hasInitialized ? "Available Credit" : "Eligible For"}
              </p>
              <p className="text-4xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                {hasInitialized ? (borrowData?.balance.toFixed(2) || "0") : eligibleCredit}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2 font-semibold">SHM</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground/80 mb-3 uppercase tracking-wider font-medium">
                {hasInitialized ? "Borrowed Amount" : "Current Debt"}
              </p>
              <p className="text-4xl font-bold text-warning">
                {borrowData?.debt ? borrowData.debt.toFixed(2) : "0.00"}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2 font-semibold">SHM</p>
            </div>
          </div>

          {borrowData && borrowData.balance > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-xs text-muted-foreground/70 mb-3 uppercase tracking-wider">Credit Utilization</p>
                <div className="w-full bg-secondary/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                  <div 
                    className="bg-linear-to-r from-accent via-primary to-primary h-full rounded-full transition-all duration-700 ease-out shadow-lg shadow-primary/30" 
                    style={{ 
                      width: `${Math.min((borrowData.debt / (borrowData.balance + borrowData.debt)) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  size="lg"
                  className="w-full bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  onClick={() => setShowBorrowModal(true)}
                >
                  Borrow SHM
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="w-full shadow-md hover:shadow-lg transition-all duration-300"
                  onClick={() => setShowRepayModal(true)}
                  disabled={!borrowData || borrowData.debt <= 0}
                >
                  Repay
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground/80">
                  Choose your credit tier to activate:
                </p>
                <div className="inline-block">
                  <p className="text-xs text-primary font-medium bg-primary/5 px-3 py-2 rounded-lg">
                    💡 Recommended: {creditData.creditScore >= 70 ? "200 SHM" : creditData.creditScore >= 40 ? "33 SHM" : "Build your score first"} based on your {creditData.creditScore} credit score
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSetupCredit(200)}
                  disabled={settingUp}
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 group"
                >
                  <span className="text-3xl font-semibold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">200</span>
                  <span className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider">High Credit Tier</span>
                  <span className="text-[10px] text-muted-foreground/50">SHM</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSetupCredit(33)}
                  disabled={settingUp}
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-accent/5 hover:border-accent/50 transition-all duration-300 group"
                >
                  <span className="text-3xl font-semibold bg-linear-to-r from-accent to-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform">33</span>
                  <span className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider">Standard Tier</span>
                  <span className="text-[10px] text-muted-foreground/50">SHM</span>
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
