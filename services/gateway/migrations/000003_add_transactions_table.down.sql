-- Rollback migration for transactions table
-- Drop the trigger for transactions table
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;

-- Drop all other triggers that depend on update_updated_at_column() function
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
DROP TRIGGER IF EXISTS update_trading_pairs_updated_at ON trading_pairs;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_currencies_updated_at ON currencies;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop the transactions table
DROP TABLE IF EXISTS transactions;
