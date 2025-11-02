/**
 * Menu Backend Hook
 * Communication layer between frontend and backend menu functions
 * Includes category management
 */
import { useState, Dispatch, SetStateAction } from 'react'
import {
	getMenuItems,
	toggleAvailability,
	deleteMenuItem,
	toggleVariationOptionAvailability,
	addMenuItem,
	editMenuItem,
	getMenuItemById,
} from './useBackend_backend/menu'
import {
	useGetCategories,
	useUpdateCategories,
} from './useBackend_backend/category'
import { Category } from '../../types/categoryTypes'

export const useMenuBackend = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [menuItems, setMenuItems] = useState<any[]>([])
	const [categories, setCategories] = useState<Category[]>([])

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
		categories,
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
		toggleVariationOptionAvailability: toggleVariationOptionAvailability(
			setLoading,
			setError,
			safeSetMenuItems as Dispatch<SetStateAction<any[]>>
		),
		addMenuItem: addMenuItem(
			setLoading,
			setError,
			safeSetMenuItems as Dispatch<SetStateAction<any[]>>
		),
		editMenuItem: editMenuItem(
			setLoading,
			setError,
			safeSetMenuItems as Dispatch<SetStateAction<any[]>>
		),
		getMenuItemById: getMenuItemById(setLoading, setError),
		getCategories: useGetCategories(setCategories, setLoading, setError),
		updateCategories: useUpdateCategories(setCategories, setLoading, setError),
	}
}
