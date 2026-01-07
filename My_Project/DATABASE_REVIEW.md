# Database Schema - Technical Review & Optimizations

## ✅ Kiểm tra kỹ thuật đã thực hiện

### 1. ✅ Kiểu dữ liệu tiền tệ (PASSED)
- **Sử dụng**: `DECIMAL(20, 8)` cho tất cả số tiền và giá
- **Lý do**: Tránh hoàn toàn sai số làm tròn của FLOAT/DOUBLE
- **Precision**: 20 chữ số tổng, 8 chữ số thập phân
- **Đủ cho**: Bitcoin (8 decimals), Ethereum (18 decimals downscaled to 8)

### 2. ✅ Bảng Currencies (ADDED)
**Vấn đề**: Schema cũ không có bảng currencies riêng, chỉ dùng VARCHAR.

**Giải pháp đã thêm**:
```sql
CREATE TABLE currencies (
    code VARCHAR(10) UNIQUE NOT NULL,  -- BTC, ETH, USD...
    type VARCHAR(20) CHECK (type IN ('fiat', 'crypto')),
    decimals INT NOT NULL,
    min_withdrawal, max_withdrawal, fees...
)
```

**Foreign Keys đã thêm**:
- `accounts.currency_id → currencies.id`
- `trading_pairs.base_currency_id → currencies.id`
- `trading_pairs.quote_currency_id → currencies.id`

**Lợi ích**:
- Quản lý tập trung thông tin tiền tệ
- Dễ thêm/xóa currencies
- Validation tự động
- Lưu trữ cấu hình withdrawal/deposit cho từng currency

### 3. ✅ Indexes cho Matching Engine (HIGH PERFORMANCE)

#### A. Composite Index cho Order Matching
```sql
CREATE INDEX idx_orders_symbol_side_price_status 
ON orders(symbol, side, price, status) 
WHERE status IN ('open', 'partially_filled');
```
**Lý do**: 
- Matching engine cần query: "tìm tất cả orders BUY/SELL với price X cho symbol Y"
- WHERE clause filter chỉ active orders → giảm 80-90% data scan

#### B. Market Orders Priority (Time-based)
```sql
CREATE INDEX idx_orders_market_time 
ON orders(symbol, side, created_at)
WHERE order_type = 'market' AND status = 'open';
```
**Lý do**: Market orders ưu tiên thời gian, không cần giá

#### C. Limit Orders Priority (Price-based)
```sql
CREATE INDEX idx_orders_limit_price 
ON orders(symbol, side, price, created_at)
WHERE order_type = 'limit' AND status IN ('open', 'partially_filled');
```
**Lý do**: Limit orders ưu tiên giá, sau đó đến thời gian

### 4. ✅ Order Book Persistence (CRITICAL for Rust Engine)

**Bảng mới**: `orderbook_snapshots`
```sql
CREATE TABLE orderbook_snapshots (
    symbol VARCHAR(20),
    snapshot_data JSONB,  -- Serialize toàn bộ orderbook
    order_count, bid_count, ask_count,
    best_bid, best_ask,
    created_at
)
```

**Chiến lược sử dụng**:
1. **Trong memory**: Matching engine (Rust) giữ orderbook trong RAM
2. **Persistence**: Mỗi 60s lưu snapshot vào DB
3. **Recovery**: Khi restart, load snapshot + replay orders từ DB

**Flow**:
```
[Rust Matching Engine] → In-memory OrderBook (BTreeMap)
          ↓ (every 60s)
    [Save Snapshot to PostgreSQL]
          ↓ (on restart)
    [Load Snapshot + Replay]
```

### 5. ✅ Data Integrity Constraints

#### A. Balance Constraints
```sql
ALTER TABLE accounts ADD CONSTRAINT 
    check_balance_equation CHECK (balance = available_balance + locked_balance);
```
**Đảm bảo**: `total = available + locked` luôn đúng

#### B. Order Quantity Constraints
```sql
CHECK (quantity = filled_quantity + remaining_quantity)
CHECK (filled_quantity >= 0 AND filled_quantity <= quantity)
```
**Đảm bảo**: Không fill quá số lượng order

#### C. Price Validation
```sql
CHECK (price > 0)
CHECK (stop_price > 0)
```

#### D. Trade Validation
```sql
CHECK (total = price * quantity)
```
**Đảm bảo**: Giá trị trade tính đúng

### 6. ✅ Maker/Taker Fee Structure

**Bảng mới**: `fee_tiers`, `user_fee_tiers`

**Fee Structure**:
| Tier     | 30D Volume    | Maker Fee | Taker Fee |
|----------|---------------|-----------|-----------|
| Standard | $0-10K        | 0.10%     | 0.20%     |
| VIP 1    | $10K-100K     | 0.05%     | 0.10%     |
| VIP 2    | $100K-1M      | 0.02%     | 0.08%     |
| VIP 3    | >$1M          | 0.00%     | 0.05%     |

**Trades table updates**:
```sql
ALTER TABLE trades ADD
    maker_order_id, taker_order_id,
    maker_fee, taker_fee,
    maker_fee_rate, taker_fee_rate
```

**Logic**:
- Maker = Order đã có trong orderbook
- Taker = Order mới match với maker
- Maker thường được fee thấp hơn (provide liquidity)

### 7. ✅ Performance Monitoring

**Bảng mới**: `order_metrics`
```sql
CREATE TABLE order_metrics (
    symbol, metric_date,
    total_orders, total_trades, total_volume,
    avg_fill_time_ms,  -- ⚠️ QUAN TRỌNG
    max_fill_time_ms,
    orders_per_second
)
```

**Sử dụng**:
- Monitor matching engine performance
- Alert nếu `avg_fill_time_ms > 100ms`
- Capacity planning

## 🎯 Kiến trúc tổng thể

### Database Role
```
┌─────────────────────────────────────┐
│     PostgreSQL (Persistence)         │
│  - Users, Accounts, Balances        │
│  - Historical orders & trades       │
│  - Order book snapshots             │
└─────────────────────────────────────┘
           ↑↓ (sync)
┌─────────────────────────────────────┐
│   Rust Matching Engine (Memory)     │
│  - Active orderbook (BTreeMap)      │
│  - Real-time matching               │
│  - <1ms latency                     │
└─────────────────────────────────────┘
           ↑↓ (websocket)
┌─────────────────────────────────────┐
│      Go Gateway API (HTTP)          │
│  - REST endpoints                   │
│  - Authentication                   │
│  - Rate limiting                    │
└─────────────────────────────────────┘
```

### Order Lifecycle

```
1. User places order via API Gateway (Go)
      ↓
2. Gateway validates & saves to DB (PostgreSQL)
      ↓
3. Gateway publishes to NATS
      ↓
4. Matching Engine (Rust) receives order
      ↓
5. Engine matches in-memory orderbook
      ↓
6. Trades published back to NATS
      ↓
7. Gateway saves trades to DB
      ↓
8. WebSocket notifies users
```

## 📊 Performance Targets

| Metric                      | Target        | Strategy                          |
|-----------------------------|---------------|-----------------------------------|
| Order matching latency      | <1ms          | In-memory BTreeMap (Rust)         |
| DB write latency            | <10ms         | Async write, indexes              |
| Orders per second           | 10,000+       | Batch inserts, connection pool    |
| Concurrent users            | 100,000+      | Horizontal scaling                |
| Order book snapshot         | Every 60s     | Background job                    |

## 🔒 Data Consistency Strategy

1. **Optimistic Locking**: Version columns in critical tables
2. **Atomic Operations**: Use transactions for multi-table updates
3. **Balance Checks**: Constraints prevent negative balances
4. **Idempotency**: client_order_id for duplicate prevention

## 🚀 Cải tiến tiếp theo

### Sẽ thêm sau:
1. **Partitioning**: Partition `orders` và `trades` by month
2. **Read Replicas**: Separate read/write databases
3. **TimescaleDB**: For time-series metrics
4. **Redis Cache**: Cache hot trading pairs, user balances
5. **Circuit Breaker**: Protect DB from overload

### Index bổ sung khi scale:
```sql
-- Khi có >10M orders
CREATE INDEX idx_orders_created_at_id ON orders(created_at DESC, id);

-- Khi có >100M trades
CREATE INDEX idx_trades_symbol_created_at ON trades(symbol, created_at DESC) 
    WHERE created_at > NOW() - INTERVAL '7 days';
```

## 📝 Migration Commands

```powershell
# Apply migrations
migrate -path services/gateway/migrations -database $env:DATABASE_URL up

# Rollback
migrate -path services/gateway/migrations -database $env:DATABASE_URL down

# Check version
migrate -path services/gateway/migrations -database $env:DATABASE_URL version

# Create new migration
migrate create -ext sql -dir services/gateway/migrations -seq migration_name
```

## 🧪 Validation Queries

```sql
-- Check balance consistency
SELECT user_id, currency, 
       balance, available_balance, locked_balance,
       (balance - available_balance - locked_balance) as diff
FROM accounts 
WHERE balance != (available_balance + locked_balance);

-- Check order fill accuracy
SELECT id, quantity, filled_quantity, remaining_quantity,
       (quantity - filled_quantity - remaining_quantity) as diff
FROM orders
WHERE quantity != (filled_quantity + remaining_quantity);

-- Check trade total accuracy
SELECT id, price, quantity, total,
       (price * quantity - total) as diff
FROM trades
WHERE ABS(price * quantity - total) > 0.00000001;
```

## 📚 References

- [PostgreSQL DECIMAL vs NUMERIC](https://www.postgresql.org/docs/current/datatype-numeric.html)
- [Indexing Strategies](https://www.postgresql.org/docs/current/indexes-types.html)
- [Constraint Check Performance](https://www.postgresql.org/docs/current/ddl-constraints.html)
