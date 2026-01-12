# Hướng dẫn kết nối DBeaver với Trading Database

## Thông tin kết nối

```
Host:     localhost
Port:     5432
Database: trading_db
Username: trading_user
Password: trading_password
SSL:      Disable (hoặc None)
```

## Các bước kết nối trong DBeaver

### Bước 1: Xóa connection cũ (nếu có)
1. Click chuột phải vào connection `trading_db` cũ
2. Chọn "Delete"
3. Xác nhận xóa

### Bước 2: Tạo connection mới
1. Click vào nút "New Database Connection" (hoặc File > New > Database Connection)
2. Chọn "PostgreSQL"
3. Click "Next"

### Bước 3: Cấu hình connection
Trong tab "Main":
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `trading_db`
- **Authentication**: `Database Native`
- **Username**: `trading_user`
- **Password**: `trading_password`
- **Save password**: ✓ (tick vào đây)

### Bước 4: Cấu hình SSL
Trong tab "SSL":
- **SSL mode**: `disable` hoặc `none`
- **Use SSL**: Không tick (uncheck)

### Bước 5: Test Connection
1. Click nút "Test Connection"
2. Nếu thành công sẽ hiện: "Connected"
3. Click "Finish" hoặc "OK"

## Khắc phục sự cố

### Lỗi: "password authentication failed"

**Giải pháp 1: Reset hoàn toàn database**
```powershell
cd E:\My_Project
.\reset-database.ps1
```

**Giải pháp 2: Kiểm tra container đang chạy**
```powershell
docker ps | findstr postgres
```
Phải thấy: `trading-postgres ... Up ... (healthy)`

**Giải pháp 3: Kiểm tra connection từ command line**
```powershell
.\test-database-connection.ps1
```

**Giải pháp 4: Xóa cache DBeaver**
1. Đóng DBeaver
2. Xóa folder: `C:\Users\<YourUsername>\.dbeaver\credentials`
3. Mở lại DBeaver và tạo connection mới

### Lỗi: "Connection refused" hoặc "Cannot connect"

**Kiểm tra container:**
```powershell
docker ps -a | findstr postgres
```

**Khởi động lại container:**
```powershell
docker-compose restart postgres
```

**Xem logs:**
```powershell
docker logs trading-postgres --tail 50
```

### Lỗi: "FATAL: database does not exist"

**Reset database:**
```powershell
.\reset-database.ps1
```

## Các bảng trong database

Sau khi kết nối thành công, bạn sẽ thấy các bảng:

1. `users` - Thông tin người dùng
2. `account_balances` - Số dư tài khoản
3. `orders` - Lệnh giao dịch
4. `trades` - Giao dịch đã thực hiện
5. `trading_pairs` - Các cặp giao dịch

## Scripts tiện ích

### Reset toàn bộ database
```powershell
.\reset-database.ps1
```
- Dừng container
- Xóa volumes
- Tạo lại database mới
- Chạy migrations

### Test kết nối
```powershell
.\test-database-connection.ps1
```
- Kiểm tra container status
- Test authentication
- List tables
- Show connection info

## Connection String

Để sử dụng trong code hoặc các tools khác:

```
postgresql://trading_user:trading_password@localhost:5432/trading_db?sslmode=disable
```

## Lưu ý quan trọng

1. **Password authentication method**: Database sử dụng `scram-sha-256`
2. **Không dùng SSL**: Đảm bảo SSL mode = `disable`
3. **Localhost only**: Database chỉ chạy trên local, không expose ra internet
4. **Default credentials**: Đổi password trong production!

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, gửi output của:
```powershell
.\test-database-connection.ps1 > debug.log 2>&1
```
