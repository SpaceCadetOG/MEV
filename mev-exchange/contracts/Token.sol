// SPDX-License-Identifier: ME
pragma solidity ^0.8.0;

contract Token {
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public decimals;
    mapping(address => uint256) public balance;
    mapping(address => mapping(address => uint256)) public allowance;
    address owner = msg.sender;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

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
        balance[msg.sender] = totalSupply;
    }

    // modifier ownerOnly() {
    //     require(msg.sender == owner, "NotOwner");
    //     _;
    // }

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        _balance = balance[_owner];
        return _balance;
    }

    function transfer(address _to, uint256 _amount)
        public
        returns (bool success)
    {
        require(balance[msg.sender] >= _amount, "insufficent funds");
        _transfer(msg.sender, _to, _amount);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool success) {
        require(balance[_from] >= _amount, "insufficent funds");
        require(allowance[_from][_to] >= _amount, "allowance to spend low");
        allowance[_from][_to] = allowance[_from][_to] - _amount;
        _transfer(_from, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _amount)
        public
        returns (bool success)
    {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal returns (bool success) {
        require(_to != address(0));
        balance[_from] = balance[_from] - _amount;
        balance[_to] = balance[_to] + _amount;
        emit Transfer(_from, _to, _amount);
    }
}
