# Exchange Rate

### _Price of 1 curren$y of another curren$y_

> ex: 1 GBP = 1.30 USD

## 2 Quote Prices

### Direct Quote (American)

1. Foreign to Domestic
   - 1 euro => 1.12 usd
   - 1 eth => 0.083 btc

### Indirect Quote (European)

1. Domestic to Foreign
   - 1 usd => 0.89 euro
   - 1 btc => 12.06 weth

### _Quote Calculations_

    To get the price solve for S

    S(j/k) = Price of unit in base curren$y

    S = Spot Price(solving for)
    j = units in curren$y
    k = base curren$y (constant)

    1. [S(j/k) * S(k/j)]
    2. [S(j/k) \ S(j/k)]
    3. [S(k/j) \ S(k/j)]

## Calculate Cross-Exchange

IRate = Indirect Quote
DRate = Direct Quote

1. IRate * DRate (Multiple Indirect Quote by Direct Quote)
2. IRate / IRate (Divide Indirect Quote by Indirect Quote)

Example

1. ETH/LINK
2. UNI/MAKER
3. AAVE/WBTC

- _Use USDC or DAI as k value_

>[S(eth/usdc) * S(usdc/link)] or [S(eth/usdc) \ S(link/usdc)] or [S(usdc/eth) \ S(usdc/link)]

>[S(uni/dai) * S(dai/maker)] or [S(maker/dai) \ S(uni/dai)] or [S(dai/uni) \ S(dai/maker)]

>[S(aave/usdc) * S(wbtc/link)] or [S(wbtc/usdc) \ S(aave/usdc)] or [S(usdc/aave) \ S(usdc/wbtc)]


*Suggest You Do The examples to get decent at seeing the equations in co*


[Watch this playlist to reinforce](https://youtube.com/playlist?list=PLeMy3dkt4g9l-NI6L91U3K4XpelLgFmAv)
