"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/dashboard/agent-card"
import { Plus } from "lucide-react"

const availableAgents = [
  {
    id: "1",
    name: "DeFi Trader",
    type: "Trading",
    icon: "📈",
    dailyLimit: 1000,
    reputation: 92,
    performance: 88,
  },
  {
    id: "2",
    name: "Yield Optimizer",
    type: "Yield",
    icon: "🌾",
    dailyLimit: 500,
    reputation: 85,
    performance: 91,
  },
  {
    id: "3",
    name: "Payment Router",
    type: "Payment",
    icon: "💳",
    dailyLimit: 5000,
    reputation: 98,
    performance: 99,
  },
  {
    id: "4",
    name: "Shopping Assistant",
    type: "Shopping",
    icon: "🛍️",
    dailyLimit: 2000,
    reputation: 88,
    performance: 85,
  },
]

const deployedAgents = [
  {
    id: "d1",
    name: "DeFi Trader",
    type: "Trading",
    icon: "📈",
    status: "active" as const,
    dailyLimit: 1000,
    reputation: 92,
    performance: 88,
    deployed: true,
  },
  {
    id: "d2",
    name: "Yield Optimizer",
    type: "Yield",
    icon: "🌾",
    status: "paused" as const,
    dailyLimit: 500,
    reputation: 85,
    performance: 91,
    deployed: true,
  },
]

export default function AgentsPage() {
  const [deployedList, setDeployedList] = useState(deployedAgents)

  const handleDeploy = (agentId: string) => {
    const agent = availableAgents.find((a) => a.id === agentId)
    if (agent) {
      setDeployedList([
        ...deployedList,
        {
          ...agent,
          status: "active" as const,
          deployed: true,
        },
      ])
    }
  }

  const handlePause = (agentId: string) => {
    setDeployedList(deployedList.map((a) => (a.id === agentId ? { ...a, status: "paused" as const } : a)))
  }

  const handleResume = (agentId: string) => {
    setDeployedList(deployedList.map((a) => (a.id === agentId ? { ...a, status: "active" as const } : a)))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">AI Agents</h1>
        <p className="text-muted-foreground mt-2">Deploy and manage autonomous agents for trading and yield</p>
      </div>

      {/* Deployed Agents */}
      {deployedList.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Deployed Agents</h2>
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
              {deployedList.length}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {deployedList.map((agent) => (
              <AgentCard
                key={agent.id}
                {...agent}
                onPause={() => handlePause(agent.id)}
                onResume={() => handleResume(agent.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Agents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Available Agents</h2>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Browse More
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {availableAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              {...agent}
              status="paused"
              deployed={false}
              onDeploy={() => handleDeploy(agent.id)}
            />
          ))}
        </div>
      </div>

      {/* Agent Analytics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Performance Summary</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
            <p className="text-3xl font-bold text-accent">12.5 SHM</p>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Avg Performance</p>
            <p className="text-3xl font-bold text-primary">89%</p>
            <p className="text-xs text-muted-foreground mt-2">All agents</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Active Now</p>
            <p className="text-3xl font-bold text-accent">{deployedList.filter((a) => a.status === "active").length}</p>
            <p className="text-xs text-muted-foreground mt-2">Agents</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
            <p className="text-3xl font-bold text-warning">Low</p>
            <p className="text-xs text-muted-foreground mt-2">Overall</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
