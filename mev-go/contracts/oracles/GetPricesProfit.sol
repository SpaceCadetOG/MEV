// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
import "./IProfitOracle.sol";

contract GetPricesProfit {
    IProfitOracle public oracle;

    constructor(address _oracle) {
        oracle = IProfitOracle(_oracle);
    }

    function GetPrices() external view {
        bytes32 key = keccak256(abi.encodePacked("BTC/USD"));

        (bool result, uint timestamp, uint data) = oracle.getData(key);
        require(result == true, "could not get price");

        require(timestamp >= block.timestamp - 1 minutes, "old price");
    }
}
