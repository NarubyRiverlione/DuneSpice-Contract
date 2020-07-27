const DuneSpice = artifacts.require("DuneSpice");

module.exports = function (deployer) {
  deployer.deploy(DuneSpice, 10);
};
