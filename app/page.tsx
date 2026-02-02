"use client";
const audioRef = useRef<HTMLAudioElement | null>(null);
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Stars, Mic } from 'lucide-react';

export default function BirthdayApp() {
  const [step, setStep] = useState('candle'); 
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // --- MICROPHONE LOGIC ---
  const startMic = async () => {
    // 1. Pre-load the audio so the browser allows it to play later
    if (audioRef.current) {
      audioRef.current.load();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicAccess(true);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (isBlownOut) return;
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const volume = dataArray.reduce((a, b) => a + b) / bufferLength;

        // Threshold of 60 is a solid puff/blow
        if (volume > 60) {
          handleBlow();
          // Clean up: stop the microphone after successful blow
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
        } else {
          requestAnimationFrame(checkVolume);
        }
      };
      
      checkVolume();
    } catch (err) {
      console.error("Mic access denied or error:", err);
      alert("Please allow mic access or just click the candle to continue!");
    }
  };

  const handleBlow = () => {
  setIsBlownOut(true);
  
  // Start the music!
  if (audioRef.current) {
    audioRef.current.play();
  }

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF69B4', '#FFB6C1', '#FFFFFF']
  });
  setTimeout(() => setStep('card'), 2000);
};

  return (
    <main className="min-h-screen bg-[#FFF0F5] flex items-center justify-center p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* SCENE 1: THE CANDLE */}
        {step === 'candle' && (
          <motion.div 
            key="candle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl text-pink-600 mb-8 font-medium italic">
              {hasMicAccess ? "Now, blow on the mic!" : "Ready to make a wish?"}
            </h2>
            
            <div className="relative flex justify-center mb-12">
              <div className="w-8 h-24 bg-pink-200 rounded-full relative shadow-inner">
                {!isBlownOut && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="absolute -top-10 left-0 w-8 h-12 bg-orange-400 rounded-full blur-md"
                  />
                )}
              </div>
            </div>

            {!hasMicAccess ? (
              <button 
                onClick={startMic}
                className="flex items-center gap-2 bg-white text-pink-500 px-6 py-3 rounded-full shadow-lg font-bold hover:bg-pink-50 transition-all mx-auto"
              >
                <Mic size={20} /> Allow Mic to Blow Candle
              </button>
            ) : (
              <p className="text-pink-400 animate-pulse">Waiting for your puff... 💨</p>
            )}
            
            <button onClick={handleBlow} className="mt-8 text-xs text-pink-300 underline">
              Or click here if mic doesn't work
            </button>
          </motion.div>
        )}

        {/* SCENE 2: THE CARD & GALLERY */}
        {step === 'card' && (
          <motion.div 
            key="card"
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-8 pb-10"
          >
             {/* The Card Face */}
             <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-t-[12px] border-pink-400 text-center">
                <Heart className="mx-auto text-red-400 fill-red-400 mb-4 animate-bounce" />
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Happy Birthday!</h1>
                <p className="text-gray-600 leading-relaxed italic">
                  "I wanted to build you something as unique and beautiful as you are. 
                  Thank you for being my favorite person."
                </p>
             </div>

             {/* Polaroid Grid (The Happiepages Style) */}
             <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, rotate: i % 2 === 0 ? 5 : -5 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-white p-3 pb-10 shadow-xl border border-gray-100 transform hover:scale-105 hover:z-10 transition-all"
                  >
                    <div className="aspect-square w-full rounded-sm overflow-hidden border border-gray-100">
  <img 
    src={`/photo${i}.jpg`} 
    alt={`Memory ${i}`}
    className="w-full h-full object-cover"
    onError={(e) => {
      // This is a fallback in case the image name is wrong
      e.currentTarget.src = "https://via.placeholder.com/400?text=Upload+Photo";
    }}
  />
</div>
                    <p className="mt-3 text-sm font-handwriting text-gray-500 text-center">
  {i === 1 && "Msupaaa"}
  {i === 2 && "Kuwa Model"}
  {i === 3 && "Laughing with you"}
  {i === 4 && "Kwela Fineee"}
</p>
                  </motion.div>
                ))}
             </div>
          </motion.div>
        )}

      </AnimatePresence>
      <audio ref={audioRef} src="/birthday-song.mp3" preload="auto" />
    </main>
  );
}