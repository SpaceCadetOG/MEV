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
const GMX = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";

const TOKEN_3 = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const DECIMALS_3 = 8n;
const WHALE = "0xBA479d5585EcEC47eDc2a571dA430A40f43c3851";
// 0.3%
const FEE = 3000;
// Pair
// 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8

describe("Trading Triangles Test", () => {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const owner = await ethers.getSigner();
    let borrowAmount, fundAmount, weth, dai, usdc, gmx, whale, whale2;

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
    gmx = await ethers.getContractAt(TokenAbi, GMX);

    daiAmount = 2000n * 10n ** 18n; // 20000 dai
    let usdcAmount = 2000n * 10n ** 6n; // 20000 dai
    ethAmount = 1n * 10n ** 18n; // 1 eth

    // await weth.connect(owner).deposit({ value: ethAmount });
    await weth.connect(owner).approve(twap.address, ethAmount);

    await dai.connect(whale).transfer(owner.address, daiAmount);
    await usdc.connect(whale).transfer(owner.address, usdcAmount);
    await dai.connect(owner).approve(twap.address, daiAmount);
    await usdc.connect(owner).approve(twap.address, usdcAmount);
    await gmx.connect(owner).approve(twap.address, daiAmount);

    ethbalance = await owner.getBalance("latest");

    console.log(
      "_______________________________________________________________________________________"
    );
    return {
      owner,
      dai,
      usdc,
      gmx,
      weth,
      ethAmount,
      daiAmount,
      usdcAmount,
      twap,
      testChainlink,
    };
  }

  describe("TWAP", () => {
    describe('"WETH -> USDC', () => {
      it("WETH -> USDC 0.05%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const weth2usdc1 = await twap.estimateAmountOut(
          WETH,
          USDC,
          500,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_WETH1 = {
          pair: "USDC/WETH 0.05%",
          price:
            ethers.utils.formatUnits(weth2usdc1.toString(), "wei") / 1000000,
        };
        console.table([USDC_WETH1]);
      });

      it("WETH -> USDC 0.3%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const weth2usdc1 = await twap.estimateAmountOut(
          WETH,
          USDC,
          3000,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_WETH1 = {
          pair: "USDC/WETH 0.3%",
          price:
            ethers.utils.formatUnits(weth2usdc1.toString(), "wei") / 1000000,
        };
        console.table([USDC_WETH1]);
      });

      it.skip("WETH -> USDC 1%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const weth2usdc1 = await twap.estimateAmountOut(
          WETH,
          USDC,
          10000,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_WETH1 = {
          pair: "USDC/WETH 1%",
          price:
            ethers.utils.formatUnits(weth2usdc1.toString(), "wei") / 1000000,
        };
        console.table([USDC_WETH1]);
      });
    });
    describe.skip('"WETH -> DAI', () => {
      it("WETH -> DAI 0.05%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const weth2usdc1 = await twap.estimateAmountOut(
          WETH,
          DAI,
          500,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_WETH1 = {
          pair: "USDC/WETH 0.05%",
          price:
            ethers.utils.formatUnits(weth2usdc1.toString(), "wei") / 1000000,
        };
        console.table([USDC_WETH1]);
      });

      it("WETH -> DAI 0.3%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const weth2usdc1 = await twap.estimateAmountOut(
          WETH,
          DAI,
          3000,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_WETH1 = {
          pair: "DAI/WETH 0.3%",
          price: ethers.utils.formatUnits(weth2usdc1.toString(), 18),
        };
        console.table([USDC_WETH1]);
      });

      it("WETH -> DAI 1%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const weth2usdc1 = await twap.estimateAmountOut(
          WETH,
          DAI,
          10000,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_WETH1 = {
          pair: "DAI/WETH 1%",
          price: ethers.utils.formatUnits(weth2usdc1.toString(), 18),
        };
        console.table([USDC_WETH1]);
      });
    });
    describe("GMX -> USDC", () => {
      it("GMX -> USDC 0.05%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          GMX,
          USDC,
          500,
          GMX,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "USDC/GMX 0.05%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 6),
        };
        console.table([USDC_GMX]);
      });

      it("GMX -> USDC 0.3%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          GMX,
          USDC,
          3000,
          GMX,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "USDC/GMX 0.3%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 6),
        };
        console.table([USDC_GMX]);
      });

      it("GMX -> USDC 1%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          GMX,
          USDC,
          10000,
          GMX,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "USDC/GMX 1%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 6),
        };
        console.table([USDC_GMX]);
      });
    });

    describe("GMX -> WETH", () => {
      it("GMX -> USDC 0.05%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          GMX,
          WETH,
          500,
          GMX,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "GMX/WETH 0.05%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 18),
        };
        console.table([USDC_GMX]);
      });

      it("GMX -> WETH 0.3%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          GMX,
          WETH,
          3000,
          GMX,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "WETH/GMX 0.3%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 18),
        };
        console.table([USDC_GMX]);
      });

      it("GMX -> ETH 1%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          GMX,
          WETH,
          10000,
          GMX,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "WETH/GMX 1%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 18),
        };
        console.table([USDC_GMX]);
      });
    });

    describe("WETH -> GMX", () => {
      it("GMX -> USDC 0.05%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          WETH,
          GMX,
          500,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "GMX/WETH 0.05%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 18),
        };
        console.table([USDC_GMX]);
      });

      it("GMX -> WETH 0.3%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          WETH,
          GMX,
          3000,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "WETH/GMX 0.3%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 18),
        };
        console.table([USDC_GMX]);
      });

      it("GMX -> ETH 1%", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);
        const gmx_usdc1 = await twap.estimateAmountOut(
          WETH,
          GMX,
          10000,
          WETH,
          10n ** DECIMALS_1,
          FEE
        );
        const USDC_GMX = {
          pair: "WETH/GMX 1%",
          price: ethers.utils.formatUnits(gmx_usdc1.toString(), 18),
        };
        console.table([USDC_GMX]);
      });
    });
  });

  describe.only("Manual Triangle Quote", () => {
    describe("USDC | GMX | WETH ", () => {
      it("1) triangle usdc -> gmx ->  -> weth -> usdc", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);

        let price = await twap.estimateTrade(
          GMX,
          USDC,
          3000,
          10n ** DECIMALS_1,
          30
        );

        let price2 = await twap.estimateTrade(
          WETH,
          GMX,
          3000,
          10n ** DECIMALS_1,
          30
        );

        let price3 = await twap.estimateTrade(WETH, USDC, 500, 10n ** 18n, 60);

        const GMX_USDC = {
          trade: "1 GMX -> usdc in USDC/GMX pool 0.3%",
          AmountOut1: ethers.utils.formatUnits(price.toString(), 6),
        };

        const USDC_WETH = {
          trade: "1 weth -> usdc in USDC/WETH pool 0.05%",
          AmountOut2: ethers.utils.formatUnits(price3.toString(), 6),
        };
        const GMX_WETH = {
          trade: "1 weth -> gmx  in GMX/WETH pool 0.3%",
          AmountOut3: ethers.utils.formatUnits(price2.toString(), 18),
        };

        let ImpliedRate = {
          quote: " USDC/WETH and GMX/WETH in pool 0.3% to arb ",
          implied_rate: [
            ethers.utils.formatUnits(price.toString(), 6) *
              ethers.utils.formatUnits(price2.toString(), 18),
          ],
        };
        let PotentialArb;
        let _PotentialArb1 =
          ethers.utils.formatUnits(price.toString(), 6) *
            ethers.utils.formatUnits(price2.toString(), 18) -
          ethers.utils.formatUnits(price3.toString(), 6);

        let _PotentialArb2 =
          ethers.utils.formatUnits(price3.toString(), 6) -
          ethers.utils.formatUnits(price.toString(), 6) *
            ethers.utils.formatUnits(price2.toString(), 18);

        if (_PotentialArb1 > _PotentialArb2) {
          PotentialArb = _PotentialArb1;
        } else {
          PotentialArb = _PotentialArb2;
        }

        console.table([GMX_USDC, USDC_WETH, GMX_WETH]);
        console.log(ImpliedRate);

        console.log(
          `Potential Triangle of: $${PotentialArb} in usdc not counting fees`
        );
      });

      it("2) triangle usdc -> gmx ->  -> weth -> usdc", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);

        let price = await twap.estimateTrade(
          GMX,
          USDC,
          3000,
          10n ** DECIMALS_1,
          30
        );

        let price2 = await twap.estimateTrade(
          WETH,
          GMX,
          3000,
          10n ** DECIMALS_1,
          30
        );

        let price3 = await twap.estimateTrade(WETH, USDC, 3000, 10n ** 18n, 60);

        const GMX_USDC = {
          trade: "1 GMX -> usdc in USDC/GMX pool 0.3%",
          AmountOut1: ethers.utils.formatUnits(price.toString(), 6),
        };

        const USDC_WETH = {
          trade: "1 weth -> usdc in USDC/WETH pool 0.3%",
          AmountOut2: ethers.utils.formatUnits(price3.toString(), 6),
        };
        const GMX_WETH = {
          trade: "1 weth -> gmx  in GMX/WETH pool 0.3%",
          AmountOut3: ethers.utils.formatUnits(price2.toString(), 18),
        };

        let ImpliedRate = {
          quote: " USDC/WETH and GMX/WETH in pool 0.3% to arb ",
          implied_rate: [
            ethers.utils.formatUnits(price.toString(), 6) *
              ethers.utils.formatUnits(price2.toString(), 18),
          ],
        };
        let PotentialArb;
        let _PotentialArb1 =
          ethers.utils.formatUnits(price.toString(), 6) *
            ethers.utils.formatUnits(price2.toString(), 18) -
          ethers.utils.formatUnits(price3.toString(), 6);

        let _PotentialArb2 =
          ethers.utils.formatUnits(price3.toString(), 6) -
          ethers.utils.formatUnits(price.toString(), 6) *
            ethers.utils.formatUnits(price2.toString(), 18);

        if (_PotentialArb1 > _PotentialArb2) {
          PotentialArb = _PotentialArb1;
        } else {
          PotentialArb = _PotentialArb2;
        }

        console.table([GMX_USDC, USDC_WETH, GMX_WETH]);
        console.log(ImpliedRate);

        console.log(
          `Potential Triangle of: $${PotentialArb} in usdc not counting fees`
        );
      });

      it("3) triangle usdc -> gmx ->  -> weth -> usdc", async () => {
        const { twap, owner, ethAmount, dai, testChainlink } =
          await loadFixture(deployFixture);

        let price = await twap.estimateTrade(
          GMX,
          USDC,
          10000,
          10n ** DECIMALS_1,
          30
        );

        let price2 = await twap.estimateTrade(
          WETH,
          GMX,
          10000,
          10n ** DECIMALS_1,
          30
        );

        let price3 = await twap.estimateTrade(
          WETH,
          USDC,
          10000,
          10n ** 18n,
          60
        );

        const GMX_USDC = {
          trade: "1 GMX -> usdc in USDC/GMX pool 1%",
          AmountOut1: ethers.utils.formatUnits(price.toString(), 6),
        };

        const USDC_WETH = {
          trade: "1 weth -> usdc in USDC/WETH pool 1%",
          AmountOut2: ethers.utils.formatUnits(price3.toString(), 6),
        };
        const GMX_WETH = {
          trade: "1 weth -> gmx  in GMX/WETH pool 1%",
          AmountOut3: ethers.utils.formatUnits(price2.toString(), 18),
        };

        let ImpliedRate = {
          quote: " USDC/WETH and GMX/WETH in pool 1% to arb ",
          implied_rate: [
            ethers.utils.formatUnits(price.toString(), 6) *
              ethers.utils.formatUnits(price2.toString(), 18),
          ],
        };
        let PotentialArb;
        let _PotentialArb1 =
          ethers.utils.formatUnits(price.toString(), 6) *
            ethers.utils.formatUnits(price2.toString(), 18) -
          ethers.utils.formatUnits(price3.toString(), 6);

        let _PotentialArb2 =
          ethers.utils.formatUnits(price3.toString(), 6) -
          ethers.utils.formatUnits(price.toString(), 6) *
            ethers.utils.formatUnits(price2.toString(), 18);

        if (_PotentialArb1 > _PotentialArb2) {
          PotentialArb = _PotentialArb1;
        } else {
          PotentialArb = _PotentialArb2;
        }

        console.table([GMX_USDC, USDC_WETH, GMX_WETH]);
        console.log(ImpliedRate);

        console.log(
          `Potential Triangle of: $${PotentialArb} in usdc not counting fees`
        );
      });
    });
  });

  // start here
  describe("Manual Triangle Path", () => {
    describe("USDC | GMX | WETH ", () => {
      it(" eth => dai => swapExactOutputSingle", async () => {
        const { twap, owner, ethAmount, dai, usdc, testChainlink, weth } =
          await loadFixture(deployFixture);

        trade = await twap.estimate2Trade(
          WETH,
          GMX,
          3000,
          10n ** DECIMALS_1,
          30
        );

        console.log(ethers.utils.formatUnits(trade[0], 18));

        console.log(ethers.utils.formatUnits(trade[1], 6));
      });
    });
  });

  describe("Quoter", () => {
    it(" eth => dai", async () => {
      const { twap, owner, ethAmount, dai, testChainlink } = await loadFixture(
        deployFixture
      );

      await twap.quoteETHtoDAI(ethAmount, 500, { value: 1 });
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
  describe.only("swap Functions", () => {
    it(" eth => dai => swapExactInputSingle", async () => {
      const { twap, owner, ethAmount, dai, usdc, testChainlink, weth, gmx } =
        await loadFixture(deployFixture);

      // await twap.swapExactInputSingle(ethAmount);
      await twap.swapExactInputSingle(3000, weth.address, ethAmount, GMX);
      console.log(
        ethers.utils.formatUnits(await gmx.balanceOf(owner.address), 18)
      );

      // await twap.swapExactInputSingle(ethAmount);
      await twap.swapExactInputSingle(
        3000,
        GMX,
        await gmx.balanceOf(owner.address),
        usdc.address
      );
      console.log(
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );

      await twap.swapExactInputSingle(
        500,
        USDC,
        await usdc.balanceOf(owner.address),
        weth.address
      );
      console.log(
        ethers.utils.formatUnits(await weth.balanceOf(owner.address), 18)
      );
    });

    it.only("  usdc => eth => gmx => usdc swapExactOutputSingle", async () => {
      const {
        twap,
        owner,
        ethAmount,
        dai,
        usdc,
        testChainlink,
        weth,
        usdcAmount,
        gmx,
      } = await loadFixture(deployFixture);

      console.log(
        "B: USDC",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
      console.log(
        "B: WETH",
        ethers.utils.formatUnits(await weth.balanceOf(owner.address), 18)
      );

      await twap.swapExactOutputSingle(
        500,
        usdc.address,
        weth.address,
        ethAmount,
        usdcAmount
      );

      console.log(
        "M: USDC",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
      console.log(
        "M: WETH",
        ethers.utils.formatUnits(await weth.balanceOf(owner.address), 18)
      );

      await twap.swapExactInputSingle(3000, weth.address, ethAmount, GMX);

      console.log(
        "M: GMX",
        ethers.utils.formatUnits(await gmx.balanceOf(owner.address), 18)
      );
      console.log(
        "M: WETH",
        ethers.utils.formatUnits(await weth.balanceOf(owner.address), 18)
      );
      await gmx
        .connect(owner)
        .approve(twap.address, await gmx.balanceOf(owner.address));
      await twap.swapExactInputSingle(
        3000,
        gmx.address,
        await gmx.balanceOf(owner.address),
        usdc.address
      );

      console.log(
        "A: GMX",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 18)
      );

      console.log(
        "A: USDC",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
    });

    it.only("  usdc => eth => gmx => usdc swapExactOutputSingle", async () => {
      const {
        twap,
        owner,
        ethAmount,
        dai,
        usdc,
        testChainlink,
        weth,
        usdcAmount,
        gmx,
      } = await loadFixture(deployFixture);

      console.log(
        "B: USDC",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
      console.log(
        "B: WETH",
        ethers.utils.formatUnits(await weth.balanceOf(owner.address), 18)
      );

      await twap.swapExactOutputSingle(
        500,
        usdc.address,
        weth.address,
        ethAmount,
        usdcAmount
      );

      console.log(
        "M: USDC",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
      console.log(
        "M: WETH",
        ethers.utils.formatUnits(await weth.balanceOf(owner.address), 18)
      );

      await twap.swapExactInputSingle(3000, weth.address, ethAmount, GMX);

      console.log(
        "M: GMX",
        ethers.utils.formatUnits(await gmx.balanceOf(owner.address), 18)
      );
      console.log(
        "M: WETH",
        ethers.utils.formatUnits(await weth.balanceOf(owner.address), 18)
      );
      await gmx
        .connect(owner)
        .approve(twap.address, await gmx.balanceOf(owner.address));
      await twap.swapExactInputSingle(
        3000,
        gmx.address,
        await gmx.balanceOf(owner.address),
        usdc.address
      );

      console.log(
        "A: GMX",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 18)
      );

      console.log(
        "A: USDC",
        ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
      );
    });

    
  });
});
