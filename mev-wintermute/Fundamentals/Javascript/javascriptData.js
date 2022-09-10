function main() {
  console.log("Let Trade in Javascript!");

  let tokens = ["eth", "btc", "usdc", "dai"];
  console.log(tokens);

  tokens.push("aave", "uni");
  console.log(tokens);
  tokens.pop("uni");
  console.log(tokens);

  let newToken = "gmx";
  let newToken2 = "maker";
  tokens.push(newToken, newToken2);
  console.log(tokens);

  let tokens_obj = {
    name: "ethereum",
    symbol: "ETH",
    price: 1700,
  };
  console.log(tokens_obj);
  tokens_obj["good buy"] = true;

  console.log(tokens_obj);
}

main();
