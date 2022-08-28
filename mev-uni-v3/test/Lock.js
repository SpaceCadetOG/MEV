// import { tokenAddress, tokenWhale } from "../utils/constants/Tokens";

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, network } = require("hardhat");

const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DAI_WHALE = "0x4b4e5223e45CB74f05c352a657FF6b4c5482Ea52";
const USDC_WHALE = "0x9395964796d2Ec64a3aa5BC86A881213409F507A";

const futureTime = (seconds) => {
  return +Math.floor(new Date().getTime() / 1000.0) + +seconds;
};

describe("4: Add Liquidity to Uniswap V3", function () {
  async function deployFixture() {
    let usdc, dai, accounts, swapV3;
    accounts = await ethers.getSigners();
    const TokenAbi = [
      "function balanceOf(address account) external view returns (uint256)",
      "function transfer(address to, uint amount) returns (bool)",
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    ];
    dai = await ethers.getContractAt(TokenAbi, DAI);
    usdc = await ethers.getContractAt(TokenAbi, USDC);

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_WHALE],
    });

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDC_WHALE],
    });

    const dai_whale = await ethers.getSigner(DAI_WHALE);
    const usdc_whale = await ethers.getSigner(USDC_WHALE);

    const SwapV3 = await ethers.getContractFactory("LetsSwap");

    swapV3 = await SwapV3.deploy();
    await swapV3.deployed();

    const dai_amount = 100n * 10n ** 18n;
    const usdc_amount = 100n * 10n ** 6n;

    expect(await dai.balanceOf(dai_whale.address)).to.gte(dai_amount);
    expect(await usdc.balanceOf(usdc_whale.address)).to.gte(usdc_amount);
    console.log(
      "B: DAI Balance of Whale",
      ethers.utils.formatEther(await dai.balanceOf(dai_whale.address))
    );
    console.log(
      "B: USDC Balance of Whale",
      ethers.utils.formatUnits(await usdc.balanceOf(usdc_whale.address), 6)
    );

    await dai.connect(dai_whale).transfer(accounts[0].address, dai_amount);
    await usdc.connect(usdc_whale).transfer(accounts[0].address, usdc_amount);

    deadline = futureTime(15);
    dai_balance = await dai.balanceOf(accounts[0].address);
    usdc_balance = await usdc.balanceOf(accounts[0].address);
    eth_balance = await accounts[0].getBalance();

    console.log("B: DAI Balance of ", ethers.utils.formatEther(dai_balance));
    console.log("B: ETH Balance of ", ethers.utils.formatEther(eth_balance));
    console.log(
      "B: USDC Balance of ",
      ethers.utils.formatUnits(usdc_balance, 6)
    );
    console.log("START");
    return { usdc, dai, accounts, swapV3 };
  }

  describe("Swap", () => {
    it("swap", async () => {
      const { dai, accounts, swapV3 } = await loadFixture(deployFixture);
      const amount = ethers.utils.parseEther("3000");
      await swapV3.quoteETHtoDAI(amount);
    });
  });
});
