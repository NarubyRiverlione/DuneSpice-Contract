//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";

contract DuneSpice is ERC20Pausable, Ownable {
    constructor(uint256 initialSupply) public ERC20("DuneSpice", "DSP") {
        _mint(msg.sender, initialSupply);
        _setupDecimals(1);
    }

    function Pause() external onlyOwner {
        if (!paused()) _pause();
    }

    function UnPause() external onlyOwner {
        if (paused()) _unpause();
    }

    function Burn(uint256 _amount) external onlyOwner {
        _burn(owner(), _amount);
    }

    function BurnFrom(address _address, uint256 _amount) external onlyOwner {
        _burn(_address, _amount);
    }
}
