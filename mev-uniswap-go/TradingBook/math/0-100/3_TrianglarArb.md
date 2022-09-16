# Triangular Arbtrage

### _Price of a implied cross-rate @ direct-rate != quote-rate_

```
> ex: We Are investing $1000 and £500

- > London: $1.5/£
- > NY: €1.2/$
- > Amsterdam: €2.0/£

```

### Steps:
1. Compute impliedRate = quote-rate
2. Compare route against the quoted rate in amsterdam

   - _reason we use amsterdams rate is because we get more of USD by trading_ GBP for EURO and back to USD

   - check if impliedRate != exchangeRate

     - (impliedRate > exchangeRate == true) = Arbitrage
     - (impliedRate < exchangeRate == true) = Arbitrage
     - (impliedRate = exchangeRate == true) != Arbitrage
     - (impliedRate = exchangeRate != true) = Arbitrage
3. Identify The Sequence of transactions for trade
    - Calculate Profit
    - Subtract Fees
    - Net Profit
    - Pass/Fail Different routes
4. Buy Low Sell High w/ the goal to end with more
    - Require startBalance to be less than endBalance
    - currensy used start w/ should be the one we end with
```
londonPrice = $1.50
nyPrice = £1.20
amsterdamPrice = €2.00

1. Use €2.0/£ as the price we are comparing to calculate arbPrice

arbPrice = S(€/£) or impliedRate

arbPrice = S(£1 * nyPrice / $1) * S($1 * londonPrice / £1) => S(nyPrice x londonPrice) = 1.8

*Note That usd cancels out when doing this math. look up algebra equations for more details*
=================================================================
2. Compare arbRate to quoteRate or exchangeRate 
arbPrice = 1.8
exchangeRate = amsterdamPrice (2.0) 

     [x] (arbRate < exchangeRate == true) = Arbitrage
     [x] (arbRate = exchangeRate != true) = Arbitrage
     [x] (arbRate != exchangeRate = true) = Arbitrage

=================================================================
3. How do we get there. Find Best path and number of paths.
We want to buy low and sell high
    -> Must get back $1000 back
    -> Find path to recieve more than before


balanceBefore = $1000
path = $ => £ => €

*do above equation to solve*
a) Sell $ for £ at London
{
    $1000 \ S(londonPrice / £1) = £666.67
}

b) Sell £ for € at Amsterdam
{
    £666.67 * S(amsterdamPrice / €1) = €1,333,33
}

C) Sell € for $ at New York
{
    €1333,33 \ S(nyPrice / £1 ) = $1,111.11
}
D) Calculate Profit
afterBalance = $1,111.11
afterBefore - balanceBefore = $111.11

*This does not take into account fees. but if profit is big enough it should cover the fees paid*

--> Try using £500 
--> Try using Reverse Paths for both...hint you wont like it
=================================================================

```

[Watch this playlist to reinforce](https://youtube.com/playlist?list=PLeMy3dkt4g9l-NI6L91U3K4XpelLgFmAv)