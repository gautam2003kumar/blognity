export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data?: T
  error?: string | Record<string, any>
  statusCode?: number
}
