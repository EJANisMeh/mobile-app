/**
 * Global App Provider
 * Single context that houses all other contexts
 * NO nested providers - everything in one place
 */
import React, { createContext, useContext, ReactNode } from 'react'
import {
	useThemeBackend,
	useAuthBackend,
	useConcessionBackend,
} from '../hooks/useBackend'

const GlobalContext = createContext<any>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
	// Instantiate all modules here - using backend hooks directly
	const Contexts = {
		theme: useThemeBackend(),
		auth: useAuthBackend(),
		concession: useConcessionBackend(),
	}

	return (
		<GlobalContext.Provider value={Contexts}>{children}</GlobalContext.Provider>
	)
}

// Custom hooks for each module
export const useThemeContext = () => useContext(GlobalContext).theme
export const useAuthContext = () => useContext(GlobalContext).auth
export const useConcessionContext = () => useContext(GlobalContext).concession
