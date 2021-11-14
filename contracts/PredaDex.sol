// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./libraries/UniversalERC20.sol";
import "./interfaces/IPredaDex.sol";
import "./Exchanges/PredaDexConsts.sol";
import "./interfaces/IExchanges.sol";
import "hardhat/console.sol";

contract PredaDex is IPredaDex, PredaDexConsts {
    using UniversalERC20 for IERC20;
    using Flags for uint256;

    mapping(bytes32 => GroupData) internal groupData;
    uint256[] internal groupIndexes;
    mapping(address => UserData) internal userData;

    address internal _owner;
    address[] internal _exchanges;
    address internal deployed;

    constructor(address _contractOwner) payable {
        _owner = _contractOwner;
        deployed = address(this);
    }

    function _checkGasRequirements(uint256 gasUsed) internal view returns (uint256 gasRequirement) {
        // TODO: Validate time && answer
        ( /*uint80 roundId*/,
        // If answer is negative something has gone wrong
        // We require answer to be positive
            int256 answer, // Answer is the amount (wei) that is estimated for a ETH Transfer (21,000 gas)
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = GAS_ESTIMATOR.latestRoundData();

        // Using e In solidity
        uint256 eN = 271828;
        uint256 eD = 100000;

        // Curve algorithm :  e ^ -(x/1.3)
        gasRequirement = (uint256(answer) * (1 + ((1 / (eN / eD)) ** (uint256(answer) / uint256(130_000_000_000))))) / 21_000 * gasUsed;
    }

    function addExchanges(address[] memory newExchanges) external override {
        require(msg.sender == _owner, "Only Owner is allowed.");
        for (uint i; i < newExchanges.length; i++) {
            _exchanges.push(newExchanges[i]);
        }
    }

    function removeExchange(address exchangeToRemove) external override {
        require(msg.sender == _owner, "Only Owner is allowed.");
        for (uint exchange; exchange < _exchanges.length; exchange++) {
            if (_exchanges[exchange] == exchangeToRemove) {
                // This swaps the position of the last index and the index for removal
                _exchanges[exchange] = _exchanges[_exchanges.length - 1];
                // Then deletes the last index
                _exchanges.pop();
                // This way we never have gaps of 0x00 addresses
            }
        }
    }

    function getExchanges() external override view returns(address[] memory) {
        return _exchanges;
    }

    receive() external payable {} // TODO: Is this needed?

    function checkAssets(address user) external override view returns (UserData memory) {
        return userData[user];
    }

    function checkGroup(bytes32 group) external override view returns (uint192 totalAmount, uint64 totalGas, uint256 gasRequired) {
        // TODO: Params
        ( , , uint256 estimateGasAmount) = this.quoteAndDistribute(IERC20(groupData[group].pair[0]), IERC20(groupData[group].pair[1]), groupData[group].totalAmount, 10, 0, 0);

        gasRequired = _checkGasRequirements(estimateGasAmount);

        // if (group == bytes32(0)) return (distributionData[distributionData[keccak256(abi.encodePacked(fromToken, destToken))].id], gasRequired);
        return (groupData[group].totalAmount, groupData[group].totalGas, gasRequired);
    }

    function withdraw(address withdrawToken, address fromToken, address destToken, uint256 amount) external override {
/*        bytes32 group = keccak256(abi.encodePacked(fromToken, destToken));

        bool post = false;
        uint index = 0;

        for (uint i; i < userData[msg.sender].group.length; i++) {
            if (group == userData[msg.sender].group[i]) {
                post = withdrawToken == fromToken ? false : true;
                index = i;
                break;
            }
        }

        // If the group swap has executed we dont need to modif the group data
        if (post) {
            require(amount <= userData[msg.sender].amount[index], "Not enough token");
            if (amount == userData[msg.sender].amount[index]) {
                delete userData[msg.sender].amount[index];
                delete userData[msg.sender].token[index];
                delete userData[msg.sender].group[index];
            }
            else userData[msg.sender].amount[index] -= amount;
        }
        // But modifying the group data requires more checks
        else {
            if (amount == userData[msg.sender].amount[index]) {
                delete userData[msg.sender].amount[index];
                delete userData[msg.sender].token[index];
                delete userData[msg.sender].group[index];
            }
            else userData[msg.sender].amount[index] -= amount;

            // Clean the distributionData
            uint256 tmpAmount;

            for (uint user; user < distributionData[group].sender.length; user++) {
                if (distributionData[group].sender[user] == msg.sender) tmpAmount += distributionData[group].amount[user];

                if (tmpAmount == amount) {
                    delete distributionData[group].sender[user];
                    delete distributionData[group].amount[user];
                    break;
                }
                else if (tmpAmount > amount) {
                    distributionData[group].amount[user] -= (tmpAmount - distributionData[group].amount[user]);
                    tmpAmount -= distributionData[group].amount[user];
                    break;
                }
                else {
                    delete distributionData[group].sender[user];
                    delete distributionData[group].amount[user];
                }
            }
            require (tmpAmount == amount, "Issue determining amount");

            distributionData[0].totalAmount -= amount;
        }

        // TODO: Check allowance
        IERC20(withdrawToken).universalTransfer(msg.sender, amount);
*/
    }

    // TODO: Optimize gas for this function
    function deposit(
        address fromToken,
        address destToken,
        uint192 amount
    ) external override payable {
        // This cant be used delegatly
        require(address(this) == deployed, "Cannot be delegate");
        uint64 userGas = IERC20(fromToken).isETH()
            ? uint64(msg.value - amount)
            : uint64(msg.value);

        bytes32 pairGroup = keccak256(abi.encodePacked(fromToken, destToken));

        groupData[pairGroup].totalGas += userGas;
        groupData[pairGroup].totalAmount += amount;
        groupData[pairGroup].user[msg.sender] += amount;
        groupData[pairGroup].userIndexes.push(msg.sender);
        // groupData[pairGroup].user.push(msg.sender);
        if (groupData[pairGroup].pair[0] == address(0)) {
            groupIndexes.push(uint256(pairGroup));
            groupData[pairGroup].pair[0] = fromToken;
            groupData[pairGroup].pair[1] = destToken;
        }

        IERC20(fromToken).universalTransferFrom(msg.sender, address(this), amount);

        // TODO: Emit event on deposit?
    }

    function checkUpkeep(bytes calldata data) external override view returns (bool upkeepNeeded, bytes memory performData) {
        // TestData[] memory results = new TestData[](6);
        bytes[] memory results;
        uint24 counter;

        // TODO: Optimize this, we should distribute upkeep across multiple bots
        // This is a possible attack vector
        for (uint24 i; i < groupIndexes.length; i++) {
            bytes32 group = bytes32(groupIndexes[i]);
            // distributionData is filled sequencially, if the group has no assigned bytes32 then its index does not exist
            if (groupData[group].totalGas == 0) break;

            uint256 parts = 1; // TODO: Find optimal part count
            uint256 flags = 0;
            uint256 slippage = 3;
            uint256 destTokenEthPriceTimesGasPrice = 0;
            (uint256 returnAmount, uint256[] memory distribution, uint256 estimateGasAmount) = this.quoteAndDistribute(IERC20(groupData[group].pair[0]), IERC20(groupData[group].pair[1]), groupData[group].totalAmount, parts, flags, destTokenEthPriceTimesGasPrice);
            // results[counter] = TestData({fromToken: fromToken,
            //                         destToken: destToken,
            //                         amount: distributionData[i].totalAmount,
            //                         minReturn: returnAmount * slippage / 100,
            //                         distribution: distribution});

            uint256 minGas = _checkGasRequirements(estimateGasAmount);

            if (groupData[group].totalGas >= minGas) {
                results[counter] = abi.encode(groupData[group].pair[0], groupData[group].pair[1], groupData[group].totalAmount, returnAmount * slippage / 100, distribution, flags);
                counter++;
            }

        }

        if (results.length > 0) return (true, abi.encode(performData));
        else return (false, performData);
    }
    function performUpkeep(bytes calldata performData) external override {}

    // Allows external distribution calculations
    // Gives oppertunity to externally check for arbitrage oppertunities between multiple dexes
    function quote(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags
    ) external view override returns(uint256[][] memory returnAmounts, uint256[] memory gases) {
        { // Why do we need to specify size?
            uint256 exchangeCount = _exchanges.length;
            // First index is the Exchange, second index is allocated Parts
            returnAmounts = new uint256[][](exchangeCount);
            gases = new uint256[](exchangeCount);
        }

        for (uint exchange; exchange < _exchanges.length; exchange++) {
            (bool success, bytes memory data) = _exchanges[exchange].staticcall(
                abi.encodeWithSelector(
                    IExchanges(_exchanges[exchange]).quote.selector,
                        fromToken,
                        destToken,
                        amount,
                        parts,
                        flags
                )
            );

            if(success) {
                (uint256[] memory returnAmount, uint256 gas) = abi.decode(data, (uint256[], uint256));
                returnAmounts[exchange] = returnAmount;
                // It is expected that gas price calculation is handled elsewhere if this function is being called
                gases[exchange] = gas;
            }
            else {
                returnAmounts[exchange] = new uint256[](parts);
                gases[exchange] = 0;
            }
        }
    }

    function _distribute(
        uint256 parts,
        uint256[][] memory returnAmounts,
        uint256[] memory gases,
        uint256 destTokenEthPriceTimesGasPrice
    ) internal view returns (uint256 returnAmount, uint256[] memory distribution, uint256 estimateGasAmount) {
        // TODO: Rewrite this logic: currently using a *very* basic 2 swap limiter distribution calculation

        distribution = new uint256[](_exchanges.length);

        uint256[] memory bestPartDex = new uint256[](parts + 1);

        for (uint part = parts; part > 0; part--) {
            uint256 bestQuote;
            for (uint dex = 0; dex < returnAmounts.length; dex++) {
                uint256 modifiedDexQuote = returnAmounts[dex][part - 1] - (gases[dex] * destTokenEthPriceTimesGasPrice);
                if (modifiedDexQuote > bestQuote) {
                    bestPartDex[part] = dex;
                    bestQuote = modifiedDexQuote;
                }
            }
        }

        // TODO: rework this workaround
        if (parts == 1) {
            distribution[bestPartDex[parts]] = parts;
            return (returnAmounts[bestPartDex[parts]][parts - 1], distribution, gases[bestPartDex[parts]]);
        }

        uint partPair;

        for (uint part = parts; part > 0; part--) {
            if (bestPartDex[part] != bestPartDex[parts - part]) {
                uint256 modifiedDexQuote = returnAmounts[bestPartDex[part]][part] - (gases[bestPartDex[part]] * destTokenEthPriceTimesGasPrice);
                uint256 modifiedPairQuote = returnAmounts[bestPartDex[parts - part]][parts - part] - (gases[bestPartDex[parts - part]] * destTokenEthPriceTimesGasPrice);
                if ((modifiedDexQuote + modifiedPairQuote) > returnAmount) {
                    returnAmount = modifiedDexQuote + modifiedPairQuote;
                    partPair = part;
                }
            }
        }

        distribution[bestPartDex[partPair]] = partPair;
        distribution[bestPartDex[parts - partPair]] = parts - partPair;
        estimateGasAmount = gases[bestPartDex[partPair]] * destTokenEthPriceTimesGasPrice;
        estimateGasAmount += gases[bestPartDex[parts - partPair]] * destTokenEthPriceTimesGasPrice;
    }

    // Will return optimal* distribution for swap to give best returns on user inputs
    function quoteAndDistribute(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags,
        uint256 destTokenEthPriceTimesGasPrice
    ) external view override returns(uint256 returnAmount, uint256[] memory distribution, uint256 estimateGasAmount) {
        (uint256[][] memory returnAmounts, uint256[] memory gases) = this.quote(fromToken, destToken, amount, parts, flags);
        (returnAmount, distribution, estimateGasAmount) = _distribute(parts, returnAmounts, gases, destTokenEthPriceTimesGasPrice);
    }

    // Fees go to bot wallet for group swap gas execution, and into treasury
    // Takes a distribution and user inputs to preform a dynamic swap
    function swap(
        IERC20 fromToken,
        IERC20 destToken,
        uint256 amount,
        uint256 minReturn,
        uint256[] memory distribution,
        uint256 flags
    ) external payable override returns(uint256 returnAmount) {
        // Check this first so we can group the below logic better
        uint256 parts;
        for (uint exchange; exchange < distribution.length; exchange++) {
            parts += distribution[exchange];
        }
        require(parts > 0, "No parts found");

        // Check if this is a delegate call
        // TODO: There is probably a more optimal way to preform this
        if (address(this) != deployed) {
            require(fromToken.universalBalanceOf(address(this)) >= amount, "Not enough Balance");
        }
        else {
            require(distribution.length == this.getExchanges().length, "Invalid distribution size");
            require(fromToken.universalBalanceOf(msg.sender) >= amount, "Not enough Balance");
            require(fromToken.universalAllowance(msg.sender, address(this)) >= amount, "Not enough allowance");
            require(msg.value == (fromToken.isETH() ? amount : (destToken.isETH() ? amount : 0)), "Wrong ETH usage");
            // We only preform entry transfer if not called delegate
            fromToken.universalTransferFrom(msg.sender, address(this), amount);
        }

        for (uint exchange; exchange < distribution.length; exchange++) {
            if (distribution[exchange] != 0) {
                (bool success, bytes memory data) = _exchanges[exchange].delegatecall(
                    abi.encodeWithSelector(
                        IExchanges(_exchanges[exchange]).swap.selector,
                        fromToken,
                        destToken,
                        amount * distribution[exchange] / parts, // Weighted amount for each swap
                        flags,
                        minReturn * distribution[exchange] / parts // Weighted minReturns for each swap
                    )
                );

                // require(success, abi.decode(returndata, (string))); <-- Caused Hardhat couldnt infer the reason :/
                // If the call failed, revert with the called function's revert data
                // There are other methods, but this works and seemed to be the best of workarounds I found
                // https://ethereum.stackexchange.com/a/86983
                if (!success) {
                    assembly {
                        let ptr := mload(0x40)
                        let revertSize := returndatasize()
                        returndatacopy(ptr, 0, revertSize)
                        revert(ptr, revertSize)
                    }
                }
                uint256 swapReturn = abi.decode(data, (uint256));
                returnAmount += swapReturn;
            }
        }

        require(returnAmount >= minReturn, "Total return was not enough");

        // TODO: There is probably a more optimal way to preform this
        if (address(this) == deployed) {
            // We only need to exit transfer if this is not a delegate call
            destToken.universalTransfer(msg.sender, returnAmount);
        }

        return returnAmount;
    }
}