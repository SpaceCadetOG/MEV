// SPDX-License-Identifier: me
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface AggregatorInterface {
    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract Aggregator {
    address public WETH;
    address public USDC;
    address public DAI;
    AggregatorInterface[2] public routers;

    constructor() {
        // uni
        routers[0] = AggregatorInterface(
            0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
        );

        // sushi
        routers[1] = AggregatorInterface(
            0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F
        );
        WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
        DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    }

    function uniswapRate(address[] memory path, uint256 amountIn)
        public
        view
        returns (uint256 rate)
    {
        uint256[] memory uniswap = routers[0].getAmountsOut(amountIn, path);
        return uniswap[1];
    }

    function sushiswapRate(address[] memory path, uint256 amountIn)
        public
        view
        returns (uint256)
    {
        uint256[] memory sushiswap = routers[1].getAmountsOut(amountIn, path);
        return sushiswap[1];
    }

    function getHighestAmount(address[] memory path, uint256 amountIn)
        public
        view
        returns (uint256, uint256)
    {
        uint256[] memory uniswap = routers[0].getAmountsOut(amountIn, path);
        uint256[] memory sushiswap = routers[1].getAmountsOut(amountIn, path);

        if (uniswap[1] > sushiswap[1]) {
            return (0, uniswap[1]);
        } else {
            return (1, sushiswap[1]);
        }
    }

    function usdc2weth(uint256 amount) public {
        IERC20 usdc = IERC20(USDC);
        usdc.transferFrom(msg.sender, address(this), amount);
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = WETH;

        (uint256 routerIndex, uint256 minAmountOut) = getHighestAmount(
            path,
            amount
        );
        usdc.approve(address(routers[routerIndex]), amount);

        routers[routerIndex].swapExactTokensForTokens(
            amount,
            minAmountOut,
            path,
            msg.sender,
            block.timestamp + 5 minutes
        );
    }

    function dai2weth(uint256 amount) public {
        IERC20 dai = IERC20(DAI);
        dai.transferFrom(msg.sender, address(this), amount);
        address[] memory path = new address[](2);
        path[0] = DAI;
        path[1] = WETH;

        (uint256 routerIndex, uint256 minAmountOut) = getHighestAmount(
            path,
            amount
        );
        dai.approve(address(routers[routerIndex]), amount);
        routers[routerIndex].swapExactTokensForTokens(
            amount,
            minAmountOut,
            path,
            msg.sender,
            block.timestamp + 5 minutes
        );
    }

    function weth2dai(uint256 amount) public {
        IERC20 weth = IERC20(WETH);
        // weth.transferFrom(msg.sender, address(this), amount);

        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = DAI;

        (uint256 routerIndex, uint256 minAmountOut) = getHighestAmount(
            path,
            amount
        );
        weth.approve(address(routers[routerIndex]), amount);

        routers[routerIndex].swapExactTokensForTokens(
            amount,
            minAmountOut,
            path,
            msg.sender,
            block.timestamp + 5 minutes
        );
    }

    function weth2usdc(uint256 amount) public {
        IERC20 weth = IERC20(WETH);
        // weth.transferFrom(msg.sender, address(this), amount);
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = USDC;

        (uint256 routerIndex, uint256 minAmountOut) = getHighestAmount(
            path,
            amount
        );
        weth.approve(address(routers[routerIndex]), amount);

        routers[routerIndex].swapExactTokensForTokens(
            amount,
            minAmountOut,
            path,
            msg.sender,
            block.timestamp + 5 minutes
        );
    }
}
