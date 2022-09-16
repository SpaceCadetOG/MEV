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

const ARBI = "https://arb1.arbitrum.io/rpc"

func ARBITRUM_Client() {
	arbitrum, err := ethclient.Dial(ARBI)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("we have a connection to arbitum")
	_ = arbitrum // we'll use this in the upcoming sections

	account := common.HexToAddress("0x71c7656ec7ab88b098defb751b7401b5f6d8976f")
	balance, err := arbitrum.BalanceAt(context.Background(), account, nil)
	if err != nil {
		log.Fatal(err)
	}
	fbalance := new(big.Float)
	fbalance.SetString(balance.String())
	ethValue := new(big.Float).Quo(fbalance, big.NewFloat(math.Pow10(18)))
	fmt.Println("Clean Balance", ethValue)

}
