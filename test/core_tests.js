const desilo = artifacts.require("./desilo.sol");
const dSocialCredits = artifacts.require("./dSocialCredits.sol");

contract("desilo", (accounts) => {
  it("....should allow minting", async () => {
    let desiloContract = await desilo.deployed();
    desiloContract = new web3.eth.Contract(desilo.abi, desilo.address, {
      from: accounts[0],
      gasLimit: 1000000,
    });

    let dscContract = await dSocialCredits.deployed();
    dscContract = new web3.eth.Contract(
      dSocialCredits.abi,
      dSocialCredits.address,
      {
        from: accounts[0],
        gasLimit: 1000000,
      }
    );

    const seedAmount = await desiloContract.methods.scSeedAmount().call();
    const isRegistered = await desiloContract.methods
      .registered(accounts[0])
      .call();

    if (!isRegistered) {
      await desiloContract.methods.seedSC().send();
      let userBalance = await dscContract.methods
        .balanceOf(accounts[0], 0)
        .call();
      assert.equal(
        seedAmount,
        userBalance,
        "Balance not equal to seed amount!"
      );
    } else {
      userBalance = await dscContract.methods.balanceOf(accounts[0], 0).call();
      assert.equal(
        seedAmount,
        userBalance,
        "Balance not equal to seed amount!"
      );
    }
  });
});
