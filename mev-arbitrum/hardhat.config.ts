import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const AVAX = "https://api.avax.network/ext/bc/C/rpc";
const ARBI = "https://arbitrum-mainnet.infura.io/v3/defa47742dfd4a1dbc666cac6ead362f";

const config: HardhatUserConfig = {
  mocha: {
    timeout: 100000000
  },
  solidity: {
    compilers:[{version: "0.8.10"}, {version: "0.7.6"}, {version: "0.6.6"}, {version: "0.6.12"}, {version: "0.8.0"}]
  },
  networks: {
    hardhat: {
      forking: {
        // url: "https://eth-mainnet.g.alchemy.com/v2/vsFDGKdtpoZd19zlv3F7Z_x5EXTol_zr",
        url: ARBI,
      },
    },
  },
  gasReporter: {
    currency: "USD",
  },
};

export default config;
