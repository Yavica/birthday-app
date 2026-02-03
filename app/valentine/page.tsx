"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Mail, Gift, Store, ArrowLeft } from 'lucide-react';

// --- HELPER COMPONENTS ---

const MenuIcon = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-md border-2 border-pink-100 hover:scale-105 active:scale-95 transition-all"
  >
    <div className="text-[#ff4d6d] mb-2">{icon}</div>
    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{label}</span>
  </button>
);

const FlowerOption = ({ label, emoji }: { label: string, emoji: string }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      confetti({ particleCount: 30, spread: 50, colors: ['#ffb6c1', '#ff4d6d'] });
    }}
    className="bg-white border-2 border-pink-100 p-4 rounded-2xl shadow-sm flex flex-col items-center"
  >
    <span className="text-4xl mb-2">{emoji}</span>
    <span className="text-xs font-bold text-gray-700">{label}</span>
    <span className="text-[10px] text-pink-500 font-mono mt-1">FREE</span>
  </motion.button>
);

const ContentCard = ({ title, children, onBack }: { title: string, children: React.ReactNode, onBack: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} 
    animate={{ opacity: 1, x: 0 }} 
    exit={{ opacity: 0, x: -50 }}
    className="w-full max-w-sm bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-pink-100 relative"
  >
    <button onClick={onBack} className="absolute top-6 left-6 text-pink-400 hover:text-pink-600 transition-colors">
      <ArrowLeft size={20} />
    </button>
    <h3 className="text-xl font-bold text-[#ff4d6d] mb-6 text-center mt-2">{title}</h3>
    {children}
  </motion.div>
);

// --- MAIN PAGE COMPONENT ---

export default function ValentineApp() {
  const [stage, setStage] = useState('ask'); // ask, menu, letter, gift, shop
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });

  const handleYes = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff8fa3', '#ffffff']
    });
    setStage('menu');
  };

  const moveNoButton = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    setNoButtonPos({ x, y });
  };

  return (
    <main className="min-h-screen bg-[#fff0f3] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      <AnimatePresence mode="wait">
        {/* STAGE: THE ASK */}
        {stage === 'ask' && (
          <motion.div 
            key="ask"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center z-10"
          >
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpueW81bm90Y3V4eGZqZnd4eGZqZnd4eGZqZnd4eGZqZnd4eGZqJnB2PTA/tIeCLkB8geYtW/giphy.gif" 
              alt="Cute bear" 
              className="w-48 h-48 mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-[#ff4d6d] mb-10">Will you be my Valentine? ❤️</h1>
            
            <div className="flex gap-6 justify-center items-center">
              <button
                onClick={handleYes}
                className="bg-green-500 hover:bg-green-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg transform transition-transform active:scale-90"
              >
                YES
              </button>

              <motion.button
                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                className="bg-red-500 text-white px-10 py-3 rounded-xl font-bold shadow-lg"
              >
                NO
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STAGE: THE MENU */}
        {stage === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center z-10"
          >
            <h2 className="text-3xl font-bold text-[#ff4d6d] mb-10 tracking-tight">OMG, you said yes! 🎉</h2>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <MenuIcon icon={<Store size={28} />} label="Shop" onClick={() => setStage('shop')} />
              <MenuIcon icon={<Mail size={28} />} label="Letter" onClick={() => setStage('letter')} />
              <MenuIcon icon={<Gift size={28} />} label="Gift" onClick={() => setStage('gift')} />
            </div>
          </motion.div>
        )}

        {/* STAGE: THE LETTER */}
        {stage === 'letter' && (
          <ContentCard key="letter" title="Words From My Heart" onBack={() => setStage('menu')}>
            <p className="text-gray-600 italic leading-relaxed text-center font-serif">
              "To my favorite person, I wanted to build this just to show you how special you are to me. Thank you for making every day feel like Valentine's Day."
            </p>
          </ContentCard>
        )}

        {/* STAGE: THE GIFT (Photos) */}
        {stage === 'gift' && (
          <ContentCard key="gift" title="Forever Together" onBack={() => setStage('menu')}>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <img src="/photo1.jpg" alt="Us" className="rounded-xl aspect-square object-cover shadow" />
              <img src="/photo2.jpg" alt="Us" className="rounded-xl aspect-square object-cover shadow" />
            </div>
            <p className="text-[11px] text-gray-400 text-center font-mono uppercase mt-4">Memories with you</p>
          </ContentCard>
        )}

        {/* STAGE: THE SHOP */}
        {stage === 'shop' && (
          <ContentCard key="shop" title="Pick Your Flowers" onBack={() => setStage('menu')}>
            <div className="grid grid-cols-2 gap-4">
              <FlowerOption label="Red Roses" emoji="🌹" />
              <FlowerOption label="Sunflowers" emoji="🌻" />
              <FlowerOption label="Tulips" emoji="🌷" />
              <FlowerOption label="Bouquet" emoji="💐" />
            </div>
            <p className="text-center text-[10px] text-pink-300 mt-6 italic">*paid with hugs & kisses*</p>
          </ContentCard>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute top-10 left-10 text-pink-200 opacity-20 -rotate-12"><Heart size={100} fill="currentColor" /></div>
      <div className="absolute bottom-10 right-10 text-pink-200 opacity-20 rotate-12"><Heart size={140} fill="currentColor" /></div>
    </main>
  );
}