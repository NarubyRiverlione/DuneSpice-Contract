const HarvesterFactory = artifacts.require("HarvesterFactory");

module.exports = function (deployer) {
  deployer.deploy(HarvesterFactory);
};
