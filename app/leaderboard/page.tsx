"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  ArrowLeft,
  Crown,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Target,
  Gamepad2,
  Calendar,
  Filter,
  Clock
} from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth"
import { userApi } from "@/lib/api"

interface Player {
  id: string
  username: string
  avatar: string
  rank: number
  points: number
  wins: number
  losses: number
  winRate: number
  gamesPlayed: number
  streak: number
  rankChange: "up" | "down" | "same"
  level: number
  title?: string
}

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState("all-time")
  const [globalLeaderboard, setGlobalLeaderboard] = useState<Player[]>([])
  const { token, user } = useAuthStore()

  // Animation States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Mouse Follower Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Particle Canvas (Reddish-Orange Theme)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Using Reddish-Orange Theme color
        ctx.fillStyle = `rgba(255, 87, 34, ${p.opacity})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  // Fetch Logic
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        if (!token) return
        const list = (await userApi.getLeaderboard(token)) as any[]

        // 1. Calculate points and map initially
        const mappedWithPoints = list.map((u: any) => ({
          id: u._id,
          username: u.username,
          avatar: "/placeholder.svg",
          points: Math.round((u.stats?.wins || 0) * 10 + (u.stats?.matchesPlayed || 0)),
          wins: u.stats?.wins || 0,
          losses: u.stats?.losses || 0,
          winRate: Math.round((u.stats?.winRate || 0) * 10) / 10,
          gamesPlayed: u.stats?.matchesPlayed || 0,
          streak: 0,
          rankChange: "same" as const,
          level: Math.max(1, Math.floor((u.stats?.wins || 0) / 5)),
        }))

        // 2. Sort by points descending
        mappedWithPoints.sort((a, b) => b.points - a.points)

        // 3. Assign true rank
        const mapped: Player[] = mappedWithPoints.map((p, idx) => ({
          ...p,
          rank: idx + 1
        }))

        setGlobalLeaderboard(mapped)
      } catch (e) {
        console.error(e)
      }
    }
    fetchLeaderboard()
  }, [token])

  const topThree = globalLeaderboard.slice(0, 3)
  const restOfLeaderboard = globalLeaderboard.slice(3)
  const currentPlayer = globalLeaderboard.find((p) => p.username === user?.username)

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* 3. Animated Background Elements */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Red/Orange Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-red-600/10 z-0 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-orange-500/15 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-red-500/15 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Mouse Follower Glow */}
      <div
        className="fixed w-8 h-8 bg-orange-500/30 rounded-full blur-xl pointer-events-none z-50 transition-transform duration-100"
        style={{ left: mousePos.x - 16, top: mousePos.y - 16 }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-orange-500/30 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-orange-400 hover:text-white hover:bg-orange-500/20 border border-orange-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-orange-500 drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]" />
                  <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">LEADERBOARD</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
              GLOBAL STAGE
            </h1>
            <p className="text-orange-300/60 tracking-widest uppercase text-sm font-bold">Global Leaderboard Synchronization</p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-9 space-y-8">

              {/* Podium Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                {/* 2nd Place */}
                <Card className="bg-black/40 backdrop-blur-xl border-orange-500/20 hover:border-orange-500/50 transition-all group order-2 md:order-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-orange-500/20 blur-lg rounded-full group-hover:bg-orange-500/40 transition-all" />
                      <Avatar className="w-full h-full border-2 border-slate-400">
                        <AvatarFallback className="bg-slate-800 text-slate-300">{topThree[1]?.username[0]}</AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-500">#2</Badge>
                    </div>
                    <h3 className="font-black text-white">{topThree[1]?.username || "---"}</h3>
                    <p className="text-orange-500 font-bold text-sm">{topThree[1]?.points.toLocaleString()} PTS</p>
                  </CardContent>
                </Card>

                {/* 1st Place */}
                <Card className="bg-black/60 backdrop-blur-2xl border-orange-400 shadow-[0_0_30px_rgba(255,165,0,0.2)] transform scale-110 z-10 order-1 md:order-2">
                  <CardContent className="p-8 text-center">
                    <Crown className="w-10 h-10 text-orange-400 mx-auto mb-4 animate-bounce" />
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-orange-400/30 blur-2xl rounded-full animate-pulse" />
                      <Avatar className="w-full h-full border-4 border-orange-400">
                        <AvatarFallback className="bg-orange-950 text-orange-400 text-2xl font-black">{topThree[0]?.username[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-2xl font-black text-white">{topThree[0]?.username || "---"}</h3>
                    <p className="bg-orange-500 text-black font-black px-3 py-1 rounded-full text-xs inline-block mt-2">CHAMPION</p>
                    <p className="text-orange-400 font-black text-xl mt-2">{topThree[0]?.points.toLocaleString()} PTS</p>
                  </CardContent>
                </Card>

                {/* 3rd Place */}
                <Card className="bg-black/40 backdrop-blur-xl border-orange-500/20 hover:border-orange-500/50 transition-all group order-3">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-orange-500/10 blur-lg rounded-full" />
                      <Avatar className="w-full h-full border-2 border-orange-800">
                        <AvatarFallback className="bg-orange-900/40 text-orange-700">{topThree[2]?.username[0]}</AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-800">#3</Badge>
                    </div>
                    <h3 className="font-black text-white">{topThree[2]?.username || "---"}</h3>
                    <p className="text-orange-500 font-bold text-sm">{topThree[2]?.points.toLocaleString()} PTS</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main List */}
              <Card className="bg-black/60 backdrop-blur-xl border-orange-500/20 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-orange-500/10 flex flex-row items-center justify-between">
                  <CardTitle className="text-orange-400 font-black tracking-widest">RANKINGS</CardTitle>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-40 bg-black/40 border-orange-500/30 text-orange-400">
                      <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-orange-500/30 text-orange-100">
                      <SelectItem value="all-time">All Time</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-orange-500/10">
                    {restOfLeaderboard.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-6 hover:bg-orange-500/5 transition-colors group">
                        <div className="flex items-center gap-6">
                          <span className="text-2xl font-black text-orange-500/30 group-hover:text-orange-500 transition-colors w-8">
                            #{player.rank}
                          </span>
                          <Avatar className="w-12 h-12 border border-orange-500/20">
                            <AvatarFallback className="bg-orange-950 text-orange-500 font-bold">{player.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors">{player.username}</h4>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] border-orange-500/30 text-orange-300">LVL {player.level}</Badge>
                              <span className="text-[10px] text-slate-500 flex items-center gap-1"><Target className="w-3 h-3" /> {player.winRate}% WR</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-orange-400">{player.points.toLocaleString()}</p>
                          <p className="text-[10px] text-orange-500/50 uppercase font-bold tracking-tighter">Nexus Points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              <Card className="bg-black/60 backdrop-blur-xl border-orange-500/20 rounded-3xl p-2">
                <CardHeader>
                  <CardTitle className="text-sm font-black text-orange-500 uppercase tracking-widest">Global Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                    <p className="text-xs text-orange-300/60 uppercase font-bold">Total Combatss</p>
                    <p className="text-3xl font-black text-white mt-1">{globalLeaderboard.length}</p>
                  </div>
                  <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                    <p className="text-xs text-red-300/60 uppercase font-bold">Top Killstreak</p>
                    <p className="text-3xl font-black text-white mt-1">{Math.max(...globalLeaderboard.map(p => p.streak), 0)}</p>
                  </div>
                  <Link href="/rooms" className="block">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black h-14 rounded-2xl shadow-[0_0_20px_rgba(255,87,34,0.3)] hover:shadow-[0_0_30px_rgba(255,87,34,0.5)] transition-all">
                      CHALLENGE NOW
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Mini News/Updates */}
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-3xl p-6">
                <h4 className="font-black text-orange-500 text-xs uppercase mb-4 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Season Ending
                </h4>
                <div className="space-y-2">
                  <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-3/4 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">14 DAYS : 02 HOURS : 45 MINS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Global Theming Styles */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        ::selection {
          background: rgba(255, 87, 34, 0.3);
          color: white;
        }
      `}</style>
    </div>
  )
}