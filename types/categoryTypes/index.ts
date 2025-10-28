/**
 * Category Type Definitions
 */

export interface Category {
	id: number
	concession_id: number
	name: string
	position: number
	created_at: Date
	updated_at: Date
}

export interface CategoryInput {
	name: string
	position?: number
}

export interface UpdateCategoryInput {
	id?: number
	name: string
	position?: number
}
