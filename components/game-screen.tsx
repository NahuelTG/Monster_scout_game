"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { questions } from "@/data/questions"
import { ExternalLink, MapPin, Lock, Unlock } from "lucide-react"

interface GameScreenProps {
  team: string
  questionIndex: number
  onQuestionComplete: () => void
  onRestart: () => void
}

export default function GameScreen({ team, questionIndex, onQuestionComplete, onRestart }: GameScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [accessCode, setAccessCode] = useState("")
  const [codeError, setCodeError] = useState("")

  const currentQuestion = questions[team]?.[questionIndex]

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-500 mb-4">Error: Pregunta no encontrada</p>
            <Button onClick={onRestart}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setTimeout(() => setShowMap(true), 1000)
    }
  }

  const handleCodeSubmit = () => {
    if (accessCode.toLowerCase() === currentQuestion.accessCode.toLowerCase()) {
      onQuestionComplete()
    } else {
      setCodeError("Código incorrecto. Inténtalo de nuevo.")
      setTimeout(() => setCodeError(""), 3000)
    }
  }

  const handleTryAgain = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)
    setShowMap(false)
    setAccessCode("")
    setCodeError("")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Pregunta {questionIndex + 1} de 4</h1>
          <div className="flex justify-center space-x-2 mb-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < questionIndex ? "bg-green-500" : i === questionIndex ? "bg-yellow-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="mb-6 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-xl text-center">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!showResult ? (
              <>
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full p-4 text-left justify-start h-auto ${
                        selectedAnswer === index ? "bg-blue-500 hover:bg-blue-600 text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3"
                >
                  Confirmar Respuesta
                </Button>
              </>
            ) : (
              <div className="text-center">
                {isCorrect ? (
                  <div className="space-y-4">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold text-green-600 mb-4">¡Respuesta Correcta!</h3>

                    {showMap && (
                      <div className="space-y-4">
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center space-x-2 mb-3">
                              <MapPin className="text-green-600" />
                              <span className="font-semibold text-green-800">Ubicación desbloqueada</span>
                            </div>
                            <Button
                              onClick={() => window.open(currentQuestion.mapLink, "_blank")}
                              className="w-full bg-green-500 hover:bg-green-600 text-white"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Ver en Google Maps
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="bg-yellow-50 border-yellow-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center space-x-2 mb-3">
                              <Lock className="text-yellow-600" />
                              <span className="font-semibold text-yellow-800">Ingresa el código de acceso</span>
                            </div>
                            <div className="space-y-3">
                              <Input
                                type="text"
                                placeholder="Código de 5 caracteres"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                maxLength={5}
                                className="text-center text-lg font-mono"
                              />
                              {codeError && <p className="text-red-500 text-sm">{codeError}</p>}
                              <Button
                                onClick={handleCodeSubmit}
                                disabled={accessCode.length !== 5}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                              >
                                <Unlock className="w-4 h-4 mr-2" />
                                Continuar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-6xl mb-4">😞</div>
                    <h3 className="text-2xl font-bold text-red-600 mb-4">Respuesta Incorrecta</h3>
                    <p className="text-gray-600 mb-4">
                      La respuesta correcta era:{" "}
                      <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                    </p>
                    <Button
                      onClick={handleTryAgain}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3"
                    >
                      Intentar de Nuevo
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            onClick={onRestart}
            variant="outline"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  )
}
