package main

import (
   "io/ioutil"
   "log"
   "net/http"
)
var url = "https://poloniex.com/public?command=returnTicker"
func main() {
   resp, err := http.Get(url)
   if err != nil {
      log.Fatalln(err)
   }
//We Read the response body on the line below.
   body, err := ioutil.ReadAll(resp.Body)
   if err != nil {
      log.Fatalln(err)
   }
//Convert the body to type string
   sb := string(body)
   log.Printf(sb)
}
