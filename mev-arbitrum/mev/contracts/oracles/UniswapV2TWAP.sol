// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.6.6;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/lib/contracts/libraries/FixedPoint.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2OracleLibrary.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";

contract UniswapV2TWAP {
    using FixedPoint for *;
    uint public constant PERIOD = 10;

    IUniswapV2Pair public immutable pair;
    address public immutable token0;
    address public immutable token1;

    uint public price0CumulativeLast;
    uint public price1CumulativeLast;
    uint32 public blockTimeLast;

    FixedPoint.uq112x112 public price0Average;
    FixedPoint.uq112x112 public price1Average;

    constructor(IUniswapV2Pair _pair) public {
        pair = _pair;
        token0 = _pair.token0();
        token1 = _pair.token1();
        price0CumulativeLast = _pair.price0CumulativeLast();
        price1CumulativeLast = _pair.price1CumulativeLast();
        (, , blockTimeLast) = _pair.getReserves();
    }

    function update() external {
        (
            uint price0Cumulative,
            uint price1Cumulative,
            uint32 blockTime
        ) = UniswapV2OracleLibrary.currentCumulativePrices(address(pair));
        uint timeElapsed = blockTime - blockTimeLast;
        require(timeElapsed >= PERIOD, "time-elapsed < min period");
        price0Average = FixedPoint.uq112x112(
            uint224((price0Cumulative - price0CumulativeLast) / timeElapsed)
        );
        price1Average = FixedPoint.uq112x112(
            uint224((price1Cumulative - price1CumulativeLast) / timeElapsed)
        );

        price0CumulativeLast = price0Cumulative;
        price1CumulativeLast = price1Cumulative;
        blockTimeLast = blockTime;
    }

    function consult(address token, uint amountIn)
        external
        view
        returns (uint amountOut)
    {
        require(token == token0 || token == token1, "Invalid Token");
        if (token == token0) {
            amountOut = price0Average.mul(amountIn).decode144();
        } else {
            amountOut = price1Average.mul(amountIn).decode144();
        }
    }
}

// Write Test : https://www.youtube.com/watch?v=Ar4Ik7Bov0U&list=PLO5VPQH6OWdX-Rh7RonjZhOd9pb9zOnHW&index=27
