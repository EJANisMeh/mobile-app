import { LoginCredentials, AuthResponse } from '../../types/auth'

// This will be a mobile-compatible function that calls your backend API
// For now, it's a mock implementation that you'll replace with actual API calls
export const loginUser = async (
	credentials: LoginCredentials
): Promise<AuthResponse> => {
	try {
		const { email, password } = credentials

		// TODO: Replace this with actual API call to your backend server
		// Example: const response = await fetch('http://your-backend.com/api/auth/login', {...})

		// Mock validation for development
		if (!email || !password) {
			return {
				success: false,
				error: 'Email and password are required',
			}
		}

		// Mock successful login for development (remove this when you have a real backend)
		// Customer test account
		if (email === 'test@example.com' && password === 'password123') {
			const mockUser = {
				id: 1,
				role: 'CUSTOMER',
				fname: 'John',
				lname: 'Doe',
				email: 'test@example.com',
				new_login: false,
				emailVerified: true,
				contact_details: [],
				image_url: undefined,
				concession_id: undefined,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const mockToken = 'mock-jwt-token-customer-123'

			return {
				success: true,
				user: mockUser,
				token: mockToken,
				message: 'Customer login successful',
			}
		}

		// Concessionaire test account
		if (email === 'concessionaire@example.com' && password === 'password123') {
			const mockUser = {
				id: 2,
				role: 'CONCESSION_OWNER',
				fname: 'Jane',
				lname: 'Smith',
				email: 'concessionaire@example.com',
				new_login: false,
				emailVerified: true,
				contact_details: [],
				image_url: undefined,
				concession_id: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const mockToken = 'mock-jwt-token-concessionaire-123'

			return {
				success: true,
				user: mockUser,
				token: mockToken,
				message: 'Concessionaire login successful',
			}
		}

		return {
			success: false,
			error: 'Invalid email or password',
		}
	} catch (error) {
		console.error('Login error:', error)
		return {
			success: false,
			error: 'Login failed. Please try again.',
		}
	}
}
