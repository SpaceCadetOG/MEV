// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
// finish contract =>https://pro.eattheblocks.com/courses/1138851/lectures/24439215
import "../oracles/profit-oracle.sol";

// Yield Farmer
contract Yielder {
    address public admin;
    address internal profit_oracle;

    enum Protocol {
        GMX
    }

    enum Lender {
        Aave,
        UniswapV3
    }

    //

    Protocol public currentPlace;

    constructor() {
        admin = msg.sender;
    }

    modifier AdminOnly() {
        require(msg.sender == admin, "NOT ADMIN");
        _;
    }

    function setOracle(address _profit_oracle) external AdminOnly {
        profit_oracle = _profit_oracle;
    }

    function setProtocol(Protocol _protocol) external AdminOnly {}
}
