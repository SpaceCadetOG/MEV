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
  it(" WETH/USDC pool price on Uniswap  => 0.03%", async () => {
    const UniswapV3Twap = await ethers.getContractFactory("Runner");
    const twap = await UniswapV3Twap.deploy();
    await twap.deployed();

    const price = await twap.getLatestPriceETH();
    console.log(price);
  });
  

});
