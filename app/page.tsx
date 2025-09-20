"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, Sparkles, Users, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (type: "login" | "signup") => {
    setIsLoading(true)
    // Simulate auth process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4 glow">
            <Gamepad2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GameHub
          </h1>
          <p className="text-muted-foreground mt-2">Enter the future of multiplayer gaming</p>
        </div>

        {/* Auth Card */}
        <Card className="glass glow-hover border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary/20">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary/20">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="player@gamehub.com"
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" className="glass border-white/20 focus:border-primary/50" />
                </div>
                <Button
                  onClick={() => handleAuth("login")}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 glow-hover"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="player11"
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="player@gamehub.com"
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    className="glass border-white/20 focus:border-primary/50"
                  />
                </div>
                <Button
                  onClick={() => handleAuth("signup")}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 glow-hover"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Multiplayer</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Leaderboards</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Real-time</p>
          </div>
        </div>
      </div>
    </div>
  )
}
