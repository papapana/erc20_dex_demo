import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DEX, VCoin } from "../typechain-types";

describe("Dex", () => {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let Dex: DEX;
  let vcoin: VCoin;
  let tokenSupply = "10000";
  let price = BigInt(100);

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const dex = await ethers.getContractFactory("DEX");
    const Vcoin = await ethers.getContractFactory("VCoin");
    vcoin = await Vcoin.deploy(tokenSupply);
    Dex = await dex.deploy(price, await vcoin.getAddress());
  });

  describe("Getters", () => {
    it("Should return the price of the token", async () => {
      expect(await Dex.getPrice(3)).to.equal(BigInt(3) * price);
    });
  });

  describe("Should be able to provide liquidity", () => {
    it("Should be able to provide liquidity", async () => {
      const amount = BigInt(2000);
      console.log("Dex: ", await Dex.getAddress());
      console.log("owner: ", owner.address);
      await vcoin.approve(await Dex.getAddress(), amount);
      await Dex.provideLiquidity(amount);
      expect(await vcoin.balanceOf(await Dex.getAddress())).to.equal(amount);
    });
  });

  describe("Buy a token", () => {
    it("Should be able to buy a token", async () => {
      const amount = BigInt(2000);
      // First provide liquidity
      await vcoin.approve(await Dex.getAddress(), amount);
      await Dex.provideLiquidity(amount);
      // Then send ETH to addr1
      await owner.sendTransaction({ to: addr1.address, value: price * amount });
      // Then buy the token
      await Dex.connect(addr1).buy(amount, { value: price * amount });
      expect(await vcoin.balanceOf(addr1.address)).to.equal(amount);
    });
  });

  describe("Owner should be able to withdraw liquidity", () => {
    it("Should be able to withdraw liquidity", async () => {
      const ownerBalance = await ethers.provider.getBalance(owner.address);
      const amount = BigInt(2000);
      // First provide liquidity
      await vcoin.approve(await Dex.getAddress(), amount);
      await Dex.provideLiquidity(amount);
      // Then send ETH to addr1 and let addr1 buy the token
      await owner.sendTransaction({ to: addr1.address, value: price * amount });
      // check that owner balance is reduced taking into account gas fees
      // Use lessThan to account for gas fees in the transaction
      expect(await ethers.provider.getBalance(owner.address)).to.be.lessThan(
        ownerBalance - price * amount
      );
      await Dex.connect(addr1).buy(amount, { value: price * amount });
      // get amount of ETH in the DEX contract and ensure its price * amount
      const DexBalance = await ethers.provider.getBalance(
        await Dex.getAddress()
      );
      expect(DexBalance).to.equal(price * amount);
      // Then withdraw Ethereum
      await Dex.withdraw(amount);
      // ETH balance should be restored
      const newOwnerBalance = await ethers.provider.getBalance(owner.address);
      // Check that balance is close to ownerBalance, accounting for gas fees
      // Should be greater than ownerBalance - price*amount because owner withdrew price*amount
      expect(newOwnerBalance).to.be.greaterThan(
        ownerBalance - ethers.parseEther("0.01") // allowing 0.01 ETH for gas fees
      );
    });
  });
});
