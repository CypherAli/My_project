package handlers

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/util"
)

type UserHandler struct {
	store *db.Queries // Sử dụng Queries được sinh ra từ sqlc
}

func NewUserHandler(store *db.Queries) *UserHandler {
	return &UserHandler{store: store}
}

// Struct quy định dữ liệu client gửi lên
type createUserRequest struct {
	Username string `json:"username" binding:"required,alphanum"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// Struct quy định dữ liệu trả về (ẩn password đi)
type userResponse struct {
	Username string         `json:"username"`
	Email    string         `json:"email"`
	UserID   string         `json:"user_id"`
	Account  *accountDetail `json:"default_account,omitempty"`
}

type accountDetail struct {
	AccountID   string `json:"account_id"`
	AccountType string `json:"account_type"`
	Currency    string `json:"currency"`
	Balance     string `json:"balance"`
}

// RegisterUser xử lý đăng ký người dùng mới
func (h *UserHandler) RegisterUser(ctx *gin.Context) {
	var req createUserRequest
	// 1. Validate input
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 2. Hash password
	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process password"})
		return
	}

	// 3. Gọi sqlc để lưu vào DB
	arg := db.CreateUserParams{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hashedPassword,
	}

	user, err := h.store.CreateUser(ctx, arg)
	if err != nil {
		// Xử lý lỗi duplicate key (email/username đã tồn tại)
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code.Name() {
			case "unique_violation":
				if strings.Contains(pqErr.Message, "users_email_key") {
					ctx.JSON(http.StatusConflict, gin.H{"error": "email already exists"})
					return
				}
				if strings.Contains(pqErr.Message, "users_username_key") {
					ctx.JSON(http.StatusConflict, gin.H{"error": "username already exists"})
					return
				}
			}
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	// 4. Tạo spot account mặc định cho user
	accountArg := db.CreateAccountParams{
		UserID:           user.ID,
		AccountType:      "spot",
		Balance:          sql.NullString{String: "0", Valid: true},
		AvailableBalance: sql.NullString{String: "0", Valid: true},
		LockedBalance:    sql.NullString{String: "0", Valid: true},
		Currency:         "USDT",
	}

	account, err := h.store.CreateAccount(ctx, accountArg)
	if err != nil {
		// Log error nhưng vẫn trả về user đã tạo thành công
		ctx.JSON(http.StatusCreated, gin.H{
			"warning": "user created but failed to create default account",
			"user": userResponse{
				Username: user.Username,
				Email:    user.Email,
				UserID:   user.ID.String(),
			},
		})
		return
	}

	// 5. Trả về thành công với đầy đủ thông tin
	rsp := userResponse{
		Username: user.Username,
		Email:    user.Email,
		UserID:   user.ID.String(),
		Account: &accountDetail{
			AccountID:   account.ID.String(),
			AccountType: account.AccountType,
			Currency:    account.Currency,
			Balance:     account.Balance.String,
		},
	}
	ctx.JSON(http.StatusCreated, rsp)
}
