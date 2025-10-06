/**
 * Backend App State Manager
 *
 * This module contains backend-related functions for managing authentication state
 * when the app goes to background, foreground, or gets terminated.
 *
 * The frontend app state manager (utils/appStateManager.ts) handles React Native
 * AppState events and calls these backend functions when needed.
 *
 * Functions:
 * - clearAuthData: Clear all authentication data from AsyncStorage
 * - validateSessionTimeout: Check if session has expired based on last active timestamp
 * - logSessionEvent: Log session events for analytics/debugging
 */

export { clearAuthData } from './clearAuthData';
export { getStoredAuthToken } from './getStoredAuthToken';
export { updateLastActive } from './updateLastActive';
export { validateSessionTimeout } from './validateSessionTimeout';
export { logSessionEvent } from './logSessionEvent';
