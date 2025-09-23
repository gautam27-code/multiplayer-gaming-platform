"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gamepad2, Users, Search, Plus, ArrowLeft, Play, Crown, Target, Clock, Filter, RefreshCw } from "lucide-react"
import Link from "next/link"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/stores/auth"
import { gameApi } from "@/lib/api"

export default function GameRooms() {
  const [searchTerm, setSearchTerm] = useState("")
  const [gameFilter, setGameFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [rooms, setRooms] = useState<any[]>([])
  const { token } = useAuthStore()

  const fetchRooms = async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const data = await gameApi.getAvailableRooms(token)
      // Map API rooms to UI format
      const mapped = (data as any[]).map((g) => ({
        id: g._id,
        roomCode: g.roomCode,
        name: g.name,
        game: g.type === 'tic-tac-toe' ? 'Tic-Tac-Toe' : g.type,
        host: g.players?.[0]?.user?.username || 'host',
        players: g.players?.length || 1,
        maxPlayers: 2,
        status: 'waiting',
        isPrivate: false,
        createdAt: new Date(g.createdAt).toLocaleTimeString(),
      }))
      setRooms(mapped)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.host.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGame = gameFilter === "all" || room.game === gameFilter
    const matchesStatus = statusFilter === "all" || room.status === statusFilter

    return matchesSearch && matchesGame && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-green-500/20 text-green-500"
      case "playing":
        return "bg-yellow-500/20 text-yellow-500"
      case "full":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const handleJoinRoom = async (room: any) => {
    if (!token) return
    try {
      const joined = await gameApi.joinRoom(token, room.roomCode)
      const game = (joined as any).game
      window.location.href = `/game/${game._id}`
    } catch (e) {
      console.error(e)
    }
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
                <Gamepad2 className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Game Rooms</span>
              </div>
            </div>

            <Link href="/rooms/create">
              <Button className="bg-primary hover:bg-primary/90 glow-hover">
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Game Rooms</h1>
          <p className="text-muted-foreground">Join existing rooms or create your own to play with friends</p>
        </div>

        {/* Filters */}
        <Card className="glass glow-hover border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms or players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass border-white/20 focus:border-primary/50"
                />
              </div>

              <Select value={gameFilter} onValueChange={setGameFilter}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="All Games" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  <SelectItem value="Tic-Tac-Toe">Tic-Tac-Toe</SelectItem>
                  <SelectItem value="Chess">Chess</SelectItem>
                  <SelectItem value="Connect 4">Connect 4</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="playing">Playing</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="glass border-white/20 glow-hover bg-transparent" onClick={fetchRooms} disabled={isLoading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {isLoading ? 'Refreshing…' : 'Refresh'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Room Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass glow-hover border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{rooms.length}</div>
                  <div className="text-sm text-muted-foreground">Total Rooms</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass glow-hover border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{rooms.filter((r) => r.status === "waiting").length}</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass glow-hover border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{rooms.filter((r) => r.status === "playing").length}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass glow-hover border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{rooms.reduce((acc, room) => acc + room.players, 0)}</div>
                  <div className="text-sm text-muted-foreground">Active Players</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms List */}
        <div className="space-y-4">
          {filteredRooms.length === 0 ? (
            <Card className="glass glow-hover border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or create a new room to get started
                </p>
                <Link href="/rooms/create">
                  <Button className="bg-primary hover:bg-primary/90 glow-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Room
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="glass glow-hover border-white/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-primary" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{room.name}</h3>
                          {room.isPrivate && (
                            <Badge variant="outline" className="text-xs">
                              Private
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Gamepad2 className="w-4 h-4" />
                            {room.game}
                          </span>
                          <span className="flex items-center gap-1">
                            <Avatar className="w-4 h-4">
                              <AvatarFallback className="text-xs bg-primary/20 text-primary">
                                {room.host.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {room.host}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {room.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {room.players}/{room.maxPlayers}
                          </span>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(room.status)}`}>{room.status}</Badge>
                      </div>

                      <Button
                        onClick={() => handleJoinRoom(room)}
                        disabled={room.status === "full" || room.status === "playing" || isLoading}
                        className={`${room.status === "waiting" ? "bg-primary hover:bg-primary/90 glow-hover" : ""}`}
                        variant={room.status === "waiting" ? "default" : "outline"}
                      >
                        {room.status === "waiting" && (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Join Room
                          </>
                        )}
                        {room.status === "playing" && "In Progress"}
                        {room.status === "full" && "Room Full"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
