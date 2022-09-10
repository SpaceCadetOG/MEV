import requests
import json

_url = "https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_ETH&depth=10"
# req = requests.get(_url)
# json_obj = json.loads(req.text)
# print(req.text)

# print(json_obj['asks'])
# print(json_obj['bids'])

def get_api_data(url):
    req = requests.get(url)
    if req.status_code == 200:
        return json.loads(req.text)
    else: return 0

prices = get_api_data("https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&start=1546300800&end=1546646400&period=14400")
print(prices[1])
print(prices[2])

orderBook = get_api_data(_url)
print(orderBook['asks'])
print(orderBook['bids'])


def multiply_number(number):
    return number * 100

price_by_100 = multiply_number(2)
print(price_by_100)

