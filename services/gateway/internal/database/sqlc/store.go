package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/trading-platform/gateway/internal/util"
)

// Store cung cấp tất cả các chức năng để thực hiện db queries và transactions
type Store interface {
	Querier
	DepositTx(ctx context.Context, arg DepositTxParams) (DepositTxResult, error)
	CreateAccountIfNotExists(ctx context.Context, userID int32, currency string) (Accounts, error)
}

// SQLStore cung cấp tất cả các chức năng để thực hiện db queries và transactions
type SQLStore struct {
	*Queries
	connPool *pgxpool.Pool
}

// NewStore tạo ra một Store mới
func NewStore(connPool *pgxpool.Pool) Store {
	return &SQLStore{
		Queries:  New(connPool),
		connPool: connPool,
	}
}

// execTx thực hiện một function bên trong một database transaction
func (store *SQLStore) execTx(ctx context.Context, fn func(*Queries) error) error {
	tx, err := store.connPool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}

	q := New(tx)
	err = fn(q)
	if err != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			return fmt.Errorf("tx err: %v, rb err: %v", err, rbErr)
		}
		return err
	}

	return tx.Commit(ctx)
}

// --- Logic Nghiệp vụ: Nạp tiền (Transaction) ---

// DepositTx thực hiện quy trình nạp tiền an toàn
// Đảm bảo tính nguyên tử: Hoặc là cả hai thao tác thành công, hoặc không có gì thay đổi
func (store *SQLStore) DepositTx(ctx context.Context, arg DepositTxParams) (DepositTxResult, error) {
	var result DepositTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		var err error

		// 1. Tìm hoặc tạo ví của user
		account, err := q.GetAccountByUserAndType(ctx, GetAccountByUserAndTypeParams{
			UserID:   util.HashStringToInt32(arg.UserID),
			Currency: arg.Currency,
		})

		// Nếu chưa có ví, tạo mới với số dư 0
		if err != nil {
			if err.Error() == "account not found" {
				account, err = q.CreateAccount(ctx, CreateAccountParams{
					UserID:   util.HashStringToInt32(arg.UserID),
					Currency: arg.Currency,
					Balance:  "0",
				})
				if err != nil {
					return fmt.Errorf("failed to create account: %w", err)
				}
			} else {
				return fmt.Errorf("failed to get account: %w", err)
			}
		}

		// 2. Cộng tiền vào ví (Update Balance)
		// SQL tự động xử lý phép cộng decimal an toàn
		result.Account, err = q.UpdateAccountBalance(ctx, UpdateAccountBalanceParams{
			ID:     account.ID,
			Amount: arg.Amount,
		})
		if err != nil {
			return fmt.Errorf("failed to update balance: %w", err)
		}

		// 3. Ghi lịch sử giao dịch (Create Deposit Record)
		result.Transaction, err = q.CreateDeposit(ctx, CreateDepositParams{
			AccountID: account.ID,
			Amount:    arg.Amount,
		})
		if err != nil {
			return fmt.Errorf("failed to create deposit record: %w", err)
		}

		return nil
	})

	return result, err
}

// CreateAccountIfNotExists tạo account nếu chưa tồn tại
func (store *SQLStore) CreateAccountIfNotExists(ctx context.Context, userID int32, currency string) (Accounts, error) {
	// Thử lấy account trước
	account, err := store.GetAccountByUserAndType(ctx, GetAccountByUserAndTypeParams{
		UserID:   userID,
		Currency: currency,
	})

	// Nếu đã tồn tại, trả về
	if err == nil {
		return account, nil
	}

	// Nếu chưa tồn tại, tạo mới
	if err.Error() == "account not found" {
		return store.CreateAccount(ctx, CreateAccountParams{
			UserID:   userID,
			Currency: currency,
			Balance:  "0",
		})
	}

	return Accounts{}, err
}
