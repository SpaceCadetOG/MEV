// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract IndexFund {
    mapping(address => uint256) public balances;

    AggregatorV3Interface public uniPriceAgg =
        AggregatorV3Interface(0x9C917083fDb403ab5ADbEC26Ee294f6EcAda2720);
    AggregatorV3Interface public makerPriceAgg =
        AggregatorV3Interface(0xdE9f0894670c4EFcacF370426F10C3AD2Cdf147e);
    AggregatorV3Interface public compPriceAgg =
        AggregatorV3Interface(0xe7C53FFd03Eb6ceF7d208bC4C13446c76d1E5884);
    AggregatorV3Interface public crvPriceAgg =
        AggregatorV3Interface(0xaebDA2c976cfd1eE1977Eac079B4382acb849325);
    AggregatorV3Interface public aavePriceAgg =
        AggregatorV3Interface(0xaD1d5344AaDE45F43E596773Bcc4c423EAbdD034);
    int256 public uniPrice;
    int256 public makerPrice;
    int256 public compPrice;
    int256 public crvPrice;
    int256 public aavePrice;

    uint256 public pricePerToken;

    constructor() {
        calculatePricePerToken();
    }

    function balanceOf(address user) public view returns (uint256) {
        return balances[user];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}

    function getPriceOfAllCoins() public {
        (, int256 uniPrice1, , , ) = uniPriceAgg.latestRoundData();
        (, int256 makerPrice1, , , ) = makerPriceAgg.latestRoundData();
        (, int256 compPrice1, , , ) = compPriceAgg.latestRoundData();
        (, int256 crvPrice1, , , ) = crvPriceAgg.latestRoundData();
        (, int256 aavePrice1, , , ) = aavePriceAgg.latestRoundData();

        uniPrice = uniPrice1;
        makerPrice = makerPrice1;
        compPrice = compPrice1;
        crvPrice = crvPrice1;
        aavePrice = aavePrice1;
    }

    function calculatePricePerToken() public {
        getPriceOfAllCoins();
        pricePerToken = uint256(
            uniPrice *
                500 +
                makerPrice *
                1 +
                compPrice *
                10 +
                crvPrice *
                300 +
                aavePrice *
                100
        );
    }

    function buyToken(uint256 amount) public payable {
        require(msg.value >= amount * pricePerToken, "not enough bro");
        balances[msg.sender] += amount;
    }

    // simulate
    function defiIncreased() public {
        pricePerToken = pricePerToken * 2;
    }

    function redeemToken() public {
        uint256 amountOfTokens = balances[msg.sender];
        uint256 amountInWeiToTransfer = amountOfTokens * pricePerToken;
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amountInWeiToTransfer);
    }
}
