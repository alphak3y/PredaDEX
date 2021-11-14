// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../libraries/UniversalERC20.sol";
import "../interfaces/IAggregatorV3.sol";

interface IConsts {
    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external view
    returns (uint256[] memory rets, uint256 gas);

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 flags,
        uint256 minReturn
    ) external payable
    returns (uint256 returnAmount);
}

library Flags {
    function check(uint256 flags, uint256 flag) internal pure returns(bool) {
        return (flags & flag) != 0;
    }
}

library Helpers {
    using UniversalERC20 for IERC20;
    function linearInterpolation100(uint256 value, uint256 parts) internal pure returns (uint256[100] memory rets) {
        for (uint256 i = 0; i < parts; i++) {
            rets[i] = (value * (i + 1)) / (parts);
        }
    }

    function linearInterpolation(uint256 value, uint256 parts) internal pure returns (uint256[] memory rets) {
        rets = new uint256[](parts);
        for (uint256 i = 0; i < parts; i++) {
            rets[i] = (value * (i + 1)) / (parts);
        }
    }

    function approve(IERC20 token, address dex, uint256 amount) internal {
        if(token.universalAllowance(address(this), address(dex)) < amount)
            token.universalApprove(address(dex), type(uint256).max);
    }
}

interface IWETH is IERC20 {
    function deposit() external payable;

    function withdraw(uint256 amount) external;
}

contract PredaDexConsts {
    using Flags for uint256;
    using UniversalERC20 for IERC20;

    modifier checkFlags(uint256 flags, uint256 flag) {
        if(!flags.check(flag)) {
            _;
        }
    }

    IAggregatorV3 internal constant GAS_ESTIMATOR = IAggregatorV3(0x3D400312Bb3456f4dC06D528B55707F08dFFD664);

    // flags = FLAG_DISABLE_UNISWAP + FLAG_DISABLE_BANCOR + ...
    uint256 internal constant FLAG_BUY = 0x01;

    // This should be used on common pairs during gas wars, allows a group trade to execute with much higher gas than a single swap would
    uint256 internal constant FLAG_GROUP_SWAP = 0x02;

    // DMM
    uint256 internal constant FLAG_DISABLE_DMM = 0x04;
    // Uniswap V2
    uint256 internal constant FLAG_DISABLE_UNISWAP_V2_ALL = 0x08;
    uint256 internal constant FLAG_DISABLE_UNISWAP_V2_ETH = 0x10;
    uint256 internal constant FLAG_DISABLE_UNISWAP_V2_DAI = 0x20;
    uint256 internal constant FLAG_DISABLE_UNISWAP_V2_USDC = 0x40;
    // Uniswap V3
    uint256 internal constant FLAG_DISABLE_UNISWAP_V3_ALL = 0x80;
    uint256 internal constant FLAG_DISABLE_UNISWAP_V3_500 = 0x100;
    uint256 internal constant FLAG_DISABLE_UNISWAP_V3_3000 = 0x200;
    uint256 internal constant FLAG_DISABLE_UNISWAP_V3_10000 = 0x400;
    // SushiSwap
    uint256 internal constant FLAG_DISABLE_SUSHISWAP = 0x800;
    // Curve
    uint256 internal constant FLAG_DISABLE_CURVE_ALL = 0x1000;
    uint256 internal constant FLAG_DISABLE_CURVE_USDT = 0x2000;
    uint256 internal constant FLAG_DISABLE_CURVE_Y = 0x4000;
    uint256 internal constant FLAG_DISABLE_CURVE_BINANCE = 0x8000;
    uint256 internal constant FLAG_DISABLE_CURVE_SYNTHETIX = 0x10000;
    uint256 internal constant FLAG_DISABLE_CURVE_SBTC = 0x20000;
    uint256 internal constant FLAG_DISABLE_CURVE_PAX = 0x40000;
    uint256 internal constant FLAG_DISABLE_CURVE_RENBTC = 0x80000;
    uint256 internal constant FLAG_DISABLE_CURVE_TBTC = 0x100000;
    uint256 internal constant FLAG_DISABLE_CURVE_COMPOUND = 0x200000;
    uint256 internal constant FLAG_DISABLE_CURVE_HBTC = 0x400000;
    uint256 internal constant FLAG_DISABLE_CURVE_POOL = 0x800000;
    // Balancer
    uint256 internal constant FLAG_DISABLE_BALANCER_ALL = 0x1000000;
    uint256 internal constant FLAG_DISABLE_BALANCER_V1 = 0x2000000;
    // Dododex
    uint256 internal constant FLAG_DISABLE_DODODEX_ALL = 0x4000000;
    uint256 internal constant FLAG_DISABLE_DODODEX_V1 = 0x8000000;
    uint256 internal constant FLAG_DISABLE_DODODEX_V2 = 0x10000000;
    // Mooniswap
    uint256 internal constant FLAG_DISABLE_MOONISWAP_ALL = 0x20000000;
    uint256 internal constant FLAG_DISABLE_MOONISWAP_DAI = 0x40000000;
    uint256 internal constant FLAG_DISABLE_MOONISWAP_ETH = 0x80000000;
    uint256 internal constant FLAG_DISABLE_MOONISWAP_USDC = 0x100000000;
    // Bancor
    uint256 internal constant FLAG_DISABLE_BANCOR = 0x200000000;
    // Shell
    uint256 internal constant FLAG_DISABLE_SHELL_ALL = 0x400000000;
    uint256 internal constant FLAG_DISABLE_SHELL_STABLE = 0x800000000;
    uint256 internal constant FLAG_DISABLE_SHELL_BTC = 0x1000000000;

    // ERC20 Tokens
    IERC20 constant internal ETH_ADDRESS = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    IERC20 constant internal ZERO_ADDRESS = IERC20(0x0000000000000000000000000000000000000000);
    IWETH constant internal WETH = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
    IERC20 constant internal DAI = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    IERC20 constant internal USDC = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    IERC20 constant internal USDT = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
    IERC20 constant internal TUSD = IERC20(0x0000000000085d4780B73119b644AE5ecd22b376);
    IERC20 constant internal BUSD = IERC20(0x4Fabb145d64652a948d72533023f6E7A623C7C53);
    IERC20 constant internal SUSD = IERC20(0x57Ab1ec28D129707052df4dF418D58a2D46d5f51);
    IERC20 constant internal PAX = IERC20(0x8E870D67F660D95d5be530380D0eC0bd388289E1);
    IERC20 constant internal RENBTC = IERC20(0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D);
    IERC20 constant internal WBTC = IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);
    IERC20 constant internal TBTC = IERC20(0x1bBE271d15Bb64dF0bc6CD28Df9Ff322F2eBD847);
    IERC20 constant internal HBTC = IERC20(0x0316EB71485b0Ab14103307bf65a021042c6d380);
    IERC20 constant internal SBTC = IERC20(0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6);
}