"""
Test Simple stuff. Good to describe the functions. And allows to be able to read.
"""
from re import T
import time

print("********Conditons***********")
tokenList = ["eth", "btc", "usdc", "dai"]
tokenDictionary = {"token": "eth"}  # like a object in js
token1_dict = {"token": "ethereum", "symbol": "ETH", "price": 1700}
token2_dict = {"token": "USD Coin", "symbol": "USDC", "price": 1}
token3_dict = {"token": "Bitcoin", "symbol": "BTC", "price": 20000}
token_obj_list = [token1_dict, token2_dict, token3_dict]


## Real Problem
arb_treshold = 1.5
real_rate = 0.8

if real_rate >= arb_treshold:
    print(real_rate)
else:
    print(arb_treshold)


# For Loop
print("ForLoop")
print("check all tokens in list")
for i in token_obj_list:
    print(i)

print("")
print("check tokens base on price amount")
for i in token_obj_list:
    # check token base on price amount
    if i["price"] > 1000:
        print(i)

print("")
print("check tokens base on price amount but stop at first")
for i in token_obj_list:
    # check token base on price amount
    if i["price"] > 1000:
        print(i)
        break

# While Loop
print("While Loop")
counts = 0
while counts < 10:
    counts = counts + 1
    print(counts)

_counts = 0
while True:
    time.sleep(1)  # sleep fo 1 sec
    _counts = _counts + 1
    print(_counts)
    if _counts == 5:
        break


# Both have to be conditon
price_updated = True
not_old_price = False

if price_updated == True and not_old_price == True:
    print("Price updated")
else:
    print("update price oracle")


if price_updated == True or not_old_price == True:
    print("Price updated")
else:
    print("update price oracle")
