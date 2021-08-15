var desilo = artifacts.require("./desilo.sol");
var dSocialCredits = artifacts.require("./dSocialCredits.sol");

module.exports = async function (deployer) {
  await deployer.deploy(desilo, 5, "0x8" + "0".repeat(15), 10, 50, 1); // 12.5% yield
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
