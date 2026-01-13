package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/trading-platform/gateway/internal/config"
	db "github.com/trading-platform/gateway/internal/database/sqlc"
	"github.com/trading-platform/gateway/internal/util"
	"golang.org/x/crypto/bcrypt"
)

// UserHandler handles user-related requests
type UserHandler struct {
	config config.Config
	store  db.Store
}

// NewUserHandler creates a new user handler
func NewUserHandler(cfg config.Config, store db.Store) *UserHandler {
	return &UserHandler{
		config: cfg,
		store:  store,
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

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	// Create user in database
	user, err := h.store.CreateUser(ctx, db.CreateUserParams{
		Username: req.Username,
		Email:    req.Email,
		PasswordHash: string(hashedPassword),
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user: " + err.Error()})
		return
	}

	// Create access token
	accessToken, err := util.CreateToken(req.Username, h.config.JWT.Secret, h.config.JWT.Expiry)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create access token"})
		return
	}

	response := UserResponse{
		Username:    user.Username,
		Email:       user.Email,
		AccessToken: accessToken,
		CreatedAt:   user.CreatedAt,
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

	// Get user from database
	user, err := h.store.GetUserByUsername(ctx, req.Username)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "invalid username or password"})
		return
	}

	// Create access token
	accessToken, err := util.CreateToken(req.Username, h.config.JWT.Secret, h.config.JWT.Expiry)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create access token"})
		return
	}

	response := gin.H{
		"username":     user.Username,
		"email":        user.Email,
		"access_token": accessToken,
	}

	ctx.JSON(http.StatusOK, response)
}
