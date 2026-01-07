-- ===========================================
-- CRITICAL FIX #1: Add currencies table
-- ===========================================
CREATE TABLE IF NOT EXISTS currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,  -- USD, BTC, ETH, USDT...
    name VARCHAR(100) NOT NULL,        -- Bitcoin, Ethereum...
    type VARCHAR(20) NOT NULL CHECK (type IN ('fiat', 'crypto')),
    decimals INT NOT NULL DEFAULT 8,   -- Số chữ số thập phân
    min_withdrawal DECIMAL(20, 8) NOT NULL DEFAULT 0,
    max_withdrawal DECIMAL(20, 8),
    withdrawal_fee DECIMAL(20, 8) DEFAULT 0,
    is_deposit_enabled BOOLEAN DEFAULT TRUE,
    is_withdrawal_enabled BOOLEAN DEFAULT TRUE,
    is_trading_enabled BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key to accounts table
ALTER TABLE accounts 
    ADD COLUMN currency_id UUID REFERENCES currencies(id);

-- Add foreign key to trading_pairs
ALTER TABLE trading_pairs
    ADD COLUMN base_currency_id UUID REFERENCES currencies(id),
    ADD COLUMN quote_currency_id UUID REFERENCES currencies(id);

-- ===========================================
-- CRITICAL FIX #2: Matching Engine Performance
-- ===========================================

-- Add composite indexes for faster order matching
CREATE INDEX idx_orders_symbol_side_price_status ON orders(symbol, side, price, status) 
    WHERE status IN ('open', 'partially_filled');

CREATE INDEX idx_orders_symbol_status_price ON orders(symbol, status, price)
    WHERE status IN ('open', 'partially_filled');

-- Index cho market orders (ưu tiên thời gian)
CREATE INDEX idx_orders_market_time ON orders(symbol, side, created_at)
    WHERE order_type = 'market' AND status = 'open';

-- Index cho limit orders (ưu tiên giá)
CREATE INDEX idx_orders_limit_price ON orders(symbol, side, price, created_at)
    WHERE order_type = 'limit' AND status IN ('open', 'partially_filled');

-- ===========================================
-- CRITICAL FIX #3: Order Book Persistence
-- ===========================================

-- Bảng lưu trữ snapshot của order book (cho recovery sau restart)
CREATE TABLE IF NOT EXISTS orderbook_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trading_pair_id UUID NOT NULL REFERENCES trading_pairs(id),
    symbol VARCHAR(20) NOT NULL,
    snapshot_data JSONB NOT NULL,  -- Toàn bộ orderbook serialize
    order_count INT NOT NULL,
    bid_count INT NOT NULL,
    ask_count INT NOT NULL,
    best_bid DECIMAL(20, 8),
    best_ask DECIMAL(20, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orderbook_snapshots_symbol ON orderbook_snapshots(symbol, created_at DESC);

-- ===========================================
-- CRITICAL FIX #4: Data Integrity Constraints
-- ===========================================

-- Constraint đảm bảo số dư không âm
ALTER TABLE accounts
    ADD CONSTRAINT check_balance_non_negative CHECK (balance >= 0),
    ADD CONSTRAINT check_available_balance_non_negative CHECK (available_balance >= 0),
    ADD CONSTRAINT check_locked_balance_non_negative CHECK (locked_balance >= 0),
    ADD CONSTRAINT check_balance_equation CHECK (balance = available_balance + locked_balance);

-- Constraint đảm bảo quantity hợp lệ trong orders
ALTER TABLE orders
    ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0),
    ADD CONSTRAINT check_filled_quantity_valid CHECK (filled_quantity >= 0 AND filled_quantity <= quantity),
    ADD CONSTRAINT check_remaining_quantity_valid CHECK (remaining_quantity >= 0 AND remaining_quantity <= quantity),
    ADD CONSTRAINT check_remaining_equation CHECK (quantity = filled_quantity + remaining_quantity);

-- Constraint đảm bảo giá hợp lệ
ALTER TABLE orders
    ADD CONSTRAINT check_price_positive CHECK (price IS NULL OR price > 0),
    ADD CONSTRAINT check_stop_price_positive CHECK (stop_price IS NULL OR stop_price > 0);

-- Constraint cho trades
ALTER TABLE trades
    ADD CONSTRAINT check_trade_quantity_positive CHECK (quantity > 0),
    ADD CONSTRAINT check_trade_price_positive CHECK (price > 0),
    ADD CONSTRAINT check_trade_total_valid CHECK (total = price * quantity),
    ADD CONSTRAINT check_trade_fee_non_negative CHECK (fee >= 0);

-- ===========================================
-- CRITICAL FIX #5: Maker/Taker Fee Structure
-- ===========================================

CREATE TABLE IF NOT EXISTS fee_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_name VARCHAR(50) NOT NULL UNIQUE,
    min_30d_volume DECIMAL(20, 8) NOT NULL DEFAULT 0,
    max_30d_volume DECIMAL(20, 8),
    maker_fee_rate DECIMAL(6, 4) NOT NULL,  -- 0.0010 = 0.1%
    taker_fee_rate DECIMAL(6, 4) NOT NULL,  -- 0.0020 = 0.2%
    priority INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User fee tier membership
CREATE TABLE IF NOT EXISTS user_fee_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fee_tier_id UUID NOT NULL REFERENCES fee_tiers(id),
    volume_30d DECIMAL(20, 8) DEFAULT 0,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Update trades table để lưu maker/taker info
ALTER TABLE trades
    ADD COLUMN maker_order_id UUID REFERENCES orders(id),
    ADD COLUMN taker_order_id UUID REFERENCES orders(id),
    ADD COLUMN maker_fee DECIMAL(20, 8) DEFAULT 0,
    ADD COLUMN taker_fee DECIMAL(20, 8) DEFAULT 0,
    ADD COLUMN maker_fee_rate DECIMAL(6, 4),
    ADD COLUMN taker_fee_rate DECIMAL(6, 4);

-- ===========================================
-- CRITICAL FIX #6: Performance Monitoring
-- ===========================================

CREATE TABLE IF NOT EXISTS order_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    metric_date DATE NOT NULL,
    total_orders BIGINT DEFAULT 0,
    total_trades BIGINT DEFAULT 0,
    total_volume DECIMAL(30, 8) DEFAULT 0,
    avg_fill_time_ms INT,  -- Thời gian trung bình để fill order
    max_fill_time_ms INT,
    orders_per_second DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(symbol, metric_date)
);

CREATE INDEX idx_order_metrics_symbol_date ON order_metrics(symbol, metric_date DESC);

-- ===========================================
-- CRITICAL FIX #7: Add missing indexes
-- ===========================================

-- Tối ưu cho account lookups
CREATE INDEX idx_accounts_currency ON accounts(currency);
CREATE INDEX idx_accounts_user_currency ON accounts(user_id, currency);

-- Tối ưu cho trading pair lookups
CREATE INDEX idx_trading_pairs_base_quote ON trading_pairs(base_currency, quote_currency);
CREATE INDEX idx_trading_pairs_active ON trading_pairs(is_active) WHERE is_active = TRUE;

-- Tối ưu cho user balance queries
CREATE INDEX idx_transactions_reference ON transactions(reference_type, reference_id);

-- ===========================================
-- Insert default data
-- ===========================================

-- Insert common currencies
INSERT INTO currencies (code, name, type, decimals, min_withdrawal, withdrawal_fee) VALUES
    ('USD', 'US Dollar', 'fiat', 2, 10.00, 0.00),
    ('EUR', 'Euro', 'fiat', 2, 10.00, 0.00),
    ('BTC', 'Bitcoin', 'crypto', 8, 0.001, 0.0005),
    ('ETH', 'Ethereum', 'crypto', 8, 0.01, 0.005),
    ('USDT', 'Tether', 'crypto', 6, 10.00, 1.00),
    ('USDC', 'USD Coin', 'crypto', 6, 10.00, 1.00),
    ('BNB', 'Binance Coin', 'crypto', 8, 0.1, 0.01),
    ('SOL', 'Solana', 'crypto', 8, 0.1, 0.01)
ON CONFLICT (code) DO NOTHING;

-- Insert default fee tiers
INSERT INTO fee_tiers (tier_name, min_30d_volume, max_30d_volume, maker_fee_rate, taker_fee_rate, priority) VALUES
    ('VIP 3', 1000000.00, NULL, 0.0000, 0.0005, 4),
    ('VIP 2', 100000.00, 1000000.00, 0.0002, 0.0008, 3),
    ('VIP 1', 10000.00, 100000.00, 0.0005, 0.0010, 2),
    ('Standard', 0.00, 10000.00, 0.0010, 0.0020, 1)
ON CONFLICT (tier_name) DO NOTHING;

-- Add trigger for currencies
CREATE TRIGGER update_currencies_updated_at BEFORE UPDATE ON currencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
