package triangles

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

// Vars and Types
func Example1() {
	// Set Variables
	token0 := "eth"
	token1 := "usdc"
	token0_price := 1616.91
	token1_price := 1.00

	// Array => List(Python) or Array(Javascript)
	tokens := []string{token0, token1}
	token_prices := []float64{token0_price, token1_price}

	fmt.Printf("%T\n", tokens)
	fmt.Println(tokens)
	fmt.Printf("%T\n", token_prices)
	fmt.Println(token_prices)
	fmt.Printf("%T\n", tokens[0])
	fmt.Println(tokens[0])
	fmt.Printf("%T\n", token_prices[0])
	fmt.Println(token_prices[0])

	// Structs => Dictionary(Python) or Objects(Javascript)
	type tokenDict struct {
		token       string
		token_price float64
	}

	token_dict_0 := tokenDict{
		token0,
		token0_price,
	}
	token_dict_1 := tokenDict{
		token1,
		token1_price,
	}
	// Mapping to Struct(or Type) => Set value to object
	token_dict_list := []tokenDict{token_dict_0, token_dict_1}

	fmt.Println(token_dict_0, token_dict_1)
	fmt.Printf("token Object: %T\n", token_dict_list)
	fmt.Println(token_dict_list)
	fmt.Println(token_dict_list[1].token_price)
}

// Structs || Dictionary
func Example2() {
	// Set Variables
	token0 := "eth"
	token1 := "usdc"
	token0_price := 1616.91
	token1_price := 1.00

	// Array => List(Python) or Array(Javascript)
	tokens := []string{token0, token1}
	token_prices := []float64{token0_price, token1_price}

	// Structs => Dictionary(Python) or Objects(Javascript)
	type tokenDict struct {
		token       string
		token_price float64
	}

	token_dict_0 := tokenDict{
		token0,
		token0_price,
	}
	token_dict_1 := tokenDict{
		token1,
		token1_price,
	}
	// Mapping to Struct(or Type) => Set value to object
	token_dict_list := []tokenDict{token_dict_0, token_dict_1}
	print(token_dict_list, token_prices)

	if tokens[0] == "dai" {
		fmt.Println("found token")
	} else if tokens[0] == "eth" {
		fmt.Println("found token")
	}
}

// Mapping and List => loop Through
func Example3() {
	// Set Variables
	token0 := "eth"
	token1 := "usdc"
	token0_price := 1616.91
	token1_price := 1.00

	// Array => List(Python) or Array(Javascript)
	tokens := []string{token0, token1}
	token_prices := []float64{token0_price, token1_price}

	// Structs => Dictionary(Python) or Objects(Javascript)
	type tokenDict struct {
		token       string
		token_price float64
	}

	token_dict_0 := tokenDict{
		token0,
		token0_price,
	}
	token_dict_1 := tokenDict{
		token1,
		token1_price,
	}
	// Mapping to Struct(or Type) => Set value to object
	token_dict_list := []tokenDict{token_dict_0, token_dict_1}
	fmt.Println()
	for _, t := range tokens {
		fmt.Println(t)
	}
	fmt.Println()
	for _, price := range token_prices {
		fmt.Println(price)
	}
	fmt.Println()
	for _, list := range token_dict_list {
		if list.token_price >= 1 {
			fmt.Println(list)
		}
	}
	for _, list := range token_dict_list {
		if list.token_price >= 1 {
			fmt.Println(list)
			break
		}
	}
	// While Loop
	counts := 0
	for counts < 10 {
		time.Sleep((1 * time.Second))
		counts = counts + 1
		if counts > 5 {
			break
		}

		fmt.Println(counts)
	}

}

// Conditonals
func Example4() {
	// Set Variables
	token0 := "eth"
	token1 := "usdc"
	token0_price := 1616.91
	token1_price := 1.00

	// Array => List(Python) or Array(Javascript)
	tokens := []string{token0, token1}
	token_prices := []float64{token0_price, token1_price}

	// Structs => Dictionary(Python) or Objects(Javascript)
	type tokenDict struct {
		token       string
		token_price float64
	}

	token_dict_0 := tokenDict{
		token0,
		token0_price,
	}
	token_dict_1 := tokenDict{
		token1,
		token1_price,
	}
	// Mapping to Struct(or Type) => Set value to object
	token_dict_list := []tokenDict{token_dict_0, token_dict_1}

	token_1high := false
	token0_low := false

	switch {
	case token_1high, token0_low == true:
		fmt.Println("Good Buy")
	case token_prices[0] > 1000 || tokens[0] == "eth":
		fmt.Println("Hold Buy")
	default:
		fmt.Println("Nothing good")
	}

	for _, list := range token_dict_list {
		if list.token_price >= 1 {
			fmt.Println(list)
			break
		}
	}

}

// Get API Data => https://dev.to/billylkc/parse-json-api-response-in-go-10ng
type Response []struct {
	Date            string `json:"date"`
	High            string `json:"high"`
	Low             string `json:"low"`
	Open            string `json:"open"`
	Close           string `json:"close"`
	Volume          string `json:"volume"`
	QuoteVolume     string `json:"quoteVolume"`
	WeightedAverage string `json:"weightedAverage"`
}

func Example_5(url string) Response {

	resp, err := http.Get(url)
	if err != nil {
		fmt.Println("No response from request")
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body) // response body is []byte
	if err != nil {                        // Parse []byte to go struct pointer
		fmt.Printf("Can not unmarshal JSON %v", err)
	}

	var result_ Response
	json.Unmarshal(body, &result_)
	return result_
}
