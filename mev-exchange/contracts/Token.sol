// SPDX-License-Identifier: ME
pragma solidity ^0.8.0;

contract Token {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public decimals;
    mapping(address => uint256) public balance;

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
        balance[address(this)] = totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        _balance = balance[_owner];
        return _balance;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {}
}
