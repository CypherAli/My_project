# 📊 Market Order vs Limit Order - Visual Guide

## 🎯 Tổng Quan So Sánh

```
┌─────────────────┬────────────────────┬────────────────────┐
│  Đặc Điểm       │  Limit Order       │  Market Order      │
├─────────────────┼────────────────────┼────────────────────┤
│  Giá khớp       │  Giá cố định       │  Giá thị trường    │
│  Tốc độ khớp    │  Có thể phải chờ   │  Ngay lập tức      │
│  Vào OrderBook  │  Có                │  Không             │
│  Vai trò        │  Maker (tạo TK)    │  Taker (lấy TK)    │
│  Phí giao dịch  │  Thấp hơn         │  Cao hơn           │
│  Slippage       │  Không có          │  Có thể có         │
└─────────────────┴────────────────────┴────────────────────┘

TK = Thanh khoản
```

---

## 📖 Scenario 1: Limit Order Matching

### Tình Huống Ban Đầu
```
OrderBook:
  Asks (Bán):
    51,000 USDT → 0.5 BTC
    50,500 USDT → 1.0 BTC
    50,000 USDT → 2.0 BTC  ← Best Ask (giá bán tốt nhất)
  ──────────────────────────────
  Bids (Mua):
    49,500 USDT → 1.0 BTC  ← Best Bid (giá mua tốt nhất)
    49,000 USDT → 1.5 BTC
    48,500 USDT → 0.8 BTC
```

### Action: Đặt Limit Buy 1.0 BTC @ 50,000 USDT
```
Check: Giá mua (50,000) >= Best Ask (50,000)? → ✅ YES

Match:
  Trade #1: 1.0 BTC @ 50,000 USDT

Remaining: 0 BTC → Lệnh khớp hết, không vào Book
```

### Kết Quả
```
OrderBook After:
  Asks (Bán):
    51,000 USDT → 0.5 BTC
    50,500 USDT → 1.0 BTC
    50,000 USDT → 1.0 BTC  ← Còn lại (đã khớp 1.0)
  ──────────────────────────────
  Bids (Mua):
    49,500 USDT → 1.0 BTC
    49,000 USDT → 1.5 BTC
    48,500 USDT → 0.8 BTC
```

---

## 🚀 Scenario 2: Market Order Matching

### Tình Huống Ban Đầu (Giống Scenario 1)
```
OrderBook:
  Asks (Bán):
    51,000 USDT → 0.5 BTC
    50,500 USDT → 1.0 BTC
    50,000 USDT → 2.0 BTC  ← Best Ask
  ──────────────────────────────
  Bids (Mua):
    49,500 USDT → 1.0 BTC  ← Best Bid
    49,000 USDT → 1.5 BTC
```

### Action: Đặt Market Buy 2.5 BTC
```
Market Order không check giá!
→ "Hốt" tất cả giá bán từ thấp đến cao:

Step 1: Khớp vs 50,000 USDT
  Trade #1: 2.0 BTC @ 50,000 USDT
  Remaining: 0.5 BTC

Step 2: Khớp vs 50,500 USDT
  Trade #2: 0.5 BTC @ 50,500 USDT
  Remaining: 0 BTC

✅ Khớp hết!
```

### Kết Quả
```
OrderBook After:
  Asks (Bán):
    51,000 USDT → 0.5 BTC
    50,500 USDT → 0.5 BTC  ← Còn lại (đã khớp 0.5)
  ──────────────────────────────
  Bids (Mua):
    49,500 USDT → 1.0 BTC
    49,000 USDT → 1.5 BTC
```

**💰 Chi Phí:**
```
Total Cost = (2.0 * 50,000) + (0.5 * 50,500)
           = 100,000 + 25,250
           = 125,250 USDT

Average Price = 125,250 / 2.5 = 50,100 USDT/BTC
```

---

## ⚠️ Scenario 3: Market Order Partial Fill

### Tình Huống: Thanh khoản không đủ
```
OrderBook:
  Asks (Bán):
    50,000 USDT → 1.0 BTC  ← Chỉ có 1 BTC trong Book!
  ──────────────────────────────
  Bids (Mua):
    49,500 USDT → 1.0 BTC
```

### Action: Đặt Market Buy 3.0 BTC
```
Market Order cố gắng khớp hết:

Step 1: Khớp vs 50,000 USDT
  Trade #1: 1.0 BTC @ 50,000 USDT
  Remaining: 2.0 BTC

Step 2: Không còn Ask nào!
  → Phần dư 2.0 BTC bị KILL (hủy bỏ)
  → ⚠️ Market Order KHÔNG vào OrderBook
```

### Kết Quả
```
✅ Khớp: 1.0 BTC @ 50,000 USDT
❌ Kill: 2.0 BTC (không khớp được)

OrderBook After:
  Asks (Bán):
    (Trống)
  ──────────────────────────────
  Bids (Mua):
    49,500 USDT → 1.0 BTC
```

---

## 🔄 Scenario 4: Market Sell Order

### Tình Huống
```
OrderBook:
  Asks (Bán):
    50,000 USDT → 1.0 BTC
  ──────────────────────────────
  Bids (Mua):
    49,500 USDT → 0.8 BTC  ← Best Bid
    49,000 USDT → 1.0 BTC
    48,500 USDT → 0.5 BTC
```

### Action: Đặt Market Sell 1.5 BTC
```
Market Sell → Lấy giá mua CAO NHẤT trước:

Step 1: Khớp vs 49,500 USDT (Best Bid)
  Trade #1: 0.8 BTC @ 49,500 USDT
  Remaining: 0.7 BTC

Step 2: Khớp vs 49,000 USDT
  Trade #2: 0.7 BTC @ 49,000 USDT
  Remaining: 0 BTC

✅ Khớp hết!
```

### Kết Quả
```
💰 Revenue:
  = (0.8 * 49,500) + (0.7 * 49,000)
  = 39,600 + 34,300
  = 73,900 USDT

Average Sell Price = 73,900 / 1.5 = 49,267 USDT/BTC
```

---

## 🧠 Key Takeaways

### 1. **Market Order = Instant Gratification**
```
Limit Order:  "Tôi muốn mua giá X, chờ được"
Market Order: "Tôi muốn mua NGAY, giá bao nhiêu cũng được!"
```

### 2. **Price Slippage**
```
Ví dụ: Best Ask là 50,000 USDT
Nhưng Market Buy 10 BTC có thể khớp ở:
  - 2 BTC @ 50,000
  - 5 BTC @ 50,100
  - 3 BTC @ 50,200
→ Average: 50,130 USDT (cao hơn 130 USDT so với dự kiến!)
```

### 3. **Maker vs Taker Fee**
```
Exchange thường tính:
  Maker Fee (Limit): 0.05% - 0.10%
  Taker Fee (Market): 0.10% - 0.20%

Lý do: Market Order "lấy" thanh khoản, Limit Order "tạo" thanh khoản
```

### 4. **Khi Nào Dùng Market Order?**
✅ **Nên dùng:**
- Thị trường có thanh khoản cao
- Cần vào/thoát lệnh gấp
- Chấp nhận slippage nhỏ

❌ **Không nên dùng:**
- Thị trường thanh khoản thấp (slippage lớn)
- Không gấp, có thể chờ giá tốt hơn
- Volume lệnh lớn (sẽ ăn nhiều mức giá)

---

## 🔧 Implementation Notes

### Rust Engine Logic
```rust
// Kiểm tra có thể khớp không?
let can_match = match order.order_type {
    OrderType::Market => true,  // Market: Khớp bất chấp!
    OrderType::Limit => {
        match order.side {
            Side::Bid => order.price >= ask_price,  // Buy
            Side::Ask => order.price <= bid_price,  // Sell
        }
    }
};

// Xử lý phần dư
if order.amount > Decimal::ZERO {
    match order.order_type {
        OrderType::Limit => self.add_limit_order(order),  // Vào Book
        OrderType::Market => {
            // KHÔNG làm gì, phần dư bị Kill!
            println!("Market order killed: {} remaining", order.amount);
        }
    }
}
```

### JSON Format
```json
// Limit Order
{
  "symbol": "BTC/USDT",
  "type": "Limit",      // ← Chú ý viết hoa chữ L
  "side": "Buy",
  "price": 50000.0,
  "amount": 1.0
}

// Market Order
{
  "symbol": "BTC/USDT",
  "type": "Market",     // ← Chú ý viết hoa chữ M
  "side": "Buy",
  "price": 0,           // ← Có thể để 0 hoặc bất kỳ giá nào (sẽ bị ignore)
  "amount": 1.0
}
```

---

## 📈 Real-World Example

### Binance OrderBook (BTC/USDT)
```
Asks:
  50,101.5 → 0.12 BTC
  50,101.0 → 0.45 BTC
  50,100.5 → 1.23 BTC  ← Best Ask
──────────────────────────
  50,099.5 → 0.89 BTC  ← Best Bid
  50,099.0 → 1.50 BTC
  50,098.5 → 0.67 BTC
```

**Market Buy 1.5 BTC:**
```
Khớp:
  1. 1.23 BTC @ 50,100.5 = 61,623.62 USDT
  2. 0.27 BTC @ 50,101.0 = 13,527.27 USDT

Total: 75,150.89 USDT
Average: 50,100.59 USDT/BTC
Slippage: 0.59 USDT (0.001%)  ← Nhỏ vì thanh khoản cao!
```

---

**📝 File này giải thích chi tiết logic Market Order cho mục đích training/documentation.**
