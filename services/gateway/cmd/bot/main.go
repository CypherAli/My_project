package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

const (
	baseURL  = "http://localhost:8080/api/v1"
	username = "bot_trader"
	email    = "bot@example.com"
	pass     = "password123"
)

type LoginResponse struct {
	AccessToken string `json:"access_token"`
}

func main() {
	fmt.Println("🤖 Market Maker Bot starting...")

	// 1. Đăng nhập để lấy Token
	token, err := login()
	if err != nil {
		// Nếu lỗi, thử đăng ký user bot luôn (cho tiện)
		fmt.Println("⚠️  Login failed, trying to register...")
		err = register()
		if err != nil {
			panic(fmt.Errorf("register failed: %v", err))
		}
		token, err = login()
		if err != nil {
			panic(fmt.Errorf("login after register failed: %v", err))
		}
	}
	fmt.Println("✅ Bot logged in! Token:", token[:10]+"...")

	// 2. Vòng lặp giao dịch
	for {
		// Random dữ liệu
		side := "Bid"
		if rand.Intn(2) == 0 {
			side = "Ask"
		}

		// Giá dao động quanh 50,000 (từ 49,000 đến 51,000)
		price := 49000 + rand.Intn(2000)
		// Số lượng từ 0.1 đến 1.0
		amount := 0.1 + rand.Float64()

		placeOrder(token, side, float64(price), amount)

		// Nghỉ 500ms (2 lệnh/giây)
		time.Sleep(500 * time.Millisecond)
	}
}

func placeOrder(token, side string, price, amount float64) {
	url := baseURL + "/orders"

	// Gửi number thay vì string
	data := map[string]interface{}{
		"symbol": "BTC/USDT",
		"side":   side,
		"price":  price,
		"amount": amount,
	}
	jsonData, _ := json.Marshal(data)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("❌ Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		fmt.Printf("✅ Order Placed: %s %.4f @ %.2f\n", side, amount, price)
	} else {
		var errResp map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&errResp)
		fmt.Printf("⚠️  Failed: %d - %v\n", resp.StatusCode, errResp)
	}
}

func login() (string, error) {
	url := baseURL + "/auth/login"
	data := map[string]string{"username": username, "password": pass}
	jsonData, _ := json.Marshal(data)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		var errMsg map[string]interface{}
		json.NewDecoder(resp.Body).Decode(&errMsg)
		return "", fmt.Errorf("login failed code %d: %v", resp.StatusCode, errMsg)
	}

	var res LoginResponse
	json.NewDecoder(resp.Body).Decode(&res)
	return res.AccessToken, nil
}

func register() error {
	url := baseURL + "/auth/register"
	data := map[string]string{"username": username, "email": email, "password": pass}
	jsonData, _ := json.Marshal(data)
	
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("register request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 || resp.StatusCode == 201 {
		fmt.Println("✅ Bot user registered successfully!")
		time.Sleep(1 * time.Second) // Đợi database commit
		return nil
	}
	
	var errMsg map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&errMsg)
	return fmt.Errorf("register failed code %d: %v", resp.StatusCode, errMsg)
}
