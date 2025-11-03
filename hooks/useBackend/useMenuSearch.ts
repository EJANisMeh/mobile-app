import { useCallback, useState } from 'react'
import { menuApi } from '../../services/api'
import type { ConcessionMenuItemListItem, MenuItemsResponse } from '../../types'
import { transformRawMenuItem } from '../../utils/menuItemTransform'

export const useMenuSearch = () => {
	const [results, setResults] = useState<ConcessionMenuItemListItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const search = useCallback(async (query: string) => {
		const trimmed = query.trim()
		if (!trimmed) {
			setResults([])
			setError(null)
			return
		}

		setLoading(true)
		setError(null)

		try {
			const response: MenuItemsResponse = await menuApi.searchMenuItems({
				search: trimmed,
				availableOnly: true,
				limit: 50,
			})

			if (!response.success) {
				setResults([])
				setError(response.error || 'No items found for that search.')
				return
			}

			setResults(response.menuItems.map(transformRawMenuItem))
		} catch (err) {
			console.error('Menu search error:', err)
			setResults([])
			setError(err instanceof Error ? err.message : 'Failed to search menu.')
		} finally {
			setLoading(false)
		}
	}, [])

	const clear = useCallback(() => {
		setResults([])
		setError(null)
	}, [])

	return {
		results,
		loading,
		error,
		search,
		clear,
	}
}
