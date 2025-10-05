import { PrismaClient } from '@prisma/client'

interface InsertOptions {
	table: string
	data: Record<string, any> | Record<string, any>[]
	include?: Record<string, any>
}

interface InsertResult<T = any> {
	success: boolean
	data?: T | T[]
	error?: string
	id?: string | number
}

export async function insertQuery<T = any>(
	prisma: PrismaClient,
	options: InsertOptions
): Promise<InsertResult<T>> {
	try {
		const { table, data, include } = options

		const model = (prisma as any)[table]
		if (!model) {
			return {
				success: false,
				error: `Table '${table}' not found`,
			}
		}

		const queryOptions: any = {
			data,
			...(include && { include }),
		}

		let result

		// Handle batch insert vs single insert
		if (Array.isArray(data)) {
			result = await model.createMany({
				data,
				skipDuplicates: true,
			})
		} else {
			result = await model.create(queryOptions)
		}

		return {
			success: true,
			data: result,
			id: result?.id || result?.count,
		}
	} catch (error) {
		console.error('Insert query error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown database error',
		}
	}
}

// Convenience function for upserting (insert or update)
export async function upsertQuery<T = any>(
	prisma: PrismaClient,
	options: {
		table: string
		where: Record<string, any>
		create: Record<string, any>
		update: Record<string, any>
		include?: Record<string, any>
	}
): Promise<InsertResult<T>> {
	try {
		const { table, where, create, update, include } = options

		const model = (prisma as any)[table]
		if (!model) {
			return {
				success: false,
				error: `Table '${table}' not found`,
			}
		}

		const result = await model.upsert({
			where,
			create,
			update,
			...(include && { include }),
		})

		return {
			success: true,
			data: result,
			id: result?.id,
		}
	} catch (error) {
		console.error('Upsert query error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown database error',
		}
	}
}
