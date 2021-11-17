// const { ethers } = require("ethers");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    // const { deployer } = await getNamedAccounts();
    const [deployer, user, ...addrs] = await ethers.getSigners();

    const predaDex = await deploy("PredaDex", {
        from: deployer.address,
        args: [deployer.address],
        log: true,
    });

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
    ];
    let exchanges = [];
    for (const ExchangeName of ExchangeNames) {
        const exchange = await deploy(ExchangeName, {
            from: deployer.address,
            args: [],
            log: true,
        });
        exchanges.push(exchange.address);
    }
    const contract = await ethers.getContractAt(predaDex.abi, predaDex.address);
    await contract.connect(deployer).addExchanges(exchanges);
    await contract.connect(deployer).getExchanges();
};
module.exports.tags = ["PredaDex"];
