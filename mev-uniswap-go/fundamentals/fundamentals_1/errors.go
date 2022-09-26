package fundamentals

import "fmt"

func iPanic() {
	defer func() {
		fmt.Println("1 deferred")
	}()
	panic("STOP")
}

func Me() {
	defer func() {
		fmt.Println("2 me deferred")
	}()
	iPanic()
}
func Panic() {
	defer func() {
		fmt.Println("3 Panic")
	}()

	Me()
}

func Defer() {
	fmt.Println("Defer")

}

func Error() {
	fmt.Println("Error")
}
