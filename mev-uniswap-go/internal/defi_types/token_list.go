package defi_types

import "fmt"

// Token List to loop from

type Tokens struct {
	network string
	name string
	address string
}
var network []string
var token_list []Tokens

// will add Token to list
func AddToken(network, tokenName, tokenAddress string) {

	new_token := Tokens{
		network: network,
		name: tokenName,
		address: tokenAddress,
	}
	fmt.Println(token_list)
	token_list = append(token_list, new_token)
	fmt.Println(token_list)
}

// will index to recive token
func GetToken() {
	
}