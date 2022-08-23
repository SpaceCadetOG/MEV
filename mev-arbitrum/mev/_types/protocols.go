package _types

import (
	"fmt"
	"github.com/ethereum/go-ethereum/common"
)

type Aave struct {
	provider_address common.Address
}

type UniswapV2 struct {
	factory common.Address
	router  common.Address
	token0  Token
	token1  Token
}

type UniswapV3 struct {
	factory common.Address
	router  common.Address
	// pair       common.Address
	token0 common.Address
	token1 common.Address
}
type Token struct {
	address common.Address
}

type Chainlink struct {
	agg   common.Address
	asset Token
}

type GMX struct {
	vault      common.Address
	router     common.Address
	reader     common.Address
	manager    common.Address
	price_feed common.Address
}

func AaveV3() {
	fmt.Println("Aave")
	
	

	aave_eth := Aave{
		provider_address: aavePoolProvider("ethereum"),
	}
	aave_opt := Aave{
		provider_address: aavePoolProvider("opt"),
	}
	fmt.Println("Ethereum AAVE", aave_eth.provider_address)
	fmt.Println("Optimism AAVE", aave_opt.provider_address)

}


func Uniswap_V3() {
	fmt.Println("UniswapV3")

	v3 := UniswapV3{
		factory: uniswap_v3_factory("arbitrum"),
		router:  uniswap_v3_router("arbitrum"),
		token0:  uniswap_v3_factory("arbitrum"),
		token1:  uniswap_v3_factory("arbitrum"),
	}

	fmt.Println("UNISWAP V3 Arbitrum", "factory:", v3.factory, "router:", v3.router, "token0:", v3.token0, "token:1", v3.token1)
}

func GMX_() {
	fmt.Println("GMX")

	gmx := GMX {
		vault: GMX_vault("arbitrum"),
		router: GMX_router("arbitrum"),
		reader: GMX_reader("arbitrum"),
		manager: GMX_manager("arbitrum"),
		price_feed: GMX_price_feed("arbitrum"),
		
	}

	fmt.Println("GMX Arbitrum", "Vault:", gmx.vault, "Router:", gmx.router, "Reader:", gmx.reader, "Manager:", gmx.manager, "Price Feed:", gmx.price_feed)
}



