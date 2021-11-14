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

contract ShellStable is PredaDexConsts, IConsts {
    using Flags for uint256;

    address constant internal SHELL_STABLE = 0x8f26D7bAB7a73309141A291525C965EcdEa7Bf42;

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_SHELL_BTC)
    returns(uint256[] memory rets, uint256 gas) {
        (bool exists, bytes memory data) = SHELL_STABLE.staticcall(
            abi.encodeWithSelector(
                flags.check(FLAG_BUY) ? IShell(SHELL_STABLE).viewTargetSwap.selector : IShell(SHELL_STABLE).viewOriginSwap.selector,
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
        Helpers.approve(fromToken, SHELL_STABLE, amount);
        returnAmount = flags.check(FLAG_BUY)
            ? IShell(SHELL_STABLE).targetSwap(address(fromToken), address(destToken), minReturn, amount, block.timestamp + 50)
            : IShell(SHELL_STABLE).originSwap(address(fromToken), address(destToken), amount, minReturn, block.timestamp + 50);

        return flags.check(FLAG_BUY)
            ? amount
            : returnAmount;
    }

}