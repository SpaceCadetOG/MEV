package main

import (

	"fmt"


	"github.com/SpaceCadetOG/MEV/mev-go/triangles/uniswap"
	// fundamentalsdata "github.com/SpaceCadetOG/MEV/mev-go/fundamentals/fundamentals_data"
)

type App struct{}

func (app *App) RunBot() error {
	fmt.Println("MEV BOT Starting Up")
	return nil
}

func main() {
	app := App{}
	if err := app.RunBot(); err != nil {
		fmt.Printf("Error Starting Up MEV BOT...check error: %v", err)
	}
	// blockchain.ARBITRUM_Client()
	// _url := "https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&start=1546300800&end=1546646400&period=14400"
	// it := triangles.Example_5(_url)
	// for i, rec := range it {
	// 	fmt.Printf("Date %v: %v {[high: %v], [low: %v], [open: %v], [close: %v], [volume: %v], [quoteVolume: %v], [weightedAverage: %v]", (i + 1), rec.Date, rec.High, rec.Low, rec.Open, rec.Close, rec.Volume, rec.QuoteVolume, rec.WeightedAverage)
	// 	fmt.Println()
	// }
	// pairs := uniswap.Uniswap().Data.Pools
	uniswap.Uniswap().StructurePairGroups()
	// fmt.Println(pairs[10])


}
