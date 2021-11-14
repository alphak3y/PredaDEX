// deploy/00_deploy_oracle.js

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("PredaDexQuoter", {
        from: deployer,
        args: [],
        log: true,
    });

    await deploy("PredaDexSwapper", {
        from: deployer,
        args: [],
        log: true,
    });

};
module.exports.tags = ["PredaDexQuoter", "PredaDexSwapper"];
