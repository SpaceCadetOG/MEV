# Improve Checklist

## Arbitrage
1. Calculate what the fee and gas price will be each block
         - 0.3% * amountIn
        - 0.05 * amountIn
        - 1 * amountIn
2. Create Aggregator
    - get the most amount in pool
        - 0.3
        - 0.05
        - 1
3. Redo Exchange Rate != implied Rate
    - Each Token should have a rate and multi paths
    - Compare each path to find profit
4. Create Paths => [A + B] [A + C] [B + C]
    1. Sell A for B -> Buy C w/ A -> Sell C for A
    2. Sell A for C -> Buy B w/ C -> Sell B for A
    3. Sell A -> C
    4. Profitable Paths
5. 