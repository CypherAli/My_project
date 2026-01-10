package models

// Command gửi sang Rust
type Command struct {
	Type string      `json:"type"` // "Place" hoặc "Cancel"
	Data interface{} `json:"data"`
}

// Dữ liệu lệnh đặt (khớp với Order struct bên Rust)
type OrderData struct {
	ID        uint64 `json:"id"`
	UserID    uint64 `json:"user_id"`
	Symbol    string `json:"symbol"`
	Price     string `json:"price"` // Dùng string để đảm bảo chính xác Decimal bên Rust
	Amount    string `json:"amount"`
	Side      string `json:"side"`      // "Bid" hoặc "Ask"
	Type      string `json:"order_type"` // "Limit" hoặc "Market" - Thêm mới
	Timestamp int64  `json:"timestamp"`
}

// Dữ liệu lệnh hủy
type CancelData struct {
	OrderID uint64 `json:"order_id"`
}
