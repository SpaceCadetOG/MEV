package triangles

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/machinebox/graphql"
)

// Uniswap Method 1 => Standard Go Http Request
func UniswapGraphMethod1() {
	fmt.Println("Uniswap Graph Method 1 (Arbitrum)")
	arbi := "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-minimal"
	// Mapping that Will be query
	jsonData := map[string]string{
		"query": `
		{
			pools (orderBy: totalValueLockedETH, 
			  orderDirection: desc,
			  first:500) 
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

	fmt.Println(string(data))
}
// Uniswap Method 2 => Go Package => will put into interface
func UniswapGraphMethod2() {
	fmt.Println("Uniswap Graph Method 2")
	eth := "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
	client := graphql.NewClient(eth)
	query := `
	{
		pools (orderBy: totalValueLockedETH, 
		  orderDirection: desc,
		  first:500) 
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

	fmt.Println(response)
}
