/**
 * Validates category price adjustment to check if any items will become 0 or negative
 * @param categoryMenuItems Array of menu items from the category
 * @param priceAdjustment Price adjustment value (can be negative)
 * @returns Object with validation result and affected items
 */
export interface CategoryPriceValidationResult {
	hasIssue: boolean
	affectedItems: {
		id: number
		name: string
		originalPrice: number
		adjustedPrice: number
	}[]
	message: string | null
}

export const validateCategoryPriceAdjustment = (
	categoryMenuItems: Array<{
		id: number
		name: string
		basePrice: number | string
	}>,
	priceAdjustment: string | null
): CategoryPriceValidationResult => {
	if (!priceAdjustment || categoryMenuItems.length === 0) {
		return {
			hasIssue: false,
			affectedItems: [],
			message: null,
		}
	}

	const adjustment = parseFloat(priceAdjustment)
	if (isNaN(adjustment) || adjustment >= 0) {
		// No issue if positive or zero
		return {
			hasIssue: false,
			affectedItems: [],
			message: null,
		}
	}

	// Check which items will become 0 or negative (excluding items already at 0)
	const affectedItems = categoryMenuItems
		.map((item) => {
			const originalPrice =
				typeof item.basePrice === 'string'
					? parseFloat(item.basePrice)
					: item.basePrice
			const adjustedPrice = Math.max(0, originalPrice + adjustment)

			return {
				id: item.id,
				name: item.name,
				originalPrice,
				adjustedPrice,
			}
		})
		.filter((item) => {
			// Only flag items that were not already at 0 and will become 0
			return item.originalPrice > 0 && item.adjustedPrice === 0
		})

	if (affectedItems.length === 0) {
		return {
			hasIssue: false,
			affectedItems: [],
			message: null,
		}
	}

	const itemNames = affectedItems.map((item) => item.name).join(', ')
	const message = `The price adjustment of ${priceAdjustment} will make the following item(s) free (₱0): ${itemNames}\n\nIs this intentional?`

	return {
		hasIssue: true,
		affectedItems,
		message,
	}
}
