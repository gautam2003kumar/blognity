'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await signIn('Credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      console.log(result)

      if (result?.error) {
        // Handle different error scenarios
        if (result.error == 'CredentialsSignin') {
          toast.error("Sign-in failed", {
            description: "The email/username or password you entered is incorrect. Please try again."
          });
        } else {
          toast.error("Unexpected error", {
            description: result.error,
          });
        }
      } else if (result?.url) {
        // Redirect on success
        router.replace("/home");
        toast.success("Welcome back!", {
          description: "You have successfully logged in. Enjoy your time on Blogify!"
        });
      }
    } catch (error) {
      console.error("Error in sign-in process", error);
      toast.error("Sign-in failed", {
        description: "An unexpected error occurred. Please try again later.",
        style:{
          //color: ''
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Welcome to Blogify
            </h1>
            <p className="mb-4">
              Sign in to start sharing your thoughts with the world!
            </p>
          </div>

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
  );
};

export default SignIn;