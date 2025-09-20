"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  History,
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Eye,
  RotateCcw,
  Crown,
  Medal,
  Award,
} from "lucide-react"
import Link from "next/link"

interface GameMatch {
  id: string
  game: "Tic-Tac-Toe" | "Chess" | "Connect 4"
  opponent: {
    username: string
    avatar: string
    level: number
  }
  result: "win" | "loss" | "draw"
  score: string
  duration: string
  pointsGained: number
  date: string
  moves: number
  accuracy?: number
  roomName: string
}

export default function HistoryPage() {
  const [gameFilter, setGameFilter] = useState("all")
  const [resultFilter, setResultFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")

  const [matches] = useState<GameMatch[]>([
    {
      id: "1",
      game: "Tic-Tac-Toe",
      opponent: {
        username: "player22",
        avatar: "/placeholder.svg?key=opp1",
        level: 12,
      },
      result: "win",
      score: "3-0",
      duration: "2:34",
      pointsGained: 25,
      date: "2 hours ago",
      moves: 5,
      accuracy: 92,
      roomName: "Quick Match Arena",
    },
    {
      id: "2",
      game: "Tic-Tac-Toe",
      opponent: {
        username: "player33",
        avatar: "/placeholder.svg?key=opp2",
        level: 18,
      },
      result: "loss",
      score: "0-3",
      duration: "1:45",
      pointsGained: -15,
      date: "5 hours ago",
      moves: 6,
      accuracy: 67,
      roomName: "Pro Players Only",
    },
    {
      id: "3",
      game: "Tic-Tac-Toe",
      opponent: {
        username: "player44",
        avatar: "/placeholder.svg?key=opp3",
        level: 8,
      },
      result: "win",
      score: "3-1",
      duration: "3:12",
      pointsGained: 20,
      date: "1 day ago",
      moves: 7,
      accuracy: 85,
      roomName: "Casual Fun Room",
    },
    {
      id: "4",
      game: "Tic-Tac-Toe",
      opponent: {
        username: "player55",
        avatar: "/placeholder.svg?key=opp4",
        level: 15,
      },
      result: "draw",
      score: "1-1",
      duration: "4:28",
      pointsGained: 5,
      date: "1 day ago",
      moves: 9,
      accuracy: 78,
      roomName: "Tournament Practice",
    },
    {
      id: "5",
      game: "Tic-Tac-Toe",
      opponent: {
        username: "player66",
        avatar: "/placeholder.svg?key=opp5",
        level: 20,
      },
      result: "win",
      score: "3-2",
      duration: "5:15",
      pointsGained: 30,
      date: "2 days ago",
      moves: 8,
      accuracy: 88,
      roomName: "Elite Championship",
    },
    {
      id: "6",
      game: "Tic-Tac-Toe",
      opponent: {
        username: "player77",
        avatar: "/placeholder.svg?key=opp6",
        level: 6,
      },
      result: "win",
      score: "3-0",
      duration: "1:58",
      pointsGained: 18,
      date: "3 days ago",
      moves: 5,
      accuracy: 95,
      roomName: "Beginner Friendly",
    },
  ])

  const filteredMatches = matches.filter((match) => {
    const gameMatch = gameFilter === "all" || match.game === gameFilter
    const resultMatch = resultFilter === "all" || match.result === resultFilter
    // Time filter would be implemented with actual dates
    return gameMatch && resultMatch
  })

  const stats = {
    totalGames: matches.length,
    wins: matches.filter((m) => m.result === "win").length,
    losses: matches.filter((m) => m.result === "loss").length,
    draws: matches.filter((m) => m.result === "draw").length,
    winRate: Math.round((matches.filter((m) => m.result === "win").length / matches.length) * 100),
    totalPoints: matches.reduce((acc, match) => acc + match.pointsGained, 0),
    avgAccuracy: Math.round(matches.reduce((acc, match) => acc + (match.accuracy || 0), 0) / matches.length),
    bestStreak: 4, // This would be calculated from actual data
  }

  const getResultColor = (result: "win" | "loss" | "draw") => {
    switch (result) {
      case "win":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      case "loss":
        return "bg-red-500/20 text-red-500 border-red-500/30"
      case "draw":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
    }
  }

  const getResultIcon = (result: "win" | "loss" | "draw") => {
    switch (result) {
      case "win":
        return <Trophy className="w-4 h-4" />
      case "loss":
        return <TrendingDown className="w-4 h-4" />
      case "draw":
        return <Medal className="w-4 h-4" />
    }
  }

  const viewMatchDetails = (matchId: string) => {
    console.log(`View details for match ${matchId}`)
  }

  const replayMatch = (matchId: string) => {
    console.log(`Replay match ${matchId}`)
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
                <History className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Game History</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Game History & Analysis</h1>
          <p className="text-muted-foreground">Review your past games and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overall Stats */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Overall Statistics
                </CardTitle>
                <CardDescription>Your performance across all games</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.totalGames}</div>
                    <div className="text-sm text-muted-foreground">Total Games</div>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{stats.winRate}%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{stats.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Points Earned</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">{stats.bestStreak}</div>
                    <div className="text-sm text-muted-foreground">Best Streak</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-500">{stats.wins}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                  <div className="text-center p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-yellow-500">{stats.draws}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Draws</div>
                  </div>
                  <div className="text-center p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-red-500">{stats.losses}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Losses</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Game Type</label>
                    <Select value={gameFilter} onValueChange={setGameFilter}>
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Games</SelectItem>
                        <SelectItem value="Tic-Tac-Toe">Tic-Tac-Toe</SelectItem>
                        <SelectItem value="Chess">Chess</SelectItem>
                        <SelectItem value="Connect 4">Connect 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Result</label>
                    <Select value={resultFilter} onValueChange={setResultFilter}>
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Results</SelectItem>
                        <SelectItem value="win">Wins</SelectItem>
                        <SelectItem value="loss">Losses</SelectItem>
                        <SelectItem value="draw">Draws</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Period</label>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match History */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Recent Games ({filteredMatches.length})
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters or play some games!</p>
                  </div>
                ) : (
                  filteredMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 bg-card/50 rounded-lg hover:bg-card/70 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getResultColor(match.result)} border`}>
                            <div className="flex items-center gap-1">
                              {getResultIcon(match.result)}
                              <span className="capitalize">{match.result}</span>
                            </div>
                          </Badge>
                        </div>

                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-primary" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{match.game}</span>
                            <span className="text-sm text-muted-foreground">vs</span>
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={match.opponent.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {match.opponent.username.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{match.opponent.username}</span>
                            <Badge variant="outline" className="text-xs">
                              Lv.{match.opponent.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {match.duration}
                            </span>
                            <span>{match.moves} moves</span>
                            {match.accuracy && <span>{match.accuracy}% accuracy</span>}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {match.date}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">Room: {match.roomName}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-lg">{match.score}</div>
                          <div
                            className={`text-sm font-medium ${
                              match.pointsGained > 0
                                ? "text-green-500"
                                : match.pointsGained < 0
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {match.pointsGained > 0 ? "+" : ""}
                            {match.pointsGained} pts
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewMatchDetails(match.id)}
                            className="glow-hover"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => replayMatch(match.id)}
                            className="glow-hover"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-xl font-bold text-primary">{stats.avgAccuracy}%</div>
                  <div className="text-xs text-muted-foreground">Avg Accuracy</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Week</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">+12%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Best Game</span>
                    <span className="text-sm font-medium">95% accuracy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Favorite Time</span>
                    <span className="text-sm font-medium">Evening</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="font-medium text-sm">Win Streak</div>
                    <div className="text-xs text-muted-foreground">4 games in a row</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <Award className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium text-sm">Perfect Game</div>
                    <div className="text-xs text-muted-foreground">95% accuracy</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="font-medium text-sm">Quick Victory</div>
                    <div className="text-xs text-muted-foreground">Won in 5 moves</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass glow-hover border-white/20">
              <CardContent className="p-4 space-y-3">
                <Link href="/rooms">
                  <Button className="w-full bg-primary hover:bg-primary/90 glow-hover">
                    <Target className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Rankings
                  </Button>
                </Link>
                <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Detailed Stats
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
