// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";

interface IDODOV1Registry {
    function getDODO(address baseToken, address quoteToken) external view returns (address);
}

interface IDODOV1Helper {
    function querySellQuoteToken(address dodoV1Pool, uint256 quoteAmount) external view returns (uint256 receivedBaseAmount);
    function querySellBaseToken(address dodoV1Pool, uint256 baseAmount) external view returns (uint256 receivedQuoteAmount);
}

interface IDODOProxy {
    function dodoSwapV1(
        address fromToken,
        address toToken,
        uint256 fromTokenAmount,
        uint256 minReturnAmount,
        address[] memory dodoPairs,
        uint256 directions,
        bool,
        uint256 deadLine
    ) external payable returns (uint256 returnAmount);
}

contract DodoV1 is PredaDexConsts, IConsts {
    using Flags for uint256;

    IDODOV1Helper constant internal DODO_V1_HELPER = IDODOV1Helper(0x533dA777aeDCE766CEAe696bf90f8541A4bA80Eb);
    IDODOV1Registry constant internal DODO_V1_REGISTRY = IDODOV1Registry(0x3A97247DF274a17C59A3bd12735ea3FcDFb49950);
    IDODOProxy constant internal DODO_V1_PROXY = IDODOProxy(0xa356867fDCEa8e71AEaF87805808803806231FdC);
    address constant internal DODO_V1_APPROVE = 0xCB859eA579b28e02B87A1FDE08d087ab9dbE5149;

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_DODODEX_V1) checkFlags(flags, FLAG_DISABLE_DODODEX_ALL)
    returns(uint256[] memory rets, uint256 gas) {
        address pool = address(fromToken) > address(destToken)
            ? DODO_V1_REGISTRY.getDODO(address(fromToken), address(destToken))
            : DODO_V1_REGISTRY.getDODO(address(destToken), address(fromToken));
        if (pool == address(0) || fromToken.balanceOf(pool) < amount * 10) return (new uint256[](parts), 0);

        uint256 returnAmount = flags.check(FLAG_BUY)
            ? DODO_V1_HELPER.querySellBaseToken(pool, amount)
            : DODO_V1_HELPER.querySellQuoteToken(pool, amount);

        return (Helpers.linearInterpolation(returnAmount, parts), 0);
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 /*flags*/,
        uint256 minReturn
    ) external payable override returns (uint256 returnAmount) {
        address pool = address(fromToken) > address(destToken)
           ? DODO_V1_REGISTRY.getDODO(address(fromToken), address(destToken))
           : DODO_V1_REGISTRY.getDODO(address(destToken), address(fromToken));

        address[] memory dodoPair = new address[](1);
        dodoPair[0] = pool;

        Helpers.approve(fromToken, address(DODO_V1_APPROVE), amount);

        returnAmount = IDODOProxy(DODO_V1_PROXY).dodoSwapV1(
            address(fromToken),
            address(destToken),
            amount,
            minReturn,
            dodoPair,
            0,
            false,
            block.timestamp + 50
        );
    }

}