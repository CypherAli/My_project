package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/trading-platform/gateway/internal/config"
	"github.com/trading-platform/gateway/internal/util"
)

// UserHandler handles user-related requests
type UserHandler struct {
	config config.Config
}

// NewUserHandler creates a new user handler
func NewUserHandler(cfg config.Config) *UserHandler {
	return &UserHandler{
		config: cfg,
	}
}

// RegisterUserRequest represents the request body for user registration
type RegisterUserRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginUserRequest represents the request body for user login
type LoginUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// UserResponse represents the response for user operations
type UserResponse struct {
	Username    string    `json:"username"`
	Email       string    `json:"email"`
	AccessToken string    `json:"access_token"`
	CreatedAt   time.Time `json:"created_at"`
}

// RegisterUser handles user registration
func (h *UserHandler) RegisterUser(ctx *gin.Context) {
	var req RegisterUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Implement actual user registration logic with database
	// For now, just return a mock response

	// Create access token
	accessToken, err := util.CreateToken(req.Username, h.config.JWT.Secret, h.config.JWT.Expiry)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create access token"})
		return
	}

	response := UserResponse{
		Username:    req.Username,
		Email:       req.Email,
		AccessToken: accessToken,
		CreatedAt:   time.Now(),
	}

	ctx.JSON(http.StatusOK, response)
}

// LoginUser handles user login
func (h *UserHandler) LoginUser(ctx *gin.Context) {
	var req LoginUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Implement actual user authentication logic with database
	// For now, just create token for any username

	// Create access token
	accessToken, err := util.CreateToken(req.Username, h.config.JWT.Secret, h.config.JWT.Expiry)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create access token"})
		return
	}

	response := gin.H{
		"username":     req.Username,
		"access_token": accessToken,
	}

	ctx.JSON(http.StatusOK, response)
}
