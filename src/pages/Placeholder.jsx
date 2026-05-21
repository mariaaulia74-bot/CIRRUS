import React, { useState, useEffect } from 'react';
import { fetchWeatherByCity } from '../services/weatherService';
import { getAIOpinion } from '../services/aiService';

// Fungsi penjelas kode cuaca Open-Meteo ke bahasa manusia
const tafsirkanKodeCuaca = (code) => {
  if (code === 0) return 'Cerah';
  if ([1, 2, 3].includes(code)) return 'Cerah Berawan';
  if ([45, 48].includes(code)) return 'Berkabut';
  if ([51, 53, 55, 61, 63, 65].includes(code)) return 'Hujan Ringan';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Hujan Salju';
  if ([80, 81, 82, 95, 96, 99].includes(code)) return 'Hujan Lebat & Petir';
  return 'Berawan';
};

function Placeholder() {
  const [currentLocation, setCurrentLocation] = useState('KALIMANTAN SELATAN'); 
  const [liveWeather, setLiveWeather] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('Gemini AI sedang membaca satelit cuaca...');
  const [isLoading, setIsLoading] = useState(false);

  const provinces = [
    { nama: 'KALIMANTAN SELATAN', kota: 'Banjarmasin' },
    { nama: 'KALIMANTAN BARAT', kota: 'Pontianak' },
    { nama: 'KALIMANTAN TIMUR', kota: 'Samarinda' },
    { nama: 'KALIMANTAN TENGAH', kota: 'Palangkaraya' },
    { nama: 'KALIMANTAN UTARA', kota: 'TanjungSelor' }
  ];

  useEffect(() => {
    const muatData = async () => {
      setIsLoading(true);
      setAiSuggestion('Gemini AI sedang menganalisis kondisi atmosfer...');
      try {
        const target = provinces.find(p => p.nama === currentLocation) || provinces[0];
        
        // 1. Ambil data cuaca dari mesin buatanmu
        const dataCuaca = await fetchWeatherByCity(target.kota);
        setLiveWeather(dataCuaca);

        // 2. Minta saran ke Gemini AI buatanmu
        const saranAI = await getAIOpinion(dataCuaca);
        setAiSuggestion(saranAI);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        setAiSuggestion("Gagal menyambungkan ke asisten pintar.");
      } finally {
        setIsLoading(false);
      }
    };

    muatData();
  }, [currentLocation]);

  return (
    <div className="flex h-screen bg-[#F0F5FA] font-sans text-[#003366] overflow-hidden">
      
      {/* --- SIDEBAR AMAN (TANPA GAMBAR CRASH) --- */}
      <aside className="w-64 bg-[#E9F1F8] flex flex-col py-10 px-6 border-r border-slate-200 shrink-0">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-20 h-20 rounded-full mb-3 shadow-inner bg-white flex items-center justify-center text-4xl">
            👤
          </div>
          <h3 className="font-black text-lg uppercase tracking-tight">Bahlil</h3>
          <p className="text-[10px] opacity-40 uppercase font-black tracking-widest mt-1">Welcome!</p>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="flex items-center gap-4 px-5 py-3.5 bg-[#55ACEE] text-white rounded-xl font-bold shadow-md">
            <span>🏠</span> <span className="text-xs uppercase tracking-widest">Beranda</span>
          </div>
          <div className="flex items-center gap-4 px-5 py-3.5 text-[#003366] opacity-40 hover:opacity-100 transition rounded-xl font-bold">
            <span>📅</span> <span className="text-xs uppercase tracking-widest">Kalender</span>
          </div>
          <div className="flex items-center gap-4 px-5 py-3.5 text-[#003366] opacity-40 hover:opacity-100 transition rounded-xl font-bold">
            <span>🗺️</span> <span className="text-xs uppercase tracking-widest">Peta</span>
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-[#7ab7f0] to-white">
        
        {/* Header */}
        <header className="flex justify-between items-center px-10 py-5 bg-white/30 backdrop-blur-md border-b border-white/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌦️</span>
            <span className="font-black text-lg uppercase tracking-tighter text-[#2C5282]">Cirrus</span>
          </div>
          <div className="text-xs font-bold opacity-60 uppercase">Kamis, 21 Mei 2026</div>
        </header>

        {/* Konten Utama */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          
          {/* Judul & Pilihan Wilayah */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-black text-[#003366] uppercase tracking-wide">{currentLocation}</h1>
              <p className="text-xs opacity-50">Kondisi real-time stasiun cuaca pulau Kalimantan</p>
            </div>
            
            {/* Dropdown Filter Provinsi */}
            <select 
              value={currentLocation} 
              onChange={(e) => setCurrentLocation(e.target.value)}
              className="bg-white/80 border border-white backdrop-blur-md px-4 py-2.5 rounded-xl font-bold text-xs text-[#2C5282] uppercase tracking-wider shadow-sm focus:outline-none"
            >
              {provinces.map(p => (
                <option key={p.nama} value={p.nama}>{p.nama}</option>
              ))}
            </select>
          </div>

          {/* Kartu Utama Cuaca & AI */}
          <div className="relative bg-gradient-to-r from-[#A4D8FB]/90 to-[#DDEEFE]/60 backdrop-blur-2xl rounded-[35px] border border-white p-10 shadow-xl flex flex-col md:flex-row justify-between items-center min-h-72 gap-6">
            <div className="flex items-center gap-8 shrink-0">
              <span className="text-8xl md:text-9xl animate-bounce">🌦️</span>
              <div className="h-28 w-0.5 bg-[#003366]/10 mx-2 hidden md:block"></div>
              <div>
                <h2 className="text-sm font-black opacity-50 uppercase tracking-widest mb-1">
                  {isLoading ? 'Menghubungkan ke Satelit...' : 'Kondisi Sekarang'}
                </h2>
                <div className="flex items-start">
                  <span className="text-7xl md:text-8xl font-black leading-none tracking-tighter text-[#003366]">
                    {liveWeather ? liveWeather.suhu : '...'}
                  </span>
                  <div className="ml-3 mt-2">
                    <span className="text-xl font-bold text-[#2C5282] block">
                      {liveWeather ? tafsirkanKodeCuaca(liveWeather.kodeCuaca) : 'Loading...'}
                    </span>
                    {liveWeather && (
                      <span className="text-[11px] font-semibold opacity-60 block mt-1">
                        💨 {liveWeather.kecepatanAngin} | 💧 {liveWeather.kelembapan}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Kotak Asisten Gemini AI Buatanmu */}
            <div className="w-full max-w-sm">
              <div className="bg-[#2C5282] text-white p-5 rounded-2xl text-xs font-bold shadow-lg border border-white/10 leading-relaxed">
                <div className="text-[10px] text-cyan-300 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  ✨ Gemini AI Smart Assistant
                </div>
                "{aiSuggestion}"
              </div>
            </div>
          </div>

          {/* Prakiraan Per Jam & Info Tambahan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-widest opacity-60 mb-4">Prakiraan Siang Ini</h3>
              <div className="flex justify-between text-center gap-2">
                <div className="bg-white p-3 rounded-xl flex-1 shadow-2xs"><p className="text-[10px] opacity-50">12:00</p><p className="text-lg font-black">29°</p></div>
                <div className="bg-white p-3 rounded-xl flex-1 shadow-2xs"><p className="text-[10px] opacity-50">13:00</p><p className="text-lg font-black">30°</p></div>
                <div className="bg-white p-3 rounded-xl flex-1 shadow-2xs"><p className="text-[10px] opacity-50">14:00</p><p className="text-lg font-black">31°</p></div>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm flex flex-col justify-center">
              <h3 className="font-black text-xs uppercase tracking-widest opacity-60 mb-2">Status Sistem CIRRUS</h3>
              <div className="space-y-1.5 text-xs font-bold">
                <p className="text-emerald-600">● Database Supabase: Connected</p>
                <p className="text-emerald-600">● Weather API: Live (Kalimantan Region)</p>
                <p className="text-indigo-600">● Gemini 2.5 Flash: Ready to Advice</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}