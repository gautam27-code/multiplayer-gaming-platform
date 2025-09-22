"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, Sparkles, Users, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/stores/auth"

// Floating Character Component
const FloatingCharacter = ({ emoji, delay = 0 }: { emoji: string; delay?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`text-6xl cursor-pointer transition-all duration-300 ease-out transform hover:scale-110 ${
        isHovered ? 'animate-bounce' : 'animate-pulse'
      }`}
      style={{
        animationDelay: `${delay}ms`,
        filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {emoji}
    </div>
  );
};

export default function AuthPage() {
  const router = useRouter()
  const { login, register, isLoading, error } = useAuthStore()

  // Show error toast when auth error occurs
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleAuth = async (type: "login" | "signup", formData: FormData) => {
    try {
      if (type === "login") {
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        await login(email, password)
      } else {
        const username = formData.get("username") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        await register(username, email, password)
      }
      router.push("/dashboard")
      toast.success(`Successfully ${type === "login" ? "logged in" : "registered"}!`)
    } catch (err) {
      console.error(err)
      // Error is handled by the auth store and shown via useEffect
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-ping" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main heading */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
            JOIN THE NEW ERA
          </span>
          <br />
          <span className="text-white">
            OF GAMING
          </span>
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Features with Cyberpunk Style - Left Side */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col space-y-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-cyan-400/30 shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-105 group-hover:border-cyan-400/50">
              <Users className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
            </div>
            <p className="text-sm text-cyan-300/70 font-medium group-hover:text-cyan-300 transition-colors duration-300">Multiplayer</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-cyan-400/30 shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-105 group-hover:border-cyan-400/50">
              <Trophy className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
            </div>
            <p className="text-sm text-cyan-300/70 font-medium group-hover:text-cyan-300 transition-colors duration-300">Leaderboards</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-cyan-400/30 shadow-lg shadow-cyan-400/10 hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-105 group-hover:border-cyan-400/50">
              <Sparkles className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
            </div>
            <p className="text-sm text-cyan-300/70 font-medium group-hover:text-cyan-300 transition-colors duration-300">Real-time</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 backdrop-blur-sm rounded-2xl mb-4 border border-cyan-400/30 shadow-lg shadow-cyan-400/20">
            <Gamepad2 className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            GameHub
          </h1>
          <p className="text-cyan-300/80 mt-2">Enter the future of multiplayer gaming</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-black/20 backdrop-blur-xl border border-cyan-400/30 rounded-3xl shadow-2xl shadow-purple-500/20 glow-hover">
          <CardHeader className="text-center p-8 pb-4">
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-cyan-300/80 mt-2">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/30 backdrop-blur-sm rounded-2xl p-1 border border-cyan-400/20">
                <TabsTrigger value="login" className="px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400/20 data-[state=active]:to-purple-400/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-400/20 text-cyan-300/70 hover:text-white hover:bg-white/5">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-out data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400/20 data-[state=active]:to-purple-400/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-400/50 data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-400/20 text-cyan-300/70 hover:text-white hover:bg-white/5">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleAuth("login", formData)
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="player@gamehub.com"
                      className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300 glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-2">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300 glass"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/30 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none hover:from-cyan-300 hover:to-purple-400 glow-hover"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Signing In...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Form */}
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleAuth("signup", formData)
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="username" className="block text-sm font-medium text-cyan-300 mb-2">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      required
                      placeholder="player11"
                      className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300 glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="block text-sm font-medium text-cyan-300 mb-2">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      placeholder="player@gamehub.com"
                      className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300 glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="block text-sm font-medium text-cyan-300 mb-2">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-cyan-400/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300 glass"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold rounded-xl transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/30 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none hover:from-cyan-300 hover:to-purple-400 glow-hover"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Floating Gaming Characters */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center space-x-8 pointer-events-auto z-20">
        <FloatingCharacter emoji="🎮" delay={0} />
        <FloatingCharacter emoji="🕹️" delay={200} />
        <FloatingCharacter emoji="🎯" delay={400} />
        <FloatingCharacter emoji="🏆" delay={600} />
        <FloatingCharacter emoji="⚡" delay={800} />
      </div>

      <style jsx>{`
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: animate-in 0.3s ease-out;
        }
        
        .fade-in-50 {
          animation: fade-in 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Custom glow effects */
        .glow-hover:hover {
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
        }

        .glass {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  )
}