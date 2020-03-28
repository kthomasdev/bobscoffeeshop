const BobsCoffeeshop = artifacts.require("BobsCoffeeshop");

module.exports = function(deployer) {
  deployer.deploy(BobsCoffeeshop);
};
