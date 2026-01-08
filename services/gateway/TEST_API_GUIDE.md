# Hướng dẫn Test API Gateway với JWT Authentication

## Tóm tắt
Server Gateway đã được cài đặt thành công với:
- ✅ Gin Framework
- ✅ JWT Authentication (Token-based)
- ✅ Middleware bảo vệ private routes
- ✅ Public routes: Register, Login
- ✅ Private routes: /api/v1/users/me

Server đang chạy tại: **http://localhost:8080**

---

## 📋 Các API Endpoints

### 1. Health Check (Public)
```bash
GET http://localhost:8080/health
```

**Response:**
```json
{
  "status": "ok",
  "service": "gateway"
}
```

---

### 2. Register User (Public)
```bash
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "created_at": "2026-01-08T09:42:03Z"
}
```

> **Lưu ý:** Lưu lại `access_token` để dùng cho các API bảo vệ!

---

### 3. Login User (Public)
```bash
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "username": "testuser",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 4. Get Current User Info (Protected)
```bash
GET http://localhost:8080/api/v1/users/me
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Hello testuser"
}
```

---

## 🔐 Test Middleware với Postman

### Bước 1: Test Login
1. Mở Postman
2. Tạo request mới:
   - Method: `POST`
   - URL: `http://localhost:8080/api/v1/auth/login`
   - Tab **Body** → chọn **raw** → chọn **JSON**
   - Nhập:
     ```json
     {
       "username": "testuser",
       "password": "password123"
     }
     ```
3. Bấm **Send**
4. **Copy** giá trị `access_token` từ response

### Bước 2: Test Protected Route
1. Tạo request mới:
   - Method: `GET`
   - URL: `http://localhost:8080/api/v1/users/me`
2. Vào tab **Authorization**:
   - Type: chọn **Bearer Token**
   - Token: **Paste** token vừa copy
3. Bấm **Send**
4. Nếu thành công, bạn sẽ thấy: `{"message": "Hello testuser"}`

### Bước 3: Test Không có Token (Sẽ bị chặn)
1. Tạo request mới:
   - Method: `GET`
   - URL: `http://localhost:8080/api/v1/users/me`
2. **KHÔNG** thêm Authorization header
3. Bấm **Send**
4. Kết quả: `401 Unauthorized` với message: `{"error": "authorization header is not provided"}`

---

## 🧪 Test với cURL (Command Line)

### Test Login:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"password123\"}"
```

### Test Protected Route (với Token):
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Test Protected Route (không có Token - sẽ bị chặn):
```bash
curl -X GET http://localhost:8080/api/v1/users/me
```

---

## 🎯 Kết quả mong đợi

| Scenario | Expected Result |
|----------|----------------|
| Login thành công | ✅ Trả về `access_token` |
| Gọi `/users/me` **có** token hợp lệ | ✅ Trả về `{"message": "Hello testuser"}` |
| Gọi `/users/me` **không có** token | ❌ `401 Unauthorized` |
| Gọi `/users/me` với token **sai** | ❌ `401 Unauthorized` |

---

## 📝 Lưu ý quan trọng

1. **Token có thời hạn**: Token sẽ hết hạn sau 24 giờ (được cấu hình trong `.env`)
2. **Secret Key**: JWT_SECRET phải được giữ bí mật, không được public lên GitHub
3. **Database chưa kết nối**: Hiện tại user authentication chỉ là demo, chưa kiểm tra database thực tế

---

## 🚀 Bước tiếp theo (Giai đoạn 3 - Phần 2)

Bạn đã hoàn thành **Phần 1: Xác thực & Middleware**! ✅

Tiếp theo, chúng ta sẽ:
1. Kết nối với Database (PostgreSQL)
2. Tạo API **GET /api/v1/accounts** - Xem số dư
3. Tạo API **POST /api/v1/accounts/deposit** - Nạp tiền vào tài khoản
4. Sử dụng SQLC để tạo queries
5. Implement Database Transactions

---

## 🐛 Troubleshooting

### Server không khởi động:
```bash
# Kiểm tra port 8080 có bị chiếm không:
netstat -ano | findstr :8080

# Nếu bị chiếm, thay đổi port trong .env:
GATEWAY_PORT=8081
```

### Lỗi JWT_SECRET:
Đảm bảo file `.env` có dòng:
```
JWT_SECRET=day_la_khoa_bi_mat_rat_dai_va_kho_doan_123456
```

### Token bị lỗi:
- Kiểm tra format header: `Authorization: Bearer <token>` (có khoảng trắng giữa Bearer và token)
- Token không được có dấu ngoặc kép bao quanh
