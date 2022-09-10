# Step 0: Gather correct coins
"""
1. Find coins able to be traded
Exchange: Polonix 
https://docs.legacy.poloniex.com/#introduction
"""
import requests
import json

# extract list of coins nd ask price from Exchange


# loop through each objects and find the tradeable pairs


def get_coin_tickers(url):
    req_1 = requests.get(url)
    json_response = json.loads(req_1.text)
    return json_response


def get_tradeables(coin_json):
    coin_list = []
    for coin in coin_json:
        is_frozen = coin_json[coin]["isFrozen"]
        is_post_only = coin_json[coin]["postOnly"]
        if is_frozen == "0" and is_post_only == "0":
            coin_list.append(coin)
    return coin_list


# Declare


# Structure Pairs
def create_pairs(coin_list):

    triangular_pairs_list = []
    remove_deplicate_list = []
    pairs_list = coin_list[0:]

    # get Pair A
    for pair_a in pairs_list:
        pair_a_split = pair_a.split("_")
        pair_a_base = pair_a_split[0]
        pair_a_quote = pair_a_split[1]

        pair_a_box = [pair_a_base, pair_a_quote]

        # get Pair B
        for pair_b in pairs_list:
            pair_b_split = pair_b.split("_")
            pair_b_base = pair_b_split[0]
            pair_b_quote = pair_b_split[1]

            # Check Pair B
            if pair_b != pair_a:
                if pair_b_base in pair_a_box or pair_b_quote in pair_a_box:
                    pass
                    # get Pair C
                    for pair_c in pairs_list:
                        pair_c_split = pair_c.split("_")
                        pair_c_base = pair_c_split[0]
                        pair_c_quote = pair_c_split[1]
                        # Start here get Token C

                        print(pair_a, pair_b, pair_c)
