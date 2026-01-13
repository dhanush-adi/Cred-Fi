// Smart Contract ABIs
export const FLEX_CREDIT_CORE_ABI = [
  {
    name: "borrow",
    type: "function",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "success", type: "bool" }],
  },
  {
    name: "repay",
    type: "function",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "success", type: "bool" }],
  },
  {
    name: "getBalance",
    type: "function",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    name: "getDebt",
    type: "function",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "debt", type: "uint256" }],
  },
  {
    name: "getCreditLimit",
    type: "function",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "limit", type: "uint256" }],
  },
  {
    name: "BorrowEvent",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const

export const CONFIDENTIAL_SCORE_ABI = [
  {
    name: "setScore",
    type: "function",
    inputs: [{ name: "encryptedScore", type: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    name: "checkEligibility",
    type: "function",
    inputs: [{ name: "threshold", type: "uint256" }],
    outputs: [{ name: "isEligible", type: "bool" }],
    stateMutability: "view"
  }
] as const

export const AGENT_WALLET_FACTORY_ABI = [
  {
    name: "deployAgent",
    type: "function",
    inputs: [
      { name: "agentType", type: "uint8" },
      { name: "dailyLimit", type: "uint256" },
    ],
    outputs: [{ name: "agentAddress", type: "address" }],
  },
  {
    name: "getAgents",
    type: "function",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "agents", type: "address[]" }],
  },
  {
    name: "AgentDeployed",
    type: "event",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "agent", type: "address", indexed: true },
      { name: "agentType", type: "uint8", indexed: false },
    ],
  },
] as const

export const CREDIT_ORACLE_ABI = [
  {
    name: "getCreditScore",
    type: "function",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "score", type: "uint256" }],
  },
  {
    name: "updateScore",
    type: "function",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "success", type: "bool" }],
  },
] as const
