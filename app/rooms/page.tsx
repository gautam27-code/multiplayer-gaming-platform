"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gamepad2, Users, Search, Plus, ArrowLeft, Play, Crown, Target, Clock, Filter, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/stores/auth"
import { gameApi } from "@/lib/api"

export default function GameRooms() {
  const [searchTerm, setSearchTerm] = useState("")
  const [gameFilter, setGameFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [rooms, setRooms] = useState<any[]>([])
  const { token } = useAuthStore()

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

  // 2. Particle Canvas (Emerald/Lime Theme)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

    let animationId: number;
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
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
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const fetchRooms = async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const data = await gameApi.getAvailableRooms(token)
      const mapped = (data as any[]).map((g) => {
        const playersCount = Array.isArray(g.players) ? g.players.length : 0
        const status = g.status === 'in-progress' ? 'playing' : 'waiting'
        return {
          id: g._id,
          roomCode: g.roomCode,
          name: g.name || 'Unnamed Room',
          game: g.type === 'tic-tac-toe' ? 'Tic-Tac-Toe' : g.type,
          host: g.players?.[0]?.user?.username || 'host',
          players: playersCount,
          maxPlayers: 2,
          status: playersCount >= 2 ? 'full' : status,
          isPrivate: false,
          createdAt: new Date(g.createdAt).toLocaleTimeString(),
        }
      })
      setRooms(mapped)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [token])

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = (room.name || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      (room.host || "").toLowerCase().includes((searchTerm || "").toLowerCase())
    const matchesGame = gameFilter === "all" || room.game === gameFilter
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    return matchesSearch && matchesGame && matchesStatus
  })

  const handleJoinRoom = async (room: any) => {
    if (!token) return
    try {
      const joined = await gameApi.joinRoom(token, room.roomCode)
      const game = (joined as any).game
      window.location.href = `/game/${game._id}`
    } catch (e) { console.error(e) }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Emerald/Green Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-lime-500/10 z-0 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-lime-500/15 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Cursor Glow */}
      <div
        className="fixed w-8 h-8 bg-emerald-400/30 rounded-full blur-xl pointer-events-none z-50 transition-transform duration-100"
        style={{ left: mousePos.x - 16, top: mousePos.y - 16 }}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-emerald-500/30 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-emerald-400 hover:text-white hover:bg-emerald-500/20 border border-emerald-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">COMBAT SECTORS</span>
                </div>
              </div>
              <Link href="/rooms/create">
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105">
                  <Plus className="w-5 h-5 mr-2" /> INITIALIZE SECTOR
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-600 bg-clip-text text-transparent mb-2 uppercase tracking-tighter">
              Available Sectors
            </h1>
            <p className="text-emerald-300/60 font-medium tracking-widest text-sm">SCANNING FOR ACTIVE MULTIPLAYER NODES...</p>
          </div>

          {/* Filters */}
          <Card className="bg-black/60 backdrop-blur-xl border-emerald-500/20 rounded-3xl mb-12 p-2">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                  <Input
                    placeholder="Search Sectors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-emerald-500/5 border-emerald-500/20 text-emerald-100 placeholder:text-emerald-900 focus:border-emerald-400 transition-all"
                  />
                </div>
                <Select value={gameFilter} onValueChange={setGameFilter}>
                  <SelectTrigger className="bg-emerald-500/5 border-emerald-500/20 text-emerald-400">
                    <SelectValue placeholder="All Games" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-emerald-500/20 text-emerald-100">
                    <SelectItem value="all">All Games</SelectItem>
                    <SelectItem value="Tic-Tac-Toe">Tic-Tac-Toe</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-emerald-500/5 border-emerald-500/20 text-emerald-400">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-emerald-500/20 text-emerald-100">
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="playing">Occupied</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" onClick={fetchRooms} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  SYNC DATA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Sectors', val: rooms.length, icon: Users, colorClasses: 'bg-emerald-500/10 text-emerald-400' },
              { label: 'Deployable', val: rooms.filter(r => r.status === "waiting").length, icon: Play, colorClasses: 'bg-lime-500/10 text-lime-400' },
              { label: 'Active Wars', val: rooms.filter(r => r.status === "playing").length, icon: Target, colorClasses: 'bg-orange-500/10 text-orange-400' },
              { label: 'Warriors', val: rooms.reduce((acc, r) => acc + r.players, 0), icon: Crown, colorClasses: 'bg-emerald-500/10 text-emerald-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl backdrop-blur-sm group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${stat.colorClasses.split(' ')[0]}`}>
                    <stat.icon className={`w-6 h-6 ${stat.colorClasses.split(' ')[1]}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-white">{stat.val}</p>
                    <p className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className="bg-black/40 backdrop-blur-xl border-emerald-500/20 hover:border-emerald-400/50 transition-all group overflow-hidden rounded-3xl">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-lime-500 opacity-30 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Target className="w-8 h-8 text-emerald-400" />
                    </div>
                    <Badge className={room.status === 'waiting' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400'}>
                      {room.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                    {room.name}
                  </h3>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-2 text-emerald-300/50 text-xs font-bold uppercase">
                      <Gamepad2 className="w-4 h-4" /> {room.game}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-300/50 text-xs font-bold uppercase">
                      <Users className="w-4 h-4" /> HOST: <span className="text-emerald-400">{room.host}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-300/50 text-xs font-bold uppercase">
                      <Clock className="w-4 h-4" /> SYNCED: {room.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-emerald-500/10">
                    <div className="text-center">
                      <p className="text-xl font-black text-white">{room.players}/{room.maxPlayers}</p>
                      <p className="text-[10px] font-bold text-emerald-500/40 uppercase">Capacitors</p>
                    </div>
                    <Button
                      onClick={() => handleJoinRoom(room)}
                      disabled={room.status !== "waiting" || isLoading}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      {room.status === "waiting" ? "ENGAGE" : "LOCKED"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        body { background: black; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #10b98133; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #10b98166; }
      `}</style>
    </div>
  )
}