// SPDX-License-Identifier: Victor Ogbebor
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./examples/interfaces/IPool.sol";
import "./examples/interfaces/FlashLoanSimpleReceiverBase.sol";
import "../aggregators/arber.sol";
// import uniswap
import "hardhat/console.sol";

contract AaveFlashloan2 is FlashLoanSimpleReceiverBase, Arber {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    address constant ETHER = address(0);

    event SentProfit(address recipient, uint256 profit);
    event LoanFinished(address token, uint256 amount);

    constructor(IPoolAddressesProvider provider)
        FlashLoanSimpleReceiverBase(provider)
    {}

    // this will activate the flashloan
    function MakeMoney(
        address token,
        uint256 amount,
        address user
    ) external {
        user = address(this); // or msg.sender for now until...
        uint256 balance = IERC20(WETH).balanceOf(address(this)); // balance before loan happens
        bytes memory data = abi.encode(balance);

        IPool(address(POOL)).flashLoanSimple(user, token, amount, data, 0);
        withdraw(token);
    }

    // This will execute the trades and move the money
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address, // initiator
        bytes memory data
    ) external override returns (bool) {
        require(
            amount <= IERC20(asset).balanceOf(address(this)),
            "Invalid Balance for the contract"
        );
        console.log("AmountBorrowed", amount);
        uint256 balance = abi.decode(data, (uint256));
        /*
        Steps using uniswap funcs => (Assuming we borrow WETH) 
              


       */
        // buy low
        IERC20(asset).approve(address(this), amount);
        usdc2wethLOW(amount);

        // sell high
        console.log(balance);
        weth2usdcHIGH(balance);

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
    function withdraw(address _assetAddress) internal {
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
