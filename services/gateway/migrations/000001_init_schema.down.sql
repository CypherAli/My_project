-- Drop triggers
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_trading_pairs_updated_at ON trading_pairs;
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_audit_logs_created_at;
DROP INDEX IF EXISTS idx_audit_logs_user_id;
DROP INDEX IF EXISTS idx_api_keys_user_id;
DROP INDEX IF EXISTS idx_sessions_token_hash;
DROP INDEX IF EXISTS idx_sessions_user_id;
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_transactions_account_id;
DROP INDEX IF EXISTS idx_trades_created_at;
DROP INDEX IF EXISTS idx_trades_seller_id;
DROP INDEX IF EXISTS idx_trades_buyer_id;
DROP INDEX IF EXISTS idx_trades_symbol;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_orders_status;
DROP INDEX IF EXISTS idx_orders_symbol;
DROP INDEX IF EXISTS idx_orders_user_id;
DROP INDEX IF EXISTS idx_accounts_user_id;
DROP INDEX IF EXISTS idx_users_username;
DROP INDEX IF EXISTS idx_users_email;

-- Drop tables in reverse order (respecting foreign key constraints)
-- Drop dependent tables first
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS trades;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS trading_pairs;

-- Drop foreign key constraints before dropping referenced tables
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_account_id_fkey;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS transactions DROP CONSTRAINT IF EXISTS transactions_account_id_fkey;
ALTER TABLE IF EXISTS trades DROP CONSTRAINT IF EXISTS trades_buyer_id_fkey;
ALTER TABLE IF EXISTS trades DROP CONSTRAINT IF EXISTS trades_seller_id_fkey;
ALTER TABLE IF EXISTS accounts DROP CONSTRAINT IF EXISTS accounts_user_id_fkey;

-- Now safe to drop main tables
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;
