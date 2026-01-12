# 🧪 Trade History - Quick Test Guide

## 🚀 Quick Start

### 1. Khởi động hệ thống (3 terminals)

**Terminal 1: Rust Engine**
```powershell
cd e:\My_Project\services\engine
cargo run --bin matching-engine
```

**Terminal 2: Go Gateway**
```powershell
cd e:\My_Project\services\gateway
go run cmd/server/main.go
# Or: .\gateway.exe
```

**Terminal 3: Frontend**
```powershell
cd e:\My_Project\web
npm run dev
```

---

## 📋 Test Scenarios

### Test 1: Basic Trade History Display

**Steps:**
1. Mở browser: `http://localhost:3000`
2. Login (hoặc Register nếu chưa có account)
3. Click tab **"History"** ở bottom panel
4. Kiểm tra hiển thị đúng (ban đầu có thể trống)

**Expected:**
- ✅ Tab History hiển thị table
- ✅ Columns: Time, Symbol, Side, Price, Amount, Total
- ✅ Message "No trades yet" nếu chưa có trade

---

### Test 2: Market Order → Trade History

**Steps:**
1. Tab "Funds" → Deposit 100,000 USDT (nếu chưa có)
2. Tab Market → Nhập amount: `1.0` BTC
3. Click **"Buy BTC"**
4. Đợi 2 giây
5. Click tab **"History"**

**Expected:**
- ✅ Thấy entry mới: `BUY 1.0 BTC @ [price]`
- ✅ Total USDT = Price × Amount
- ✅ Side màu xanh (green) cho BUY
- ✅ Time hiển thị đúng

---

### Test 3: Limit Order → Trade History

**Setup:**
1. User A: Đặt Limit Sell 1 BTC @ 50,000 USDT
2. User B: Đặt Limit Buy 1 BTC @ 50,000 USDT

**Steps:**
1. User A click tab "History"
2. User B click tab "History"

**Expected:**
- ✅ User A thấy: `SELL 1.0 BTC @ 50,000`
- ✅ User B thấy: `BUY 1.0 BTC @ 50,000`
- ✅ Cả 2 có trade_id giống nhau (nếu log)

---

### Test 4: Auto-Refresh (5 seconds)

**Steps:**
1. Để tab "History" mở
2. Mở tab khác → Đặt Market Buy
3. Đợi tối đa 5 giây (không refresh trang)

**Expected:**
- ✅ Trade mới tự động xuất hiện sau 5s
- ✅ Không cần F5 hoặc click lại tab

---

### Test 5: Multiple Trades

**Steps:**
1. Đặt 3 lệnh liên tiếp:
   - Market Buy 0.5 BTC
   - Market Sell 0.3 BTC
   - Limit Buy 1 BTC @ 49,000 (chờ khớp)
2. Click tab "History"

**Expected:**
- ✅ Thấy 2 trades (Market Buy + Market Sell)
- ✅ Limit order chưa khớp → Không có trong History
- ✅ Trades sắp xếp mới nhất trước (DESC by time)

---

## 🔍 API Testing (Postman/cURL)

### Get Trade History
```bash
curl -X GET http://localhost:8080/api/v1/trades \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
[
  {
    "id": 123,
    "symbol": "BTC/USDT",
    "side": "Bid",
    "price": "50100.00000000",
    "amount": "1.20000000",
    "created_at": "2026-01-12T10:30:15Z"
  }
]
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "No trades yet" sau khi đặt lệnh
**Cause:** Lệnh chưa khớp (chỉ vào OrderBook, chưa có Trade)

**Solution:**
- Kiểm tra tab "Open Orders" → Nếu lệnh còn đó = Chưa khớp
- Đặt lệnh ở giá thị trường để chắc chắn khớp

---

### Issue 2: Trade không tự động refresh
**Cause:** 
- Frontend interval không chạy
- Tab không focus

**Solution:**
```bash
# Check browser console:
# Phải thấy network request mỗi 5s
GET http://localhost:8080/api/v1/trades
```

---

### Issue 3: "failed to get user" error
**Cause:** Token hết hạn hoặc không hợp lệ

**Solution:**
1. Logout → Login lại
2. Check JWT expiry time (default 24h)

---

### Issue 4: Trade hiển thị Side sai
**Cause:** Database query logic sai

**Debug:**
```sql
-- Chạy trực tiếp trong psql
SELECT 
    t.id,
    m.symbol,
    m.user_id as maker_user,
    k.user_id as taker_user,
    m.side as maker_side,
    k.side as taker_side,
    CASE 
        WHEN m.user_id = 1 THEN m.side 
        ELSE k.side 
    END AS user_side
FROM engine_trades t
JOIN engine_orders m ON t.maker_order_id = m.id
JOIN engine_orders k ON t.taker_order_id = k.id
WHERE m.user_id = 1 OR k.user_id = 1;
```

---

## 📊 Database Verification

### Check Trades Table
```sql
-- Kiểm tra trade records
SELECT * FROM engine_trades ORDER BY created_at DESC LIMIT 10;
```

### Check Orders Table
```sql
-- Kiểm tra orders liên quan
SELECT id, user_id, symbol, side, price, amount, status 
FROM engine_orders 
WHERE id IN (
    SELECT maker_order_id FROM engine_trades 
    UNION 
    SELECT taker_order_id FROM engine_trades
);
```

### Verify Trade-Order Link
```sql
-- Verify mỗi trade có đầy đủ maker và taker order
SELECT 
    t.id as trade_id,
    m.id as maker_order_id,
    k.id as taker_order_id,
    m.user_id as maker_user,
    k.user_id as taker_user
FROM engine_trades t
LEFT JOIN engine_orders m ON t.maker_order_id = m.id
LEFT JOIN engine_orders k ON t.taker_order_id = k.id
WHERE m.id IS NULL OR k.id IS NULL;
-- Kết quả phải rỗng (không có trade orphan)
```

---

## 🎯 Performance Testing

### Load Test: 100 Trades
```powershell
# PowerShell script để tạo 100 trades nhanh
for ($i=1; $i -le 100; $i++) {
    curl -X POST http://localhost:8080/api/v1/orders `
      -H "Authorization: Bearer $TOKEN" `
      -H "Content-Type: application/json" `
      -d '{"symbol":"BTC/USDT","type":"Market","side":"Buy","amount":0.01}'
    Start-Sleep -Milliseconds 100
}
```

**Expected:**
- ✅ API /trades trả về 50 trades mới nhất (LIMIT 50)
- ✅ Response time < 100ms
- ✅ Frontend render mượt mà

---

## ✅ Success Criteria

### Backend
- [x] API /api/v1/trades trả về đúng format
- [x] Query JOIN đúng maker + taker orders
- [x] Side xác định đúng cho user
- [x] Limit 50 trades hoạt động
- [x] Protected route yêu cầu auth

### Frontend
- [x] TradeHistory component render table
- [x] Auto-refresh mỗi 5s
- [x] BUY màu xanh, SELL màu đỏ
- [x] Time format đúng (locale)
- [x] Total tính toán chính xác
- [x] Empty state message
- [x] Loading state

### Integration
- [x] Market Order → Xuất hiện trong History
- [x] Limit Order khớp → Xuất hiện trong History
- [x] User chỉ thấy trades của mình
- [x] Trades sắp xếp mới nhất trước

---

## 🎓 Demo Script

```
👋 "Chào mọi người! Hôm nay demo Trade History module."

1️⃣ "Đây là tab History - nơi lưu lại mọi giao dịch."
   [Click tab History]

2️⃣ "Hiện tại trống. Giờ tôi đặt Market Buy 1 BTC."
   [Tab Market → Buy 1 BTC]

3️⃣ "Đợi vài giây... Bùm! Trade xuất hiện!"
   [Tab History auto-refresh → Trade mới hiện ra]

4️⃣ "Tôi thấy: BUY 1 BTC @ 50,100 USDT = 50,100 USDT total."
   [Point vào row]

5️⃣ "Nó tự động refresh mỗi 5 giây nên không cần F5."
   [Đặt thêm 1 lệnh → Đợi 5s → Trade mới tự xuất hiện]

✅ "Vậy là user luôn biết họ vừa trade gì. Transparency!"
```

---

## 📞 Support

**Nếu gặp lỗi:**
1. Check terminal logs (Backend + Engine)
2. Check browser console (Frontend)
3. Verify database: `psql -U postgres -d trading_db`

**Common Commands:**
```powershell
# Restart Backend
cd e:\My_Project\services\gateway
go run cmd/server/main.go

# Check logs
# Backend sẽ log mỗi API call
# Engine sẽ log mỗi trade match

# Clear browser cache
Ctrl + Shift + Delete → Clear cache
```

---

**Happy Testing! 🚀**
