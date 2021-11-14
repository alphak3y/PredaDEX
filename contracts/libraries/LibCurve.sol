// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../Exchanges/PredaDexConsts.sol";

interface ICurve {
    // solium-disable-next-line mixedcase
    function get_dy_underlying(int128 i, int128 j, uint256 dx) external view returns(uint256 dy);

    // solium-disable-next-line mixedcase
    function get_dy(int128 i, int128 j, uint256 dx) external view returns(uint256 dy);

    // solium-disable-next-line mixedcase
    function exchange_underlying(int128 i, int128 j, uint256 dx, uint256 minDy) external;

    // solium-disable-next-line mixedcase
    function exchange(int128 i, int128 j, uint256 dx, uint256 minDy) external;
}

interface ICurveRegistry {
    function get_pool_info(address pool)
        external
        view
        returns(
            uint256[8] memory balances,
            uint256[8] memory underlying_balances,
            uint256[8] memory decimals,
            uint256[8] memory underlying_decimals,
            address lp_token,
            uint256 A,
            uint256 fee
        );
}

interface ICurveCalculator {
    function get_dy(
        int128 nCoins,
        uint256[8] calldata balances,
        uint256 amp,
        uint256 fee,
        uint256[8] calldata rates,
        uint256[8] calldata precisions,
        bool underlying,
        int128 i,
        int128 j,
        uint256[100] calldata dx
    ) external view returns(uint256[100] memory dy);
}

library LibCurve {
    ICurveCalculator constant internal CURVE_CALCULATOR = ICurveCalculator(0xc1DB00a8E5Ef7bfa476395cdbcc98235477cDE4E);
    ICurveRegistry constant internal CURVE_REGISTRY = ICurveRegistry(0x7002B727Ef8F5571Cb5F9D70D13DBEEb4dFAe9d1);

    function _getCurvePoolInfo(ICurve curve, bool haveUnderlying)
        internal
        view
        returns (
            uint256[8] memory balances,
            uint256[8] memory precisions,
            uint256[8] memory rates,
            uint256 amp,
            uint256 fee
        )
    {
        uint256[8] memory underlying_balances;
        uint256[8] memory decimals;
        uint256[8] memory underlying_decimals;

        (
            balances,
            underlying_balances,
            decimals,
            underlying_decimals,
            ,
            /*address lp_token*/
            amp,
            fee
        ) = CURVE_REGISTRY.get_pool_info(address(curve));

        for (uint256 k = 0; k < 8 && balances[k] > 0; k++) {
            precisions[k] =
                10**(18 - (haveUnderlying ? underlying_decimals : decimals)[k]);
            if (haveUnderlying) {
                rates[k] = (underlying_balances[k] * 1e18) / (balances[k]);
            } else {
                rates[k] = 1e18;
            }
        }
    }

    function CurveSelector(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        ICurve curve,
        bool haveUnderlying,
        IERC20[] memory tokens
    ) internal view returns (uint256[] memory rets) {
        rets = new uint256[](parts);

        uint256 i = 0;
        uint256 j = 0;
        for (uint256 t = 0; t < tokens.length; t++) {
            if (fromToken == tokens[t]) {
                i = uint256(t + 1);
            }
            if (destToken == tokens[t]) {
                j = uint256(t + 1);
            }
        }

        if (i == 0 || j == 0) {
            return rets;
        }

        bytes memory data = abi.encodePacked(
            uint256(haveUnderlying ? 1 : 0),
            uint256(i - 1),
            uint256(j - 1),
            Helpers.linearInterpolation100(amount, parts)
        );

        (
            uint256[8] memory balances,
            uint256[8] memory precisions,
            uint256[8] memory rates,
            uint256 amp,
            uint256 fee
        ) = _getCurvePoolInfo(curve, haveUnderlying);

        bool success;
        (success, data) = address(CURVE_CALCULATOR).staticcall(
            abi.encodePacked(
                abi.encodeWithSelector(
                    CURVE_CALCULATOR.get_dy.selector,
                    tokens.length,
                    balances,
                    amp,
                    fee,
                    rates,
                    precisions
                ),
                data
            )
        );

        if (!success || data.length == 0) {
            return rets;
        }

        uint256[100] memory dy = abi.decode(data, (uint256[100]));
        for (uint256 t = 0; t < parts; t++) {
            rets[t] = dy[t];
        }
    }
}