//SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

// https://docs.uniswap.org/protocol/guides/swaps/single-swaps
contract tradingTriangles {
    // 1) swap eth for weth

    // 2) swap eth for usdc

    // 3) swap eth for wbtc

    // This example swaps DAI/WETH9 for single path swaps and DAI/USDC/WETH9 for multi path swaps.
    address public constant DAI = 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1;
    address public constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address public constant USDC = 0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8;

    uint24 public constant poolFee1 = 3000;
    uint24 public constant poolFee2 = 10000;
    uint24 public constant poolFee3 = 500;

    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IQuoter public constant quoter =
        IQuoter(0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6);

    function quoteETHtoDAI(uint256 amountIn, uint24 fee)
        external
        payable
        returns (uint256)
    {
        return (quoter.quoteExactInputSingle(WETH, DAI, fee, amountIn, 0));
    }

    function quoteDAItoETH(uint256 amountOut, uint24 fee)
        public
        payable
        returns (uint256)
    {
        return (quoter.quoteExactOutputSingle(WETH, DAI, fee, amountOut, 0));
    }

    function quoteUSDCtoETH(uint256 amountIn)
        external
        payable
        returns (uint256)
    {
        return (quoter.quoteExactOutputSingle(WETH, USDC, 500, amountIn, 0));
    }

    function quoteETHtoUSDC(uint256 amountIn)
        external
        payable
        returns (uint256)
    {
        return (quoter.quoteExactInputSingle(WETH, USDC, 500, amountIn, 0));
    }

    function swapExactInputSingle(
        uint24 fee,
        address tokenIn,
        uint256 amountIn,
        address tokenOut
    ) external returns (uint256 amountOut) {
        // msg.sender must approve this contract

        // Transfer the specified amount of DAI to this contract.
        TransferHelper.safeTransferFrom(
            tokenIn,
            msg.sender,
            address(this),
            amountIn
        );

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputSingle(
        uint24 fee,
        address tokenIn,
        uint256 amountOut,
        address tokenOut,
        uint256 amountInMaximum
    ) external returns (uint256 amountIn) {
        // Transfer the specified amount of DAI to this contract.
        TransferHelper.safeTransferFrom(
            tokenIn,
            msg.sender,
            address(this),
            amountInMaximum
        );

        // Approve the router to spend the specified `amountInMaximum` of DAI.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to achieve a better swap.
        TransferHelper.safeApprove(WETH, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: fee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = swapRouter.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(WETH, address(swapRouter), 0);
            TransferHelper.safeTransfer(
                tokenIn,
                msg.sender,
                amountInMaximum - amountIn
            );
        }
    }

    function swapExactInputMultihop(uint256 amountIn)
        external
        returns (uint256 amountOut)
    {
        // Transfer `amountIn` of DAI to this contract.
        TransferHelper.safeTransferFrom(
            WETH,
            msg.sender,
            address(this),
            amountIn
        );

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(WETH, address(swapRouter), amountIn);

        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: abi.encodePacked(WETH, poolFee3, USDC, poolFee3, DAI),
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0
            });

        // Executes the swap.
        amountOut = swapRouter.exactInput(params);
    }

    // get token pairs
    // get pool reserves
    // use twap
    // calculate potential trades
}
// DAI/ETH + USDC/ETH

// Borrow (amountIn = DAI for 1 WETH in 0.05)
// swap DAI for 1 WETH in 0.05 => 1571.88 dai
// swap 1 WETH for USDC in 1 => 1575.35 usdc
// swap 1575.35 usdc for WETH in 0.3 => should be slightly greaterThan 1 weth
// swap 1 WETH for Dai in 0.3 =>  1574.87 dai
// payback 1571.88 dai + loanFee
// take WETH profit
// take 2.99 dai profit
