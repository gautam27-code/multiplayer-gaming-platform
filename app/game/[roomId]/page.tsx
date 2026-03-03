"use client"

import React, { useState, useEffect, useRef } from "react"
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
  Zap,
  Swords
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { useAuthStore } from "@/lib/stores/auth"
import socketSvc, { initializeSocket, joinGameRoom, makeMove as socketMakeMove, setPlayerReady as socketReady, playAgain } from "@/lib/api/socket"
import { gameApi } from "@/lib/api"

type Player = "X" | "O" | null
type GameState = "waiting" | "playing" | "finished"
type Winner = "X" | "O" | "draw" | null


export default function TicTacToeGame() {
  const params = useParams()
  const gameId = params.roomId as string
  const { token, user, refreshProfile } = useAuthStore()

  // Game state
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [winner, setWinner] = useState<Winner>(null)
  const [gameTime, setGameTime] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const [winnerId, setWinnerId] = useState<string | null>(null)

  // Animation & Background States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Room state
  const [roomData, setRoomData] = useState<any>({
    id: gameId,
    name: "Combat Sector",
    roomCode: "",
    players: [],
    spectators: 0,
  })

  // 1. Theme Animations (Particles & Cursor)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: any[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 1,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    let animationId: number;
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${p.opacity})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      animationId = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Socket & API logic
  useEffect(() => {
    const run = async () => {
      if (!token || !gameId) return
      try {
        const data = await gameApi.getGameState(token, gameId)
        const g: any = data
        setRoomData({
          id: g._id,
          name: g.name || "Combat Sector",
          roomCode: g.roomCode || "",
          players: (g.players || []).map((p: any, idx: number) => ({
            id: p.user?._id?.toString?.() || p.user || 'ai',
            username: p.ai ? 'AI Bot' : (p.user?.username || 'Player'),
            avatar: '/placeholder.svg',
            symbol: p.symbol || (idx === 0 ? 'X' : 'O'),
            isHost: idx === 0,
          })),
          spectators: 0,
        })
        if (Array.isArray(g.board) && g.board.length === 9) setBoard(g.board)
        setGameState(g.status === 'in-progress' ? 'playing' : g.status === 'completed' ? 'finished' : 'waiting')

        if (g.currentTurn) {
          const current = g.players.find((p: any) =>
            String(p.user?._id || p.user) === String(g.currentTurn?._id || g.currentTurn)
          )
          if (current?.symbol) setCurrentPlayer(current.symbol)
        }

        const s = initializeSocket(token)
        joinGameRoom(gameId)

        const onUpdate = (game: any) => {
          if (Array.isArray(game.board)) setBoard(game.board)
          const cur = (game.players || []).find((p: any) => (
            (typeof p.user === 'string' && p.user === game.currentTurn) ||
            (p.user?._id && p.user?._id === game.currentTurn?._id)
          ))
          if (cur?.symbol) setCurrentPlayer(cur.symbol)
          setGameState(game.status === 'in-progress' ? 'playing' : game.status === 'completed' ? 'finished' : 'waiting')

          setRoomData((prev: any) => ({
            ...prev,
            players: (game.players || []).map((p: any, idx: number) => ({
              id: p.user?._id || p.user || 'ai',
              username: p.ai ? 'AI Bot' : (p.user?.username || 'Player'),
              avatar: '/placeholder.svg',
              symbol: p.symbol || (idx === 0 ? 'X' : 'O'),
              isHost: idx === 0,
            })),
          }))

          if (game.status === 'in-progress' && !game.winner && !game.result && game.moves?.length === 0) {
            setWinner(null); setGameTime(0); setGameState('playing');
          }
        };

        const onStart = (game: any) => {
          setGameState('playing'); setWinner(null); setGameTime(0);
          if (Array.isArray(game.board)) setBoard(game.board)
        };

        const onGameOver = () => {
          setGameState('finished');
          refreshProfile();
        };

        const onReadyUpdate = (payload: any) => {
          const game = payload?.game || payload
          if (game) {
            if (Array.isArray(game.players)) {
              setRoomData((prev: any) => ({
                ...prev,
                players: (game.players || []).map((p: any, idx: number) => ({
                  id: p.user?._id || p.user || 'ai',
                  username: p.ai ? 'AI Bot' : (p.user?.username || 'Player'),
                  avatar: '/placeholder.svg',
                  symbol: p.symbol || (idx === 0 ? 'X' : 'O'),
                  isHost: idx === 0,
                })),
              }))
            }
            if (game.status === 'in-progress') {
              setGameState('playing')
              if (Array.isArray(game.board)) setBoard(game.board)
            }
          }
        };

        s.on('game-update', onUpdate);
        s.on('game-start', onStart);
        s.on('game-over', onGameOver);
        s.on('player-ready-update', onReadyUpdate);

        return () => {
          try {
            s.off('game-update', onUpdate);
            s.off('game-start', onStart);
            s.off('game-over', onGameOver);
            s.off('player-ready-update', onReadyUpdate);
            require("@/lib/api/socket").leaveGameRoom();
          } catch { }
        };

      } catch (e) {
        console.error(e)
      }
    }

    // Create connection and capture cleanup
    let cleanup: any = () => { }
    run().then((cleanupFn) => {
      if (typeof cleanupFn === 'function') cleanup = cleanupFn
    })

    return () => cleanup();
  }, [token, gameId]);

  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => setGameTime((prev) => prev + 1), 1000)
      return () => clearInterval(timer)
    }
  }, [gameState])

  // Client-side winner calculation only for local UX feedback
  useEffect(() => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winSymbol = board[a]
        setWinner(winSymbol)

        const wp = roomData.players.find((p: any) => p.symbol === winSymbol)
        setWinnerId(wp?.id || null)

        setGameState('finished')
        return
      }
    }

    if (board.every(c => c !== null)) {
      setWinner('draw')
      setWinnerId(null)
      setGameState('finished')
    }
  }, [board, roomData.players])

  const handleCellClick = (index: number) => {
    if (board[index] || gameState !== "playing" || winner) return
    if (!token) return
    socketMakeMove({ row: Math.floor(index / 3), col: index % 3 })
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Dynamic Backgrounds */}
      <div className={`fixed inset-0 transition-opacity duration-1000 ${currentPlayer === 'X' ? 'bg-cyan-500/5' : 'bg-magenta-500/5'} z-0`} />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-magenta-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* Main UI */}
      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/rooms">
                <Button variant="ghost" className="text-slate-400 hover:text-white border border-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" /> ABANDON
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Swords className="w-6 h-6 text-cyan-400" />
                <span className="text-xl font-black tracking-widest uppercase italic">{roomData.name}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)} className="border border-white/5">
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="border border-white/5"><Share2 className="w-4 h-4" /></Button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Board Section */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                    <Clock className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Match Time</p>
                    <p className="text-2xl font-mono font-bold text-white">{formatTime(gameTime)}</p>
                  </div>
                </div>

                {gameState === "playing" && (
                  <div className="flex items-center gap-4 animate-pulse">
                    <div className={`text-right ${currentPlayer === 'X' ? 'text-cyan-400' : 'text-magenta-400'}`}>
                      <p className="text-[10px] font-black uppercase">Active Turn</p>
                      <p className="text-xl font-black">{currentPlayer === 'X' ? 'CYBER-X' : 'NEON-O'}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center text-2xl font-black ${currentPlayer === 'X' ? 'border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)]' : 'border-magenta-400 text-magenta-400 shadow-[0_0_15px_rgba(255,0,255,0.5)]'}`}>
                      {currentPlayer}
                    </div>
                  </div>
                )}

                {gameState === "finished" && (
                  <div className="text-center">
                    <h2 className="text-3xl font-black italic bg-gradient-to-r from-cyan-400 to-magenta-500 bg-clip-text text-transparent">
                      {(() => {
                        if (winner === 'draw') return 'GAMEDRAW'
                        if (!winnerId || !user?.id) return 'SYSTEM OVERRIDE'

                        return String(user.id) === String(winnerId)
                          ? 'VICTORY ACHIEVED'
                          : 'CRITICAL DEFEAT'
                      })()}
                    </h2>
                  </div>
                )}
              </div>

              {/* The Grid */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <Card className="relative bg-black/80 border-white/10 rounded-[2.5rem] p-10 backdrop-blur-2xl">
                  <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                    {board.map((cell, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCellClick(idx)}
                        className={`w-full aspect-square min-h-[80px] sm:min-h-[100px] rounded-2xl border-2 transition-all duration-500 flex items-center justify-center text-6xl font-black
                           ${!cell && gameState === 'playing' ? 'border-white/5 hover:border-cyan-400/50 hover:bg-cyan-400/5 cursor-pointer' : 'cursor-default'}
                           ${cell === 'X' ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]' : ''}
                           ${cell === 'O' ? 'border-magenta-500/50 bg-magenta-500/10 text-magenta-400 shadow-[inset_0_0_20px_rgba(255,0,255,0.2)]' : ''}
                           ${gameState === 'finished' ? 'opacity-50' : ''}
                         `}
                      >
                        {cell && (
                          <span className="animate-in zoom-in-75 duration-300 drop-shadow-[0_0_10px_currentColor]">
                            {cell}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {gameState === 'waiting' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-[2.5rem] backdrop-blur-sm z-20">
                      {(() => {
                        if (!user) return null;

                        const isPlayer = roomData.players.some((p: any) => String(p.id) === String(user.id));
                        const isHost = roomData.players.length > 0 && String(roomData.players[0].id) === String(user.id);

                        console.log("Overlay Render State:", {
                          userId: user.id,
                          players: roomData.players,
                          playerCount: roomData.players.length,
                          isPlayer,
                          isHost
                        });

                        if (!isPlayer) {
                          if (roomData.players.length < 2) {
                            return (
                              <Button onClick={async () => {
                                try {
                                  if (token && roomData.roomCode) {
                                    const resp: any = await gameApi.joinRoom(token, roomData.roomCode);
                                    if (resp?.game) {
                                      setRoomData((prev: any) => ({
                                        ...prev,
                                        players: (resp.game.players || []).map((p: any, idx: number) => ({
                                          id: p.user?._id || p.user,
                                          username: p.user?.username || 'Player',
                                          avatar: '/placeholder.svg',
                                          symbol: p.symbol || (idx === 0 ? 'X' : 'O'),
                                          isHost: idx === 0,
                                        })),
                                      }));
                                    }
                                  }
                                } catch (e) { console.error(e) }
                              }} size="lg" className="bg-magenta-500 hover:bg-magenta-400 text-white font-black px-10 h-16 rounded-2xl text-xl shadow-[0_0_30px_rgba(255,0,255,0.4)] transition-all hover:scale-110 cursor-pointer pointer-events-auto">
                                JOIN SECTOR
                              </Button>
                            );
                          }
                          return <div className="text-magenta-400 font-black text-2xl tracking-widest uppercase">SECTOR FULL</div>;
                        }

                        if (isHost) {
                          return (
                            <Button onClick={async () => {
                              try {
                                socketReady()
                              } catch (e) { console.error(e) }
                            }} disabled={roomData.players.length < 2} size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-10 h-16 rounded-2xl text-xl shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all hover:scale-110 cursor-pointer pointer-events-auto disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                              {roomData.players.length < 2 ? 'AWAITING OPPONENT...' : 'INITIALIZE COMBAT'}
                            </Button>
                          );
                        }

                        return (
                          <div className="text-cyan-400 font-black text-2xl tracking-widest uppercase animate-pulse">
                            AWAITING HOST INITIALIZATION...
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="bg-white/5 border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Combatants
                </h3>
                <div className="space-y-4">
                  {roomData.players.map((p: any) => (
                    <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${currentPlayer === p.symbol ? 'bg-white/10 border-white/20 scale-105' : 'bg-transparent border-white/5 opacity-60'}`}>
                      <div className="flex items-center gap-3">
                        <Avatar className={`border-2 ${p.symbol === 'X' ? 'border-cyan-500' : 'border-magenta-500'}`}>
                          <AvatarFallback className="bg-slate-800 text-white font-bold">{p.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-white">{p.username}</p>
                          <p className={`text-[10px] font-black ${p.symbol === 'X' ? 'text-cyan-400' : 'text-magenta-400'}`}>PILOTING {p.symbol}</p>
                        </div>
                      </div>
                      <Zap className={`w-4 h-4 ${currentPlayer === p.symbol ? 'text-yellow-400 animate-pulse' : 'text-slate-700'}`} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white/5 border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Sector Stability</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>Board Coverage</span>
                      <span>{board.filter(c => c !== null).length}/9</span>
                    </div>
                    <Progress value={(board.filter(c => c !== null).length / 9) * 100} className="h-1.5 bg-slate-800" />
                  </div>

                  {gameState === 'finished' && (
                    <div className="space-y-3 pt-4">
                      <Button onClick={playAgain} className="w-full bg-white text-black font-black h-12 rounded-xl hover:bg-cyan-400 transition-colors">
                        RE-INITIALIZE
                      </Button>
                      <Link href="/dashboard" className="block w-full">
                        <Button variant="ghost" className="w-full text-slate-400 hover:text-white font-bold">RETURN TO NEXUS</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; }
        .glow { filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.5)); }
      `}</style>
    </div>
  )
}