/**
 * Get concession by ID
 */
import { ConcessionData } from '../../../../types'
import { concessionApi } from '../../../../services/api'

export const getConcession = (
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setConcession: (concession: ConcessionData | null) => void
) =>
{
  return async (
    concessionId: number
  ): Promise<{
    success: boolean
    concession?: ConcessionData
    error?: string
  }> =>
  {
    setLoading(true)
    setError(null)

    try
    {
      const response = await concessionApi.getConcession(concessionId)
      console.log('getConcession response:', response)
      if (response.success && response.concession_data)
      {
        const concession = response.concession_data as ConcessionData
        setConcession(concession)

        return {
          success: true,
        }
      }

      setError(response.error || 'Failed to fetch concession')
      return {
        success: false,
        error: response.error || 'Failed to fetch concession',
      }
    } catch (err)
    {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally
    {
      setLoading(false)
    }
  }
}