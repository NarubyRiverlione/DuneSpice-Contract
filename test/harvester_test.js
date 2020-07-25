//const { web3 } = require('@openzeppelin/test-helpers/src/setup');

const Harvester = artifacts.require("Harvester");
const ERR_REQUIRE = 'Error: Returned error: VM Exception while processing transaction:'


contract("Harvester", function (accounts) {
  let HarvesterContract
  const DefaultPrice = web3.utils.toWei('1', 'ether').toString()

  beforeEach(async () => {
    HarvesterContract = await Harvester.new()
    // console.log(`Contract adres = ${SpiceContract.address}`)
  })

  describe('Init', () => {
    it('Initial pice', async () => {
      const price = await HarvesterContract.Price.call()
      assert.equal(price, DefaultPrice, 'Wrong initial price')
    })
  })
  describe('Change Price', () => {
    it('Set  Price as owner', async () => {
      const newPrice = web3.utils.toWei('12.3456789')
      await HarvesterContract.setPrice(newPrice)
      const price = await HarvesterContract.Price.call()
      assert.equal(price, newPrice.toString(), 'Price should now be 12.3456789')
    })
    it('A non-owner cannot set the Price', async () => {
      try {
        await HarvesterContract.setPrice(789, { from: accounts[2] })// non owner --> must throw error
      }
      catch (err) {
        assert.equal(err,
          ERR_REQUIRE + ' revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.',
          'Wrong error message');
      }
      finally {
        const price = await HarvesterContract.Price.call()
        assert.equal(price.toString(), DefaultPrice, 'Price should still be the default')
      }
    })
  })

  describe('Buy harvester', () => {
    it('Buy 1 harvester', async () => {
      await HarvesterContract.buyHarvester({ value: DefaultPrice, from: accounts[1] })
      const myCount = await HarvesterContract.harvesterCounter(accounts[1])
      assert.equal(myCount, 1, 'Must have 1 harvester now')
    })
    it('Buy 3 harvester', async () => {
      await HarvesterContract.buyHarvester({ value: DefaultPrice, from: accounts[1] })
      await HarvesterContract.buyHarvester({ value: DefaultPrice, from: accounts[1] })
      await HarvesterContract.buyHarvester({ value: DefaultPrice, from: accounts[1] })
      const myCount = await HarvesterContract.harvesterCounter(accounts[1])
      assert.equal(myCount, 3, 'Must have 3 harvester now')
    })
    it.only('Try buying with not enough amount', async () => {
      try {
        await HarvesterContract.buyHarvester({
          value: web3.utils.toWei('0.001', 'ether'),
          from: accounts[1]
        })
      }
      catch (err) {
        assert.equal(err,
          ERR_REQUIRE + ' revert Price is higher that amount send -- Reason given: Price is higher that amount send.',
          'Wrong error message');
      }
      finally {
        const myCount = await HarvesterContract.harvesterCounter(accounts[1])
        assert.equal(myCount, 0, 'Must not have a harvester after error')
      }
    })
  })

})
