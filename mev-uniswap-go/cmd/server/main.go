package main

import (
	"fmt"

	// "github.com/SpaceCadetOG/MEV/mev-uniswap-go/triangles/uniswap"
	blockchain "github.com/SpaceCadetOG/MEV/mev-uniswap-go/cmd/blockchain/connect"
	fundamentals_2 "github.com/SpaceCadetOG/MEV/mev-uniswap-go/fundamentals/fundamentals_2"
)

type App struct{}

func (app *App) RunBot() error {
	fmt.Println("Triangle BOT Starting Up")
	blockchain.ARBITRUM_Client()
	return nil
}

func main() {
	app := App{}
	if err := app.RunBot(); err != nil {
		fmt.Printf("Error Starting Up Triangle BOT...check error: %v", err)
	}
	// // Uniswap Functions
	// uni := uniswap.Uniswap()
	// pair := uniswap.StructurePairGroups(uni)
	// fmt.Printf("PAIR A = [%v]\n", pair[0])
	// fmt.Printf("PAIR B = [%v]\n", pair[1])
	// fmt.Printf("PAIR C = [%v]\n", pair[2])

	///////////////////////////////////////////////////////////////

	// Fundamentals 2
	fundamentals_2.Conditionals_5()
}
