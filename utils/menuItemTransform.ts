import type { ConcessionMenuItemListItem, RawMenuItem } from '../types'
import { normalizeMenuItemSchedule } from './menuItemSchedule'

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

const getDisplayImage = (
	images: string[] | null | undefined,
	displayIndex: number | null | undefined
): { imageToDisplay: string | null; displayImageIndex: number } => {
	const validImages = Array.isArray(images) ? images.filter(Boolean) : []

	if (validImages.length === 0) {
		return { imageToDisplay: null, displayImageIndex: 0 }
	}

	const fallbackIndex = 0
	const rawIndex =
		typeof displayIndex === 'number' && displayIndex >= 0
			? displayIndex
			: fallbackIndex
	const safeIndex = rawIndex < validImages.length ? rawIndex : fallbackIndex

	return {
		imageToDisplay: validImages[safeIndex],
		displayImageIndex: safeIndex,
	}
}

export const transformRawMenuItem = (
	raw: RawMenuItem
): ConcessionMenuItemListItem => {
	const basePrice = toNumber(raw.basePrice)
	const { imageToDisplay, displayImageIndex } = getDisplayImage(
		raw.images,
		raw.display_image_index
	)
	const linkedCategory =
		raw.menu_item_category_links?.find((link) => link?.category != null)
			?.category ?? null
	const resolvedCategory = raw.category ?? linkedCategory ?? null

	return {
		id: raw.id,
		name: raw.name,
		description: raw.description ?? null,
		basePrice,
		availability: Boolean(raw.availability),
		images: Array.isArray(raw.images) ? raw.images.filter(Boolean) : [],
		displayImageIndex,
		imageToDisplay,
		priceDisplay: `₱${basePrice.toFixed(2)}`,
		category: resolvedCategory,
		availabilitySchedule: normalizeMenuItemSchedule(
			raw.availability_schedule ?? undefined
		),
	}
}
