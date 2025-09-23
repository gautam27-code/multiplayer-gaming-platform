"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gamepad2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/stores/auth"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, user } = useAuthStore()

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  useEffect(() => {
    if (user) router.push("/dashboard")
  }, [user, router])

  const onSubmit = async (formData: FormData) => {
    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      await login(email, password)
      toast.success("Logged in successfully!")
      router.push("/dashboard")
    } catch {}
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 backdrop-blur-sm rounded-2xl mb-4 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
          <Gamepad2 className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          GameHub
        </h1>
        <p className="text-cyan-300/80 mt-2">Sign in to your account</p>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-black/20 backdrop-blur-xl border border-cyan-400/30 rounded-3xl shadow-2xl shadow-purple-500/20">
          <CardHeader className="text-center p-8 pb-4">
            <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
            <CardDescription className="text-cyan-300/80 mt-2">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget)
                onSubmit(fd)
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="player@gamehub.com" className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-2">Password</Label>
                <Input id="password" name="password" type="password" required className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold rounded-xl transition-all duration-300">
                {isLoading ? 'Signing In…' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}