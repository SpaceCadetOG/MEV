const kyberMainnet = require('./kyber-mainnet.json');
const aaveMainnet = require('./aave.json');
const uniswapMainnet = require('./uniswap-mainnet.json');
const joeMainnet = require('./traderjoe-mainnet.json');
const pngMainnet = require('./pangolin-mainnet.json');
const dydxMainnet = require('./dydx-mainnet.json');
const tokensMainnet = require('./tokens-mainnet.json');

module.exports = {
  mainnet: {
    kyber: kyberMainnet,
    aave: aaveMainnet,
    uniswap: uniswapMainnet,
    joe: joeMainnet,
    png: pngMainnet,
    dydx: dydxMainnet,
    tokens: tokensMainnet
  }
};
