package dto

// SignupRequest represents the request payload for user signup
type SignupRequest struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
}

// SignupResponse represents the response payload for user signup
type SignupResponse struct {
	Data    interface{} `json:"data,omitempty"`
	Success bool        `json:"success"`
	Message string      `json:"message"`
}

// SignInRequest represents the request payload for user signin
type SignInRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// UserUpdateRequest represents the request payload for updating user information
type UserUpdateRequest struct {
	FirstName *string `json:"first_name,omitempty"`
	LastName  *string `json:"last_name,omitempty"`
	Email     *string `json:"email,omitempty"`
	Password  *string `json:"password,omitempty"`
}

// // AccessTokenRequest represents the request payload for getting access token
// type AccessTokenRequest struct {
// 	Username string `form:"username" binding:"required"`
// 	Password string `form:"password" binding:"required"`
// }

// SignInData represents the data returned after successful signin
type SignInData struct {
	Token        string `json:"token"`
	Expiration   string `json:"expiration"`
	RefreshToken string `json:"refreshToken"`
}
