//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract HarvesterFactory is Ownable, Pausable {
    using SafeMath for uint256;

    uint256 public Price;

    // struct Harvester {
    //     uint8 Damage;
    //     uint8 Load;
    //     uint8 Capacity;
    // }

    // uint256[] public Harvesters;
    uint256 public lastID = 0;
    mapping(uint256 => address) public harvesterToOwner;
    mapping(address => uint256) public ownerHarvesterCount;

    constructor() public {
        Price = 1 ether;
    }

    modifier isHarvesterOwner(uint256 _harvesterId) {
        require(
            msg.sender == harvesterToOwner[_harvesterId],
            "Not the owner of the harvester"
        );
        _;
    }

    // function amountOfHarvesters() external view returns (uint256) {
    //     return Harvesters.length;
    // }

    function setPrice(uint256 _price) external onlyOwner whenNotPaused() {
        Price = _price;
    }

    function buyHarvester() external payable whenNotPaused() {
        require(msg.value >= Price, "Price is higher that amount send");
        //  uint256 id = Harvesters.length; // as first element is 0 --> length = next
        harvesterToOwner[lastID] = msg.sender; // link id and address
        lastID = lastID.add(1);
        //   Harvesters.push(Harvester(0)); // create new Harvester with zero damage
        // Harvesters.push(id); // create new Harvester with zero damage
        ownerHarvesterCount[msg.sender] = ownerHarvesterCount[msg.sender].add(
            1
        );
    }
}
