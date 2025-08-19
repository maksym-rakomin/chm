"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { publicFetch } from "@/lib/api/publicApi"
import { setTokensClient } from "@/lib/api/tokenClient"
import { useAuthStore } from "@/lib/store/auth"
import { UserRole } from "@/lib/types/roles"
import {LoginResponse, LoginValues} from "@/lib/types/login";
import {LoginSchema} from "@/lib/schema/login";
import {getLogin} from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter()
  const setRole = useAuthStore((s) => s.setRole)

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  })

  async function onSubmit(values: LoginValues) {
    try {
      const response = await getLogin(values)

      if (!('data' in response) && response?.data?.token) {
        toast.error('Login failed')
        return
      }

      const data = response?.data

      if (!data) {
        toast.error('Login failed')
        return
      }

      await setTokensClient({
        accessToken: data.plain_text_token,
        refreshToken: data.plain_text_token,
        userId: data.tokenable_id,
        role: 'admin'
      })

      // await setTokensClient({
      //   accessToken: data.accessToken,
      //   refreshToken: data.refreshToken,
      //   userId: data.userId,
      // })
      //
      setRole('admin' as UserRole) // todo


      // todo Синхронизируем роль на сервере (из accessToken) и кладем в zustand
      // try {
      //   const syncRes = await fetch("/api/me/role", { method: "POST" })
      //   if (syncRes.ok) {
      //     const payload = (await syncRes.json()) as { role: UserRole }
      //     setRole(payload.role)
      //   }
      // } catch (error) {
      //   console.log(error.message)
      // }

      router.push("/")
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    }
  }

  const { isSubmitting } = form.formState

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your care management dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
