// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.0;
import "../protocols/uniswap/SingleSwapV3.sol";
import "../protocols/uniswap/MultiSwapV3.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// Arbitrager
contract Runner {
    address public admin;

    AggregatorV3Interface internal chainlink_eth =
        AggregatorV3Interface(0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612);

    struct Asset {
        address token; // change to address
        address exchange;
    }

    mapping(string => Asset) public assets;

    constructor() {
        admin = msg.sender;
    }

    modifier AdminOnly() {
        require(msg.sender == admin, "NOT ADMIN");
        _;
    }

    // function setAssets(Asset[] calldata _assets) external AdminOnly {
    //     for (uint256 i = 0; i < _assets.length; i++) {
    //         assets[_assets[i].token] = Asset(
    //             _assets[i].token,
    //             _assets[i].exchange
    //         );
    //     }
    // }

    function getLatestPriceETH() public view returns (uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = chainlink_eth.latestRoundData();
        // for ETH / USD price is scaled up by 10 ** 8
        return uint256(price / 1e8);
    }

    function TradePotential(string calldata _token, uint256 _date) external {
        Asset storage asset = assets[_token];
        require(asset.exchange != address(0), "NON-EXISTENT");

        // if there is a price, trade on the dex
        // import dex contract
        Dex exchangeA = Dex(asset.exchange);
        Dex exchangeB = Dex(asset.exchange);
        uint256 exchangeAPrice = 1775;
        uint256 exchangeBPrice = 1773;

        // uint amount = 1 ether / exchangePrice
        // if else for BUY/SELL

        if (
            exchangeAPrice >= getLatestPriceETH() ||
            exchangeBPrice <= getLatestPriceETH()
        ) {
            exchangeB.buy();
            exchangeA.sell();
        } else if (
            exchangeBPrice >= getLatestPriceETH() ||
            exchangeAPrice <= getLatestPriceETH()
        ) {
            exchangeA.buy();
            exchangeB.sell();
        }
    }
}

// uniswap v3 + gmx
contract Dex {
    mapping(address => uint256) private prices;

    // uniswap v3 || gmx

    function getPrice(address _token) external view returns (uint256 price) {
        price = prices[_token];
        return price;
    }

    function buy() external {
        // buy token
    }

    function sell() external {
        // sell token
    }
}
