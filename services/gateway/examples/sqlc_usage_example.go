package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/trading-platform/gateway/internal/database/sqlc"
	_ "github.com/lib/pq"
)

func main() {
	// Kết nối database
	connStr := "postgres://trading_user:trading_password@localhost:5432/trading_db?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Khởi tạo queries
	queries := sqlc.New(db)
	ctx := context.Background()

	// Example 1: Create User
	user, err := queries.CreateUser(ctx, sqlc.CreateUserParams{
		Username:     "john_doe",
		Email:        "john@example.com",
		PasswordHash: "hashed_password_here",
		FirstName:    sql.NullString{String: "John", Valid: true},
		LastName:     sql.NullString{String: "Doe", Valid: true},
	})
	if err != nil {
		log.Printf("Error creating user: %v", err)
		return
	}
	fmt.Printf("Created user: %+v\n", user)

	// Example 2: Get User by Email
	foundUser, err := queries.GetUserByEmail(ctx, "john@example.com")
	if err != nil {
		log.Printf("Error getting user: %v", err)
		return
	}
	fmt.Printf("Found user: %+v\n", foundUser)

	// Example 3: Create Account
	account, err := queries.CreateAccount(ctx, sqlc.CreateAccountParams{
		UserID:           user.ID,
		AccountType:      "spot",
		Balance:          sql.NullString{String: "1000.00", Valid: true},
		AvailableBalance: sql.NullString{String: "1000.00", Valid: true},
		LockedBalance:    sql.NullString{String: "0.00", Valid: true},
		Currency:         "USD",
	})
	if err != nil {
		log.Printf("Error creating account: %v", err)
		return
	}
	fmt.Printf("Created account: %+v\n", account)

	// Example 4: Get Accounts by User ID
	accounts, err := queries.GetAccountsByUserID(ctx, user.ID)
	if err != nil {
		log.Printf("Error getting accounts: %v", err)
		return
	}
	fmt.Printf("User has %d accounts\n", len(accounts))
	for _, acc := range accounts {
		fmt.Printf("  - Account: %s (%s) - Balance: %s\n", 
			acc.AccountType, acc.Currency, acc.Balance.String)
	}

	// Example 5: Create Deposit Transaction
	deposit, err := queries.CreateDeposit(ctx, sqlc.CreateDepositParams{
		AccountID:     account.ID,
		Amount:        sql.NullString{String: "500.00", Valid: true},
		Currency:      "USD",
		BalanceBefore: sql.NullString{String: "1000.00", Valid: true},
		BalanceAfter:  sql.NullString{String: "1500.00", Valid: true},
		Status:        "completed",
		ReferenceID:   sql.NullString{String: "DEP-12345", Valid: true},
	})
	if err != nil {
		log.Printf("Error creating deposit: %v", err)
		return
	}
	fmt.Printf("Created deposit: %+v\n", deposit)

	// Example 6: Update Account Balance
	updatedAccount, err := queries.UpdateAccountBalance(ctx, sqlc.UpdateAccountBalanceParams{
		ID:               account.ID,
		Balance:          sql.NullString{String: "1500.00", Valid: true},
		AvailableBalance: sql.NullString{String: "1500.00", Valid: true},
		LockedBalance:    sql.NullString{String: "0.00", Valid: true},
	})
	if err != nil {
		log.Printf("Error updating balance: %v", err)
		return
	}
	fmt.Printf("Updated account balance: %s\n", updatedAccount.Balance.String)
}
