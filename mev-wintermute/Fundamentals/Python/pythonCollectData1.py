"""
Test Simple stuff. Good to describe the functions. And allows to be able to read.
"""
print("********DataStructs***********")
tokenList = ["eth", "btc", "usdc", "dai"]
tokenDictionary = {"token": "eth"}  # like a object in js
token1_dict = {"token": "ethereum", "symbol": "ETH", "price": 1700}
token2_dict = {"token": "USD Coin", "symbol": "USDC", "price": 1}
token3_dict = {"token": "Bitcoin", "symbol": "BTC", "price": 20000}
token_obj_list = [token1_dict, token2_dict, token3_dict]


## If / ELSE
if tokenList[0] == "token":
    print("found token = eth")
elif tokenList[2] == "usdc":
    print("found token = usdc")
else:
    print("token not matched")

if tokenList[0] == "eth":
    print("eth is here")

if tokenList[0] == "btc":  # should fail
    print("eth is here")

print("Got Dai!") if tokenList[3] == "usdc" else print("Not Dai!")
will_buy = "yes" if tokenList[0] == "eth" else "no"
print(will_buy)
will_sell = "yes" if tokenList[0] == "btc" else "no"
print(will_sell)


## Real Problem
arb_treshold = 1.5
real_rate = 0.8

if real_rate >= arb_treshold:
    print(real_rate)
else:
    print(arb_treshold)

