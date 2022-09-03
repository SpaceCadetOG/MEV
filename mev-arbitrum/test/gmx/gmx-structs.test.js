const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, network, BigNumber } = require("hardhat");
const BN = require("bn.js");
const addresses = require("../../utils/addresses");
// USDC
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const WHALE = "0xBA479d5585EcEC47eDc2a571dA430A40f43c3851";
const DECIMALS_0 = 6n;
// WETH
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DECIMALS_1 = 18n;
describe("Using GMX using GMX Structs", function () {
  // fixture that will do simple deployment
  async function deployFixture() {
    let gmx, structs;

    const STRUCTS = await ethers.getContractFactory("GMX_STRUCTS");
    structs = await STRUCTS.deploy();
    await structs.deployed();

    const GMX = await ethers.getContractFactory("PerpetuallySwapsETH1");
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
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WHALE],
    });
    let usdc = await ethers.getContractAt(TokenAbi, USDC);
    let dai = await ethers.getContractAt(TokenAbi, DAI);
    let whale = await ethers.getSigner(WHALE);
    fundAmount = 1000n * 10n ** 18n; // 200 dai
    await dai.connect(whale).transfer(user.address, fundAmount);
    await dai.connect(whale).approve(gmx.address, fundAmount);

    ethAmount = 5n * 10n ** 18n;
    const weth = await ethers.getContractAt(WETHAbi, WETH);
    await weth.connect(whale).deposit({ value: ethAmount });
    await weth.connect(whale).approve(gmx.address, ethAmount);

    console.log(`GMX Controller Contract: ${gmx.address}`);
    console.log(`...`);
    return { user, gmx, structs, testChainlink, weth, usdc, dai, ethAmount, whale };
  }
  // fixture that will do volitlity => Long position over 7 days
  // fixture that will do volitlity => Short position over 7 days
  // fixture that will do glp rewards

  describe("Get stuff from structs", () => {
    it("should get price feed of gmx", async function () {
      const { gmx, structs } = await loadFixture(deployFixture);
      const gmx_pricefeed = await structs.gmx_priceFeedAddress();
    });

    it("should get price feed of mc", async function () {
      const { gmx, structs } = await loadFixture(deployFixture);
      const mc_pricefeed = await structs.mc_priceFeedAddress();
    });

    it("should get ExchangeDetails => GMX", async function () {
      const { gmx, structs } = await loadFixture(deployFixture);
      const gmx_details = await structs.seeExchangeDetails(0);
    });
    it("should get ExchangeDetails => MC", async function () {
      const { gmx, structs } = await loadFixture(deployFixture);
      const mc_details = await structs.seeExchangeDetails(1);
    });
  });
  describe("Get stuff from contract", () => {
    it("should get price feed of gmx", async function () {
      const { gmx, structs } = await loadFixture(deployFixture);
      const pricefeed = await gmx.gmx_priceFeedAddress();
      expect(await gmx.getPriceFeedGMX()).equal(pricefeed);
    });

    it("should get price feed of mc", async function () {
      const { gmx, structs } = await loadFixture(deployFixture);
      const pricefeed = await gmx.mc_priceFeedAddress();
    });

    it("should get ExchangeDetails via see() => GMX", async function () {
      const { gmx, structs } = await loadFixture(deployFixture);
      const pricefeed = await gmx.see(0);
    });
    it("should get ExchangeDetails via see() => MC", async function () {
      const { gmx, structs } = await loadFixture(deployFixture);
      const pricefeed = await gmx.see(1);
    });
  });
  describe("Pull Prices", () => {
    describe("Prices from exchange", () => {
      it("should get eth price of gmx", async function () {
        const { gmx, structs, weth, testChainlink } = await loadFixture(
          deployFixture
        );
        price = await gmx.getPriceOnGMX(weth.address);

        console.log(ethers.utils.formatEther(price));
      });
      it("should get eth price of mc", async function () {
        const { gmx, structs, weth, testChainlink } = await loadFixture(
          deployFixture
        );
        price = await gmx.getPriceOnMC(weth.address);
        console.log(ethers.utils.formatEther(price));
      });
    });
    describe("BuySell", () => {
      it("should do manual simple buy sell manually", async function () {
        const { gmx, structs, weth, testChainlink } = await loadFixture(
          deployFixture
        );
        gmx_price = await gmx.getPriceOnGMX(weth.address);
        mc_price = await gmx.getPriceOnMC(weth.address);

        if (mc_price > gmx_price) {
          console.log("buy on GMX => Sell on MC");
        } else if (mc_price < gmx_price) {
          console.log("buy on MC => Sell on GMX");
        } else {
          console.log("...");
        }
      });
      it("should do BuySell()", async function () {
        const { gmx, structs, weth, testChainlink } = await loadFixture(
          deployFixture
        );
        buy_sell = await gmx.BuySellIndicator(weth.address);
        gmx_price = await gmx.getPriceOnGMX(weth.address);
        mc_price = await gmx.getPriceOnMC(weth.address);

        if (mc_price > gmx_price) {
          expect(buy_sell).equal("buy on GMX => Sell on MC");
        } else {
          expect(buy_sell).equal("buy on MC => Sell on GMX");
        }
      });
    });
    describe("Token Amount", () => {
      it("TokenAmountToUSDMinOnGMX()", async function () {
        const { gmx, structs, weth, testChainlink } = await loadFixture(
          deployFixture
        );
        gmx_price = await gmx.TokenAmountToUSDMinOnGMX(weth.address, 1);
        console.log(ethers.utils.formatUnits(gmx_price, 12));
      });

      it("TokenAmountToUSDMinOnMC()", async function () {
        const { gmx, structs, weth, testChainlink } = await loadFixture(
          deployFixture
        );
        mc_price = await gmx.TokenAmountToUSDMinOnMC(weth.address, 1);
        console.log(ethers.utils.formatUnits(mc_price, 12));
      });
    });
  });
  describe("Calculate Potentials", () => {
    describe("Calculate Potential Profits", () => {
      it("Potential Profit manual", async function () {
        const { gmx, structs, weth, testChainlink } = await loadFixture(
          deployFixture
        );

        buy_sell = await gmx.BuySellIndicator(weth.address);
        gmx_price = await gmx.getPriceOnGMX(weth.address);
        mc_price = await gmx.getPriceOnMC(weth.address);
        gmx_price = await gmx.TokenAmountToUSDMinOnGMX(weth.address, 1);
        mc_price = await gmx.TokenAmountToUSDMinOnMC(weth.address, 1);

        if (mc_price > gmx_price) {
          expect(buy_sell).equal("buy on GMX => Sell on MC");
          profit = mc_price - gmx_price;
        } else {
          expect(buy_sell).equal("buy on MC => Sell on GMX");
          profit = gmx_price - mc_price;
        }

        console.log(ethers.utils.formatUnits(profit, 12));
      });
      it("PotentialProfit()", async function () {
        const { gmx, structs, weth, testChainlink } = await loadFixture(
          deployFixture
        );
        buy_sell = await gmx.BuySellIndicator(weth.address);
        gmx_price = await gmx.getPriceOnGMX(weth.address);
        mc_price = await gmx.getPriceOnMC(weth.address);
        gmx_price = await gmx.TokenAmountToUSDMinOnGMX(weth.address, 1);
        mc_price = await gmx.TokenAmountToUSDMinOnMC(weth.address, 1);
        if (mc_price > gmx_price) {
          expect(buy_sell).equal("buy on GMX => Sell on MC");
          _profit = mc_price - gmx_price;
        } else {
          expect(buy_sell).equal("buy on MC => Sell on GMX");
          _profit = gmx_price - mc_price;
        }

        profit = await gmx.PotentialProfit(weth.address, 1);
        expect(profit).equal(_profit);

        console.log(ethers.utils.formatUnits(profit, 12));
      });
    });
  });

  describe.only("OPEN", () => {
    it.only("Deposit To Vault", async function () {
      const { gmx, structs, weth, testChainlink, ethAmount, dai, whale } = await loadFixture(
        deployFixture
      );
      let params = [
        [dai.address, weth.address], // _path
        weth.address, // _indexToken
        amountIn = 200n * 10n ** 18n, // _amountIn
        minOut = 1n * 10n ** 18n, // _minOut
        delta = 0, // _sizeDelta
        acceptablePrice = 300n * 10n ** 10n, // _acceptablePrice
      ]
      const referralCode = "0x0000000000000000000000000000000000000000000000000000000000000123"

      await gmx.connect(whale).OpenPositionGMX(...params.concat([150000000000000, referralCode]), { value: 150000000000000 })

    });
  });

});
