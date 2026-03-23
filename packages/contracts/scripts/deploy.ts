import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // 1. Deploy AssetToken
  console.log('Deploying AssetToken...');
  const AssetToken = await ethers.getContractFactory('AssetToken');
  const assetToken = await AssetToken.deploy(deployer.address);
  await assetToken.waitForDeployment();
  const assetTokenAddress = await assetToken.getAddress();
  console.log('AssetToken deployed to:', assetTokenAddress);

  // 2. Deploy AssetMarketplace
  console.log('Deploying AssetMarketplace...');
  const AssetMarketplace = await ethers.getContractFactory('AssetMarketplace');
  const marketplace = await AssetMarketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log('AssetMarketplace deployed to:', marketplaceAddress);

  // 3. Deploy AssetEscrow
  console.log('Deploying AssetEscrow...');
  const AssetEscrow = await ethers.getContractFactory('AssetEscrow');
  const escrow = await AssetEscrow.deploy(deployer.address);
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log('AssetEscrow deployed to:', escrowAddress);

  // Save addresses to a file for frontend/backend use
  const addresses = {
    AssetToken: assetTokenAddress,
    AssetMarketplace: marketplaceAddress,
    AssetEscrow: escrowAddress,
    network: 'localhost',
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  fs.writeFileSync(
    path.join(deploymentsDir, 'localhost.json'),
    JSON.stringify(addresses, null, 2),
  );
  console.log('Addresses saved to deployments/localhost.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
