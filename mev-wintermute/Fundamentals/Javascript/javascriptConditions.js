// if else
let tokens = ["eth", "btc", "usdc", "dai"];
console.log(tokens.length);

let tokens_obj_1 = {
  name: "ethereum",
  symbol: "ETH",
  price: 1700,
};

let tokens_obj_2 = {
  name: "bitcoin",
  symbol: "BTC",
  price: 20000,
};

let tokenArray = [tokens_obj_1, tokens_obj_2];

if (tokens[0] == "eth") {
  console.log("yes it is!");
} else {
  console.log(`should be ${tokens[0]}`);
}

if (tokens[0] == "btc") {
  console.log("yes it is!");
} else {
  console.log(`should be ${tokens[0]}`);
}

for (let i = 0; i < tokens.length; i++) {
  let token = tokens[i];
  console.log(token);
}

for (let i = 0; i < tokenArray.length; i++) {
  console.log(tokenArray[i]);
}

for (let i = 0; i < tokenArray.length; i++) {
  console.log(tokenArray[i].name);
}
