import { useCallback, useEffect, useState } from 'react'
import { menuApi } from '../../services/api'
import type { ConcessionMenuItemListItem, MenuItemsResponse } from '../../types'
import { transformRawMenuItem } from '../../utils/menuItemTransform'

interface ConcessionMenuMeta {
	count: number
	page: number
	limit: number
}

export const useConcessionMenuItems = (
	concessionId: number | null | undefined
) => {
	const [menuItems, setMenuItems] = useState<ConcessionMenuItemListItem[]>([])
	const [meta, setMeta] = useState<ConcessionMenuMeta>({
		count: 0,
		page: 1,
		limit: 0,
	})
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const fetchMenuItems = useCallback(async () => {
		if (typeof concessionId !== 'number' || concessionId <= 0) {
			setMenuItems([])
			setMeta({ count: 0, page: 1, limit: 0 })
			setError('Invalid concession selected.')
			return
		}

		setLoading(true)
		setError(null)

		try {
			const response: MenuItemsResponse = await menuApi.getMenuItems(
				concessionId
			)

			if (!response.success) {
				setMenuItems([])
				setMeta({ count: 0, page: 1, limit: 0 })
				setError(response.error || 'Failed to load menu items.')
				return
			}

			const transformedItems = response.menuItems.map(transformRawMenuItem)
			setMenuItems(transformedItems)
			setMeta({
				count: response.count,
				page: response.page,
				limit: response.limit,
			})
		} catch (err) {
			console.error('useConcessionMenuItems error:', err)
			setMenuItems([])
			setMeta({ count: 0, page: 1, limit: 0 })
			setError(
				err instanceof Error ? err.message : 'Failed to load menu items.'
			)
		} finally {
			setLoading(false)
		}
	}, [concessionId])

	useEffect(() => {
		void fetchMenuItems()
	}, [fetchMenuItems])

	return {
		menuItems,
		loading,
		error,
		meta,
		refetch: fetchMenuItems,
	}
}
