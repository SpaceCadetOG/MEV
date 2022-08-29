// SPDX-License-Identifier: ME
pragma solidity ^0.8.0;

import "./Token.sol";

contract Exchange {
    address public feeCollector;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    constructor(address _feeCollector, uint _feePercent) {
        feeCollector = _feeCollector;
        feePercent = _feePercent;
    }

    // deposit
    function deposit(address _token, uint _amount) public {
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // withdraw
    function withdraw(address _token, uint _amount) public {
        require(tokens[_token][msg.sender] >= _amount);
        Token(_token).transfer(msg.sender, _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // balances
    function user_balance(address _token, address user)
        public
        view
        returns (uint)
    {
        return tokens[_token][user];
    }
    // make order
    // cancel order
    // fill order
    // charge fee
}
