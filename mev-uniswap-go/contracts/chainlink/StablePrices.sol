// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// change to arbitrum
contract StablePrices {
    AggregatorV3Interface internal usdc;
    AggregatorV3Interface internal usdt;
    AggregatorV3Interface internal dai;
    AggregatorV3Interface internal mim;
    AggregatorV3Interface internal frax;

    constructor() {
        // ETH / USD
        usdc = AggregatorV3Interface(
            0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3
        );
        usdt = AggregatorV3Interface(
            0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3
        );
        dai = AggregatorV3Interface(0xc5C8E77B397E531B8EC06BFb0048328B30E9eCfB);
        mim = AggregatorV3Interface(0x87121F6c9A9F6E90E59591E4Cf4804873f54A95b);
        frax = AggregatorV3Interface(
            0x0809E3d38d1B4214958faf06D8b1B1a2b73f2ab8
        );
    }

    function getLatestPriceUSDC() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = usdc.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return price / 1e8;
    }

    function getLatestPriceUSDT() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = usdt.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return price / 1e8;
    }

    function getLatestPriceDAI() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = dai.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return price / 1e8;
    }

    function getLatestPriceMIM() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = mim.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return price / 1e8;
    }

        function getLatestPriceFRAX() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = frax.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return price / 1e8;
    }
}
