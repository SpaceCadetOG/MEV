package fundamentals

import "fmt"

// Setting  Variables

var eth = "ETH"

type UniswapInterface interface {
	VARS() (string, string)
	Add(x, y float64) float64
	Sub(x, y float64) float64
	List()
	Structs() (Uniswap, Uniswap)
	UseMethods(u Uniswap) (string, string)
}

func VARS() (string, string) {
	arbi := "arbi"
	return eth, arbi
}

func Add(x, y float64) float64 {
	return x + y
}

func Sub(x, y float64) float64 {
	return x - y
}

func List() {
	token_list := []string{"eth", "usdc"}
	var exchange_list []string
	exchange_list = append(exchange_list, "uniswap", "gmx", "sushiswap")
	fmt.Println(token_list[1])
	fmt.Println(exchange_list)
}

type Uniswap struct {
	token0          string
	token1          string
	UniswapPoolInfo UniswapPoolInfo
}

type UniswapPoolInfo struct {
	poolFee uint16
}

func Structs() (Uniswap, Uniswap) {
	pool_details := Uniswap{
		token0:          "eth",
		token1:          "usdc",
		UniswapPoolInfo: UniswapPoolInfo{poolFee: 3000},
	}

	pool_details2 := Uniswap{"eth", "gmx", UniswapPoolInfo{3000}}

	return pool_details, pool_details2

}

// dictionary
func Methods(u *Uniswap) (string, string) {
	return u.token0, u.token1
}
