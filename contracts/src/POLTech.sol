// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface IBerachainRewardsVaultFactory {
    function createRewardsVault(
        address stakingToken
    ) external returns (address);
}

interface IBerachainRewardsVault {
    function delegateStake(address account, uint256 amount) external;
    function delegateWithdraw(address account, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function getDelegateStake(
        address account,
        address delegate
    ) external view returns (uint256);
}

contract PoLStakingToken is ERC20, Ownable {
    constructor(
        address polTechContract
    ) ERC20("PoL Staking Token", "PoLST") Ownable(polTechContract) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}

contract POLTech {
    using Math for uint256;

    mapping(address => mapping(address => uint256)) public sharesBalance;
    mapping(address => uint256) public sharePrice;
    mapping(address => uint256) public sharesSupply;

    IBerachainRewardsVault public immutable polVault;
    PoLStakingToken public immutable stakingToken;

    uint256 public constant INITIAL_SHARE_PRICE = 1e17; // 0.1 BERA
    uint256 public constant SHARE_PRICE_MULTIPLIER = 11e17; // 1.1
    uint256 public constant SHARE_PRICE_DIVIDER = 9e17; // 0.9

    event SharesBought(
        address indexed buyer,
        address indexed subject,
        uint256 amount,
        uint256 price
    );
    event SharesSold(
        address indexed seller,
        address indexed subject,
        uint256 amount,
        uint256 price
    );

    constructor() {
        address vaultFactory = 0x2B6e40f65D82A0cB98795bC7587a71bfa49fBB2B;

        stakingToken = new PoLStakingToken(address(this));

        polVault = IBerachainRewardsVault(
            IBerachainRewardsVaultFactory(vaultFactory).createRewardsVault(
                address(stakingToken)
            )
        );
    }

    function buyShares(address subject, uint256 amount) external payable {
        require(amount > 0, "Must buy at least 1 share");
        (uint256 buyPrice, uint256 newPrice) = getBuyPrice(subject, amount);
        require(msg.value >= buyPrice, "Insufficient payment");

        sharesBalance[msg.sender][subject] += amount;
        sharesSupply[subject] += amount;

        // Update share price to the new price after purchase
        sharePrice[subject] = newPrice;

        // Mint and stake according to the value of shares bought
        stakingToken.mint(address(this), buyPrice);
        stakingToken.approve(address(polVault), buyPrice);
        polVault.delegateStake(msg.sender, buyPrice);

        emit SharesBought(msg.sender, subject, amount, sharePrice[subject]);

        // Refund excess payment
        if (msg.value > buyPrice) {
            (bool success, ) = msg.sender.call{value: msg.value - buyPrice}("");
            require(success, "Transfer failed");
        }
    }

    function sellShares(address subject, uint256 amount) external {
        require(
            sharesBalance[msg.sender][subject] >= amount,
            "Not enough shares"
        );

        (uint256 saleReturn, uint256 newPrice) = getSellPrice(subject, amount);

        sharesBalance[msg.sender][subject] -= amount;
        sharesSupply[subject] -= amount;

        // Update share price to the new price after sale
        sharePrice[subject] = newPrice;

        // Withdraw and burn tokens
        polVault.delegateWithdraw(msg.sender, saleReturn);
        stakingToken.burn(address(this), saleReturn);

        (bool success, ) = msg.sender.call{value: saleReturn}("");
        require(success, "Transfer failed");

        emit SharesSold(msg.sender, subject, amount, sharePrice[subject]);
    }

    function getBuyPrice(
        address subject,
        uint256 amount
    ) public view returns (uint256 totalCost, uint256 endPrice) {
        totalCost = 0;
        uint256 supply = sharesSupply[subject];
        uint256 price = supply == 0 ? INITIAL_SHARE_PRICE : sharePrice[subject];

        for (uint256 i = 0; i < amount; i++) {
            totalCost += price;
            price = (price * SHARE_PRICE_MULTIPLIER) / 1e18;
        }

        return (totalCost, price);
    }

    function getSellPrice(
        address subject,
        uint256 amount
    ) public view returns (uint256 totalReturn, uint256 endPrice) {
        require(sharesSupply[subject] >= amount, "Not enough shares in supply");
        totalReturn = 0;
        uint256 price = sharePrice[subject];

        for (uint256 i = 0; i < amount; i++) {
            totalReturn += price;
            price = (price * SHARE_PRICE_DIVIDER) / 1e18;
        }

        return (totalReturn, price);
    }

    function getSharesBalance(
        address user,
        address subject
    ) external view returns (uint256) {
        return sharesBalance[user][subject];
    }

    function getSharePrice(address subject) external view returns (uint256) {
        return
            sharePrice[subject] == 0
                ? INITIAL_SHARE_PRICE
                : sharePrice[subject];
    }

    function getSharesSupply(address subject) external view returns (uint256) {
        return sharesSupply[subject];
    }
}
