const { ethers } = require("hardhat");

const linkAddress = "0x514910771af9ca656af840dff83e8264ecf986ca" //LINK
const linkWhale = "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503" //LINK team wallet
const ethWhale = "0x6555e1CC97d3cbA6eAddebBCD7Ca51d75771e0B8"
const userAddress  = "" //My wallet
const amount       = "1000";

// const tokenAddress = "0x514910771af9ca656af840dff83e8264ecf986ca" //USDC
// const whaleAddress = "0x3026082899c571d6fd50563d824150531aa34a5d" //USDC whale wallet
// const userAddress  = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" //My wallet
// const amount       = "100000";

const ERC20_ABI = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint)",
    "function balanceOf(address) view returns (uint)",
    "function approve(address spender, uint256 amount)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function transfer(address to, uint amount)",
    "function transferFrom(address sender, address recipient, uint256 amount)",
    "event Transfer(address indexed from, address indexed to, uint amount)",
];

async function main() {

    await ethers.provider.send("hardhat_impersonateAccount", [
        linkWhale,
    ]);
    const linkAccount = await ethers.provider.getSigner(
        linkWhale
    );
    const linkContract = await ethers.getContractAt(ERC20_ABI, linkAddress);

    await linkContract
      .connect(linkAccount)
      .transfer(userAddress, ethers.utils.parseUnits(amount));

    await ethers.provider.send("hardhat_impersonateAccount", [
        ethWhale,
    ]);
    const ethAccount = await ethers.provider.getSigner(
        ethWhale
    );

    await ethAccount.sendTransaction({
        to: userAddress,
        value: ethers.utils.parseUnits("1000", 18.0)
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});