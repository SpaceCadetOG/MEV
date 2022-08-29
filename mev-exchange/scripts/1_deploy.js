const { ethers, hre } = require("hardhat");

async function main() {
  console.log(`Deploying NOW...\n`);
  const [deployer, feeCollector, user1, user2] = await ethers.getSigners();
  const fee = 10;

  console.log(`Deployer: ${deployer.address}\n`);
  const MEV = await ethers.getContractFactory("Token");
  const DAI = await ethers.getContractFactory("Token");
  const USDC = await ethers.getContractFactory("Token");
  const WETH = await ethers.getContractFactory("Token");

  const Exchange = await ethers.getContractFactory("Exchange");

  const mev = await MEV.deploy("MEV TOKEN", "MEV", 18, 1000000);
  await mev.deployed();
  console.log(`MEV Token deployed to ${mev.address}`);
  console.log(`-----------------------------------`);

  const weth = await WETH.deploy("WETH TOKEN", "WETH", 18, 1000000);
  await weth.deployed();
  console.log(`WETH Mock Token deployed to ${weth.address}`);
  console.log(`-----------------------------------`);

  const dai = await DAI.deploy("DAI TOKEN", "DAI", 18, 1000000);
  await dai.deployed();
  console.log(`DAI Mock Token deployed to ${dai.address}`);
  console.log(`-----------------------------------`);

  const usdc = await USDC.deploy("USDC TOKEN", "USDC", 6, 1000000);
  await usdc.deployed();
  console.log(`USDC Mock Token deployed to ${usdc.address}`);
  console.log(`-----------------------------------`);

  const exchange = await Exchange.deploy(feeCollector.address, fee);
  await exchange.deployed();
  console.log(`Exchange deployed to ${exchange.address}`);
  console.log(`-----------------------------------`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
