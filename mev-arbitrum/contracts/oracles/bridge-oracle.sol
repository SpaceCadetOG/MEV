// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Complete => https://pro.eattheblocks.com/courses/1138851/lectures/24439203
contract BridgeOracle {
    struct Data {
        uint date;
        uint payload;
    }
// etb defi mastery
    address public admin;
    mapping(address => bool) reporters;
    mapping(bytes32 => Data) public data;

    constructor(address _admin) {
        admin = _admin;
    }

    function updateReporter(address reporter, bool isReporter) external {
        require(msg.sender == admin, "only reporters");
        reporters[reporter] = isReporter;
    }

    function updateData(bytes32 key, uint payload) external {
        require(reporters[msg.sender] == true, "only reporters");
        data[key] = Data(block.timestamp, payload);
    }

    function getData(bytes32 key)
        external
        view
        returns (
            bool result,
            uint date,
            uint payload
        )
    {
        if (data[key].date == 0) {
            return (false, 0, 0);
        }
        return (true, data[key].date, data[key].payload);
    }

    
}
