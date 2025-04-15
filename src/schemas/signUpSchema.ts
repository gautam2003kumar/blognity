import { z } from 'zod'

// Username validation using Zod
export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(15, 'Username must be no more than 15 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username should not contain special characters except underscores')

// Signup Schema
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
})
