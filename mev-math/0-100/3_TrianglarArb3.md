# Triangular Arbitrage 3 - DeFi Example

balanceBefore = 1 ETH

- Uniswap V3: 1 ETH / 2000 USDC
- Sushi: 5 USDC / 1 UNI
- GMX: 300 UNI / 1 ETH

1. Use UNI / WETH as the price we are comparing to calculate arbPrice
```
exchangeRate = S(300 UNI / 1 ETH) on GMX

arbRate = S(1 ETH / 2000 USDC) * S(5 USDC / 1 UNI)
S(5/2000) = S(1 ETH / 400 UNI)

require => Check list
[x] (arbRate < exchangeRate == true) = Arbitrage
[x] (arbRate = exchangeRate != true) = Arbitrage
[x] (arbRate != exchangeRate = true) = Arbitrage

S(300 UNI / 1 ETH) != S(1 ETH / 400 UNI)
We have a Arb!
```

2. Find Best path and number of paths that are profitable.
```
Pay Lowest Cost first

path1 => uniswap -> sushi -> gmx
1) Swap 1 eth @ 2000 usdc on Uniswap
2) Swap 2000 usdc for 400 uni on Sushi
3) Swap 400 uni for 1.33 eth on GMX
profit = .33 eth 

path2 => gmx -> sushi -> uniswap
1) Swap 1 eth @ 300 uni on GMX
2) Swap 300 uni for 1500 usdc on Sushi
3) Swap 300 uni for 0.75 eth on uniswap

profit = -0.25 eth 
--> capture the most out this arb before it leaves


```

3. Calculate profits.
```
require(afterBalance - beforeBalance)

¥102,500,000 - ¥100,000,000
profit = ¥2,500,000
```

*This does not take into account fees. but if profit is big enough it should cover the fees paid*

Considerations
- Gas per Transactions
- swap fees
- slippage
- network congestion

[Watch this video to reinforce](https://www.youtube.com/watch?v=kdua-L7yZkw)


