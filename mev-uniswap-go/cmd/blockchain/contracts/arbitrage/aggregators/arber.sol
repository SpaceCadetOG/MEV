// SPDX-License-Identifier: me
pragma solidity 0.8.4;

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

contract Arber {
    address public WETH;
    address public USDC;
    address public DAI;
    AggregatorInterface[2] public routers;

    constructor() {
        // uni
        routers[0] = AggregatorInterface(
            0x60aE616a2155Ee3d9A68541Ba4544862310933d4
        );

        // sushi
        routers[1] = AggregatorInterface(
            0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106
        );
        WETH = 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7;
        USDC = 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E;
        DAI = 0xd586E7F844cEa2F87f50152665BCbc2C279D8d70;
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

    function getLowestAmount(address[] memory path, uint256 amountIn)
        public
        view
        returns (uint256, uint256)
    {
        uint256[] memory uniswap = routers[0].getAmountsOut(amountIn, path);
        uint256[] memory sushiswap = routers[1].getAmountsOut(amountIn, path);

        if (sushiswap[1] > uniswap[1] ) {
            return (0, uniswap[1]);
        } else {
            return (1, sushiswap[1]);
        }
    }

    function usdc2wethHIGH(uint256 amount) public {
        IERC20 usdc = IERC20(USDC);
        // usdc.transferFrom(msg.sender, address(this), amount);
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

    function usdc2wethLOW(uint256 amount) public {
        IERC20 usdc = IERC20(USDC);
        // usdc.transferFrom(msg.sender, address(this), amount);
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = WETH;

        (uint256 routerIndex, uint256 minAmountOut) = getLowestAmount(
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

    function weth2usdcHIGH(uint256 amount) public {
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
    function weth2usdcLOW(uint256 amount) public {
        IERC20 weth = IERC20(WETH);
        // weth.transferFrom(msg.sender, address(this), amount);
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = USDC;

        (uint256 routerIndex, uint256 minAmountOut) = getLowestAmount(
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
