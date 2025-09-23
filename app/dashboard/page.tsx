"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import {
  Gamepad2,
  Trophy,
  Users,
  History,
  LogOut,
  Play,
  Crown,
  Target,
  Clock,
  Star,
  Zap,
  Plus,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth"
import { authApi } from "@/lib/api"

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [playerData, setPlayerData] = useState({
    username: user?.username || "Player",
    avatar: "/tanjiro.png",
    stats: {
      matchesPlayed: user?.stats?.matchesPlayed || 0,
      wins: user?.stats?.wins || 0,
      losses: user?.stats?.losses || 0,
      winRate: user?.stats?.winRate || 0,
      globalRank: user?.stats?.globalRank || 0,
      points: user?.stats?.points || 0,
    },
    recentGames: [
      { game: "Tic-Tac-Toe", result: "win", opponent: "player22", time: "2 hours ago" },
      { game: "Tic-Tac-Toe", result: "loss", opponent: "player33", time: "5 hours ago" },
      { game: "Tic-Tac-Toe", result: "win", opponent: "player44", time: "1 day ago" },
    ]
  });

  useEffect(() => {
    if (user) {
      setPlayerData(prev => ({
        ...prev,
        username: user.username,
        stats: {
          matchesPlayed: user.stats?.matchesPlayed || 0,
          wins: user.stats?.wins || 0,
          losses: user.stats?.losses || 0,
          winRate: user.stats?.winRate || 0,
          globalRank: user.stats?.globalRank || 0,
          points: user.stats?.points || 0,
        }
      }));
    }
  }, [user]);

  // Refresh profile on mount to reflect latest stats
  useEffect(() => {
    const refresh = async () => {
      try {
        const token = (require("@/lib/stores/auth").useAuthStore.getState().token) as string | null
        if (!token) return
        const fresh = await authApi.getProfile(token)
        if (fresh) {
          setPlayerData(prev => ({
            ...prev,
            username: fresh.username,
            stats: {
              matchesPlayed: fresh.stats?.matchesPlayed || 0,
              wins: fresh.stats?.wins || 0,
              losses: fresh.stats?.losses || 0,
              winRate: fresh.stats?.winRate || 0,
              globalRank: fresh.stats?.globalRank || 0,
              points: fresh.stats?.points || 0,
            }
          }))
        }
      } catch (e) {
        console.error(e)
      }
    }
    refresh()
  }, [])

  // Protect the dashboard route
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const availableGames = [
    {
      name: "Tic-Tac-Toe",
      description: "Classic 3x3 strategy game",
      players: "2 players",
      status: "available",
      icon: Target,
    },
    {
      name: "Chess",
      description: "Strategic board game",
      players: "2 players",
      status: "coming-soon",
      icon: Crown,
    },
    {
      name: "Connect 4",
      description: "Connect four in a row",
      players: "2 players",
      status: "coming-soon",
      icon: Zap,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  GameHub
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/history">
                <Button variant="ghost" size="sm" className="glow-hover">
                  <History className="w-4 h-4 mr-2" />
                  History
                </Button>
              </Link>
              <Link href="/friends">
                <Button variant="ghost" size="sm" className="glow-hover">
                  <Users className="w-4 h-4 mr-2" />
                  Friends
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="ghost" size="sm" className="glow-hover">
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16 ring-2 ring-primary/50 glow">
              <AvatarImage src={playerData.avatar || "/placeholder.svg"} alt={playerData.username} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                {playerData.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {playerData.username}!</h1>
              <p className="text-muted-foreground">Ready to dominate the leaderboards?</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Player Stats */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{playerData.stats.matchesPlayed}</div>
                    <div className="text-sm text-muted-foreground">Matches</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{playerData.stats.wins}</div>
                    <div className="text-sm text-muted-foreground">Wins</div>
                  </div>
                  <div className="text-center p-3 bg-red-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-red-500">{playerData.stats.losses}</div>
                    <div className="text-sm text-muted-foreground">Losses</div>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">#{playerData.stats.globalRank}</div>
                    <div className="text-sm text-muted-foreground">Rank</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Win Rate</span>
                    <span className="font-semibold">{playerData.stats.winRate}%</span>
                  </div>
                  <Progress value={playerData.stats.winRate} className="h-2" />
                </div>

                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm">Points</span>
                  </div>
                  <span className="font-bold text-primary">{playerData.stats.points.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Games
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {playerData.recentGames.map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={game.result === "win" ? "default" : "destructive"} className="capitalize">
                        {game.result}
                      </Badge>
                      <div>
                        <div className="font-medium text-sm">{game.game}</div>
                        <div className="text-xs text-muted-foreground">vs {game.opponent}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{game.time}</div>
                  </div>
                ))}
                <Link href="/history">
                  <Button variant="outline" size="sm" className="w-full glass border-white/20 bg-transparent">
                    View All History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Games */}
          <div className="lg:col-span-2">
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Available Games
                </CardTitle>
                <CardDescription>Choose a game to start playing with friends or join public rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableGames.map((game, index) => (
                    <Card
                      key={index}
                      className={`glass border-white/20 transition-all duration-300 ${
                        game.status === "available"
                          ? "glow-hover cursor-pointer hover:scale-105"
                          : "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                          <game.icon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{game.name}</CardTitle>
                        <CardDescription>{game.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {game.players}
                        </div>
                        {game.status === "available" ? (
                          <Link href="/rooms">
                            <Button className="w-full bg-primary hover:bg-primary/90 glow-hover">
                              <Play className="w-4 h-4 mr-2" />
                              Play Now
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled className="w-full">
                            Coming Soon
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/rooms/create">
                    <Button variant="outline" className="w-full glass border-white/20 glow-hover bg-transparent">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Room
                    </Button>
                  </Link>
                  <Link href="/rooms">
                    <Button variant="outline" className="w-full glass border-white/20 glow-hover bg-transparent">
                      <Search className="w-4 h-4 mr-2" />
                      Browse Rooms
                    </Button>
                  </Link>
                  <Link href="/single-player">
                    <Button variant="outline" className="w-full glass border-white/20 glow-hover bg-transparent">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Play Solo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
