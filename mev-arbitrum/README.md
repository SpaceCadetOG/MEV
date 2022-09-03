# MEV Arbitrum Project

1. Uniswap V3
    - Single Hop [x]
    - Multi Hop [x]
    - supply liquidity []
    - capital management []
    - Flashswap []
2. Aave
    - Supply []
    - Borrow []
    - Repay []
    - Withdraw []
    - Flashloan [x]
    - Liquidate []
3. GMX
    - Swap Tokens for Tokens [x]
    - Swap ETH for Tokens [x]
    - Swap Tokens for ETH [x]
    - Leverage Trade [] *keep getting 'PositionRouter: invalid msg.value'*
    - GLP []
    - Liquidate []
4. Sushi
    - Swap []
    - CrossChain-Swap []

5. Sperax

6. Paraswap
    - Swap []
    - CrossChain-Swap []



Nitro Update => Post 8-31-22 (https://github.com/NomicFoundation/hardhat/issues/2995)
-Review *hardhat.config.js file in networks* 
1. hh node --fork https://arb1.arbitrum.io/rpc --fork-ignore-unknown-tx-type true
2. hh test --network local test/chainlink/getPrice.test.js 
3. hh test --network local test/uniswap/uniswap-v3-twap.test.js 
4. hh test --network local test/uniswap/uniswap-v3-swap.test.js
5. hh test --network local test/aave/aave-v3.test.js 
6. hh test --network local test/aave/aave-v3-flashloan.test.js
7. hh test --network local test/gmx/usingGMX.test.js 
8. hh test --network local test/arbitum-nitro-plays/aave-v3-flashloan.test.js