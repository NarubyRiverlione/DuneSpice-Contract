//SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./HarvesterFactory.sol";
import "./DuneSpice.sol";

contract Harvestering is HarvesterFactory {
    using SafeMath for uint256;

    uint8 public reward = 2;
    mapping(uint256 => bool) public isHarvesting;
    mapping(uint256 => uint256) public startAtBlock;
    mapping(uint256 => uint256) public harvest;

    function startHarvesting(uint256 _harvesterId)
        external
        whenNotPaused()
        isHarvesterOwner(_harvesterId)
    {
        isHarvesting[_harvesterId] = true;
        startAtBlock[_harvesterId] = block.number;
    }

    // stop harvesting and calculate the harvest = blocks * reward
    function stopHarvesting(uint256 _harvesterId)
        external
        whenNotPaused()
        isHarvesterOwner(_harvesterId)
    {
        require(
            isHarvesting[_harvesterId] == true,
            "Harvester was not running"
        );
        // stop now, before calculating the reward as reentry guard
        isHarvesting[_harvesterId] = false;

        uint256 blocksHarvested = block
            .number
            .sub(startAtBlock[_harvesterId])
            .sub(1);
        harvest[_harvesterId] = harvest[_harvesterId].add(blocksHarvested).mul(
            reward
        );
    }

    // send reward as DuneSpiceTokens
    function collectHarvest(uint256 _harvesterId)
        external
        whenNotPaused()
        isHarvesterOwner(_harvesterId)
    {
        // transfer(harvesterToOwner[_harvesterId], harvest[_harvesterId]);
    }
}
