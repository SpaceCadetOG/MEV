const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, network, BigNumber } = require("hardhat");
const BN = require("bn.js");
const addresses = require("../../utils/addresses");
// USDC
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DECIMALS_0 = 6n;
// WETH
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DECIMALS_1 = 18n;
describe("Using GMX", function () {
  // fixture that will do simple deployment
  async function deployFixture() {
    let gmx;

    const GMX = await ethers.getContractFactory("leverageGMX");
    gmx = await GMX.deploy();
    await gmx.deployed();

    const TestChainlink = await ethers.getContractFactory("ArbitrumPrices");
    let testChainlink = await TestChainlink.deploy();
    await testChainlink.deployed();

    let user, amountIn;

    user = await ethers.getSigner();
    // // fork mainnet

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
    let weth = await ethers.getContractAt(WETHAbi, WETH);
    dai = await ethers.getContractAt(TokenAbi, DAI);
    let usdc = await ethers.getContractAt(TokenAbi, USDC);

    ethAmount = 1n * 10n ** 18n; // 1 eth

    await weth.connect(user).deposit({ value: ethAmount });
    await weth.connect(user).approve(gmx.address, ethAmount);
    console.log(`GMX Controller Contract: ${gmx.address}`);
    console.log(`...`);
    return { user, gmx, usdc, weth, ethAmount, testChainlink };
  }
  // fixture that will do volitlity => Long position over 7 days
  // fixture that will do volitlity => Short position over 7 days
  // fixture that will do glp rewards

  describe("Get stuff from gmx", () => {
    it("should get price feed of gmx", async function () {
      const { gmx } = await loadFixture(deployFixture);
      const pricefeed = await gmx.getPriceFeedGMX();
      console.log(`GMX Prices Feed: ${pricefeed}`);
    });

    it("should get price of wavax and eth gmx", async function () {
      const { gmx } = await loadFixture(deployFixture);
      const avax_price = ethers.utils.formatUnits(
        await gmx.getPriceOnGMX("0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"),
        30
      );
      console.log(`GMX Prices of WBTC: ${avax_price}`);
      const eth_price = ethers.utils.formatUnits(
        await gmx.getPriceOnGMX("0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"),
        30
      );
      console.log(`GMX Prices of ETH: ${eth_price}`);
    });

    it("get Pool Amount to take Postion GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
      amountIn = 1n * 10n ** 18n;
      amountInUSDC = 100n * 10n ** 6n;
      const avax_price = await gmx.getTokensAvailableInGMXPool(
        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
      );
      const eth_price = await gmx.getTokensAvailableInGMXPool(
        "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
      );
      console.log(
        `1 WBTC Pool Size: ${ethers.utils.formatUnits(avax_price, 8)} wbtc`
      );
      console.log(
        `1 ETH Pool Size: ${ethers.utils.formatEther(eth_price)} eth`
      );
    });

    it("Open Postion on GMX", async function () {
      const { gmx, usdc, weth, testChainlink, ethAmount, user } =
        await loadFixture(deployFixture);
      amountIn = 1n * 10n ** 18n;
      delta = 10n * 10n ** 30n;
      fee = 1n * 10n ** 12n;
      maxLong = 2000n * 10n ** 30n;
      maxPrice = 2000n * 10n ** 30n;
      fee = await gmx.fee();
      price = await testChainlink.getLatestPriceETH();
      fee = await gmx.fee();


      expect(await gmx.fee()).equal(100000000000000);
      
      gmx.OpenPositionGMX(WETH, usdc.address, amountIn)

    });

    it("Increase Postion on GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
    });

    it("Decrease Postion on GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
    });

    it("Close Postion on GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
    });
  });
});
