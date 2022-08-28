// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.10;
// change to arbitrum
// https://www.youtube.com/watch?v=AMAMvKc-O2s&t=575s
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IUiPoolDataProviderV3} from "@aave/periphery-v3/contracts/misc/interfaces/IUiPoolDataProviderV3.sol";
import {IAToken} from "@aave/core-v3/contracts/interfaces/IAToken.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";
import "hardhat/console.sol";
import {IAaveOracle} from "@aave/core-v3/contracts/interfaces/IAaveOracle.sol";
import {ICreditDelegationToken} from "@aave/core-v3/contracts/interfaces/ICreditDelegationToken.sol";

contract AaveLendingV3 {
    address private poolProvider = 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb;
    IPoolAddressesProvider provider = IPoolAddressesProvider(poolProvider);
    address private pool = IPoolAddressesProvider(poolProvider).getPool();
    address private aaveOracle =
        IPoolAddressesProvider(poolProvider).getPriceOracle();
    IAaveOracle oracle = IAaveOracle(aaveOracle);
    address internal Owner;

    constructor(address _Owner) {
        Owner = _Owner;
    }

    function GetPriceOnAave(address asset) external view returns (uint256) {
        return oracle.getAssetPrice(asset);
        // price comes out in wei
    }

    function GetPricesOnAave(address asset1, address asset2)
        external
        view
        returns (uint256[] memory)
    {
        address[] memory assets;
        assets = new address[](2);
        assets[0] = asset1;
        assets[1] = asset2;

        return oracle.getAssetsPrices(assets);
        // price comes out in wei
    }

    // get reserve data
    function AaveReserveData(address asset)
        external
        view
        returns (DataTypes.ReserveData memory)
    {
        DataTypes.ReserveData memory data = IPool(pool).getReserveData(asset);
        return (data);
    }

    // getReservesList
    function AaveReserveList() external view returns (address[] memory) {
        return IPool(pool).getReservesList();
    }

    // getUserAccountData ... break this down w/ {currentLiquidationThreshold, ltv, healthFactor}
    function UserAccountData(address user)
        external
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        (
            totalCollateralBase,
            totalDebtBase,
            availableBorrowsBase,
            currentLiquidationThreshold,
            ltv,
            healthFactor
        ) = IPool(pool).getUserAccountData(user);
        return (
            totalCollateralBase,
            totalDebtBase,
            availableBorrowsBase,
            currentLiquidationThreshold,
            ltv,
            healthFactor
        );
    }

    // Supply => https://docs.aave.com/developers/core-contracts/pool#supply
    function Supply(address asset, uint256 amount) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        console.log(
            "Contract transfering amount of:",
            amount / 1e18,
            "to contract"
        );
        IERC20(asset).approve(pool, amount);
        console.log("Depositing", amount / 1e18, "tokens to aave");
        IPool(pool).deposit(asset, amount, msg.sender, 0);
        IPool(pool).setUserUseReserveAsCollateral(asset, true);
        console.log("Deposit Complete!");
    }

    // Withdraw => https://docs.aave.com/developers/core-contracts/pool#withdraw
    function Withdraw(address asset, uint256 amount) external {
        console.log(
            "Contract withdraw amount of:",
            amount / 1e18,
            "from contract"
        );

        IAToken(asset).approve(pool, amount);
        IPool(pool).withdraw(asset, amount, msg.sender);

        console.log("Withdraw Complete!");
    }

    // Borrow => https://docs.aave.com/developers/core-contracts/pool#borrow
    function Borrow(
        address asset,
        address d_asset,
        uint256 amount
    ) external {
        console.log(
            "Contract borrow amount of:",
            amount / 1e18,
            "from contract"
        );
        ICreditDelegationToken(d_asset).approveDelegation(msg.sender, amount);
        // IERC20(asset).approve(pool, amount);
        IPool(pool).borrow(asset, amount, 1, 0, msg.sender);

        console.log("Borrow Complete!");
    }

    function Repay(
        address asset,
        address d_asset,
        uint256 amount
    ) external {
        console.log(
            "Contract borrow amount of:",
            amount / 1e18,
            "from contract"
        );
        ICreditDelegationToken(d_asset).approveDelegation(msg.sender, amount);
        // IERC20(asset).approve(pool, amount);
        IPool(pool).repay(asset, amount, 1, msg.sender);
        IPool(pool).repayWithATokens(asset, amount, 1);

        console.log("Borrow Complete!");
    }
}

// https://github.com/flashbots/mev-job-board/blob/main/specs/aave-liquidations.md
contract AaveLiquidation {
    // https://docs.aave.com/developers/core-contracts/pool#liquidationcall
    address private poolProvider = 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb;
    IPoolAddressesProvider provider = IPoolAddressesProvider(poolProvider);
    address private pool = IPoolAddressesProvider(poolProvider).getPool();
    address private aaveOracle =
        IPoolAddressesProvider(poolProvider).getPriceOracle();
    IAaveOracle oracle = IAaveOracle(aaveOracle);
    address internal Owner;

    // getReservesList

    constructor(address _Owner) {
        Owner = _Owner;
    }

    function Liquidate(address asset, uint256 amount) external {
        console.log(
            "Contract liquidation collateral amount of:",
            amount / 1e18,
            "from contract"
        );
        (
            address collateral, // can be any token
            address debt, // can be any token
            address user, // user to pay debt for
            uint256 debtToCover, // amount to cover debt
            bool receiveAToken // do you want to recieve reward in aToken
        ) = (pool, asset, msg.sender, amount, true);
        IERC20(asset).approve(pool, debtToCover);
        IPool(pool).liquidationCall(
            collateral,
            debt,
            user,
            debtToCover,
            receiveAToken
        );

        console.log("Liquidation Complete!");
    }
}

contract AaveLeverage {
    // Long
    // Short
}

contract AaveFlashLoan {

}
/**
step 0 => get Wrapped or Check balance
	Check token Balance for both wrapped eth
	we need to get WETH or WAVAX()
steps 1 Deposit
	we need to get the account that will be sending the transaction
	We must connect to the aave pool
	We need to Deposit
steps 2 Borrow
	we need to get the account that will be sending the transaction
	we need to get borrow Data(How much we can borrow)
	we need to price of DAI or Other
	We must borrow DAI
	We need to Deposit
steps 3 Repay
	we need to get the account that will be sending the transaction
	we need to get borrow Data(How Much We Owe)
	we need approve tokens
	We must connect to the aave pool
	We need to Deposit
 */
