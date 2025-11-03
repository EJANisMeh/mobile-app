import { useCallback, useEffect, useState } from 'react'
import { menuApi } from '../../services/api'
import type {
	ConcessionMenuItemListItem,
	MenuItemsResponse,
	RawMenuItem,
} from '../../types'

const toNumber = (value: number | string | null | undefined): number => {
	if (typeof value === 'number') {
		return Number.isFinite(value) ? value : 0
	}

	if (typeof value === 'string') {
		const parsed = parseFloat(value)
		return Number.isFinite(parsed) ? parsed : 0
	}

	return 0
}

const transformMenuItem = (item: RawMenuItem): ConcessionMenuItemListItem => {
	const images = Array.isArray(item.images) ? item.images : []
	const fallbackIndex = images.length > 0 ? 0 : -1
	const rawIndex =
		typeof item.display_image_index === 'number'
			? item.display_image_index
			: fallbackIndex
	const safeIndex =
		rawIndex >= 0 && rawIndex < images.length ? rawIndex : fallbackIndex
	const imageToDisplay = safeIndex >= 0 ? images[safeIndex] : null

	const basePrice = toNumber(item.basePrice)
	const priceDisplay = `₱${basePrice.toFixed(2)}`

	return {
		id: item.id,
		name: item.name,
		description: item.description ?? null,
		basePrice,
		availability: Boolean(item.availability),
		images,
		displayImageIndex: safeIndex === -1 ? 0 : safeIndex,
		imageToDisplay,
		priceDisplay,
	}
}

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

			const transformedItems = response.menuItems.map(transformMenuItem)
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
