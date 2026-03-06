"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(9).fill(null))
  const [status, setStatus] = useState<'loading' | 'playing' | 'finished'>('loading')
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null)
  const [currentSymbol, setCurrentSymbol] = useState<"X" | "O">('X')
  const [isBusy, setIsBusy] = useState(false)
  const [resetKey, setResetKey] = useState(0)

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

  // 2. Particle Canvas (Light-Dark Pink Theme)
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
        // Pink Theme particle color
        ctx.fillStyle = `rgba(236, 72, 153, ${p.opacity})`;
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
        setCurrentSymbol('X')
      } catch (e: any) {
        console.error(e)
        const msg = e?.message || 'Failed to start single-player game'
        toast.error(msg)
        setStatus('finished')
      }
    }
    start()
  }, [token, router, resetKey])

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
          if (g.status === 'completed') {
            setStatus('finished')
            if (g.result === 'draw') setWinner('draw')
            else if (g.winner) setWinner('X')
            else setWinner('O')

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

  const handleCellClick = async (index: number) => {
    if (!gameId || !token) return
    if (status !== 'playing') return
    if (board[index] !== null) return
    if (isBusy) return

    const row = Math.floor(index / 3)
    const col = index % 3

    if (row < 0 || row >= 3 || col < 0 || col >= 3) {
      toast.error('Invalid position');
      return;
    }

    try {
      setIsBusy(true)
      const res: any = await gameApi.makeMove(token, gameId, { row, col })
      const g = res.game

      if (Array.isArray(g.board)) {
        setBoard(g.board)
        if (g.status === 'completed') {
          setStatus('finished')
          if (g.result === 'draw') {
            setWinner('draw')
          } else if (g.winner) {
            setWinner('X')
          } else {
            setWinner('O')
          }

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
    setGameId(null)
    setBoard(Array(9).fill(null))
    setStatus('loading')
    setWinner(null)
    setCurrentSymbol('X')
    setIsBusy(false)
    setResetKey(prev => prev + 1)
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Pink/Rose Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-600/10 via-transparent to-rose-600/10 z-0 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-pink-500/15 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/15 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Mouse Follower Glow */}
      <div
        className="fixed w-8 h-8 bg-pink-500/30 rounded-full blur-xl pointer-events-none z-50 transition-transform duration-100"
        style={{ left: mousePos.x - 16, top: mousePos.y - 16 }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Nav */}
        <nav className="sticky top-0 z-50 border-b border-pink-500/30 backdrop-blur-xl bg-black/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-pink-400 hover:text-white hover:bg-pink-500/20 border border-pink-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                  <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">Single Player</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-black/60 backdrop-blur-xl border-pink-500/20 rounded-3xl overflow-hidden">
            <CardHeader className="text-center border-b border-pink-500/10">
              <CardTitle className="text-pink-400 font-black tracking-widest">Solo Tic-Tac-Toe</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {status === 'loading' && (
                <div className="text-center py-10 text-pink-300/60">Starting game…</div>
              )}
              {status !== 'loading' && (
                <div className="flex flex-col items-center gap-6">
                  <div className="grid grid-cols-3 gap-4 max-w-md w-full">
                    {board.map((cell, i) => (
                      <button key={i}
                        onClick={() => handleCellClick(i)}
                        disabled={status !== 'playing' || cell !== null || isBusy}
                        className={`aspect-square w-full h-24 rounded-xl bg-black/40 backdrop-blur-xl border transition-all duration-300 hover:scale-105 flex items-center justify-center text-4xl font-bold
                          ${cell === 'X' ? 'text-pink-400 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'text-rose-400 border-rose-500/40'}
                          ${!cell && status === 'playing' ? 'border-pink-500/20 hover:border-pink-500/50 hover:bg-pink-500/5' : 'border-pink-500/10'}
                          ${isBusy ? 'opacity-70 cursor-wait' : ''}`}
                      >
                        {cell}
                      </button>
                    ))}
                  </div>

                  {isBusy && status === 'playing' && (
                    <div className="text-sm text-pink-300/60 animate-pulse">Computer is thinking…</div>
                  )}

                  {status === 'finished' && (
                    <div className="text-center space-y-4">
                      <div className="text-2xl font-black bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                        {winner === 'draw' ? "It's a Draw!" : (
                          winner === 'X' ? 'You Win!' : 'Computer Wins!'
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <Button onClick={resetLocal} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black h-12 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Play Again
                        </Button>
                        <Link href="/dashboard">
                          <Button variant="outline" className="bg-black/40 border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:text-white h-12 rounded-2xl transition-all">
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

      {/* Global Theming Styles */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        ::selection {
          background: rgba(236, 72, 153, 0.3);
          color: white;
        }
      `}</style>
    </div>
  )
}