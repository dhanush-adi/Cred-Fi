"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface ProductCardProps {
  id: string
  title: string
  description: string
  image: string
  priceShm: number
  priceUsdc: number
  inStock: boolean
  locked?: boolean
  onBuy?: (currency: "shm" | "usdc") => void
}

export function ProductCard({
  id,
  title,
  description,
  image,
  priceShm,
  priceUsdc,
  inStock,
  locked = false,
  onBuy,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/40 transition flex flex-col relative group">
      {/* Image placeholder */}
      <div className="relative w-full h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
        <div className="text-4xl opacity-50">📦</div>
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white font-semibold">Out of Stock</p>
          </div>
        )}
        {locked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Lock className="h-6 w-6 text-white" />
              <p className="text-white text-sm font-semibold">Locked</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>

        {/* Pricing */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">SHM</span>
            <span className="font-semibold text-foreground">{priceShm}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">USDC</span>
            <span className="font-semibold text-foreground">${priceUsdc}</span>
          </div>
        </div>

        {/* Buttons */}
        {!locked && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onBuy?.("shm")} disabled={!inStock} className="flex-1">
              Buy with SHM
            </Button>
            <Button size="sm" variant="outline" onClick={() => onBuy?.("usdc")} disabled={!inStock} className="flex-1">
              Buy USDC
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
