// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";

interface IShell {
    function targetSwap (
        address _origin,
        address _target,
        uint _maxOriginAmount,
        uint _targetAmount,
        uint _deadline
    ) external returns (uint originAmount_);

    function originSwap (
        address _origin,
        address _target,
        uint _originAmount,
        uint _minTargetAmount,
        uint _deadline
    ) external returns (uint);

    function viewOriginSwap (
        address _origin,
        address _target,
        uint _originAmount
    ) external view returns (uint targetAmount_);

    function viewTargetSwap (
        address _origin,
        address _target,
        uint _targetAmount
    ) external view returns (uint originAmount_);
}

contract ShellBTC is PredaDexConsts, IConsts {
    using Flags for uint256;

    address constant internal SHELL_BTC = 0xC2D019b901f8D4fdb2B9a65b5d226Ad88c66EE8D;

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_SHELL_BTC)
    returns(uint256[] memory rets, uint256 gas) {
        (bool exists, bytes memory data) = SHELL_BTC.staticcall(
            abi.encodeWithSelector(
                flags.check(FLAG_BUY) ? IShell(SHELL_BTC).viewTargetSwap.selector : IShell(SHELL_BTC).viewOriginSwap.selector,
                fromToken,
                destToken,
                amount
            )
        );

        if (!exists || data.length == 0) return (new uint256[](parts), 0);

        uint256 returnAmount = abi.decode(data, (uint256));

        return (Helpers.linearInterpolation(returnAmount, parts), 0);
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 flags,
        uint256 minReturn
    ) external payable override returns (uint256 returnAmount) {
        Helpers.approve(fromToken, SHELL_BTC, amount);
        returnAmount = flags.check(FLAG_BUY)
            ? IShell(SHELL_BTC).targetSwap(address(fromToken), address(destToken), minReturn, amount, block.timestamp + 50)
            : IShell(SHELL_BTC).originSwap(address(fromToken), address(destToken), amount, minReturn, block.timestamp + 50);

        return flags.check(FLAG_BUY)
            ? amount
            : returnAmount;
    }

}