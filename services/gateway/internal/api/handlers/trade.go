package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/util"
)

type TradeHandler struct {
	store db.Store
}

func NewTradeHandler(store db.Store) *TradeHandler {
	return &TradeHandler{
		store: store,
	}
}

// ListUserTrades returns all trades for the authenticated user
func (h *TradeHandler) ListUserTrades(ctx *gin.Context) {
	// Lấy UserID từ Token
	payload := ctx.MustGet("authorization_payload").(*util.Payload)

	// Get user ID from username
	user, err := h.store.GetUserByUsername(ctx, payload.Username)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user"})
		return
	}

	// Lấy danh sách trades (user có thể là Maker hoặc Taker)
	trades, err := h.store.ListUserTrades(ctx, user.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, trades)
}
