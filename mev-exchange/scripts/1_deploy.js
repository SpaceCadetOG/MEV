const { ethers, hre } = require("hardhat");

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("MEV TOKEN");

  await token.deployed();

  console.log(`Token deployed to ${token.address}`);
  console.log(`-----------------------------------`);
  console.log(`Token NAME: ${await token.getName()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
