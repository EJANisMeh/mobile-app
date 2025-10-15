import {
	ConcessionData,
	UpdateConcessionData,
} from '../../types/concessionTypes'

export interface ConcessionContextType {
	concession: ConcessionData | null
	loading: boolean
	error: string | null
	getConcession: (concessionId: number) => Promise<boolean>
	updateConcession: (
		concessionId: number,
		data: UpdateConcessionData
	) => Promise<boolean>
	toggleConcessionStatus: (concessionId: number) => Promise<boolean>
	refreshConcession: () => Promise<void>
}

export interface ConcessionProviderProps {
	children: React.ReactNode
}
