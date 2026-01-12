import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditScoreCircle } from "@/components/dashboard/credit-score-circle"
import { TrendingUp, Download } from "lucide-react"

export default function CreditPage() {
  const creditScore = 72

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">Credit Profile</h1>
        <p className="text-muted-foreground mt-2">View your credit score and factors</p>
      </div>

      {/* Credit Score Display */}
      <Card className="p-8 flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="flex items-center justify-center">
          <CreditScoreCircle score={creditScore} size={200} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Good Standing</h2>
          <p className="text-muted-foreground mb-6">
            Your credit profile shows healthy financial activity and consistent payment history.
          </p>
          <div className="space-y-2">
            <Button className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Income Verification
            </Button>
          </div>
        </div>
      </Card>

      {/* Score Breakdown */}
      <div>
        <h3 className="text-xl font-bold mb-4">Score Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "On-chain Activity", value: 85, weight: 30 },
            { name: "Wallet Balance", value: 70, weight: 25 },
            { name: "Income Verification", value: 60, weight: 30 },
            { name: "Transaction History", value: 75, weight: 15 },
          ].map((factor, i) => (
            <Card key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-foreground">{factor.name}</p>
                  <p className="text-sm text-muted-foreground">{factor.weight}% weight</p>
                </div>
                <span className="text-2xl font-bold text-primary">{factor.value}</span>
              </div>
              <div className="w-full bg-secondary/40 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${factor.value}%` }}></div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Credit Line Info */}
      <Card className="p-6 border-primary/40">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Credit Line</h3>
            <p className="text-sm text-muted-foreground">Flexible borrowing options</p>
          </div>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Available Credit</p>
            <p className="text-3xl font-bold text-accent">500 SHM</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Used Credit</p>
            <p className="text-3xl font-bold text-warning">100 SHM</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Credit Utilization</p>
          <div className="w-full bg-secondary/40 rounded-full h-2">
            <div className="bg-gradient-to-r from-accent to-primary h-2 rounded-full" style={{ width: "16.7%" }}></div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Button className="w-full">Borrow</Button>
          <Button variant="outline" className="w-full bg-transparent">
            Repay
          </Button>
        </div>
      </Card>
    </div>
  )
}
