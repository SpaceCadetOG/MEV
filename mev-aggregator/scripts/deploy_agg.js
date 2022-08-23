const { network, ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const Aggregator = await hre.ethers.getContractFactory("aggregator");
  const aggregator = await Aggregator.deploy();
  await aggregator.deployed();

  const wethTokenAbi = [
    "function balanceOf(address) external view returns (uint256)",
    "function deposit() public payable",
    "function approve(address,uint) public returns (bool)",
    "function transfer(address to, uint amount) returns (bool)",
  ];
  const TokenAbi = [
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender)",
  ];
  const USDC = "";
  const DAI = "";
  const MockUser = "";

  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [MockUser],
  });

  const signer = await ethers.provider.getSigner(MockUser);
  signer.address = signer._address;

  let [owner] = await ethers.getSigners();
  const usdc = await ethers.getContractAt(TokenAbi, USDC, signer);
  const dai = await ethers.getContractAt(TokenAbi, DAI, signer);

  const usdcAmount = ethers.utils.parseUnits("1000", 6);
  const daiAmount = ethers.utils.parseUnits("1000", 18);
  await usdc
    .connect(signer)
    .transfer(owner.address, usdcAmount, { gasLimit: 300000 });
  await dai
    .connect(signer)
    .transfer(owner.address, daiAmount, { gasLimit: 300000 });

  console.log(`deployed to ${aggregator.address}`);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
