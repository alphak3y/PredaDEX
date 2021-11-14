// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
// import "@uniswap/v3-core/contracts/libraries/FixedPoint96.sol";
import "./PredaDexConsts.sol";
import "../libraries/FullMath.sol";
import "../libraries/TickMath.sol";

contract UniswapV3500 is PredaDexConsts, IConsts {
    using Flags for uint256;
    using UniversalERC20 for IERC20;

    IUniswapV3Factory internal constant UNISWAP_V3_FACTORY = IUniswapV3Factory(0x1F98431c8aD98523631AE4a59f267346ea31F984);
    ISwapRouter internal constant UNISWAP_V3_ROUTER = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    uint24 internal constant POOL_FEE = 500;

    function _estimateUniV3Swap(address _fromToken, address _destToken, uint256 _amount, address _pool, int32 _watchPeriod) internal view returns(uint256) {
        uint256 quoteAmount;

        uint32[] memory secondAgos = new uint32[](2);
        secondAgos[0] = uint32(_watchPeriod);
        secondAgos[1] = 0;

        (int56[] memory tickCumulatives, ) = IUniswapV3Pool(_pool).observe(secondAgos);
        int56 tickCumulativesDelta = tickCumulatives[1] - tickCumulatives[0];

        int24 timeWeightedAverageTick = int24(tickCumulativesDelta / _watchPeriod);

        // Always round to negative infinity
        if (tickCumulativesDelta < 0 && (tickCumulativesDelta % _watchPeriod != 0)) timeWeightedAverageTick--;

        uint160 sqrtRatioX96 = TickMath.getSqrtRatioAtTick(timeWeightedAverageTick);

        // Calculate quoteAmount with better precision if it doesn't overflow when multiplied by itself
        if (sqrtRatioX96 <= type(uint128).max) {
            uint256 ratioX192 = uint256(sqrtRatioX96) * sqrtRatioX96;
            quoteAmount = _fromToken < _destToken
                ? FullMath.mulDiv(ratioX192, _amount, 1 << 192)
                : FullMath.mulDiv(1 << 192, _amount, ratioX192);
        } else {
            uint256 ratioX128 = FullMath.mulDiv(sqrtRatioX96, sqrtRatioX96, 1 << 64);
            quoteAmount = _fromToken < _destToken
                ? FullMath.mulDiv(ratioX128, _amount, 1 << 128)
                : FullMath.mulDiv(1 << 128, _amount, ratioX128);
        }

        return quoteAmount;
    }

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_UNISWAP_V3_ALL) checkFlags(flags, FLAG_DISABLE_UNISWAP_V3_500)
    returns(uint256[] memory rets, uint256 gas) {
        address pool = UNISWAP_V3_FACTORY.getPool(address(fromToken), address(destToken), POOL_FEE);

        if(pool == address(0) || fromToken.universalBalanceOf(pool) < amount * 10) {
            return (new uint256[](parts), 0);
        }

        uint256 retPrice = _estimateUniV3Swap(address(fromToken), address(destToken), amount, pool, 1); // TODO: account for fees in price calculation and check watch period

        // TODO: Update gas to give a real estimate value
        return (Helpers.linearInterpolation(retPrice, parts), 0);
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 flags,
        uint256 minReturn
    ) external payable override returns (uint256) {
        Helpers.approve(fromToken, address(UNISWAP_V3_ROUTER), amount);

        if (flags.check(FLAG_BUY)) {
            ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams(
                address(fromToken),
                address(destToken),
                uint24(POOL_FEE),
                address(this),//msg.sender,
                block.timestamp + 50,
                amount,
                minReturn,
                0 // TODO: fix me
            );

            fromToken.isETH()
                ? UNISWAP_V3_ROUTER.exactOutputSingle{value: amount}(params)
                : UNISWAP_V3_ROUTER.exactOutputSingle{value: 0}(params);

            return amount;
        }
        else {
            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams(
                address(fromToken),
                address(destToken),
                uint24(POOL_FEE),
                address(this),//msg.sender,
                block.timestamp + 50,
                amount,
                minReturn,
                0 // TODO: fix me
            );

            return fromToken.isETH()
                ? UNISWAP_V3_ROUTER.exactInputSingle{value: amount}(params)
                : UNISWAP_V3_ROUTER.exactInputSingle{value: 0}(params);
        }
    }
}