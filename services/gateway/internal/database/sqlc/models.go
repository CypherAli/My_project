package db

import (
	"time"
)

// Users represents a user in the system
type Users struct {
	ID        int64     `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Accounts represents a user's account (wallet)
type Accounts struct {
	ID        int64     `json:"id"`
	UserID    int32     `json:"user_id"`
	Currency  string    `json:"currency"`
	Balance   string    `json:"balance"` // Sử dụng string để tránh lỗi làm tròn
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Transactions represents a transaction record
type Transactions struct {
	ID        int64     `json:"id"`
	AccountID int64     `json:"account_id"`
	Type      string    `json:"type"` // "deposit", "withdraw", "transfer"
	Amount    string    `json:"amount"`
	Status    string    `json:"status"` // "pending", "completed", "failed"
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// --- Parameter Types for Queries ---

// CreateUserParams contains the parameters for creating a user
type CreateUserParams struct {
	Username string
	Email    string
	Password string
}

// GetAccountByUserAndTypeParams contains the parameters for getting an account by user and currency
type GetAccountByUserAndTypeParams struct {
	UserID   int32
	Currency string
}

// CreateAccountParams contains the parameters for creating an account
type CreateAccountParams struct {
	UserID   int32
	Currency string
	Balance  string
}

// UpdateAccountBalanceParams contains the parameters for updating an account balance
type UpdateAccountBalanceParams struct {
	ID     int64
	Amount string
}

// CreateDepositParams contains the parameters for creating a deposit transaction
type CreateDepositParams struct {
	AccountID int64
	Amount    string
}

// DepositTxParams contains input parameters for deposit transaction
type DepositTxParams struct {
	UserID   int64  `json:"user_id"`
	Amount   string `json:"amount"`
	Currency string `json:"currency"`
}

// DepositTxResult contains the result of deposit transaction
type DepositTxResult struct {
	Account     Accounts     `json:"account"`
	Transaction Transactions `json:"transaction"`
}
