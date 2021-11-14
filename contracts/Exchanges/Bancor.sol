// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredaDexConsts.sol";

interface IBancorContractRegistry {
    function addressOf(bytes32 contractName) external view returns (address);
}

interface IBancorEtherToken is IERC20 {
    // function deposit() external payable;

    // function withdraw(uint256 amount) external;
}

interface IBancorFinder {
    function buildBancorPath(
        IERC20 fromToken,
        IERC20 destToken
    )
        external
        view
        returns(address[] memory path);
}

interface IBancorNetwork {
    function getReturnByPath(address[] calldata path, uint256 amount)
        external
        view
        returns (uint256 returnAmount, uint256 conversionFee);

    function convert(address[] calldata path, uint256 amount, uint256 minReturn)
        external
        payable
        returns (uint256);
}

interface IBancorNetworkPathFinder {
    function generatePath(IERC20 sourceToken, IERC20 targetToken)
        external
        view
        returns (address[] memory);
}

contract Bancor is PredaDexConsts, IConsts {
    using UniversalERC20 for IERC20;
    IBancorContractRegistry constant internal BANCOR_CONTRACT_REGISTRY = IBancorContractRegistry(0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4);
    IBancorNetworkPathFinder constant internal BANCOR_NETWORK_PATH_FINDER = IBancorNetworkPathFinder(0x6F0cD8C4f6F06eAB664C7E3031909452b4B72861);
    IBancorEtherToken constant internal BANCOR_ETHER_TOKEN = IBancorEtherToken(0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315);
    IBancorFinder constant internal BANCOR_FINDER = IBancorFinder(0x2B344e14dc2641D11D338C053C908c7A7D4c30B9);
    IBancorNetwork internal bancorNetwork = IBancorNetwork(BANCOR_CONTRACT_REGISTRY.addressOf("BancorNetwork"));

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    )
    external override view checkFlags(flags, FLAG_DISABLE_BANCOR)
    returns (uint256[] memory rets, uint256 gas) {
        address[] memory path = BANCOR_FINDER.buildBancorPath(
            fromToken.isETH() ? BANCOR_ETHER_TOKEN : fromToken,
            destToken.isETH() ? BANCOR_ETHER_TOKEN : destToken
        );

        rets = Helpers.linearInterpolation(amount, parts);
        for (uint i = 0; i < parts; i++) {
            (bool success, bytes memory data) = address(bancorNetwork).staticcall{gas: 500000}(
                abi.encodeWithSelector(
                    bancorNetwork.getReturnByPath.selector,
                    path,
                    rets[i]
                )
            );
            if (!success || data.length == 0) {
                for (; i < parts; i++) {
                    rets[i] = 0;
                }
                break;
            } else {
                (uint256 ret,) = abi.decode(data, (uint256,uint256));
                rets[i] = ret;
            }
        }

        return (rets, path.length * (150_000));
    }

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 /*flags*/,
        uint256 /*minReturn*/
    ) external payable override returns (uint256 returnAmount) {
        address[] memory path = BANCOR_NETWORK_PATH_FINDER.generatePath(
            fromToken.isETH() ? BANCOR_ETHER_TOKEN : fromToken,
            destToken.isETH() ? BANCOR_ETHER_TOKEN : destToken
        );

        Helpers.approve(fromToken, address(bancorNetwork), amount);

        if(fromToken.isETH()) {
            returnAmount = bancorNetwork.convert{value: amount}(path, amount, 1);
        }
        else {
            returnAmount = bancorNetwork.convert{value: 0}(path, amount, 1);
        }
    }

}
