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

const ETH = "https://mainnet.infura.io/v3/defa47742dfd4a1dbc666cac6ead362f"

func ETH_Client() {
	ethereum, err := ethclient.Dial(ETH)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("we have a connection to ethereum")
	_ = ethereum // we'll use this in the upcoming sections

	account := common.HexToAddress("0xE5e96c7AA9De0451DBE29ACDBFD7632F0963f121")
	balance, err := ethereum.BalanceAt(context.Background(), account, nil)
	if err != nil {
		log.Fatal(err)
	}

	fbalance := new(big.Float)
	fbalance.SetString(balance.String())
	ethValue := new(big.Float).Quo(fbalance, big.NewFloat(math.Pow10(18)))
	fmt.Println("Balance", ethValue)

}
