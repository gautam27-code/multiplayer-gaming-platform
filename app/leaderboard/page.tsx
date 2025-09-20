"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"

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

interface GameStats {
  game: string
  players: Player[]
}

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState("all-time")
  const [gameFilter, setGameFilter] = useState("all")

  const [globalLeaderboard] = useState<Player[]>([
    {
      id: "1",
      username: "ProGamer2024",
      avatar: "/placeholder.svg?key=top1",
      rank: 1,
      points: 4850,
      wins: 127,
      losses: 23,
      winRate: 84.7,
      gamesPlayed: 150,
      streak: 12,
      rankChange: "same",
      level: 25,
      title: "Grand Master",
    },
    {
      id: "2",
      username: "TacToeKing",
      avatar: "/placeholder.svg?key=top2",
      rank: 2,
      points: 4720,
      wins: 115,
      losses: 28,
      winRate: 80.4,
      gamesPlayed: 143,
      streak: 8,
      rankChange: "up",
      level: 23,
      title: "Master",
    },
    {
      id: "3",
      username: "StrategyQueen",
      avatar: "/placeholder.svg?key=top3",
      rank: 3,
      points: 4650,
      wins: 108,
      losses: 32,
      winRate: 77.1,
      gamesPlayed: 140,
      streak: 5,
      rankChange: "down",
      level: 22,
      title: "Master",
    },
    {
      id: "4",
      username: "player11",
      avatar: "/placeholder.svg?key=player11",
      rank: 1247,
      points: 2840,
      wins: 89,
      losses: 38,
      winRate: 70.1,
      gamesPlayed: 127,
      streak: 3,
      rankChange: "up",
      level: 15,
    },
    {
      id: "5",
      username: "GameMaster99",
      avatar: "/placeholder.svg?key=top5",
      rank: 4,
      points: 4580,
      wins: 102,
      losses: 35,
      winRate: 74.5,
      gamesPlayed: 137,
      streak: 7,
      rankChange: "up",
      level: 21,
      title: "Expert",
    },
    {
      id: "6",
      username: "WinStreak",
      avatar: "/placeholder.svg?key=top6",
      rank: 5,
      points: 4420,
      wins: 98,
      losses: 39,
      winRate: 71.5,
      gamesPlayed: 137,
      streak: 15,
      rankChange: "same",
      level: 20,
      title: "Expert",
    },
  ])

  const [gameStats] = useState<GameStats[]>([
    {
      game: "Tic-Tac-Toe",
      players: globalLeaderboard.slice(0, 10),
    },
    {
      game: "Chess",
      players: [],
    },
    {
      game: "Connect 4",
      players: [],
    },
  ])

  const topThree = globalLeaderboard.slice(0, 3)
  const restOfLeaderboard = globalLeaderboard.slice(3)
  const currentPlayer = globalLeaderboard.find((p) => p.username === "player11")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankChangeIcon = (change: "up" | "down" | "same") => {
    switch (change) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case "same":
        return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getTitleColor = (title?: string) => {
    switch (title) {
      case "Grand Master":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"
      case "Master":
        return "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
      case "Expert":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
      default:
        return "text-muted-foreground"
    }
  }

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
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="glow-hover">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Leaderboard</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Global Leaderboard</h1>
          <p className="text-muted-foreground">Compete with the best players worldwide</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Top 3 Podium */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  Top Champions
                </CardTitle>
                <CardDescription>The elite players leading the competition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 2nd Place */}
                  <div className="order-1 md:order-1">
                    <Card className="glass border-white/20 bg-gradient-to-br from-gray-500/10 to-gray-600/10">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <Badge className="bg-gray-500/20 text-gray-300">#2</Badge>
                        </div>
                        <Avatar className="w-16 h-16 mx-auto mb-4 ring-4 ring-gray-400/50">
                          <AvatarImage src={topThree[1]?.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gray-400/20 text-gray-300 text-lg">
                            {topThree[1]?.username.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg mb-1">{topThree[1]?.username}</h3>
                        {topThree[1]?.title && (
                          <p className={`text-sm mb-2 ${getTitleColor(topThree[1].title)}`}>{topThree[1].title}</p>
                        )}
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Points:</span>
                            <span className="font-semibold">{topThree[1]?.points.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Win Rate:</span>
                            <span className="font-semibold">{topThree[1]?.winRate}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 1st Place */}
                  <div className="order-2 md:order-2">
                    <Card className="glass border-white/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 transform md:scale-110">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-2 animate-pulse" />
                          <Badge className="bg-yellow-500/20 text-yellow-500 text-lg px-3 py-1">#1</Badge>
                        </div>
                        <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-yellow-500/50 glow">
                          <AvatarImage src={topThree[0]?.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-yellow-500/20 text-yellow-500 text-xl">
                            {topThree[0]?.username.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-xl mb-1">{topThree[0]?.username}</h3>
                        {topThree[0]?.title && (
                          <p className={`text-sm mb-2 font-semibold ${getTitleColor(topThree[0].title)}`}>
                            {topThree[0].title}
                          </p>
                        )}
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Points:</span>
                            <span className="font-bold text-yellow-500">{topThree[0]?.points.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Win Rate:</span>
                            <span className="font-bold text-yellow-500">{topThree[0]?.winRate}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 3rd Place */}
                  <div className="order-3 md:order-3">
                    <Card className="glass border-white/20 bg-gradient-to-br from-amber-600/10 to-amber-700/10">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <Award className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                          <Badge className="bg-amber-600/20 text-amber-600">#3</Badge>
                        </div>
                        <Avatar className="w-16 h-16 mx-auto mb-4 ring-4 ring-amber-600/50">
                          <AvatarImage src={topThree[2]?.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-amber-600/20 text-amber-600 text-lg">
                            {topThree[2]?.username.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg mb-1">{topThree[2]?.username}</h3>
                        {topThree[2]?.title && (
                          <p className={`text-sm mb-2 ${getTitleColor(topThree[2].title)}`}>{topThree[2].title}</p>
                        )}
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Points:</span>
                            <span className="font-semibold">{topThree[2]?.points.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Win Rate:</span>
                            <span className="font-semibold">{topThree[2]?.winRate}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rank */}
            {currentPlayer && (
              <Card className="glass glow-hover border-white/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Your Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(currentPlayer.rank)}
                        {getRankChangeIcon(currentPlayer.rankChange)}
                      </div>
                      <Avatar className="w-12 h-12 ring-2 ring-primary/50">
                        <AvatarImage src={currentPlayer.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {currentPlayer.username.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{currentPlayer.username}</span>
                          <Badge variant="outline">Lv.{currentPlayer.level}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {currentPlayer.points.toLocaleString()} points • {currentPlayer.winRate}% win rate
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">#{currentPlayer.rank}</div>
                      <div className="text-sm text-muted-foreground">Global Rank</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filters and Tabs */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Rankings
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger className="w-32 glass border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-time">All Time</SelectItem>
                          <SelectItem value="monthly">This Month</SelectItem>
                          <SelectItem value="weekly">This Week</SelectItem>
                          <SelectItem value="daily">Today</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="global" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 glass">
                    <TabsTrigger value="global" className="data-[state=active]:bg-primary/20">
                      Global
                    </TabsTrigger>
                    <TabsTrigger value="tic-tac-toe" className="data-[state=active]:bg-primary/20">
                      Tic-Tac-Toe
                    </TabsTrigger>
                    <TabsTrigger value="chess" className="data-[state=active]:bg-primary/20" disabled>
                      Chess
                    </TabsTrigger>
                    <TabsTrigger value="connect-4" className="data-[state=active]:bg-primary/20" disabled>
                      Connect 4
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="global" className="space-y-4">
                    {restOfLeaderboard.map((player, index) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                          player.username === "player11"
                            ? "bg-primary/10 ring-2 ring-primary/50 glow"
                            : "bg-card/50 hover:bg-card/70"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 w-16">
                            {getRankIcon(player.rank)}
                            {getRankChangeIcon(player.rankChange)}
                          </div>
                          <Avatar className="w-12 h-12 ring-2 ring-primary/30">
                            <AvatarImage src={player.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {player.username.slice(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{player.username}</span>
                              <Badge variant="outline" className="text-xs">
                                Lv.{player.level}
                              </Badge>
                              {player.title && (
                                <Badge variant="outline" className={`text-xs ${getTitleColor(player.title)}`}>
                                  {player.title}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {player.gamesPlayed} games • {player.streak} win streak
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{player.points.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{player.winRate}% win rate</div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="tic-tac-toe" className="space-y-4">
                    {gameStats[0].players.map((player, index) => (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                          player.username === "player11"
                            ? "bg-primary/10 ring-2 ring-primary/50 glow"
                            : "bg-card/50 hover:bg-card/70"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 w-16">
                            {getRankIcon(player.rank)}
                            {getRankChangeIcon(player.rankChange)}
                          </div>
                          <Avatar className="w-12 h-12 ring-2 ring-primary/30">
                            <AvatarImage src={player.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {player.username.slice(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{player.username}</span>
                              <Badge variant="outline" className="text-xs">
                                Lv.{player.level}
                              </Badge>
                              {player.title && (
                                <Badge variant="outline" className={`text-xs ${getTitleColor(player.title)}`}>
                                  {player.title}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              {player.wins}W / {player.losses}L • {player.streak} streak
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{player.points.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{player.winRate}% win rate</div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Leaderboard Stats */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Leaderboard Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-xl font-bold text-primary">{globalLeaderboard.length}</div>
                    <div className="text-xs text-muted-foreground">Total Players</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-xl font-bold text-yellow-500">
                      {globalLeaderboard[0]?.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Top Score</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <div className="text-xl font-bold text-green-500">
                      {Math.max(...globalLeaderboard.map((p) => p.streak))}
                    </div>
                    <div className="text-xs text-muted-foreground">Best Streak</div>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-xl font-bold text-accent">
                      {Math.round(globalLeaderboard.reduce((acc, p) => acc + p.winRate, 0) / globalLeaderboard.length)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Win Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass glow-hover border-white/20">
              <CardContent className="p-4 space-y-3">
                <Link href="/rooms">
                  <Button className="w-full bg-primary hover:bg-primary/90 glow-hover">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Play Now
                  </Button>
                </Link>
                <Link href="/friends">
                  <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                    <Trophy className="w-4 h-4 mr-2" />
                    Challenge Friends
                  </Button>
                </Link>
                <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Tournaments
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
