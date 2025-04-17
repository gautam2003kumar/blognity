'use client'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema } from '@/schemas/otpSchema'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { ApiResponse } from '@/types/ApiResponse'
import { motion } from 'framer-motion'

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  })

  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let countdown: NodeJS.Timeout
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(prev => prev - 1), 1000)
    } else {
      setCanResend(true)
    }
    return () => clearTimeout(countdown)
  }, [timer])

  const resendOtp = async () => {
    try {
      const response = await axios.post('/api/auth/resend-code', {
        username: params.username,
      })
      toast.success('OTP Resent', {
        description: response.data.message || 'A new verification code has been sent.',
      })
      setTimer(60)
      setCanResend(false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Failed to resend OTP', {
        description:
          axiosError.response?.data.message || 'An error occurred while resending the OTP.',
      })
    }
  }

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    try {
      const response = await axios.post(`/api/auth/verify-code`, {
        username: params.username,
        code: data.code,
      })

      toast.success('Verified!', {
        description: response.data.message || 'Your email has been successfully verified.',
      })

      router.replace('/home')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response) {
        toast.error('Verification Failed', {
          description: axiosError.response?.data.message || 'Invalid or expired verification code.',
        })
      } else {
        toast.error('Unable to verify', {
          description: 'Network error. Please check your internet connection and try again.',
        })
      }
    }
  }

  return (
<div className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
<motion.div
      className="flex justify-center items-center min-h-screen  px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-md p-8 space-y-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 ">Verify Your Account</h1>
          <p className="text-gray-500 text-sm">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-center block mb-2 text-sm font-medium text-gray-700">
                        Verification Code
                      </FormLabel>

                      <FormControl>
                        <div className="flex justify-center mt-2">
                          <InputOTP
                            maxLength={6}
                            {...field}
                            value={field.value || ''}
                            onChange={field.onChange}
                            className="gap-2"
                          >
                            <InputOTPGroup>
                              {[...Array(6)].map((_, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  className="w-12 h-12 text-lg"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full text-lg">
                Submit
              </Button>
            </form>
          </Form>
        </div>
        <div className="text-center text-sm mt-2">
          {canResend ? (
            <Button variant="link" onClick={resendOtp} className="text-blue-600">
              Resend Code
            </Button>
          ) : (
            <p className="text-gray-400">
              You can resend code in {timer} second{timer !== 1 && 's'}
            </p>
          )}
        </div>
      </div>
    </motion.div>
</div>
  )
}

export default VerifyAccount
