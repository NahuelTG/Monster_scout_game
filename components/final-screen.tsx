"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface FinalScreenProps {
   team: string;
   correctAnswers: number; // ✅ Nueva propiedad
   totalQuestions: number; // ✅ Nueva propiedad
   onRestart: () => void;
}

const teamEmojis = {
   "oozma-kappa": "👁️",
   "roar-omega-roar": "🦁",
   "eta-hiss-hiss": "🐍",
   pnk: "🎀",
};

const teamNames = {
   "oozma-kappa": "Oozma Kappa",
   "roar-omega-roar": "Roar Omega Roar",
   "eta-hiss-hiss": "Eta Hiss Hiss",
   pnk: "PNK",
};

const teamColors = {
   "oozma-kappa": "from-green-500 to-emerald-600",
   "roar-omega-roar": "from-blue-600 to-indigo-700",
   "eta-hiss-hiss": "from-pink-500 to-purple-600",
   pnk: "from-purple-600 to-violet-700",
};

export default function FinalScreen({ team, onRestart }: FinalScreenProps) {
   const [showFireworks, setShowFireworks] = useState(false);
   const [confettiArray, setConfettiArray] = useState<number[]>([]);

   useEffect(() => {
      // Trigger fireworks animation
      setTimeout(() => setShowFireworks(true), 500);

      // Generate confetti
      const confetti = Array.from({ length: 20 }, (_, i) => i);
      setConfettiArray(confetti);
   }, []);

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-green-500 flex flex-col items-center justify-center p-4 relative overflow-hidden">
         {/* Animated confetti background */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiArray.map((i) => (
               <div
                  key={i}
                  className={`absolute text-3xl animate-bounce opacity-70`}
                  style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 2}s`,
                     animationDuration: `${2 + Math.random() * 3}s`,
                  }}
               >
                  {["🎉", "🎊", "⭐", "✨", "🏆", "🌟", "💫"][Math.floor(Math.random() * 7)]}
               </div>
            ))}
         </div>

         {/* Fireworks effect */}
         {showFireworks && (
            <>
               <div className="fixed top-20 left-20 text-6xl animate-ping opacity-75">💥</div>
               <div className="fixed top-32 right-32 text-5xl animate-ping delay-300 opacity-75">🎆</div>
               <div className="fixed bottom-40 left-40 text-5xl animate-ping delay-700 opacity-75">🎇</div>
               <div className="fixed bottom-20 right-20 text-6xl animate-ping delay-1000 opacity-75">💥</div>
            </>
         )}

         <Card className="w-full max-w-md shadow-2xl border-4 border-yellow-400 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
               <div className="space-y-6">
                  {/* Main celebration animation */}
                  <div className="space-y-4">
                     <div className="text-8xl animate-bounce">{teamEmojis[team as keyof typeof teamEmojis]}</div>
                     <div className="text-6xl animate-pulse">🎉</div>
                  </div>

                  {/* Congratulations Message */}
                  <div className="space-y-4">
                     <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 animate-pulse">
                        ¡FELICIDADES!
                     </h1>

                     <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-4 border-yellow-400 shadow-lg">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">🎓 ¡MISIÓN COMPLETADA! 🎓</h2>
                        <p className="text-lg text-gray-700">
                           Has conquistado todas las pruebas con{" "}
                           <span className="font-bold text-purple-600">{teamNames[team as keyof typeof teamNames]}</span>
                        </p>
                     </div>

                     <p className="text-lg text-gray-600 max-w-sm mx-auto font-semibold">
                        🌟 Eres oficialmente un <span className="text-blue-600 font-black">SCOUT MASTER</span> de Monster University 🌟
                     </p>
                  </div>

                  {/* Achievement Badge Mejorado */}
                  <div
                     className={`bg-gradient-to-r ${
                        teamColors[team as keyof typeof teamColors]
                     } rounded-full p-8 mx-auto w-40 h-40 flex items-center justify-center shadow-2xl border-4 border-yellow-400 transform animate-pulse`}
                  >
                     <div className="text-center text-white">
                        <div className="text-4xl mb-2">🏆</div>
                        <div className="text-lg font-black">SCOUT</div>
                        <div className="text-sm font-bold">MASTER</div>
                        <div className="text-xs opacity-90">2025</div>
                     </div>
                  </div>

                  {/* Stats mejoradas */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4 border-2 border-gray-200 shadow-lg">
                     <h3 className="font-black text-gray-800 text-xl">📊 Estadísticas Finales</h3>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="bg-green-100 rounded-lg p-3 border-2 border-green-400">
                           <span className="text-gray-700 font-semibold">Preguntas completadas:</span>
                           <div className="font-black text-green-600 text-lg">4/4 ✅</div>
                        </div>
                        <div className="bg-blue-100 rounded-lg p-3 border-2 border-blue-400">
                           <span className="text-gray-700 font-semibold">Fraternidad:</span>
                           <div className="font-black text-blue-600 text-lg flex items-center justify-center gap-2">
                              {teamEmojis[team as keyof typeof teamEmojis]} {teamNames[team as keyof typeof teamNames]}
                           </div>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-3 border-2 border-purple-400">
                           <span className="text-gray-700 font-semibold">Rango obtenido:</span>
                           <div className="font-black text-purple-600 text-lg">🏆 SCOUT MASTER</div>
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons mejorados */}
                  <div className="space-y-4 pt-4">
                     <Button
                        onClick={onRestart}
                        className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 hover:from-purple-700 hover:via-blue-700 hover:to-green-700 text-white font-black py-4 text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 border-2 border-yellow-400"
                     >
                        🎮 ¡NUEVA AVENTURA!
                     </Button>

                     <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-400 shadow-lg">
                        <p className="text-yellow-800 font-bold text-sm mb-2">💡 ¿Sabías que...?</p>
                        <p className="text-yellow-700 text-sm">
                           ¡Puedes probar con las otras fraternidades y descubrir diferentes desafíos! 🎯
                        </p>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Floating celebration elements mejorados */}
         <div className="fixed top-10 left-10 text-5xl animate-bounce opacity-70">⭐</div>
         <div className="fixed top-20 right-10 text-4xl animate-bounce delay-300 opacity-70">🎊</div>
         <div className="fixed bottom-20 left-20 text-4xl animate-pulse delay-700 opacity-70">✨</div>
         <div className="fixed bottom-10 right-20 text-5xl animate-bounce delay-500 opacity-70">🌟</div>
         <div className="fixed top-1/2 left-5 text-3xl animate-pulse delay-1000 opacity-60">💫</div>
         <div className="fixed top-1/3 right-5 text-3xl animate-bounce delay-1500 opacity-60">🎉</div>
      </div>
   );
}
