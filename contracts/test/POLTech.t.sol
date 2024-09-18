// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import {POLTech, PoLStakingToken, IBerachainRewardsVault} from "../src/POLTech.sol";

contract POLTechTest is Test {
    POLTech polTech;
    PoLStakingToken stakingToken;
    IBerachainRewardsVault polVault;
    address owner;
    address addr1;
    address addr2;

    function setUp() public {
        owner = address(this);
        addr1 = address(0x123);
        addr2 = address(0x456);

        polTech = new POLTech();
        stakingToken = polTech.stakingToken();
    }

    function testBuyShares() public {
        uint256 sharesToBuy = 10;
        (uint256 buyPrice, uint256 newPrice) = polTech.getBuyPrice(
            addr2,
            sharesToBuy
        );

        vm.deal(addr1, buyPrice);
        vm.prank(addr1);

        vm.expectEmit(true, true, false, true);
        emit POLTech.SharesBought(
            addr1,
            addr2,
            sharesToBuy,
            buyPrice,
            newPrice
        );

        polTech.buyShares{value: buyPrice}(addr2, sharesToBuy);

        uint256 balance = polTech.getSharesBalance(addr1, addr2);
        assertEq(balance, sharesToBuy);

        uint256 actualNewSharePrice = polTech.getSharePrice(addr2);
        assertEq(actualNewSharePrice, newPrice);
        assertGt(actualNewSharePrice, polTech.INITIAL_SHARE_PRICE());
    }

    function testSellShares() public {
        uint256 sharesToBuy = 10;
        (uint256 buyPrice, ) = polTech.getBuyPrice(addr2, sharesToBuy);

        vm.deal(addr1, buyPrice);
        vm.prank(addr1);
        polTech.buyShares{value: buyPrice}(addr2, sharesToBuy);

        uint256 sharesToSell = 5;
        (uint256 saleReturn, uint256 newPrice) = polTech.getSellPrice(
            addr2,
            sharesToSell
        );

        vm.prank(addr1);

        vm.expectEmit(true, true, false, true);
        emit POLTech.SharesSold(
            addr1,
            addr2,
            sharesToSell,
            saleReturn,
            newPrice
        );

        polTech.sellShares(addr2, sharesToSell);

        uint256 balance = polTech.getSharesBalance(addr1, addr2);
        assertEq(balance, sharesToBuy - sharesToSell);

        uint256 actualNewSharePrice = polTech.getSharePrice(addr2);
        assertEq(actualNewSharePrice, newPrice);
    }

    function testBuyPriceIncreases() public view {
        (uint256 price1, ) = polTech.getBuyPrice(addr2, 1);
        (uint256 price10, ) = polTech.getBuyPrice(addr2, 10);
        assertGt(price10, price1 * 10);
    }

    function testSellPriceDecreases() public {
        // First, buy some shares
        uint256 sharesToBuy = 20;
        (uint256 buyPrice, ) = polTech.getBuyPrice(addr2, sharesToBuy);
        vm.deal(addr1, buyPrice);
        vm.prank(addr1);
        polTech.buyShares{value: buyPrice}(addr2, sharesToBuy);

        (uint256 sellPrice1, ) = polTech.getSellPrice(addr2, 1);
        (uint256 sellPrice10, ) = polTech.getSellPrice(addr2, 10);
        assertLt(sellPrice10, sellPrice1 * 10);
    }

    function testGetBuyAndSellPriceConsistency() public {
        // Check consistency when amount is 0
        (uint256 buyTotalCost, uint256 buyEndPrice) = polTech.getBuyPrice(
            addr2,
            0
        );
        (uint256 sellTotalReturn, uint256 sellEndPrice) = polTech.getSellPrice(
            addr2,
            0
        );

        assertEq(buyTotalCost, 0);
        assertEq(sellTotalReturn, 0);
        assertEq(buyEndPrice, sellEndPrice);
        assertEq(buyEndPrice, polTech.INITIAL_SHARE_PRICE());

        // Buy some shares to change the price
        vm.startPrank(addr1);

        uint256 buyAmount = 5;
        (uint256 buyPrice, uint256 newBuyPrice) = polTech.getBuyPrice(
            addr2,
            buyAmount
        );
        vm.deal(addr1, buyPrice);
        polTech.buyShares{value: buyPrice}(addr2, buyAmount);

        // Check new share price
        assertEq(polTech.getSharePrice(addr2), newBuyPrice);

        // Sell the shares
        (uint256 sellPrice, uint256 newSellPrice) = polTech.getSellPrice(
            addr2,
            buyAmount
        );
        polTech.sellShares(addr2, buyAmount);

        // Check price has returned to initial
        assertEq(polTech.getSharePrice(addr2), polTech.INITIAL_SHARE_PRICE());
        assertEq(newSellPrice, polTech.INITIAL_SHARE_PRICE());

        vm.stopPrank();
    }
}

contract MockVault is IBerachainRewardsVault {
    mapping(address => uint256) public balances;

    function delegateStake(address account, uint256 amount) external override {
        balances[account] += amount;
    }

    function delegateWithdraw(
        address account,
        uint256 amount
    ) external override {
        require(balances[account] >= amount, "Not enough balance");
        balances[account] -= amount;
    }

    function balanceOf(
        address account
    ) external view override returns (uint256) {
        return balances[account];
    }

    function getDelegateStake(
        address account,
        address delegate
    ) external view override returns (uint256) {
        return balances[account];
    }
}
