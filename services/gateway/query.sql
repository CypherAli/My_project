-- name: CreateUser :one
INSERT INTO users (
    username, 
    email, 
    password_hash, 
    first_name, 
    last_name
)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 
LIMIT 1;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1 
LIMIT 1;

-- name: GetUserByUsername :one
SELECT * FROM users
WHERE username = $1 
LIMIT 1;

-- name: UpdateUserVerification :one
UPDATE users
SET is_verified = $2, updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: CreateAccount :one
INSERT INTO accounts (
    user_id,
    account_type,
    balance,
    available_balance,
    locked_balance,
    currency
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetAccountByUserAndType :one
SELECT * FROM accounts
WHERE user_id = $1 
  AND account_type = $2
  AND currency = $3
LIMIT 1;

-- name: GetAccountsByUserID :many
SELECT * FROM accounts
WHERE user_id = $1
  AND is_active = true
ORDER BY created_at DESC;

-- name: UpdateAccountBalance :one
UPDATE accounts
SET balance = $2,
    available_balance = $3,
    locked_balance = $4,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: CreateDeposit :one
INSERT INTO transactions (
    account_id,
    transaction_type,
    amount,
    currency,
    balance_before,
    balance_after,
    status,
    reference_id
)
VALUES ($1, 'deposit', $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetTransactionByID :one
SELECT * FROM transactions
WHERE id = $1
LIMIT 1;

-- name: GetTransactionsByAccountID :many
SELECT * FROM transactions
WHERE account_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: UpdateTransactionStatus :one
UPDATE transactions
SET status = $2,
    updated_at = NOW()
WHERE id = $1
RETURNING *;
