var desilo = artifacts.require("./desilo.sol");
var dSocialCredits = artifacts.require("./dSocialCredits.sol");

module.exports = async function (deployer) {
  await deployer.deploy(
    desilo,
    5,
    10,
    1,  // new web3.utils.BN("1001" + "0".repeat(61), 2),
    20,
    3
  ); // 12.5% yield
  let desiloContract = await desilo.deployed();
  await deployer.deploy(
    dSocialCredits,
    desiloContract.address,
    [desiloContract.address],
    1
  );
  let dSocialCreditContract = await dSocialCredits.deployed();
  await desiloContract.setSC(dSocialCreditContract.address);
  await desiloContract.seedSC();
};