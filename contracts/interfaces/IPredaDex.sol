// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPredaDex {
    // TODO: Optimize
    struct GroupData {
        uint192 totalAmount;
        uint64 totalGas;
        address[] userIndexes;
        address[2] pair;
        mapping(address => uint256) user;
    }
    struct UserData {
        uint256[] amount;
        address[] token;
        bytes32[] group;
    }

    function addExchanges(address[] memory newExchanges) external;
    function removeExchange(address exchangeToRemove) external;
    function getExchanges() external view returns(address[] memory);

    function checkAssets(address user) external view returns (UserData memory);

    function checkGroup(bytes32 group) external view returns (uint192 totalAmount, uint64 totalGas, uint256 gasRequired);

    function withdraw(
        address withdrawToken,
        address fromToken,
        address destToken,
        uint256 amount
    ) external;

    function deposit(
        address fromToken,
        address destToken,
        uint192 amount
    ) external payable;

    function checkUpkeep(bytes calldata data) external view returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;

    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    ) external view returns(uint256[][] memory returnAmounts, uint256[] memory gases);

    function quoteAndDistribute(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags,
        uint256 destTokenEthPriceTimesGasPrice
    ) external view returns(uint256 returnAmount, uint256[] memory distribution, uint256 gas);

    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 minReturn,
        uint256[] memory distribution,
        uint256 flags
    ) external payable returns(uint256 returnAmount);
}