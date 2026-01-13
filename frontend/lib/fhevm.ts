import { createInstance, FhevmInstance } from "fhevmjs";

let instance: FhevmInstance | null = null;

// The standard TFHEExecutor public key for Base Sepolia (Host) / Inco Lightning
// This often needs to be fetched from the network, but a hardcoded fallback helps in initialization.
// NOTE: This logic should ideally fetch from the ACL contract.
// For now we rely on the library to fetch or user to provide if needed.
const CL_PUBLIC_KEY = null; 

export const createFhevmInstance = async (): Promise<FhevmInstance> => {
  if (instance) return instance;

  try {
    // 1. Create instance (fetches public key automatically if supported for the chainId)
    instance = await createInstance({ 
      chainId: 84532, 
      networkUrl: "https://sepolia.base.org",
      gatewayUrl: "https://gateway.inco.org" // Example gateway if needed
    });
    
    return instance;
  } catch (e) {
    console.error("Failed to init FHEVM:", e);
    throw e;
  }
};

export const encryptScore = async (
  score: number, 
  contractAddress: string, 
  userAddress: string
): Promise<Uint8Array> => {
  const instance = await createFhevmInstance();
  
  // 1. Generate encrypted input for uint256
  // Note: encryption returns an object with handles/inputProof
  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.add256(BigInt(score)); // Add the score as uint256
  
  const encrypted = await input.encrypt();
  return encrypted.handles[0]; // Returns the handle
};

// Helper to prepare the full transaction payload if needed users usually send handles + proofs
// In Inco Lightning, you often send `bytes` that include the proof.
// For the `checkEligibility` function we implemented, we just passed `euint256`.
// The library helps bundle this.
