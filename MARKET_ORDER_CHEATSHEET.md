# 🚀 Market Order - Quick Reference Card

## 📋 Cheat Sheet

### 1. Định Nghĩa OrderType (models.rs)
```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum OrderType {
    Limit,   // Lệnh giới hạn - chờ giá tốt
    Market,  // Lệnh thị trường - khớp ngay
}

// Trong struct Order:
#[serde(default)]
#[serde(rename = "type")]  // Map với JSON "type"
pub order_type: OrderType,
```

---

### 2. Matching Logic (orderbook.rs)

#### A. Duyệt OrderBook
```rust
let prices_to_check: Vec<Decimal> = match order.side {
    Side::Bid => opposite_side.keys().copied().collect(),       // Buy → Ask thấp → cao
    Side::Ask => opposite_side.keys().rev().copied().collect(), // Sell → Bid cao → thấp
};
```

#### B. Kiểm Tra Khớp
```rust
let can_match = match order.order_type {
    OrderType::Market => true,  // ⚡ Market = Khớp bất chấp
    OrderType::Limit => {
        match order.side {
            Side::Bid => order.price >= price,  // Mua: giá >= bán
            Side::Ask => order.price <= price,  // Bán: giá <= mua
        }
    }
};
```

#### C. Xử Lý Phần Dư
```rust
if order.amount > Decimal::ZERO {
    match order.order_type {
        OrderType::Limit => self.add_limit_order(order),  // ✅ Vào Book
        OrderType::Market => { /* ❌ Không vào Book */ }  // Kill
    }
}
```

---

### 3. JSON API Format

#### Limit Order
```json
{
  "symbol": "BTC/USDT",
  "type": "Limit",
  "side": "Buy",
  "price": 50000.0,
  "amount": 1.0
}
```

#### Market Order
```json
{
  "symbol": "BTC/USDT",
  "type": "Market",
  "side": "Buy",
  "price": 0,        // Ignored
  "amount": 1.0
}
```

---

### 4. Test Commands

#### Run Tests
```powershell
cd e:\My_Project\services\engine
cargo test                           # Chạy tất cả tests
cargo test test_market_order         # Chạy tests có tên chứa "market_order"
cargo test -- --nocapture           # Hiện println! output
```

#### Run Engine
```powershell
cargo run --bin matching-engine      # Chạy engine
cargo run --bin matching-engine -- --help  # Xem options
```

---

### 5. Debug Commands

#### Check Compilation
```powershell
cargo check           # Kiểm tra lỗi syntax
cargo clippy          # Lint checker (nâng cao)
cargo fmt             # Format code
```

#### View Logs
```powershell
# Engine logs sẽ hiển thị:
#   ⚡ Trade: "MARKET" khớp 1.0 @ 50000
#   → Lệnh Market còn dư 0.5 nhưng không thêm vào Book (Kill)
```

---

### 6. Key Differences

| Aspect | Limit | Market |
|--------|-------|--------|
| **Giá** | Cố định | Bất kỳ |
| **Khớp** | Có thể chờ | Ngay lập tức |
| **Book** | ✅ Có | ❌ Không |
| **Kill** | Khi cancel | Phần dư |

---

### 7. Common Pitfalls

❌ **SAI:**
```rust
// Không check order_type trước khi add vào Book
if order.amount > Decimal::ZERO {
    self.add_limit_order(order);  // BUG: Market cũng vào Book!
}
```

✅ **ĐÚNG:**
```rust
if order.amount > Decimal::ZERO && order.order_type == OrderType::Limit {
    self.add_limit_order(order);
}
```

---

### 8. Performance Notes

```rust
// BTreeMap complexity:
// - Insert: O(log n)
// - Get: O(log n)
// - Iter: O(n)

// Market Order matching:
// - Best case: O(1) - Khớp 1 lệnh ngay
// - Worst case: O(n) - Quét hết book
```

---

### 9. Test Scenarios

```rust
// Test 1: Full Match
Market Buy 1.5 BTC, Book có 2 BTC → ✅ Khớp hết

// Test 2: Partial Match
Market Buy 2.0 BTC, Book có 1 BTC → ⚠️ Khớp 1, Kill 1

// Test 3: Ignores Price
Market Buy price=1000 (vô lý) → ✅ Vẫn khớp ở giá thị trường

// Test 4: Sell Priority
Market Sell → Khớp với Bid CAO NHẤT trước
```

---

### 10. Monitoring

```rust
// Metrics to track:
// - Total Market Orders: count
// - Market Order Fill Rate: (filled_amount / total_amount)
// - Average Slippage: (actual_price - best_price) / best_price
// - Kill Rate: killed_amount / total_amount
```

---

## 🔥 One-Liners

```rust
// Check if Market Order
order.order_type == OrderType::Market

// Should add to book?
order.amount > Decimal::ZERO && order.order_type == OrderType::Limit

// Parse from JSON (Go sends "type": "Market")
#[serde(rename = "type")]  // Map "type" → order_type

// Get best price direction
match order.side {
    Side::Bid => asks.keys(),           // Buy → Low to High
    Side::Ask => bids.keys().rev(),     // Sell → High to Low
}
```

---

## 📞 Quick Debug

```powershell
# Engine không nhận lệnh?
→ Check NATS connection: "✅ Connected to NATS!"

# Lệnh không khớp?
→ Check engine logs: "⚡ Trade: ..."

# Test fail?
→ Check OrderType parameter: Order::new(..., OrderType::Market)

# JSON parse lỗi?
→ Check field name: "type" (lowercase) in JSON
```

---

## 🎯 Files Modified

```
services/engine/src/
├── models.rs     → OrderType enum + serde rename
├── orderbook.rs  → Matching logic + .rev()
└── tests.rs      → 6 new Market Order tests
```

---

## ✅ Done Checklist

- [x] OrderType enum defined
- [x] Serde rename "type"
- [x] Matching logic updated
- [x] .rev() for sell orders
- [x] Kill logic for remaining
- [x] 15/15 tests pass
- [x] Engine runs successfully
- [x] JSON format correct

---

**Print this and stick on your monitor! 📄🖨️**
