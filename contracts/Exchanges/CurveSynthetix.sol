// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";
import "../libraries/LibCurve.sol";

contract CurveSynthetix is PredaDexConsts, IConsts {
    ICurve constant internal CURVE_SYNTHETIX = ICurve(0xA5407eAE9Ba41422680e2e00537571bcC53efBfD);

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_CURVE_SYNTHETIX)
    returns (uint256[] memory rets, uint256 gas) {
        IERC20[] memory tokens = new IERC20[](4);
        tokens[0] = DAI;
        tokens[1] = USDC;
        tokens[2] = USDT;
        tokens[3] = SUSD;
        return (
            LibCurve.CurveSelector(
                fromToken,
                destToken,
                amount,
                parts,
                CURVE_SYNTHETIX,
                true,
                tokens
            ),
            200_000
        );
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 /*flags*/,
        uint256 minReturn
    ) external payable override returns (uint256) {
        int128 i =  (fromToken == DAI ? 1 : 0) +
                    (fromToken == USDC ? 2 : 0) +
                    (fromToken == USDT ? 3 : 0) +
                    (fromToken == SUSD ? 4 : 0);
        int128 j =  (destToken == DAI ? 1 : 0) +
                    (destToken == USDC ? 2 : 0) +
                    (destToken == USDT ? 3 : 0) +
                    (destToken == SUSD ? 4 : 0);

        uint256 preBal = destToken.balanceOf(address(this));

        Helpers.approve(fromToken, address(CURVE_SYNTHETIX), amount);
        CURVE_SYNTHETIX.exchange_underlying(i - 1, j - 1, amount, minReturn);
        return uint256(destToken.balanceOf(address(this)) - preBal);
    }
}