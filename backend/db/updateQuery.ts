import { PrismaClient } from '@prisma/client'

interface UpdateOptions {
	table: string
	where: Record<string, any>
	data: Record<string, any>
	include?: Record<string, any>
}

interface UpdateResult<T = any> {
	success: boolean
	data?: T
	count?: number
	error?: string
}

export async function updateQuery<T = any>(
	prisma: PrismaClient,
	options: UpdateOptions
): Promise<UpdateResult<T>> {
	try {
		const { table, where, data, include } = options

		const model = (prisma as any)[table]
		if (!model) {
			return {
				success: false,
				error: `Table '${table}' not found`,
			}
		}

		const queryOptions: any = {
			where,
			data,
			...(include && { include }),
		}

		const result = await model.update(queryOptions)

		return {
			success: true,
			data: result,
		}
	} catch (error) {
		console.error('Update query error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown database error',
		}
	}
}

// Convenience function for updating multiple records
export async function updateManyQuery(
	prisma: PrismaClient,
	options: {
		table: string
		where: Record<string, any>
		data: Record<string, any>
	}
): Promise<{ success: boolean; count?: number; error?: string }> {
	try {
		const { table, where, data } = options

		const model = (prisma as any)[table]
		if (!model) {
			return {
				success: false,
				error: `Table '${table}' not found`,
			}
		}

		const result = await model.updateMany({
			where,
			data,
		})

		return {
			success: true,
			count: result.count,
		}
	} catch (error) {
		console.error('Update many query error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown database error',
		}
	}
}
