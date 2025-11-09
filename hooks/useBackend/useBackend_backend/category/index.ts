import { useState } from 'react'
import { categoryApi } from '../../../../services/api/categoryApi'
import { Category, UpdateCategoryInput } from '../../../../types/categoryTypes'

export interface GetCategoriesReturn {
	success: boolean
	categories?: Category[]
	error?: string
}

export interface UpdateCategoriesReturn {
	success: boolean
	categories?: Category[]
	error?: string
}

// Module-level cache that persists across hook calls
let categoriesCache: {
	data: Category[]
	timestamp: number
	concessionId: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Function to invalidate cache
export const invalidateCategoriesCache = () => {
	categoriesCache = null
}

export const useGetCategories = (
	setCategories: (categories: Category[]) => void,
	setLoading: (loading: boolean) => void,
	setError: (error: string) => void
) => {
	return async (
		concessionId: number,
		forceRefresh: boolean = false
	): Promise<GetCategoriesReturn> => {
		try {
			// Check cache validity
			const now = Date.now()
			if (
				!forceRefresh &&
				categoriesCache &&
				categoriesCache.concessionId === concessionId &&
				now - categoriesCache.timestamp < CACHE_DURATION
			) {
				// Return cached data without loading state
				setCategories(categoriesCache.data)
				return { success: true, categories: categoriesCache.data }
			}

			setLoading(true)
			const response = await categoryApi.getCategories(concessionId)

			if (response.success) {
				// Update cache
				categoriesCache = {
					data: response.categories || [],
					timestamp: now,
					concessionId,
				}
				setCategories(response.categories || [])
				setLoading(false)
				return { success: true, categories: response.categories }
			} else {
				setError(response.error || 'Failed to fetch categories')
				setLoading(false)
				return { success: false, error: response.error }
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to fetch categories'
			setError(errorMessage)
			setLoading(false)
			return { success: false, error: errorMessage }
		}
	}
}

export const useUpdateCategories = (
	setCategories: (categories: Category[]) => void,
	setLoading: (loading: boolean) => void,
	setError: (error: string) => void
) => {
	return async (
		concessionId: number,
		categories: UpdateCategoryInput[]
	): Promise<UpdateCategoriesReturn> => {
		try {
			setLoading(true)
			const response = await categoryApi.updateCategories(
				concessionId,
				categories
			)

			if (response.success) {
				// Invalidate cache on update
				invalidateCategoriesCache()
				setCategories(response.categories || [])
				setLoading(false)
				return { success: true, categories: response.categories }
			} else {
				setError(response.error || 'Failed to update categories')
				setLoading(false)
				return { success: false, error: response.error }
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Failed to update categories'
			setError(errorMessage)
			setLoading(false)
			return { success: false, error: errorMessage }
		}
	}
}
