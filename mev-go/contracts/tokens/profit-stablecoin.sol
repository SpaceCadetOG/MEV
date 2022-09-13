// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProfitStablecoin is ERC20 {
    constructor() ERC20("Profit Bridge Token", "PROFIT") {}
}
