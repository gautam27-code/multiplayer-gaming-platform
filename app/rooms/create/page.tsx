"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Gamepad2, ArrowLeft, Plus, Users, Lock, Globe, Target, Crown, Zap, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateRoom() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    maxPlayers: "2",
    isPrivate: false,
    password: "",
    description: "",
  })

  // Animation States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle Canvas (Indigo/Violet Theme)
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
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
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
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
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

  const games = [
    { id: "tic-tac-toe", name: "Tic-Tac-Toe", description: "Classic 3x3 strategy", icon: Target, available: true },
    { id: "chess", name: "Chess", description: "Strategic board game", icon: Crown, available: false },
    { id: "connect-4", name: "Connect 4", description: "Four in a row", icon: Zap, available: false },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const { token } = require("@/lib/stores/auth").useAuthStore()
  const { gameApi } = require("@/lib/api")

  const handleCreateRoom = async () => {
    if (!formData.name || !formData.game) return
    setIsCreating(true)
    try {
      const typeMap: Record<string, string> = { 'tic-tac-toe': 'tic-tac-toe', 'chess': 'chess', 'connect-4': 'connect4' }
      const res = await gameApi.createRoom(token, { name: formData.name, type: typeMap[formData.game] || 'tic-tac-toe' })
      const gameId = (res as any).game?._id
      if (gameId) router.push(`/game/${gameId}`)
    } catch (e) {
      console.error(e)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Indigo/Violet Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10 z-0 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-violet-500/15 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" style={{ animationDelay: '1s' }} />

      <div
        className="fixed w-8 h-8 bg-violet-400/30 rounded-full blur-xl pointer-events-none z-50 transition-transform duration-100"
        style={{ left: mousePos.x - 16, top: mousePos.y - 16 }}
      />

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 border-b border-violet-500/30 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/rooms">
              <Button variant="ghost" className="text-violet-400 hover:text-white hover:bg-violet-500/20 border border-violet-500/20">
                <ArrowLeft className="w-4 h-4 mr-2" /> EXIT FORGE
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
              <span className="text-xl font-black tracking-widest bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent uppercase">Sector Creator</span>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tighter uppercase">
              Establish Command
            </h1>
            <p className="text-violet-300/60 font-bold tracking-[0.3em] text-xs uppercase">Initializing New Multiplayer Protocol</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-black/60 backdrop-blur-xl border-violet-500/20 rounded-3xl p-4 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-violet-400 text-lg uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-black text-violet-300/70 uppercase">Sector Designation</Label>
                    <Input
                      placeholder="Enter room name..."
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-violet-500/5 border-violet-500/20 text-violet-100 focus:border-violet-400 h-12"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-violet-300/70 uppercase">Core Logic</Label>
                      <Select value={formData.game} onValueChange={(v) => handleInputChange("game", v)}>
                        <SelectTrigger className="bg-violet-500/5 border-violet-500/20 text-violet-400 h-12">
                          <SelectValue placeholder="Select Game" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-violet-500/20 text-violet-100">
                          {games.map((g) => (
                            <SelectItem key={g.id} value={g.id} disabled={!g.available}>{g.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-black text-violet-300/70 uppercase">Warrior Limit</Label>
                      <Select value={formData.maxPlayers} onValueChange={(v) => handleInputChange("maxPlayers", v)}>
                        <SelectTrigger className="bg-violet-500/5 border-violet-500/20 text-violet-400 h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-violet-500/20 text-violet-100">
                          {["2", "4", "8"].map(num => <SelectItem key={num} value={num}>{num} Players</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-violet-500/5 rounded-2xl border border-violet-500/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2 text-violet-200">
                          {formData.isPrivate ? <Lock className="w-4 h-4 text-violet-400" /> : <Globe className="w-4 h-4 text-violet-400" />}
                          <span className="font-bold uppercase text-xs">Encryption Protocol</span>
                        </Label>
                        <p className="text-[10px] text-violet-400/50 uppercase font-bold tracking-tight">
                          {formData.isPrivate ? "Access Restricted" : "Open Transmission"}
                        </p>
                      </div>
                      <Switch
                        checked={formData.isPrivate}
                        onCheckedChange={(checked) => handleInputChange("isPrivate", checked)}
                        className="data-[state=checked]:bg-violet-500"
                      />
                    </div>
                    {formData.isPrivate && (
                      <Input
                        type="password"
                        placeholder="Access Key..."
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="bg-black/40 border-violet-500/20"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border-violet-400/30 rounded-3xl p-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-20 h-20 text-white" />
                </div>
                <CardHeader>
                  <CardTitle className="text-white font-black uppercase tracking-widest text-sm">Deployment Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center border border-violet-500/40">
                      {formData.game && games.find(g => g.id === formData.game) ? (
                        React.createElement(games.find(g => g.id === formData.game)!.icon, { className: "w-8 h-8 text-violet-400" })
                      ) : <Gamepad2 className="w-8 h-8 text-violet-400" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">
                        {formData.name || "UNNAMED_SECTOR"}
                      </h3>
                      <p className="text-violet-400 font-bold text-xs">
                        {formData.game ? games.find(g => g.id === formData.game)?.name : "READY_FOR_LOGIC"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-violet-500/20">
                    <div>
                      <p className="text-[10px] font-black text-violet-400/40 uppercase">Loadout</p>
                      <p className="text-white font-bold">{formData.maxPlayers} WARRIORS</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-violet-400/40 uppercase">Status</p>
                      <p className="text-white font-bold">{formData.isPrivate ? "ENCRYPTED" : "BROADCASTING"}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleCreateRoom}
                      disabled={!formData.name || !formData.game || isCreating}
                      className="w-full h-14 bg-violet-500 hover:bg-violet-400 text-black font-black text-lg rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? "ENCRYPTING..." : "INITIALIZE SECTOR"}
                    </Button>
                    <Link href="/rooms" className="block w-full">
                      <Button variant="ghost" className="w-full text-violet-400 font-bold hover:bg-violet-500/10 h-12 rounded-2xl">
                        ABORT MISSION
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        body { background: black; }
        .glass { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(12px); }
      `}</style>
    </div>
  )
}