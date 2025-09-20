"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Gamepad2, ArrowLeft, Plus, Users, Lock, Globe, Target, Crown, Zap } from "lucide-react"
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

  const games = [
    {
      id: "tic-tac-toe",
      name: "Tic-Tac-Toe",
      description: "Classic 3x3 strategy game",
      icon: Target,
      available: true,
    },
    {
      id: "chess",
      name: "Chess",
      description: "Strategic board game",
      icon: Crown,
      available: false,
    },
    {
      id: "connect-4",
      name: "Connect 4",
      description: "Connect four in a row",
      icon: Zap,
      available: false,
    },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCreateRoom = async () => {
    if (!formData.name || !formData.game) {
      return
    }

    setIsCreating(true)

    // Simulate room creation
    setTimeout(() => {
      setIsCreating(false)
      // Navigate to the created room
      router.push(`/game/room-${Date.now()}`)
    }, 2000)
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
                  Back to Rooms
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Plus className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Create Room</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Game Room</h1>
          <p className="text-muted-foreground">Set up your room and invite friends to play</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Settings */}
          <Card className="glass glow-hover border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                Room Settings
              </CardTitle>
              <CardDescription>Configure your game room preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Room Name */}
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Name *</Label>
                <Input
                  id="room-name"
                  placeholder="Enter room name..."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="glass border-white/20 focus:border-primary/50"
                />
              </div>

              {/* Game Selection */}
              <div className="space-y-2">
                <Label htmlFor="game-select">Game Type *</Label>
                <Select value={formData.game} onValueChange={(value) => handleInputChange("game", value)}>
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id} disabled={!game.available}>
                        <div className="flex items-center gap-2">
                          <game.icon className="w-4 h-4" />
                          <span>{game.name}</span>
                          {!game.available && <span className="text-xs text-muted-foreground">(Coming Soon)</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Max Players */}
              <div className="space-y-2">
                <Label htmlFor="max-players">Maximum Players</Label>
                <Select value={formData.maxPlayers} onValueChange={(value) => handleInputChange("maxPlayers", value)}>
                  <SelectTrigger className="glass border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Players</SelectItem>
                    <SelectItem value="4">4 Players</SelectItem>
                    <SelectItem value="6">6 Players</SelectItem>
                    <SelectItem value="8">8 Players</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      {formData.isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      Private Room
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.isPrivate ? "Only invited players can join" : "Anyone can join this room"}
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => handleInputChange("isPrivate", checked)}
                  />
                </div>

                {formData.isPrivate && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Room Password (Optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password..."
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="glass border-white/20 focus:border-primary/50"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for your room..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="glass border-white/20 focus:border-primary/50 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview & Actions */}
          <div className="space-y-6">
            {/* Room Preview */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle>Room Preview</CardTitle>
                <CardDescription>How your room will appear to other players</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      {formData.game && games.find((g) => g.id === formData.game) ? (
                        React.createElement(games.find((g) => g.id === formData.game)!.icon, {
                          className: "w-6 h-6 text-primary",
                        })
                      ) : (
                        <Gamepad2 className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{formData.name || "Room Name"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.game ? games.find((g) => g.id === formData.game)?.name : "No game selected"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>0/{formData.maxPlayers} players</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {formData.isPrivate ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Private</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4" />
                          <span>Public</span>
                        </>
                      )}
                    </div>
                  </div>

                  {formData.description && (
                    <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">{formData.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="glass glow-hover border-white/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    onClick={handleCreateRoom}
                    disabled={!formData.name || !formData.game || isCreating}
                    className="w-full bg-primary hover:bg-primary/90 glow-hover"
                    size="lg"
                  >
                    {isCreating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Room...
                      </div>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Room
                      </>
                    )}
                  </Button>

                  <Link href="/rooms">
                    <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
