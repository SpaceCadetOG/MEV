const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
// USDC
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DECIMALS_0 = 6n;
// WETH
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DECIMALS_1 = 18n;

// GMX
const TOKEN_2 = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";

const TOKEN_3 = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const DECIMALS_3 = 8n;
const WHALE = "0xBA479d5585EcEC47eDc2a571dA430A40f43c3851";
// 0.3%
const FEE = 3000;
// Pair
// 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8

describe("UniswapV3 MULTI-SWAP", () => {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const owner = await ethers.getSigner();
    let borrowAmount, fundAmount, weth, dai, usdc, whale, whale2;

    whale = await ethers.getSigner(WHALE);
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [WHALE],
    });

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

    const UniswapV3Twap = await ethers.getContractFactory("tradingTriangles");
    const twap = await UniswapV3Twap.deploy();
    await twap.deployed();

    const TestChainlink = await ethers.getContractFactory("ArbitrumPrices");
    let testChainlink = await TestChainlink.deploy();
    await testChainlink.deployed();

    weth = await ethers.getContractAt(WETHAbi, WETH);
    dai = await ethers.getContractAt(TokenAbi, DAI);
    usdc = await ethers.getContractAt(TokenAbi, USDC);

    daiAmount = 2000n * 10n ** 18n; // 20000 dai
    usdcAmount = 2000n * 10n ** 6n; // 20000 dai
    ethAmount = 2n * 10n ** 18n; // 1 eth

    await weth.connect(owner).deposit({ value: ethAmount });
    await weth.connect(owner).approve(twap.address, ethAmount);


    await dai.connect(whale).transfer(owner.address, daiAmount);
    await usdc.connect(whale).transfer(owner.address, usdcAmount);
    await dai.connect(owner).approve(twap.address, daiAmount);
    await usdc.connect(owner).approve(twap.address, usdcAmount);

    ethbalance = await owner.getBalance("latest");

    console.log(
      `Balance Of user eth: ${ethers.utils.formatUnits(ethbalance, 18)}`
    );

    console.log(
      "_______________________________________________________________________________________"
    );
    return {
      owner,
      dai,
      usdc, weth,
      ethAmount,
      twap,
      testChainlink,
    };
  }
  describe("Quoter", () => {
    it(" eth => dai", async () => {
      const { twap, owner, ethAmount, dai, testChainlink } = await loadFixture(
        deployFixture
      );

      await twap.quoteETHtoDAI(ethAmount, 500,{ value: 1 });
    });
    it(" eth => usdc", async () => {
      const { twap, owner, ethAmount, dai, testChainlink } = await loadFixture(
        deployFixture
      );

      await twap.quoteETHtoUSDC(ethAmount, { value: 1 });


    });

    it(" dai => eth ", async () => {
      const { twap, owner, ethAmount, dai, testChainlink } = await loadFixture(
        deployFixture
      );

      await twap.quoteDAItoETH(ethAmount, 500);


    });
    it.skip(" usdc => eth", async () => {
      const { twap, owner, ethAmount, dai, testChainlink } = await loadFixture(
        deployFixture
      );
      await twap.quoteUSDCtoETH(ethAmount, { value: 1 });
    });
  });
  describe("swap Functions", () => {
    it(" eth => dai => swapExactInputSingle", async () => {
      const { twap, owner, ethAmount, dai, usdc, testChainlink, weth } = await loadFixture(
        deployFixture
      );

      // await twap.swapExactInputSingle(ethAmount);
      await twap.swapExactInputSingle(3000, weth.address, ethAmount, dai.address);
      console.log(ethers.utils.formatUnits(await dai.balanceOf(owner.address), 18));
    });

    it.only(" eth => dai => swapExactOutputSingle", async () => {
      const { twap, owner, ethAmount, dai, usdc, testChainlink, weth } = await loadFixture(
        deployFixture
      );
      console.log(ethers.utils.formatUnits(await dai.balanceOf(owner.address), 18));
      // await twap.swapExactInputSingle(ethAmount);
      
      daiAmount = 1549n * 10n ** 18n; // 1 eth
      await twap.swapExactOutputSingle(weth.address, dai.address, daiAmount, amount)

      console.log(ethers.utils.formatUnits(await dai.balanceOf(owner.address), 18));
      console.log(ethers.utils.formatUnits(await weth.balanceOf(owner.address), 18));
    });
  });

  // describe.skip("swapExactOutputMultihop()", () => {
  // });
});
