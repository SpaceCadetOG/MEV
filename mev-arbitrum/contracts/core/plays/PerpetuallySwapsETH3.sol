// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import "gmx-contracts/contracts/core/Vault.sol";
import "gmx-contracts/contracts/core/interfaces/IVaultPriceFeed.sol";
import "gmx-contracts/contracts/core/interfaces/IVaultUtils.sol";
import "gmx-contracts/contracts/core/Router.sol";
import "gmx-contracts/contracts/peripherals/Reader.sol";
import "contracts/core/protocols/gmx/gmx.sol";
import "hardhat/console.sol";

// import "../lib/UTILS.sol";
// change to arbitrum
contract PerpetuallySwapsETH3 is GMX_STRUCTS {
    Vault private vault = Vault(0x489ee077994B6658eAfA855C308275EAd8097C4A);
    Router private router = Router(0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064);
    Reader private reader = Reader(0x22199a49A999c351eF7927602CFB187ec3cae489);
    address priceFeedAddress = getPriceFeedGMX();
    IVaultPriceFeed vaultPrices = IVaultPriceFeed(priceFeedAddress);

    address private constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address constant ETHER = address(0);

    // create struct func

    // Get Prices
    function getPriceFeedGMX() public view returns (address) {
        // see()
        // get fee of asset
        return gmx_priceFeedAddress;
    }

    function see(uint id) public view returns (EXCHANGE memory) {
        return seeExchangeDetails(id);
    }

    function getPriceOnGMX(address asset) public view returns (uint256) {
        return gmx.vaultPrices.getPrice(asset, false, false, false);
    }

    function getPriceOnMC(address asset) public view returns (uint256) {
        return mc.vaultPrices.getPrice(asset, false, false, false);
    }

    function TokenAmountToUSDMinOnGMX(address _tokenIn, uint256 _amount)
        public
        view
        returns (uint256 amountOut)
    {
        amountOut = gmx.vault.tokenToUsdMin(_tokenIn, _amount);
        return amountOut;
    }

    function TokenAmountToUSDMinOnMC(address _tokenIn, uint256 _amount)
        public
        view
        returns (uint256 amountOut)
    {
        amountOut = mc.vault.tokenToUsdMin(_tokenIn, _amount);
        return amountOut;
    }

    function PotentialProfit(address _tokenIn, uint256 _amount)
        public
        view
        returns (uint256 profit)
    {
        uint256 gmx_amount = TokenAmountToUSDMinOnGMX(_tokenIn, _amount);
        uint256 mc_amount = TokenAmountToUSDMinOnMC(_tokenIn, _amount);

        if (mc_amount > gmx_amount) {
            console.log("GMX => MC trade");
            profit = mc_amount - gmx_amount;
        } else {
            console.log("MC => GMX trade");
            profit = gmx_amount - mc_amount;
        }

        return profit;
    }


    // get amounts out and get amount in
    function getAmountsInOnGMX(address _tokenIn, address _tokenOut)
        external
        view
        returns (uint256)
    {
        return gmx.reader.getMaxAmountIn(vault, _tokenIn, _tokenOut);
    }

    function getAmountsOutOnGMX(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount
    ) public view returns (uint256, uint256) {
        return gmx.reader.getAmountOut(vault, _tokenIn, _tokenOut, _amount);
    }

    function getAmountsInOnMC(address _tokenIn, address _tokenOut)
        external
        view
        returns (uint256)
    {
        return mc.reader.getMaxAmountIn(vault, _tokenIn, _tokenOut);
    }

    function getAmountsOutOnMC(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount
    ) public view returns (uint256, uint256) {
        return mc.reader.getAmountOut(vault, _tokenIn, _tokenOut, _amount);
    }

    // potential trade
    // potential true trade


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

    function swapOnGMX(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amount);
        IERC20(_tokenIn).approve(
            0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064,
            _amount
        );

        address[] memory path;
        if (_tokenIn == WETH || _tokenOut == WETH) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        }
        (uint256 _amountOutMin, ) = getAmountsOutOnGMX(
            path[0],
            path[1],
            _amount
        );
        router.swap(path, _amount, _amountOutMin, msg.sender);
        console.log("Swapped On GMX");
    }
    function swapOnMC(
        address _tokenIn,
        address _tokenOut,
        uint256 _amount
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amount);
        IERC20(_tokenIn).approve(
            0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064,
            _amount
        );

        address[] memory path;
        if (_tokenIn == WETH || _tokenOut == WETH) {
            path = new address[](2);
            path[0] = _tokenIn;
            path[1] = _tokenOut;
        } else {
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        }
        (uint256 _amountOutMin, ) = getAmountsOutOnGMX(
            path[0],
            path[1],
            _amount
        );
        router.swap(path, _amount, _amountOutMin, msg.sender);
        console.log("Swapped On MC");
    }
    function swapETHOnGMX(address _tokenOut) external payable {
        address[] memory path;

        path = new address[](2);
        path[0] = WETH;
        path[1] = _tokenOut;

        (uint256 _amountOutMin) =  TokenAmountToUSDMinOnGMX(WETH, msg.value);
        gmx.router.swapETHToTokens(path, _amountOutMin, msg.sender);
    }
    // Pricing => No price impact for trades...execute trades at mark price [price api for chainlink => https://api.gmx.io/prices]
    // Stats per assets => [https://gmxio.gitbook.io/gmx/api]
    // Execution Fee => for all transactions
    receive() external payable {}
}


