// SPDX-License-Identifier: ME
pragma solidity ^0.8.0;

contract Token {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public decimals;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _decimals,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply * (10**decimals);
    }
}
