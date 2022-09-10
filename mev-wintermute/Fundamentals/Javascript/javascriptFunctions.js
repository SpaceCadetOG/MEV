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

function getToken(tokens) {
  let returnToken = [];
  for (let i = 0; i < tokens.length; i++) {
    returnToken.push("Token is " + tokens[i]);
  }
  return returnToken;
}

let tokenStuff = getToken(tokens);

console.log(tokenStuff);
