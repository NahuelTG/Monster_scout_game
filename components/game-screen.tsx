// components/GameScreen.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { questions } from "@/data/questions";
import { Lock, Unlock, Mic, MicOff } from "lucide-react";
import useMicrophone from "@/hooks/useMicrophone";

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
   locationTitle: string;
   locationDescription: string;
   mapLink: string;
   accessCode: string;
}

export default function GameScreen({ team, questionIndex, onQuestionComplete, onRestart }: GameScreenProps) {
   // 🎯 Estados locales del componente
   const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
   const [showResult, setShowResult] = useState(false);
   const [isCorrect, setIsCorrect] = useState(false);
   const [showMap, setShowMap] = useState(false);
   const [accessCode, setAccessCode] = useState("");
   const [codeError, setCodeError] = useState("");
   const [voiceError, setVoiceError] = useState("");
   const [isWaitingForRoar, setIsWaitingForRoar] = useState(false);

   const teamKey = team as TeamKey;
   const currentQuestion: Question | undefined = questions[teamKey]?.[questionIndex];
   const { isListening, volume, error, startListening, stopListening } = useMicrophone();

   const ROAR_THRESHOLD = 30;
   const ROAR_TIMEOUT = 5000;

   const handleConfirmAnswer = useCallback(() => {
      if (selectedAnswer === null) return;

      const correct = selectedAnswer === currentQuestion?.correctAnswer;
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
         setTimeout(() => setShowMap(true), 1500);
      }
   }, [selectedAnswer, currentQuestion]);

   useEffect(() => {
      if (!isWaitingForRoar || !isListening) return;

      // Si el volumen supera el umbral, confirmar respuesta
      if (volume > ROAR_THRESHOLD) {
         handleConfirmAnswer();
         setIsWaitingForRoar(false);
         setVoiceError("");
         stopListening();
      }
   }, [volume, isWaitingForRoar, isListening, handleConfirmAnswer, stopListening]);

   useEffect(() => {
      if (!isWaitingForRoar) return;

      const timeout = setTimeout(() => {
         if (isWaitingForRoar) {
            setVoiceError("🦁 ¡Tiempo agotado! Necesito un rugido más fuerte.");
            setIsWaitingForRoar(false);
            stopListening();
            setTimeout(() => setVoiceError(""), 3000);
         }
      }, ROAR_TIMEOUT);

      return () => clearTimeout(timeout);
   }, [isWaitingForRoar, stopListening]);

   useEffect(() => {
      if (error) {
         setVoiceError(error);
         setIsWaitingForRoar(false);
         setTimeout(() => setVoiceError(""), 5000);
      }
   }, [error]);

   const handleAnswerSelect = (answerIndex: number) => {
      if (showResult) return;
      setSelectedAnswer(answerIndex);
      setVoiceError("");
   };

   const handleStartRoarDetection = async () => {
      if (selectedAnswer === null) return;

      try {
         setVoiceError("");
         setIsWaitingForRoar(true);
         await startListening();
      } catch (err) {
         setVoiceError("❌ Error al acceder al micrófono");
         setIsWaitingForRoar(false);
         setTimeout(() => setVoiceError(""), 3000);
         console.error(err);
      }
   };

   const handleStopRoarDetection = () => {
      setIsWaitingForRoar(false);
      stopListening();
   };

   const handleCodeSubmit = () => {
      if (accessCode.toLowerCase() === currentQuestion?.accessCode.toLowerCase()) {
         onQuestionComplete(true);
         resetState();
      } else {
         setCodeError("❌ Código incorrecto. ¡Inténtalo de nuevo!");
         setTimeout(() => setCodeError(""), 3000);
      }
   };

   const handleTryAgain = () => {
      resetState();
   };

   const resetState = () => {
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      setShowMap(false);
      setAccessCode("");
      setCodeError("");
      setVoiceError("");
      setIsWaitingForRoar(false);
      stopListening();
   };

   const getVolumeStatus = () => {
      if (!isWaitingForRoar) return { text: "", color: "gray" };

      if (volume < 10) return { text: "🤫 Muy bajito...", color: "blue" };
      if (volume < 20) return { text: "🗣️ Más fuerte...", color: "green" };
      if (volume < ROAR_THRESHOLD) return { text: "📢 ¡Casi ahí!", color: "orange" };
      return { text: "🦁 ¡RUGIDO PERFECTO!", color: "red" };
   };

   const volumeStatus = getVolumeStatus();

   if (!currentQuestion) {
      return null;
   }

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
                     <h1 className="text-xl font-bold text-white drop-shadow-lg">🎯 Sección {questionIndex + 1} de 4</h1>
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
                                    disabled={isWaitingForRoar}
                                 >
                                    <span className="font-bold mr-3 text-base">{String.fromCharCode(65 + index)}.</span>
                                    <span>{option}</span>
                                 </Button>
                              ))}
                           </div>

                           {/* Voice confirmation section */}
                           <div className="space-y-3">
                              {/* Botón principal de rugido */}
                              <Button
                                 onClick={isWaitingForRoar ? handleStopRoarDetection : handleStartRoarDetection}
                                 disabled={selectedAnswer === null}
                                 className={`w-full font-bold py-4 text-lg rounded-full shadow-xl transform transition-all duration-300 ${
                                    isWaitingForRoar
                                       ? "bg-red-500 hover:bg-red-600 animate-pulse"
                                       : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-105"
                                 } text-white touch-button`}
                              >
                                 {isWaitingForRoar ? (
                                    <>
                                       <MicOff className="w-6 h-6 mr-2" />
                                       🎤 ¡RUGUE AHORA! - Detener
                                    </>
                                 ) : (
                                    <>
                                       <Mic className="w-6 h-6 mr-2" />
                                       🦁 ¡CONFIRMA CON TU RUGIDO!
                                    </>
                                 )}
                              </Button>

                              {/* Indicador de volumen en tiempo real */}
                              {isWaitingForRoar && (
                                 <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <div
                                       style={{
                                          fontSize: "18px",
                                          color: volumeStatus.color,
                                          textAlign: "center",
                                          marginBottom: "12px",
                                          fontWeight: "bold",
                                       }}
                                    >
                                       {volumeStatus.text}
                                    </div>

                                    {/* Barra de volumen visual */}
                                    <div
                                       style={{
                                          width: "100%",
                                          height: "24px",
                                          backgroundColor: "rgba(255,255,255,0.3)",
                                          borderRadius: "12px",
                                          overflow: "hidden",
                                          position: "relative",
                                       }}
                                    >
                                       <div
                                          style={{
                                             width: `${volume}%`,
                                             height: "100%",
                                             backgroundColor: volumeStatus.color,
                                             transition: "width 0.1s ease",
                                             borderRadius: "12px",
                                          }}
                                       />

                                       {/* Indicador del umbral */}
                                       <div
                                          style={{
                                             position: "absolute",
                                             left: `${ROAR_THRESHOLD}%`,
                                             top: "0",
                                             width: "2px",
                                             height: "100%",
                                             backgroundColor: "yellow",
                                             boxShadow: "0 0 4px yellow",
                                          }}
                                       />
                                    </div>

                                    <div className="text-center text-white text-sm mt-2">
                                       Volumen: {volume}% | Objetivo: {ROAR_THRESHOLD}%+
                                    </div>
                                 </div>
                              )}

                              {selectedAnswer === null && (
                                 <p className="text-center text-gray-600 text-sm">⬆️ Primero selecciona una respuesta</p>
                              )}

                              {voiceError && (
                                 <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3">
                                    <p className="text-red-800 text-sm text-center font-medium">{voiceError}</p>
                                 </div>
                              )}

                              {/* Fallback button for manual confirmation */}
                              <Button
                                 onClick={handleConfirmAnswer}
                                 disabled={selectedAnswer === null || isWaitingForRoar}
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
