"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const teams = [
   {
      id: "oozma-kappa",
      name: "Oozma Kappa",
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      hoverColor: "hover:from-green-600 hover:to-emerald-700",
      emoji: "👁️",
      description: "Los más amigables",
      accent: "border-green-400",
      textColor: "text-green-100",
   },
   {
      id: "roar-omega-roar",
      name: "Roar Omega Roar",
      color: "bg-gradient-to-br from-blue-600 to-indigo-700",
      hoverColor: "hover:from-blue-700 hover:to-indigo-800",
      emoji: "🦁",
      description: "Los más populares",
      accent: "border-blue-400",
      textColor: "text-blue-100",
   },
   {
      id: "eta-hiss-hiss",
      name: "Eta Hiss Hiss",
      color: "bg-gradient-to-br from-pink-500 to-purple-600",
      hoverColor: "hover:from-pink-600 hover:to-purple-700",
      emoji: "🐍",
      description: "Las más elegantes",
      accent: "border-pink-400",
      textColor: "text-pink-100",
   },
   {
      id: "pnk",
      name: "PNK",
      color: "bg-gradient-to-br from-purple-600 to-violet-700",
      hoverColor: "hover:from-purple-700 hover:to-violet-800",
      emoji: "🎀",
      description: "Las más dulces",
      accent: "border-purple-400",
      textColor: "text-purple-100",
   },
];

interface HomeScreenProps {
   selectedTeam: string | null;
   onTeamSelect: (team: string) => void;
   onStartGame: () => void;
}

export default function HomeScreen({ selectedTeam, onTeamSelect, onStartGame }: HomeScreenProps) {
   const selectedTeamData = teams.find((t) => t.id === selectedTeam);

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-green-500 p-4 relative overflow-hidden">
         {/* Animated background elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-30">🎓</div>
            <div className="absolute top-20 right-10 text-5xl animate-pulse opacity-30">⚡</div>
            <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-700 opacity-30">👾</div>
            <div className="absolute bottom-10 right-20 text-6xl animate-pulse delay-500 opacity-30">🌟</div>
            <div className="absolute top-1/2 left-5 text-4xl animate-bounce delay-300 opacity-20">🔥</div>
            <div className="absolute top-1/3 right-5 text-4xl animate-pulse delay-1000 opacity-20">✨</div>
            <div className="absolute top-2/3 left-1/4 text-3xl animate-bounce delay-1500 opacity-20">🎯</div>
            <div className="absolute top-1/4 right-1/3 text-3xl animate-pulse delay-2000 opacity-20">🏆</div>
         </div>

         <div className="min-h-screen flex flex-col items-center justify-center relative z-10">
            {/* Header mejorado */}
            <div className="text-center mb-8">
               <div className="mb-6">
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-2 drop-shadow-2xl">
                     🎓 <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Monster</span>
                  </h1>
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
                     <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">University</span>
                  </h1>
               </div>

               <div className="bg-white/20 backdrop-blur-sm rounded-full py-3 px-8 mb-4 border-2 border-white/30 shadow-2xl">
                  <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 drop-shadow-lg">🎮 Scout Adventure</h2>
               </div>

               <p className="text-lg md:text-xl text-white/90 drop-shadow-lg font-semibold">
                  ¡Elige tu fraternidad y demuestra tu valor! 🚀
               </p>
            </div>

            {/* Team selection grid mejorada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mb-8">
               {teams.map((team) => (
                  <Card
                     key={team.id}
                     className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                        selectedTeam === team.id ? "ring-6 ring-yellow-400 shadow-2xl scale-105 animate-pulse" : "hover:shadow-2xl"
                     } backdrop-blur-sm bg-white/10 border-2 border-white/20 overflow-hidden`}
                     onClick={() => onTeamSelect(team.id)}
                  >
                     <CardContent className={`${team.color} ${team.hoverColor} p-6 rounded-lg relative overflow-hidden`}>
                        {/* Glow effect for selected team */}
                        {selectedTeam === team.id && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}

                        <div className="text-center text-white relative z-10">
                           <div className="text-5xl mb-4 animate-bounce">{team.emoji}</div>
                           <h3 className="text-xl font-black mb-2 drop-shadow-lg">{team.name}</h3>
                           <p className={`text-sm ${team.textColor} opacity-90 font-medium`}>{team.description}</p>
                        </div>

                        {/* Selection indicator */}
                        {selectedTeam === team.id && <div className="absolute top-2 right-2 text-2xl animate-bounce">✅</div>}
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* Start button mejorado */}
            <div className="text-center space-y-4">
               <Button
                  onClick={onStartGame}
                  disabled={!selectedTeam}
                  className={`font-black text-xl md:text-2xl px-12 py-6 rounded-full shadow-2xl transform transition-all duration-500 ${
                     selectedTeam
                        ? "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white hover:scale-110 animate-pulse"
                        : "bg-gray-400 text-gray-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:animate-none`}
               >
                  {selectedTeam ? <>🚀 ¡INICIAR AVENTURA!</> : <>🔒 Elige una fraternidad</>}
               </Button>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20 shadow-xl max-w-md">
               <h3 className="text-white font-bold text-lg mb-2 text-center">📋 Instrucciones</h3>
               <ul className="text-white/90 text-sm space-y-1">
                  <li>🎯 Responde 4 preguntas sobre Monster Inc</li>
                  <li>🦁 Confirma tus respuestas con un rugido</li>
                  <li>🗺️ Encuentra las ubicaciones secretas</li>
                  <li>🔐 Descifra los códigos de acceso</li>
                  <li>🏆 ¡Conviértete en un Scout Master!</li>
               </ul>
            </div>
         </div>
      </div>
   );
}
