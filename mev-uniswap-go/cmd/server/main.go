package main

import (
	"fmt"

	"github.com/SpaceCadetOG/MEV/mev-go/cmd/blockchain"
	"github.com/SpaceCadetOG/MEV/mev-go/triangles/uniswap"
	// fundamentalsdata "github.com/SpaceCadetOG/MEV/mev-go/fundamentals/fundamentals_data"
)

type App struct{}

func (app *App) RunBot() error {
	fmt.Println("MEV BOT Starting Up")
	blockchain.ARBITRUM_Client()
	return nil
}

func main() {
	app := App{}
	if err := app.RunBot(); err != nil {
		fmt.Printf("Error Starting Up MEV BOT...check error: %v", err)
	}
	uni := uniswap.Uniswap()
	pair := uniswap.StructurePairGroups(uni)
	fmt.Printf("PAIR A = [%v]\n", pair[0])
	fmt.Printf("PAIR B = [%v]\n", pair[1])
	fmt.Printf("PAIR C = [%v]\n", pair[2])

}
