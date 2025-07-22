"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FinalScreenProps {
  team: string
  onRestart: () => void
}

const teamEmojis = {
  "oozma-kappa": "👁️",
  "roar-omega-roar": "🦁",
  "eta-hiss-hiss": "🐍",
  pnk: "🎀",
}

const teamNames = {
  "oozma-kappa": "Oozma Kappa",
  "roar-omega-roar": "Roar Omega Roar",
  "eta-hiss-hiss": "Eta Hiss Hiss",
  pnk: "PNK",
}

export default function FinalScreen({ team, onRestart }: FinalScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            {/* Confetti Animation */}
            <div className="text-8xl animate-bounce">🎉</div>

            {/* Congratulations Message */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                ¡FELICIDADES!
              </h1>

              <div className="text-6xl mb-4">{teamEmojis[team as keyof typeof teamEmojis]}</div>

              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                Completaste el juego con {teamNames[team as keyof typeof teamNames]}
              </h2>

              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Has demostrado ser un verdadero Scout de Monster University. ¡Tu equipo estaría orgulloso de ti!
              </p>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-6 mx-auto w-32 h-32 flex items-center justify-center shadow-lg">
              <div className="text-center text-white">
                <div className="text-3xl mb-1">🏆</div>
                <div className="text-sm font-bold">SCOUT</div>
                <div className="text-xs">MASTER</div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-gray-800">Estadísticas del Juego</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Preguntas completadas:</span>
                  <div className="font-bold text-green-600">4/4 ✅</div>
                </div>
                <div>
                  <span className="text-gray-600">Equipo:</span>
                  <div className="font-bold text-blue-600">{teamNames[team as keyof typeof teamNames]}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={onRestart}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                🎮 Jugar de Nuevo
              </Button>

              <p className="text-sm text-gray-500">¿Quieres probar con otro equipo?</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Elements */}
      <div className="fixed top-10 left-10 text-4xl animate-pulse">⭐</div>
      <div className="fixed top-20 right-10 text-3xl animate-bounce delay-300">🎊</div>
      <div className="fixed bottom-20 left-20 text-3xl animate-pulse delay-700">✨</div>
      <div className="fixed bottom-10 right-20 text-4xl animate-bounce delay-500">🌟</div>
    </div>
  )
}
