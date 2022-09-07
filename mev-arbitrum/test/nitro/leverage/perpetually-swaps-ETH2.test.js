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
const DAI_WHALE = "0xBA479d5585EcEC47eDc2a571dA430A40f43c3851"; // find whale on etherscan => Look for exchanges like FTX || Binacne || Coinbase
const USDC_WHALE = "0xBA479d5585EcEC47eDc2a571dA430A40f43c3851";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const address_provider = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";

describe("Aave", function () {

  async function deployFixture() {

    // Contracts are deployed using the first signer/account by default
    const owner = await ethers.getSigner();
    let whale,
      whale2,
      dai,
      a_dai,
      usdc, weth,
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
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE],
    });
    const TokenAbi = [
      "function balanceOf(address account) external view returns (uint256)",
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
    whale2 = await ethers.getSigner(USDC_WHALE);

    fundAmount = 2000n * 10n ** 18n; // 20000 dai
    borrowAmount = 1000n * 10n ** 18n; // 10000 dai
    fee = 10n * 10n ** 18n; // 10000 dai

    fundAmount2 = 2000n * 10n ** 6n; // 20000 dai
    borrowAmount2 = 1000n * 10n ** 6n; // 10000 dai
    fee2 = 10n * 10n ** 6n; // 10000 dai

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
    const lending = await Lending.deploy();
    lending.deployed();

    const Loan = await ethers.getContractFactory("PerpetuallySwapsETH2");
    const loan = await Loan.deploy(
      "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb"
    );
    loan.deployed();

    list = await lending.AaveReserveList();
    // console.log(`Dai: ${list[0]}`);
    // console.log(`Link: ${list[1]}`);
    // console.log(`USDC: ${list[2]}`);
    // console.log(`WBTC: ${list[3]}`);
    // console.log(`WETH: ${list[4]}`);
    // console.log(`USDt: ${list[5]}`);
    // console.log(`Aave: ${list[6]}`);

    dai = await ethers.getContractAt(TokenAbi, list[0]);
    usdc = await ethers.getContractAt(TokenAbi, list[2]);
    weth = await ethers.getContractAt(TokenAbi, list[4]);
    reserve = await lending.AaveReserveData(dai.address);

    paybackAmount = borrowAmount + fee;
    paybackAmount2 = borrowAmount2 + fee2;
    await dai.connect(whale).transfer(owner.address, fundAmount);
    await usdc.connect(whale2).transfer(owner.address, fundAmount2);
    console.log(
      "Before Flashloan: USDC Balance of Owner",
      ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
    );
    await dai.connect(owner).transfer(loan.address, paybackAmount);
    await usdc.connect(owner).transfer(loan.address, paybackAmount2);

    console.log(
      "Before Flashloan: USDC Balance of contract",
      ethers.utils.formatUnits(await usdc.balanceOf(loan.address), 6)
    );

    return {
      lending,
      loan,
      owner,
      dai,
      usdc,
      a_dai,
      borrowAmount2,
      fundAmount,
    };
  }

  describe("1) AaveLending Contract", () => {
    describe("Flashloan", () => {
      it("it should fl", async function () {
        const { loan, owner, usdc, fundAmount, a_dai, borrowAmount2 } =
          await loadFixture(deployFixture);
        await loan.MakeMoney(usdc.address, borrowAmount2, owner.address);

        console.log(
          "After Flashloan: USDC Balance of contract",
          ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
        );

      });
    });
  });
});
