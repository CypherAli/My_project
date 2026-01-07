# SQLC Setup Guide

## Tổng quan
sqlc đã được cấu hình thành công để tự động sinh code Go từ SQL queries.

## Cấu trúc
- `sqlc.yaml` - File cấu hình sqlc
- `query.sql` - Các SQL queries được định nghĩa
- `internal/database/sqlc/` - Thư mục chứa code Go được sinh tự động

## Generated Files
sqlc đã tạo các file sau trong `internal/database/sqlc/`:
- `models.go` - Struct definitions cho tất cả database tables
- `query.sql.go` - Functions để execute queries đã định nghĩa
- `querier.go` - Interface cho database operations
- `db.go` - Database connection wrapper

## Cách sử dụng

### 1. Thêm Query mới
Thêm query vào `query.sql`:
```sql
-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1 LIMIT 1;
```

### 2. Re-generate code
```bash
# Sử dụng Docker
docker run --rm -v "${PWD}:/src" -w /src sqlc/sqlc generate

# Hoặc nếu đã cài sqlc locally
sqlc generate
```

### 3. Sử dụng trong code
```go
import "github.com/trading-platform/gateway/internal/database/sqlc"

// Initialize
queries := db.New(dbConnection)

// Use generated functions
user, err := queries.CreateUser(ctx, db.CreateUserParams{
    Username:     "john_doe",
    Email:        "john@example.com",
    PasswordHash: hashedPassword,
    FirstName:    sql.NullString{String: "John", Valid: true},
    LastName:     sql.NullString{String: "Doe", Valid: true},
})

// Get user by email
user, err := queries.GetUserByEmail(ctx, "john@example.com")
```

## Available Queries

### User Operations
- `CreateUser` - Tạo user mới
- `GetUserByEmail` - Lấy user theo email
- `GetUserByID` - Lấy user theo ID
- `GetUserByUsername` - Lấy user theo username
- `UpdateUserVerification` - Cập nhật verification status

### Account Operations
- `CreateAccount` - Tạo tài khoản trading mới
- `GetAccountByUserAndType` - Lấy account theo user và type
- `GetAccountsByUserID` - Lấy tất cả accounts của user
- `UpdateAccountBalance` - Cập nhật số dư tài khoản

### Transaction Operations
- `CreateDeposit` - Tạo transaction deposit
- `GetTransactionByID` - Lấy transaction theo ID
- `GetTransactionsByAccountID` - Lấy transactions của account
- `UpdateTransactionStatus` - Cập nhật trạng thái transaction

## Next Steps
Bây giờ bạn đã có:
✅ Go module được khởi tạo
✅ sqlc được cấu hình
✅ Database models và queries được generate

Bước tiếp theo:
1. Implement API Register endpoint
2. Implement API Deposit endpoint
3. Add authentication middleware
4. Add validation logic
