/**
 * Menu Backend Hook
 * Communication layer between frontend and backend menu functions
 */
import { useState, Dispatch, SetStateAction } from 'react'
import {
	getMenuItems,
	toggleAvailability,
	deleteMenuItem,
} from './useBackend_backend/menu'

export const useMenuBackend = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [menuItems, setMenuItems] = useState<any[]>([])

	// Type-safe setter that accepts both value and callback
	const safeSetMenuItems = (value: any[] | ((prev: any[]) => any[])) => {
		if (typeof value === 'function') {
			setMenuItems(value)
		} else {
			setMenuItems(value)
		}
	}

	return {
		loading,
		error,
		menuItems,
		getMenuItems: getMenuItems(
			setLoading,
			setError,
			safeSetMenuItems as Dispatch<SetStateAction<any[]>>
		),
		toggleAvailability: toggleAvailability(
			setLoading,
			setError,
			safeSetMenuItems as Dispatch<SetStateAction<any[]>>
		),
		deleteMenuItem: deleteMenuItem(
			setLoading,
			setError,
			safeSetMenuItems as Dispatch<SetStateAction<any[]>>
		),
	}
}
