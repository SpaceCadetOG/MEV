// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.4;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "contracts/core/protocols/aave/examples/interfaces/IPool.sol";
import "contracts/core/protocols/aave/examples/interfaces/FlashLoanSimpleReceiverBase.sol";
import "hardhat/console.sol";

// Arbitrager = gmx / Mycelium hack
// WETH(aave) => ETH(GMX) => WETH(myCeli) => WETH(aave) - WETH(contract) = WETH(user_profit)

contract PerpetuallySwapsETH2 is FlashLoanSimpleReceiverBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    address constant ETHER = address(0);
    event SentProfit(address recipient, uint256 profit);
    event LoanFinished(address token, uint256 amount);
    address admin = msg.sender;

    constructor(IPoolAddressesProvider provider)
        FlashLoanSimpleReceiverBase(provider)
    {}

    // Get GMX price
    // get my celi price
    // get chainlink price
    // create threshold

    function buyEth() external {
        // buy token
        // swapExactTokensForETH
    }

    function sellETH() external {
        // sell token
        // swapExactETHForTokens
    }

    // this will activate the flashloan
    function MakeMoney(
        address token,
        uint256 amount,
        address user
    ) external {
        user = address(this); // or msg.sender for now until...
        uint256 balance = IERC20(token).balanceOf(address(this)); // balance before loan happens
        bytes memory data = abi.encode(token, amount, balance);
        IPool(address(POOL)).flashLoanSimple(user, token, amount, data, 0);
        withdraw(token);
    }

    // This will execute the trades and move the money
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address, // initiator
        bytes memory
    ) external override returns (bool) {
        require(
            amount <= IERC20(asset).balanceOf(address(this)),
            "Invalid Balance for the contract"
        );
        console.log("AmountBorrowed", amount);
        /*
        Steps using uniswap funcs => (Assuming we borrow WETH) 

        1. Borrow WETH => Aave
        2. Swap WETH for ETH => GMX
        3. Swap ETH for WETH => myCeil
        *(require WETH balance after > before), Revert => Emit Failed Trade EVENT || else => Emit Success Trade EVENT *   
        4. Payback WETH => Aave
        5. Keep Profit => WETH

        GMX => swapExactTokensForETH
        myCeil => swapExactETHForTokens

       */

        uint256 amountToPayback = amount.add(premium);
        require(
            IERC20(asset).balanceOf(address(this)) >= amountToPayback,
            "Insufficent funds to payback loan"
        );
        console.log("amount + flashloan fee: ", amountToPayback);
        emit LoanFinished(asset, amountToPayback);

        IERC20(asset).approve(address(POOL), amountToPayback);

        // transfer remaining balance to address or multisig escrow
        uint256 remained = IERC20(asset).balanceOf(address(this));
        // IERC20(asset).transfer(msg.sender, remained);
        emit SentProfit(msg.sender, remained);

        return true;
    }

    /**Internal Func */
    function withdraw(address _assetAddress) public {
        require(msg.sender == admin, "NOT YOUR FUNDS");
        uint256 assetBalance;
        console.log("after contract balance:", assetBalance);
        if (_assetAddress == ETHER) {
            address self = address(this); // workaround for a possible solidity bug
            assetBalance = self.balance;
            payable(msg.sender).transfer(assetBalance);
        } else {
            assetBalance = IERC20(_assetAddress).balanceOf(address(this));
            IERC20(_assetAddress).transfer(msg.sender, assetBalance);
        }
    }
}
