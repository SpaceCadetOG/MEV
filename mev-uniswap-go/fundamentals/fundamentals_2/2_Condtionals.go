package fundamentals

import "fmt"

func Conditionals_1() {
	if 1 < 2 {
		fmt.Println("Condtion 1 is a true statement")
	}
	profit := 6
	if 1 > profit {
		fmt.Println("Condtion 2 is a true statement")
	} else {
		fmt.Println("Condtion 2 is not a true statement")
	}

	if 7 >= 8 {
		fmt.Println("Condtion 3 is a true statement")
	} else {
		fmt.Println("Condtion 3 is not a true statement")
	}

	if "High" != "Low" {
		fmt.Println("Condtion 4 is a true statement")
	} else {
		fmt.Println("Condtion 4 is not a true statement")
	}

	if "High" != "Low" && 1 < profit {
		fmt.Println("Condtion 5 is a true statement")
	} else {
		fmt.Println("Condtion 5 is not a true statement")
	}

	if "High" != "Low" && 1 > profit {
		fmt.Println("Condtion 6 is a true statement")
	} else {
		fmt.Println("Condtion 6 is not a true statement")
	}

	if !(7 <= 8) {
		fmt.Println("Condtion 7 is a true statement")
	} else {
		fmt.Println("Condtion 7 is not a true statement")
	}
}

func Conditionals_2() {
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

	if !(user_token1.token_balance < 0) && !(user_token0.token_balance < 0) {
		fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
		fmt.Printf("User swap Token1 %v for %v Token0 \n", user_token1.token_balance, 1)
	} else {
		fmt.Printf("ERROR \n")
	}
	// Do math that updates variables
	newToken1Balance := user_token1.token_balance - token0price
	newToken0Balance := user_token0.token_balance + 1
	// update balance of user 1
	user_token0 = UserTokenBalance{token0, newToken0Balance}
	user_token1 = UserTokenBalance{token1, newToken1Balance}
	// require balance to be more than zero for fee(crumbs) *defi tip*
	if !(user_token1.token_balance < 0) && !(user_token0.token_balance < 0) {
		fmt.Printf("Result %v for %v Token0 \n", newToken1Balance, newToken0Balance)
		fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
	} else {
		fmt.Printf("SWAP ERROR \n")
	}
}

func Conditionals_3() {
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

	if !(user_token1.token_balance < 0) && !(user_token0.token_balance < 0) {
		// check the token names are correct
		if (user_token1.token.name == token1.name) && (user_token0.token.name == token0.name) {
			fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
		}
		fmt.Printf("User swap Token1 %v for %v Token0 \n", user_token1.token_balance, 1)
	} else {
		fmt.Printf("ERROR \n")
	}
	// Do math that updates variables
	newToken1Balance := user_token1.token_balance - token0price
	newToken0Balance := user_token0.token_balance + 1
	// update balance of user 1
	user_token0 = UserTokenBalance{token0, newToken0Balance}
	user_token1 = UserTokenBalance{token1, newToken1Balance}
	// require balance to be more than zero for fee(crumbs) *defi tip*
	if !(user_token1.token_balance < 0) && !(user_token0.token_balance < 0) {
		// check the token names are correct
		if (user_token1.token.name == token1.name) && (user_token0.token.name == token0.name) {
			fmt.Printf("Result %v for %v Token0 \n", newToken1Balance, newToken0Balance)
		}
		fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
	} else {
		fmt.Printf("SWAP ERROR \n")
	}
}

func Conditionals_4() {
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

	if !(user_token1.token_balance < 0) && !(user_token0.token_balance < 0) {
		// check the token names are correct
		if (user_token1.token.name == token1.name) && (user_token0.token.name == token0.name) {
			fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
		} else {
			fmt.Printf("MATCHING_ERROR \n")
		}
		fmt.Printf("User swap Token1 %v for %v Token0 \n", user_token1.token_balance, 1)
	} else {
		fmt.Printf("ERROR \n")
	}
	// require balance to be more than zero for fee(crumbs) *defi tip*
	if !(user_token1.token_balance < 0) && !(user_token0.token_balance < 0) {
		// check the token names are correct
		if (user_token1.token.name == "token1.name") && (user_token0.token.name == token0.name) {
			// Do math that updates variables
			newToken1Balance := user_token1.token_balance - token0price
			newToken0Balance := user_token0.token_balance + 1
			// update balance of user 1
			user_token0 = UserTokenBalance{token0, newToken0Balance}
			user_token1 = UserTokenBalance{token1, newToken1Balance}
			fmt.Printf("Result %v for %v Token0 \n", newToken1Balance, newToken0Balance)
		} else {
			fmt.Printf("MATCHING_ERROR \n")
		}
		fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
	} else {
		fmt.Printf("SWAP ERROR \n")
	}

	fmt.Println("SHOULD GET MATCHING ERROR AND BALANCE SHOULDNT UPDATE")
}

func Conditionals_5() {
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

	if !(user_token1.token_balance < 0) && !(user_token0.token_balance < 0) {
		// check the token names are correct
		if (user_token1.token.name == token1.name) && (user_token0.token.name == token0.name) {
			fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
		} else {
			fmt.Printf("MATCHING_ERROR \n")
		}
		fmt.Printf("User swap Token1 %v for %v Token0 \n", user_token1.token_balance, 1)
	} else {
		fmt.Printf("ERROR \n")
	} 
	// require balance to be more than zero for fee(crumbs) *defi tip*
	if !(user_token1.token_balance < 0) && !(user_token0.token_balance < 0) {
		// check the token names are correct
		if (user_token1.token.name == "token1.name") && (user_token0.token.name == token0.name) {
			// Do math that updates variables
			newToken1Balance := user_token1.token_balance - token0price
			newToken0Balance := user_token0.token_balance + 1
			// update balance of user 1
			user_token0 = UserTokenBalance{token0, newToken0Balance}
			user_token1 = UserTokenBalance{token1, newToken1Balance}
			fmt.Printf("Result %v for %v Token0 \n", newToken1Balance, newToken0Balance)
		} else {
			fmt.Printf("MATCHING_ERROR \n")
		}
		fmt.Printf("User Token0 Info %v + User Token1 Info %v \n", user_token0, user_token1)
	} else {
		fmt.Printf("SWAP ERROR \n")
	}

	fmt.Println("SHOULD GET MATCHING ERROR AND BALANCE SHOULDNT UPDATE")
}
