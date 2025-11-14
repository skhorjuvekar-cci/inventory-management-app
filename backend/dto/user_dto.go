package dto

// SignupRequest represents the request payload for user signup
type SignupRequest struct {
	FirstName string `json:"first_name" validate:"required,min=2,max=50"`
	LastName  string `json:"last_name" validate:"omitempty,min=1,max=50"`
	Email     string `json:"email" validate:"required,email,max=100"`
	Password  string `json:"password" validate:"required,min=8,max=64,password"`
}

// SignupResponse represents the response payload for user signup
type SignupResponse struct {
	Data    interface{} `json:"data,omitempty"`
	Success bool        `json:"success"`
	Message string      `json:"message"`
}

// SignInRequest represents the request payload for user signin
type SignInRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=64"`
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

type AdminCreateUserRequest struct {
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Password  string `json:"password" validate:"required,min=8"`
	Role      string `json:"role" validate:"required"`
}

type AdminUpdateUserRequest struct {
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Email     string `json:"email,omitempty"`
	Role      string `json:"role,omitempty"`
	IsActive  *bool  `json:"is_active,omitempty"`
}

type AdminUserResponse struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	IsActive  bool   `json:"is_active"`
}
