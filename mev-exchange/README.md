# MEV Exchange
MEV Protection Exchange

- *run node* =>

1. npx hardhat node 

- *test* =>

1. npx hardhat test --network local 
2. npx hardhat coverage

- *deploy* =>

1. npx hardhat run --network local scripts/1_deploy.js
2. npx hardhat run --network local scripts/2_interaction_exchange.js

