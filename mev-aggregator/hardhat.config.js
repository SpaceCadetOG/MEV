require("@nomicfoundation/hardhat-toolbox");
const AVAX = "https://api.avax.network/ext/bc/C/rpc";
const ARBI =
  "https://arbitrum-mainnet.infura.io/v3/defa47742dfd4a1dbc666cac6ead362f";
  const ETH = "https://eth-mainnet.g.alchemy.com/v2/_mGa3DmfiBOUCy58oTMRpYgK8ni9gHJy"

module.exports = {
  solidity: {
    compilers:[{version: "0.8.10"}, {version: "0.7.6"}, {version: "0.6.6"}, {version: "0.6.12"}, {version: "0.8.0"}, {version: "0.8.4"}, {version: "0.8.0"}]
  },
  networks: {
    hardhat: {
      forking: {
        url: AVAX,
      },
    },
  },
};
