package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/util"
)

type BalanceHandler struct {
	store db.Store
}

func NewBalanceHandler(store db.Store) *BalanceHandler {
	return &BalanceHandler{store: store}
}

type BalanceResponse struct {
	Currency  string `json:"currency"`
	Available string `json:"available"`
	Locked    string `json:"locked"`
}

// ListBalance returns all account balances for the authenticated user
func (h *BalanceHandler) ListBalance(ctx *gin.Context) {
	// Get user from JWT token (for now, hardcode to 1 like in order handler)
	_ = ctx.MustGet("authorization_payload").(*util.Payload)
	userID := int64(1) // Hardcoded for now, will use actual user ID later

	// Get all accounts for this user
	accounts, err := h.store.GetAccountsByUserID(ctx, int32(userID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch accounts"})
		return
	}

	var response []BalanceResponse
	
	// For each account (currency), calculate locked amount
	for _, account := range accounts {
		// Get locked amount from pending orders for this currency
		// Assuming trading pair is always BTC/USDT
		symbol := "BTC/USDT"
		lockedAmount, err := h.store.GetLockedAmountByUserAndCurrency(ctx, db.GetLockedAmountParams{
			UserID:   userID,
			Currency: account.Currency,
			Symbol:   symbol,
		})
		if err != nil {
			// If error, assume 0 locked
			lockedAmount = "0"
		}

		response = append(response, BalanceResponse{
			Currency:  account.Currency,
			Available: account.Balance,
			Locked:    lockedAmount,
		})
	}

	ctx.JSON(http.StatusOK, response)
}
