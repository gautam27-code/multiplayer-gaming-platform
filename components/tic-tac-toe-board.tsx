"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Player = "X" | "O" | null
type Winner = "X" | "O" | "draw" | null

interface TicTacToeBoardProps {
  onGameEnd?: (winner: Winner) => void
  disabled?: boolean
  className?: string
}

export function TicTacToeBoard({ onGameEnd, disabled = false, className = "" }: TicTacToeBoardProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Winner>(null)

  useEffect(() => {
    const gameWinner = checkWinner(board)
    if (gameWinner) {
      setWinner(gameWinner)
      onGameEnd?.(gameWinner)
    } else if (board.every((cell) => cell !== null)) {
      setWinner("draw")
      onGameEnd?.("draw")
    }
  }, [board, onGameEnd])

  const checkWinner = (board: Player[]): Winner => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const handleCellClick = (index: number) => {
    if (board[index] || winner || disabled) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Game Status */}
      <div className="text-center space-y-2">
        {winner ? (
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {winner === "draw" ? "It's a Draw!" : `Player ${winner} Wins!`}
            </div>
            <Button onClick={resetGame} className="bg-primary hover:bg-primary/90 glow-hover">
              Play Again
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">Current Player:</span>
            <Badge className={`${currentPlayer === "X" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
              {currentPlayer}
            </Badge>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={disabled || cell !== null || winner !== null}
            className={`
              aspect-square w-full h-20 rounded-xl glass border-white/20 
              flex items-center justify-center text-3xl font-bold
              transition-all duration-300 hover:scale-105 glow-hover
              ${cell === "X" ? "text-primary" : "text-accent"}
              ${!disabled && !cell && !winner ? "hover:bg-primary/10" : ""}
              ${cell || winner ? "cursor-default" : "cursor-pointer"}
            `}
          >
            {cell && (
              <span className={`animate-in zoom-in-50 duration-300 ${cell === "X" ? "text-primary" : "text-accent"}`}>
                {cell}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-lg font-bold text-primary">{board.filter((cell) => cell === "X").length}</div>
          <div className="text-xs text-muted-foreground">X Moves</div>
        </div>
        <div className="text-center p-3 bg-muted/20 rounded-lg">
          <div className="text-lg font-bold">{board.filter((cell) => cell !== null).length}/9</div>
          <div className="text-xs text-muted-foreground">Progress</div>
        </div>
        <div className="text-center p-3 bg-accent/10 rounded-lg">
          <div className="text-lg font-bold text-accent">{board.filter((cell) => cell === "O").length}</div>
          <div className="text-xs text-muted-foreground">O Moves</div>
        </div>
      </div>
    </div>
  )
}
