// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";
import "../libraries/LibCurve.sol";

contract CurveSBTC is PredaDexConsts, IConsts {
    ICurve constant internal CURVE_SBTC = ICurve(0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714);

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_CURVE_SBTC)
    returns (uint256[] memory rets, uint256 gas) {
        IERC20[] memory tokens = new IERC20[](3);
        tokens[0] = RENBTC;
        tokens[1] = WBTC;
        tokens[2] = SBTC;
        return (
            LibCurve.CurveSelector(
                fromToken,
                destToken,
                amount,
                parts,
                CURVE_SBTC,
                false,
                tokens
            ),
            150_000
        );
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 /*flags*/,
        uint256 minReturn
    ) external payable override returns (uint256) {
        int128 i =  (fromToken == RENBTC ? 1 : 0) +
                    (fromToken == WBTC ? 2 : 0) +
                    (fromToken == SBTC ? 3 : 0);
        int128 j =  (destToken == RENBTC ? 1 : 0) +
                    (destToken == WBTC ? 2 : 0) +
                    (destToken == SBTC ? 3 : 0);

        uint256 preBal = destToken.balanceOf(address(this));

        Helpers.approve(fromToken, address(CURVE_SBTC), amount);
        CURVE_SBTC.exchange(i - 1, j - 1, amount, minReturn);
        return uint256(destToken.balanceOf(address(this)) - preBal);
    }
}