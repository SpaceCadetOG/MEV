// SPDX-License-Identifier: ME
pragma solidity ^0.8.0;

import "./Token.sol";

contract Exchange {
    address public feeCollector;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Trade) public trades;
    mapping(uint256 => bool) public tradeCancelled;
    uint256 public tradesCount;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Trade(
        uint256 id, // will use nft later
        address user,
        address token1,
        uint256 amount,
        address token2,
        uint256 amountGive,
        uint256 time
    );

    event Cancel(
        uint256 id, // will use nft later
        address user,
        address token1,
        uint256 amount,
        address token2,
        uint256 amountGive,
        uint256 time
    );

    struct _Trade {
        uint256 id; // will use nft later
        address user;
        address token1;
        uint256 amount;
        address token2;
        uint256 amountGive;
        uint256 time;
    }

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

    // make trade
    function makeTrade(
        address token1, // buy
        uint amount,
        address token2, // sell
        uint256 amountGive
    ) public {
        require(
            user_balance(token2, msg.sender) >= amountGive,
            "must deposit more to make trade"
        );
        tradesCount = tradesCount + 1;
        trades[tradesCount] = _Trade(
            tradesCount,
            msg.sender,
            token1,
            amount,
            token2,
            amountGive,
            block.timestamp
        );
        emit Trade(
            tradesCount,
            msg.sender,
            token1,
            amount,
            token2,
            amountGive,
            block.timestamp
        );
    }

    // cancel order
    function cancelTrade(uint id) public {
        _Trade storage _trade = trades[id];
        require(_trade.id == id, "invalid id");
        require(address(_trade.user) == msg.sender, "invalid owner");
        tradeCancelled[id] = true;
        emit Cancel(
            _trade.id,
            msg.sender,
            _trade.token1,
            _trade.amount,
            _trade.token2,
            _trade.amountGive,
            block.timestamp
        );
    }

    // brokerTrade
    function brokerTrade(uint id) public {
        // fetch trade
        _Trade storage _trade = trades[id];
        // swap tokens
        _brokerTrade(
            _trade.id,
            _trade.user,
            _trade.token1,
            _trade.amount,
            _trade.token2,
            _trade.amountGive
        );
    }

    function _brokerTrade(
        uint orderId,
        address user,
        address token1,
        uint amount,
        address token2,
        uint amountGive
    ) internal {}
    // charge fee
}
