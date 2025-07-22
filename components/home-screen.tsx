"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const teams = [
  {
    id: "oozma-kappa",
    name: "Oozma Kappa",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    emoji: "👁️",
    description: "Los más amigables",
  },
  {
    id: "roar-omega-roar",
    name: "Roar Omega Roar",
    color: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    emoji: "🦁",
    description: "Los más populares",
  },
  {
    id: "eta-hiss-hiss",
    name: "Eta Hiss Hiss",
    color: "bg-pink-500",
    hoverColor: "hover:bg-pink-600",
    emoji: "🐍",
    description: "Las más elegantes",
  },
  {
    id: "pnk",
    name: "PNK",
    color: "bg-purple-600",
    hoverColor: "hover:bg-purple-700",
    emoji: "🎀",
    description: "Las más dulces",
  },
]

interface HomeScreenProps {
  selectedTeam: string | null
  onTeamSelect: (team: string) => void
  onStartGame: () => void
}

export default function HomeScreen({ selectedTeam, onTeamSelect, onStartGame }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">🎓 Monster University</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300 mb-2 drop-shadow-md">Scout Adventure</h2>
        <p className="text-lg text-white/90 drop-shadow-sm">¡Elige tu equipo y comienza la aventura!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        {teams.map((team) => (
          <Card
            key={team.id}
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedTeam === team.id ? "ring-4 ring-yellow-400 shadow-2xl" : "hover:shadow-xl"
            }`}
            onClick={() => onTeamSelect(team.id)}
          >
            <CardContent className={`${team.color} ${team.hoverColor} p-6 rounded-lg`}>
              <div className="text-center text-white">
                <div className="text-4xl mb-3">{team.emoji}</div>
                <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                <p className="text-sm opacity-90">{team.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={onStartGame}
        disabled={!selectedTeam}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl px-8 py-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        🚀 ¡Iniciar Juego!
      </Button>

      {selectedTeam && (
        <p className="text-white mt-4 text-center animate-bounce">
          ¡Perfecto! Has elegido {teams.find((t) => t.id === selectedTeam)?.name}
        </p>
      )}
    </div>
  )
}
