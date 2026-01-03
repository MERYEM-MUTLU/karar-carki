"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", 
  "#F7DC6F", "#BB8FCE", "#82E0AA", "#F1948A", "#85C1E9"
];

export default function Home() {
  const [items, setItems] = useState(["Kebap", "Pizza", "Salata", "Sushi", "Burger"]);
  const [newItem, setNewItem] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  // --- SES REFERANSLARI ---
  const clickAudio = useRef(null);
  const winAudio = useRef(null);

  const fireConfetti = () => {
    const end = Date.now() + 3 * 1000;
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const addItem = (e) => {
    e.preventDefault();
    if (newItem.trim() !== "" && items.length < 10) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index) => {
    if (items.length > 2) setItems(items.filter((_, i) => i !== index));
  };

  const spinWheel = () => {
    if (isSpinning) return;

    const spinDegree = 2000 + Math.random() * 2000;
    const newRotation = rotation + spinDegree;
    setRotation(newRotation);
    setIsSpinning(true);
    setWinner(null);

    // --- TIK TIK SESİ MANTIĞI ---
    let lastClickAngle = 0;
    const sliceSize = 360 / items.length;
    
    const audioInterval = setInterval(() => {
      if (clickAudio.current) {
        clickAudio.current.currentTime = 0;
        clickAudio.current.play().catch(() => {}); 
      }
    }, 150); // Dönüş süresince her 150ms'de bir tık sesi

    setTimeout(() => {
      clearInterval(audioInterval);
      setIsSpinning(false);
      
      const actualDegree = newRotation % 360;
      const reversedDegree = (360 - actualDegree) % 360;
      const winnerIndex = Math.floor(reversedDegree / sliceSize);
      
      setWinner(items[winnerIndex]);
      fireConfetti();
      
      // --- ZAFER SESİ ---
      if (winAudio.current) {
        winAudio.current.play().catch(() => {});
      }
    }, 4000);
  };

  const wheelStyle = {
    transform: `rotate(${rotation}deg)`,
    transition: "transform 4s cubic-bezier(0.1, 0, 0.1, 1)",
    background: `conic-gradient(
      ${items.map((_, i) => 
        `${COLORS[i % COLORS.length]} ${(i * 360) / items.length}deg ${((i + 1) * 360) / items.length}deg`
      ).join(', ')}
    )`
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f172a] text-white overflow-x-hidden">
      
      {/* GÖRÜNMEZ SES ELEMENTLERİ */}
      <audio ref={clickAudio} src="/click.mp3" preload="auto" />
      <audio ref={winAudio} src="/win.mp3" preload="auto" />

      {/* ARKA PLAN EFEKTLERİ */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>

      {/* KAZANAN POP-UP */}
      {winner && !isSpinning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-xl">
          <div className="bg-slate-900 p-12 rounded-[40px] border-4 border-white/10 text-center shadow-[0_0_100px_rgba(255,255,255,0.1)]">
            <h2 className="text-sm uppercase tracking-[0.4em] text-slate-400 mb-2">Sonuç</h2>
            <p className="text-7xl font-black mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {winner}
            </p>
            <button onClick={() => setWinner(null)} className="px-12 py-4 bg-white text-black rounded-2xl font-black hover:bg-yellow-400 transition-all">
              DEVAM ET
            </button>
          </div>
        </div>
      )}

      <h1 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter text-center italic">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500">
          COLORFUL
        </span>
        <br /> WHEEL
      </h1>

      <div className="relative mb-16">
        {/* OK İBRESİ */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40 w-12 h-14 bg-white shadow-2xl" 
             style={{ clipPath: 'polygon(100% 0%, 0% 0%, 50% 100%)' }}></div>
        
        {/* ÇARK */}
        <div className="p-4 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 shadow-2xl">
            <div style={wheelStyle} className="w-72 h-72 md:w-[500px] md:h-[500px] rounded-full border-[10px] border-slate-900 relative overflow-hidden">
            {items.map((item, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-center"
                    style={{ transform: `rotate(${(i * 360) / items.length + (360 / items.length / 2)}deg)` }}>
                <span className="inline-block mt-8 md:mt-16 text-xs md:text-lg font-black uppercase text-slate-900">
                    {item}
                </span>
                </div>
            ))}
            </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 rounded-full z-20 border-4 border-white flex items-center justify-center text-2xl shadow-2xl">
            🎡
        </div>
      </div>

      <div className="w-full max-w-xl space-y-6">
        {/* SEÇENEK ETİKETLERİ */}
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((item, index) => (
            <button key={index} onClick={() => removeItem(index)} 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    className="px-4 py-2 rounded-xl text-slate-900 font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
              {item} <span>✕</span>
            </button>
          ))}
        </div>

        <form onSubmit={addItem} className="relative group">
          <input
            type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)}
            placeholder="Seçenek ekle..."
            className="w-full bg-white/10 border-2 border-white/10 rounded-3xl px-8 py-5 focus:outline-none focus:border-white/40 text-xl font-medium"
          />
          <button type="submit" className="absolute right-3 top-3 bottom-3 bg-white text-black px-8 rounded-2xl font-bold hover:bg-yellow-400">
            EKLE
          </button>
        </form>

        <button
          onClick={spinWheel} disabled={isSpinning}
          className={`w-full py-8 rounded-[40px] font-black text-4xl tracking-widest transition-all ${
            isSpinning 
            ? "bg-slate-800 opacity-50 cursor-not-allowed" 
            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-[1.02] shadow-2xl shadow-purple-500/20"
          }`}
        >
          {isSpinning ? "DÖNÜYOR..." : "ÇEVİR!"}
        </button>
      </div>
    </main>
  );
}