# Mobile App Architecture

## Overview

This document explains the separation of concerns in our React Native + Express backend architecture.

## Key Principles

### 1. **Backend Modules Handle Business Logic**

- All authentication logic is in `backend/auth/*`
- All database queries use modularized functions from `backend/db/*`
- Validation, password hashing, JWT generation happens in backend
- Backend modules are **server-side only** (Express endpoints)

### 2. **Frontend Services are HTTP Clients Only**

- `services/api.ts` makes HTTP requests to backend
- **No business logic** in API services
- **No validation** in API services
- **No direct database access** from frontend

### 3. **Context Providers Manage UI State**

- `context/AuthContext.tsx` manages authentication UI state
- Calls backend through `services/api.ts`
- Handles React state updates (loading, errors, user data)
- Uses helper functions from `backend/user/getStoredUser.ts` for AsyncStorage

### 4. **Backend/User Module for Storage Utilities**

- `backend/user/getStoredUser.ts` contains AsyncStorage helpers
- These are **frontend utilities** (not server endpoints)
- Used by contexts to cache data locally
- Functions: `storeAuthData`, `clearAuthData`, `getStoredUser`, etc.

## Architecture Flow

### Authentication Flow Example:

```
User enters credentials
       ↓
LoginScreen calls useAuth().login()
       ↓
AuthContext.login() calls authApi.login()
       ↓
services/api.ts makes HTTP POST to /auth/login
       ↓
Backend endpoint (backend/auth/login.ts) receives request
       ↓
Backend uses selectOne from backend/db to find user
       ↓
Backend verifies password with bcrypt
       ↓
Backend checks emailVerified status
       ↓
Backend checks new_login status
       ↓
Backend generates JWT token
       ↓
Backend returns { success, user, token, needsEmailVerification?, needsProfileCreation? }
       ↓
services/api.ts returns response to AuthContext
       ↓
AuthContext calls storeAuthData() to cache locally
       ↓
AuthContext updates UI state with user data
       ↓
RootNavigator sees user is authenticated
       ↓
Shows appropriate stack (Customer/Concessionaire)
```

## File Responsibilities

### Backend Modules (Server-side)

- `backend/auth/login.ts` - Login business logic
- `backend/auth/register.ts` - Registration business logic
- `backend/auth/checkAuthStatus.ts` - JWT verification
- `backend/auth/logout.ts` - Logout endpoint
- `backend/auth/changePassword.ts` - Password change logic
- `backend/auth/resetPassword.ts` - Password reset logic
- `backend/auth/emailVerify.ts` - Email verification logic
- `backend/db/selectQuery.ts` - SELECT queries abstraction
- `backend/db/insertQuery.ts` - INSERT queries abstraction
- `backend/db/updateQuery.ts` - UPDATE queries abstraction
- `backend/db/deleteQuery.ts` - DELETE queries abstraction

### Frontend Services (HTTP Client)

- `services/api.ts` - Pure HTTP client
  - `authApi` - Authentication endpoints
  - `userApi` - User profile endpoints
  - `debugApi` - Development/testing endpoints

### Frontend Utilities (AsyncStorage Helpers)

- `backend/user/getStoredUser.ts` - Local storage utilities
  - `storeAuthData()` - Save token + user
  - `clearAuthData()` - Clear all auth data
  - `getStoredUser()` - Get cached user
  - `getStoredToken()` - Get cached token

### UI State Management (React Context)

- `context/AuthContext.tsx` - Authentication UI state
  - Calls backend through `authApi`
  - Manages loading/error states
  - Initializes app state manager
  - Stores data with `storeAuthData()`

### Navigation

- `navigation/RootNavigator.tsx` - Route based on auth state
- `navigation/AuthStack.tsx` - Login/Register screens
- `navigation/CustomerStack.tsx` - Customer screens
- `navigation/ConcessionaireStack.tsx` - Concessionaire screens

## Data Flow Rules

### ✅ Correct Pattern

```typescript
// Context calls API
const response = await authApi.login(credentials)

// API makes HTTP request
return await apiCall('/auth/login', {
	method: 'POST',
	body: JSON.stringify(credentials),
})

// Backend endpoint handles business logic
// Uses backend/db functions for database queries
const user = await selectOne(prisma, { table: 'user', where: { email } })
```

### ❌ Incorrect Pattern

```typescript
// DON'T: API service implementing business logic
export const login = async (credentials) => {
	// Validation here - WRONG! Belongs in backend
	if (!credentials.email) return { error: 'Email required' }

	// Database query here - WRONG! Belongs in backend
	const user = await prisma.user.findFirst({ where: { email } })

	// Password verification here - WRONG! Belongs in backend
	const valid = await bcrypt.compare(password, user.passwordHash)
}
```

## Future Context Patterns

When creating new contexts, follow this pattern:

### MenuContext Example:

```typescript
// context/MenuContext.tsx
import { menuApi } from '../services/api'
import { storeMenuData, getStoredMenu } from '../backend/menu/menuStorage'

const MenuContext = () => {
	const addMenuItem = async (data) => {
		// Call backend through API
		const response = await menuApi.addItem(data)

		// Cache locally if needed
		if (response.success) {
			await storeMenuData(response.data)
		}

		// Update UI state
		dispatch({ type: 'ADD_ITEM', payload: response.data })
	}
}
```

### Backend Structure:

```
backend/menu/
├── addItem.ts        // Backend logic using insertQuery
├── editItem.ts       // Backend logic using updateQuery
├── deleteItem.ts     // Backend logic using deleteQuery
├── searchItem.ts     // Backend logic using selectQuery
└── menuRouter.ts     // Express router
```

## Summary

- **Backend** = Business logic + Database queries
- **Services** = HTTP client only
- **Context** = UI state + API calls
- **Storage Helpers** = AsyncStorage utilities (in backend/user or backend/[module])

This separation ensures:

- ✅ Clean code organization
- ✅ Easy testing
- ✅ Reusable business logic
- ✅ Clear responsibilities
- ✅ Maintainable codebase
