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

export const useGetCategories = (
	setCategories: (categories: Category[]) => void,
	setLoading: (loading: boolean) => void,
	setError: (error: string) => void
) => {
	return async (concessionId: number): Promise<GetCategoriesReturn> => {
		try {
			setLoading(true)
			const response = await categoryApi.getCategories(concessionId)

			if (response.success) {
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
