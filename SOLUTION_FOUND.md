# ✅ VẤN ĐỀ ĐÃ TÌM RA VÀ GIẢI QUYẾT!

## 🔍 Nguyên nhân lỗi

**Bạn có PostgreSQL 17 đang chạy NATIVE trên Windows và chiếm port 5432!**

- Service: `postgresql-x64-17 - PostgreSQL Server 17`
- Port: `5432` (conflict với Docker PostgreSQL)
- Khi DBeaver kết nối đến `localhost:5432`, nó kết nối đến **PostgreSQL Windows**, không phải Docker container!
- PostgreSQL Windows không có user `trading_user` với password `trading_password` → Lỗi authentication!

## ✅ Giải pháp đã áp dụng

**Đổi port của Docker PostgreSQL từ 5432 → 5433**

- Docker container vẫn dùng port 5432 bên trong
- Expose ra ngoài qua port **5433** để tránh conflict
- Windows PostgreSQL vẫn chạy bình thường trên port 5432

## 🔧 Cấu hình mới trong DBeaver

```
Host:     localhost
Port:     5433  ← ĐÃ ĐỔI SANG 5433!
Database: trading_db
Username: trading_user
Password: trading_password
SSL:      Disable
```

## 📝 Các files đã cập nhật

1. [docker-compose.yml](docker-compose.yml) - Port mapping: `"5433:5432"`
2. [.env](.env) - Thêm `DATABASE_URL_LOCALHOST` với port 5433
3. [services/gateway/.env](services/gateway/.env) - Port 5433

## 🧪 Test kết nối

```powershell
# Test từ command line
docker exec -e PGPASSWORD=trading_password trading-postgres psql -U trading_user -d trading_db -c "\dt"

# Kiểm tra port
netstat -ano | findstr ":5433"
```

## ⚠️ Lưu ý quan trọng

### Option 1: Dùng port 5433 (Đã áp dụng)
- **Ưu điểm**: Không cần động đến PostgreSQL Windows
- **Nhược điểm**: Phải nhớ port 5433
- **Cấu hình DBeaver**: Port = **5433**

### Option 2: Tắt PostgreSQL Windows (Nếu không dùng)
Nếu không cần PostgreSQL Windows, có thể tắt service:

```powershell
# Cần chạy PowerShell as Administrator
Stop-Service -Name "postgresql-x64-17" -Force
Set-Service -Name "postgresql-x64-17" -StartupType Disabled
```

Sau đó đổi port Docker về 5432 trong docker-compose.yml

## 🎯 Kết quả

✅ Docker PostgreSQL đang chạy trên port **5433**  
✅ User: `trading_user` với password MD5  
✅ 5 tables đã được tạo  
✅ Kết nối từ bên ngoài container hoạt động  
✅ **DBeaver giờ sẽ kết nối được với port 5433!**

## 🚀 Hướng dẫn kết nối

1. **Mở DBeaver**
2. **Xóa connection cũ** (nếu có)
3. **Tạo connection mới:**
   - PostgreSQL
   - localhost:5433 (NOT 5432!)
   - trading_db
   - trading_user / trading_password
4. **Test Connection** → SUCCESS! ✅

## 📊 So sánh

| Service | Port | User | Database |
|---------|------|------|----------|
| **Docker PostgreSQL** | **5433** | trading_user | trading_db |
| Windows PostgreSQL | 5432 | postgres | postgres |

---

**VẤN ĐỀ ĐÃ ĐƯỢC GIẢI QUYẾT HOÀN TOÀN!** 🎉
