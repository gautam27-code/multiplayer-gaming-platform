"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Gamepad2,
  ArrowLeft,
  Users,
  Trophy,
  Clock,
  RotateCcw,
  Home,
  Share2,
  MessageCircle,
  Volume2,
  VolumeX,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { useAuthStore } from "@/lib/stores/auth"
import socketSvc, { initializeSocket, joinGameRoom, makeMove as socketMakeMove, setPlayerReady as socketReady } from "@/lib/api/socket"
import { gameApi } from "@/lib/api"

type Player = "X" | "O" | null
type GameState = "waiting" | "playing" | "finished"
type Winner = "X" | "O" | "draw" | null

export default function TicTacToeGame() {
  const params = useParams()
  const gameId = params.roomId as string
  const { token } = useAuthStore()

  // Game state
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [winner, setWinner] = useState<Winner>(null)
  const [gameTime, setGameTime] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Room state
  const [roomData, setRoomData] = useState<any>({
    id: gameId,
    name: "Room",
    players: [],
    spectators: 0,
  })

  // Fetch initial game state and setup socket
  useEffect(() => {
    const run = async () => {
      if (!token || !gameId) return
      try {
        const data = await gameApi.getGameState(token, gameId)
        const g: any = data
        setRoomData({
          id: g._id,
          name: g.name,
          players: (g.players || []).map((p: any) => ({
            id: p.user._id?.toString?.() || p.user,
            username: p.user.username || 'Player',
            avatar: '/placeholder.svg',
            symbol: p.symbol || null,
            isHost: false,
          })),
          spectators: 0,
        })
        if (Array.isArray(g.board) && g.board.length === 9) setBoard(g.board)
        setGameState(g.status === 'in-progress' ? 'playing' : g.status === 'completed' ? 'finished' : 'waiting')
        // currentTurn is ObjectId -> figure symbol from players
        if (g.currentTurn) {
          const current = g.players.find((p: any) => p.user._id?.toString?.() === g.currentTurn._id?.toString?.() || p.user?.toString?.() === g.currentTurn?.toString?.())
          if (current?.symbol) setCurrentPlayer(current.symbol)
        }

        const s = initializeSocket(token)
        joinGameRoom(gameId)
        s.on('game-update', (game: any) => {
          if (Array.isArray(game.board)) setBoard(game.board)
          const cur = game.players.find((p: any) => p.user === game.currentTurn || p.user?._id === game.currentTurn?._id)
          if (cur?.symbol) setCurrentPlayer(cur.symbol)
          setGameState(game.status === 'in-progress' ? 'playing' : game.status === 'completed' ? 'finished' : 'waiting')
        })
        s.on('game-start', (game: any) => {
          setGameState('playing')
          if (Array.isArray(game.board)) setBoard(game.board)
        })
        s.on('game-over', (data: any) => {
          setGameState('finished')
        })
      } catch (e) {
        console.error(e)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, gameId])

  // Game timer
  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setGameTime((prev) => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState])

  // Client-side winner calculation only for local UX feedback
  useEffect(() => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (const [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a])
        setGameState('finished')
        return
      }
    }
    if (board.every((cell) => cell !== null)) {
      setWinner('draw')
      setGameState('finished')
    }
  }, [board])

  const handleCellClick = (index: number) => {
    if (board[index] || gameState !== "playing" || winner) return
    if (!token) return
    // Convert index -> row/col
    const row = Math.floor(index / 3)
    const col = index % 3
    socketMakeMove({ row, col })
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setGameState("playing")
    setWinner(null)
    setGameTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getWinnerMessage = () => {
    if (winner === "draw") return "It's a Draw!"
    if (winner) {
      const winnerPlayer = roomData.players.find((p) => p.symbol === winner)
      return `${winnerPlayer?.username} Wins!`
    }
    return ""
  }

  const getCurrentPlayerInfo = () => {
    return roomData.players.find((p: any) => p.symbol === currentPlayer)
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
              <Link href="/rooms">
                <Button variant="ghost" size="sm" className="glow-hover">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Leave Game
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">{roomData.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-3">
            <Card className="glass glow-hover border-white/20">
              <CardHeader className="text-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-lg font-mono">{formatTime(gameTime)}</span>
                  </div>

                  {gameState === "playing" && (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 ring-2 ring-primary/50">
                        <AvatarImage src={getCurrentPlayerInfo()?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {getCurrentPlayerInfo()?.username.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-lg font-semibold">{getCurrentPlayerInfo()?.username}'s Turn</span>
                      <Badge className="bg-primary/20 text-primary">{currentPlayer}</Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{roomData.spectators} watching</span>
                  </div>
                </div>

                {gameState === "waiting" && (
                  <div className="mb-6 flex items-center justify-center gap-4">
                    <Button onClick={() => socketReady()} className="bg-primary hover:bg-primary/90 glow-hover">
                      Ready Up
                    </Button>
                  </div>
                )}

                {gameState === "finished" && (
                  <div className="mb-6">
                    <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {getWinnerMessage()}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Button onClick={resetGame} className="bg-primary hover:bg-primary/90 glow-hover">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                      <Link href="/dashboard">
                        <Button variant="outline" className="glass border-white/20 bg-transparent">
                          <Home className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex justify-center">
                <div className="grid grid-cols-3 gap-4 max-w-md w-full">
                  {board.map((cell, index) => (
                    <button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      disabled={gameState !== "playing" || cell !== null}
                      className={`
                        aspect-square w-full h-24 rounded-xl glass border-white/20 
                        flex items-center justify-center text-4xl font-bold
                        transition-all duration-300 hover:scale-105 glow-hover
                        ${cell === "X" ? "text-primary" : "text-accent"}
                        ${gameState === "playing" && !cell ? "hover:bg-primary/10" : ""}
                        ${cell ? "cursor-default" : "cursor-pointer"}
                      `}
                    >
                      {cell && (
                        <span
                          className={`animate-in zoom-in-50 duration-300 ${
                            cell === "X" ? "text-primary" : "text-accent"
                          }`}
                        >
                          {cell}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Players */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Players
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {roomData.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      gameState === "playing" && currentPlayer === player.symbol
                        ? "bg-primary/20 ring-2 ring-primary/50 glow"
                        : "bg-card/50"
                    }`}
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-primary/30">
                      <AvatarImage src={player.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {player.username.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{player.username}</span>
                        {player.isHost && (
                          <Badge variant="outline" className="text-xs">
                            Host
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">Playing as {player.symbol}</div>
                    </div>
                    <Badge
                      className={`${player.symbol === "X" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}
                    >
                      {player.symbol}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Game Stats */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Game Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-xl font-bold text-primary">{board.filter((cell) => cell === "X").length}</div>
                    <div className="text-xs text-muted-foreground">X Moves</div>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-xl font-bold text-accent">{board.filter((cell) => cell === "O").length}</div>
                    <div className="text-xs text-muted-foreground">O Moves</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Game Progress</span>
                    <span>{board.filter((cell) => cell !== null).length}/9</span>
                  </div>
                  <Progress value={(board.filter((cell) => cell !== null).length / 9) * 100} className="h-2" />
                </div>

                <div className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-lg font-bold">{formatTime(gameTime)}</div>
                  <div className="text-xs text-muted-foreground">Game Duration</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass glow-hover border-white/20">
              <CardContent className="p-4 space-y-3">
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="w-full glass border-white/20 bg-transparent"
                  disabled={gameState !== "finished"}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Game
                </Button>
                <Link href="/rooms">
                  <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Leave Room
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
