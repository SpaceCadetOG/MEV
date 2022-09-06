const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DAI = "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70";
const aDAI = "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE";
const debt_USDC = "0xFCCf3cAbbe80101232d343252614b6A3eE81C989";
const DAI_WHALE = "0xBA479d5585EcEC47eDc2a571dA430A40f43c3851"; // find whale on etherscan => Look for exchanges like FTX || Binacne || Coinbase
const address_provider = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";
const me = '0xE5e96c7AA9De0451DBE29ACDBFD7632F0963f121'
describe("Aave", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployFixture() {

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
    // will mock this acct
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [me],
    });
    whale = await ethers.getSigner(DAI_WHALE);

    fundAmount = 2000n * 10n ** 18n; // 20000 dai
    borrowAmount = 200n * 10n ** 18n; // 10000 dai
    fee = 10n * 10n ** 18n; // 10000 dai

    console.log(`Balance Of user Dai: ${user_balance}`);

    ethbalance = await owner.getBalance("latest");

    console.log(
      `Balance Of user eth: ${ethers.utils.formatUnits(ethbalance, 18)}`
    );

    const Lending = await ethers.getContractFactory("AaveLendingV3");
    const lending = await Lending.deploy();
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
    await dai.connect(whale).transfer(owner.address, fundAmount);

    user_balance = ethers.utils.formatUnits(
      await dai.balanceOf(owner.address),
      18
    );
    await dai.connect(owner).approve(lending.address, fundAmount);

    console.log(
      "_______________________________________________________________________________________"
    );
    return {
      lending,
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
        console.log(
          "_______________________________________________________________________________________"
        );
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
      console.log(
        "_______________________________________________________________________________________"
      );
      it("it should getReserveData(address asset) ", async function () {
        const { lending, owner, dai, borrowAmount, a_dai } = await loadFixture(
          deployFixture
        );
        reserve = await lending.AaveReserveData(dai.address);
        // clean later
        console.log("DAI", reserve);
        console.log(
          "_______________________________________________________________________________________"
        );
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
        console.log(
          "_______________________________________________________________________________________"
        );
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
        console.log(
          "_______________________________________________________________________________________"
        );
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
      });
    });
    describe.only("Deposit", () => {
      it("it should deposit ETH into aave borrow 100 dai", async function () {
        const {
          lending,
          owner,
          dai,
          fundAmount,
          a_dai,
          borrowAmount,
          debt_usdc,
        } = await loadFixture(deployFixture);

        reserve = await lending.UserAccountData(owner.address);

        console.table({
          TotalCollateralValue: ethers.utils.formatUnits(reserve[0], 8),
          TotalAmountBorrowed: ethers.utils.formatUnits(reserve[1], 8),
          TotalAmountAvalibleToBorrow: ethers.utils.formatUnits(reserve[2], 8),
          currentLiquidationThreshold: ethers.utils.formatUnits(reserve[3], 2),
          MaxLoanToValue: ethers.utils.formatUnits(reserve[4], 2),
          HealthFactor: ethers.utils.formatUnits(reserve[5], 18),
        });

        let bDai_balance = ethers.utils.formatUnits(
          await dai.balanceOf(owner.address),
          18
        );
        console.log(`Before balance Of Dai: ${bDai_balance}`);
        amount = 100n * 10n ** 18n;
        await lending.DepositETH({ value: ethers.utils.parseEther("1") });

        reserve = await lending.UserAccountData(owner.address);

        console.table({
          TotalCollateralValue: ethers.utils.formatUnits(reserve[0], 8),
          TotalAmountBorrowed: ethers.utils.formatUnits(reserve[1], 8),
          TotalAmountAvalibleToBorrow: ethers.utils.formatUnits(reserve[2], 8),
          currentLiquidationThreshold: ethers.utils.formatUnits(reserve[3], 2),
          MaxLoanToValue: ethers.utils.formatUnits(reserve[4], 2),
          HealthFactor: ethers.utils.formatUnits(reserve[5], 8),
        });

        await lending.Borrow(dai.address, amount);
      });
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

        reserve = await lending.UserAccountData(owner.address);

        console.table({
          TotalCollateralValue: ethers.utils.formatUnits(reserve[0], 8),
          TotalAmountBorrowed: ethers.utils.formatUnits(reserve[1], 8),
          TotalAmountAvalibleToBorrow: ethers.utils.formatUnits(reserve[2], 8),
          currentLiquidationThreshold: ethers.utils.formatUnits(reserve[3], 2),
          MaxLoanToValue: ethers.utils.formatUnits(reserve[4], 2),
          HealthFactor: ethers.utils.formatUnits(reserve[5], 18),
        });

        let bDai_balance = ethers.utils.formatUnits(
          await dai.balanceOf(owner.address),
          18
        );
        console.log(`Before balance Of Dai: ${bDai_balance}`);

        await lending.Supply(dai.address, fundAmount);

        // expect(await a_dai.balanceOf(owner.address)).lessThanOrEqual(
        //   fundAmount
        // );

        reserve = await lending.UserAccountData(owner.address);

        console.table({
          TotalCollateralValue: ethers.utils.formatUnits(reserve[0], 8),
          TotalAmountBorrowed: ethers.utils.formatUnits(reserve[1], 8),
          TotalAmountAvalibleToBorrow: ethers.utils.formatUnits(reserve[2], 8),
          currentLiquidationThreshold: ethers.utils.formatUnits(reserve[3], 2),
          MaxLoanToValue: ethers.utils.formatUnits(reserve[4], 2),
          HealthFactor: ethers.utils.formatUnits(reserve[5], 18),
        });
      });
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
        await lending.Withdraw(DAI, borrowAmount);
        // expect(await dai.balanceOf(owner.address)).equal(5000n * 10n ** 18n);
      });
      console.log(
        "_______________________________________________________________________________________"
      );
    });

    describe("Borrow", () => {
      it("it should borrow into aave", async function () {
        const {
          lending,
          owner,
          dai,
          borrowAmount,
          a_dai,
          debt_usdc,
          fundAmount,
        } = await loadFixture(deployFixture);
        amount = 200n * 10n ** 18n;

        await lending.Supply(dai.address, fundAmount);

        // expect(await a_dai.balanceOf(owner.address)).lessThanOrEqual(
        //   fundAmount
        // );

        await lending.Borrow(dai.address, debt_USDC, amount);

        // await lending.BorrowV2(USDC, borrowAmount);
      });
      console.log(
        "_______________________________________________________________________________________"
      );
    });

    describe.skip("Repay", () => {
      it("it should repay into aave", async function () {
        console.log(
          "_______________________________________________________________________________________"
        );
      });
    });
    describe.skip("Accumulate Rewards", () => {
      it("it should claim rewards for deposit into aave over 3 days ", async function () {
        console.log(
          "_______________________________________________________________________________________"
        );
      });
    });
  });
});
