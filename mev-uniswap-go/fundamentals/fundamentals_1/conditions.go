package fundamentals

import "fmt"

func IF_ELSE() {
	var limit int = 140
	var price int = 100

	if limit >= 150 && price >= 100 {
		println("buy")
	} else if limit >= 120 || price >= 100 {
		println("Maybe")
	} else {
		println("sell")
	}
}

func SWITCH() {
	var limit int = 140
	var price int = 100

	switch {
	case limit >= 120 && price >= 100:
		println("sell")

	case limit >= 150 || price >= 100:
		println("buy")
	default:
		println("hold")
	}
}

func LOOPS() []float64 {
	prices := []float64{24.33, 45.77, 77.88}

	for _, v := range prices {
		// fmt.Println(i)
		fmt.Println(v)
	}

	return prices
}
