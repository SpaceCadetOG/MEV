// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// change to arbitrum
contract ArbitrumPrices {
    AggregatorV3Interface internal eth;
    AggregatorV3Interface internal avax;
    AggregatorV3Interface internal btc;

    constructor() {
        // ETH / USD
        eth = AggregatorV3Interface(0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612);
        avax = AggregatorV3Interface(
            0x8bf61728eeDCE2F32c456454d87B5d6eD6150208
        );
        btc = AggregatorV3Interface(0x6ce185860a4963106506C203335A2910413708e9);
    }

    function getLatestPriceETH() public view returns (uint) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = eth.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return uint256(price / 1e8);
    }

    function getLatestPriceAVAX() public view returns (uint) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = avax.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return uint(price / 1e8);
    }

    function getLatestPriceBTC() public view returns (uint) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = btc.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return uint(price / 1e8);
    }
}

