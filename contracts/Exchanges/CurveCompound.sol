// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";
import "../libraries/LibCurve.sol";

contract CurveCompound is PredaDexConsts, IConsts {
    ICurve constant internal CURVE_COMPOUND = ICurve(0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56);

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_CURVE_COMPOUND)
    returns (uint256[] memory rets, uint256 gas) {
        IERC20[] memory tokens = new IERC20[](2);
        tokens[0] = DAI;
        tokens[1] = USDC;
        return (
            LibCurve.CurveSelector(
                fromToken,
                destToken,
                amount,
                parts,
                CURVE_COMPOUND,
                true,
                tokens
            ),
            720_000
        );
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 /*flags*/,
        uint256 minReturn
    ) external payable override returns (uint256) {
        int128 i = (fromToken == DAI ? 1 : 0) + (fromToken == USDC ? 2 : 0);
        int128 j = (destToken == DAI ? 1 : 0) + (destToken == USDC ? 2 : 0);

        uint256 preBal = destToken.balanceOf(address(this));

        Helpers.approve(fromToken, address(CURVE_COMPOUND), amount);
        CURVE_COMPOUND.exchange_underlying(i - 1, j - 1, amount, minReturn);
        return uint256(destToken.balanceOf(address(this)) - preBal);
    }
}