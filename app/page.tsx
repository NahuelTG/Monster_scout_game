"use client";

import { useState, useEffect } from "react";
import HomeScreen from "@/components/home-screen";
import GameScreen from "@/components/game-screen";
import FinalScreen from "@/components/final-screen";

export default function MonsterUniversityScout() {
   const [currentScreen, setCurrentScreen] = useState("home"); // "home", "game", "final"
   const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const [correctAnswers, setCorrectAnswers] = useState(0);

   // Preload audio for better UX
   useEffect(() => {
      // Preload some audio context for microphone access
      if (typeof window !== "undefined") {
         // Initialize audio context to avoid autoplay restrictions
         const AudioContext = window.AudioContext || window.webkitAudioContext;
         if (AudioContext) {
            const audioContext = new AudioContext();
            // Create a silent audio to initialize the context
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
         }
      }
   }, []);

   const handleTeamSelect = (team: string) => {
      setSelectedTeam(team);
   };

   const handleStartGame = () => {
      if (selectedTeam) {
         setCurrentScreen("game");
         setCurrentQuestion(0);
         setCorrectAnswers(0);
      }
   };

   const handleQuestionComplete = (wasCorrect: boolean = true) => {
      // Only increment correct answers if the answer was actually correct
      if (wasCorrect) {
         setCorrectAnswers((prev) => prev + 1);
      }

      if (currentQuestion < 3) {
         setCurrentQuestion(currentQuestion + 1);
      } else {
         // Game completed, go to final screen
         setCurrentScreen("final");
      }
   };

   const handleRestart = () => {
      setCurrentScreen("home");
      setSelectedTeam(null);
      setCurrentQuestion(0);
      setCorrectAnswers(0);
   };

   return (
      <div className="min-h-screen">
         {currentScreen === "home" && (
            <HomeScreen selectedTeam={selectedTeam} onTeamSelect={handleTeamSelect} onStartGame={handleStartGame} />
         )}

         {currentScreen === "game" && selectedTeam && (
            <GameScreen
               team={selectedTeam}
               questionIndex={currentQuestion}
               onQuestionComplete={handleQuestionComplete}
               onRestart={handleRestart}
            />
         )}

         {currentScreen === "final" && selectedTeam && (
            <FinalScreen team={selectedTeam} correctAnswers={correctAnswers} totalQuestions={4} onRestart={handleRestart} />
         )}
      </div>
   );
}
