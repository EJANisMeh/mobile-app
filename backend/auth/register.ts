import { RegisterData, AuthResponse } from '../../types/auth'

// This will be a mobile-compatible function that calls your backend API
// For now, it's a mock implementation that you'll replace with actual API calls
export const registerUser = async (
	data: RegisterData
): Promise<AuthResponse> => {
	try {
		const { fname, lname, email, password, confirmPassword, role } = data

		// Validate passwords match
		if (password !== confirmPassword) {
			return {
				success: false,
				error: 'Passwords do not match',
			}
		}

		// Basic validation
		if (!fname || !lname || !email || !password) {
			return {
				success: false,
				error: 'All fields are required',
			}
		}

		if (password.length < 6) {
			return {
				success: false,
				error: 'Password must be at least 6 characters',
			}
		}

		// TODO: Replace this with actual API call to your backend server
		// Example: const response = await fetch('http://your-backend.com/api/auth/register', {...})

		// Mock registration for development (remove this when you have a real backend)
		const mockUser = {
			id: Math.floor(Math.random() * 1000),
			role,
			fname,
			lname,
			email,
			new_login: true,
			emailVerified: false,
			contact_details: [],
			image_url: undefined,
			concession_id: undefined,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		return {
			success: true,
			user: mockUser,
			message: 'Registration successful',
		}
	} catch (error) {
		console.error('Registration error:', error)
		return {
			success: false,
			error: 'Registration failed. Please try again.',
		}
	}
}
