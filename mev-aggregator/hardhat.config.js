require("@nomicfoundation/hardhat-toolbox");
const AVAX = "https://api.avax.network/ext/bc/C/rpc";
const ARBI =
  "https://arbitrum-mainnet.infura.io/v3/defa47742dfd4a1dbc666cac6ead362f";
  const ETH = "https://eth-mainnet.g.alchemy.com/v2/_mGa3DmfiBOUCy58oTMRpYgK8ni9gHJy"

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      forking: {
        url: ETH,
      },
    },
  },
};
