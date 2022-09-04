const { expect } = require("chai");
const { ethers } = require("hardhat");

const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
// USDC
const TOKEN_0 = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DECIMALS_0 = 6n;
// WETH
const TOKEN_1 = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DECIMALS_1 = 18n;

// GMX
const TOKEN_2 = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";

const TOKEN_3 = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const DECIMALS_3 = 8n;

// 0.3%
const FEE = 3000;
// Pair
// 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8

describe("UniswapV3TWAP Oracle", () => {
  it.only(" WETH/USDC pool price on Uniswap  => 0.3%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_0, TOKEN_1, FEE);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_1, 10n ** DECIMALS_1, FEE);
    console.table({
      USDC_WETH: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it.only(" WETH/USDC pool price on Uniswap  => 1%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_0, TOKEN_1, 10000);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_1, 10n ** DECIMALS_1, 10);
    console.table({
      USDC_WETH: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it.only(" WETH/USDC pool price on Uniswap  => 0.05%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_0, TOKEN_1, 500);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_1, 10n ** DECIMALS_1, 10);
    console.table({
      USDC_WETH: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it.only(" ETH/DAI pool price on Uniswap => 0.3%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      TOKEN_1,
      FEE
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_1, 10n ** DECIMALS_1, FEE);
    console.table({
      DAI_WETH: ethers.utils.formatUnits(price.toString(), "wei") / 1e18,
    });
  });
  it.only(" ETH/DAI pool price on Uniswap => 1%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      TOKEN_1,
      10000
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_1, 10n ** DECIMALS_1, 10000);
    console.table({
      DAI_WETH: ethers.utils.formatUnits(price.toString(), "wei") / 1e18,
    });
  });
  it.only(" ETH/DAI pool price on Uniswap => 0.05%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      TOKEN_1,
      500
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_1, 10n ** DECIMALS_1, 500);
    console.table({
      DAI_WETH: ethers.utils.formatUnits(price.toString(), "wei") / 1e18,
    });
  });
  it(" GMX/USDC pool price on Uniswap  => 0.3%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_0, TOKEN_2, FEE);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_2, 10n ** DECIMALS_1, 10);
    console.table({
      USDC_GMX: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it(" GMX/USDC pool price on Uniswap  => 1%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_0, TOKEN_2, 10000);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_2, 10n ** DECIMALS_1, 10);
    console.table({
      USDC_GMX: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it(" WBTC/USDC pool price on Uniswap  => 0.3%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_0, TOKEN_3, FEE);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_3, 10n ** DECIMALS_3, 10);
    console.table({
      USDC_WBTC: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it(" WBTC/ETH pool price on Uniswap  => 1%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_1, TOKEN_3, 10000);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_3, 10n ** DECIMALS_3, 10);
    console.table({
      ETH_WBTC: ethers.utils.formatUnits(price.toString(), "wei") / 1e18,
    });
  });
  it(" UNI/USDC pool price on Uniswap  => 0.3%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      TOKEN_0,
      "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
      FEE
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(
      "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
      10n ** DECIMALS_1,
      10
    );
    console.table({
      USDC_UNI: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it(" DAI/USDC pool price on Uniswap  => 0.3%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      TOKEN_0,
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      FEE
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      10n ** DECIMALS_1,
      10
    );
    console.table({
      USDC_DAI: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it(" DAI/USDC pool price on Uniswap  => 1%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      TOKEN_0,
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      10000
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      10n ** DECIMALS_1,
      10
    );
    console.table({
      USDC_DAI: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it(" MIM/USDC pool price on Uniswap  => 0.3%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      TOKEN_0,
      "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      FEE
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(
      "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      10n ** DECIMALS_1,
      10
    );
    console.table({
      USDC_MIM: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it(" MIM/USDC pool price on Uniswap  => 1%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      TOKEN_0,
      "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      10000
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(
      "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      10n ** DECIMALS_1,
      10
    );
    console.table({
      USDC_MIM: ethers.utils.formatUnits(price.toString(), "wei") / 1000000,
    });
  });
  it(" GMX/DAI pool price on Uniswap => 0.3% ", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      TOKEN_2,
      FEE
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_2, 10n ** DECIMALS_1, 10);
    console.table({
      DAI_GMX: ethers.utils.formatUnits(price.toString(), "wei") / 1e18,
    });
  });
  it(" GMX/DAI pool price on Uniswap => 1% ", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(
      FACTORY,
      "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      TOKEN_2,
      10000
    );
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_2, 10n ** DECIMALS_1, 10);
    console.table({
      DAI_GMX: ethers.utils.formatUnits(price.toString(), "wei") / 1e18,
    });
  });
  it(" GMX/ETH pool price on Uniswap => 0.03%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_1, TOKEN_2, FEE);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_2, 10n ** DECIMALS_1, 10);
    console.table({
      ETH_GMX: ethers.utils.formatUnits(price.toString(), "wei") / 1e18, // price in eth
    });
  });
  it(" GMX/ETH pool price on Uniswap => 1%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("UniwapV3TWAP");
    const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_1, TOKEN_2, 10000);
    await twap.deployed();

    const price = await twap.estimateAmountOut(TOKEN_2, 10n ** DECIMALS_1, 10);
    console.table({
      ETH_GMX: ethers.utils.formatUnits(price.toString(), "wei") / 1e18, // price in eth
    });
  });
});
