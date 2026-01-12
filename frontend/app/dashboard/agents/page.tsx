"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AgentCard } from "@/components/dashboard/agent-card"
import { Plus } from "lucide-react"

const availableAgents = [
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
    id: "deployed-1",
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
    id: "deployed-2",
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
  const [deployCounter, setDeployCounter] = useState(100)

  const handleDeploy = (agentId: string) => {
    const agent = availableAgents.find((a) => a.id === agentId)
    if (agent) {
      const deployedId = `deployed-${deployCounter}-${Date.now()}`
      setDeployCounter(prev => prev + 1)
      setDeployedList([
        ...deployedList,
        {
          id: deployedId,
          name: agent.name,
          type: agent.type,
          icon: agent.icon,
          status: "active" as const,
          dailyLimit: agent.dailyLimit,
          reputation: agent.reputation,
          performance: agent.performance,
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

  // Get list of agent names/types that are already deployed to avoid duplicates
  const deployedAgentNames = deployedList.map((a) => a.name)
  const availableAgentList = availableAgents.filter((agent) => !deployedAgentNames.includes(agent.name))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-balance">AI Agents</h1>
        <p className="text-muted-foreground mt-2">Deploy and manage autonomous agents for trading and yield</p>
      </div>

      {/* Explanation Section */}
      <Card className="p-6 bg-accent/10 border-accent/30">
        <h2 className="text-lg font-semibold mb-3">What are AI Agents?</h2>
        <p className="text-sm text-muted-foreground mb-3">
          AI Agents are autonomous bots that perform financial operations on your behalf within your specified limits. Once deployed, they can:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
          <li><strong>DeFi Trader:</strong> Automatically execute trades on decentralized exchanges to optimize your portfolio</li>
          <li><strong>Yield Optimizer:</strong> Deposit funds in the best yield-generating protocols to maximize returns</li>
          <li><strong>Payment Router:</strong> Route payments through the most cost-effective channels</li>
          <li><strong>Shopping Assistant:</strong> Manage purchases and optimize spending within set limits</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-accent/20">
          Each agent has a daily limit, reputation score, and performance metrics to ensure safe and efficient operation.
        </p>
      </Card>

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
          {availableAgentList.map((agent) => (
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
