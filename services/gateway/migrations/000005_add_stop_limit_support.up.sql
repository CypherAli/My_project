-- Add support for Stop-Limit orders
-- Add type column to distinguish between Limit, Market, and StopLimit orders
ALTER TABLE engine_orders ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'Limit' CHECK (type IN ('Limit', 'Market', 'StopLimit'));

-- Add trigger_price column for Stop-Limit orders
-- This is the price that triggers the order to become active
ALTER TABLE engine_orders ADD COLUMN IF NOT EXISTS trigger_price DECIMAL(20, 8);

-- Add index for trigger_price to optimize Stop-Limit order processing
CREATE INDEX IF NOT EXISTS idx_engine_orders_type ON engine_orders(type);
CREATE INDEX IF NOT EXISTS idx_engine_orders_trigger_price ON engine_orders(trigger_price) WHERE trigger_price IS NOT NULL;
