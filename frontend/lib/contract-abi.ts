// Smart Contract ABIs
export const FLEX_CREDIT_CORE_ABI = [
  {
    name: "useCredit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "repayCredit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "usedCredit",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "amount", type: "uint256" }],
  },
  {
    name: "creditLimit",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "limit", type: "uint256" }],
  },
  {
    name: "getCreditInfo",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "income", type: "uint256" },
      { name: "limit", type: "uint256" },
      { name: "used", type: "uint256" },
      { name: "available", type: "uint256" }
    ],
  },
  {
    name: "getAvailableCredit",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "available", type: "uint256" }],
  },
  {
    name: "applyIncomeScore",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "incomeBucket", type: "uint256" }
    ],
    outputs: [],
  },
  {
    name: "initializeCredit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "incomeBucket", type: "uint256" }],
    outputs: [],
  },
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
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
