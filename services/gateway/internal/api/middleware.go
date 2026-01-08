package api

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/trading-platform/gateway/internal/util"
)

const (
	authorizationHeaderKey  = "authorization"
	authorizationTypeBearer = "bearer"
	authorizationPayloadKey = "authorization_payload"
)

// AuthMiddleware tạo ra một lớp bảo vệ cho các route cần đăng nhập
func authMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// 1. Lấy header Authorization
		authorizationHeader := ctx.GetHeader(authorizationHeaderKey)
		if len(authorizationHeader) == 0 {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authorization header is not provided"})
			return
		}

		// 2. Tách chuỗi "Bearer <token>"
		fields := strings.Fields(authorizationHeader)
		if len(fields) < 2 {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header format"})
			return
		}

		authorizationType := strings.ToLower(fields[0])
		if authorizationType != authorizationTypeBearer {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unsupported authorization type"})
			return
		}

		accessToken := fields[1]

		// 3. Verify Token
		payload, err := util.VerifyToken(accessToken, jwtSecret)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid access token"})
			return
		}

		// 4. Lưu thông tin user vào Context để các handler phía sau dùng
		ctx.Set(authorizationPayloadKey, payload)

		// Cho phép đi tiếp
		ctx.Next()
	}
}
