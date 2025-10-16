/**
 * User Data API Endpoints
 * Note: User storage in AsyncStorage is handled by backend/user/getStoredUser.ts
 * These are HTTP endpoints if needed for server-side user operations
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthApiResponse, UserData } from '../../types'
import { apiCall } from './api'

export const userApi = {
  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<UserData>): Promise<AuthApiResponse> => {
    const token = await AsyncStorage.getItem('authToken')

    return await apiCall('/user/update-profile', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    })
  },

  /**
   * Get user profile
   */
  getProfile: async (userId: number): Promise<AuthApiResponse> => {
    const token = await AsyncStorage.getItem('authToken')

    return await apiCall(`/user/profile/${userId}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  },
}