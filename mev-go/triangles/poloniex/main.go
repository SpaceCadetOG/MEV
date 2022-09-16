package poloniex

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

/*
Step 0: Finding Coins which can be traded
Exchange: Poloniex
https://docs.legacy.poloniex.com/#introduction

 "https://poloniex.com/public?command=returnTicker"

*/

/*
Step 1:
Exchange: Poloniex
https://docs.legacy.poloniex.com/#introduction
*/

func Main(url string) string {
	// type Rep struct {
	// 	ID            int    `json:"id"`
	// 	Last          string `json:"last"`
	// 	LowestAsk     string `json:"lowestAsk"`
	// 	HighestBid    string `json:"highestBid"`
	// 	PercentChange string `json:"percentChange"`
	// 	BaseVolume    string `json:"baseVolume"`
	// 	QuoteVolume   string `json:"quoteVolume"`
	// 	IsFrozen      string `json:"isFrozen"`
	// 	PostOnly      string `json:"postOnly"`
	// 	High24Hr      string `json:"high24hr"`
	// 	Low24Hr       string `json:"low24hr"`
	// }

	client := &http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Header_Key", "Header_Value")
	res, err := client.Do(req)

	if err != nil {
		fmt.Println("Err is", err)
	}
	defer res.Body.Close()

	resBody, _ := ioutil.ReadAll(res.Body)
	response := string(resBody)

	return response

}


