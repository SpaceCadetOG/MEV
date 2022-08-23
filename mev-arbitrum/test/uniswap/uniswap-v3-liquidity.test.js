const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
// USDC
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DECIMALS_0 = 6n;
// WETH
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DECIMALS_1 = 18n;

// GMX
const TOKEN_2 = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";

const TOKEN_3 = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const DECIMALS_3 = 8n;

// 0.3%
const FEE = 3000;
// Pair
// 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8

describe("UniswapV3 MULTI-SWAP", () => {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const owner = await ethers.getSigner();
    let borrowAmount, fundAmount, weth, dai, usdc;

    // will mock this acct

    const TokenAbi = [
      "function balanceOf(address account) external view returns (uint256)",
      "function transfer(address to, uint amount) returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    ];

    const WETHAbi = [
      "function deposit() external payable",
      "function withdraw(uint) external",
      "function balanceOf(address account) external view returns (uint)",
      "function transfer(address to, uint amount) returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    ];

    const UniswapV3Twap = await ethers.getContractFactory("SingleSwapV3");
    const twap = await UniswapV3Twap.deploy();
    await twap.deployed();

    const TestChainlink = await ethers.getContractFactory("ArbitrumPrices");
    let testChainlink = await TestChainlink.deploy();
    await testChainlink.deployed();

    weth = await ethers.getContractAt(WETHAbi, WETH);
    dai = await ethers.getContractAt(TokenAbi, DAI);
    usdc = await ethers.getContractAt(TokenAbi, USDC);

    fundAmount = 20000n * 10n ** 18n; // 20000 dai
    ethAmount = 4n * 10n ** 18n; // 1 eth

    await weth.connect(owner).deposit({ value: ethAmount });
    await weth.connect(owner).approve(twap.address, ethAmount);

    ethbalance = await owner.getBalance("latest");

    console.log(
      `Balance Of user eth: ${ethers.utils.formatUnits(ethbalance, 18)}`
    );

    console.log(
      "_______________________________________________________________________________________"
    );
    return {
      owner,
        dai,
      weth,
      usdc,
      ethAmount,
      twap,
      testChainlink,
    };
  }
  describe("swapExactOutputMultihop()", () => {
    it(" WETH => DAI on Uniswap  => 0.03%", async () => {
      const { twap, owner, ethAmount, dai, usdc, testChainlink, weth } = await loadFixture(
        deployFixture
      );

        amount = 10n ** 18n
      price = await testChainlink.getLatestPriceETH();
        await twap.swapExactInputSingle(amount, dai.address);
        await twap.swapExactInputSingle(amount, usdc.address);

        console.log(ethers.utils.formatEther(await dai.balanceOf(owner.address)));
        console.log(ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6))
        console.log(ethers.utils.formatEther(await weth.balanceOf(owner.address)));
      console.log(price);
    });
  });
});
