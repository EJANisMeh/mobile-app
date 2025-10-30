import { useState, useEffect } from 'react'
import { customerApi } from '../../services/api'
import type { CafeteriasWithMenuResponse } from '../../types'

export const useCustomerMenu = () => {
	const [data, setData] = useState<CafeteriasWithMenuResponse | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchCafeterias()
	}, [])

	const fetchCafeterias = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await customerApi.getCafeteriasWithMenu()
			
			if (!response.success) {
				setError((response as any).error || 'Failed to load menu')
				setData(null)
			} else {
				setData(response)
			}
		} catch (err) {
			console.error('Customer menu fetch error:', err)
			setError(err instanceof Error ? err.message : 'Failed to load menu')
		} finally {
			setLoading(false)
		}
	}

	return {
		data,
		loading,
		error,
		refetch: fetchCafeterias,
	}
}
