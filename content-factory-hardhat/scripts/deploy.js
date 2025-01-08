const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", balance.toString());

  // Get the contract factory with explicit signer
  const ContentFactory = await hre.ethers.getContractFactory("ContentFactory", deployer);
  
  // Deploy with explicit transaction parameters
  const deployTransaction = await ContentFactory.getDeployTransaction();
  const tx = await deployer.sendTransaction({
    data: deployTransaction.data,
    gasLimit: 3000000,
    maxFeePerGas: 50000000000, // 50 gwei
    maxPriorityFeePerGas: 1500000000 // 1.5 gwei
  });

  console.log("Deployment transaction sent:", tx.hash);
  const receipt = await tx.wait();
  const contentFactory = await hre.ethers.getContractAt(
    "ContentFactory",
    receipt.contractAddress,
    deployer
  );

  console.log("ContentFactory deployed to:", contentFactory.address);

  // Set the DAO treasury to the deployer
  console.log("Setting treasury...");
  const treasuryTx = await contentFactory.setDaoTreasury(deployer.address, {
    gasLimit: 100000
  });
  await treasuryTx.wait();
  console.log("Treasury set to:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });