const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("MEV");

    return { token };
  }

  it("Should get Token Name", async function () {
    const { token } = await loadFixture(deployOneYearLockFixture);

    expect(await token.name()).to.equal("MEV");
  });
});
