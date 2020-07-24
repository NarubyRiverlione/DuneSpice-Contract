//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DuneSpice is ERC20 {
    constructor(uint256 initialSupply) public ERC20("DuneSpice", "DSP") {
        _mint(msg.sender, initialSupply);
    }
}
