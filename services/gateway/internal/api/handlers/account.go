package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/util"
)

// AccountHandler handles account-related requests
type AccountHandler struct {
	store db.Store
}

// NewAccountHandler creates a new account handler
func NewAccountHandler(store db.Store) *AccountHandler {
	return &AccountHandler{
		store: store,
	}
}

// --- API: Xem danh sách ví (GET /api/v1/accounts) ---

// ListAccounts returns all accounts for the authenticated user
func (h *AccountHandler) ListAccounts(ctx *gin.Context) {
	// 1. Lấy User từ Token (do Middleware gán vào)
	payload := ctx.MustGet("authorization_payload").(*util.Payload)

	// 2. Query DB để lấy UserID từ username
	user, err := h.store.GetUserByUsername(ctx, payload.Username)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	// 3. Lấy danh sách accounts của user
	accounts, err := h.store.GetAccountsByUserID(ctx, util.HashStringToInt32(user.ID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"accounts": accounts,
	})
}

// --- API: Nạp tiền (POST /api/v1/accounts/deposit) ---

// depositRequest represents the request body for deposit
type depositRequest struct {
	Amount   string `json:"amount" binding:"required"`
	Currency string `json:"currency" binding:"required,oneof=USD BTC ETH"`
}

// AddDeposit handles deposit requests
func (h *AccountHandler) AddDeposit(ctx *gin.Context) {
	var req depositRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Lấy UserID từ Token
	payload := ctx.MustGet("authorization_payload").(*util.Payload)
	user, err := h.store.GetUserByUsername(ctx, payload.Username)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	// 2. Gọi Transaction để nạp tiền
	arg := db.DepositTxParams{
		UserID:   user.ID,
		Amount:   req.Amount,
		Currency: req.Currency,
	}

	result, err := h.store.DepositTx(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 3. Trả về kết quả
	ctx.JSON(http.StatusOK, gin.H{
		"message":     "Deposit successful",
		"transaction": result.Transaction,
		"account":     result.Account,
	})
}

// --- API: Xem số dư (GET /api/v1/accounts/:currency) ---

// GetAccountBalance returns the balance for a specific currency
func (h *AccountHandler) GetAccountBalance(ctx *gin.Context) {
	currency := ctx.Param("currency")

	// 1. Lấy UserID từ Token
	payload := ctx.MustGet("authorization_payload").(*util.Payload)
	user, err := h.store.GetUserByUsername(ctx, payload.Username)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	// 2. Lấy account theo currency
	account, err := h.store.GetAccountByUserAndType(ctx, db.GetAccountByUserAndTypeParams{
		UserID:   util.HashStringToInt32(user.ID),
		Currency: currency,
	})
	if err != nil {
		// Nếu chưa có ví, tạo mới với số dư 0
		if err.Error() == "account not found" {
			account, err = h.store.CreateAccount(ctx, db.CreateAccountParams{
				UserID:   util.HashStringToInt32(user.ID),
				Currency: currency,
				Balance:  "0",
			})
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create account"})
				return
			}
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"account": account,
	})
}
