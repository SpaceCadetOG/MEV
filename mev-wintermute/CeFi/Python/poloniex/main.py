# Step 0: Gather correct coins
from curses import pair_number
from random import triangular
import requests
import json
import arbFuncs

# extract list of coins nd ask price from Exchange
url = "https://poloniex.com/public?command=returnTicker"


def Step_0():
    """
    0. Find coins able to be traded
    Exchange: Polonix
    https://docs.legacy.poloniex.com/#introduction"""
    token_json = arbFuncs.get_coin_tickers(url)
    token_list = arbFuncs.get_tradeables(token_json)
    return token_list


def Step_1(list):
    """
    1. Structure Triagnalar Pairs
        Compute"""
    triangle_pair = arbFuncs.create_pairs(list)
    return triangle_pair


"""MAIN"""
if __name__ == "__main__":
    list = Step_0()
    load_triangle_pair = Step_1(list)
    print(load_triangle_pair)


# print(token_list)
