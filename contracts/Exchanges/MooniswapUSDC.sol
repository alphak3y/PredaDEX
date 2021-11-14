// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";

interface IMooniswapRegistry {
    function pools(IERC20 token1, IERC20 token2) external view returns(IMooniswap);
    function isPool(address addr) external view returns(bool);
}

interface IMooniswap {
    function fee() external view returns (uint256);

    function tokens(uint256 i) external view returns (IERC20);

    function deposit(uint256[] calldata amounts, uint256[] calldata minAmounts) external payable returns(uint256 fairSupply);

    function withdraw(uint256 amount, uint256[] calldata minReturns) external;

    function getBalanceForAddition(IERC20 token) external view returns(uint256);

    function getBalanceForRemoval(IERC20 token) external view returns(uint256);

    function getReturn(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount
    ) external view returns(uint256 returnAmount);

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 minReturn,
        address referral
    ) external payable returns(uint256 returnAmount);
}

contract MooniswapUSDC is PredaDexConsts, IConsts {
    using Flags for uint256;
    using UniversalERC20 for IERC20;

    IMooniswapRegistry constant internal MOONISWAP_REGISTRY = IMooniswapRegistry(0x71CD6666064C3A1354a3B4dca5fA1E2D3ee7D303);
    IERC20 constant internal MID_TOKEN = USDC;

    function _quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256[] memory amounts
    ) internal view returns(uint256[] memory rets, uint256 gas) {
        rets = new uint256[](amounts.length);

        IMooniswap mooniswap = MOONISWAP_REGISTRY.pools(
            fromToken.isETH() ? ZERO_ADDRESS : fromToken,
            destToken.isETH() ? ZERO_ADDRESS : destToken
        );
        if (mooniswap == IMooniswap(address(0))) {
            return (rets, 0);
        }

        uint256 fee = mooniswap.fee();
        uint256 fromBalance = mooniswap.getBalanceForAddition(fromToken.isETH() ? ZERO_ADDRESS : fromToken);
        uint256 destBalance = mooniswap.getBalanceForRemoval(destToken.isETH() ? ZERO_ADDRESS : destToken);
        if (fromBalance == 0 || destBalance == 0) {
            return (rets, 0);
        }

        for (uint i = 0; i < amounts.length; i++) {
            uint256 amount = amounts[i] - (amounts[i] * (fee) / (1e18));
            rets[i] = amount * (destBalance) / (
                fromBalance + (amount)
            );
        }

        return (rets, (fromToken.isETH() || destToken.isETH()) ? 80_000 : 110_000);
    }

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_MOONISWAP_ALL) checkFlags(flags, FLAG_DISABLE_MOONISWAP_DAI)
    returns(uint256[] memory rets, uint256 gas) {
        if (fromToken.isETH() || destToken.isETH()) {
            return (new uint256[](parts), 0);
        }

        (uint256[] memory results, uint256 gas1) = _quote(fromToken, MID_TOKEN, Helpers.linearInterpolation(amount, parts));
        (rets, gas) = _quote(MID_TOKEN, destToken, results);
        gas += gas1;
    }

    function _swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 /*flags*/,
        uint256 minReturn
    ) internal returns (uint256 returnAmount) {
        IMooniswap mooniswap = MOONISWAP_REGISTRY.pools(
            fromToken.isETH() ? ZERO_ADDRESS : fromToken,
            destToken.isETH() ? ZERO_ADDRESS : destToken
        );

        Helpers.approve(fromToken, address(mooniswap), amount);

        if(fromToken.isETH()) {
            returnAmount = mooniswap.swap{value: amount}(
                fromToken.isETH() ? ZERO_ADDRESS : fromToken,
                destToken.isETH() ? ZERO_ADDRESS : destToken,
                amount,
                minReturn,
                0x68a17B587CAF4f9329f0e372e3A78D23A46De6b5 // TODO: update this address (referral)
            );
        }
        else {
            returnAmount = mooniswap.swap{value: 0}(
                fromToken.isETH() ? ZERO_ADDRESS : fromToken,
                destToken.isETH() ? ZERO_ADDRESS : destToken,
                amount,
                minReturn,
                0x68a17B587CAF4f9329f0e372e3A78D23A46De6b5 // TODO: update this address (referral)
            );
        }
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 flags,
        uint256 minReturn
    ) external payable override returns (uint256 returnAmount) {
        returnAmount = _swap(
            MID_TOKEN,
            destToken,
            _swap(
                fromToken,
                MID_TOKEN,
                amount,
                flags,
                0 // TODO: Update minReturn for midToken swap
            ),
            flags,
            minReturn
        );
    }
}