"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Users, History, LogOut, Play, Crown, Target, Clock, Star, Zap, Plus, Search, TrendingUp, Award, Flame, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';

export default function FuturisticDashboard() {
  const router = useRouter();
  const { user, logout, refreshProfile } = useAuthStore();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated cursor follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    refreshProfile();
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
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
        ctx.fillStyle = `rgba(0, 255, 255, ${p.opacity})`;
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const playerData = {
    username: user?.username || "CyberWarrior",
    level: Math.floor((user?.stats?.matchesPlayed || 0) / 10) + 1,
    xp: ((user?.stats?.matchesPlayed || 0) * 10) % 100,
    rank: user?.stats?.globalRank ? `#${user.stats.globalRank}` : "#---",
    coins: (user?.stats?.wins || 0) * 100 + (user?.stats?.matchesPlayed || 0) * 10,
    avatar: "/api/placeholder/100/100",
    stats: {
      matchesPlayed: user?.stats?.matchesPlayed || 0,
      wins: user?.stats?.wins || 0,
      losses: user?.stats?.losses || 0,
      winRate: user?.stats?.winRate ? Math.round(user.stats.winRate) : 0,
      points: (user?.stats?.wins || 0) * 50
    }
  };

  const games = [
    { name: "Tic-Tac-Toe", status: "live", players: 847, icon: Target, color: "cyan", link: "/rooms" },
    { name: "Chess Warfare", status: "hot", players: 1203, icon: Crown, color: "magenta", link: "/rooms" },
    { name: "Quantum Connect 4", status: "new", players: 432, icon: Zap, color: "purple", link: "/rooms" }
  ];

  const leaderboard = [
    { rank: 1, name: "QuantumKing", score: 98450, trend: "up" },
    { rank: 2, name: "NeonSamurai", score: 94230, trend: "up" },
    { rank: 3, name: "VoidHacker", score: 89100, trend: "down" },
    { rank: 4, name: user?.username || "CyberWarrior", score: playerData.stats.points, trend: "up", isUser: true }
  ];

  const news = [
    { title: "New Season Starts Soon!", date: "2 hours ago", category: "Event" },
    { title: "Server Maintenance Complete", date: "5 hours ago", category: "System" },
    { title: "Champion's League Finals", date: "1 day ago", category: "Esports" }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-magenta-500/10 z-0 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-magenta-500/20 rounded-full blur-[150px] animate-pulse z-0 pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Custom Cursor Glow */}
      <div
        className="fixed w-8 h-8 bg-cyan-400/30 rounded-full blur-xl pointer-events-none z-50 transition-transform duration-100"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
          transform: 'translate(0, 0)'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Holographic Navigation */}
        <nav className="sticky top-0 z-50 border-b border-cyan-500/30 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 group cursor-pointer mr-2 md:mr-0 shrink-0">
                <div className="relative">
                  <Gamepad2 className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.7)] transition-all group-hover:scale-110 group-hover:rotate-12" />
                  <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full animate-ping" />
                </div>
                <span className="text-xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 via-magenta-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                  Playtopia.
                </span>
              </div>

              <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0">
                {[
                  { icon: History, label: 'History...', link: '/history' },
                  { icon: Users, label: 'Squad', link: '/friends' },
                  { icon: Trophy, label: 'Leaderboard', link: '/leaderboard' },
                ].map((item, i) => (
                  <Link key={i} href={item.link} className="shrink-0">
                    <button className="group relative px-3 py-1.5 md:px-4 md:py-2 overflow-hidden rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="relative flex items-center gap-1.5 md:gap-2">
                        <item.icon className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                        <span className="text-xs md:text-sm font-semibold">{item.label}</span>
                      </div>
                    </button>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,0,100,0.5)]"
                >
                  <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-magenta-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              WELCOME BACK
            </h1>
            <p className="text-xl text-cyan-300/70 tracking-widest">{playerData.username}</p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Player Stats Card */}
            <div className="col-span-12 lg:col-span-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 hover:border-cyan-400 transition-all">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-magenta-500 p-1 animate-spin-slow">
                        <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                          <span className="text-3xl font-black bg-gradient-to-br from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
                            GG
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{playerData.username}</h3>
                      <p className="text-cyan-400 font-semibold">Level {playerData.level}</p>
                    </div>
                  </div>

                  {/* XP Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-cyan-400">XP Progress</span>
                      <span className="text-magenta-400 font-bold">{playerData.xp}%</span>
                    </div>
                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-cyan-500/30">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-magenta-400 to-purple-400 rounded-full shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-all duration-1000"
                        style={{ width: `${playerData.xp}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Rank', value: playerData.rank, icon: Trophy, color: 'cyan' },
                      { label: 'Coins', value: playerData.coins.toLocaleString(), icon: Star, color: 'yellow' },
                      { label: 'Wins', value: playerData.stats.wins, icon: Award, color: 'green' },
                      { label: 'Matches', value: playerData.stats.matchesPlayed, icon: Flame, color: 'magenta' }
                    ].map((stat, i) => (
                      <div key={i} className="relative group/stat">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl blur-sm group-hover/stat:blur-md transition-all" />
                        <div className="relative bg-gray-900/50 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400/50 transition-all">
                          <stat.icon className={`w-5 h-5 text-${stat.color}-400 mb-2`} />
                          <div className={`text-2xl font-black text-${stat.color}-400`}>{stat.value}</div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Win Rate Circle */}
                  <div className="relative">
                    <div className="text-center">
                      <div className="inline-block relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="56" stroke="rgba(0,255,255,0.1)" strokeWidth="8" fill="none" />
                          <circle
                            cx="64" cy="64" r="56"
                            stroke="url(#gradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            strokeDashoffset={`${2 * Math.PI * 56 * (1 - playerData.stats.winRate / 100)}`}
                            className="transition-all duration-1000"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#00ffff" />
                              <stop offset="100%" stopColor="#ff00ff" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div>
                            <div className="text-3xl font-black text-cyan-400">{playerData.stats.winRate}%</div>
                            <div className="text-xs text-gray-400">WIN RATE</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Library */}
            <div className="col-span-12 lg:col-span-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                <div className="relative bg-black/60 backdrop-blur-xl border border-magenta-500/30 rounded-3xl p-6 hover:border-magenta-400 transition-all h-full">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <Play className="w-6 h-6 text-magenta-400" />
                    <span className="bg-gradient-to-r from-magenta-400 to-purple-400 bg-clip-text text-transparent">
                      GAME ARENA
                    </span>
                  </h2>

                  <div className="space-y-4">
                    {games.map((game, i) => (
                      <Link key={i} href={game.link}>
                        <div
                          className="relative group/game cursor-pointer mb-4"
                          onMouseEnter={() => setActiveCard(i)}
                          onMouseLeave={() => setActiveCard(null)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 rounded-2xl blur-md group-hover/game:blur-lg transition-all" />
                          <div className="relative bg-gray-900/70 border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-400 transition-all transform hover:scale-[1.02] hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${game.color}-400/20 to-${game.color}-600/20 flex items-center justify-center border border-${game.color}-400/30`}>
                                  <game.icon className={`w-8 h-8 text-${game.color}-400`} />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-white mb-1">{game.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase bg-${game.color}-500/20 text-${game.color}-400 border border-${game.color}-400/30`}>
                                      {game.status}
                                    </span>
                                    <span className="text-sm text-gray-400">{game.players} online</span>
                                  </div>
                                </div>
                              </div>
                              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-magenta-500 hover:from-cyan-400 hover:to-magenta-400 font-bold shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:shadow-[0_0_40px_rgba(0,255,255,0.8)] transition-all hover:scale-110 active:scale-95">
                                PLAY
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                      { icon: Plus, label: 'Create', link: '/rooms/create' },
                      { icon: Search, label: 'Browse', link: '/rooms' },
                      { icon: Gamepad2, label: 'Solo', link: '/single-player' }
                    ].map((action, i) => (
                      <Link key={i} href={action.link}>
                        <button className="w-full relative group/btn overflow-hidden rounded-xl border border-cyan-500/30 hover:border-cyan-400 p-4 transition-all hover:scale-105">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-all" />
                          <action.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                          <div className="text-xs font-bold text-cyan-400">{action.label}</div>
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="col-span-12 lg:col-span-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl" />
                <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 hover:border-purple-400 transition-all h-full">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-purple-400" />
                    <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      TOP RANKED
                    </span>
                  </h2>

                  <div className="space-y-3">
                    {leaderboard.map((player, i) => (
                      <div
                        key={i}
                        className={`relative group/rank ${player.isUser ? 'ring-2 ring-cyan-400/50' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl blur-sm group-hover/rank:blur-md transition-all" />
                        <div className={`relative bg-gray-900/70 border ${player.isUser ? 'border-cyan-400/50' : 'border-purple-500/20'} rounded-xl p-4 hover:border-purple-400 transition-all`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${i < 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-700'} flex items-center justify-center font-black text-sm`}>
                                {player.rank}
                              </div>
                              <div>
                                <div className={`font-bold ${player.isUser ? 'text-cyan-400' : 'text-white'}`}>
                                  {player.name}
                                </div>
                                <div className="text-xs text-purple-400">
                                  {player.score.toLocaleString()} pts
                                </div>
                              </div>
                            </div>
                            <TrendingUp className={`w-5 h-5 ${player.trend === 'up' ? 'text-green-400' : 'text-red-400 transform rotate-180'}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link href="/leaderboard">
                    <button className="w-full mt-6 px-6 py-3 rounded-xl border border-purple-400/30 hover:border-purple-400 bg-purple-500/10 hover:bg-purple-500/20 font-bold text-purple-400 transition-all hover:scale-105">
                      VIEW FULL RANKS
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Latest News Section (Added for scrolling) */}
          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl" />
              <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                  <Newspaper className="w-8 h-8 text-cyan-400" />
                  COMING SOON!
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {news.map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-xl aspect-video mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <span className="px-2 py-1 rounded text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {item.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}