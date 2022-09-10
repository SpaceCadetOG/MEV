import requests
import json
req = requests.get('https://poloniex.com/public?command=returnTradeHistory&currencyPair=BTC_ETH&start=1410158341&end=141049937')
json_obj = json.loads(req.text)
# print(req.text)

for day in json_obj:
    print(json_obj[0])
    print(day['amount'])
