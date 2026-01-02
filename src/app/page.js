"use client";

import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState(["Kebap", "Pizza", "Salata", "Sushi"]);
  const [newItem, setNewItem] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  // 1. Seçenek Ekleme
  const addItem = (e) => {
    e.preventDefault();
    if (newItem.trim() !== "" && items.length < 12) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  // 2. Seçenek Silme
  const removeItem = (index) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      alert("En az 2 seçenek olmalı!");
    }
  };

  // 3. Çarkı Döndürme ve Kazananı Hesaplama
  const spinWheel = () => {
    if (isSpinning) return;

    const spinDegree = 1800 + Math.random() * 360; // En az 5 tam tur + rastgele açı
    const newRotation = rotation + spinDegree;
    setRotation(newRotation);
    setIsSpinning(true);
    setWinner(null);

    setTimeout(() => {
      setIsSpinning(false);
      
      // Kazanan hesaplama: 
      // Çarkın durduğu açının 360'a bölümünden kalanı bulup, 
      // ok yukarıda (0 derece) olduğu için ters açıdan hangi dilime geldiğine bakıyoruz.
      const actualDegree = newRotation % 360;
      const reversedDegree = (360 - actualDegree) % 360;
      const sliceSize = 360 / items.length;
      const winnerIndex = Math.floor(reversedDegree / sliceSize);
      
      setWinner(items[winnerIndex]);
    }, 4000); // 4 saniye (CSS transition süresiyle aynı olmalı)
  };

  // Dinamik Çark Stili
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
      
      {/* KAZANAN POP-UP */}
      {winner && !isSpinning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md">
          <div className="bg-slate-800 p-10 rounded-[30px] border-2 border-purple-500 text-center shadow-[0_0_50px_rgba(168,85,247,0.4)] animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl text-purple-400 font-bold mb-2 uppercase tracking-widest">Kaderin Cevabı:</h2>
            <p className="text-6xl font-black text-white mb-6">{winner}</p>
            <button 
              onClick={() => setWinner(null)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:scale-105 transition-transform"
            >
              TEKRAR DENE
            </button>
          </div>
        </div>
      )}

      {/* BAŞLIK */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          KARAR ÇARKI
        </h1>
        <p className="text-slate-400 mt-2 font-medium">Seçenekleri gir, çarkı çevir, şansına güven!</p>
      </div>

      {/* ÇARK GÖRSELİ */}
      <div className="relative mb-12">
        {/* Ok İbresi */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-10 h-10 bg-yellow-400 shadow-xl" 
             style={{ clipPath: 'polygon(100% 0%, 0% 0%, 50% 100%)' }}></div>
        
        {/* Dönen Gövde */}
        <div 
          style={wheelStyle}
          className="w-72 h-72 md:w-[450px] md:h-[450px] rounded-full border-[12px] border-slate-900 shadow-2xl relative overflow-hidden"
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-center font-bold"
              style={{
                transform: `rotate(${(i * 360) / items.length + (360 / items.length / 2)}deg)`,
              }}
            >
              <span className="inline-block mt-6 md:mt-12 text-sm md:text-lg uppercase tracking-wider">
                {item}
              </span>
            </div>
          ))}
        </div>
        {/* Orta Göbek */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 rounded-full border-4 border-slate-700 z-20 shadow-inner"></div>
      </div>

      {/* KONTROL PANELİ */}
      <div className="w-full max-w-md space-y-6">
        <form onSubmit={addItem} className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Yeni seçenek yaz..."
            maxLength={15}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 px-8 rounded-2xl font-bold transition-colors"
          >
            EKLE
          </button>
        </form>

        {/* Mevcut Seçenekler */}
        <div className="flex flex-wrap justify-center gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-sm font-medium">{item}</span>
              <button 
                onClick={() => removeItem(index)}
                className="text-slate-500 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Ana Buton */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`w-full py-6 rounded-[2rem] font-black text-2xl tracking-widest shadow-2xl transition-all active:scale-95 ${
            isSpinning 
            ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
            : "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_auto] hover:bg-right shadow-purple-500/20"
          }`}
        >
          {isSpinning ? "KADER BELİRLENİYOR..." : "ÇARKICI ÇEVİR"}
        </button>
      </div>
    </main>
  );
}