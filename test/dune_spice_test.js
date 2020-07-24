const { balance } = require('@openzeppelin/test-helpers')

const { web3 } = require('@openzeppelin/test-helpers/src/setup')

const DuneSpice = artifacts.require('DuneSpice')

const CstInitial = {
  Supply: 100,
  Name: 'DuneSpice',
  Symbol: 'DSP',
  Decimals: 18
}

contract('DuneSpice', function (accounts) {
  let SpiceContract

  beforeEach(async () => {
    SpiceContract = await DuneSpice.new(CstInitial.Supply)
    // console.log(`Contract adres = ${SpiceContract.address}`)
  })

  describe('Init', () => {
    it('Initial balans = initial supply', async () => {
      const supply = await SpiceContract.totalSupply()
      assert.equal(supply, CstInitial.Supply, 'Wrong initial supply')
      const balance = await SpiceContract.balanceOf(accounts[0])
      assert.equal(balance.toString(), CstInitial.Supply, 'The contract owner should own all the initial tokens')

    })
    it('Name and symbol', async () => {
      const symbol = await SpiceContract.symbol()
      assert.equal(symbol, CstInitial.Symbol, "Wrong symbol")
      const name = await SpiceContract.name()
      assert.equal(name, CstInitial.Name, "Wrong name")
      const decimals = await SpiceContract.decimals()
      assert.equal(decimals.toString(), CstInitial.Decimals, "Wrong amount of decimals")
    })
  })
  describe('Transfers', () => {
    it('Send tokens from owner to account 1', async () => {
      const sendAmount = 2
      const result = await SpiceContract.transfer(accounts[1], sendAmount)
      assert.isOk(result, "Transaction should be valid")

      const ownerBalance = await SpiceContract.balanceOf(accounts[0])
      assert.equal(ownerBalance.toString(), CstInitial.Supply - sendAmount, "Owner should have Initial supply - send amount")

      const receiver = await SpiceContract.balanceOf(accounts[1])
      assert.equal(receiver.toString(), sendAmount, "Receiver should have send amount")
    })

    it('Send tokens from account 1 to account 2', async () => {
      // fund account 1 with budget
      const budget = 40
      const resultBudget = await SpiceContract.transfer(accounts[1], budget)
      assert.isOk(resultBudget, "Funding transaction should be valid")
      // send from account 1  --> account 2
      const sendAmount = 25
      const result = await SpiceContract.transfer(accounts[2], sendAmount, { from: accounts[1] })
      assert.isOk(result, "Sending transaction should be valid")

      const senderBalance = await SpiceContract.balanceOf(accounts[1])
      assert.equal(senderBalance.toString(), budget - sendAmount, "Sender should have Budget - send amount")

      const receiverBalance = await SpiceContract.balanceOf(accounts[2])
      assert.equal(receiverBalance.toString(), sendAmount, "Receiver should have send amount")
    })
  })
});
