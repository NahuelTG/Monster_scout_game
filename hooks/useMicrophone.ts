// 🔧 useMicrophone.js
import { useState, useEffect, useRef, useCallback } from "react";

export interface UseMicrophoneReturn {
   isListening: boolean;
   volume: number;
   error: string | null;
   startListening: () => Promise<void>;
   stopListening: () => void;
}

function useMicrophone() {
   const [isListening, setIsListening] = useState<boolean>(false);
   const [volume, setVolume] = useState<number>(0);
   const [error, setError] = useState<string | null>(null);

   const audioContextRef = useRef<AudioContext | null>(null);
   const analyzerRef = useRef<AnalyserNode | null>(null);
   const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
   const dataArrayRef = useRef<Uint8Array | null>(null);
   const animationRef = useRef<number | null>(null);
   const streamRef = useRef<MediaStream | null>(null); // 🆕 Referencia al stream

   const analyzeAudio = useCallback(() => {
      if (!analyzerRef.current || !dataArrayRef.current) return;

      analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
      const average = dataArrayRef.current.reduce((sum, value) => sum + value, 0) / dataArrayRef.current.length;
      const volumePercentage = Math.round((average / 255) * 100);

      setVolume(volumePercentage);

      // 🎯 Solo continuar si el AudioContext sigue activo
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
         animationRef.current = requestAnimationFrame(analyzeAudio);
      }
   }, []);

   const startListening = useCallback(async () => {
      try {
         // 🚨 Verificar si ya estamos escuchando
         if (isListening || (audioContextRef.current && audioContextRef.current.state === "running")) {
            console.warn("Ya está escuchando el micrófono");
            return;
         }

         const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
         });

         const audioContext = new (window.AudioContext || window.webkitAudioContext)();
         const analyzer = audioContext.createAnalyser();
         const microphone = audioContext.createMediaStreamSource(stream);

         analyzer.fftSize = 256;
         const bufferLength = analyzer.frequencyBinCount;
         const dataArray = new Uint8Array(bufferLength);

         microphone.connect(analyzer);

         audioContextRef.current = audioContext;
         analyzerRef.current = analyzer;
         microphoneRef.current = microphone;
         dataArrayRef.current = dataArray;
         streamRef.current = stream; // 🆕 Guardar el stream

         setIsListening(true);
         setError(null);

         analyzeAudio();
      } catch (err: unknown) {
         console.error("Error starting microphone:", err);
         if (err instanceof DOMException) {
            setError("Error accediendo al micrófono: " + err.message);
         } else {
            setError("Error desconocido accediendo al micrófono");
         }
      }
   }, [analyzeAudio, isListening]);

   const stopListening = useCallback(() => {
      // 🎯 Cancelar animación
      if (animationRef.current) {
         cancelAnimationFrame(animationRef.current);
         animationRef.current = null;
      }

      // 🎯 Detener el stream del micrófono (CRÍTICO)
      if (streamRef.current) {
         streamRef.current.getTracks().forEach((track) => {
            track.stop(); // Libera el micrófono del sistema
         });
         streamRef.current = null;
      }

      // 🎯 Cerrar AudioContext SOLO si no está cerrado
      if (audioContextRef.current) {
         const audioContext = audioContextRef.current;

         if (audioContext.state !== "closed") {
            audioContext
               .close()
               .then(() => {
                  console.log("AudioContext cerrado correctamente");
               })
               .catch((err) => {
                  console.warn("Error cerrando AudioContext (no crítico):", err);
               });
         }
         audioContextRef.current = null;
      }

      // 🎯 Limpiar otras referencias
      analyzerRef.current = null;
      microphoneRef.current = null;
      dataArrayRef.current = null;

      setIsListening(false);
      setVolume(0);
   }, []);

   useEffect(() => {
      return () => {
         stopListening();
      };
   }, [stopListening]);

   return {
      isListening,
      volume,
      error,
      startListening,
      stopListening,
   };
}

export default useMicrophone;
