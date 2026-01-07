-- Drop triggers
DROP TRIGGER IF EXISTS update_currencies_updated_at ON currencies;

-- Drop indexes
DROP INDEX IF EXISTS idx_transactions_reference;
DROP INDEX IF EXISTS idx_trading_pairs_active;
DROP INDEX IF EXISTS idx_trading_pairs_base_quote;
DROP INDEX IF EXISTS idx_accounts_user_currency;
DROP INDEX IF EXISTS idx_accounts_currency;
DROP INDEX IF EXISTS idx_order_metrics_symbol_date;
DROP INDEX IF EXISTS idx_orderbook_snapshots_symbol;
DROP INDEX IF EXISTS idx_orders_limit_price;
DROP INDEX IF EXISTS idx_orders_market_time;
DROP INDEX IF EXISTS idx_orders_symbol_status_price;
DROP INDEX IF EXISTS idx_orders_symbol_side_price_status;

-- Drop constraints
ALTER TABLE trades DROP CONSTRAINT IF EXISTS check_trade_fee_non_negative;
ALTER TABLE trades DROP CONSTRAINT IF EXISTS check_trade_total_valid;
ALTER TABLE trades DROP CONSTRAINT IF EXISTS check_trade_price_positive;
ALTER TABLE trades DROP CONSTRAINT IF EXISTS check_trade_quantity_positive;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_stop_price_positive;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_price_positive;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_remaining_equation;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_remaining_quantity_valid;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_filled_quantity_valid;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS check_quantity_positive;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS check_balance_equation;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS check_locked_balance_non_negative;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS check_available_balance_non_negative;
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS check_balance_non_negative;

-- Remove columns from trades
ALTER TABLE trades 
    DROP COLUMN IF EXISTS taker_fee_rate,
    DROP COLUMN IF EXISTS maker_fee_rate,
    DROP COLUMN IF EXISTS taker_fee,
    DROP COLUMN IF EXISTS maker_fee,
    DROP COLUMN IF EXISTS taker_order_id,
    DROP COLUMN IF EXISTS maker_order_id;

-- Remove columns from trading_pairs
ALTER TABLE trading_pairs
    DROP COLUMN IF EXISTS quote_currency_id,
    DROP COLUMN IF EXISTS base_currency_id;

-- Remove column from accounts
ALTER TABLE accounts
    DROP COLUMN IF EXISTS currency_id;

-- Drop tables
DROP TABLE IF EXISTS order_metrics;
DROP TABLE IF EXISTS user_fee_tiers;
DROP TABLE IF EXISTS fee_tiers;
DROP TABLE IF EXISTS orderbook_snapshots;
DROP TABLE IF EXISTS currencies;
