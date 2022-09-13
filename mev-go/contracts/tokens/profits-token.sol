// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProfitToken is ERC20 {
    constructor() ERC20("Profit Token", "PROFIT") {
        _mint(msg.sender, 1000000);
    }
}
