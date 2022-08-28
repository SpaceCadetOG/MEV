// SPDX-License-Identifier: ME
pragma solidity ^0.8.0;

contract Token {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }

    function getName() public view returns (string memory) {
        return name;
    }
}
