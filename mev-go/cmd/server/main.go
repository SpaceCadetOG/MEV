package main

import (
	"fmt"

	// "github.com/SpaceCadetOG/MEV/mev-go/graphql"
	"github.com/SpaceCadetOG/MEV/mev-go/cmd/blockchain"
	"github.com/SpaceCadetOG/MEV/mev-go/triangles"
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
	blockchain.ARBITRUM_Client()
	triangles.UniswapGraphMethod1()
	// ["data"]["pools"]

}
