import { PrismaClient } from '@prisma/client'

interface DeleteOptions {
	table: string
	where: Record<string, any>
	include?: Record<string, any>
}

interface DeleteResult<T = any> {
	success: boolean
	data?: T
	count?: number
	error?: string
}

export async function deleteQuery<T = any>(
	prisma: PrismaClient,
	options: DeleteOptions
): Promise<DeleteResult<T>> {
	try {
		const { table, where, include } = options

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

		const result = await model.delete(queryOptions)

		return {
			success: true,
			data: result,
		}
	} catch (error) {
		console.error('Delete query error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown database error',
		}
	}
}

// Convenience function for deleting multiple records
export async function deleteManyQuery(
	prisma: PrismaClient,
	options: {
		table: string
		where: Record<string, any>
	}
): Promise<{ success: boolean; count?: number; error?: string }> {
	try {
		const { table, where } = options

		const model = (prisma as any)[table]
		if (!model) {
			return {
				success: false,
				error: `Table '${table}' not found`,
			}
		}

		const result = await model.deleteMany({
			where,
		})

		return {
			success: true,
			count: result.count,
		}
	} catch (error) {
		console.error('Delete many query error:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown database error',
		}
	}
}
