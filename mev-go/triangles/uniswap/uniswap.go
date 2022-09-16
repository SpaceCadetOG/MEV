package uniswap

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	// "sort"
	// "strings"

	"github.com/machinebox/graphql"
)

type UniswapPools struct {
	Data struct {
		Pools []struct {
			ID                  string `json:"id"`
			TotalValueLockedETH string `json:"totalValueLockedETH"`
			Token0Price         string `json:"token0Price"`
			Token1Price         string `json:"token1Price"`
			FeeTier             string `json:"feeTier"`
			Token0              struct {
				ID       string `json:"id"`
				Symbol   string `json:"symbol"`
				Name     string `json:"name"`
				Decimals string `json:"decimals"`
			} `json:"token0"`
			Token1 struct {
				ID       string `json:"id"`
				Symbol   string `json:"symbol"`
				Name     string `json:"name"`
				Decimals string `json:"decimals"`
			} `json:"token1"`
		} `json:"pools"`
	} `json:"data"`
}

// Uniswap Method 1 => Standard Go Http Request
func Uniswap() UniswapPools {
	fmt.Println("Uniswap Graph Method 1 (Arbitrum)")
	arbi := "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal"
	// Mapping that Will be query
	jsonData := map[string]string{
		"query": `
		{
			pools (orderBy: totalValueLockedETH, 
			  orderDirection: desc,
			  first:20) 
			  {
				  id
				  totalValueLockedETH
				  token0Price
				  token1Price
				  feeTier
				  token0 {id symbol name decimals}
				  token1 {id symbol name decimals}
			  }
	  }
		`,
	}

	json_value, err := json.Marshal(jsonData)
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", arbi, bytes.NewBuffer(json_value))
	if err != nil {
		panic(err)
	}
	req.Header.Add("content-type", "application/json")

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	data, err := ioutil.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}
	var pools UniswapPools
	json.Unmarshal(data, &pools)

	// for i, p  := range pools.Data.Pools {
	// 	if p.TotalValueLockedETH > "0" {
	// 		fmt.Println(fmt.Sprintf("{%v} Pool Address: %v || Token0: %v || Token1: %v || TotalETHLocked: %v",i, p.ID, p.Token0.Name, p.Token1.Name, p.TotalValueLockedETH))
	// 	}

	// }
	return pools
}

// Uniswap Method 2 => Go Package => will put into interface
func UniswapGraphMethod2() interface{} {
	fmt.Println("Uniswap Graph Method 2")
	eth := "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
	client := graphql.NewClient(eth)
	query := `
	{
		pools (orderBy: totalValueLockedETH, 
		  orderDirection: desc,
		  first:1) 
		  {
			  id
			  totalValueLockedETH
			  token0Price
			  token1Price
			  feeTier
			  token0 {id symbol name decimals}
			  token1 {id symbol name decimals}
		  }
  }
	`
	request := graphql.NewRequest(query)
	var response interface {
	}
	err := client.Run(context.Background(), request, &response)
	if err != nil {
		panic(err)
	}

	return response

}

// structure pairs groups
func (pairs UniswapPools) StructurePairGroups() {
	// triangular_pairs_list := []TrianglePairs{}
	// remove_duplicates_list := []string{}
	pairs_list := pairs.Data.Pools[:10]
	type PairInfo struct {
		base             string
		quote            string
		pair             string
		token_0_contract string
		token_1_contract string
		contract         string
		token_0_decimals string
		token_0_price    string
		token_1_decimals string
		token_2_price    string
	}
	// Loop through each token to find potential matches
	for _, pair_a := range pairs_list {
		// get first pair (A)
		a_base := pair_a.Token0.Symbol
		a_quote := pair_a.Token1.Symbol
		a_pair := a_base + "_" + a_quote
		a_token_0_contract := pair_a.Token0.ID
		a_token_1_contract := pair_a.Token1.ID
		a_contract := pair_a.ID
		a_token_0_decimals := pair_a.Token0.Decimals
		a_token_0_price := pair_a.Token0Price
		a_token_1_decimals := pair_a.Token1.Decimals
		a_token_1_price := pair_a.Token1Price
		// Pair A box
		pair_a_box := []string{a_base, a_quote}
		a := PairInfo{a_base, a_quote, a_pair, a_token_0_contract, a_token_1_contract, a_contract, a_token_0_decimals, a_token_0_price, a_token_1_decimals, a_token_1_price}
		fmt.Printf("Pair A: %v \n", a)

		for _, pair_b := range pairs_list {
			// get first pair (B)
			b_base := pair_b.Token0.Symbol
			b_quote := pair_b.Token1.Symbol
			b_pair := b_base + "_" + b_quote
			b_token_0_contract := pair_b.Token0.ID
			b_token_1_contract := pair_b.Token1.ID
			b_contract := pair_b.ID
			b_token_0_decimals := pair_b.Token0.Decimals
			b_token_0_price := pair_b.Token0Price
			b_token_1_decimals := pair_b.Token1.Decimals
			b_token_1_price := pair_b.Token1Price

			if pair_b != pair_a {
				b := PairInfo{b_base, b_quote, b_pair, b_token_0_contract, b_token_1_contract, b_contract, b_token_0_decimals, b_token_0_price, b_token_1_decimals, b_token_1_price}
				fmt.Printf("Pair B: %v \n", b)

				if b_base == pair_a_box[0] || b_quote == pair_a_box[0] || b_base == pair_a_box[1] || b_quote == pair_a_box[1] {
					for _, pair_c := range pairs_list {
						// get first pair (C)
						c_base := pair_c.Token0.Symbol
						c_quote := pair_c.Token1.Symbol
						c_pair := c_base + "_" + c_quote
						c_token_0_contract := pair_c.Token0.ID
						c_token_1_contract := pair_c.Token1.ID
						c_contract := pair_c.ID
						c_token_0_decimals := pair_c.Token0.Decimals
						c_token_0_price := pair_c.Token0Price
						c_token_1_decimals := pair_c.Token1.Decimals
						c_token_1_price := pair_c.Token1Price

						if pair_c != pair_a && pair_c != pair_b {
							pair_box := []string{a_base, a_quote, b_base, b_quote, c_base, c_quote}
							count_c_base := 0
							count_c_quote := 0

							for _, l := range pair_box {
								if l == c_base {
									count_c_base += 1

								}
							}
							for _, l := range pair_box {
								if l == c_quote {
									count_c_quote += 1

								}
							}
							if count_c_base == 2 && count_c_quote == 2 && c_base != c_quote {
								c := PairInfo{c_base, c_quote, c_pair, c_token_0_contract, c_token_1_contract, c_contract, c_token_0_decimals, c_token_0_price, c_token_1_decimals, c_token_1_price}
								fmt.Printf("Pair C: %v \n", c)
								fmt.Println()
								fmt.Printf("Triangle: [a => [%v][%v]] -> [b => [%v][%v]] -> [c => [%v][%v]] \n", pair_a.Token0.Name, pair_a.Token1.Name, pair_b.Token0.Name, pair_b.Token1.Name, pair_c.Token0.Name, pair_c.Token1.Name)
								fmt.Println()
							}
						}

					}

				}

			}

		}
	}

}
