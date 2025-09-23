"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Gamepad2, RotateCcw, Trophy } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth"
import { authApi, gameApi } from "@/lib/api"
import { toast } from "sonner"

interface PlayerStats {
  matchesPlayed: number
  wins: number
  losses: number
  ties?: number
  winRate: number
  globalRank?: number
  points?: number
}

// Simple tic-tac-toe single-player page vs AI
export default function SinglePlayerPage() {
  const router = useRouter()
  const { token } = useAuthStore()

  const [gameId, setGameId] = useState<string | null>(null)
  const [board, setBoard] = useState<("X"|"O"|null)[]>(Array(9).fill(null))
  const [status, setStatus] = useState<'loading'|'playing'|'finished'>('loading')
  const [winner, setWinner] = useState<"X"|"O"|"draw"|null>(null)
  const [currentSymbol, setCurrentSymbol] = useState<"X"|"O">('X')
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    const start = async () => {
      if (!token) {
        router.push('/login')
        return
      }
      try {
        const res: any = await gameApi.createSinglePlayer(token, { type: 'tic-tac-toe', name: 'Solo Tic-Tac-Toe' })
        const g = res.game
        setGameId(g._id)
        setBoard(Array.isArray(g.board) ? g.board : Array(9).fill(null))
        setStatus(g.status === 'completed' ? 'finished' : 'playing')
        // currentTurn belongs to user -> symbol X
        setCurrentSymbol('X')
      } catch (e: any) {
        console.error(e)
        const msg = e?.message || 'Failed to start single-player game'
        toast.error(msg)
        setStatus('finished')
      }
    }
    start()
  }, [token, router])

  // Poll game state while playing to avoid any client desync
  useEffect(() => {
    if (!token || !gameId || status !== 'playing') return
    
    let isSubscribed = true
    const id = setInterval(async () => {
      try {
        const g: any = await gameApi.getGameState(token, gameId)
        if (!isSubscribed) return
        
        if (Array.isArray(g.board)) {
          setBoard(g.board)
          // Check if game completed
          if (g.status === 'completed') {
            setStatus('finished')
            if (g.result === 'draw') setWinner('draw')
            else if (g.winner) setWinner('X')
            else setWinner('O')

            // Refresh profile for updated stats
            try {
              const fresh = await authApi.getProfile(token)
              const userStats = fresh as { stats: PlayerStats }
              if (userStats?.stats && isSubscribed) {
                useAuthStore.setState((state: any) => ({
                  ...state,
                  user: {
                    ...state.user,
                    stats: userStats.stats
                  }
                }))
              }
            } catch (err) {
              console.error('Failed to refresh profile', err)
            }
          }
        }
      } catch (err) {
        console.error('Game state polling error:', err)
      }
    }, 1000)

    return () => {
      isSubscribed = false
      clearInterval(id)
    }
  }, [token, gameId, status])

  const checkLocalWinner = (b: ("X"|"O"|null)[]) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ]
    for (const [a,bn,c] of lines) {
      if (b[a] && b[a] === b[bn] && b[a] === b[c]) {
        return b[a]
      }
    }
    if (b.every(x => x !== null)) return 'draw'
    return null
  }

  const handleCellClick = async (index: number) => {
    if (!gameId || !token) return
    if (status !== 'playing') return
    if (board[index] !== null) return
    if (isBusy) return

    const row = Math.floor(index/3)
    const col = index % 3
    
    // Validate position before sending
    if (row < 0 || row >= 3 || col < 0 || col >= 3) {
      toast.error('Invalid position');
      return;
    }

    try {
      setIsBusy(true)
      const res: any = await gameApi.makeMove(token, gameId, { row, col })
      const g = res.game
      
      // Update board state
      if (Array.isArray(g.board)) {
        setBoard(g.board)
        // Check if game completed
        if (g.status === 'completed') {
          setStatus('finished')
          // Determine winner
          if (g.result === 'draw') {
            setWinner('draw')
          } else if (g.winner) {
            setWinner('X') // Human won
          } else {
            setWinner('O') // Computer won
          }

          // Refresh profile to reflect updated stats
          try {
            const fresh = await authApi.getProfile(token)
            const userStats = fresh as { stats: PlayerStats }
            if (userStats?.stats) {
              useAuthStore.setState((state: any) => ({ 
                ...state, 
                user: { 
                  ...state.user, 
                  stats: userStats.stats
                } 
              }))
            }
          } catch (err) {
            console.error('Failed to refresh profile', err)
          }
        }
      }
    } catch (e: any) {
      console.error('Move error:', e)
      toast.error(e?.message || 'Move failed')
    } finally {
      setIsBusy(false)
    }
  }

  const resetLocal = () => {
    if (!gameId) return
    // For simplicity, go back and start a fresh single-player game
    router.replace('/single-player')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Nav */}
      <nav className="relative z-10 glass border-b border-white/10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="glow-hover">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Single Player</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="glass glow-hover border-white/20">
          <CardHeader className="text-center">
            <CardTitle>Solo Tic-Tac-Toe</CardTitle>
          </CardHeader>
          <CardContent>
            {status === 'loading' && (
              <div className="text-center py-10">Starting game…</div>
            )}
            {status !== 'loading' && (
              <div className="flex flex-col items-center gap-6">
                <div className="grid grid-cols-3 gap-4 max-w-md w-full">
                  {board.map((cell, i) => (
                    <button key={i}
                      onClick={() => handleCellClick(i)}
                      disabled={status !== 'playing' || cell !== null || isBusy}
                      className={`aspect-square w-full h-24 rounded-xl glass border-white/20 flex items-center justify-center text-4xl font-bold transition-all duration-300 hover:scale-105 glow-hover ${cell === 'X' ? 'text-primary' : 'text-accent'} ${isBusy ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {cell}
                    </button>
                  ))}
                </div>

                {isBusy && status === 'playing' && (
                  <div className="text-sm text-muted-foreground">Computer is thinking…</div>
                )}

                {status === 'finished' && (
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold">
                      {winner === 'draw' ? 'It\'s a Draw!' : (
                        winner === 'X' ? 'You Win!' : 'Computer Wins!'
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Button onClick={resetLocal} className="bg-primary hover:bg-primary/90">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                      <Link href="/dashboard">
                        <Button variant="outline" className="glass border-white/20">
                          <Trophy className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}