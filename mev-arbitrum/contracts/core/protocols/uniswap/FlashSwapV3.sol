//SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
// https://www.youtube.com/watch?v=eM4UidkvB-o&t=2124s

contract FlashSwapV3 {
    // 1) swap eth for weth

    // 2) swap eth for usdc

    // 3) swap eth for wbtc

    // This example swaps DAI/WETH9 for single path swaps and DAI/USDC/WETH9 for multi path swaps.

    ISwapRouter public swapRouter;
}
