const HarvesteringContract = artifacts.require('Harvestering');
const { time } = require('@openzeppelin/test-helpers');

const ERR_REQUIRE = 'Error: Returned error: VM Exception while processing transaction:'
const DefaultPrice = web3.utils.toWei('1', 'ether').toString()

contract('Harvestering', function (accounts) {
  let Harvestering

  beforeEach(async () => {
    //HarvesterFac = await HarvesterFactory.new()
    Harvestering = await HarvesteringContract.new()
    // console.log(`Contract adres = ${SpiceContract.address}`)
  })
  describe('Starting', () => {
    it('Start harvesting', async () => {
      await Harvestering.buyHarvester({ value: DefaultPrice, from: accounts[1] })
      const firstOwner = await Harvestering.harvesterToOwner(0)
      assert.equal(firstOwner, accounts[1], 'First harvester should be owned by buyer')

      const notRunning = await Harvestering.isHarvesting(0)
      assert.notOk(notRunning, 'Harvester should not be harvesting from the start')

      await Harvestering.startHarvesting(0, { from: accounts[1] })
      const startBlock = await web3.eth.getBlockNumber()
      const Running = await Harvestering.isHarvesting(0)
      assert.isOk(Running, 'Harvester should now be harvesting')
      const reportedStart = await Harvestering.startAtBlock(0, { from: accounts[1] })
      assert.equal(reportedStart.toString(), startBlock, 'Wrong start time')

    })
    it('Try start harvesting as non owner should fail', async () => {
      try {
        await Harvestering.buyHarvester({ value: DefaultPrice, from: accounts[1] })
        await Harvestering.startHarvesting(0, { from: accounts[2] })
      }
      catch (err) {
        assert.equal(err,
          ERR_REQUIRE + ' revert Not the owner of the harvester -- Reason given: Not the owner of the harvester.',
          'Wrong error message');
      }
      finally {
        const stillNotRunning = await Harvestering.isHarvesting(0);
        assert.notOk(stillNotRunning, 'Harvester should not be harvesting')
      }
    })
  })

  describe('Stopping', () => {
    it('Stop harvesting', async () => {
      const waitFor = 2
      const rewardEachBlock = 2
      await Harvestering.buyHarvester({ value: DefaultPrice, from: accounts[1] })
      await Harvestering.startHarvesting(0, { from: accounts[1] })
      // wait blocks
      const start = await web3.eth.getBlockNumber()
      // console.log(`Start at ${start}`)
      await time.advanceBlockTo(start + waitFor)
      const end = await web3.eth.getBlockNumber()
      // console.log(`End at ${end}`)

      await Harvestering.stopHarvesting(0, { from: accounts[1] })

      const notRunning = await Harvestering.isHarvesting(0)
      assert.notOk(notRunning, 'Harvester should not longer be harvesting')

      const harvest = await Harvestering.harvest(0); // get harvest
      assert.equal(harvest.toString(), waitFor * rewardEachBlock, 'incorrect reward')
    })
    it('Try stopping harvesting as non owner should fail', async () => {
      try {
        await Harvestering.buyHarvester({ value: DefaultPrice, from: accounts[1] })
        await Harvestering.startHarvesting(0, { from: accounts[1] })
        await time.advanceBlock()
        await Harvestering.stopHarvesting(0, { from: accounts[4] })
      }
      catch (err) {
        assert.equal(err,
          ERR_REQUIRE + ' revert Not the owner of the harvester -- Reason given: Not the owner of the harvester.',
          'Wrong error message');
      }
      finally {
        const stillRunning = await Harvestering.isHarvesting(0);
        assert.isOk(stillRunning, 'Harvester should still be harvesting')
      }
    })
  })
})
