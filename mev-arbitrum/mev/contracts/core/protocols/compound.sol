// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/compound.sol";

contract Compound1 {
    IERC20 public asset;
    CErc20 public cToken;

    constructor(address _asset, address _cToken) {
        asset = IERC20(_asset);
        cToken = CErc20(_cToken);
    }

    function supply(uint _amount) external {
        asset.transferFrom(msg.sender, address(this), _amount);
        asset.approve(address(cToken), _amount);
        cToken.mint(_amount);
        require(cToken.mint(_amount) == 0, "Mint Failed");
    }

    function getCTokenBalance() external view returns (uint) {
        return cToken.balanceOf(address(this));
    }

    function getInfo() external returns (uint exchangeRate, uint supplyRate) {
        exchangeRate = cToken.exchangeRateCurrent();
        supplyRate = cToken.supplyRatePerBlock();
        return (exchangeRate, supplyRate);
    }

    function estimateUnderlyingBalance() external returns (uint) {
        uint cTokenBal = cToken.balanceOf(address(this));
        uint exchangeRate = cToken.exchangeRateCurrent();
        uint decimal = 8;
        uint cDecimal = 8;
        return (cTokenBal * exchangeRate) / 10**(18 + decimal - cDecimal);
    }

    function redeem(uint _amount) external {
        cToken.redeem(_amount);
        require(cToken.redeem(_amount) == 0, "Mint Failed");
    }

    // borrow and repay //
    Comptroller public comptroller =
        Comptroller(0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B);

    PriceFeed public priceFeed =
        PriceFeed(0x922018674c12a7F0D394ebEEf9B58F186CdE13c1);

    // collateral
    function getCollateralFactor() external view returns (uint) {
        (, uint colFactor, ) = comptroller.markets(address(cToken));
        return colFactor / 1e18;
    }
    // acct liquidity
    function AcctLiquidity() external view  returns (uint liquidity, uint shortfall) {
        (, liquidity, shortfall) = comptroller.getAccountLiquidity(address(this));

        return (liquidity, shortfall);
    }
    // price feed => usd price of token
      function getPriceFeed(address _cToken) external view returns (uint) {
    // scaled up by 1e18
    return priceFeed.getUnderlyingPrice(_cToken);
  }
    // enter market
    function borrow (address _cTokenToBorrow, uint _decimals) external {
    // enter market
    // enter the supply market so you can borrow another type of asset
    address[] memory cTokens = new address[](1);
    cTokens[0] = address(cToken);
    uint[] memory errors = comptroller.enterMarkets(cTokens);
    require(errors[0] == 0, "Comptroller.enterMarkets failed.");

    // check liquidity
    (uint error, uint liquidity, uint shortfall) = comptroller.getAccountLiquidity(
      address(this)
    );
    require(error == 0, "error");
    require(shortfall == 0, "shortfall > 0");
    require(liquidity > 0, "liquidity = 0");

    // calculate max borrow
    uint price = priceFeed.getUnderlyingPrice(_cTokenToBorrow);

    // liquidity - USD scaled up by 1e18
    // price - USD scaled up by 1e18
    // decimals - decimals of token to borrow
    uint maxBorrow = (liquidity * (10**_decimals)) / price;
    require(maxBorrow > 0, "max borrow = 0");

    // borrow 50% of max borrow
    uint amount = (maxBorrow * 50) / 100;
    require(CErc20(_cTokenToBorrow).borrow(amount) == 0, "borrow failed");
    }

 function getBorrowedBalance(address _cTokenBorrowed) public returns (uint) {
    return CErc20(_cTokenBorrowed).borrowBalanceCurrent(address(this));
  }

  // borrow rate
  function getBorrowRatePerBlock(address _cTokenBorrowed) external view returns (uint) {
    // scaled up by 1e18
    return CErc20(_cTokenBorrowed).borrowRatePerBlock();
  }

  // repay borrow
  function repay(
    address _tokenBorrowed,
    address _cTokenBorrowed,
    uint _amount
  ) external {
    IERC20(_tokenBorrowed).approve(_cTokenBorrowed, _amount);
    // _amount = 2 ** 256 - 1 means repay all
    require(CErc20(_cTokenBorrowed).repayBorrow(_amount) == 0, "repay failed");
  }
}

contract CompoundLiquidate {
    constructor() {
        
    }
}
