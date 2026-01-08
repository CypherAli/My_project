-- Drop triggers
DROP TRIGGER IF EXISTS update_currencies_updated_at ON currencies;

-- Drop indexes (skip accounts indexes as they may be dropped by migration 3)
DROP INDEX IF EXISTS idx_transactions_reference;
DROP INDEX IF EXISTS idx_trading_pairs_active;
DROP INDEX IF EXISTS idx_trading_pairs_base_quote;
DROP INDEX IF EXISTS idx_order_metrics_symbol_date;
DROP INDEX IF EXISTS idx_orderbook_snapshots_symbol;
DROP INDEX IF EXISTS idx_orders_limit_price;
DROP INDEX IF EXISTS idx_orders_market_time;
DROP INDEX IF EXISTS idx_orders_symbol_status_price;
DROP INDEX IF EXISTS idx_orders_symbol_side_price_status;

-- Drop constraints from existing tables only
ALTER TABLE IF EXISTS trades DROP CONSTRAINT IF EXISTS check_trade_fee_non_negative;
ALTER TABLE IF EXISTS trades DROP CONSTRAINT IF EXISTS check_trade_total_valid;
ALTER TABLE IF EXISTS trades DROP CONSTRAINT IF EXISTS check_trade_price_positive;
ALTER TABLE IF EXISTS trades DROP CONSTRAINT IF EXISTS check_trade_quantity_positive;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS check_stop_price_positive;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS check_price_positive;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS check_remaining_equation;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS check_remaining_quantity_valid;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS check_filled_quantity_valid;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS check_quantity_positive;

-- Drop accounts constraints only if table still exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accounts') THEN
        ALTER TABLE accounts DROP CONSTRAINT IF EXISTS check_balance_equation;
        ALTER TABLE accounts DROP CONSTRAINT IF EXISTS check_locked_balance_non_negative;
        ALTER TABLE accounts DROP CONSTRAINT IF EXISTS check_available_balance_non_negative;
        ALTER TABLE accounts DROP CONSTRAINT IF EXISTS check_balance_non_negative;
    END IF;
END $$;

-- Remove columns from trades
ALTER TABLE IF EXISTS trades 
    DROP COLUMN IF EXISTS taker_fee_rate,
    DROP COLUMN IF EXISTS maker_fee_rate,
    DROP COLUMN IF EXISTS taker_fee,
    DROP COLUMN IF EXISTS maker_fee,
    DROP COLUMN IF EXISTS taker_order_id,
    DROP COLUMN IF EXISTS maker_order_id;

-- Remove columns from trading_pairs
ALTER TABLE IF EXISTS trading_pairs
    DROP COLUMN IF EXISTS quote_currency_id,
    DROP COLUMN IF EXISTS base_currency_id;

-- Remove column from accounts only if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'accounts') THEN
        ALTER TABLE accounts DROP COLUMN IF EXISTS currency_id;
    END IF;
END $$;

-- Drop foreign key constraints (may already be dropped by migration 3)
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_account_id_fkey;
ALTER TABLE IF EXISTS transactions DROP CONSTRAINT IF EXISTS transactions_account_id_fkey;
ALTER TABLE IF EXISTS trades DROP CONSTRAINT IF EXISTS trades_buyer_account_id_fkey;
ALTER TABLE IF EXISTS trades DROP CONSTRAINT IF EXISTS trades_seller_account_id_fkey;

-- Drop tables
DROP TABLE IF EXISTS order_metrics;
DROP TABLE IF EXISTS user_fee_tiers;
DROP TABLE IF EXISTS fee_tiers;
DROP TABLE IF EXISTS orderbook_snapshots;
DROP TABLE IF EXISTS currencies;
