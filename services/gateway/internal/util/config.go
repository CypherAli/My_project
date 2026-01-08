package util

import (
	"time"

	"github.com/spf13/viper"
)

// Config chứa tất cả cấu hình của ứng dụng
// Viper sẽ tự động map từ file .env vào struct này
type Config struct {
	DBSource            string        `mapstructure:"DB_SOURCE"`
	ServerAddress       string        `mapstructure:"SERVER_ADDRESS"`
	JWTSecret           string        `mapstructure:"JWT_SECRET"`
	AccessTokenDuration time.Duration `mapstructure:"ACCESS_TOKEN_DURATION"`
}

// LoadConfig đọc cấu hình từ file hoặc biến môi trường
func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)   // Đường dẫn chứa file config
	viper.SetConfigName(".env") // Tên file (không cần đuôi nếu là .env)
	viper.SetConfigType("env")  // Định dạng file

	viper.AutomaticEnv() // Tự động ghi đè nếu có biến môi trường tương ứng

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
