# Sample Hardhat Project

[] Uniswap V3
    - swap  [x]
    - supply liquidity []
    - capital management []
    - Flashswap []
[] Aave
    - Supply []
    - Borrow []
    - Repay []
    - Withdraw []
    - Flashloan [x]
    - Liquidate []
[] GMX
    - Swap [x]
    - Leverage []
    - GLP []
    - Liquidate []
[] Sushi
    - Swap []
    - CrossChain-Swap []

[] Paraswap
    - Swap []
    - CrossChain-Swap []

[] MyCelium
    - Swap []
    - Leverage []
    - MLP []
    - Liquidate []

[] Sperax
    - Swap []
    - Leverage []
    - MLP []
    - Liquidate []



Nitro Update => Post 8-31-22 (https://github.com/NomicFoundation/hardhat/issues/2995)
1. hh node --fork https://arb1.arbitrum.io/rpc --fork-ignore-unknown-tx-type true
2. hh test --network local test/chainlink/getPrice.test.js 
3. hh test --network local test/uniswap/uniswap-v3-twap.test.js 
4. hh test --network local test/uniswap/uniswap-v3-swap.test.js
5. hh test --network local test/aave/aave-v3.test.js 
6. hh test --network local test/aave/aave-v3-flashloan.test.js
7. hh test --network local test/gmx/usingGMX.test.js 
8. hh test --network local test/arbitum-nitro-plays/aave-v3-flashloan.test.js