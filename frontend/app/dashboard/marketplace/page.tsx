"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/dashboard/product-card"
import { Lock } from "lucide-react"

const categories = ["E-commerce", "Food"]

const products = [
  {
    id: "1",
    title: "Premium Headphones",
    description: "High-quality wireless headphones with ANC",
    priceShm: 150,
    priceUsdc: 100,
    category: "E-commerce" as const,
    inStock: true,
  },
  {
    id: "2",
    title: "Gourmet Coffee Beans",
    description: "Single-origin Ethiopian arabica blend",
    priceShm: 45,
    priceUsdc: 30,
    category: "Food" as const,
    inStock: true,
  },
  {
    id: "3",
    title: "Smart Watch",
    description: "Fitness tracking with heart rate monitor",
    priceShm: 250,
    priceUsdc: 180,
    category: "E-commerce" as const,
    inStock: false,
  },
  {
    id: "4",
    title: "Organic Pasta Set",
    description: "Artisanal whole wheat pasta collection",
    priceShm: 35,
    priceUsdc: 25,
    category: "Food" as const,
    inStock: true,
  },
  {
    id: "5",
    title: "4K Webcam",
    description: "Professional streaming camera",
    priceShm: 300,
    priceUsdc: 220,
    category: "E-commerce" as const,
    inStock: true,
  },
  {
    id: "6",
    title: "Premium Chocolate",
    description: "Belgian dark chocolate truffles",
    priceShm: 60,
    priceUsdc: 45,
    category: "Food" as const,
    inStock: true,
  },
]

const creditScore = 72

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)

  const isLocked = creditScore < 30

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">DeFi Marketplace</h1>
        <p className="text-muted-foreground mt-2">Shop with flexible payment options</p>
      </div>

      {isLocked && (
        <Card className="p-6 border-error/40 bg-error/5">
          <div className="flex items-start gap-4">
            <Lock className="h-5 w-5 text-error mt-0.5" />
            <div>
              <h3 className="font-bold text-error mb-1">Marketplace Access Locked</h3>
              <p className="text-sm text-error/80">You need a credit score of at least 30 to access the marketplace.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            locked={isLocked}
            onBuy={(currency) => console.log(`Buying ${product.title} with ${currency}`)}
          />
        ))}
      </div>

      {/* Cart Summary */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Shopping Cart</h3>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">0 SHM</span>
          </div>
        </div>
        <Button disabled className="w-full">
          Proceed to Checkout
        </Button>
      </Card>
    </div>
  )
}
