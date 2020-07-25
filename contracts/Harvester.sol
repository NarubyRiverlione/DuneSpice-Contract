//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Harvester is Ownable, Pausable {
    using SafeMath for uint256;

    mapping(address => uint256) public harvesterCounter;
    uint256 public Price;

    constructor() public {
        Price = 1 ether;
    }

    function setPrice(uint256 _price) external onlyOwner whenNotPaused() {
        Price = _price;
    }

    function buyHarvester() external payable whenNotPaused() {
        require(msg.value >= Price, "Price is higher that amount send");
        harvesterCounter[msg.sender] = harvesterCounter[msg.sender].add(1);
    }
}
