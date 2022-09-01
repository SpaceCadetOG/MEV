const { ethers} = require("hardhat");
const config = require("../src/config.json");
async function main() {
  const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether");
  };
  const wait = (seconds) => {
    const milliseconds = seconds * 1000;
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const [deployer, feeCollector, user1, user2] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();
  console.log("using chainId", chainId);

  const MEV = await ethers.getContractAt("Token", config[31337].MEV.address);
  console.log(`MEV ${MEV.address}`);
  const DAI = await ethers.getContractAt("Token", config[31337].DAI.address);
  console.log(`DAI ${DAI.address}`);
  const USDC = await ethers.getContractAt("Token", config[31337].USDC.address);
  console.log(`USDC ${USDC.address}`);
  const WETH = await ethers.getContractAt("Token", config[31337].WETH.address);
  console.log(`WETH ${WETH.address}`);
  const EXCHANGE = await ethers.getContractAt(
    "Exchange",
    config[31337].exchange.address
  );
  console.log(`EXCHANGE ${EXCHANGE.address}`);

  // send user

  let amount = tokens(10000);
  let tx, results, orderId;

  tx = await WETH.connect(deployer).transfer(user1.address, amount);
  console.log(
    `Transferred ${amount} tokens ${deployer.address} to ${user1.address} \n`
  );

  await MEV.connect(deployer).approve(EXCHANGE.address, amount);
  tx = await EXCHANGE.connect(deployer).deposit(MEV.address, amount);
  tx.wait();
  console.log(
    `Deposited ${amount} MEV ${deployer.address} to ${EXCHANGE.address} \n`
  );

  await WETH.connect(user1).approve(EXCHANGE.address, amount);
  tx = await EXCHANGE.connect(user1).deposit(WETH.address, amount);
  console.log(
    `Deposited ${amount} WETH ${user1.address} to ${EXCHANGE.address} \n`
  );
  tx.wait();

  // make orders ||  cancel orders

  tx = await EXCHANGE.connect(deployer).makeTrade(
    WETH.address,
    tokens(100),
    MEV.address,
    tokens(5)
  );
  results = await tx.wait();
  console.log(`Make trade ${deployer.address} \n`);

  orderId = results.events[0].args.id;

  tx = await EXCHANGE.connect(deployer).cancelTrade(orderId);
  results = await tx.wait();
  console.log(`Canceled trade ${deployer.address} \n`);

  await wait(1);
  ////////////////////////////////
  // fill orders
  tx = await EXCHANGE.connect(deployer).makeTrade(
    WETH.address,
    tokens(100),
    MEV.address,
    tokens(10)
  );
  results = await tx.wait();
  console.log(`Make trade ${deployer.address} \n`);

  orderId = results.events[0].args.id;
  tx = await EXCHANGE.connect(user1).brokerTrade(orderId);
  results = await tx.wait();
  console.log(`Brokered trade ${user1.address} \n`);
  await wait(1);

  tx = await EXCHANGE.connect(deployer).makeTrade(
    WETH.address,
    tokens(50),
    MEV.address,
    tokens(15)
  );
  results = await tx.wait();
  console.log(`Make trade ${deployer.address} \n`);

  orderId = results.events[0].args.id;
  tx = await EXCHANGE.connect(user1).brokerTrade(orderId);
  results = await tx.wait();
  console.log(`Brokered trade ${user1.address} \n`);
  /////////////////////
  await wait(1);
  tx = await EXCHANGE.connect(deployer).makeTrade(
    WETH.address,
    tokens(200),
    MEV.address,
    tokens(20)
  );
  results = await tx.wait();
  console.log(`Make trade ${deployer.address} \n`);

  orderId = results.events[0].args.id;
  tx = await EXCHANGE.connect(user1).brokerTrade(orderId);
  results = await tx.wait();
  console.log(`Brokered trade ${user1.address} \n`);

  await wait(1);

  /// open

  for (let i = 1; i <= 10; i++) {
    tx = await EXCHANGE.connect(deployer).makeTrade(
      WETH.address,
      tokens(10 * i),
      MEV.address,
      tokens(10)
    );
    results = await tx.wait();
    console.log(`Trade Success ${deployer.address} \n`);
  }
  await wait(1);

  for (let i = 1; i <= 10; i++) {
    tx = await EXCHANGE.connect(user1).makeTrade(
      MEV.address,
      tokens(10),
      WETH.address,
      tokens(10 * i)
    );
    results = await tx.wait();
    console.log(`Trade Success ${user1.address} \n`);
  }
  await wait(1);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
