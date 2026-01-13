import Link from "next/link"
import { ArrowRight, Lock, Zap, TrendingUp, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WavyBackground } from "@/components/ui/wavy-background"
import { HoverEffect } from "@/components/ui/card-hover-effect"

export default function LandingPage() {
  const features = [
    {
      title: "Zero-Knowledge Verification",
      description: "Prove your creditworthiness without revealing sensitive financial information",
      icon: <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
        <Lock className="h-6 w-6 text-primary" />
      </div>
    },
    {
      title: "AI Agent Wallets",
      description: "Deploy autonomous agents for trading, yield farming, and payments",
      icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
        <Zap className="h-6 w-6 text-accent" />
      </div>
    },
    {
      title: "DeFi Marketplace",
      description: "Shop, trade, and access services with flexible payment options and credit",
      icon: <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
        <ShoppingCart className="h-6 w-6 text-primary" />
      </div>
    },
    {
      title: "Flexible Credit Lines",
      description: "Access uncollateralized credit with transparent rates and instant approval",
      icon: <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
        <TrendingUp className="h-6 w-6 text-accent" />
      </div>
    },
  ]

  return (
    <div className="min-h-screen bg-background relative">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent"></div>
            <span className="font-bold text-lg text-foreground">Cred-Fi</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#network" className="text-sm text-muted-foreground hover:text-foreground transition">
              Network
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Wavy Background */}
      <WavyBackground
        className="w-full"
        containerClassName="relative"
        colors={["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]}
        waveWidth={50}
        backgroundFill="rgb(10, 10, 12)"
        blur={10}
        speed="slow"
        waveOpacity={0.3}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-block px-4 py-2 mb-6 rounded-full border border-primary/50 bg-primary/10 backdrop-blur-sm">
            <p className="text-sm font-medium text-primary">Shardeum Mezame Network</p>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-balance text-white">Complete DeFi</span>
            <br />
            <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              Credit Platform
            </span>
          </h1>

          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Unlock your financial potential with zero-knowledge verification, AI agent wallets, and flexible credit
            lines. All on a secure, scalable blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/50"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <button className="px-8 py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 backdrop-blur-sm transition transform hover:scale-105">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-white/20 backdrop-blur-sm">
            <div className="transform hover:scale-110 transition-all duration-300">
              <p className="text-2xl sm:text-3xl font-bold text-accent">∞</p>
              <p className="text-sm text-gray-300">Zero Knowledge Proofs</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <p className="text-2xl sm:text-3xl font-bold text-primary">100%</p>
              <p className="text-sm text-gray-300">On-Chain Transparent</p>
            </div>
            <div className="transform hover:scale-110 transition-all duration-300">
              <p className="text-2xl sm:text-3xl font-bold text-accent">24/7</p>
              <p className="text-sm text-gray-300">Always Available</p>
            </div>
          </div>
        </div>
      </WavyBackground>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 border-t border-border/40 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to access DeFi credit and grow your wealth
            </p>
          </div>

          <HoverEffect items={features} className="md:grid-cols-2" />
        </div>
      </section>

      {/* Network Info Section */}
      <section id="network" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 rounded-xl border border-border/40 glass">
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 rounded-xl"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Shardeum Mezame</h3>
                  <p className="text-muted-foreground">Enterprise-Grade Blockchain</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                Built on Shardeum's innovative sharding technology, Cred-Fi delivers high throughput, low latency, and
                true decentralization. Perfect for financial applications that demand security and scalability.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40">
                <div>
                  <p className="text-sm text-muted-foreground">Chain ID</p>
                  <p className="font-mono text-foreground">8119</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="text-foreground">Mezame</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="text-foreground">SHM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Enter the dashboard and unlock your financial potential today
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-linear-to-br from-primary to-accent"></div>
              <span className="font-semibold text-foreground">Cred-Fi</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition">
                Docs
              </a>
              <a href="#" className="hover:text-foreground transition">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>Copyright © 2026 Cred-Fi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
