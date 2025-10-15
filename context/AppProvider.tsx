/**
 * Global App Provider
 * Single context that houses all other contexts
 * NO nested providers - everything in one place
 */
import React, { createContext, useContext, ReactNode } from 'react'
import { useThemeBackend } from '../hooks/useBackend'
import { useAuth as useAuthHook } from '../hooks/useAuth'
import { useConcession as useConcessionHook } from '../hooks/useConcession'

const GlobalContext = createContext<any>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
	// Instantiate all modules here
	const Contexts = {
		theme: useThemeBackend(),
		auth: useAuthHook(),
		concession: useConcessionHook(),
	}

	return (
		<GlobalContext.Provider value={Contexts}>{children}</GlobalContext.Provider>
	)
}

// Custom hooks for each module
export const useTheme = () => useContext(GlobalContext).theme
export const useAuth = () => useContext(GlobalContext).auth
export const useConcession = () => useContext(GlobalContext).concession
