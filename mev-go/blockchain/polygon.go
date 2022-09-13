package blockchain

import (
	"context"
	"fmt"
	"log"
	"math"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const MATIC = "https://polygon-mainnet.g.alchemy.com/v2/_mGa3DmfiBOUCy58oTMRpYgK8ni9gHJy"

func MATIC_Client() {
	polygon, err := ethclient.Dial(MATIC)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("we have a connection to polygon")
	_ = polygon // we'll use this in the upcoming sections

	account := common.HexToAddress("0x71c7656ec7ab88b098defb751b7401b5f6d8976f")
	balance, err := polygon.BalanceAt(context.Background(), account, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Unclean Balance", balance) // 25893180161173005034

	fbalance := new(big.Float)
	fbalance.SetString(balance.String())
	ethValue := new(big.Float).Quo(fbalance, big.NewFloat(math.Pow10(18)))
	fmt.Println("Clean Balance", ethValue)

}
