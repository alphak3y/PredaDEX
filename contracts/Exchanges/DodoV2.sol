// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";

interface IDODOV2Registry {
    function getDODOPool(address baseToken, address quoteToken) external view returns (address[] memory machines);
}

interface IDODOV2Helper {
    function querySellBase(
        address trader,
        uint256 payBaseAmount
    ) external view  returns (uint256 receiveQuoteAmount,uint256 mtFee);

    function querySellQuote(
        address trader,
        uint256 payQuoteAmount
    ) external view  returns (uint256 receiveBaseAmount,uint256 mtFee);
}

interface IDODOProxy {
    function dodoSwapV2TokenToToken(
        address fromToken,
        address toToken,
        uint256 fromTokenAmount,
        uint256 minReturnAmount,
        address[] memory dodoPairs,
        uint256 directions,
        bool isIncentive,
        uint256 deadLine
    ) external returns (uint256 returnAmount);

    function dodoSwapV2ETHToToken(
        address fromToken,
        address toToken,
        uint256 fromTokenAmount,
        uint256 minReturnAmount,
        address[] memory dodoPairs,
        uint256 directions,
        bool isIncentive,
        uint256 deadLine
    ) external returns (uint256 returnAmount);

    function dodoSwapV2TokenToETH(
        address fromToken,
        address toToken,
        uint256 fromTokenAmount,
        uint256 minReturnAmount,
        address[] memory dodoPairs,
        uint256 directions,
        bool isIncentive,
        uint256 deadLine
    ) external returns (uint256 returnAmount);
}

contract DodoV2 is PredaDexConsts, IConsts {
    IDODOV2Registry constant internal DODO_V2_REGISTRY = IDODOV2Registry(0x72d220cE168C4f361dD4deE5D826a01AD8598f6C);
    IDODOProxy constant internal DODO_V2_PROXY = IDODOProxy(0xa356867fDCEa8e71AEaF87805808803806231FdC);
    address constant internal DODO_V2_APPROVE = 0xCB859eA579b28e02B87A1FDE08d087ab9dbE5149;

    function _mostLiquidDodoV2(
        IERC20 fromToken,
        IERC20 destToken
    )
    internal view
    returns(address bestPool, uint256 liquidity) {
        address[] memory pools = DODO_V2_REGISTRY.getDODOPool(address(fromToken), address(destToken));
        if (pools.length == 0) return (address(0), 0);

        for (uint i; i < pools.length; i++) {
            uint256 tmpLiquidity = fromToken.balanceOf(pools[i]);
            if (tmpLiquidity > liquidity) {
                bestPool = pools[i];
                liquidity = tmpLiquidity;
            }
        }
    }

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_DODODEX_V2) checkFlags(flags, FLAG_DISABLE_DODODEX_ALL)
    returns(uint256[] memory rets, uint256 gas) {
        (address pool, uint256 liquidity) = _mostLiquidDodoV2(fromToken, destToken);

        if (pool == address(0) || liquidity < amount * 10) return (new uint256[](parts), 0);

        (uint256 retPrice,) = IDODOV2Helper(pool).querySellBase(msg.sender, amount);

        return (Helpers.linearInterpolation(retPrice, parts), 0);
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 /*flags*/,
        uint256 minReturn
    ) external payable override returns(uint256 returnAmount) {
        (address pool, ) = _mostLiquidDodoV2(fromToken, destToken);

        address[] memory dodoPair = new address[](1);
        dodoPair[0] = pool;

        Helpers.approve(fromToken, address(DODO_V2_APPROVE), amount);

        returnAmount = IDODOProxy(DODO_V2_PROXY).dodoSwapV2TokenToToken(
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