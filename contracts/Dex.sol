// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;


contract DEX {
    address immutable _owner;
    address token;
    uint256 price;

    // errors
    error NotEnoughTokens();
    error OnlyOwnerCanPerformThisAction();
    error NotRightPrice();
    error NotEnoughEther();
    error EthCouldNotBeSent();

    constructor(uint256 _price, address _token) {
        _owner = msg.sender;
        price = _price;
        token = _token;
    }

    modifier onlyOwner() {
        if(msg.sender != _owner) {
            revert OnlyOwnerCanPerformThisAction();
        }
        _;
    }

    /**
     * @dev Returns the price for a given number of tokens.
     * @param numTokens The number of tokens to get the price for.
     * @return The total price for the given number of tokens.
     */
    function getPrice(uint256 numTokens) public view returns(uint256) {
        return numTokens * price;
    }

    /**
     * @dev Allows the owner to provide liquidity by transferring tokens to the contract.
     * @param numTokens The number of tokens to transfer to the contract.
     */
    function provideLiquidity(uint256 numTokens) external onlyOwner {
       if(IERC20(token).balanceOf(msg.sender) < numTokens) {
        revert NotEnoughTokens();
       }
       IERC20(token).safeTransferFrom(msg.sender, address(this), numTokens);
    }

    /**
     * @dev Allows users to buy tokens by sending Ether to the contract.
     * @param numTokens The number of tokens to buy.
     */
    function buy(uint256 numTokens) external payable {
        uint256 priceToPay = numTokens * price;
        if(msg.value != priceToPay) {
            revert NotRightPrice();
        }
        IERC20(token).safeTransfer(msg.sender, numTokens);
    }

    /**
     * @dev Allows the owner to withdraw Ether from the contract.
     * @param amount The amount of Ether to withdraw.
     */
    function withdraw(uint256 amount) external onlyOwner {
        if(address(this).balance < amount) {
            revert NotEnoughEther();
        }
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        if(!sent) {
            revert EthCouldNotBeSent();
        }
    }

}