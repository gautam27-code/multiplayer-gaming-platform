"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Gamepad2, RotateCcw, Trophy } from "lucide-react"
import { useAuthStore } from "@/lib/stores/auth"
import { gameApi } from "@/lib/api"

// Simple tic-tac-toe single-player page vs AI
export default function SinglePlayerPage() {
  const router = useRouter()
  const { token } = useAuthStore()

  const [gameId, setGameId] = useState<string | null>(null)
  const [board, setBoard] = useState<("X"|"O"|null)[]>(Array(9).fill(null))
  const [status, setStatus] = useState<'loading'|'playing'|'finished'>('loading')
  const [winner, setWinner] = useState<"X"|"O"|"draw"|null>(null)
  const [currentSymbol, setCurrentSymbol] = useState<"X"|"O">('X')

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
        setStatus('playing')
        // currentTurn belongs to user -> symbol X
        setCurrentSymbol('X')
      } catch (e) {
        console.error(e)
      }
    }
    start()
  }, [token, router])

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

    const row = Math.floor(index/3)
    const col = index % 3

    try {
      const res: any = await gameApi.makeMove(token, gameId, { row, col })
      const g = res.game
      if (Array.isArray(g.board)) setBoard(g.board)
      if (g.status === 'completed') {
        setStatus('finished')
        // derive winner: if result=draw keep draw else figure from board changes; backend sets winner null on AI win
        if (g.result === 'draw') setWinner('draw')
        else if (g.winner) setWinner('X')
        else setWinner('O')
      }
    } catch (e) {
      console.error(e)
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
                      disabled={status !== 'playing' || cell !== null}
                      className={`aspect-square w-full h-24 rounded-xl glass border-white/20 flex items-center justify-center text-4xl font-bold transition-all duration-300 hover:scale-105 glow-hover ${cell === 'X' ? 'text-primary' : 'text-accent'}`}
                    >
                      {cell}
                    </button>
                  ))}
                </div>

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