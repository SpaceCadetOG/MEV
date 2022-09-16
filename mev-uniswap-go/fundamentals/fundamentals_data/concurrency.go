package fundamentalsdata

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

/* Go Routines */
func hello() {
	time.Sleep((1 * time.Second))
	fmt.Println("goRoutine")
}
func GoRoutine() {
	go hello()
	fmt.Println("print 1")
	time.Sleep((2 * time.Second))
}

/* Channels */
func calculate(values chan int) {
	time.Sleep((1 * time.Second))
	value := rand.Intn(10)
	fmt.Printf("Value Calculated: %d\n", value)

	values <- value
}
func Channels() {
	values := make(chan int, 10)
	go calculate(values)

	value := <-values
	fmt.Println(value)
}
func calculateValues(values chan int) {
	for i := 0; i < 10; i++ {
		value := rand.Intn(10)
		fmt.Printf("Value Calculated: %d\n", value)
		values <- value
	}
}

// Block when channel is filled. Give a limit
func BufferedChannels() {
	time.Sleep((1 * time.Second))
	values := make(chan int, 2)
	go calculateValues(values)
	for i := 0; i < 10; i++ {
		value := <-values
		fmt.Println(value)
	}
}

/* WaitGroups */
var urls = []string{
	"https://poloniex.com/public?command=returnTicker", "https://poloniex.com/public?command=return24hVolume", "https://poloniex.com/public?command=returnTradeHistory&currencyPair=BTC_ETH&start=1410158341&end=141049937",
}

func fetch(url string, wg *sync.WaitGroup) {
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(resp.Status)
	wg.Done()
}
func lookup() {
	var wg sync.WaitGroup
	for _, url := range urls {
		wg.Add(1)
		go fetch(url, &wg)
	}
	wg.Wait()
	fmt.Println("Finished Look Up")
}
func WaitGroup() {
	lookup()
}

/* Mutexes */
type Account struct {
	Balance int
	Mutex   *sync.Mutex
}

func (a *Account) Withdraw(value int, wg *sync.WaitGroup) {
	a.Mutex.Lock()
	a.Balance -= value
	a.Mutex.Unlock()
	wg.Done()
}
func (a *Account) Deposit(value int, wg *sync.WaitGroup) {
	a.Mutex.Lock()
	a.Balance += value
	a.Mutex.Unlock()
	wg.Done()
}
func Mutexes() {
	var m sync.Mutex
	acct := Account{Balance: 1000, Mutex: &m}
	var wg sync.WaitGroup
	wg.Add(2)
	go acct.Withdraw(700, &wg)
	fmt.Println("Acct balance Updated after Withdraw")
	fmt.Println(acct.Balance)
	go acct.Deposit(100, &wg)
	wg.Wait()
	fmt.Println("Acct balance Updated after Deposit")
	fmt.Println(acct.Balance)
}

/* Worker Pools */
type Site struct {
	URL string
}
type Result struct {
	URL    string
	Status int
}
func _lookup(wId int, jobs <-chan Site, results chan<- Result) {

	for site := range jobs {
		log.Printf("WorkerId: %d\n", wId)
		resp, err := http.Get(site.URL)
		if err != nil {
			log.Println(err.Error())
		}
		results <- Result{URL: site.URL,
			Status: resp.StatusCode}
	}
	fmt.Println("Finished Look Up")
}
func Worker_Pools() {
	jobs := make(chan Site, 3)
	results := make(chan Result, 3)

	for w := 1; w <= 3; w++ {
		go _lookup(w, jobs, results)
	}

	for _, url := range urls {
		jobs <- Site{URL: url}
	}
	close(jobs)

	for a := 1; a <= 3; a++ {
		result := <-results
		log.Println(result)
	}
}
