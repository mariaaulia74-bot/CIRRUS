import React from 'react';

export default function HeroSection({ onNavigate }) {
  // ☁️ Komponen Awan SVG Minimalis & Modern (Halus saat diperbesar)
  const SvgAwan = ({ className }) => (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M35 40a20 20 0 0136-12 15 15 0 0124 17 20 20 0 01-15 35H30A25 25 0 015 55a20 20 0 0130-15z" />
    </svg>
  );

  return (
    <section id="home" className="pt-12 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[calc(100vh-80px)] relative">
      
      {/* 📝 BAGIAN KIRI: TEXT & TOMBOL (Z-index dinaikkan agar tidak tertutup awan) */}
      <div className="flex-1 text-center lg:text-left space-y-6 z-30 relative">
        <h1 className="text-4xl md:text-6xl font-black text-[#003366] leading-tight tracking-tight">
          Smart Weather for <br />
          <span className="text-[#4A86CC]">Your Daily Life</span>
        </h1>
        <p className="text-base md:text-lg text-[#003366]/60 max-w-xl font-medium leading-relaxed mx-auto lg:mx-0">
          Dapatkan informasi cuaca akurat, pengingat pintar, dan rekomendasi harian untuk aktivitas harian terbaikmu.
        </p>
        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
          <button 
            onClick={() => onNavigate('signup')} 
            className="px-8 py-4 bg-[#2C5282] hover:bg-[#1A365D] text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            Get Started
          </button>
          <a 
            href="#features" 
            className="px-8 py-4 bg-white hover:bg-[#E9F1F8] text-[#2C5282] font-black text-sm uppercase tracking-widest rounded-2xl border border-[#DDEEFE] shadow-sm transition-all text-center"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* ☁️ BAGIAN KANAN & BACKGROUND: ANIMASI AWAN VEKTOR FULL SCREEN GERAK BERPAPASAN */}
      {/* Menggunakan posisi absolute pada layar besar agar aliran awan bisa bergerak luas menembus kanan-kiri screen */}
      <div className="absolute lg:absolute right-0 top-1/2 lg:top-0 -translate-y-1/2 lg:translate-y-0 w-full lg:w-[55%] h-[400px] lg:h-full overflow-hidden pointer-events-none z-10">
        
        {/* Efek Cahaya Biru Lembut di Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#A4D8FB]/30 rounded-full blur-3xl -z-10 animate-pulse"></div>

        {/* CONTAINER UTAMA ALIRAN AWAN */}
        <div className="w-full h-full flex flex-col justify-center gap-12 lg:gap-20 relative">
          
          {/* BARIS 1: AWAN VEKTOR RAKSASA BERGERAK KE KIRI (←) */}
          <div className="flex w-[200%] animate-awan-kiri text-[#A4D8FB]/35 whitespace-nowrap gap-24 items-center">
            <div className="flex justify-around w-full min-w-full items-center">
              <SvgAwan className="w-48 h-48 lg:w-72 lg:h-72" />
              <SvgAwan className="w-32 h-32 lg:w-44 lg:h-44 opacity-50 mt-16" />
              <SvgAwan className="w-56 h-56 lg:w-80 lg:h-80 opacity-70" />
            </div>
            <div className="flex justify-around w-full min-w-full items-center">
              <SvgAwan className="w-48 h-48 lg:w-72 lg:h-72" />
              <SvgAwan className="w-32 h-32 lg:w-44 lg:h-44 opacity-50 mt-16" />
              <SvgAwan className="w-56 h-56 lg:w-80 lg:h-80 opacity-70" />
            </div>
          </div>

          {/* BARIS 2: AWAN VEKTOR RAKSASA BERGERAK KE KANAN (→) */}
          <div className="flex w-[200%] animate-awan-kanan text-[#A4D8FB]/25 whitespace-nowrap gap-24 items-center">
            <div className="flex justify-around w-full min-w-full items-center">
              <SvgAwan className="w-64 h-64 lg:w-96 lg:h-96 opacity-60" />
              <SvgAwan className="w-40 h-40 lg:w-56 lg:h-56 mt-[-40px]" />
              <SvgAwan className="w-48 h-48 lg:w-64 lg:h-64 opacity-40" />
            </div>
            <div className="flex justify-around w-full min-w-full items-center">
              <SvgAwan className="w-64 h-64 lg:w-96 lg:h-96 opacity-60" />
              <SvgAwan className="w-40 h-40 lg:w-56 lg:h-56 mt-[-40px]" />
              <SvgAwan className="w-48 h-48 lg:w-64 lg:h-64 opacity-40" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}