"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useSwitchChain } from "wagmi"

export function WrongNetworkAlert() {
  const { switchChain } = useSwitchChain()

  return (
    <Alert className="border-warning/40 bg-warning/5">
      <AlertCircle className="h-4 w-4 text-warning" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-warning">Please switch to Shardeum Mezame (Chain ID: 8119)</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => switchChain({ chainId: 8119 })}
          className="ml-4 text-warning border-warning/40 hover:bg-warning/10"
        >
          Switch Network
        </Button>
      </AlertDescription>
    </Alert>
  )
}
