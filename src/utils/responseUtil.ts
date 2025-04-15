import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types/ApiResponse'

export function serveApiResponse<T>(
  success: boolean,
  message: string,
  statusCode: number = success ? 200 : 500,
  data?: T,
  error?: string | Record<string, any>
): NextResponse {
  const response: ApiResponse<T> = { success, message, data, error, statusCode }
  return NextResponse.json(response, { status: statusCode })
}
