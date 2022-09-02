import { useDispatch, useSelector } from "react-redux";
import config from "../config.json";
import { loadTokens } from "../store/interactions";

const Markets = () => {
  const dispatch = useDispatch();
  const chainId = useSelector((state) => state.provider.chainId);
  const provider = useSelector((state) => state.provider.blockchain);
  const marketHandler = async (e) => {
    loadTokens(provider, e.target.value.split(","), dispatch);
  };
  return (
    <div className="component exchange__markets">
      <div className="component__header">
        <h2>Select Market</h2>
      </div>

      {chainId && config[chainId] ? (
        <select name="markets" id="markets" onChange={marketHandler}>
          <option
            value={`${config[chainId].MEV.address},${config[chainId].WETH.address}`}
          >
            MEV / WETH
          </option>
          <option
            value={`${config[chainId].MEV.address},${config[chainId].DAI.address}`}
          >
            MEV / DAI
          </option>
          <option
            value={`${config[chainId].MEV.address},${config[chainId].USDC.address}`}
          >
            MEV / USDC
          </option>
        </select>
      ) : (
        <div>
          <p>Network not supported yet 😒</p>
        </div>
      )}

      <hr />
    </div>
  );
};

export default Markets;
