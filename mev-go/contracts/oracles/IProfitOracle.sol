// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IProfitOracle {
    function getData(bytes32 key)
        external
        view
        returns (
            bool result,
            uint date,
            uint payload
        );
}
