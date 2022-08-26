const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Index Funds", function () {
  async function IndexFundFixture() {
    const [owner, user] = await ethers.getSigners();

    const FUND = await ethers.getContractFactory("IndexFund");
    const fund = await FUND.deploy();

    const wethTokenAbi = [
      "function balanceOf(address) external view returns (uint256)",
      "function deposit() public payable",
      "function approve(address,uint) public returns (bool)",
      "function transfer(address to, uint amount) returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    ];
    const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
    const weth = await ethers.getContractAt(wethTokenAbi, WETH);

    return { fund, owner, user, weth };
  }

  describe("Test IndexFund", function () {
    it("Should Get PricePerToken()", async function () {
      const { fund } = await loadFixture(IndexFundFixture);
      const PricePerToken = await fund.pricePerToken();
      expect(PricePerToken).greaterThan(0);
      console.log(`price per token => ${PricePerToken}`);
    });

    it("Should return 300 ether balance of contract", async function () {
      const { fund, owner, weth } = await loadFixture(IndexFundFixture);
      // send 300 weth
      let amountIn = 300n * 10n ** 18n;
      // await weth.connect(owner).deposit({ value: amountIn });
      // await weth.approve(fund.address, amountIn);
      // await weth.transfer(fund.address, amountIn);
      await owner.sendTransaction({
        to: fund.address,
        value: ethers.utils.parseEther("300"),
      });

      expect(await fund.getBalance()).to.equal(300000000000000000000n); // 300 ether
    });

    it("Should get the price of all defi tokens", async function () {
      const { fund, owner, weth } = await loadFixture(IndexFundFixture);
      await fund.getPriceOfAllCoins();
      const uniPrice = await fund.uniPrice();
      console.log(
        `uniswap token price => ${ethers.utils.formatUnits(uniPrice, 8)}`
      );
      expect(uniPrice).to.greaterThan(0);

      const aavePrice = await fund.aavePrice();
      console.log(
        `aave token price => ${ethers.utils.formatUnits(aavePrice, 8)}`
      );
      expect(aavePrice).to.greaterThan(0);

      const makerPrice = await fund.makerPrice();
      console.log(
        `maker token price => ${ethers.utils.formatUnits(makerPrice, 8)}`
      );
      expect(makerPrice).to.greaterThan(0);

      const crvPrice = await fund.crvPrice();
      console.log(
        `crv token price => ${ethers.utils.formatUnits(crvPrice, 8)}`
      );
      expect(crvPrice).to.greaterThan(0);

      const compPrice = await fund.compPrice();
      console.log(
        `comp token price => ${ethers.utils.formatUnits(compPrice, 8)}`
      );
      expect(compPrice).to.greaterThan(0);
    });

    it("Should buy 3 tokens", async function () {
      const { fund, user, weth } = await loadFixture(IndexFundFixture);

      let provider = ethers.provider;

      let beforeBal = await fund.balanceOf(user.address);
      let beforeBalEther = await provider.getBalance(user.address);
      console.log(`Before IndexToken Balance => ${beforeBal}`);
      console.log(
        `Before Balance ETH => ${ethers.utils.formatEther(beforeBalEther)}`
      );

      await fund
        .connect(user)
        .buyToken(3, { value: ethers.utils.parseEther("10") });

      let afterBal = await fund.balanceOf(user.address);
      let afterBalEther = await provider.getBalance(user.address);
      expect(afterBal).to.equal("3");
      console.log(`After IndexToken Balance => ${afterBal}`);
      console.log(
        `After Balance ETH => ${ethers.utils.formatEther(afterBalEther)}`
      );
    });

    it("Should simulate defi increase...redeem tokens for profit", async function () {
      const { fund, owner, user, weth } = await loadFixture(IndexFundFixture);

      await owner.sendTransaction({
        to: fund.address,
        value: ethers.utils.parseEther("23"),
      });

      let provider = ethers.provider;

      let beforeBal = await fund.balanceOf(user.address);
      let beforeBalEther = await provider.getBalance(user.address);
      console.log(`Before IndexToken Balance => ${beforeBal}`);
      console.log(
        `Before Balance ETH => ${ethers.utils.formatEther(beforeBalEther)}`
      );

      await fund
        .connect(user)
        .buyToken(3, { value: ethers.utils.parseEther("10") });

      let afterBal = await fund.balanceOf(user.address);
      let afterBalEther = await provider.getBalance(user.address);
      expect(afterBal).to.equal("3");

      console.log(`After IndexToken Balance => ${afterBal}`);
      console.log(
        `After Balance ETH => ${ethers.utils.formatEther(afterBalEther)}`
      );

      await fund.defiSimulate();
      await fund.connect(user).redeemToken();

      let afterReedemBal = await fund.balanceOf(user.address);
      let afterReedemBalEther = await provider.getBalance(user.address);

      console.log(`After redeem IndexToken Balance => ${afterReedemBal}`);
      console.log(
        `After redeem Balance ETH => ${ethers.utils.formatEther(
          afterReedemBalEther
        )}`
      );
    });
  });
});
