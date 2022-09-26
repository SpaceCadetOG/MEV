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

const HARDHAT = "http://127.0.0.1:8545/"

func LOCALHOST_Client() {
	local, err := ethclient.Dial(HARDHAT)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("we have a connection to hardhat-local")
	_ = local // we'll use this in the upcoming sections

	account := common.HexToAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
	balance, err := local.BalanceAt(context.Background(), account, nil)
	if err != nil {
		log.Fatal(err)
	}
	// fmt.Println("Unclean Balance", balance) // 25893180161173005034

	fbalance := new(big.Float)
	fbalance.SetString(balance.String())
	ethValue := new(big.Float).Quo(fbalance, big.NewFloat(math.Pow10(18)))
	fmt.Println("Balance", ethValue)

}
