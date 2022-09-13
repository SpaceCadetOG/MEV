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
        Compute
    """
    triangle_pair = arbFuncs.create_pairs(list)
    with open("structured_trianglar_pairs.json", "w") as fp:
        json.dump(triangle_pair, fp)


## Get Surface Rates
def Step_2():
    # Get Pairs
    with open("structured_trianglar_pairs.json") as json_file:
        structured_pairs = json.load(json_file)
    # Get Surface Prices
        prices_json = arbFuncs.get_coin_tickers(url)
    # Loop Through and et Structure price Info
    for t_pair in structured_pairs:
        prices_dict = arbFuncs.get_price_for_t_pair(t_pair, prices_json)
        surface_arb = arbFuncs.calc_triangular_arb_surface_rate(t_pair, prices_dict)
""" MAIN """
if __name__ == "__main__":
    # coin_list = Step_0()
    # structured_pairs = Step_1(coin_list)
    # while True:
    Step_2()
