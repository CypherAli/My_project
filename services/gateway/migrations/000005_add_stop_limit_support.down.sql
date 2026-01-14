-- Rollback Stop-Limit support
DROP INDEX IF EXISTS idx_engine_orders_trigger_price;
DROP INDEX IF EXISTS idx_engine_orders_type;

ALTER TABLE engine_orders DROP COLUMN IF EXISTS trigger_price;
ALTER TABLE engine_orders DROP COLUMN IF EXISTS type;
