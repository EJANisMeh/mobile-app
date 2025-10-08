/**
 * Authentication Backend Module
 *
 * This file exports the useAuthBackend hook that provides all authentication functions.
 * Used by AuthContext to handle authentication logic without implementing it directly.
 */

import { useState } from 'react'
import { AuthBackendType, UserData } from '../../types/'
import { authApi } from '../../services/api'
import { getStoredUser, storeUser, clearStoredUser } from './user'
import { getStoredAuthToken } from './authToken/getStoredAuthToken'
import { storeAuthToken } from './authToken/storeAuthToken'
import { clearAuthData } from './authData/clearAuthData'


