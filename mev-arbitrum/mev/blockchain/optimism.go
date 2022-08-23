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

const OPT = "https://opt-mainnet.g.alchemy.com/v2/vsFDGKdtpoZd19zlv3F7Z_x5EXTol_zr"

func OPT_Client() {
	optimism, err := ethclient.Dial(OPT)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("we have a connection to optimism")
	_ = optimism // we'll use this in the upcoming sections

	account := common.HexToAddress("0x5a8D801d8B3a08B15C6D935B1a88ef0f2D2F860A")
	balance, err := optimism.BalanceAt(context.Background(), account, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Unclean Balance", balance) // 25893180161173005034

	fbalance := new(big.Float)
	fbalance.SetString(balance.String())
	ethValue := new(big.Float).Quo(fbalance, big.NewFloat(math.Pow10(18)))
	fmt.Println("Clean Balance", ethValue)

}
