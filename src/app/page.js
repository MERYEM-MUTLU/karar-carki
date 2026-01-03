"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti"; // Konfeti kütüphanesi

export default function Home() {
  const [items, setItems] = useState(["Kebap", "Pizza", "Salata", "Sushi", "Burger"]);
  const [newItem, setNewItem] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  // Ses referansları
  const clickAudio = useRef(null);
  const winAudio = useRef(null);

  // Konfeti Patlatma Fonksiyonu
  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#f59e0b']
    });
  };

  const addItem = (e) => {
    e.preventDefault();
    if (newItem.trim() !== "" && items.length < 12) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index) => {
    if (items.length > 2) setItems(items.filter((_, i) => i !== index));
  };

  const spinWheel = () => {
    if (isSpinning) return;

    const spinDegree = 1800 + Math.random() * 360;
    const newRotation = rotation + spinDegree;
    setRotation(newRotation);
    setIsSpinning(true);
    setWinner(null);

    // Çark dönerken belirli aralıklarla "tık" sesi çalma simülasyonu
    const interval = setInterval(() => {
        if (clickAudio.current) {
            clickAudio.current.currentTime = 0;
            clickAudio.current.play().catch(() => {}); // Kullanıcı etkileşimi gerekebilir
        }
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
      
      const actualDegree = newRotation % 360;
      const reversedDegree = (360 - actualDegree) % 360;
      const sliceSize = 360 / items.length;
      const winnerIndex = Math.floor(reversedDegree / sliceSize);
      
      const result = items[winnerIndex];
      setWinner(result);

      // Kazanınca yapılacaklar
      fireConfetti();
      if (winAudio.current) winAudio.current.play().catch(() => {});
    }, 4000);
  };

  const wheelStyle = {
    transform: `rotate(${rotation}deg)`,
    transition: "transform 4s cubic-bezier(0.1, 0, 0.1, 1)",
    background: `conic-gradient(
      ${items.map((_, i) => 
        `${i % 2 === 0 ? '#8b5cf6' : '#ec4899'} ${(i * 360) / items.length}deg ${((i + 1) * 360) / items.length}deg`
      ).join(', ')}
    )`
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-white font-sans">
      
      {/* Görünmez Ses Elementleri */}
      <audio ref={clickAudio} src="/click.mp3" />
      <audio ref={winAudio} src="/win.mp3" />

      {/* KAZANAN MODAL */}
      {winner && !isSpinning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md">
          <div className="bg-slate-800 p-10 rounded-[30px] border-2 border-purple-500 text-center shadow-[0_0_80px_rgba(168,85,247,0.5)] animate-in zoom-in duration-300">
            <p className="text-purple-400 font-bold tracking-[0.2em] mb-2 uppercase">Şanslı Seçim</p>
            <h2 className="text-7xl font-black text-white mb-8 drop-shadow-lg">{winner}</h2>
            <button 
              onClick={() => setWinner(null)}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-black hover:scale-110 transition-transform shadow-lg shadow-purple-500/40"
            >
              HARİKA!
            </button>
          </div>
        </div>
      )}

      {/* ... (Başlık ve Çark Görseli kısmı bir öncekiyle aynı kalabilir) ... */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
          KARAR ÇARKI
        </h1>
      </div>

      <div className="relative mb-12">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-10 h-10 bg-white shadow-[0_0_20px_white] transition-transform duration-75" 
             style={{ clipPath: 'polygon(100% 0%, 0% 0%, 50% 100%)', transform: isSpinning ? 'translateX(-50%) rotate(5deg)' : 'translateX(-50%)' }}></div>
        
        <div style={wheelStyle} className="w-80 h-80 md:w-[500px] md:h-[500px] rounded-full border-[12px] border-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {items.map((item, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-center font-bold"
                 style={{ transform: `rotate(${(i * 360) / items.length + (360 / items.length / 2)}deg)` }}>
              <span className="inline-block mt-8 md:mt-14 text-sm md:text-xl uppercase tracking-widest text-white drop-shadow-md">
                {item}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full z-20 shadow-xl border-8 border-slate-900"></div>
      </div>

      {/* KONTROLLER */}
      <div className="w-full max-w-md space-y-4">
        <form onSubmit={addItem} className="flex gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <input
            type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)}
            placeholder="Ne ekleyelim?" maxLength={20}
            className="flex-1 bg-transparent px-4 py-2 focus:outline-none font-medium"
          />
          <button type="submit" className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-purple-100 transition-colors">
            EKLE
          </button>
        </form>

        <button
          onClick={spinWheel} disabled={isSpinning}
          className={`w-full py-6 rounded-3xl font-black text-3xl tracking-widest transition-all active:scale-95 shadow-2xl ${
            isSpinning ? "bg-slate-800 text-slate-600 shadow-none" : "bg-white text-black hover:bg-purple-500 hover:text-white"
          }`}
        >
          {isSpinning ? "DÖNÜYOR..." : "ÇEVİR!"}
        </button>
      </div>
    </main>
  );
}