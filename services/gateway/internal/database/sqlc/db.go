package db

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

// DBTX represents a database transaction or connection
type DBTX interface {
	Exec(context.Context, string, ...interface{}) (pgconn.CommandTag, error)
	Query(context.Context, string, ...interface{}) (pgx.Rows, error)
	QueryRow(context.Context, string, ...interface{}) pgx.Row
}

// Querier defines all database query methods
type Querier interface {
	// User methods
	GetUserByUsername(ctx context.Context, username string) (Users, error)
	GetUserByID(ctx context.Context, id int64) (Users, error)
	GetUserByEmail(ctx context.Context, email string) (Users, error)
	CreateUser(ctx context.Context, arg CreateUserParams) (Users, error)

	// Account methods
	GetAccountsByUserID(ctx context.Context, userID int32) ([]Accounts, error)
	GetAccountByUserAndType(ctx context.Context, arg GetAccountByUserAndTypeParams) (Accounts, error)
	CreateAccount(ctx context.Context, arg CreateAccountParams) (Accounts, error)
	UpdateAccountBalance(ctx context.Context, arg UpdateAccountBalanceParams) (Accounts, error)

	// Transaction methods
	CreateDeposit(ctx context.Context, arg CreateDepositParams) (Transactions, error)
	GetTransactionsByAccountID(ctx context.Context, accountID int64) ([]Transactions, error)

	// Order methods
	CreateOrder(ctx context.Context, arg CreateOrderParams) (Orders, error)
	UpdateOrderStatus(ctx context.Context, arg UpdateOrderStatusParams) (Orders, error)
	ListPendingOrders(ctx context.Context, userID int64) ([]Orders, error)

	// Balance methods
	GetLockedAmountByUserAndCurrency(ctx context.Context, arg GetLockedAmountParams) (string, error)

	// Trade methods
	CreateTrade(ctx context.Context, arg CreateTradeParams) (Trades, error)
	ListUserTrades(ctx context.Context, userID int64) ([]ListUserTradesRow, error)
}

// Queries provides methods to interact with the database
type Queries struct {
	db DBTX
}

// New creates a new Queries instance
func New(db DBTX) *Queries {
	return &Queries{db: db}
}

// --- User Queries Implementation ---

func (q *Queries) GetUserByUsername(ctx context.Context, username string) (Users, error) {
	query := `SELECT id, username, email, password_hash, created_at, updated_at 
              FROM users WHERE username = $1`

	row := q.db.QueryRow(ctx, query, username)
	var user Users
	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Users{}, fmt.Errorf("user not found")
		}
		return Users{}, err
	}
	return user, nil
}

func (q *Queries) GetUserByEmail(ctx context.Context, email string) (Users, error) {
	query := `SELECT id, username, email, password_hash, created_at, updated_at 
              FROM users WHERE email = $1`

	row := q.db.QueryRow(ctx, query, email)
	var user Users
	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Users{}, fmt.Errorf("user not found")
		}
		return Users{}, err
	}
	return user, nil
}

func (q *Queries) GetUserByID(ctx context.Context, id int64) (Users, error) {
	query := `SELECT id, username, email, password_hash, created_at, updated_at 
              FROM users WHERE id = $1`

	row := q.db.QueryRow(ctx, query, id)
	var user Users
	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Users{}, fmt.Errorf("user not found")
		}
		return Users{}, err
	}
	return user, nil
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (Users, error) {
	query := `INSERT INTO users (username, email, password_hash, created_at, updated_at) 
              VALUES ($1, $2, $3, $4, $5) 
              RETURNING id, username, email, password_hash, created_at, updated_at`

	now := time.Now()
	row := q.db.QueryRow(ctx, query, arg.Username, arg.Email, arg.PasswordHash, now, now)
	var user Users
	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	return user, err
}

// --- Account Queries Implementation ---

func (q *Queries) GetAccountsByUserID(ctx context.Context, userID int32) ([]Accounts, error) {
	query := `SELECT id, user_id, currency, balance, created_at, updated_at 
              FROM accounts WHERE user_id = $1`

	rows, err := q.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var accounts []Accounts
	for rows.Next() {
		var account Accounts
		if err := rows.Scan(
			&account.ID,
			&account.UserID,
			&account.Currency,
			&account.Balance,
			&account.CreatedAt,
			&account.UpdatedAt,
		); err != nil {
			return nil, err
		}
		accounts = append(accounts, account)
	}
	return accounts, rows.Err()
}

func (q *Queries) GetAccountByUserAndType(ctx context.Context, arg GetAccountByUserAndTypeParams) (Accounts, error) {
	query := `SELECT id, user_id, currency, balance, created_at, updated_at 
              FROM accounts WHERE user_id = $1 AND currency = $2`

	row := q.db.QueryRow(ctx, query, arg.UserID, arg.Currency)
	var account Accounts
	err := row.Scan(
		&account.ID,
		&account.UserID,
		&account.Currency,
		&account.Balance,
		&account.CreatedAt,
		&account.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return Accounts{}, fmt.Errorf("account not found")
		}
		return Accounts{}, err
	}
	return account, nil
}

func (q *Queries) CreateAccount(ctx context.Context, arg CreateAccountParams) (Accounts, error) {
	query := `INSERT INTO accounts (user_id, currency, balance, created_at, updated_at) 
              VALUES ($1, $2, $3, $4, $5) 
              RETURNING id, user_id, currency, balance, created_at, updated_at`

	now := time.Now()
	row := q.db.QueryRow(ctx, query, arg.UserID, arg.Currency, arg.Balance, now, now)
	var account Accounts
	err := row.Scan(
		&account.ID,
		&account.UserID,
		&account.Currency,
		&account.Balance,
		&account.CreatedAt,
		&account.UpdatedAt,
	)
	return account, err
}

func (q *Queries) UpdateAccountBalance(ctx context.Context, arg UpdateAccountBalanceParams) (Accounts, error) {
	// Sử dụng SQL để cộng dồn số dư (atomic operation)
	query := `UPDATE accounts 
              SET balance = (balance::numeric + $2::numeric)::text, 
                  updated_at = $3 
              WHERE id = $1 
              RETURNING id, user_id, currency, balance, created_at, updated_at`

	now := time.Now()
	row := q.db.QueryRow(ctx, query, arg.ID, arg.Amount, now)
	var account Accounts
	err := row.Scan(
		&account.ID,
		&account.UserID,
		&account.Currency,
		&account.Balance,
		&account.CreatedAt,
		&account.UpdatedAt,
	)
	return account, err
}

// --- Transaction Queries Implementation ---

func (q *Queries) CreateDeposit(ctx context.Context, arg CreateDepositParams) (Transactions, error) {
	query := `INSERT INTO transactions (account_id, type, amount, status, created_at, updated_at) 
              VALUES ($1, 'deposit', $2, 'completed', $3, $4) 
              RETURNING id, account_id, type, amount, status, created_at, updated_at`

	now := time.Now()
	row := q.db.QueryRow(ctx, query, arg.AccountID, arg.Amount, now, now)
	var transaction Transactions
	err := row.Scan(
		&transaction.ID,
		&transaction.AccountID,
		&transaction.Type,
		&transaction.Amount,
		&transaction.Status,
		&transaction.CreatedAt,
		&transaction.UpdatedAt,
	)
	return transaction, err
}

func (q *Queries) GetTransactionsByAccountID(ctx context.Context, accountID int64) ([]Transactions, error) {
	query := `SELECT id, account_id, type, amount, status, created_at, updated_at 
              FROM transactions WHERE account_id = $1 ORDER BY created_at DESC`

	rows, err := q.db.Query(ctx, query, accountID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []Transactions
	for rows.Next() {
		var transaction Transactions
		if err := rows.Scan(
			&transaction.ID,
			&transaction.AccountID,
			&transaction.Type,
			&transaction.Amount,
			&transaction.Status,
			&transaction.CreatedAt,
			&transaction.UpdatedAt,
		); err != nil {
			return nil, err
		}
		transactions = append(transactions, transaction)
	}
	return transactions, rows.Err()
}

// WithTx creates a new Queries instance using a transaction
func (q *Queries) WithTx(tx pgx.Tx) *Queries {
	return &Queries{
		db: tx,
	}
}

// --- Order Queries Implementation ---

func (q *Queries) CreateOrder(ctx context.Context, arg CreateOrderParams) (Orders, error) {
	query := `INSERT INTO engine_orders (id, user_id, symbol, price, amount, side, status, created_at) 
              VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7) 
              RETURNING id, user_id, symbol, price, amount, side, status, created_at`

	now := time.Now()
	row := q.db.QueryRow(ctx, query, arg.ID, arg.UserID, arg.Symbol, arg.Price, arg.Amount, arg.Side, now)
	var order Orders
	err := row.Scan(
		&order.ID,
		&order.UserID,
		&order.Symbol,
		&order.Price,
		&order.Amount,
		&order.Side,
		&order.Status,
		&order.CreatedAt,
	)
	return order, err
}

func (q *Queries) UpdateOrderStatus(ctx context.Context, arg UpdateOrderStatusParams) (Orders, error) {
	query := `UPDATE engine_orders 
              SET status = $2 
              WHERE id = $1 
              RETURNING id, user_id, symbol, price, amount, side, status, created_at`

	row := q.db.QueryRow(ctx, query, arg.ID, arg.Status)
	var order Orders
	err := row.Scan(
		&order.ID,
		&order.UserID,
		&order.Symbol,
		&order.Price,
		&order.Amount,
		&order.Side,
		&order.Status,
		&order.CreatedAt,
	)
	return order, err
}

func (q *Queries) ListPendingOrders(ctx context.Context, userID int64) ([]Orders, error) {
	query := `SELECT id, user_id, symbol, price, amount, side, status, created_at 
              FROM engine_orders 
              WHERE user_id = $1 AND status = 'pending' 
              ORDER BY created_at DESC`

	rows, err := q.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []Orders
	for rows.Next() {
		var order Orders
		if err := rows.Scan(
			&order.ID,
			&order.UserID,
			&order.Symbol,
			&order.Price,
			&order.Amount,
			&order.Side,
			&order.Status,
			&order.CreatedAt,
		); err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}
	return orders, rows.Err()
}

// --- Balance Queries Implementation ---

// GetLockedAmountByUserAndCurrency calculates the total locked amount from pending orders
func (q *Queries) GetLockedAmountByUserAndCurrency(ctx context.Context, arg GetLockedAmountParams) (string, error) {
	// For BTC (base currency in BTC/USDT), we need to sum pending sell orders
	// For USDT (quote currency), we need to sum (price * amount) for pending buy orders
	var query string

	if arg.Currency == "BTC" {
		// Locked BTC = sum of amounts in pending Sell (Ask) orders
		query = `SELECT COALESCE(SUM(CAST(amount AS DECIMAL)), 0)::TEXT 
				 FROM engine_orders 
				 WHERE user_id = $1 AND symbol = $2 AND side = 'Ask' AND status = 'pending'`
	} else {
		// Locked USDT = sum of (price * amount) in pending Buy (Bid) orders
		query = `SELECT COALESCE(SUM(CAST(price AS DECIMAL) * CAST(amount AS DECIMAL)), 0)::TEXT 
				 FROM engine_orders 
				 WHERE user_id = $1 AND symbol = $2 AND side = 'Bid' AND status = 'pending'`
	}

	row := q.db.QueryRow(ctx, query, arg.UserID, arg.Symbol)
	var lockedAmount string
	err := row.Scan(&lockedAmount)
	if err != nil {
		return "0", err
	}
	return lockedAmount, nil
}

// --- Trade Queries Implementation ---

func (q *Queries) CreateTrade(ctx context.Context, arg CreateTradeParams) (Trades, error) {
	query := `INSERT INTO engine_trades (maker_order_id, taker_order_id, price, amount, created_at) 
              VALUES ($1, $2, $3, $4, $5) 
              RETURNING id, maker_order_id, taker_order_id, price, amount, created_at`

	now := time.Now()
	row := q.db.QueryRow(ctx, query, arg.MakerOrderID, arg.TakerOrderID, arg.Price, arg.Amount, now)
	var trade Trades
	err := row.Scan(
		&trade.ID,
		&trade.MakerOrderID,
		&trade.TakerOrderID,
		&trade.Price,
		&trade.Amount,
		&trade.CreatedAt,
	)
	return trade, err
}

// ListUserTradesRow represents a trade from the user's perspective
type ListUserTradesRow struct {
	ID        int64     `json:"id"`
	Symbol    string    `json:"symbol"`
	Side      string    `json:"side"`
	Price     string    `json:"price"`
	Amount    string    `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
}

// ListUserTrades returns all trades where the user was either maker or taker
func (q *Queries) ListUserTrades(ctx context.Context, userID int64) ([]ListUserTradesRow, error) {
	// Query thông minh: Lấy trades mà user là Maker hoặc Taker
	// Và xác định Side của user trong trade đó (Bid hay Ask)
	query := `
		SELECT 
			t.id,
			m.symbol,
			CASE 
				WHEN m.user_id = $1 THEN m.side 
				ELSE k.side 
			END AS side,
			t.price,
			t.amount,
			t.created_at
		FROM engine_trades t
		JOIN engine_orders m ON t.maker_order_id = m.id
		JOIN engine_orders k ON t.taker_order_id = k.id
		WHERE m.user_id = $1 OR k.user_id = $1
		ORDER BY t.created_at DESC
		LIMIT 50
	`

	rows, err := q.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trades []ListUserTradesRow
	for rows.Next() {
		var trade ListUserTradesRow
		if err := rows.Scan(
			&trade.ID,
			&trade.Symbol,
			&trade.Side,
			&trade.Price,
			&trade.Amount,
			&trade.CreatedAt,
		); err != nil {
			return nil, err
		}
		trades = append(trades, trade)
	}
	return trades, rows.Err()
}
