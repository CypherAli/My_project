package util

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// CreateToken tạo JWT token cho user
func CreateToken(username string, secretKey string, duration time.Duration) (string, error) {
	// Tạo Claims (payload) chứa thông tin user
	claims := jwt.MapClaims{
		"username": username,
		"iat":      time.Now().Unix(),
		"exp":      time.Now().Add(duration).Unix(),
	}

	// Tạo token với thuật toán HS256
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Ký token bằng secret key
	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Payload chứa dữ liệu đầu ra của token
type Payload struct {
	Username  string    `json:"username"`
	IssuedAt  time.Time `json:"issued_at"`
	ExpiredAt time.Time `json:"expired_at"`
}

// VerifyToken kiểm tra tính hợp lệ của token
func VerifyToken(tokenString string, secretKey string) (*Payload, error) {
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		// Quan trọng: Phải kiểm tra thuật toán ký có đúng là HS256 không (tránh lỗ hổng 'none')
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secretKey), nil
	}

	token, err := jwt.Parse(tokenString, keyFunc)
	if err != nil {
		return nil, err
	}

	// Lấy dữ liệu (Claims) từ token
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	payload := &Payload{
		Username: claims["username"].(string),
		// Lưu ý: JWT lưu time dưới dạng float64 khi parse ra map
		IssuedAt:  time.Unix(int64(claims["iat"].(float64)), 0),
		ExpiredAt: time.Unix(int64(claims["exp"].(float64)), 0),
	}

	return payload, nil
}
