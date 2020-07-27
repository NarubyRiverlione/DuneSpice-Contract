const Harvestering = artifacts.require("Harvestering");

module.exports = function (deployer) {
  deployer.deploy(Harvestering);
};
