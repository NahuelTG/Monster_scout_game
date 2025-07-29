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

   const analyzeAudio = useCallback(() => {
      if (!analyzerRef.current || !dataArrayRef.current) return;

      analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
      const average = dataArrayRef.current.reduce((sum, value) => sum + value, 0) / dataArrayRef.current.length;
      const volumePercentage = Math.round((average / 255) * 100);

      setVolume(volumePercentage);

      animationRef.current = requestAnimationFrame(analyzeAudio);
   }, []);

   const startListening = useCallback(async () => {
      try {
         const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
         });

         const audioContext = new (window.AudioContext || window.AudioContext)();
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

         setIsListening(true);
         setError(null);

         analyzeAudio();
      } catch (err: unknown) {
         if (err instanceof DOMException) {
            setError("Error accediendo al micrófono: " + err.message);
         } else {
            setError("Error desconocido accediendo al micrófono");
         }
      }
   }, [analyzeAudio]);

   const stopListening = useCallback(() => {
      if (animationRef.current) {
         cancelAnimationFrame(animationRef.current);
      }

      if (audioContextRef.current) {
         audioContextRef.current.close();
      }

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
