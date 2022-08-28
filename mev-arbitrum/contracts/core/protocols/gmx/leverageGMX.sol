// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.6.12;

import "gmx-contracts/contracts/core/Vault.sol";
import "gmx-contracts/contracts/core/Router.sol";
import "gmx-contracts/contracts/core/interfaces/IVaultPriceFeed.sol";
import "gmx-contracts/contracts/core/interfaces/IVault.sol";
import "gmx-contracts/contracts/core/interfaces/IVaultUtils.sol";
import "gmx-contracts/contracts/core/interfaces/IRouter.sol";
import "gmx-contracts/contracts/peripherals/Reader.sol";
import "gmx-contracts/contracts/core/PositionRouter.sol";
import "gmx-contracts/contracts/core/PositionManager.sol";
import "hardhat/console.sol";

// change to arbitrum
contract leverageGMX {
    Vault private vault = Vault(0x489ee077994B6658eAfA855C308275EAd8097C4A);
    IVault private _vault = IVault(0x489ee077994B6658eAfA855C308275EAd8097C4A);
    IRouter private router =
        IRouter(0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064);
    Reader private reader = Reader(0x22199a49A999c351eF7927602CFB187ec3cae489);
    PositionManager private manager =
        PositionManager(0x87a4088Bd721F83b6c2E5102e2FA47022Cb1c831);
    PositionRouter private position_router =
        PositionRouter(0x3D6bA331e3D9702C5e8A8d254e5d8a285F223aba);
    address private constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;

    // Get Prices
    function getPriceFeedGMX() public view returns (address) {
        return vault.priceFeed();
    }

    function getPriceOnGMX(address asset) external view returns (uint256) {
        address priceFeedAddress = getPriceFeedGMX();
        IVaultPriceFeed vaultPrices = IVaultPriceFeed(priceFeedAddress);
        return vaultPrices.getPrice(asset, false, false, false);
    }

    // will edit this after finishing Positions
    function getTokensAvailableInGMXPool(address asset)
        external
        view
        returns (uint256 amountAvailable)
    {
        //- *For shorts, the query would depend on the stablecoin token used to open the position.*
        uint256 poolAmount = vault.poolAmounts(asset);

        uint256 reservedAmount = vault.reservedAmounts(asset);

        amountAvailable = poolAmount - reservedAmount;
        return amountAvailable;
    }

    function GetUserPositionsOnGMXPool(address asset) external {
        // https://gmxio.gitbook.io/gmx/contracts#positions-list
    }

    //
    function fee() public view returns (uint256) {
        return position_router.minExecutionFee();
    }

    receive() external payable {}

    // open position => Flash Loan to long or short asset pay back earned funds
    // approve router to amount to deposit
    // PositionManager.increasePosition() = partner contracts
    // PositionRouter.createIncreasePosition() = can be used by any contract and will request the position to be opened, a keeper will then execute this request
    // PositionRouter.createIncreasePosition() = has the same input parameters but additionally has an executionFee value that can be set to PositionRouter.minExecutionFee

    // PositionManager.increasePosition(path, indexToke, amountIn, minOut, sizeDelta, isLong, price)

    function OpenPositionGMX(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount,
        uint256 minOut,
        uint256 _sizeDelta,
        bool _isLong,
        uint256 _acceptablePrice,
        uint256 _executionFee
    ) external payable {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amount);
        IERC20(_tokenIn).approve(
            0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064,
            _amount
        );

        address[] memory path;
        path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;

        position_router.createIncreasePosition(
            path,
            _tokenOut,
            _amount,
            minOut,
            _sizeDelta,
            _isLong,
            _acceptablePrice,
            _executionFee,
            0
        );
    }
    /**
    // * Long  => earn profit if tokwn price goes up
    // * Short => earn profit if tokwn price goes down
    // * track for manage => entryPrice, exitPrice, liquidationPrice *
    trading fee = 0.1% of position size
    closing fee = 0.1% of position size
    borrow fee = paid to counter-party of our trade every hour([(asset borrowed)/(total assets in pools) * 0.01%])
        // call manage position()
     */
    //////////////////////////////////////
    // PositonManger
    // Increase (internal)
    // Decrease (internal)
    // start here => https://gmxio.gitbook.io/gmx/trading#managing-positions
    // manage position (internal)
    // * Will manage and watch price of asset and stop_loss()
    // deposit or withdraw more
    /**
        -> will take a snapshot of entryPrice
        -> Leverage for a position is displayed = (position size) / (position collateral) or (position size + PnL) / (position collateral),
         */
    // * Will Compare to the
    //////////////////////////////////////
    // stop - loss (external)
    // -> triggers set off based on a set price...also need to be shut down manually
    /**
    Take Profit
    Note that orders are not guaranteed to execute, this can occur in a few situations including but not exclusive to:
    - The mark price which is an aggregate of exchange prices did not reach the specified price
    - The specified price was reached but not long enough for it to be executed
    - No keeper picked up the order for execution 
    - Additionally, trigger orders are market orders and are not guaranteed to execute at the trigger price.
     */
    // close position =>  pay back w/ asset long/shorted earned funds
    //      short is paid out in => usdc or usdt
    //////////////////////////////////////
    //////////////////////////////////////
    // Liqudations => (collateral - losses - borrow fee) is less than 1% of position
    //////////////////////////////////////
    // Pricing => No price impact for trades...execute trades at mark price [price api for chainlink => https://api.gmx.io/prices]
    // Stats per assets => [https://gmxio.gitbook.io/gmx/api]
    // Execution Fee => for all transactions
}
