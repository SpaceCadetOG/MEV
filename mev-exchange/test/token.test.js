/* eslint-disable jest/valid-expect */
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {
  async function deployFixture() {
    const [owner, user, exchange] = await ethers.getSigners();
    // reusable
    const tokens = (n) => {
      return ethers.utils.parseUnits(n.toString(), "ether");
    };

    const value = tokens("1000000");
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("MEV TOKEN", "MEV", 18, 1000000);

    return { token, value, owner, user, exchange, tokens };
  }

  describe("Token Details", () => {
    it("name()", async function () {
      const { token } = await loadFixture(deployFixture);

      expect(await token.name()).equal("MEV TOKEN");
    });
    it("totalSupply()", async function () {
      const { token, value } = await loadFixture(deployFixture);

      expect(await token.totalSupply()).equal(value); // wei
    });
    it("symbol()", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.symbol()).equal("MEV");
    });
    it("decimals()", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.decimals()).equal("18");
    });
  });
  describe("Balance", () => {
    it("balanceOf(contract) = TS", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      expect(await token.balanceOf(owner.address)).equal(
        await token.totalSupply()
      );
    });
    it("balanceOf(owner) = balance(owner)", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      expect(await token.balanceOf(owner.address)).equal(
        await token.balance(owner.address)
      );
    });
    it("balanceOf(contract) = 0", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      expect(await token.balanceOf(token.address)).equal(0);
      expect(await token.balance(token.address)).equal(0);
    });
  });
  describe("Transfer", () => {
    it("transfer(owner => user)", async function () {
      const { token, owner, user, tokens } = await loadFixture(deployFixture);
      let amount = tokens(100);
      let before = await token.balanceOf(user.address);
      let tx = await token.connect(owner).transfer(user.address, amount);
      let result = await tx.wait();
      let after = await token.balanceOf(user.address);
      expect(after).greaterThan(before);
      expect(after).eq(amount);
      await expect(tx)
        .emit(token, "Transfer")
        .withArgs(owner.address, user.address, amount);
      // console.log(result);
    });
    it("transfer(user => owner) to fail with insufficent funds", async function () {
      const { token, owner, user, tokens } = await loadFixture(deployFixture);
      let amount = tokens(1000000000);

      await expect(
        token.connect(owner).transfer(user.address, amount)
      ).revertedWith("insufficent funds");
    });
    it("transfer(user => 0x0000...) to fail", async function () {
      const { token, owner, user, tokens } = await loadFixture(deployFixture);
      let amount = tokens(100);
      await expect(
        token
          .connect(owner)
          .transfer("0x0000000000000000000000000000000000000000", amount)
      ).reverted;
    });
  });
  describe("Approve", () => {
    it("approve(exchange, amount)", async function () {
      const { token, owner, exchange, tokens } = await loadFixture(
        deployFixture
      );
      let amount = tokens(100);

      let tx = token.connect(owner).approve(exchange.address, amount);

      await expect(tx)
        .emit(token, "Approval")
        .withArgs(owner.address, exchange.address, amount);

      expect(await token.allowance(owner.address, exchange.address)).equal(
        amount
      );
    });

    it("approve(0x0000, amount) to fail", async function () {
      const { token, owner, exchange, tokens } = await loadFixture(
        deployFixture
      );
      let amount = tokens(100);

      await expect(
        token
          .connect(owner)
          .approve("0x0000000000000000000000000000000000000000", amount)
      ).to.reverted;
    });
  });
  describe("TransferFrom", () => {
    it("transferFrom(owner, exchange, amount)", async function () {
      const { token, owner, exchange, tokens } = await loadFixture(
        deployFixture
      );
      let amount = tokens(100);
      await token.connect(owner).approve(exchange.address, amount);
      expect(await token.allowance(owner.address, exchange.address)).equal(
        amount
      );
      let before = await token.balanceOf(exchange.address);
      let tx = await token
        .connect(owner)
        .transferFrom(owner.address, exchange.address, amount);
      let result = await tx.wait();
      let after = await token.balanceOf(exchange.address);
      expect(after).greaterThan(before);
      expect(after).eq(amount);
      await expect(tx)
        .emit(token, "Transfer")
        .withArgs(owner.address, exchange.address, amount);
      // allowance to equal 0 after tranfer
      expect(await token.allowance(owner.address, exchange.address)).equal(0);

      console.log(result);
    });
    it("Should revert not approved.", async function () {
      const { token, owner, exchange, tokens } = await loadFixture(
        deployFixture
      );
      let amount = tokens(100);
      await expect(
        token
          .connect(owner)
          .transferFrom(owner.address, exchange.address, amount)
      ).to.revertedWith("not approve to spend");
    });

    it("transferFrom(user => 0x0000...) to fail", async function () {
      const { token, owner, user, tokens } = await loadFixture(deployFixture);
      let amount = tokens(100);
      await expect(
        token
          .connect(owner)
          .transferFrom(
            owner.address,
            "0x0000000000000000000000000000000000000000",
            amount
          )
      ).reverted;
    });

    it("transferFrom(user => owner) to fail with insufficent funds", async function () {
      const { token, owner, exchange, tokens } = await loadFixture(
        deployFixture
      );
      let amount = tokens(1000000000);
      await expect(
        token
          .connect(owner)
          .transferFrom(owner.address, exchange.address, amount)
      ).revertedWith("insufficent funds");
    });
  });

  describe("Test", () => {
    it(".....", async function () {
      const { token, owner, exchange, tokens } = await loadFixture(
        deployFixture
      );
      let amount = tokens(100);
    });
    it("......", async function () {
      const { token, owner, exchange, tokens } = await loadFixture(
        deployFixture
      );
      let amount = tokens(100);
    });
  });
});
