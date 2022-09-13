package main

import (
	"fmt"
	"profits-protocol/_types"
	"profits-protocol/blockchain"
	// "profits-protocol/logic/interactions"
)

func main() {
	fmt.Println("MEV BOT")
	// blockchain.ETH_Client()
	// blockchain.AVAX_Client()
	// blockchain.ARBITRUM_Client()
	// blockchain.MATIC_Client()
	// blockchain.OPT_Client()
	blockchain.LOCALHOST_Client()
	_types.AaveV3()
	_types.Uniswap_V3()
	// interactions.DecideTrade()
	// interactions.DecideLend()
	_types.GMX_()

}
