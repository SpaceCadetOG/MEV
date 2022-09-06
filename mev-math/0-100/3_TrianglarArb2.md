# Triangular Arbitrage 2

balanceBefore = ¥100,000,000,000

- Chicago: ¥82/$
- Singapore: $1.60/SGD
- China: ¥128/SGD

1. Use ¥128/SGD as the price we are comparing to calculate arbPrice
```
exchangeRate = S(¥128/SGD)
arbRate = S(¥82/$) / S($1.60/SGD)

require => Check list
[x] (arbRate < exchangeRate == true) = Arbitrage
[x] (arbRate = exchangeRate != true) = Arbitrage
[x] (arbRate != exchangeRate = true) = Arbitrage


a) S(¥128/SGD) != S(¥82/$) / S($1.60/SGD)
b) S(¥128/SGD) != S(¥131.2/SGD)

We have a Arb!
```

2. Find Best path and number of paths that are profitable.
```
Pay Lowest Cost first

1) Sell ¥100,000,000 @ ¥128/SGD for 781,250 SGD
2) Sell 781,250 SGD @ $1.60/SGD for $1,250,000
3) Sell $1,250,000 @ ¥82/$ for ¥102,500,000,000

--> do this with ¥100,000,000,000 converted to USD and SGD to find other profitable paths
--> capture the most out this arbtrarge before it leaves

```

3. Calculate profits.
```
require(afterBalance - beforeBalance)

¥102,500,000 - ¥100,000,000
profit = ¥2,500,000
```



[Watch this video to reinforce](https://www.youtube.com/watch?v=lKu2LAgEcpU)


