const hre = require("hardhat");

async function main() {
  const contractAddress = "0x787ce73eEC3182c6E9Bdd6bC48844541F8A16b63";
  const testAddress = "0x734E1a469fD87c342A5CE7c8c16Fec8CC940e325";
  
  console.log("Testing contract at:", contractAddress);
  
  const FlexCreditCore = await hre.ethers.getContractFactory("FlexCreditCore");
  const contract = FlexCreditCore.attach(contractAddress);
  
  try {
    console.log("\n1. Testing owner()...");
    const owner = await contract.owner();
    console.log("Owner:", owner);
    
    console.log("\n2. Testing getCreditInfo()...");
    const creditInfo = await contract.getCreditInfo(testAddress);
    console.log("Credit Info:", {
      income: creditInfo[0].toString(),
      limit: creditInfo[1].toString(),
      used: creditInfo[2].toString(),
      available: creditInfo[3].toString()
    });
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
