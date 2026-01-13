const hre = require("hardhat");

async function main() {
  console.log("Deploying FlexCreditCore contract...");

  const FlexCreditCore = await hre.ethers.getContractFactory("FlexCreditCore");
  const flexCredit = await FlexCreditCore.deploy();

  await flexCredit.waitForDeployment();

  const address = await flexCredit.getAddress();
  console.log("FlexCreditCore deployed to:", address);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contract: "FlexCreditCore",
    address: address,
    timestamp: new Date().toISOString(),
    deployer: (await hre.ethers.getSigners())[0].address
  };

  fs.writeFileSync(
    "deployment-flex-credit.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to deployment-flex-credit.json");
  console.log("\nUpdate frontend/lib/constants.ts with:");
  console.log(`  flexCreditCore: "${address}",`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
