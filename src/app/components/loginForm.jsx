'use client'

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async data => {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    })

    if (result.error) {
      setErrorMessage('Incorrect username or password')
      console.error(result.error)
    } else {
      const callbackUrl = result.url || '/'
      router.push(callbackUrl)
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-6 pt-10 pb-12 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-center text-2xl font-bold tracking-tight text-card-foreground">
                Sign in to your account
              </h2>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium leading-6 text-card-foreground">
                  Email address
                </Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    {...register("email", { 
                      required: "Email is required", 
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Entered value does not match email format",
                      }
                    })}
                    className={`block w-full rounded-md border-0 py-1.5 text-card-foreground shadow-sm ring-1 ring-inset ring-muted placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 ${errors.email ? 'ring-red-500' : ''}`}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="block text-sm font-medium leading-6 text-card-foreground">
                    Password
                  </Label>
                  <div className="text-sm">
                    <Link href="#" className="font-semibold text-primary hover:text-primary/80" prefetch={false}>
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div className="mt-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must have at least 6 characters",
                      }
                    })}
                    className={`block w-full rounded-md border-0 py-1.5 text-card-foreground shadow-sm ring-1 ring-inset ring-muted placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 ${errors.password ? 'ring-red-500' : ''}`}
                  />
                  {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-primary-foreground shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Sign in
                </Button>
              </div>
            </form>
            <div className="flex items-center justify-center">
              <div className="text-sm">
                {"Don't have an account? "}
                <Link href="/register" className="font-semibold text-primary hover:text-primary/80" prefetch={false}>
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
