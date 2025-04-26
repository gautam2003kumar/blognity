'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUpSchema } from '@/schemas/signUpSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useDebounceCallback } from 'usehooks-ts'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const debounced = useDebounceCallback(setUsername, 500)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')

        try {
          const response = await axios.get(
            `/api/auth/check-username-unique?username=${encodeURIComponent(username)}`
          )

          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username')
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await axios.post('/api/auth/sign-up', {
        username: data.username,
        email: data.email,
        password: data.password,
      })
      const { success } = response.data
      if (!success) {
        toast.error('Signup failed', {
          description: 'Please try again.',
        })
        return
      }
      toast.custom(() => (
        <div className="bg-white border shadow-md rounded-lg p-4">
          <p className="text-green-600 font-semibold">You registered successfully</p>
          <p className="text-gray-500">Please verify your email using the verification code.</p>
        </div>
      ))

      router.replace(`/auth/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Signup failed', {
        description: axiosError.response?.data.message ?? 'Unexpected error. Try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className=" bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8  rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight  lg:text-5xl mb-2">
              Create your Blognity account
            </h1>
            <p className="">Start sharing your ideas with the world 🌍</p>
          </div>

          {/*<Button
          variant="outline"
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <svg
            className="h-5 w-5 mr-2"
            viewBox="0 0 488 512"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M488 261.8C488 403.3 391.6 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123.1 24.5 166.3 64.9l-67.5 64.6C317.2 99.5 285.6 88 248 88c-90.5 0-164 73.5-164 164s73.5 164 164 164c78.1 0 123.5-44.3 132.8-106.5H248v-85.7h240C487.1 237.6 488 249.6 488 261.8z" />
          </svg>
          Continue with Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-muted-foreground">Or sign up with email</span>
          </div>
        </div>*/}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choose a unique username"
                        {...field}
                        onChange={e => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {isCheckingUsername && (
                      <p className="text-sm text-gray-500">Checking availability...</p>
                    )}
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-sm ${
                          usernameMessage.toLowerCase().includes('available')
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create a secure password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
