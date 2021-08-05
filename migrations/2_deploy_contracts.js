var desilo = artifacts.require("./desilo.sol");
var dSocialCredits = artifacts.require("./dSocialCredits.sol");

module.exports = async function (deployer) {
  await deployer.deploy(
    desilo,
    50,
    10,
    new web3.utils.BN("1001" + "0".repeat(61), 2),
    20
  ); // 12.5% yield
  let desiloContract = await desilo.deployed();
  await deployer.deploy(dSocialCredits, desiloContract.address);
  let dSocialCreditContract = await dSocialCredits.deployed();
  await desiloContract.setSC(dSocialCreditContract.address);
  await desiloContract.seedSC();
};
