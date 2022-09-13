// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;

// Contract finish => https://pro.eattheblocks.com/courses/1138851/lectures/24439196
contract Liquidity {
    // like a lending protocol
    // liquidity Mining
    // staking
    // earn profit token: usdc => profitUsdc || dai => profitDai ... Like a Intrest-Earning token
    // ex) 1. deposit asset (dai) into Liquidity ||  2. earn profit fee in supply asset (profitDai) || 3. withdraw asset(dai) and redeem (profitDai => add to balance)

    function deposit(address asset, uint amount) external {}

    function withdraw(address asset, uint amount) external {}

    function payRewards(address reciever) external {}

    // potential flashloan feature that only for trader and liquidatior... free depositor. Flashloaner will recieve no rewards for or profit fee in that block

    // flashloan easter egg -> borrow the amount of collateral you have to in pool to add to trader
}
