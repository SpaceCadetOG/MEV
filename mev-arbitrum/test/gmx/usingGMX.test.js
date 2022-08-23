const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, network, BigNumber } = require("hardhat");
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

    const GMX = await ethers.getContractFactory("usingGMX");
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
    const weth = await ethers.getContractAt(WETHAbi, WETH);
    const dai = await ethers.getContractAt(TokenAbi, DAI);
    const usdc = await ethers.getContractAt(TokenAbi, USDC);

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

    it("Token Amount To USD On GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
      amountIn = 1n * 10n ** 8n;
      amountInEth = 1n * 10n ** 18n;
      const avax_price = ethers.utils.formatUnits(
        await gmx.TokenAmountToUSDMinOnGMX(
          "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
          amountIn
        ),
        30
      );
      const eth_price = ethers.utils.formatUnits(
        await gmx.TokenAmountToUSDMinOnGMX(
          "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
          amountInEth
        ),
        30
      );
      console.log(`1 WBTC to USD: $${avax_price}`);
      console.log(`1 ETH to USD: $${eth_price}`);
    });

    it.only("MAX AMOUNT OUT for USDC USD On GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
      amountIn = 1n * 10n ** 8n;
      amountInEth = 1n * 10n ** 18n;
      const avax_price = await gmx.getAmountsOutOnGMX(
        "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        amountIn
      );
      const eth_price = await gmx.getAmountsOutOnGMX(
        "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        amountInEth
      );
      console.log(
        `1 WBTC to USDC: $${avax_price[0] / 1000000} || ${avax_price[1] / 1000000}`
      );
      console.log(
        `1 ETH to USDC: $${eth_price[0] / 1000000} || ${eth_price[1] / 1000000}`
      );
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
        `1 WBTC Pool Size: ${ethers.utils.formatUnits(avax_price, 30)} wbtc`
      );
      console.log(
        `1 ETH Pool Size: ${ethers.utils.formatEther(eth_price)} eth`
      );
    });

    it("get GLP Amount GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
    });

    it("Swap WETH -> USDC On GMX", async function () {
      const { gmx, usdc, weth, user, testChainlink } = await loadFixture(
        deployFixture
      );
      amountIn = 1n * 10n ** 18n;
      // await usdc.connect(user).transfer(gmx.address, amountIn);
      price = await testChainlink.getLatestPriceETH();
      await gmx.swapOnGMX(weth.address, usdc.address, amountIn);

      console.log(
        "B: USDC Balance of User",
        ethers.utils.formatUnits(await usdc.balanceOf(user.address), 6)
      );
      console.log(price);
    });

    it("Add Liquidity on GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
    });

    it("Open Postion on GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
    });

    it.only("Increase Postion on GMX", async function () {
      const { gmx, usdc, weth, testChainlink } = await loadFixture(deployFixture);
      amountIn = 1n * 10n ** 18n;
      delta = 10n * 10n ** 30n

      maxLong = 2000n * 10n ** 30n
      
      price = await testChainlink.getLatestPriceETH();
      await gmx.OpenLeveragePositionOnGMXPool(weth.address, amountIn, delta, true, maxLong)
    });

    it("Decrease Postion on GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
    });

    it("Close Postion on GMX", async function () {
      const { gmx, usdc } = await loadFixture(deployFixture);
    });
  });
});
