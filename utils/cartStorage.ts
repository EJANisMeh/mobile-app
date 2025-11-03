import AsyncStorage from '@react-native-async-storage/async-storage'
import type { CartItem, CartItemInput } from '../types'

const CART_STORAGE_PREFIX = '@scafoma/cart'

const buildStorageKey = (userId: number): string =>
	`${CART_STORAGE_PREFIX}:${userId}`

const roundCurrency = (value: number): number =>
	Number.isFinite(value) ? Number(value.toFixed(2)) : 0

const toNumber = (value: unknown, fallback = 0): number => {
	if (typeof value === 'number') {
		return Number.isFinite(value) ? value : fallback
	}

	if (typeof value === 'string') {
		const parsed = parseFloat(value)
		return Number.isFinite(parsed) ? parsed : fallback
	}

	return fallback
}

const toPositiveInteger = (value: unknown, fallback = 1): number => {
	const numeric = Math.trunc(toNumber(value, fallback))
	return numeric > 0 ? numeric : fallback
}

const asArray = <T>(value: unknown): T[] =>
	Array.isArray(value) ? (value as T[]) : []

const sanitizeStoredCartItem = (entry: unknown): CartItem | null => {
	if (!entry || typeof entry !== 'object') {
		return null
	}

	const record = entry as Record<string, unknown>
	const userId = toNumber(record.userId, Number.NaN)
	const menuItemId = toNumber(record.menuItemId, Number.NaN)
	const concessionId = toNumber(record.concessionId, Number.NaN)

	if (!Number.isFinite(userId) || !Number.isFinite(menuItemId)) {
		return null
	}

	const id =
		typeof record.id === 'string'
			? record.id
			: `${menuItemId}-${Date.now()}-${Math.random().toString(16).slice(2)}`
	const quantity = toPositiveInteger(record.quantity, 1)
	const unitPrice = roundCurrency(toNumber(record.unitPrice, 0))
	const totalPrice = roundCurrency(
		record.totalPrice !== undefined
			? toNumber(record.totalPrice, unitPrice * quantity)
			: unitPrice * quantity
	)

	return {
		id,
		userId: Number(userId),
		menuItemId: Number(menuItemId),
		concessionId: Number(concessionId),
		concessionName:
			typeof record.concessionName === 'string' ? record.concessionName : null,
		name:
			typeof record.name === 'string' && record.name.trim().length > 0
				? record.name
				: 'Menu Item',
		description:
			typeof record.description === 'string' ? record.description : null,
		image: typeof record.image === 'string' ? record.image : null,
		categoryName:
			typeof record.categoryName === 'string' ? record.categoryName : null,
		quantity,
		unitPrice,
		totalPrice,
		variationGroups: asArray(record.variationGroups),
		variationOptions: asArray(record.variationOptions),
		addons: asArray(record.addons),
		addedAt:
			typeof record.addedAt === 'string'
				? record.addedAt
				: new Date().toISOString(),
	}
}

const parseStoredItems = async (userId: number): Promise<CartItem[]> => {
	const storageKey = buildStorageKey(userId)
	const raw = await AsyncStorage.getItem(storageKey)

	if (!raw) {
		return []
	}

	try {
		const parsed = JSON.parse(raw)
		if (!Array.isArray(parsed)) {
			return []
		}

		return parsed
			.map(sanitizeStoredCartItem)
			.filter((item): item is CartItem => item !== null)
	} catch (error) {
		console.error('cartStorage: failed to parse stored cart', error)
		return []
	}
}

const persistItems = async (
	userId: number,
	items: CartItem[]
): Promise<void> => {
	const storageKey = buildStorageKey(userId)
	await AsyncStorage.setItem(storageKey, JSON.stringify(items))
}

const createCartItem = (userId: number, input: CartItemInput): CartItem => {
	const quantity = toPositiveInteger(input.quantity, 1)
	const unitPrice = roundCurrency(toNumber(input.unitPrice, 0))
	const totalPrice = roundCurrency(unitPrice * quantity)

	return {
		id: `${input.menuItemId}-${Date.now()}-${Math.random()
			.toString(16)
			.slice(2)}`,
		userId,
		menuItemId: input.menuItemId,
		concessionId: input.concessionId,
		concessionName: input.concessionName,
		name: input.name.trim().length > 0 ? input.name : 'Menu Item',
		description: input.description,
		image: input.image,
		categoryName: input.categoryName,
		quantity,
		unitPrice,
		totalPrice,
		variationGroups: input.variationGroups,
		variationOptions: input.variationOptions,
		addons: input.addons,
		addedAt: new Date().toISOString(),
	}
}

export const loadCartItemsForUser = async (
	userId: number
): Promise<CartItem[]> => {
	if (!Number.isFinite(userId) || userId <= 0) {
		return []
	}

	return await parseStoredItems(userId)
}

export const appendCartItemForUser = async (
	userId: number,
	item: CartItemInput
): Promise<CartItem[]> => {
	const existingItems = await loadCartItemsForUser(userId)
	const newItem = createCartItem(userId, item)
	const nextItems = [...existingItems, newItem]
	await persistItems(userId, nextItems)
	return nextItems
}

export const overwriteCartItemsForUser = async (
	userId: number,
	items: CartItem[]
): Promise<void> => {
	await persistItems(userId, items)
}

export const clearCartItemsForUser = async (userId: number): Promise<void> => {
	const storageKey = buildStorageKey(userId)
	await AsyncStorage.removeItem(storageKey)
}
