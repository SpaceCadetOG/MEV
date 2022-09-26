//SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

// https://docs.uniswap.org/protocol/guides/swaps/single-swaps
contract MultiSwapV3 {
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

    /// @return amountIn The amountIn of DAI actually spent to receive the desired amountOut.
    function swapExactOutputMultihop(uint256 amountOut, uint256 amountInMaximum)
        external
        returns (uint256 amountIn)
    {
        // Transfer the specified `amountInMaximum` to this contract.
        TransferHelper.safeTransferFrom(
            WETH,
            msg.sender,
            address(this),
            amountInMaximum
        );
        // Approve the router to spend  `amountInMaximum`.
        TransferHelper.safeApprove(WETH, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputParams memory params = ISwapRouter
            .ExactOutputParams({
                path: abi.encodePacked(WETH, poolFee1, USDC, poolFee3, DAI),
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum
            });

        // Executes the swap, returning the amountIn actually spent.
        amountIn = swapRouter.exactOutput(params);

        // If the swap did not require the full amountInMaximum to achieve the exact amountOut then we refund msg.sender and approve the router to spend 0.
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(WETH, address(swapRouter), 0);
            TransferHelper.safeTransferFrom(
                WETH,
                address(this),
                msg.sender,
                amountInMaximum - amountIn
            );
        }
    }

}
