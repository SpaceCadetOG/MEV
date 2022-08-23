const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const aDAI = "0x028171bCA77440897B824Ca71D1c56caC55b68A3";
const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const debt_USDC = "0xE4922afAB0BbaDd8ab2a88E0C79d884Ad337fcA6";
const DAI_WHALE = "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2"; // find whale on etherscan => Look for exchanges like FTX || Binacne || Coinbase
const address_provider = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";

describe("Aave", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    let whale,
      dai,
      a_dai,
      borrowAmount,
      fundAmount,
      fee,
      user_balance,
      paybackAmount;

    // will mock this acct
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });
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
    dai = await ethers.getContractAt(TokenAbi, DAI);
    a_dai = await ethers.getContractAt(aTokenAbi, aDAI);
    const debt_usdc = await ethers.getContractAt(dTokenAbi, debt_USDC);
    fundAmount = 20000n * 10n ** 18n; // 20000 dai
    borrowAmount = 5000n * 10n ** 18n; // 10000 dai
    fee = 10n * 10n ** 18n; // 10000 dai
    await dai.connect(whale).transfer(owner.address, fundAmount);

    user_balance = ethers.utils.formatUnits(
      await dai.balanceOf(owner.address),
      18
    );
    console.log(`Balance Of user Dai: ${user_balance}`);

    ethbalance = await owner.getBalance("latest");

    console.log(
      `Balance Of user eth: ${ethers.utils.formatUnits(ethbalance, 18)}`
    );

    const Lending = await ethers.getContractFactory("AaveLending");
    const lending = await Lending.deploy();

    return {
      lending,
      unlockTime,
      owner,
      otherAccount,
      dai,
      a_dai,
      borrowAmount,
      fundAmount,
      debt_usdc,
    };
  }

  describe("1) AaveLending Contract", () => {
    describe("GetAddressesForAave", () => {
      it("it should show aave pool address", async function () {
        const { lending, owner, dai, borrowAmount, a_dai } = await loadFixture(
          deployFixture
        );
      });
    });

    describe("GetPricesOfAssets", () => {
      it("it should getAssetPrice(address _asset)", async function () {
        const { lending, owner, dai, fundAmount, a_dai, borrowAmount } =
          await loadFixture(deployFixture);
          reserve = await lending.getReserves(USDC);
          console.log(`${reserve[8]}`)
          
      });
      it("it should getAssetsPrices(address[] calldata _assets)", async function () {});
      it("it should get price of token aave", async function () {});
    });
    describe.only("Deposit", () => {
      it("it should deposit Dai into aave", async function () {
        const { lending, owner, dai, fundAmount, a_dai, borrowAmount, debt_usdc } =
          await loadFixture(deployFixture);

        let bDai_balance = ethers.utils.formatUnits(
          await dai.balanceOf(owner.address),
          18
        );
        console.log(`Before balance Of Dai: ${bDai_balance}`);
        await dai.approve(lending.address, fundAmount);

        await lending.SupplyV2(DAI, fundAmount);

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

        await debt_usdc.approveDelegation(lending.address, borrowAmount);
          await lending.BorrowV2(USDC, borrowAmount);
      });
    });

    describe("Withdraw", () => {
      it("it should withdraw into aave", async function () {});
    });

    describe("Borrow", () => {
      it("it should borrow into aave", async function () {
        const { lending, owner, dai, borrowAmount, a_dai, debt_usdc } =
          await loadFixture(deployFixture);
        //   await dai.approve(lending.address, borrowAmount);


        // await lending.BorrowV2(USDC, borrowAmount);
      });
    });

    describe("Repay", () => {
      it("it should repay into aave", async function () {});
    });

    describe("Flashloan", () => {
      it("it should flash w/ aave", async function () {});
    });
    describe("Accumulate Rewards", () => {
      it("it should claim rewards for deposit into aave over 3 days ", async function () {});
    });
    describe("Get User Data", () => {
      it("it should getReserveTokenAddresses(address asset) ", async function () {});
      it("it should getReserveData(address asset) ", async function () {});
      it("it should getUserReserveData(address asset) ", async function () {});
    });
  });
});
