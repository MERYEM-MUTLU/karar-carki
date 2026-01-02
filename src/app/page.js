"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [items, setItems] = useState(["Kebap", "Pizza", "Salata", "Sushi", "Ev Yemeği"]);
  const [rotation, setRotation] = useState(0); // Çarkın dönüş açısı
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  // Çarkı döndürme fonksiyonu
  const spinWheel = () => {
    if (isSpinning) return;

    const newRotation = rotation + 1800 + Math.random() * 360; // En az 5 tam tur + rastgele açı
    setRotation(newRotation);
    setIsSpinning(true);
    setWinner(null);

    // Dönme animasyonu bittiğinde (4 saniye sonra)
    setTimeout(() => {
      setIsSpinning(false);
      // Kazananı hesaplama mantığı buraya gelecek
    }, 4000);
  };

  // Çarkın renklerini ve dilimlerini oluşturan dinamik CSS
  const wheelStyle = {
    transform: `rotate(${rotation}deg)`,
    transition: "transform 4s cubic-bezier(0.1, 0, 0.1, 1)", // Gerçekçi yavaşlama efekti
    background: `conic-gradient(
      ${items.map((_, i) => 
        `${i % 2 === 0 ? '#8b5cf6' : '#ec4899'} ${(i * 360) / items.length}deg ${((i + 1) * 360) / items.length}deg`
      ).join(', ')}
    )`
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-white font-sans">
      {/* Başlık */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-purple-400 to-pink-500 bg-clip-text text-transparent">
          KARAR ÇARKI
        </h1>
        <p className="text-slate-400 mt-2">Kararsız kaldığında kadere güven.</p>
      </div>

      {/* Çark Alanı */}
      <div className="relative mb-12">
        {/* Sabit Ok İbresi */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-8 h-10 bg-yellow-400 clip-path-arrow drop-shadow-lg"></div>
        
        {/* Dönen Çark */}
        <div 
          style={wheelStyle}
          className="w-72 h-72 md:w-96 md:h-96 rounded-full border-8 border-slate-800 shadow-[0_0_60px_rgba(168,85,247,0.2)] relative overflow-hidden"
        >
          {/* Dilimlerin üzerindeki metinler */}
          {items.map((item, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-center font-bold text-xs md:text-sm"
              style={{
                transform: `rotate(${(i * 360) / items.length + (360 / items.length / 2)}deg)`,
              }}
            >
              <span className="inline-block mt-4 md:mt-8 origin-bottom">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Göbekteki Buton Görünümlü Süs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 rounded-full border-4 border-slate-700 z-10 shadow-inner"></div>
      </div>

      {/* Kontroller */}
      <div className="w-full max-w-md space-y-4">
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className={`w-full py-5 rounded-2xl font-black text-2xl tracking-widest shadow-lg transition-all active:scale-95 ${
            isSpinning 
            ? "bg-slate-700 cursor-not-allowed" 
            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/40"
          }`}
        >
          {isSpinning ? "DÖNÜYOR..." : "ÇEVİR!"}
        </button>

        {/* Seçenek Listesi Özeti */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {items.map((item, index) => (
            <div key={index} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Küçük bir CSS trick'i: Ok şekli için */}
      <style jsx>{`
        .clip-path-arrow {
          clip-path: polygon(100% 0%, 0% 0%, 50% 100%);
        }
      `}</style>
    </main>
  );
}