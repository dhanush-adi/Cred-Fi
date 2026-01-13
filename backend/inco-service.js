/**
 * Inco FHE Encryption Service
 * Handles server-side encryption for confidential credit scores
 */

const { createInstance } = require('fhevmjs');

let instance = null;

/**
 * Initialize FHEVM instance (cached)
 */
async function getFhevmInstance() {
  if (instance) return instance;

  try {
    // For Inco Lightning on Base Sepolia, we need to provide the KMS contract address
    // This is the Inco Lightning deployment on Base Sepolia
    // Also requires ACL address if different from default or auto-detection fails
    instance = await createInstance({ 
      chainId: 84532, // Base Sepolia
      networkUrl: "https://sepolia.base.org",
      gatewayUrl: "https://gateway.inco.org/",
      kmsContractAddress: "0x168FDc3Ae19A5d5b03614578C58974FF30FCBe92",
      aclContractAddress: "0x2Fb4341027eB1d2aD8b5d9708187DF602708070D"
    });
    
    console.log('✅ Inco FHEVM instance initialized');
    return instance;
  } catch (e) {
    console.error('❌ Failed to init FHEVM:', e);
    throw new Error('FHEVM initialization failed');
  }
}

/**
 * Encrypt a credit score for on-chain storage
 * @param {number} score - The credit score to encrypt
 * @param {string} contractAddress - The target contract address
 * @param {string} userAddress - The user's wallet address
 * @returns {Promise<string>} Hex-encoded encrypted handle
 */
async function encryptScore(score, contractAddress, userAddress) {
  try {
    const fhevm = await getFhevmInstance();
    
    // Create encrypted input
    const input = fhevm.createEncryptedInput(contractAddress, userAddress);
    input.add256(BigInt(score));
    
    // Encrypt and get handle
    const encrypted = await input.encrypt();
    const handle = encrypted.handles[0];
    
    // Convert Uint8Array to hex string
    const hexHandle = `0x${Array.from(handle)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')}`;
    
    return hexHandle;
  } catch (e) {
    console.error('❌ Encryption failed:', e);
    throw new Error('Score encryption failed');
  }
}

module.exports = {
  getFhevmInstance,
  encryptScore
};
