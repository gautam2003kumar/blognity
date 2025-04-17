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
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    try {
      const result = await signIn('Credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error('Sign-in failed', {
            description: 'The email/username or password you entered is incorrect.',
          })
        } else {
          toast.error('Unexpected error', {
            description: result.error,
          })
        }
      } else if (result?.url) {
        router.replace('/home')
        toast.success('Welcome back!', {
          description: 'You have successfully logged in.',
        })
      }
    } catch (error) {
      console.error('Error in sign-in process', error)
      toast.error('Sign-in failed', {
        description: 'An unexpected error occurred. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Welcome to Blognity
            </h1>
            <p className="mb-4">Sign in to start sharing your thoughts with the world!</p>
          </div>

          {/* Google Sign In */}
          {/*<Button
          variant="outline"
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/home' })}
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
            <span className="bg-white px-2 text-muted-foreground">Or sign in with credentials</span>
          </div>
        </div> */}

          {/* Credentials Sign In */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email or username" {...field} />
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
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p>
              Don&rsquo;t have an account yet?{' '}
              <Link href="/auth/sign-up" className="text-blue-600">
                Sign up
              </Link>
            </p>
            <p className="mt-2 text-sm">
              Forgot your password?{' '}
              <Link href="/auth/forgot-password" className="text-blue-600">
                Reset it here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
