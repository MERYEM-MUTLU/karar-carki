"use client"; // Bu satır, sayfanın etkileşimli (tıklanabilir) olmasını sağlar.

import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState(["Kebap", "Pizza", "Salata"]); // Varsayılan seçenekler

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900 text-white">
      {/* Başlık Bölümü */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Karar Çarkı
        </h1>
        <p className="text-slate-400 mt-2">Bugün ne yapsak? Karar veremediysen çarkı çevir!</p>
      </div>

      {/* Çarkın Geleceği Alan (Şimdilik Temsili) */}
      <div className="relative w-64 h-64 mb-10 rounded-full border-8 border-slate-700 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)]">
        <div className="text-xl font-bold italic animate-pulse">Çark Buraya Gelecek</div>
        {/* Çarkın ibresi (Ok işareti) */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500 clip-path-triangle rotate-180"></div>
      </div>

      {/* Kontrol Paneli */}
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Seçenekler</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {items.map((item, index) => (
            <span key={index} className="px-3 py-1 bg-purple-600 rounded-full text-sm">
              {item}
            </span>
          ))}
        </div>
        
        <button 
          onClick={() => alert("Yakında dönecek!")}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
        >
          ÇARKI ÇEVİR
        </button>
      </div>
    </main>
  );
}