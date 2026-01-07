package util

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// HashPassword mã hóa mật khẩu người dùng
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashedPassword), nil
}

// CheckPassword kiểm tra mật khẩu nhập vào có khớp với hash không
func CheckPassword(password string, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
