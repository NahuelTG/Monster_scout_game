"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { questions } from "@/data/questions";
import { ExternalLink, MapPin, Lock, Unlock, Mic, MicOff } from "lucide-react";

interface GameScreenProps {
   team: string;
   questionIndex: number;
   onQuestionComplete: (wasCorrect?: boolean) => void;
   onRestart: () => void;
}

type TeamKey = keyof typeof questions;

interface Question {
   question: string;
   options: string[];
   correctAnswer: number;
   mapLink: string;
   accessCode: string;
}

export default function GameScreen({ team, questionIndex, onQuestionComplete, onRestart }: GameScreenProps) {
   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
   const [showResult, setShowResult] = useState(false);
   const [isCorrect, setIsCorrect] = useState(false);
   const [showMap, setShowMap] = useState(false);
   const [accessCode, setAccessCode] = useState("");
   const [codeError, setCodeError] = useState("");
   const [isListening, setIsListening] = useState(false);
   const [recognition, setRecognition] = useState<any>(null);
   const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");
   const [voiceError, setVoiceError] = useState<string>("");

   const teamKey = team as TeamKey;
   const currentQuestion: Question | undefined = questions[teamKey]?.[questionIndex];

   useEffect(() => {
      // Check for speech recognition support
      if (typeof window !== "undefined") {
         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
         if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = "es-ES";

            recognitionInstance.onresult = (event: any) => {
               const transcript = event.results[0][0].transcript.toLowerCase();
               console.log("Heard:", transcript);

               // Check for roar/scream words in Spanish and English
               const roarWords = ["rugir", "rugido", "grito", "ahhh", "roar", "gritar", "aaah", "uhhh", "ahh", "ohh"];
               const hasRoar = roarWords.some((word) => transcript.includes(word));

               // Also accept any sound longer than 2 characters or with vowel sounds
               const hasLongSound = transcript.length > 2 || /[aeiouáéíóú]{2,}/i.test(transcript);

               if (hasRoar || hasLongSound) {
                  handleConfirmAnswer();
                  setVoiceError("");
               } else {
                  setVoiceError("🦁 ¡Necesito un rugido más fuerte! Inténtalo de nuevo.");
                  setTimeout(() => setVoiceError(""), 3000);
               }
               setIsListening(false);
            };

            recognitionInstance.onerror = (event: any) => {
               console.error("Speech recognition error:", event.error);
               setIsListening(false);

               let errorMessage = "";
               switch (event.error) {
                  case "network":
                     errorMessage = "🌐 Error de conexión. ¿Puedes intentar de nuevo?";
                     break;
                  case "not-allowed":
                     errorMessage = "🎤 Necesitas dar permiso al micrófono";
                     setMicPermission("denied");
                     break;
                  case "no-speech":
                     errorMessage = "🔇 No te escuché. ¡Rugue más fuerte!";
                     break;
                  case "audio-capture":
                     errorMessage = "🎤 Problema con el micrófono";
                     break;
                  case "service-not-allowed":
                     errorMessage = "⚠️ Servicio de voz no disponible";
                     break;
                  default:
                     errorMessage = `❌ Error de voz: ${event.error}`;
               }

               setVoiceError(errorMessage);
               setTimeout(() => setVoiceError(""), 5000);
            };

            recognitionInstance.onend = () => {
               setIsListening(false);
            };

            recognitionInstance.onstart = () => {
               setVoiceError("");
            };

            setRecognition(recognitionInstance);
         }
      }

      // Request microphone permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
         navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => setMicPermission("granted"))
            .catch(() => setMicPermission("denied"));
      } else {
         setMicPermission("denied");
      }
   }, []);

   if (!currentQuestion) {
      return (
         <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 via-purple-600 to-green-500">
            <Card className="w-full max-w-md shadow-2xl border-4 border-yellow-400">
               <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">😱</div>
                  <p className="text-red-500 mb-4 text-lg font-semibold">¡Ups! Pregunta no encontrada</p>
                  <Button
                     onClick={onRestart}
                     className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                     🏠 Volver al inicio
                  </Button>
               </CardContent>
            </Card>
         </div>
      );
   }

   const handleAnswerSelect = (answerIndex: number) => {
      if (showResult) return;
      setSelectedAnswer(answerIndex);
      setVoiceError(""); // Clear any previous voice errors
   };

   const startListening = () => {
      if (selectedAnswer === null) return;
      if (micPermission !== "granted") {
         setVoiceError("🎤 Necesitas dar permiso al micrófono para usar esta función");
         setTimeout(() => setVoiceError(""), 3000);
         return;
      }
      if (!recognition) {
         setVoiceError("❌ Tu navegador no soporta reconocimiento de voz. Prueba con Chrome.");
         setTimeout(() => setVoiceError(""), 3000);
         return;
      }

      setIsListening(true);
      setVoiceError("");

      try {
         recognition.start();
      } catch (error) {
         console.error("Error starting recognition:", error);
         setIsListening(false);
         setVoiceError("❌ Error al iniciar el reconocimiento de voz");
         setTimeout(() => setVoiceError(""), 3000);
      }
   };

   const handleConfirmAnswer = () => {
      if (selectedAnswer === null) return;

      const correct = selectedAnswer === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
         setTimeout(() => setShowMap(true), 1500);
      }
   };

   const handleCodeSubmit = () => {
      if (accessCode.toLowerCase() === currentQuestion.accessCode.toLowerCase()) {
         // Pass true to indicate the answer was correct (they reached the code step)
         onQuestionComplete(true);
      } else {
         setCodeError("❌ Código incorrecto. ¡Inténtalo de nuevo!");
         setTimeout(() => setCodeError(""), 3000);
      }
   };

   const handleTryAgain = () => {
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      setShowMap(false);
      setAccessCode("");
      setCodeError("");
      setVoiceError("");
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-green-500 p-4 relative overflow-hidden">
         {/* Animated background elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-70">👁️</div>
            <div className="absolute top-20 right-10 text-3xl animate-pulse opacity-70">⚡</div>
            <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-700 opacity-70">🦁</div>
            <div className="absolute bottom-10 right-20 text-4xl animate-pulse delay-500 opacity-70">🎓</div>
            <div className="absolute top-1/2 left-5 text-2xl animate-bounce delay-300 opacity-50">👾</div>
            <div className="absolute top-1/3 right-5 text-2xl animate-pulse delay-1000 opacity-50">🔥</div>
         </div>

         <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
            <div className="w-full max-w-md">
               {/* Header con mejor diseño */}
               <div className="text-center mb-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full py-3 px-6 mb-4 border-2 border-white/30 shadow-xl">
                     <h1 className="text-xl font-bold text-white drop-shadow-lg">🎯 Pregunta {questionIndex + 1} de 4</h1>
                  </div>

                  {/* Progress bar mejorada */}
                  <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm border border-white/30 shadow-lg">
                     <div className="flex justify-center space-x-3">
                        {[0, 1, 2, 3].map((i) => (
                           <div
                              key={i}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                                 i < questionIndex
                                    ? "bg-green-500 text-white shadow-lg transform scale-110"
                                    : i === questionIndex
                                    ? "bg-yellow-400 text-black shadow-lg animate-pulse transform scale-110"
                                    : "bg-white/40 text-gray-600"
                              }`}
                           >
                              {i < questionIndex ? "✅" : i + 1}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <Card className="mb-6 shadow-2xl border-4 border-white/30 backdrop-blur-sm bg-white/95">
                  <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white rounded-t-lg border-b-4 border-yellow-400">
                     <CardTitle className="text-lg text-center font-bold p-2">{currentQuestion.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                     {!showResult ? (
                        <>
                           <div className="space-y-3 mb-6">
                              {currentQuestion.options.map((option: string, index: number) => (
                                 <Button
                                    key={index}
                                    variant={selectedAnswer === index ? "default" : "outline"}
                                    className={`w-full p-4 text-left justify-start h-auto text-sm font-medium transition-all duration-300 ${
                                       selectedAnswer === index
                                          ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-xl transform scale-105 border-2 border-yellow-400"
                                          : "hover:bg-gray-100 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg"
                                    }`}
                                    onClick={() => handleAnswerSelect(index)}
                                 >
                                    <span className="font-bold mr-3 text-base">{String.fromCharCode(65 + index)}.</span>
                                    <span>{option}</span>
                                 </Button>
                              ))}
                           </div>

                           {/* Voice confirmation button */}
                           <div className="space-y-3">
                              <Button
                                 onClick={startListening}
                                 disabled={selectedAnswer === null || isListening}
                                 className={`w-full font-bold py-4 text-lg rounded-full shadow-xl transform transition-all duration-300 ${
                                    isListening
                                       ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                       : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105"
                                 } text-white touch-button`}
                              >
                                 {isListening ? (
                                    <>
                                       <MicOff className="w-6 h-6 mr-2" />
                                       🎤 ¡RUGUE AHORA!
                                    </>
                                 ) : (
                                    <>
                                       <Mic className="w-6 h-6 mr-2" />
                                       🦁 ¡CONFIRMA CON TU RUGIDO!
                                    </>
                                 )}
                              </Button>

                              {selectedAnswer === null && (
                                 <p className="text-center text-gray-600 text-sm">⬆️ Primero selecciona una respuesta</p>
                              )}

                              {voiceError && (
                                 <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3">
                                    <p className="text-red-800 text-sm text-center font-medium">{voiceError}</p>
                                 </div>
                              )}

                              {micPermission === "denied" && (
                                 <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3">
                                    <p className="text-yellow-800 text-sm text-center">
                                       🔒 Activa el micrófono en tu navegador para usar esta función
                                    </p>
                                 </div>
                              )}

                              {/* Fallback button for manual confirmation */}
                              <Button
                                 onClick={handleConfirmAnswer}
                                 disabled={selectedAnswer === null}
                                 variant="outline"
                                 className="w-full border-2 border-blue-400 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-full"
                              >
                                 ✋ Confirmar sin voz
                              </Button>
                           </div>
                        </>
                     ) : (
                        <div className="text-center">
                           {isCorrect ? (
                              <div className="space-y-6">
                                 <div className="text-8xl mb-4 animate-bounce">🎉</div>
                                 <h3 className="text-3xl font-bold text-green-600 mb-4">¡RESPUESTA CORRECTA!</h3>
                                 <div className="text-2xl">🏆✨🎊</div>

                                 {showMap && (
                                    <div className="space-y-4">
                                       <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-400 shadow-xl">
                                          <CardContent className="p-4">
                                             <div className="flex items-center justify-center space-x-2 mb-4">
                                                <MapPin className="text-green-600 w-6 h-6" />
                                                <span className="font-bold text-green-800 text-lg">🗺️ Ubicación Desbloqueada</span>
                                             </div>
                                             <Button
                                                onClick={() => window.open(currentQuestion.mapLink, "_blank")}
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                                             >
                                                <ExternalLink className="w-5 h-5 mr-2" />
                                                📍 Ver en Google Maps
                                             </Button>
                                          </CardContent>
                                       </Card>

                                       <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-yellow-400 shadow-xl">
                                          <CardContent className="p-4">
                                             <div className="flex items-center justify-center space-x-2 mb-4">
                                                <Lock className="text-yellow-600 w-6 h-6" />
                                                <span className="font-bold text-yellow-800 text-lg">🔐 Código de Acceso</span>
                                             </div>
                                             <div className="space-y-4">
                                                <Input
                                                   type="text"
                                                   placeholder="🔤 Código de 5 letras"
                                                   value={accessCode}
                                                   onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                                   maxLength={5}
                                                   className="text-center text-xl font-mono font-bold border-3 border-yellow-400 focus:border-yellow-500 bg-white shadow-lg"
                                                />
                                                {codeError && (
                                                   <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3">
                                                      <p className="text-red-700 font-semibold">{codeError}</p>
                                                   </div>
                                                )}
                                                <Button
                                                   onClick={handleCodeSubmit}
                                                   disabled={accessCode.length !== 5}
                                                   className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                                >
                                                   <Unlock className="w-5 h-5 mr-2" />
                                                   🚀 Continuar Aventura
                                                </Button>
                                             </div>
                                          </CardContent>
                                       </Card>
                                    </div>
                                 )}
                              </div>
                           ) : (
                              <div className="space-y-6">
                                 <div className="text-8xl mb-4 animate-bounce">😞</div>
                                 <h3 className="text-3xl font-bold text-red-600 mb-4">¡Respuesta Incorrecta!</h3>
                                 <div className="bg-red-100 border-4 border-red-400 rounded-lg p-4 mb-4">
                                    <p className="text-red-800 font-semibold text-lg">
                                       ✅ La respuesta correcta era:
                                       <br />
                                       <strong className="text-xl">{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                                    </p>
                                 </div>
                                 <Button
                                    onClick={handleTryAgain}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 text-lg rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                                 >
                                    🔄 Intentar de Nuevo
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
                     className="bg-white/20 text-white border-2 border-white/40 hover:bg-white/30 backdrop-blur-sm font-bold py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                     🏠 Volver al Inicio
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
