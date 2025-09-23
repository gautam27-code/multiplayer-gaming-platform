"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Gamepad2,
  ArrowLeft,
  Users,
  UserPlus,
  Search,
  Check,
  X,
  MessageCircle,
  Play,
  Crown,
  Clock,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useAuthStore } from "@/lib/stores/auth"
import { authApi } from "@/lib/api"

type FriendStatus = "online" | "in-game" | "offline"
type RequestStatus = "pending" | "sent"

interface Friend {
  id: string
  username: string
  avatar: string
  status: FriendStatus
  lastSeen?: string
  currentGame?: string
  level: number
  winRate: number
}

interface FriendRequest {
  id: string
  username: string
  avatar: string
  type: RequestStatus
  sentAt: string
  mutualFriends: number
}

export default function FriendsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Friend[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const { token } = useAuthStore()

  useEffect(() => {
    const fetchSocial = async () => {
      try {
        if (!token) return
        const profile: any = await authApi.getProfile(token)
        const mappedFriends: Friend[] = (profile.friends || []).map((f: any) => ({
          id: f.user._id,
          username: f.user.username,
          avatar: "/placeholder.svg",
          status: f.user.isOnline ? (f.user.currentGame ? "in-game" : "online") : "offline",
          lastSeen: f.user.lastActive ? new Date(f.user.lastActive).toLocaleString() : undefined,
          currentGame: f.user.currentGame ? "Tic-Tac-Toe" : undefined,
          level: Math.max(1, Math.floor((f.user.stats?.wins || 0) / 5)),
          winRate: Math.round((f.user.stats?.winRate || 0) * 10) / 10,
        }))
        setFriends(mappedFriends)
        const mappedReqs: FriendRequest[] = (profile.friendRequests || []).map((r: any) => ({
          id: r._id,
          username: r.from?.username || 'player',
          avatar: "/placeholder.svg",
          type: r.status === 'pending' ? 'pending' : 'sent',
          sentAt: '',
          mutualFriends: 0,
        }))
        setFriendRequests(mappedReqs)
      } catch (e) {
        console.error(e)
      }
    }
    fetchSocial()
  }, [token])

  const onlineFriends = friends.filter((f) => f.status === "online")
  const inGameFriends = friends.filter((f) => f.status === "in-game")
  const pendingRequests = friendRequests.filter((r) => r.type === "pending")
  const sentRequests = friendRequests.filter((r) => r.type === "sent")

  const getStatusColor = (status: FriendStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "in-game":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
    }
  }

  const getStatusText = (friend: Friend) => {
    switch (friend.status) {
      case "online":
        return "Online"
      case "in-game":
        return `Playing ${friend.currentGame}`
      case "offline":
        return `Last seen ${friend.lastSeen}`
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    // Simulate search
    setTimeout(() => {
      const mockResults: Friend[] = [
        {
          id: "search1",
          username: "newplayer1",
          avatar: "/placeholder.svg?key=search1",
          status: "online",
          level: 10,
          winRate: 60,
        },
        {
          id: "search2",
          username: "newplayer2",
          avatar: "/placeholder.svg?key=search2",
          status: "offline",
          lastSeen: "1 hour ago",
          level: 5,
          winRate: 40,
        },
      ]
      setSearchResults(mockResults.filter((p) => p.username.includes(searchTerm.toLowerCase())))
      setIsSearching(false)
    }, 1000)
  }

  const handleFriendRequest = (action: "accept" | "decline", requestId: string) => {
    console.log(`${action} friend request ${requestId}`)
  }

  const sendFriendRequest = (userId: string) => {
    console.log(`Send friend request to ${userId}`)
  }

  const inviteToGame = (friendId: string) => {
    console.log(`Invite ${friendId} to game`)
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
                <Users className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">Friends</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Friends & Social</h1>
          <p className="text-muted-foreground">Connect with players and build your gaming network</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="friends" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 glass">
                <TabsTrigger value="friends" className="data-[state=active]:bg-primary/20">
                  Friends ({friends.length})
                </TabsTrigger>
                <TabsTrigger value="requests" className="data-[state=active]:bg-primary/20">
                  Requests ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="find" className="data-[state=active]:bg-primary/20">
                  Find Friends
                </TabsTrigger>
              </TabsList>

              {/* Friends List */}
              <TabsContent value="friends" className="space-y-6">
                {/* Online Friends */}
                {onlineFriends.length > 0 && (
                  <Card className="glass glow-hover border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        Online Now ({onlineFriends.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {onlineFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-4 bg-card/50 rounded-lg hover:bg-card/70 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="w-12 h-12 ring-2 ring-primary/30">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-primary/20 text-primary">
                                  {friend.username.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                                  friend.status,
                                )} rounded-full border-2 border-background`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{friend.username}</span>
                                <Badge variant="outline" className="text-xs">
                                  Lv.{friend.level}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{getStatusText(friend)}</div>
                              <div className="text-xs text-muted-foreground">{friend.winRate}% win rate</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => inviteToGame(friend.id)}
                              className="bg-primary hover:bg-primary/90 glow-hover"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Invite
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* In-Game Friends */}
                {inGameFriends.length > 0 && (
                  <Card className="glass glow-hover border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gamepad2 className="w-5 h-5 text-yellow-500" />
                        In Game ({inGameFriends.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {inGameFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between p-4 bg-card/50 rounded-lg hover:bg-card/70 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="w-12 h-12 ring-2 ring-yellow-500/30">
                                <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-yellow-500/20 text-yellow-500">
                                  {friend.username.slice(0, 1).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                                  friend.status,
                                )} rounded-full border-2 border-background`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{friend.username}</span>
                                <Badge variant="outline" className="text-xs">
                                  Lv.{friend.level}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{getStatusText(friend)}</div>
                              <div className="text-xs text-muted-foreground">{friend.winRate}% win rate</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>
                              <Gamepad2 className="w-4 h-4 mr-1" />
                              In Game
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* All Friends */}
                <Card className="glass glow-hover border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      All Friends ({friends.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-4 bg-card/50 rounded-lg hover:bg-card/70 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12 ring-2 ring-primary/30">
                              <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {friend.username.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                                friend.status,
                              )} rounded-full border-2 border-background`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{friend.username}</span>
                              <Badge variant="outline" className="text-xs">
                                Lv.{friend.level}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">{getStatusText(friend)}</div>
                            <div className="text-xs text-muted-foreground">{friend.winRate}% win rate</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {friend.status === "online" ? (
                            <Button
                              size="sm"
                              onClick={() => inviteToGame(friend.id)}
                              className="bg-primary hover:bg-primary/90 glow-hover"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Invite
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>
                              <Clock className="w-4 h-4 mr-1" />
                              Offline
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Friend Requests */}
              <TabsContent value="requests" className="space-y-6">
                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                  <Card className="glass glow-hover border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Pending Requests ({pendingRequests.length})
                      </CardTitle>
                      <CardDescription>Players who want to be your friend</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {pendingRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 bg-card/50 rounded-lg hover:bg-card/70 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 ring-2 ring-primary/30">
                              <AvatarImage src={request.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-primary/20 text-primary">
                                {request.username.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{request.username}</span>
                                {request.mutualFriends > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {request.mutualFriends} mutual
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">Sent {request.sentAt}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleFriendRequest("accept", request.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFriendRequest("decline", request.id)}
                              className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Sent Requests */}
                {sentRequests.length > 0 && (
                  <Card className="glass glow-hover border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        Sent Requests ({sentRequests.length})
                      </CardTitle>
                      <CardDescription>Requests you've sent to other players</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {sentRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-4 bg-card/50 rounded-lg hover:bg-card/70 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12 ring-2 ring-muted/30">
                              <AvatarImage src={request.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-muted/20 text-muted-foreground">
                                {request.username.slice(0, 1).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-semibold">{request.username}</span>
                              <div className="text-sm text-muted-foreground">Sent {request.sentAt}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-muted-foreground">
                            Pending
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {pendingRequests.length === 0 && sentRequests.length === 0 && (
                  <Card className="glass glow-hover border-white/20">
                    <CardContent className="p-8 text-center">
                      <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No friend requests</h3>
                      <p className="text-muted-foreground">
                        When you send or receive friend requests, they'll appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Find Friends */}
              <TabsContent value="find" className="space-y-6">
                <Card className="glass glow-hover border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      Find New Friends
                    </CardTitle>
                    <CardDescription>Search for players by username</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by username..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                          className="pl-10 glass border-white/20 focus:border-primary/50"
                        />
                      </div>
                      <Button
                        onClick={handleSearch}
                        disabled={!searchTerm.trim() || isSearching}
                        className="bg-primary hover:bg-primary/90 glow-hover"
                      >
                        {isSearching ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {searchResults.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Search Results</h4>
                        {searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-card/50 rounded-lg hover:bg-card/70 transition-all duration-300"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <Avatar className="w-12 h-12 ring-2 ring-primary/30">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-primary/20 text-primary">
                                    {user.username.slice(0, 1).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(
                                    user.status,
                                  )} rounded-full border-2 border-background`}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{user.username}</span>
                                  <Badge variant="outline" className="text-xs">
                                    Lv.{user.level}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">{getStatusText(user)}</div>
                                <div className="text-xs text-muted-foreground">{user.winRate}% win rate</div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => sendFriendRequest(user.id)}
                              className="bg-primary hover:bg-primary/90 glow-hover"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Add Friend
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="glass glow-hover border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">Friend Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-xl font-bold text-primary">{friends.length}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <div className="text-xl font-bold text-green-500">{onlineFriends.length}</div>
                    <div className="text-xs text-muted-foreground">Online</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
                    <div className="text-xl font-bold text-yellow-500">{inGameFriends.length}</div>
                    <div className="text-xs text-muted-foreground">In Game</div>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-xl font-bold text-accent">{pendingRequests.length}</div>
                    <div className="text-xs text-muted-foreground">Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass glow-hover border-white/20">
              <CardContent className="p-4 space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90 glow-hover">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Friends
                </Button>
                <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Group Chat
                </Button>
                <Button variant="outline" className="w-full glass border-white/20 bg-transparent">
                  <Crown className="w-4 h-4 mr-2" />
                  Create Tournament
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
