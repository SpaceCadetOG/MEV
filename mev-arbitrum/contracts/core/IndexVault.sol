// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.0;


// index fund and S&P 500
// gain exposure to top 5 tokens on chain

contract IndexVault {
    mapping(address => uint) public balances;
    uint256 internal commission;

    constructor() {
        calculatePricePerToken();
    }

    function balanceOf() external view returns (uint) {
        return balances[msg.sender];
    }

    function contractBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getPriceOfAllTokens() public {}

    function calculatePricePerToken() public {}

    function buyToken(uint amount) external {
        // require user amount it enough to buy
    }

    function priceIncrease() public {
        //
    }

// redeem for rewards
    function redeemToken(uint amount) public {
        // require user amount it enough to buy
    }

    function setCommission() external {
        //
    }

    receive() external payable {

// deposit 3 ether +> fund will split allocate and split

    }
}
// eth: uni || maker || sEth(lido) || aave || compound
// arbitrum: uni || gmx || sushi || aave || radiant
// avax: joe || gmx || sAvax(benqi) || aave || ptp
