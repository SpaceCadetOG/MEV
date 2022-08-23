package interactions

// 1)
// will perform buys sell logic
// if else statements => arbitrage
// switch statements => yield bot

// 2)
// create functions that will input tokens
// fake sensriors

// 3 create methods and interfaces that will go on all blockchain

var chainlinkPrice = 1
var exchangeBPrice = .98
var exchangeAPrice = 1.01

var exchangeARate = 3.78
var exchangeBRate = 4.99
var exchangeCRate = 4.01

func BuyExchangeA() {
	println("Buy on A")
}

func SellExchangeA() {
	println("Sell on A")
}

func BuyExchangeB() {
	println("Buy on B")
}

func SellExchangeB() {
	println("Sell on B")
}

func DecideTrade() {
	// is exchange A price < price || exchange B price > price
	if exchangeAPrice < float64(chainlinkPrice) || exchangeBPrice > float64(chainlinkPrice) {
		BuyExchangeB()
		SellExchangeA()
	} else if exchangeBPrice < float64(chainlinkPrice) || exchangeAPrice > float64(chainlinkPrice) {
		BuyExchangeA()
		SellExchangeB()
	} else {
		println("NONE")
	}
}

func LendOnExchangeA() {
	println("lend on A")
}

func WithdrawOnExchangeA() {
	println("withdraw on A")
}

func LendOnExchangeB() {
	println("lend on B")
}

func WithdrawOnExchangeB() {
	println("withdraw on B")
}

func LendOnExchangeC() {
	println("lend on C")
}

func WithdrawOnExchangeC() {
	println("withdraw on C")
}

func Rebalance() {
	println("Rebalancing Portfolio + Claiming Reward(if not done so)")
}

func DecideLend() {
	switch {
	case exchangeARate > exchangeBRate || exchangeARate > exchangeCRate:
		LendOnExchangeA()
	case exchangeBRate > exchangeARate || exchangeBRate > exchangeCRate:
		LendOnExchangeB()
	case exchangeCRate > exchangeARate || exchangeCRate > exchangeBRate:
		LendOnExchangeC()
	default:
		Rebalance()
	}
}
