// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";

interface IBalancerV1Exchange {
    struct Swap {
        address pool;
        address tokenIn;
        address tokenOut;
        uint    swapAmount; // tokenInAmount / tokenOutAmount
        uint    limitReturnAmount; // minAmountOut / maxAmountIn
        uint    maxPrice;
    }

    function viewSplitExactIn(
        address tokenIn,
        address tokenOut,
        uint swapAmount,
        uint nPools
    )
        external view
        returns (Swap[] memory swaps, uint totalOutput);

    function viewSplitExactOut(
        address tokenIn,
        address tokenOut,
        uint swapAmount,
        uint nPools
    )
        external view
        returns (Swap[] memory swaps, uint totalOutput);
}

interface IBalancerV1Pool {
    function getSwapFee() // TODO: implment swap fee calculations prior to return
        external view returns (uint256 balance);

    function swapExactAmountIn(
        IERC20 tokenIn,
        uint256 tokenAmountIn,
        IERC20 tokenOut,
        uint256 minAmountOut,
        uint256 maxPrice
    )
        external
        returns (uint256 tokenAmountOut, uint256 spotPriceAfter);

    function swapExactAmountOut(
        IERC20 tokenIn,
        uint256 maxAmountIn,
        IERC20 tokenOut,
        uint256 tokenAmountOut,
        uint256 maxPrice
    )
        external
        returns (uint256 tokenAmountIn, uint256 spotPriceAfter);
}

interface IBalancerV1Registry {
    function getBestPoolsWithLimit(address fromToken, address destToken, uint256 limit)
        external view returns(address[] memory pools);
}

contract BalancerV1 is PredaDexConsts, IConsts {
    using Flags for uint256;

    IBalancerV1Registry constant internal BALANCER_V1_REGISTRY = IBalancerV1Registry(0x7226DaaF09B3972320Db05f5aB81FF38417Dd687);
    IBalancerV1Exchange constant internal BALANCER_V1_EXCHANGE = IBalancerV1Exchange(0x3E66B66Fd1d0b02fDa6C811Da9E0547970DB2f21);

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_BALANCER_ALL) checkFlags(flags, FLAG_DISABLE_BALANCER_V1)
    returns (uint256[] memory rets, uint256 gas) {
        address[] memory pool = BALANCER_V1_REGISTRY.getBestPoolsWithLimit(address(fromToken), address(destToken), 4/* TODO: arbitrary value*/);

        if (pool.length == 0) return (new uint256[](parts), 0);
        if (fromToken.balanceOf(pool[0]) < amount * 10) return (new uint256[](parts), 0);

        // TODO: this is a workaround to a problem where viewSplitExactIn/Out will not select the best pool that we find above
        /*******
         * For example: The pool that returns from getBestPoolsWithLimit for pair WETH => UNI is
         * 0xbed340a301b4f07fa7b61ab9e0767faa172f530d which has over $500k liquidity.
         * When the same pair is used in viewSplitExactIn I would expect it to find the best/same pool
         * and get a quote based off that. But in this case, the function is trying to get a quote from
         * 0x1be4c2afd3705cbe6dbbe45b1f87a637616683f5 which has $0.02 liquidity,
         * and causes the call to revert with ERR_DIV_ZERO
         * Response from Balancer devs: https://discord.com/channels/638460494168064021/638465986839707660/892873748716355594
         * must join Balancer discord to view
         ********/
        (bool exists, bytes memory data) = address(BALANCER_V1_EXCHANGE).staticcall(
            abi.encodeWithSelector(
                flags.check(FLAG_BUY)
                    ? BALANCER_V1_EXCHANGE.viewSplitExactOut.selector
                    : BALANCER_V1_EXCHANGE.viewSplitExactIn.selector,
                address(fromToken),
                address(destToken),
                amount,
                4/* TODO: arbitrary value*/
            )
        );

        if (!exists) return (new uint256[](parts), 0);

        (,uint256 decodedAmount) = abi.decode(data, (IBalancerV1Exchange.Swap,uint256));
        // if (destToken.universalBalanceOf(pool[0]) < decodedAmount * 10) return (new uint256[](parts), 0);

        return (Helpers.linearInterpolation(decodedAmount, parts), 140_000); // TODO: come back to estimate gas
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 flags,
        uint256 /*minReturn*/
    ) external payable override returns (uint256 returnAmount) {
        address[] memory pool = BALANCER_V1_REGISTRY.getBestPoolsWithLimit(address(fromToken), address(destToken), 4/* TODO: arbitrary value*/);
        Helpers.approve(fromToken, pool[0], amount);

        (returnAmount, ) = flags.check(FLAG_BUY)
            ? IBalancerV1Pool(pool[0]).swapExactAmountOut(fromToken, amount, destToken, 1, 2**256 - 1) // TODO: come back to this value (maxPrice)
            : IBalancerV1Pool(pool[0]).swapExactAmountIn(fromToken, amount, destToken, 1, 2**256 - 1); // TODO: come back to this value (maxPrice)

        return flags.check(FLAG_BUY)
            ? amount
            : returnAmount;
    }
}