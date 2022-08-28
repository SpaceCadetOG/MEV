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

    return { token, value };
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
  it.skip("Should get ..--", async function () {
    const { token } = await loadFixture(deployFixture);
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
