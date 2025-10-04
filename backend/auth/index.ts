// Auth backend index - exports all auth functions
export { loginUser } from './login'
export { registerUser } from './register'
export { logoutUser } from './logout'
export { resetPassword } from './resetPassword'
export { verifyEmail } from './emailVerify'

// Auth context handler functions
export { checkAuthStatus } from './checkAuthStatus'
export { handleLogin } from './handleLogin'
export { handleRegister } from './handleRegister'
export { handleLogout } from './handleLogout'

// Debug functions (for development/testing)
export {
	clearAuthData,
	logStoredAuthData,
	simulateAppTermination,
} from './clearAuthData'

// App state management
export { appStateManager } from './appStateManager'
