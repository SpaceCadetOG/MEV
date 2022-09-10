"""
Test Simple stuff. Good to describe the functions. And allows to be able to read.
"""
print("********DataStructs***********")
tokenList = ["eth", "btc", "usdc", "dai"]

print(type(tokenList))
print(tokenList)
print(tokenList[0])
print(tokenList[1])
print(tokenList[2])
print(tokenList[3])


tokenDictionary = {"token": "eth"}  # like a object in js
print(type(tokenDictionary))
print(tokenDictionary)

token1_dict = {"token": "ethereum", "symbol": "ETH", "price": 1700}
token2_dict = {"token": "USD Coin", "symbol": "USDC", "price": 1}
token3_dict = {"token": "Bitcoin", "symbol": "BTC", "price": 20000}


print(token1_dict["token"])
print(token1_dict["symbol"])
print(token1_dict["price"])

# Str
token_obj_list = [token1_dict, token2_dict, token3_dict]
print(type(token_obj_list))
print(token_obj_list)

print(token_obj_list[0])
print(token_obj_list[1])
print(token_obj_list[2])
# print(tokenDictionary[1])
# print(tokenDictionary[2])
# print(tokenDictionary[3])
