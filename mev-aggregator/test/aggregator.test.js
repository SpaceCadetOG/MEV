const { ethers, network } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
require("chai").use(require("chai-as-promised")).should();
const { expect } = require("chai");

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC_WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; // find whale on etherscan => Look for exchanges like FTX || Binacne || Coinbase
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2";

describe("AggregatorContract", function () {
  async function deployOneYearLockFixture() {
    const [owner, user1] = await ethers.getSigners();
    const Aggregator = await ethers.getContractFactory("Aggregator");
    const aggregator = await Aggregator.deploy();
    await aggregator.deployed();

    const wethTokenAbi = [
      "function balanceOf(address) external view returns (uint256)",
      "function deposit() public payable",
      "function approve(address,uint) public returns (bool)",
      "function transfer(address to, uint amount) returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    ];
    const TokenAbi = [
      "function balanceOf(address account) external view returns (uint256)",
      "function transfer(address to, uint amount) returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender)",
    ];

    let usdcwhale = await ethers.getSigner(USDC_WHALE);
    let daiwhale = await ethers.getSigner(DAI_WHALE);
    // weth = await ethers.getContractAt(TokenAbi, WETH);

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE],
    });
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });

    const usdc = await ethers.getContractAt(TokenAbi, USDC);
    const dai = await ethers.getContractAt(TokenAbi, DAI);
    const weth = await ethers.getContractAt(wethTokenAbi, WETH);

    const usdcAmount = ethers.utils.parseUnits("1000", 6);
    const daiAmount = ethers.utils.parseUnits("1000", 18);
    await usdc
      .connect(usdcwhale)
      .transfer(owner.address, usdcAmount, { gasLimit: 300000 });
    await dai
      .connect(daiwhale)
      .transfer(owner.address, daiAmount, { gasLimit: 300000 });

    let amountIn = 2n * 10n ** 18n;
    await weth.connect(owner).deposit({ value: amountIn });
    await weth.approve(aggregator.address, amountIn);
    await weth.transfer(aggregator.address, amountIn);

    console.log(
      `dai: ${ethers.utils.formatEther(await dai.balanceOf(owner.address))}`
    );
    console.log(
      `usdc: ${ethers.utils.formatUnits(
        await usdc.balanceOf(owner.address),
        6
      )}`
    );
    console.log(`deployed to ${aggregator.address}`);

    return { owner, user1, usdc, weth, dai, aggregator };
  }

  describe("Deployment", function () {
    it("Should return uni rate for weth/usdc swap", async function () {
      const { owner, user1, usdc, weth, aggregator } = await loadFixture(
        deployOneYearLockFixture
      );
      const path = [weth.address, usdc.address];
      const amount = "1000000000000000000";

      const uniRate = await aggregator.uniswapRate(path, amount);
      console.log(
        "uniswap rate:",
        ethers.utils.formatUnits(uniRate.toString(), 6)
      );
    });

    it("Should return uni rate for weth/dai swap", async function () {
      const { owner, user1, dai, weth, aggregator } = await loadFixture(
        deployOneYearLockFixture
      );
      const path = [weth.address, dai.address];
      const amount = "1000000000000000000";

      const uniRate = await aggregator.uniswapRate(path, amount);
      console.log(
        "uniswap rate:",
        ethers.utils.formatEther(uniRate.toString())
      );
    });

    it("Should return sushi rate for weth/usdc swap", async function () {
      const { owner, user1, usdc, weth, aggregator } = await loadFixture(
        deployOneYearLockFixture
      );
      const path = [weth.address, usdc.address];
      const amount = "1000000000000000000";

      const uniRate = await aggregator.sushiswapRate(path, amount);
      console.log(
        "sushiswap rate:",
        ethers.utils.formatUnits(uniRate.toString(), 6)
      );
    });

    it("Should return sushi rate for weth/dai swap", async function () {
      const { owner, user1, dai, weth, aggregator } = await loadFixture(
        deployOneYearLockFixture
      );
      const path = [weth.address, dai.address];
      const amount = "1000000000000000000";

      const uniRate = await aggregator.sushiswapRate(path, amount);
      console.log(
        "sushiswap rate:",
        ethers.utils.formatEther(uniRate.toString())
      );
    });

    it("Should return cheaper exchange => weth/usdc", async function () {
      const { owner, user1, usdc, weth, aggregator } = await loadFixture(
        deployOneYearLockFixture
      );
      const path = [weth.address, usdc.address];
      const amount = "1000000000000000000";
      const cheaperRate = await aggregator.getHighestAmount(path, amount);

      console.log(
        `The cheaper rate is ${cheaperRate[1]}  on the ${
          cheaperRate[0] ? "sushi" : "uni"
        } exchange`
      );

      const uniRate = await aggregator.uniswapRate(path, amount);
      const sushiRate = await aggregator.sushiswapRate(path, amount);

      if (uniRate.toString() > sushiRate.toString()) {
        cheaperRate[1].should.equal(uniRate.toString());
      } else {
        cheaperRate[1].should.equal(sushiRate.toString());
      }
    });

    it("Should return cheaper exchange => weth/dai", async function () {
      const { owner, user1, dai, weth, aggregator } = await loadFixture(
        deployOneYearLockFixture
      );
      const path = [weth.address, dai.address];
      const amount = "1000000000000000000";
      const cheaperRate = await aggregator.getHighestAmount(path, amount);

      console.log(
        `The cheaper rate is ${cheaperRate[1]}  on the ${
          cheaperRate[0] ? "sushi" : "uni"
        } exchange`
      );

      const uniRate = await aggregator.uniswapRate(path, amount);
      const sushiRate = await aggregator.sushiswapRate(path, amount);

      if (uniRate.toString() > sushiRate.toString()) {
        cheaperRate[1].should.equal(uniRate.toString());
      } else {
        cheaperRate[1].should.equal(sushiRate.toString());
      }
    });

    it("Should swap cheaper exchange => weth2dai()", async function () {
      const { owner, dai, aggregator, weth } = await loadFixture(
        deployOneYearLockFixture
      );
      console.log(
        `WETH: ${ethers.utils.formatUnits(
          await weth.balanceOf(owner.address),
          18
        )}`
      );

      console.log("===================");
      console.log(
        "Owner WETH Balance Before",
        ethers.utils.formatEther(await weth.balanceOf(owner.address))
      );
      console.log(
        "Owner DAI Balance Before",
        ethers.utils.formatUnits(await dai.balanceOf(owner.address), 18)
      );
      console.log("===================");

      await weth
        .connect(owner)
        .approve(aggregator.address, await weth.balanceOf(owner.address));
      await aggregator.weth2dai(1n * 10n ** 18n);

      console.log("===================");
      console.log(
        "Owner WETH Balance After",
        ethers.utils.formatEther(await weth.balanceOf(owner.address))
      );
      console.log(
        "Owner DAI Balance After",
        ethers.utils.formatUnits(await dai.balanceOf(owner.address), 18)
      );
      console.log("===================");
    });

    it("Should swap cheaper exchange => weth2usdc()", async function () {
      const { owner, usdc, aggregator, weth } = await loadFixture(
        deployOneYearLockFixture
      );
      console.log(
        `weth: ${ethers.utils.formatUnits(
          await weth.balanceOf(owner.address),
          18
        )}`
      );

      console.log("===================");
      console.log(
        "Owner WETH Balance Before",
        ethers.utils.formatEther(await weth.balanceOf(owner.address))
      );
      console.log(
        "Owner USDC Balance Before",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
      console.log("===================");

      await weth
        .connect(owner)
        .approve(aggregator.address, await weth.balanceOf(owner.address));
      await aggregator.weth2usdc(1n * 10n ** 18n);

      console.log("===================");
      console.log(
        "Owner WETH Balance After",
        ethers.utils.formatEther(await weth.balanceOf(owner.address))
      );
      console.log(
        "Owner USDC Balance After",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
      console.log("===================");
    });

    it("Should swap cheaper exchange => usdc2weth()", async function () {
      const { owner, usdc, aggregator, weth } = await loadFixture(
        deployOneYearLockFixture
      );
      console.log(
        `usdc: ${ethers.utils.formatUnits(
          await usdc.balanceOf(owner.address),
          6
        )}`
      );

      console.log("===================");
      console.log(
        "Owner WETH Balance Before",
        ethers.utils.formatEther(await weth.balanceOf(owner.address))
      );
      console.log(
        "Owner USDC Balance Before",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
      console.log("===================");

      await usdc
        .connect(owner)
        .approve(aggregator.address, await usdc.balanceOf(owner.address));
      await aggregator.usdc2weth(await usdc.balanceOf(owner.address));

      console.log("===================");
      console.log(
        "Owner WETH Balance After",
        ethers.utils.formatEther(await weth.balanceOf(owner.address))
      );
      console.log(
        "Owner USDC Balance After",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
      console.log("===================");
    });

    it("Should swap cheaper exchange => dai2weth()", async function () {
      const { owner, dai, aggregator, weth } = await loadFixture(
        deployOneYearLockFixture
      );
      console.log(
        `DAI: ${ethers.utils.formatUnits(
          await dai.balanceOf(owner.address),
          18
        )}`
      );

      console.log("===================");
      console.log(
        "Owner WETH Balance Before",
        ethers.utils.formatEther(await weth.balanceOf(owner.address))
      );
      console.log(
        "Owner DAI Balance Before",
        ethers.utils.formatUnits(await dai.balanceOf(owner.address), 18)
      );
      console.log("===================");

      await dai
        .connect(owner)
        .approve(aggregator.address, await dai.balanceOf(owner.address));
      await aggregator.dai2weth(await dai.balanceOf(owner.address));

      console.log("===================");
      console.log(
        "Owner WETH Balance After",
        ethers.utils.formatEther(await weth.balanceOf(owner.address))
      );
      console.log(
        "Owner DAI Balance After",
        ethers.utils.formatUnits(await dai.balanceOf(owner.address), 18)
      );
      console.log("===================");
    });
  });
});
