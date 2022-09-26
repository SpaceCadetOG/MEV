package fundamentals

import "fmt"

func UsingVariables_1() {
	token0price := 1
	token1price := 1400

	fmt.Printf("token0: %v _ token1: %v \n", token0price, token1price)
}
func ChangingVariables_1() {
	// create type structs
	type Token struct {
		name string
	}
	// Set variables
	var token0 Token
	var token1 Token
	var pair []Token
	// assign variables using struct fields
	token0 = Token{"weth"}
	token1 = Token{"usdc"}
	// push to array type
	pair = append(pair, token0, token1)

	fmt.Printf("token0: %v / token1: %v \n", token0.name, token1.name)
	fmt.Printf("pair: %v \n", pair)
}
func ChangingVariables_2() {
	// create type structs
	type Token struct {
		name  string
		price int
	}
	// Short Declare Varibles to input to struct
	weth := "weth"
	usdc := "usdc"
	token0price := 1400
	token1price := 1
	// Set variables
	var token0 Token
	var token1 Token
	var pair []Token
	// assign variables using struct fields
	token0 = Token{weth, token0price}
	token1 = Token{usdc, token1price}
	// push to array type
	pair = append(pair, token0, token1)

	fmt.Printf("token0: %v / token1: %v \n", token0.name, token1.name)
	fmt.Printf("token0Price: %v / token1Price: %v \n", token0.price, token1.price)
	fmt.Printf("pair: %v \n", pair)
}
func UsingMath_1() {
	type Token struct {
		name  string
		price int
	}
	// Short Declare Varibles to input to struct
	weth := "weth"
	usdc := "usdc"
	token0price := 1400
	token1price := 35
	// Set variables
	var token0 Token
	var token1 Token
	var pair []Token
	token0 = Token{weth, token0price}
	token1 = Token{usdc, token1price}
	pair = append(pair, token0, token1)

	add := pair[0].price + pair[1].price
	sub := pair[0].price - pair[1].price
	mult := pair[0].price * pair[1].price
	div := pair[0].price / pair[1].price

	fmt.Printf("%v price: %v + %v price: %v = %v \n", token0.name, token0.price, token1.name, token1.price, add)
	fmt.Printf("%v price: %v - %v price: %v = %v \n", token0.name, token0.price, token1.name, token1.price, sub)
	fmt.Printf("%v price: %v * %v price: %v = %v \n", token0.name, token0.price, token1.name, token1.price, mult)
	fmt.Printf("%v price: %v / %v price: %v = %v \n", token0.name, token0.price, token1.name, token1.price, div)
}
func UsingMath_2() {
	type Token struct {
		name  string
		price int
	}
	// Create Nested Struct For user => Inherits Tokens Type
	type UserTokenBalance struct {
		token         Token
		token_balance int
	}
	// Short Declare Varibles to input to struct
	weth := "weth"
	usdc := "usdc"
	token0price := 1400
	token1price := 35
	var token0 Token
	var token1 Token
	var pair []Token
	token0 = Token{weth, token0price}
	token1 = Token{usdc, token1price}
	pair = append(pair, token0, token1)
	user_token0 := UserTokenBalance{token0, 0}
	user_token1 := UserTokenBalance{token1, 1500}
	fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
	fmt.Printf("User swap Token1 %v for %v Token0 \n", user_token1.token_balance, 1)
	// Do math that updates variables
	newToken1Balance := user_token1.token_balance - token0price
	newToken0Balance := user_token0.token_balance + 1
	// update balance of user 1
	user_token0 = UserTokenBalance{token0, newToken0Balance}
	user_token1 = UserTokenBalance{token1, newToken1Balance}
	fmt.Printf("Result %v for %v Token0 \n", newToken1Balance, newToken0Balance)
	fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
}
