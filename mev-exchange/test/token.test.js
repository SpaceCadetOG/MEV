const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    // reusable
    const tokens = (n) => {
      return ethers.utils.parseUnits(n.toString(), "ether");
    };

    const value = tokens("1000000");
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("MEV TOKEN", "MEV", 18, 1000000);

    return { token, value, owner };
  }

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
    it("balanceOf(contract) = TS", async function () {
    const { token } = await loadFixture(deployFixture);

    expect(await token.balanceOf(token.address)).equal(
      await token.totalSupply()
    );
  });
  it("balanceOf(contract) = balance(contract)", async function () {
    const { token } = await loadFixture(deployFixture);

    expect(await token.balanceOf(token.address)).equal(
      await token.balance(token.address)
    );
  });
  it("balanceOf(owner) = 0", async function () {
    const { token, owner } = await loadFixture(deployFixture);

    expect(await token.balanceOf(owner.address)).equal(0);
    expect(await token.balance(owner.address)).equal(0);
  });
  it.skip("Should get ..-", async function () {
    const { token } = await loadFixture(deployFixture);
  });
  it.skip("Should get .", async function () {
    const { token } = await loadFixture(deployFixture);
  });
  it.skip("Should get ....", async function () {
    const { token } = await loadFixture(deployFixture);
  });
});
