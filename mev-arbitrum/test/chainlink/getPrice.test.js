const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers, network } = require("hardhat");

describe("Chainlink Price Feeds", function() {
  async function deployFixture() {
    let testChainlink, stablePrice;

    const TestChainlink = await ethers.getContractFactory("ArbitrumPrices");
    testChainlink = await TestChainlink.deploy();
    await testChainlink.deployed();

    const StablePrice = await ethers.getContractFactory("ArbitrumStablePrices");
    stablePrice = await StablePrice.deploy();
    await stablePrice.deployed();

    return { testChainlink, stablePrice };
  }

  describe("Get Price", () => {
    it("eth: getLatestPrice", async () => {
      const { testChainlink } = await loadFixture(deployFixture);
      const price = await testChainlink.getLatestPriceETH();
      console.log(`ETH price: ${price}`);
    });

    it("avax: getLatestPrice", async () => {
      const { testChainlink  } = await loadFixture(deployFixture);
      const price = await testChainlink.getLatestPriceAVAX();
      console.log(`AVAX price: ${price}`);
    });

    it("btc: getLatestPrice", async () => {
      const { testChainlink  } = await loadFixture(deployFixture);
      const price = await testChainlink.getLatestPriceBTC();
      console.log(`BTC price: ${price}`);
    });

    it("usdc: getLatestPrice", async () => {
      const { stablePrice } = await loadFixture(deployFixture);
      const price = await stablePrice.getLatestPriceUSDC();
      console.log(`USDC price: ${price}`);
    });

    it("usdt: getLatestPrice", async () => {
      const { stablePrice } = await loadFixture(deployFixture);
      const price = await stablePrice.getLatestPriceUSDT();
      console.log(`USDT price: ${price}`);
    });

    it("dai: getLatestPrice", async () => {
      const { stablePrice } = await loadFixture(deployFixture);
      const price = await stablePrice.getLatestPriceDAI();
      console.log(`DAI price: ${price}`);
    });

    it("mim: getLatestPrice", async () => {
      const { stablePrice } = await loadFixture(deployFixture);
      const price = await stablePrice.getLatestPriceMIM();
      console.log(`MIM price: ${price}`);
    });

    it("frax: getLatestPrice", async () => {
      const { stablePrice } = await loadFixture(deployFixture);
      const price = await stablePrice.getLatestPriceFRAX();
      console.log(`FRAX price: ${price}`);
    });
  });
});
