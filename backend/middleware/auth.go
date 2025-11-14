package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
)

type contextKey string

const (
	ContextUserIDKey   contextKey = "user_id"
	ContextUsernameKey contextKey = "username"
	ContextUserRoleKey contextKey = "role"
)

// AuthMiddleware validates JWT tokens for net/http handlers (works with mux)
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		var tokenString string
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			tokenString = authHeader
		}

		if tokenString == "" {
			http.Error(w, "Token required", http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(tokenString, func(parsedToken *jwt.Token) (interface{}, error) {
			if _, ok := parsedToken.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			secretKey := os.Getenv("SECRET_KEY")
			if secretKey == "" {
				secretKey = "default-secret-key"
			}
			return []byte(secretKey), nil
		})

		if err != nil {
			http.Error(w, "Invalid token: "+err.Error(), http.StatusUnauthorized)
			return
		}

		if !token.Valid {
			http.Error(w, "Token is not valid", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		userID, ok := claims["id"].(string)
		if !ok || userID == "" {
			http.Error(w, "Invalid user ID in token", http.StatusUnauthorized)
			return
		}

		username, ok := claims["sub"].(string)
		if !ok || username == "" {
			http.Error(w, "Invalid username in token", http.StatusUnauthorized)
			return
		}

		role, ok := claims["role"].(string)
		if !ok || role == "" {
			http.Error(w, "Invalid role in token", http.StatusUnauthorized)
			return
		}

		if expFloat, ok := claims["exp"].(float64); ok {
			if time.Now().Unix() > int64(expFloat) {
				http.Error(w, "Token has expired", http.StatusUnauthorized)
				return
			}
		}

		ctxWithUser := context.WithValue(r.Context(), ContextUserIDKey, userID)
		ctxWithUser = context.WithValue(ctxWithUser, ContextUsernameKey, username)
		ctxWithUser = context.WithValue(ctxWithUser, ContextUserRoleKey, role)
		next.ServeHTTP(w, r.WithContext(ctxWithUser))
	})
}

func RoleMiddleware(allowedRoles ...string) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			role, ok := r.Context().Value(ContextUserRoleKey).(string)
			if !ok || role == "" {
				http.Error(w, "Role not found in token", http.StatusForbidden)
				return
			}

			for _, allowed := range allowedRoles {
				if role == allowed {
					next.ServeHTTP(w, r)
					return
				}
			}

			http.Error(w, "Forbidden: insufficient permissions", http.StatusForbidden)
		})
	}
}
