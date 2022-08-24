// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

import "hardhat/console.sol";

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

contract LetsSwap {
    // refund Eth
    address public WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    IUniswapRouter public swapV3;
    IQuoter public quoter;

    uint24 public poolFee = 3000;

    constructor() {
        swapV3 = IUniswapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
        quoter = IQuoter(0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6);
    }

    function quoteETHtoDAI(uint256 amount) external payable returns (uint256) {
        return (
            quoter.quoteExactOutputSingle({
                tokenIn: WETH,
                tokenOut: DAI,
                fee: 500, // 0.05
                amountOut: amount,
                sqrtPriceLimitX96: 0
            })
        );
    }

    function ETHtoExactDAIAmount(uint256 amount, uint256 _deadline)
        external
        payable
        returns (uint256 amountIn)
    {
        require(msg.value > 0, "ETH greater than 0");
        require(amount > 0, "amount in dai greater than 0");

        ISwapRouter.ExactOutputSingleParams memory _params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: WETH,
                tokenOut: DAI,
                fee: poolFee,
                recipient: msg.sender,
                deadline: _deadline,
                amountOut: amount,
                amountInMaximum: msg.value,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapV3.exactOutputSingle{value: msg.value}(_params);

        if (amountIn < msg.value) {
            swapV3.refundETH();
            (bool success, ) = msg.sender.call{value: address(this).balance}(
                ""
            );
            require(success, "Refund Failed");
        } else {}
    }

    function quoteETHtoUSDC(uint256 amount) external payable returns (uint256) {
        return (
            quoter.quoteExactOutputSingle({
                tokenIn: WETH,
                tokenOut: USDC,
                fee: 500, // 0.05
                amountOut: amount,
                sqrtPriceLimitX96: 0
            })
        );
    }

    function ETHtoExactUSDCAmount(uint256 amount, uint256 _deadline)
        external
        payable
        returns (uint256 amountIn)
    {
        require(msg.value > 0, "ETH greater than 0");
        require(amount > 0, "amount in dai greater than 0");

        ISwapRouter.ExactOutputSingleParams memory _params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: WETH,
                tokenOut: USDC,
                fee: poolFee,
                recipient: msg.sender,
                deadline: _deadline,
                amountOut: amount,
                amountInMaximum: msg.value,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapV3.exactOutputSingle{value: msg.value}(_params);

        if (amountIn < msg.value) {
            swapV3.refundETH();
            (bool success, ) = msg.sender.call{value: address(this).balance}(
                ""
            );
            require(success, "Refund Failed");
        } else {}
    }
}
