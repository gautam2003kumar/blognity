import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/VerificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  if (!email || !username || !verifyCode) {
    return { success: false, message: 'Missing required parameters' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Blognity <support@uchchshiksha.in>',
      to: email,
      subject: 'Blog-web | Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    })

    if (data) {
      console.log('Email sent successfully:', data)
    } else {
      console.log('Email not sent:', data)
    }

    if (error) {
      console.error('Error sending email:', error)
      throw new Error(error.message || 'Unknown error occurred')
    }
    
    return { success: true, message: 'Verification email sent successfully' }
  } catch (emailError) {
    console.error('Error sending verification email:', emailError)
    return {
      success: false,
      message: `Failed to send verification email: ${(emailError as Error).message}`,
    }
  }
}
