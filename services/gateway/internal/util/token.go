package util

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// CreateToken tạo ra một token JWT cho user
func CreateToken(username string, duration time.Duration, secretKey string) (string, error) {
	// 1. Tạo payload (nội dung trong thẻ bài)
	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(duration).Unix(), // Thời điểm hết hạn
		"iat":      time.Now().Unix(),               // Thời điểm phát hành
	}

	// 2. Tạo token với thuật toán ký HS256
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 3. Ký tên (Sign) token bằng secret key được truyền vào
	return token.SignedString([]byte(secretKey))
}
