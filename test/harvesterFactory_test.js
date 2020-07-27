const HarvesterFactory = artifacts.require('HarvesterFactory');
const ERR_REQUIRE = 'Error: Returned error: VM Exception while processing transaction:'


contract('HarvesterFactory', function (accounts) {
  let HarvesterFac
  const DefaultPrice = web3.utils.toWei('1', 'ether').toString()

  beforeEach(async () => {
    HarvesterFac = await HarvesterFactory.new()
    // console.log(`Contract adres = ${SpiceContract.address}`)
  })

  describe('Init', () => {
    it('Initial pice', async () => {
      const price = await HarvesterFac.Price.call()
      assert.equal(price, DefaultPrice, 'Wrong initial price')
    })
  })
  describe('Change Price', () => {
    it('Set  Price as owner', async () => {
      const newPrice = web3.utils.toWei('12.3456789')
      await HarvesterFac.setPrice(newPrice)
      const price = await HarvesterFac.Price.call()
      assert.equal(price, newPrice.toString(), 'Price should now be 12.3456789')
    })
    it('A non-owner cannot set the Price', async () => {
      try {
        await HarvesterFac.setPrice(789, { from: accounts[2] })// non owner --> must throw error
      }
      catch (err) {
        assert.equal(err,
          ERR_REQUIRE + ' revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.',
          'Wrong error message');
      }
      finally {
        const price = await HarvesterFac.Price.call()
        assert.equal(price.toString(), DefaultPrice, 'Price should still be the default')
      }
    })
  })

  describe('Buy harvester', () => {
    it('Buy 1 harvester', async () => {
      await HarvesterFac.buyHarvester({ value: DefaultPrice, from: accounts[1] })

      const myCount = await HarvesterFac.ownerHarvesterCount(accounts[1])
      assert.equal(myCount, 1, 'Must have 1 harvester now')

      const amount = await HarvesterFac.amountOfHarvesters()
      assert.equal(amount, 1, 'One harvester should exist')

      const firstOwner = await HarvesterFac.harvesterToOwner(0)
      assert.equal(firstOwner, accounts[1], 'First harvester should be owned by buyer')
    })
    it('Buy harvester form different accounts', async () => {
      await HarvesterFac.buyHarvester({ value: DefaultPrice, from: accounts[2] })
      await HarvesterFac.buyHarvester({ value: DefaultPrice, from: accounts[3] })
      await HarvesterFac.buyHarvester({ value: DefaultPrice, from: accounts[4] })
      await HarvesterFac.buyHarvester({ value: DefaultPrice, from: accounts[4] })
      const amount = await HarvesterFac.amountOfHarvesters()
      assert.equal(amount, 4, '4 harvesters should exist')
      const countAcc2 = await HarvesterFac.ownerHarvesterCount(accounts[2])
      assert.equal(countAcc2, 1, 'Account 2 must have 1 harvester now')
      const countAcc3 = await HarvesterFac.ownerHarvesterCount(accounts[3])
      assert.equal(countAcc3, 1, 'Account 3 must have 1 harvester now')
      const countAcc4 = await HarvesterFac.ownerHarvesterCount(accounts[4])
      assert.equal(countAcc4, 2, 'Account 4 must have 2 harvester now')
    })
    it('Try buying with not enough amount', async () => {
      try {
        await HarvesterFac.buyHarvester({
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
        const myCount = await HarvesterFac.ownerHarvesterCount(accounts[1])
        assert.equal(myCount, 0, 'Must not have a harvester after error')
        const amount = await HarvesterFac.amountOfHarvesters()
        assert.equal(amount, 0, '0 harvesters should exist')
      }
    })
  })

})
