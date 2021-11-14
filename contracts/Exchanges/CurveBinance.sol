// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";
import "../libraries/LibCurve.sol";

contract CurveBinance is PredaDexConsts, IConsts {
    ICurve constant internal CURVE_BINANCE = ICurve(0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27);

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_CURVE_BINANCE)
    returns (uint256[] memory rets, uint256 gas) {
        IERC20[] memory tokens = new IERC20[](4);
        tokens[0] = DAI;
        tokens[1] = USDC;
        tokens[2] = USDT;
        tokens[3] = BUSD;
        return (
            LibCurve.CurveSelector(
                fromToken,
                destToken,
                amount,
                parts,
                CURVE_BINANCE,
                true,
                tokens
            ),
            1_400_000
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
                    (fromToken == BUSD ? 4 : 0);
        int128 j =  (destToken == DAI ? 1 : 0) +
                    (destToken == USDC ? 2 : 0) +
                    (destToken == USDT ? 3 : 0) +
                    (destToken == BUSD ? 4 : 0);

        uint256 preBal = destToken.balanceOf(address(this));

        Helpers.approve(fromToken, address(CURVE_BINANCE), amount);
        CURVE_BINANCE.exchange_underlying(i - 1, j - 1, amount, minReturn);
        return uint256(destToken.balanceOf(address(this)) - preBal);
    }
}