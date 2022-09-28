const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const ARBI = "https://arb1.arbitrum.io/rpc";
const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
// USDC
const TOKEN_0 = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DECIMALS_0 = 6n;
// WETH
const TOKEN_1 = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DECIMALS_1 = 18n;

// GMX
const TOKEN_2 = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";

const TOKEN_3 = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const DECIMALS_3 = 8n;

describe("FlashSwap", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();
    const FlashSwap = await ethers.getContractFactory("UniswapV3Flash");
    const flashSwap = await FlashSwap.deploy(TOKEN_0, TOKEN_1, 3000);

    return { flashSwap, owner, user };
  }

  describe("Deployment", function () {
    it("Should get Pair For USDC-ETH Address", async function () {
      const { flashSwap } = await loadFixture(deployFixture);
      let pairAddress = await flashSwap.getPool(TOKEN_0, TOKEN_1, 3000);
      console.log(pairAddress);
    });
    it("Should Flash For USDC-ETH", async function () {
      const { flashSwap } = await loadFixture(deployFixture);

    });
  });
});
