// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// 0x3D400312Bb3456f4dC06D528B55707F08dFFD664

interface IAggregatorV3 {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}