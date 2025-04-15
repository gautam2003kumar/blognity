import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { usernameValidation } from '@/schemas/signUpSchema'
import { serveApiResponse } from '@/utils/responseUtil'
import { z } from 'zod'

const UsernameQuerySchema = z.object({
  username: usernameValidation,
})

export async function GET(request: Request) {
  await dbConnect()

  try {
    const { searchParams } = new URL(request.url)

    const queryParam = {
      username: searchParams.get('username'),
    }

    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam)
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []

      return serveApiResponse(
        false,
        `${usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'}`,
        400
      )
    }

    const { username } = result.data

    const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

    if (existingVerifiedUser) {
      return serveApiResponse(false, 'Username is already taken. Please try another one.', 400)
    }

    return serveApiResponse(true, 'Great choice! This username is available.', 200)
  } catch (error) {
    console.error('Error checking username', error)
    return serveApiResponse(false, 'Error while checking username', 500)
  }
}
