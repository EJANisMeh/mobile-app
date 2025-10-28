import { useState } from 'react'
import { Category } from '../../types/categoryTypes'
import {
	useGetCategories,
	useUpdateCategories,
} from './useBackend_backend/category'

export const useCategoryBackend = () => {
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const getCategories = useGetCategories(setCategories, setLoading, setError)
	const updateCategories = useUpdateCategories(
		setCategories,
		setLoading,
		setError
	)

	return {
		categories,
		loading,
		error,
		getCategories,
		updateCategories,
	}
}
