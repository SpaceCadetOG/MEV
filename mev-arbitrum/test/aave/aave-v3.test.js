const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const DAI = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70";
const aDAI = "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE";
const debt_USDC = "0xE4922afAB0BbaDd8ab2a88E0C79d884Ad337fcA6";
const DAI_WHALE = "0x271461a00e9E280432183f34aD258C2667e26276"; // find whale on etherscan => Look for exchanges like FTX || Binacne || Coinbase
const address_provider = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";

describe("Aave", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const owner = await ethers.getSigner();
    let whale,
      dai,
      a_dai,
      borrowAmount,
      fundAmount,
      fee,
      user_balance,
      paybackAmount;

    // will mock this acct

    const TokenAbi = [
      "function balanceOf(address account) external view returns (uint256)",
      // Authenticated Functions
      "function transfer(address to, uint amount) returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    ];
    const aTokenAbi = [
      "function balanceOf(address account) external view returns (uint256)",
      // Authenticated Functions
      "function transfer(address to, uint amount) returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    ];
    const dTokenAbi = [
      "function approveDelegation(address delegatee, uint256 amount)",
    ];
    whale = await ethers.getSigner(DAI_WHALE);

    fundAmount = 20000n * 10n ** 18n; // 20000 dai
    borrowAmount = 5000n * 10n ** 18n; // 10000 dai
    fee = 10n * 10n ** 18n; // 10000 dai
    // await dai.connect(whale).transfer(owner.address, fundAmount);

    // user_balance = ethers.utils.formatUnits(
    //   await dai.balanceOf(owner.address),
    //   18
    // );
    // console.log(`Balance Of user Dai: ${user_balance}`);

    ethbalance = await owner.getBalance("latest");

    console.log(
      `Balance Of user eth: ${ethers.utils.formatUnits(ethbalance, 18)}`
    );

    const Lending = await ethers.getContractFactory("AaveLendingV3");
    const lending = await Lending.deploy(owner.address);
    lending.deployed();

    list = await lending.AaveReserveList();
    console.log(`Dai: ${list[0]}`);
    console.log(`Link: ${list[1]}`);
    console.log(`USDC: ${list[2]}`);
    console.log(`WBTC: ${list[3]}`);
    console.log(`WETH: ${list[4]}`);
    console.log(`USDt: ${list[5]}`);
    console.log(`Aave: ${list[6]}`);

    dai = await ethers.getContractAt(TokenAbi, list[0]);
    reserve = await lending.AaveReserveData(dai.address);
    a_dai = await ethers.getContractAt(aTokenAbi, reserve[8]);
    console.log('_______________________________________________________________________________________')
    return {
      lending,
      unlockTime,
      owner,
      dai,
      a_dai,
      borrowAmount,
      fundAmount,
    };
  }

  describe("1) AaveLending Contract", () => {
    describe("Prices and User Data", () => {
      it("it should UserAccountData", async function () {
        const { lending, owner, dai, fundAmount, a_dai, borrowAmount } =
          await loadFixture(deployFixture);
        reserve = await lending.UserAccountData(owner.address);

        console.table({
          TotalCollateralValue: ethers.utils.formatUnits(reserve[0], 8),
          TotalAmountBorrowed: ethers.utils.formatUnits(reserve[1], 8),
          TotalAmountAvalibleToBorrow: ethers.utils.formatUnits(reserve[2], 8),
          currentLiquidationThreshold: ethers.utils.formatUnits(reserve[3], 2),
          MaxLoanToValue: ethers.utils.formatUnits(reserve[4], 2),
          HealthFactor: ethers.utils.formatUnits(reserve[5], 18),
        });
        console.log('_______________________________________________________________________________________')
      });
      it("it should getReserveTokenAddresses(address asset) ", async function () {
        const { lending, owner, dai, borrowAmount, a_dai } = await loadFixture(
          deployFixture
        );
        list = await lending.AaveReserveList();
        console.log(`Dai: ${list[0]}`);
        console.log(`Link: ${list[1]}`);
        console.log(`USDC: ${list[2]}`);
        console.log(`WBTC: ${list[3]}`);
        console.log(`WETH: ${list[4]}`);
        console.log(`USDt: ${list[5]}`);
        console.log(`Aave: ${list[6]}`);
        console.log(`STASIS EURS Token: ${list[7]}`);
      });
      console.log('_______________________________________________________________________________________')
      it("it should getReserveData(address asset) ", async function () {
        const { lending, owner, dai, borrowAmount, a_dai } = await loadFixture(
          deployFixture
        );
        reserve = await lending.AaveReserveData(dai.address);
        // clean later
        console.log("DAI", reserve);
        console.log('_______________________________________________________________________________________')
        price = await lending.GetPriceOnAave(dai.address);
        console.log(
          "dai price",
          ethers.utils.formatUnits(price.toString(), "wei") / 100000000
        );

        prices = await lending.GetPricesOnAave(list[0], list[7]);
        prices2 = await lending.GetPricesOnAave(list[1], list[2]);
        prices3 = await lending.GetPricesOnAave(list[3], list[4]);
        prices4 = await lending.GetPricesOnAave(list[5], list[6]);

        console.table({
          Dai:
            ethers.utils.formatUnits(prices[0].toString(), "wei") / 100000000,
          EURS:
            ethers.utils.formatUnits(prices[1].toString(), "wei") / 100000000,
          Link:
            ethers.utils.formatUnits(prices2[0].toString(), "wei") / 100000000,
          USDC:
            ethers.utils.formatUnits(prices2[1].toString(), "wei") / 100000000,
          WBTC:
            ethers.utils.formatUnits(prices3[0].toString(), "wei") / 100000000,
          WETH:
            ethers.utils.formatUnits(prices3[1].toString(), "wei") / 100000000,
          USDT:
            ethers.utils.formatUnits(prices4[0].toString(), "wei") / 100000000,
          AAVE:
            ethers.utils.formatUnits(prices4[1].toString(), "wei") / 100000000,
        });
        console.log('_______________________________________________________________________________________')
      });
      it("it should GetPriceOnAave(address asset) ", async function () {
        const { lending, owner, dai, borrowAmount, a_dai } = await loadFixture(
          deployFixture
        );
        prices = await lending.GetPricesOnAave(list[0], list[7]);
        prices2 = await lending.GetPricesOnAave(list[1], list[2]);
        prices3 = await lending.GetPricesOnAave(list[3], list[4]);
        prices4 = await lending.GetPricesOnAave(list[5], list[6]);

        console.table({
          Dai:
            ethers.utils.formatUnits(prices[0].toString(), "wei") / 100000000,
          EURS:
            ethers.utils.formatUnits(prices[1].toString(), "wei") / 100000000,
          Link:
            ethers.utils.formatUnits(prices2[0].toString(), "wei") / 100000000,
          USDC:
            ethers.utils.formatUnits(prices2[1].toString(), "wei") / 100000000,
          WBTC:
            ethers.utils.formatUnits(prices3[0].toString(), "wei") / 100000000,
          WETH:
            ethers.utils.formatUnits(prices3[1].toString(), "wei") / 100000000,
          USDT:
            ethers.utils.formatUnits(prices4[0].toString(), "wei") / 100000000,
          AAVE:
            ethers.utils.formatUnits(prices4[1].toString(), "wei") / 100000000,
        });
        console.log('_______________________________________________________________________________________')
      });
      it("get Dai Address", async function () {
        const { lending, owner, dai, borrowAmount, a_dai } = await loadFixture(
          deployFixture
        );
        console.log("DAI Adresses on Aave");
        console.table({
          aTokenAddress: reserve[8],
          stableDebtTokenAddress: reserve[9],
          variableDebtTokenAddress: reserve[10],
        });
        console.log('_______________________________________________________________________________________')
      });
    });
    describe("Deposit", () =>
      {
      it("it should deposit Dai into aave", async function () {
        const {
          lending,
          owner,
          dai,
          fundAmount,
          a_dai,
          borrowAmount,
          debt_usdc,
        } = await loadFixture(deployFixture);

        let bDai_balance = ethers.utils.formatUnits(
          await dai.balanceOf(owner.address),
          18
        );
        console.log(`Before balance Of Dai: ${bDai_balance}`);

        await dai.approve(lending.address, fundAmount);
        await lending.Supply(DAI, fundAmount);

        // expect(await a_dai.balanceOf(owner.address)).lessThanOrEqual(20000n * 10n ** 18n);
        let aDai_balance = ethers.utils.formatUnits(
          await dai.balanceOf(owner.address),
          18
        );
        console.log(`After balance Of Dai: ${aDai_balance}`);

        let a_Dai_balance = ethers.utils.formatUnits(
          await a_dai.balanceOf(owner.address),
          18
        );
        console.log(`balance Of aDai: ${a_Dai_balance}`);

        reserve = await lending.UserAccountData(owner.address);

        console.table({
          TotalCollateralValue: ethers.utils.formatUnits(reserve[0], 8),
          TotalAmountBorrowed: ethers.utils.formatUnits(reserve[1], 8),
          TotalAmountAvalibleToBorrow: ethers.utils.formatUnits(reserve[2], 8),
          currentLiquidationThreshold: ethers.utils.formatUnits(reserve[3], 2),
          MaxLoanToValue: ethers.utils.formatUnits(reserve[4], 2),
          HealthFactor: ethers.utils.formatUnits(reserve[5], 18),
        });

        await lending.Borrow(USDC, debt_USDC, borrowAmount);
        console.table({
          TotalCollateralValue: ethers.utils.formatUnits(reserve[0], 8),
          TotalAmountBorrowed: ethers.utils.formatUnits(reserve[1], 8),
          TotalAmountAvalibleToBorrow: ethers.utils.formatUnits(reserve[2], 8),
          currentLiquidationThreshold: ethers.utils.formatUnits(reserve[3], 2),
          MaxLoanToValue: ethers.utils.formatUnits(reserve[4], 2),
          HealthFactor: ethers.utils.formatUnits(reserve[5], 18),
        });
      });
      console.log('_______________________________________________________________________________________')
    });

    describe.skip("Withdraw", () => {
      it("it should withdraw into aave", async function () {
        const {
          lending,
          owner,
          dai,
          fundAmount,
          a_dai,
          borrowAmount,
          debt_usdc,
        } = await loadFixture(deployFixture);
        let a_Dai_balance = ethers.utils.formatUnits(
          await a_dai.balanceOf(owner.address),
          18
        );
        console.log(`balance Of aDai: ${a_Dai_balance}`);
        await a_dai.approve(lending.address, borrowAmount);
        await lending.Withdraw(DAI, 1);
        expect(await dai.balanceOf(owner.address)).equal(5000n * 10n ** 18n);
      });
      console.log('_______________________________________________________________________________________')
    });

    describe.skip("Borrow", () => {
      it("it should borrow into aave", async function () {
        const { lending, owner, dai, borrowAmount, a_dai, debt_usdc } =
          await loadFixture(deployFixture);

        await lending.Borrow(DAI, borrowAmount);

        // await lending.BorrowV2(USDC, borrowAmount);
      });
      console.log('_______________________________________________________________________________________')
    });

    describe.skip("Repay", () => {
      it("it should repay into aave", async function ()
      {
        console.log('_______________________________________________________________________________________')
      });
    });

    describe.skip("Flashloan", () => {
      it("it should flash w/ aave", async function ()
      {
        console.log('_______________________________________________________________________________________')
      });
    });
    describe.skip("Accumulate Rewards", () => {
      it("it should claim rewards for deposit into aave over 3 days ", async function ()
      {
        console.log('_______________________________________________________________________________________')
      });
    });
  });
});
