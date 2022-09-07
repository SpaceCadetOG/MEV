# OEV => Oracle Extracted Value

_With ETH 2.0 moving to Proof of Stake, MEV will have some changes. On way of extracting value which can be from oracles. In this repo i will be creating research how to capture mev using oracles. Also noticed chainlink has a stronghold on the ecosystem. Could that potential be a weak point. How can value be capture and how could we mitigate single point of failure. Should all protocols create proprietary oracle while using chainlink as a fallback?_

[refer to this article](https://medium.com/@nfett/on-oracle-extractable-value-f6c7a0d64af5)

## Research Goals
1. Post-Merge 
    - *Capture Arbs using FIFO model*
        - Local Node Set Up vs Using Third Party Node
            - Latency Test
            - cost of doing it and scaling
        - Gas-Optimize -> Yul and Assembly

 ##   *Relationships w/ Validator*
        - Track the increasing # of validators over 1 year
            - Tier based on activity and particpation
        - ETH burned post EIP-1559, how does that incentives vaildator economics post-merge?
        -   When unstaking starts, will it cause network traffic? Will it dilute the system?
        - Will the network hold up with more transactions coming
        - Could developing a relationship w/ Validator help w/ long-tail?
            - Minimize broadcasting plays?

## *Maximize profits*
        - Time -> Oracle
            - Time of Day Most profit per trade
            - Time of Day trade happen most
            - Best time To trade
        - Reflexivity Playbook
            - Scale w/ the network
            - Boom / Bust -> React to what is onchain 

  ## *Getting Prices from OnChain Liquidity VS Chainlink Oracle*

  ##  *Can Chainlink Break All blockchains? Is It a Single Point of failure?*
    1. Why All protocols should create their own oracles based on liquidty on platform
    2. Use Chainlink as a Fallback

## Oracle Manplation and Front-running
    - If chainlink doesnt update?

## TWAP oracle
    - Constant Product vs Constant Product

## MEV on L2
    - Deep Dive into the Tech
        - When L1 is Congested?
            - Does L2 slow down too?
        - L2 Sequencers
            - Where can we find value 
    - Who winning the race after 1 year
        - [based on tech, user transactions, tvl]

## Will Protocols start to adopting MEV protection? 
    - If so that may require some fee.
    - Does that help or hurt the ecosystem?

## 1Inch and Paraswap vs ME
    - Who saves more money
    - Who has faster trades

    *This is for serious defi trader not for degen*


[triangular arbitrage analysis article](https://blog.coinbase.com/quantitative-crypto-insight-an-analysis-of-triangular-arbitrage-transactions-in-uniswap-v2-1b572284bfa8)
