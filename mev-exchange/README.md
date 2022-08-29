# MEV Exchange

- This will handle exchange of index tokens


```


*node*
npx hardhat node --fork https://RPC_HERE

*deploy*
npx hardhat run --network local scripts/1_deploy.js

*test*
npx hardhat test --network local test/token.test.js 
npx hardhat test --network local test/exchange.test.js