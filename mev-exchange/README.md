# MEV Exchange

- MEV Protection Exchange

*node*
npx hardhat node --fork https://RPC_HERE

*test*
npx hardhat test --network local 
npx hardhat coverage

*deploy*
npx hardhat run --network local scripts/1_deploy.js
npx hardhat run --network local scripts/2_interaction_exchange.js

