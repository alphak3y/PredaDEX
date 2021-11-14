/* global ethers */
/* eslint prefer-const: "off" */

async function deployPredaDex () {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  // deploy Core PredaDex
  const PredaDex = await ethers.getContractFactory('PredaDex')
  const predaDex = await PredaDex.deploy(contractOwner.address)
  await predaDex.deployed()
  console.log('PredaDex deployed:', predaDex.address)

  console.log('')
  console.log('Deploying exchanges')
  const ExchangeNames = [
    'BalancerV1',
    'Bancor',
    'CurveBinance',
    'CurveCompound',
    'CurvePAX',
    'CurveRENBTC',
    'CurveSBTC',
    'CurveSynthetix',
    'CurveUSDT',
    'CurveY',
    'DMM',
    'DodoV1',
    'DodoV2',
    'Mooniswap',
    'MooniswapDAI',
    'MooniswapUSDC',
    'ShellBTC',
    'ShellStable',
    'Sushiswap',
    'UniswapV2',
    'UniswapV2DAI',
    'UniswapV2ETH',
    'UniswapV2USDC',
    'UniswapV3500',
    'UniswapV33000',
    'UniswapV310000',
  ]
  const exchanges = []
  for (const ExchangeName of ExchangeNames) {
    const Exchange = await ethers.getContractFactory(ExchangeName)
    const exchange = await Exchange.deploy()
    await exchange.deployed()
    console.log(`${ExchangeName} deployed: ${exchange.address}`)
    exchanges.push(exchange.address)
  }

  // Add exchanges to PredaDex
  console.log('')
  console.log('Adding Exchanges:'/*, cut*/)
  await predaDex.addExchanges(exchanges)
  console.log('Added... Validating')
  const addedExchanges = await predaDex.getExchanges();
  if (addedExchanges.length == exchanges.length) {
    console.log('Validated.')
  }
  return predaDex
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployPredaDex()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

exports.deployPredaDex = deployPredaDex
