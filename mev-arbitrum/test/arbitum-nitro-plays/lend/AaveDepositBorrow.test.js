const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, use } = require("chai");
const { ethers } = require("hardhat");

const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const aDAI = "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE";
const debt_USDC = "0xFCCf3cAbbe80101232d343252614b6A3eE81C989";
const DAI_WHALE = "0xBA479d5585EcEC47eDc2a571dA430A40f43c3851"; // find whale on etherscan => Look for exchanges like FTX || Binacne || Coinbase
const address_provider = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";

describe("AaveDepositBorrow", function () {
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
    // will mock this acct
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });
    whale = await ethers.getSigner(DAI_WHALE);

    fundAmount = 20000n * 10n ** 18n; // 20000 dai
    borrowAmount = 20000n * 10n ** 18n; // 10000 dai
    fee = 10n * 10n ** 18n; // 10000 dai

    console.log(`Balance Of user Dai: ${user_balance}`);

    ethbalance = await owner.getBalance("latest");

    console.log(
      `Balance Of user eth: ${ethers.utils.formatUnits(ethbalance, 18)}`
    );

    const Lending = await ethers.getContractFactory("AaveDepositBorrow");
    const lending = await Lending.deploy();
    lending.deployed();

    dai = await ethers.getContractAt(TokenAbi, DAI);
    a_dai = await ethers.getContractAt(aTokenAbi, DAI);
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
          amount = 100n * 10n ** 18n
        await lending.DepositETH(amount, { value: ethers.utils.parseEther('100.0') });
        // await lending.WithdrawETH(ethers.utils.parseEther('1.0'));
      });
    });
  });
});
