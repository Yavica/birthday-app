"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Mic, Lock } from 'lucide-react';

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text, delay = 70 }: { text: string, delay?: number }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

// --- FLOATING HEARTS COMPONENT ---
const FloatingHearts = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 1, 0] }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
          className="absolute text-pink-300"
          style={{ left: `${Math.random() * 100}%` }}
        >
          <Heart size={20 + Math.random() * 20} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

export default function BirthdayApp() {
  const [step, setStep] = useState('candle'); 
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startMic = async () => {
    if (audioRef.current) audioRef.current.load();
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
        const volume = dataArray.reduce((a, b) => a + b) / bufferLength;
        if (volume > 60) {
          handleBlow();
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
        } else {
          requestAnimationFrame(checkVolume);
        }
      };
      checkVolume();
    } catch (err) {
      console.error(err);
      alert("Mic access denied—just click the flame!");
    }
  };

  const handleBlow = () => {
    setIsBlownOut(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play blocked:", e));
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
    <main className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-6 overflow-x-hidden relative">
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {step === 'candle' && (
          <motion.div 
            key="candle"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center z-10"
          >
            <h2 className="text-2xl text-pink-600 mb-8 font-medium italic">Make a wish...</h2>
            <div className="relative flex justify-center mb-12">
              <div className="w-8 h-24 bg-pink-200 rounded-full relative shadow-inner">
                {!isBlownOut && (
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    onClick={handleBlow}
                    className="absolute -top-10 left-0 w-8 h-12 bg-pink-400 rounded-full blur-md cursor-pointer"
                  />
                )}
              </div>
            </div>
            {!hasMicAccess ? (
              <button onClick={startMic} className="flex items-center gap-2 bg-white text-pink-500 px-6 py-3 rounded-full shadow-lg font-bold mx-auto">
                <Mic size={20} /> Use Mic to Blow
              </button>
            ) : (
              <p className="text-pink-400 animate-pulse font-medium">Blow now! 💨</p>
            )}
          </motion.div>
        )}

        {step === 'card' && (
          <motion.div 
            key="card"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-6 pb-20 z-10"
          >
             <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-t-[12px] border-pink-400 text-center">
                <Heart className="mx-auto text-red-400 fill-red-400 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Happy Birthday!</h1>
                <div className="text-gray-600 italic min-h-[80px]">
                  <Typewriter text="I built this just for you because you deserve the world. You are a really great person who deserves all the happiness. Can't wait to celebrate! ❤️" />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, rotate: i % 2 === 0 ? 3 : -3 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + (i * 0.2) }}
                    className="bg-white p-2 pb-6 shadow-xl rounded-sm border border-gray-100 overflow-hidden"
                  >
                    <img src={`/photo${i}.jpg`} alt="Memory" className="w-full aspect-square object-cover" />
                    <p className="mt-2 text-[10px] text-gray-400 font-mono text-center tracking-widest uppercase italic">Memory {i}</p>
                  </motion.div>
                ))}
             </div>

             <div className="mt-10 text-center">
                {!showSecret ? (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSecret(true)}
                    className="flex items-center gap-2 bg-pink-500 text-white px-6 py-2 rounded-full mx-auto text-sm shadow-md"
                  >
                    <Lock size={14} /> Reveal Secret Note
                  </motion.button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-yellow-50 p-6 rounded-2xl border-2 border-dashed border-yellow-200 text-yellow-800 font-serif shadow-inner"
                  >
                    <p className="text-lg italic text-center">"I love you more than words can describe. You are a really great person who deserves all the happiness in the world. Can't wait to celebrate your birthday! ❤️ Happy Birthday! ❤️"</p>
                  </motion.div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src="/birthday-song.mp3" loop preload="auto" />
    </main>
  );
}