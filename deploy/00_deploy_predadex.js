// deploy/00_deploy_oracle.js

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy("PredaDex", {
        from: deployer,
        args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
        log: true,
    });

};
module.exports.tags = ["PredaDex"];
