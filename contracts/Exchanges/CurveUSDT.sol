// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";
import "../libraries/LibCurve.sol";

contract CurveUSDT is PredaDexConsts, IConsts {
    ICurve constant internal CURVE_USDT = ICurve(0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C);

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_CURVE_USDT)
    returns (uint256[] memory rets, uint256 gas) {
        IERC20[] memory tokens = new IERC20[](3);
        tokens[0] = DAI;
        tokens[1] = USDC;
        tokens[2] = USDT;
        return (
            LibCurve.CurveSelector(
                fromToken,
                destToken,
                amount,
                parts,
                CURVE_USDT,
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
        int128 i =  (fromToken == DAI ? 1 : 0) +
                    (fromToken == USDC ? 2 : 0) +
                    (fromToken == USDT ? 3 : 0);
        int128 j =  (destToken == DAI ? 1 : 0) +
                    (destToken == USDC ? 2 : 0) +
                    (destToken == USDT ? 3 : 0);

        uint256 preBal = destToken.balanceOf(address(this));

        Helpers.approve(fromToken, address(CURVE_USDT), amount);
        CURVE_USDT.exchange_underlying(i - 1, j - 1, amount, minReturn);
        return uint256(destToken.balanceOf(address(this)) - preBal);
    }
}