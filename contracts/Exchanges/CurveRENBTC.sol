// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";
import "../libraries/LibCurve.sol";

contract CurveRENBTC is PredaDexConsts, IConsts {
    ICurve constant internal CURVE_RENBTC = ICurve(0x93054188d876f558f4a66B2EF1d97d16eDf0895B);

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_CURVE_RENBTC)
    returns (uint256[] memory rets, uint256 gas) {
        IERC20[] memory tokens = new IERC20[](2);
        tokens[0] = RENBTC;
        tokens[1] = WBTC;
        return (
            LibCurve.CurveSelector(
                fromToken,
                destToken,
                amount,
                parts,
                CURVE_RENBTC,
                false,
                tokens
            ),
            130_000
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
                    (fromToken == WBTC ? 2 : 0);
        int128 j =  (destToken == RENBTC ? 1 : 0) +
                    (destToken == WBTC ? 2 : 0);

        uint256 preBal = destToken.balanceOf(address(this));

        Helpers.approve(fromToken, address(CURVE_RENBTC), amount);
        CURVE_RENBTC.exchange(i - 1, j - 1, amount, minReturn);
        return uint256(destToken.balanceOf(address(this)) - preBal);
    }
}