/* global describe it before ethers */

const { assert } = require('chai');
const { deployPredaDex } = require('../scripts/deploy');

const { ERC20_ABI, TOKENS, DEXES, FIXED_DEXES, FLAGS } = require("./constants");

describe('PredaDex Basic Tests', async function () {
  const DEBUG = false;
  const fromToken = TOKENS.uni;
  const toToken = TOKENS.usdc;
  const parts = 1;
  const flags = 0;
  let predaDex;
  let user;

  before(async function () {
    predaDex = await deployPredaDex()
  })

  async function fundUser(token) {
    [ , user, ...addrs] = await ethers.getSigners();

    let whaleAddress = token["whale"];

    await ethers.provider.send("hardhat_impersonateAccount", [
        whaleAddress,
    ]);
    const impersonatedAccount = await ethers.provider.getSigner(
        whaleAddress
    );

    const amount = ethers.utils.parseUnits(token["amount"], token["decimals"]);

    if(token["symbol"] == "ETH") {
    // send ethers
    await impersonatedAccount.sendTransaction({
        to: user.address,
        value: amount
    });
    } else {
    // send ERC20 tokens
    const tokenContract = await ethers.getContractAt(ERC20_ABI, token["address"]);
    await tokenContract
        .connect(impersonatedAccount)
        .transfer(user.address, amount);

    await tokenContract.connect(user).approve(predaDex.address, amount);
    }

    await ethers.provider.send("hardhat_stopImpersonatingAccount", [
        whaleAddress,
    ]);
  }

  it('should have 26 Exchanges', async () => {
    const addedExchanges = await predaDex.getExchanges();
    assert.equal(addedExchanges.length, 26)
  })

  it('should remove the first exchange then add it back', async () => {
    let removing = 0;
    const exchanges = await predaDex.getExchanges();
    await predaDex.removeExchange(exchanges[removing]);
    const postExchanges = await predaDex.getExchanges();

    // These should equal because we swap the last index with the index we want to remove
    assert.equal(postExchanges[removing], exchanges[exchanges.length - 1]);
    // Check that size is 1 less
    assert.equal(postExchanges.length, exchanges.length - 1);

    await predaDex.addExchanges([exchanges[removing]]);
    const postAddedExchanges = await predaDex.getExchanges();
    assert.equal(postAddedExchanges.length, exchanges.length);
  })

  it('should quote', async () => {
    const { returnAmounts, gases } = await predaDex.quote(
      fromToken.address,
      toToken.address,
      ethers.utils.parseUnits(fromToken["amount"], fromToken["decimals"]),
      parts,
      flags
    );
    if(DEBUG) {
      console.log("returnAmounts:", returnAmounts);
      console.log("gases:", gases);
    }
  })

  it('should give a distribution', async () => {
    const { returnAmount, distribution, gas } = await predaDex.quoteAndDistribute(
      fromToken.address,
      toToken.address,
      ethers.utils.parseUnits(fromToken["amount"], fromToken["decimals"]),
      parts,
      flags,
      0  // destTokenEthPriceTimesGasPrice
    );
    if(DEBUG) {
      console.log("returnAmount:", returnAmount);
      console.log("distribution:", distribution);
      console.log("expected gas:", gas);
    }
  })

  it('should distribute and preform a swap', async () => {
    const { quotedAmount, distribution, gas } = await predaDex.quoteAndDistribute(
      fromToken.address,
      toToken.address,
      ethers.utils.parseUnits(fromToken["amount"], fromToken["decimals"]),
      parts,
      flags,
      0  // destTokenEthPriceTimesGasPrice
    );

    if(DEBUG) {
      console.log("distribution:", distribution);
      console.log("quotedAmount:", quotedAmount.toString());
      console.log("gas:", gas);
    }

    await fundUser(fromToken);
    // const balanceBefore = await toToken.balanceOf(user.address);

    const { swappedAmount } = await predaDex.connect(user).swap(
      fromToken.address,
      toToken.address,
      ethers.utils.parseUnits(fromToken["amount"], fromToken["decimals"]),
      1,//quotedAmount.mul(0.95).div(100), // minReturn (5% slippage)
      distribution,
      flags
    );
  })

  it('should group a swap, distribute then perform a swap', async () => {
    await fundUser(fromToken);

    await predaDex.connect(user).deposit(
      fromToken.address,
      toToken.address,
      ethers.utils.parseUnits(fromToken["amount"], fromToken["decimals"])
    );

    await fundUser(fromToken);

    await predaDex.connect(user).deposit(
      fromToken.address,
      toToken.address,
      ethers.utils.parseUnits(fromToken["amount"], fromToken["decimals"])
    );
  })
})
