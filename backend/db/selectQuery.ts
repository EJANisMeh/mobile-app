import { PrismaClient } from '@prisma/client'

interface SelectOptions {
	table: string
	columns?: string[]
	where?: Record<string, any>
	include?: Record<string, any>
	orderBy?: Record<string, 'asc' | 'desc'>
	limit?: number
	offset?: number
}

interface SelectResult<T = any> {
	success: boolean
	data?: T[]
	count?: number
	error?: string
}

export async function selectQuery<T = any>(
	prisma: PrismaClient,
	options: SelectOptions
): Promise<SelectResult<T>> {
	try {
		const {
			table,
			columns,
			where = {},
			include,
			orderBy,
			limit,
			offset,
		} = options

		// Build the query dynamically based on table name
		const model = (prisma as any)[table]
		if (!model) {
			return {
				success: false,
				error: `Table '${table}' not found`,
			}
		}

		// Build query options
		const queryOptions: any = {
			where,
			...(include && { include }),
			...(orderBy && { orderBy }),
			...(limit && { take: limit }),
			...(offset && { skip: offset }),
		}

		// If specific columns are requested, use select
		if (columns && columns.length > 0) {
			const selectObj: Record<string, boolean> = {}
			columns.forEach((col) => (selectObj[col] = true))
			queryOptions.select = selectObj
		}

		const data = await model.findMany(queryOptions)
		const count = await model.count({ where })

		return {
			success: true,
			data,
			count,
		}
	} catch (error) {
		console.error('Select query error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown database error',
		}
	}
}

// Convenience function for finding a single record
export async function selectOne<T = any>(
	prisma: PrismaClient,
	options: Omit<SelectOptions, 'limit' | 'offset'>
): Promise<{ success: boolean; data?: T; error?: string }> {
	try {
		const { table, columns, where = {}, include } = options

		const model = (prisma as any)[table]
		if (!model) {
			return {
				success: false,
				error: `Table '${table}' not found`,
			}
		}

		const queryOptions: any = {
			where,
			...(include && { include }),
		}

		if (columns && columns.length > 0) {
			const selectObj: Record<string, boolean> = {}
			columns.forEach((col) => (selectObj[col] = true))
			queryOptions.select = selectObj
		}

		const data = await model.findFirst(queryOptions)

		return {
			success: true,
			data,
		}
	} catch (error) {
		console.error('Select one query error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown database error',
		}
	}
}
