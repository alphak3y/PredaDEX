// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";

interface IUniswapV2Exchange {

}

interface IUniswapV2Factory {
   function getPair(IERC20 tokenA, IERC20 tokenB) external view returns (IUniswapV2Exchange pair);
}

interface IUniswapV2Router {
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
}

contract UniswapV2USDC is PredaDexConsts, IConsts {
    using Flags for uint256;
    using UniversalERC20 for IERC20;

    IUniswapV2Factory constant internal FACTORY = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
    IUniswapV2Router constant internal ROUTER = IUniswapV2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    IERC20 constant internal MID_TOKEN = USDC;

    function _quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256[] memory amounts,
        uint256 flags
    ) internal view
    returns (uint256[] memory rets, uint256 gas) {
        rets = new uint256[](amounts.length);

        IUniswapV2Exchange exchange = FACTORY.getPair(fromToken, destToken);

        if (address(exchange) != address(0)) {
            uint256 fromTokenBalance = fromToken.universalBalanceOf(address(exchange));
            uint256 destTokenBalance = destToken.universalBalanceOf(address(exchange));
            for (uint256 i = 0; i < amounts.length; i++) {
                flags.check(FLAG_BUY)
                    ? rets[i] = (amounts[i] * (fromTokenBalance) * (997)) / (destTokenBalance * (1000) + (amounts[i] * (997)))
                    : rets[i] = (amounts[i] * (destTokenBalance) * (997)) / (fromTokenBalance * (1000) + (amounts[i] * (997)));
            }
            return (rets, 50_000);
        }
    }

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_UNISWAP_V2_ALL) checkFlags(flags, FLAG_DISABLE_UNISWAP_V2_USDC)
    returns (uint256[] memory rets, uint256 gas) {
        uint256 gas1;
        uint256 gas2;

        (rets, gas1) = _quote(fromToken, MID_TOKEN, Helpers.linearInterpolation(amount, parts), flags);
        (rets, gas2) = _quote(MID_TOKEN, destToken, rets, flags);
        return (rets, gas1 + gas2);
    }

    function _swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 flags,
        uint256 minReturn
    ) internal returns(uint256 returnAmount) {
        if (fromToken.isETH()) {
            WETH.deposit{value: amount}();
        }

        IERC20 fromTokenReal = fromToken.isETH() ? WETH : fromToken;
        IERC20 toTokenReal = destToken.isETH() ? WETH : destToken;

        address[] memory tokenPath = new address[](2);
        tokenPath[0] = address(fromTokenReal);
        tokenPath[1] = address(toTokenReal);

        fromTokenReal.universalApprove(address(ROUTER), amount);

        returnAmount = flags.check(FLAG_BUY)
            ? ROUTER.swapTokensForExactTokens(
                amount,
                minReturn,
                tokenPath,
                address(this),
                block.timestamp + 50)[1]
            : ROUTER.swapExactTokensForTokens(
                amount,
                minReturn,
                tokenPath,
                address(this),
                block.timestamp + 50)[1];

        if (destToken.isETH()) {
            WETH.withdraw(flags.check(FLAG_BUY) ? amount : returnAmount);
        }

        return flags.check(FLAG_BUY)
            ? amount
            : returnAmount;
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
                0 // TODO: Update minReturn for mid token
            ),
            flags,
            minReturn
        );
    }
}