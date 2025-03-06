import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { VCoin } from "../typechain-types";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("VCoin", () => {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let VCoin: VCoin;
  let tokenSupply = "10000";

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const vcoin = await ethers.getContractFactory("VCoin");
    VCoin = await vcoin.deploy(tokenSupply);
  });

  describe("Deployment", () => {
    it("Should assign total supply of tokens to the owner/deployer", async () => {
      const ownerBalance = await VCoin.balanceOf(owner.address);
      expect(await VCoin.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", () => {
    it("transfer between accounts should be possible", async () => {
      const amount = "2000";
      const ownerInitialBalance = await VCoin.balanceOf(owner.address);
      await VCoin.transfer(addr1, amount);
      expect(await VCoin.balanceOf(owner.address)).to.equal(
        ownerInitialBalance - BigInt(amount)
      );
      expect(await VCoin.balanceOf(addr1)).to.equal(BigInt(amount));
    });
    it("transfer with approval should be possible", async () => {
      const amount = BigInt(2000);
      await VCoin.transfer(addr1, amount);
      await VCoin.connect(addr1).approve(owner, amount / BigInt(2));
      await VCoin.transferFrom(addr1, addr2, amount / BigInt(2));
      expect(await VCoin.balanceOf(owner.address)).to.equal(
        BigInt(tokenSupply) - amount
      );
      expect(await VCoin.balanceOf(addr1.address)).to.equal(amount / BigInt(2));
      expect(await VCoin.balanceOf(addr2.address)).to.equal(amount / BigInt(2));
      // approval cannot be repeated
      await expect(VCoin.transferFrom(addr1, addr2, amount / BigInt(2)))
        .to.be.revertedWithCustomError(VCoin, "ERC20InsufficientAllowance")
        .withArgs(owner.address, 0, amount / BigInt(2));
    });
  });
});
