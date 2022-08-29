/* eslint-disable jest/valid-expect */
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, use } = require("chai");
const { ethers } = require("hardhat");

describe("Exchange", () => {
  async function deployFixture() {
    const [owner, feeCollector, user1, user2] = await ethers.getSigners();
    // reusable
    const tokens = (n) => {
      return ethers.utils.parseUnits(n.toString(), "ether");
    };

    const fee = 10;

    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");

    // token1.connect(user1).approve(exchange.address, amount);

    const token1 = await Token.deploy("MEV TOKEN", "MEV", 18, 1000000);
    const exchange = await Exchange.deploy(feeCollector.address, fee);
    await token1.connect(owner).transfer(user1.address, tokens(100));

    return { exchange, owner, tokens, token1, feeCollector, fee, user1 };
  }

  async function depositFixture() {
    const { owner, exchange, tokens, feeCollector, token1, user1 } =
      await loadFixture(deployFixture);
    const amount = tokens("100");
    await token1.connect(user1).approve(exchange.address, amount);
    let tx = await exchange.connect(user1).deposit(token1.address, amount);

    return { tx, token1, exchange, amount, user1 };
  }

  async function withdrawFixture() {
    const { owner, exchange, tokens, feeCollector, token1, user1 } =
      await loadFixture(deployFixture);
    const amount = tokens("100");
    await token1.connect(user1).approve(exchange.address, amount);
    await exchange.connect(user1).deposit(token1.address, amount);

    let tx1 = await exchange.connect(user1).withdraw(token1.address, amount);
    return { tx1, token1, exchange, amount, user1 };
  }

  describe("Test Fees", () => {
    it("feeCollector", async function () {
      const { owner, exchange, tokens, feeCollector } = await loadFixture(
        deployFixture
      );
      let amount = tokens(100);
      expect(await exchange.feeCollector()).equal(feeCollector.address);
    });
    it("feePercent", async function () {
      const { exchange, fee } = await loadFixture(deployFixture);

      expect(await exchange.feePercent()).equal(fee);
    });
  });

  describe.only("Deposit", () => {
    it("deposit tokens", async function () {
      const { tx, token1, exchange, amount, user1 } = await loadFixture(
        depositFixture
      );
      expect(await token1.balanceOf(exchange.address)).equal(amount);
      expect(await exchange.tokens(token1.address, user1.address)).equal(
        amount
      );
      expect(await exchange.user_balance(token1.address, user1.address)).equal(
        amount
      );
      await expect(tx)
        .emit(exchange, "Deposit")
        .withArgs(
          token1.address,
          user1.address,
          amount,
          await exchange.user_balance(token1.address, user1.address)
        );
    });
    it("deposit tokens should fail w/ no approval", async function () {
      const { owner, exchange, tokens, feeCollector, token1, user1 } =
        await loadFixture(deployFixture);
      const amount = tokens("100");
      await expect(
        exchange.connect(user1).deposit(token1.address, amount)
      ).revertedWith("allowance to spend low");
    });
  });

  describe.only("Withdraw", () => {
    it("withdraw tokens", async function () {
      const { token1, exchange, amount, user1 } = await loadFixture(
        withdrawFixture
      );
      expect(await token1.balanceOf(exchange.address)).equal(0);
      expect(await exchange.tokens(token1.address, user1.address)).equal(0);
      expect(await exchange.user_balance(token1.address, user1.address)).equal(
        0
      );
    });
    it("Withdraw Event", async function () {
      const { tx1, token1, exchange, amount, user1 } = await loadFixture(
        withdrawFixture
      );
      await expect(tx1)
        .emit(exchange, "Withdraw")
        .withArgs(
          token1.address,
          user1.address,
          amount,
          await exchange.user_balance(token1.address, user1.address)
        );
    });
    it("withdraw tokens should fail w/ no approval", async function () {
      const { owner, exchange, tokens, feeCollector, token1, user1 } =
        await loadFixture(deployFixture);
      const amount = tokens("100");
      await expect(exchange.connect(user1).withdraw(token1.address, amount))
        .reverted;
    });
  });
  describe.skip("MakeOrder", () => {
    it(".", async function () {
      const { owner, exchange, tokens, feeCollector } = await loadFixture(
        deployFixture
      );
    });
    it("..", async function () {
      const { exchange, fee } = await loadFixture(deployFixture);
    });
  });
  describe.skip("CancelOrder", () => {
    it(".", async function () {
      const { owner, exchange, tokens, feeCollector } = await loadFixture(
        deployFixture
      );
    });
    it("..", async function () {
      const { exchange, fee } = await loadFixture(deployFixture);
    });
  });

  describe.skip("FillOrders", () => {
    it(".", async function () {
      const { owner, exchange, tokens, feeCollector } = await loadFixture(
        deployFixture
      );
    });
    it("..", async function () {
      const { exchange, fee } = await loadFixture(deployFixture);
    });
  });
});
