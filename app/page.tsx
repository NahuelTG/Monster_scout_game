"use client"

import { useState } from "react"
import HomeScreen from "@/components/home-screen"
import GameScreen from "@/components/game-screen"
import FinalScreen from "@/components/final-screen"

export default function MonsterUniversityScout() {
  const [currentScreen, setCurrentScreen] = useState("home") // "home", "game", "final"
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)

  const handleTeamSelect = (team) => {
    setSelectedTeam(team)
  }

  const handleStartGame = () => {
    if (selectedTeam) {
      setCurrentScreen("game")
      setCurrentQuestion(0)
    }
  }

  const handleQuestionComplete = () => {
    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setGameCompleted(true)
      setCurrentScreen("final")
    }
  }

  const handleRestart = () => {
    setCurrentScreen("home")
    setSelectedTeam(null)
    setCurrentQuestion(0)
    setGameCompleted(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-green-400">
      {currentScreen === "home" && (
        <HomeScreen selectedTeam={selectedTeam} onTeamSelect={handleTeamSelect} onStartGame={handleStartGame} />
      )}

      {currentScreen === "game" && (
        <GameScreen
          team={selectedTeam}
          questionIndex={currentQuestion}
          onQuestionComplete={handleQuestionComplete}
          onRestart={handleRestart}
        />
      )}

      {currentScreen === "final" && <FinalScreen team={selectedTeam} onRestart={handleRestart} />}
    </div>
  )
}
