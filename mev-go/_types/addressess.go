package _types

import (
	"github.com/ethereum/go-ethereum/common"
)

var aave_pool_provider = make(map[string]common.Address)

func aavePoolProvider(chain string) common.Address {

	aave_pool_provider["ethereum"] = common.HexToAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5")
	aave_pool_provider["opt"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	aave_pool_provider["arbitrum"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	aave_pool_provider["avalanche-V2"] = common.HexToAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f")
	aave_pool_provider["avalanche-V3"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	aave_pool_provider["polygon-V2"] = common.HexToAddress("0xd05e3E715d945B59290df0ae8eF85c1BdB684744")
	aave_pool_provider["polygon-V3"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	// fmt.Println(aave_pool_provider[chain])
	return aave_pool_provider[chain]
}

// uniswap_router
var uniswap_router = make(map[string]common.Address)

func uniswap_v3_router(chain string) common.Address {

	uniswap_router["ethereum"] = common.HexToAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5")
	uniswap_router["opt"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	uniswap_router["arbitrum"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	uniswap_router["polygon"] = common.HexToAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f")
	// fmt.Println(uniswap_router[chain])
	return uniswap_router[chain]
}

// uniswap_factory
var uniswap_factory = make(map[string]common.Address)

func uniswap_v3_factory(chain string) common.Address {

	uniswap_factory["ethereum"] = common.HexToAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5")
	uniswap_factory["opt"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	uniswap_factory["arbitrum"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	uniswap_factory["avalanche-V2"] = common.HexToAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f")
	// fmt.Println(uniswap_factory[chain])
	return uniswap_factory[chain]
}

// gmx_vault
var gmx_vault = make(map[string]common.Address)

func GMX_vault(chain string) common.Address {

	gmx_vault["arbitrum"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	gmx_vault["avalanche"] = common.HexToAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f")
	// fmt.Println(uniswap_factory[chain])
	return (gmx_vault[chain])
}

// gmx_vault
var gmx_router = make(map[string]common.Address)

func GMX_router(chain string) common.Address {

	gmx_router["arbitrum"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	gmx_router["avalanche"] = common.HexToAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f")
	// fmt.Println(uniswap_factory[chain])
	return (gmx_router[chain])
}

// gmx_vault
var gmx_reader = make(map[string]common.Address)

func GMX_reader(chain string) common.Address {

	gmx_reader["arbitrum"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	gmx_reader["avalanche"] = common.HexToAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f")
	// fmt.Println(uniswap_factory[chain])
	return (gmx_reader[chain])
}

// gmx_vault
var gmx_manager = make(map[string]common.Address)

func GMX_manager(chain string) common.Address {

	gmx_manager["arbitrum"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	gmx_manager["avalanche"] = common.HexToAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f")
	// fmt.Println(uniswap_factory[chain])
	return (gmx_manager[chain])
}

// gmx_vault
var gmx_priceFeed = make(map[string]common.Address)

func GMX_price_feed(chain string) common.Address {

	gmx_priceFeed["arbitrum"] = common.HexToAddress("0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb")
	gmx_priceFeed["avalanche"] = common.HexToAddress("0xb6A86025F0FE1862B372cb0ca18CE3EDe02A318f")
	// fmt.Println(uniswap_factory[chain])
	return (gmx_priceFeed[chain])
}

func tokenRegistry(chain string, asset string) common.Address {
	token := make(map[string]map[string]common.Address)
	token["ethereum"]["usdc"] = common.HexToAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5")
	token["avalanche"]["usdc"] = common.HexToAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5")
	token["avalanche"]["usdc.e"] = common.HexToAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5")
	token["arbitrum"]["usdc"] = common.HexToAddress("0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5")
	return token[chain][asset]
}

var uniswapV2 = common.HexToAddress("")
var uniswapV2R = common.HexToAddress("")
var uniswapV2F = common.HexToAddress("")

var uniswapV3 = common.HexToAddress("")
var uniswapV3R = common.HexToAddress("")
var uniswapV3F = common.HexToAddress("")

// arbitum
var gmx = common.HexToAddress("")
var gmxV = common.HexToAddress("")
var gmxR = common.HexToAddress("")
var gmxReader = common.HexToAddress("")
var gmxM = common.HexToAddress("")
