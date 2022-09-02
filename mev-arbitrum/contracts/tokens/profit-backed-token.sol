// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "contracts/oracles/profits/profit-oracle.sol";
contract ProfitBackedToken is ERC20 {
    IERC20 public profitToken;
    // get price from oracle chainlink

    constructor(address _profitToken) ERC20("Profit Backed Token", "PROFIT") {
        profitToken = IERC20(_profitToken);
    }
}
