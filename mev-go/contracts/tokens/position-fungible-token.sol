// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// use as bond
contract ProfitBridgeToken is ERC721 {
    constructor() ERC721("Profit Position", "PROFIT-INDEX") {

    }
    // token ID to mark positon 
    // mint when user pays fee => Mint A Position
    // Non-Transferable
    // track balances
}
