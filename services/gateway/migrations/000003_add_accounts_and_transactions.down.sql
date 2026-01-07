-- Drop foreign key constraints that reference accounts
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_account_id_fkey;

-- Drop indexes
DROP INDEX IF EXISTS idx_transactions_reference_id;
DROP INDEX IF EXISTS idx_transactions_created_at;
DROP INDEX IF EXISTS idx_transactions_account_id;
DROP INDEX IF EXISTS idx_accounts_currency;
DROP INDEX IF EXISTS idx_accounts_user_id;

-- Drop tables
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
