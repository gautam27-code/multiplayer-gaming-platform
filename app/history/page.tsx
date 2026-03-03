"use client"

import React, { useState, useEffect, useRef } from "react"
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
  Activity,
  Zap,
  Users
} from "lucide-react"
import Link from "next/link"

interface GameMatch {
  id: string
  game: "Tic-Tac-Toe" | "Chess" | "Connect 4" | string
  opponent: {
    username: string
    avatar: string
    level: number
  }
  result: "win" | "loss" | "draw" | string
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

  // Animation States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: any[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    let animationId: number;
    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`; // Silver/Slate particles
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
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const [matches] = useState<GameMatch[]>([
    {
      id: "1",
      game: "Tic-Tac-Toe",
      opponent: { username: "player22", avatar: "", level: 12 },
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
      opponent: { username: "player33", avatar: "", level: 18 },
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
      opponent: { username: "player44", avatar: "", level: 8 },
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
      opponent: { username: "player55", avatar: "", level: 15 },
      result: "draw",
      score: "1-1",
      duration: "4:28",
      pointsGained: 5,
      date: "1 day ago",
      moves: 9,
      accuracy: 78,
      roomName: "Tournament Practice",
    },
  ])

  const filteredMatches = matches.filter((match) => {
    const gameMatch = gameFilter === "all" || match.game === gameFilter
    const resultMatch = resultFilter === "all" || match.result === resultFilter
    return gameMatch && resultMatch
  })

  const stats = {
    totalGames: matches.length,
    wins: matches.filter((m) => m.result === "win").length,
    winRate: Math.round((matches.filter((m) => m.result === "win").length / matches.length) * 100),
    totalPoints: matches.reduce((acc, match) => acc + match.pointsGained, 0),
    avgAccuracy: 84,
    bestStreak: 4,
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Archive Ambient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-blue-900/20 z-0 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Silver Cursor Glow */}
      <div
        className="fixed w-8 h-8 bg-slate-400/20 rounded-full blur-xl pointer-events-none z-50 transition-transform duration-100"
        style={{ left: mousePos.x - 16, top: mousePos.y - 16 }}
      />

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b border-slate-500/20 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-400 hover:text-white border border-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" /> DASHBOARD
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-slate-400" />
              <span className="text-xl font-black tracking-widest uppercase bg-gradient-to-r from-slate-200 to-slate-500 bg-clip-text text-transparent">Combat Logs</span>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">NEURAL ARCHIVES</h1>
            <p className="text-slate-500 font-bold tracking-[0.2em] text-xs uppercase">Post-Match Performance Analysis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9 space-y-8">

              {/* Performance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Success Rate', val: `${stats.winRate}%`, icon: Trophy, color: 'text-blue-400' },
                  { label: 'Total Conflicts', val: stats.totalGames, icon: Activity, color: 'text-slate-400' },
                  { label: 'Net Yield', val: `${stats.totalPoints} XP`, icon: Zap, color: 'text-yellow-400' },
                  { label: 'Precision', val: `${stats.avgAccuracy}%`, icon: Target, color: 'text-emerald-400' },
                ].map((s, i) => (
                  <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-all">
                    <CardContent className="p-6">
                      <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
                      <p className="text-2xl font-black text-white">{s.val}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <Select value={gameFilter} onValueChange={setGameFilter}>
                  <SelectTrigger className="w-44 bg-black/40 border-white/10 text-slate-300">
                    <SelectValue placeholder="Game Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20">
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="Tic-Tac-Toe">Tic-Tac-Toe</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="w-44 bg-black/40 border-white/10 text-slate-300">
                    <SelectValue placeholder="Outcome" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20">
                    <SelectItem value="all">All Outcomes</SelectItem>
                    <SelectItem value="win">Victories</SelectItem>
                    <SelectItem value="loss">Defeats</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Logs List */}
              <div className="space-y-4">
                {filteredMatches.map((match) => (
                  <div key={match.id} className="relative group">
                    <div className="absolute inset-0 bg-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-2 h-12 rounded-full ${match.result === 'win' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`} />
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-black text-white uppercase tracking-tighter">{match.game}</span>
                            <Badge variant="outline" className={`text-[10px] font-black ${match.result === 'win' ? 'border-blue-500/50 text-blue-400' : 'border-slate-700 text-slate-500'}`}>
                              {match.result.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> VS {match.opponent.username}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {match.duration}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {match.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-xl font-black text-white tabular-nums">{match.score}</p>
                          <p className={`text-[10px] font-black ${match.pointsGained > 0 ? 'text-blue-400' : 'text-slate-600'}`}>
                            {match.pointsGained > 0 ? '+' : ''}{match.pointsGained} NODE XP
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/10 transition-colors">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMatches.length === 0 && (
                  <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                    <History className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-black text-white tracking-widest uppercase mb-2">No Combat Data Found</h3>
                    <p className="text-slate-500 text-sm font-bold">Deploy to a sector to generate telemetry.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Achievements */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="bg-white/5 border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Recent Awards</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Nexus Streak', desc: '4 Consecutive Wins', icon: Crown, color: 'text-yellow-500' },
                    { title: 'Zero Defect', desc: '95% Combat Accuracy', icon: Award, color: 'text-blue-400' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <a.icon className={`w-8 h-8 ${a.color}`} />
                      <div>
                        <p className="text-xs font-black text-white uppercase">{a.title}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Link href="/rooms" className="block">
                <Button className="w-full bg-white text-black font-black h-14 rounded-2xl hover:bg-blue-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  RE-ENGAGE TARGETS
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        body { background: #000; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  )
}