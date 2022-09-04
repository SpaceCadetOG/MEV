// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.10;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IUiPoolDataProviderV3} from "@aave/periphery-v3/contracts/misc/interfaces/IUiPoolDataProviderV3.sol";
import {IAToken} from "@aave/core-v3/contracts/interfaces/IAToken.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";
import {IAaveOracle} from "@aave/core-v3/contracts/interfaces/IAaveOracle.sol";
import {ICreditDelegationToken} from "@aave/core-v3/contracts/interfaces/ICreditDelegationToken.sol";
import {IWETHGateway} from "@aave/periphery-v3/contracts/misc/interfaces/IWETHGateway.sol";

import "hardhat/console.sol";

contract AaveDepositBorrow {
    mapping(address => uint256) public totalETHDeposits;
    mapping(address => uint256) public totalDAIBorrows;
    uint256 public dai_eth_price;
    uint256 public eth_dai_price;

    address private poolProvider = 0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb;
    IPoolAddressesProvider provider = IPoolAddressesProvider(poolProvider);
    address public pool_address =
        IPoolAddressesProvider(poolProvider).getPool();
    address public aaveOracle =
        IPoolAddressesProvider(poolProvider).getPriceOracle();
    IAaveOracle oracle = IAaveOracle(aaveOracle);
    IWETHGateway wethGateway =
        IWETHGateway(0xC09e69E79106861dF5d289dA88349f10e2dc6b5C);
    IPool pool = IPool(address(pool_address));
    address public aWETH = 0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8;
    address public DAI = 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1;
    address public constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;

    constructor() {
        dai_eth_price = oracle.getAssetPrice(DAI);
        eth_dai_price = oracle.getAssetPrice(WETH);
    }

    receive() external payable {}

    /// @notice Function to deposit ETH collateral into Aave and immediately borrow maximum safe amount of DAI
    /// @dev DepositBorrow event emitted if successfully borrows

    function DepositETH(uint256 safeMaxDAIBorrow) external payable {
        uint16 rc = 0;
        uint256 rate = 2;
        address onBehalfOf = msg.sender;

        wethGateway.depositETH{value: msg.value}(pool_address, onBehalfOf, rc);
        console.log("Deposit");

        (
            uint totalCollateralBase,
            ,
            uint256 availableBorrowsBase,
            ,
            ,

        ) = IPool(pool).getUserAccountData(msg.sender);
        // return (
        //     totalCollateralBase,
        //     totalDebtBase,
        //     availableBorrowsBase,
        //     currentLiquidationThreshold,
        //     ltv,
        //     healthFactor
        // );

        console.log(availableBorrowsBase);
        // ICreditDelegationToken(aWETH).approveDelegation(address(this), safeMaxDAIBorrow);
        pool.borrow(DAI, safeMaxDAIBorrow, rate, rc, onBehalfOf);
        console.log("Borrow");
        totalDAIBorrows[msg.sender] =
            totalDAIBorrows[msg.sender] +
            safeMaxDAIBorrow;

        IERC20 dai = IERC20(DAI);
        require(IERC20(dai).transfer(msg.sender, safeMaxDAIBorrow));
    }

    function WithdrawETH(uint256 amount) external payable {
        uint16 rc = 0;
        uint256 rate = 2;
        address onBehalfOf = msg.sender;

        // approve balance of aToken
        IAToken(aWETH).approve(address(this), amount);
        console.log("approved");
        wethGateway.withdrawETH(pool_address, amount, msg.sender);
        console.log("withdrawn");

        (
            uint totalCollateralBase,
            ,
            uint256 availableBorrowsBase,
            ,
            ,

        ) = IPool(pool).getUserAccountData(msg.sender);
        // return (
        //     totalCollateralBase,
        //     totalDebtBase,
        //     availableBorrowsBase,
        //     currentLiquidationThreshold,
        //     ltv,
        //     healthFactor
        // );

        console.log(availableBorrowsBase);
        // pool.borrow(DAI, safeMaxDAIBorrow, rate, rc, onBehalfOf);
        // console.log("Borrow");
        // totalDAIBorrows[msg.sender] =
        //     totalDAIBorrows[msg.sender] +
        //     safeMaxDAIBorrow;

        // IERC20 dai = IERC20(DAI);
        // require(IERC20(dai).transfer(msg.sender, safeMaxDAIBorrow));
    }
}
