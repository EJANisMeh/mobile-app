import { UserData } from '../userTypes'
import { ConcessionData } from '../concessionTypes'

// Type for API responses
export interface ConcessionApiResponse<T = any> {
	success: boolean
	data?: T
	message?: string
	error?: string
	concessionId?: number
	concession_data?: ConcessionData
}
