import { useEffect } from "react";
import { useDispatch } from "react-redux";
import config from "../config.json";

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadExchange,
  loadTokens,
} from "../store/interactions";
import Balance from "./Balance";
import Markets from "./Markets";

import Navbar from "./Navbar";

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    // Connect Ethers to blockchain
    const provider = loadProvider(dispatch);

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch);

    // Reload page when network changes
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    // Fetch current account & balance from Metamask when changed
    window.ethereum.on("accountsChanged", () => {
      loadAccount(provider, dispatch);
    });

    // Load token smart contracts

    const MEV = config[chainId].MEV;
    const WETH = config[chainId].WETH;
    const DAI = config[chainId].DAI;
    const EXCHANGE = config[chainId].exchange;

    await loadTokens(provider, [MEV.address, WETH.address], dispatch);
    await loadTokens(provider, [MEV.address, DAI.address], dispatch);

    // Load exchange smart contract
    const exchangeConfig = EXCHANGE;
    await loadExchange(provider, exchangeConfig.address, dispatch);

  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      <Navbar />

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {<Markets />}

          {<Balance />}

          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;
