// API helper functions for backend integration

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function fetchCreditAnalysis(walletAddress: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/vlayer/comprehensive-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    })
    if (!response.ok) throw new Error("Failed to fetch credit analysis")
    return response.json()
  } catch (error) {
    console.error("Error fetching credit analysis:", error)
    throw error
  }
}

export async function initiateIncomeVerification(walletAddress: string, provider: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/vouch/initiate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, provider }),
    })
    if (!response.ok) throw new Error("Failed to initiate verification")
    return response.json()
  } catch (error) {
    console.error("Error initiating income verification:", error)
    throw error
  }
}

export async function checkVerificationStatus(requestId: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/vouch/status/${requestId}`)
    if (!response.ok) throw new Error("Failed to check verification status")
    return response.json()
  } catch (error) {
    console.error("Error checking verification status:", error)
    throw error
  }
}
