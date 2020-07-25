const Harvester = artifacts.require("Harvester");

module.exports = function (deployer) {
  deployer.deploy(Harvester);
};
