# 🎯 HƯỚNG DẪN TEST STOP-LIMIT ORDERS

## 🚀 Hệ thống đã khởi động:

✅ **PostgreSQL** (port 5433)
✅ **Redis** (port 6379)
✅ **NATS** (port 4222)
✅ **Rust Matching Engine** (đang lắng nghe NATS)
✅ **Go Gateway API** (port 8080)
✅ **Next.js Web UI** (http://localhost:3000)

---

## 📝 Kịch bản Test Stop-Loss (Cắt lỗ tự động)

### Bước 1: Đăng ký và Login
1. Mở trình duyệt: **http://localhost:3000**
2. Click **Register** và tạo tài khoản:
   - Username: `trader1`
   - Email: `trader1@test.com`
   - Password: `pass123`
3. Login với tài khoản vừa tạo

### Bước 2: Nạp tiền (Deposit)
```powershell
# Nạp 100,000 USDT để mua BTC
$body = @{
    user_id = "YOUR_USER_ID_HERE"  # Lấy từ database
    amount = "100000"
    currency = "USDT"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/accounts/deposit" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer YOUR_TOKEN" }
```

### Bước 3: Đặt lệnh Limit để tạo thị trường
**Trên Web UI:**
- Click tab **SELL**
- Chọn **Limit** order
- Price: `50000` USDT
- Amount: `2` BTC
- Click **Sell BTC**

➡️ Lệnh này sẽ "treo" trên Orderbook ở giá 50k.

---

### Bước 4: Đặt lệnh STOP-LOSS (Cắt lỗ)
**Scenario:** Bạn mua BTC ở 50k, nhưng muốn cắt lỗ tự động nếu giá xuống 49k.

**Trên Web UI:**
- Click tab **SELL**
- Chọn **🛡️ Stop-Limit**
- **Trigger Price**: `49000` (giá kích hoạt)
- **Limit Price**: `48500` (giá đặt lệnh sau khi kích hoạt)
- Amount: `0.5` BTC
- Click **Sell BTC**

✅ **Kết quả:** Lệnh KHÔNG xuất hiện trên Orderbook (vì đang ở trạng thái chờ).

---

### Bước 5: Trigger Stop-Loss (Đập giá xuống)
**Mục tiêu:** Đặt lệnh BUY để khớp với lệnh SELL 50k, kéo giá xuống trigger 49k.

#### Option 1: Qua Web UI (Account khác hoặc tab Incognito)
- Tab **BUY**
- Chọn **Limit**
- Price: `49500` (thấp hơn 50k)
- Amount: `0.3` BTC
- Click **Buy BTC**

#### Option 2: Qua PowerShell
```powershell
$order = @{
    symbol = "BTC/USDT"
    price = "49500"
    amount = "0.3"
    side = "Bid"
    type = "Limit"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/orders" `
    -Method POST `
    -Body $order `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer YOUR_TOKEN" }
```

---

### Bước 6: Quan sát kết quả
**Kiểm tra Engine logs:**
```
⚡ TRIGGER ACTIVATED: 1 Stop-Sell orders @ 49000
 -> Lệnh StopLimit được chuyển thành Limit Order
⚡ Trade: Limit khớp 0.5 @ 48500
```

**Trên Web UI:**
- Check **Trade History** → Sẽ thấy trade mới @ 48500

---

## 🧪 Kịch bản Test Buy Stop (Mua khi giá tăng)

### Setup:
- Giá hiện tại: 48,000 USDT
- Bạn muốn mua BTC khi giá breakout 50k

### Đặt lệnh:
- Tab **BUY**
- Chọn **Stop-Limit**
- **Trigger Price**: `50000` (chờ giá tăng lên)
- **Limit Price**: `50500` (mua ở giá này)
- Amount: `1` BTC

### Trigger:
Đặt lệnh SELL @ 50,000 để đẩy giá lên trigger.

---

## 🔍 Debugging Tips

### 1. Kiểm tra Rust Engine logs:
```powershell
# Terminal đang chạy cargo run --bin matching-engine
# Tìm dòng:
-> StopLimit order XXX đang CHỜ kích hoạt @ trigger=49000
```

### 2. Kiểm tra Database:
```powershell
docker exec -e PGPASSWORD=trading_password trading-postgres psql -U trading_user -d trading_db -c "SELECT id, side, type, price, trigger_price, status FROM engine_orders ORDER BY id DESC LIMIT 10;"
```

### 3. Check NATS messages:
```powershell
# Terminal Gateway sẽ log khi gửi message:
📤 Publishing order to NATS: orders
```

### 4. Web Console:
Mở **F12 Developer Tools** → **Network tab** để xem requests/responses.

---

## ✅ Checklist thành công:

- [ ] Web UI hiển thị tab "Stop-Limit"
- [ ] Input "Trigger Price" xuất hiện khi chọn Stop-Limit
- [ ] Payload gửi đúng `trigger_price` lên API
- [ ] Engine nhận command và thêm vào StopBook
- [ ] Khi giá chạm trigger, lệnh tự động kích hoạt
- [ ] Trade được thực hiện và lưu vào database

---

## 🎓 Bonus: Advanced Features (Nếu muốn tiếp tục)

1. **GET /api/v1/orders/stop** - API để xem các Stop orders đang chờ
2. **Cancel Stop Orders** - Hủy lệnh Stop trước khi trigger
3. **UI Indicator** - Hiển thị Stop orders trên Orderbook (màu vàng)
4. **WebSocket Updates** - Real-time notification khi Stop order được trigger

---

## 💡 Lưu ý:

⚠️ **Stop-Loss không đảm bảo 100% giá khớp:**
- Nếu giá "gap down" (nhảy vọt xuống), lệnh có thể khớp ở giá tệ hơn.
- Ví dụ: Trigger @ 49k, Limit @ 48.5k, nhưng thực tế khớp @ 47k (nếu không có bid nào).

⚠️ **Market Order vs Stop-Limit:**
- Stop-Limit: An toàn hơn (có limit price), nhưng có thể không khớp.
- Stop-Market: Đảm bảo khớp, nhưng giá không kiểm soát được.

---

**Chúc mừng! Bạn đã master Stop-Limit Orders!** 🎉

