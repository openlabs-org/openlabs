import React from 'react'

function Test(props) {
  console.log(props);
  async function seedSC() {
    console.log("seedSC")
    return await props.desiloContract.methods.seedSC().call({
      from: props.account,
      gasLimmit: 30000
    });
  }

  /* Parameters: initialSupply: int, uri: string */
  async function createGroup(initialSupply, uri) {
    console.log("createGroup")
    return await props.desiloContract.methods.createGroup(initialSupply, uri).send({
      from: props.account,
    });
  }

  async function getUserSocialCredit(address) {
    return await props.socialCreditsContract.methods.balanceOf(address, 0).call({
      from: props.account
    });
  }

  /* Parameters: int commitId */
  async function stake(commitId) {
    console.log(props.account)
    return await props.desiloContract.methods.stake(commitId).call({
      from: props.account
    })
  }

  async function testMethod() {
    console.log('reach')
    getUserSocialCredit(props.account).then(response => {
      console.log(response)
    })
    stake(10);
    //getUserSocialCredit(props.account);
  }



  return (
    <div>
      <button onClick={testMethod}>Test</button>
    </div>
  )
}

export default Test
