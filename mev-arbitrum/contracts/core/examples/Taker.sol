// // SPDX-License-Identifier: SEE LICENSE IN LICENSE
// pragma solidity 0.8.10;


// // liquidation
// contract Taker {
//     address public admin;
//     address internal profit_oracle;

//     struct Asset {
//         string token; // change to address
//         address exchange;
//     }

//     mapping(string => Asset) public assets;

//     constructor() {
//         admin = msg.sender;
//     }

//     modifier AdminOnly() {
//         require(msg.sender == admin, "NOT ADMIN");
//         _;
//     }

//     function setOracle(address _profit_oracle) external AdminOnly {
//         profit_oracle = _profit_oracle;
//     }

//     function setAssets(Asset[] calldata _assets) external AdminOnly {
//         for (uint i = 0; i < _assets.length; i++) {
//             assets[_assets[i].token] = Asset(
//                 _assets[i].token,
//                 _assets[i].exchange
//             );
//         }
//     }

//     function TradePotential(string calldata _token, uint _date) external {
//         // Asset storage asset = assets[_token];
//         // require(asset.exchange != address(0), "NON-EXISTENT");

//         // // Get latest  price of asset from oracle
//         // bytes32 dataKey = keccak256(abi.encodePacked(_token, _date));
//         // // import oracle contract here
//         // // ProfitOracle oracle = ProfitOracle(profit_oracle);
//         // // create result = oracle.getData(dataKey)
//         // // reqiure result to work
//         // // reqiure result to approval results

//         // // if there is a price, trade on the dex
//         // // import dex contract
//         // // Dex exchangeA = Dex(asset.exchange);
//         // // Dex exchangeB = Dex(asset.exchange);
//         // // exchangePrice = get price from dex
//         // // uint amount = 1 ether / exchangePrice
//         // // if else for BUY/SELL
//     }
// }

// contract Dex {
//     mapping(string => uint) private prices;

//     function getPrice(string calldata _token)
//         external
//         view
//         returns (uint price)
//     {
//         price = prices[_token];
//         return price;
//     }

//     function getUserPrice(address _user) external view returns (uint price) {
//         return price;
//     }

//     function take(
//         string calldata _token,
//         uint amount,
//         uint price
//     ) external {
//         // buy token
//     }
// }
