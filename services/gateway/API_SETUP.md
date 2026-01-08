# 🚀 API Setup Complete - Ready to Run!

## ✅ Đã hoàn thành

### 1. Cấu trúc thư mục API
```
services/gateway/
├── api/
│   ├── server.go          # Gin server & route configuration
│   └── handlers/
│       └── user.go         # Register API handler
├── internal/
│   ├── database/sqlc/      # Generated database code
│   └── util/
│       └── password.go     # Password hashing utilities
├── main.go                 # Entry point
├── .env.example           # Environment variables template
└── go.mod                  # Dependencies
```

### 2. API Endpoints đã implement
- ✅ `POST /api/v1/auth/register` - Đăng ký người dùng mới

### 3. Dependencies đã thêm vào go.mod
- ✅ `github.com/gin-gonic/gin` - HTTP web framework
- ✅ `github.com/jackc/pgx/v5` - PostgreSQL driver  
- ✅ `golang.org/x/crypto` - Bcrypt password hashing
- ✅ `github.com/google/uuid` - UUID generation
- ✅ `github.com/joho/godotenv` - Environment variables loader

## 🎯 Cách chạy Server

### Bước 1: Cài đặt Go (nếu chưa có)
Download và cài đặt Go từ: https://go.dev/dl/

Kiểm tra cài đặt:
```bash
go version
```

### Bước 2: Cài đặt dependencies
```bash
cd services/gateway
go mod tidy
```

### Bước 3: Cấu hình Database
1. Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Đảm bảo PostgreSQL đang chạy:
```bash
docker-compose up -d postgres
```

### Bước 4: Chạy Server
```bash
go run main.go
```

Nếu thành công, bạn sẽ thấy:
```
✅ Database connected successfully
🚀 Server starting on port 8080...
```

## 📮 Test API với Postman/cURL

### Test Register User
**Request:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (Success):**
```json
{
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Response khi validation lỗi:**
```json
{
  "error": "Key: 'createUserRequest.Email' Error:Field validation for 'Email' failed on the 'email' tag"
}
```

**Response khi email đã tồn tại:**
```json
{
  "error": "duplicate key value violates unique constraint \"users_email_key\""
}
```

## 🧪 Test Cases cần kiểm tra

### ✅ Happy Path
1. Register user mới với thông tin hợp lệ
2. Kiểm tra user đã được tạo trong database:
```sql
SELECT * FROM users WHERE email = 'john@example.com';
```
3. Verify password đã được hash (không phải plain text)

### ❌ Error Cases
1. **Email không hợp lệ**
```json
{
  "username": "test",
  "email": "invalid-email",
  "password": "123456"
}
```

2. **Password quá ngắn (< 6 ký tự)**
```json
{
  "username": "test",
  "email": "test@example.com",
  "password": "12345"
}
```

3. **Username không hợp lệ (chứa ký tự đặc biệt)**
```json
{
  "username": "test@user!",
  "email": "test@example.com",
  "password": "123456"
}
```

4. **Email trùng lặp** (đăng ký 2 lần với cùng email)

## 📊 Kiểm tra Database

Sau khi test thành công, connect vào PostgreSQL và kiểm tra:

```sql
-- Xem tất cả users
SELECT id, username, email, is_verified, created_at 
FROM users;

-- Kiểm tra password đã được hash
SELECT username, 
       LEFT(password_hash, 20) as hashed_preview 
FROM users;
```

## 🔧 Troubleshooting

### Lỗi "cannot connect to db"
- Kiểm tra PostgreSQL đang chạy: `docker ps`
- Kiểm tra connection string trong `.env`
- Test connection: `psql postgresql://trading_user:trading_password@localhost:5432/trading_db`

### Lỗi "port 8080 already in use"
- Đổi port trong `.env`: `GATEWAY_PORT=8081`
- Hoặc kill process đang dùng port 8080

### Lỗi "package not found"
```bash
go mod tidy
go mod download
```

## 🎉 Next Steps

Sau khi Register API hoạt động, bạn có thể:

1. **Implement Login API** - Xác thực user và trả về JWT token
2. **Implement Deposit API** - Nạp tiền vào tài khoản
3. **Add Authentication Middleware** - Bảo vệ các API cần đăng nhập
4. **Handle Error Better** - Phân loại lỗi duplicate key, validation, etc.
5. **Add Logging** - Ghi log chi tiết cho debugging
6. **Create Default Spot Account** - Tự động tạo ví khi đăng ký

## 📚 Code Structure Explained

### main.go
- Kết nối database với pgx/v5
- Khởi tạo sqlc Queries
- Start Gin server

### api/server.go  
- Cấu hình Gin router
- Define routes (/api/v1/auth/register)
- Wire handlers

### api/handlers/user.go
- Validate request JSON
- Hash password với bcrypt
- Call sqlc CreateUser
- Return response

### internal/util/password.go
- HashPassword: bcrypt.GenerateFromPassword
- CheckPassword: bcrypt.CompareHashAndPassword

## 🎯 Summary

✅ HTTP API server với Gin framework
✅ Register endpoint hoạt động đầy đủ
✅ Password được hash an toàn với bcrypt
✅ Validation input tự động với Gin binding
✅ Type-safe database operations với sqlc
✅ Environment variables configuration
✅ Ready for production development!

**🎊 Bạn đã sẵn sàng để test Register API! 🎊**
