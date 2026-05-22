import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';     
import 'react-calendar/dist/Calendar.css'; 

/* --- 1. IMPORT ASET MENU & CUACA UTAMA --- */
import iconHome from '../assets/home.svg';
import iconCalendar from '../assets/calendar.svg';
import iconMap from '../assets/map.svg';
import iconWind from '../assets/wind.svg';
import iconSetting from '../assets/setting.svg';
import iconLogout from '../assets/logout.svg';
import weatherMain from '../assets/weather-main.svg'; 
import weatherRainSun from '../assets/weather-rain-sun.svg';
import weatherCloud from '../assets/weather-cloud.svg';
import weatherSunnyUmbrella from '../assets/weather-sunny-umbrella.svg';
import avatarBahlil from '../assets/avatar-bahlil.svg';

/* --- IMPORT TAMBAHAN UNTUK PETA LEAFLET --- */
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Perbaikan bug gambar icon marker di React + Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

/* --- 2. IMPORT ASET JADWAL --- */
import iconUmbrella from '../assets/icon-umbrella.svg';
import iconCold from '../assets/icon-cold.svg';
import iconMask from '../assets/icon-mask.svg';
import iconNoodles from '../assets/icon-noodles.svg';
import iconNetflix from '../assets/icon-netflix.svg';

/* --- 3. IMPORT CORE BACKEND --- */
import { fetchWeatherByCity } from '/src/services/weatherService';
import { getAIOpinion } from '/src/services/aiService';

// Fungsi pembantu untuk mencocokkan Filter Provinsi ke Kota di backend kamu
const dapatkanKotaDariProvinsi = (provinsi) => {
  switch (provinsi) {
    case 'KALIMANTAN SELATAN': return 'Banjarmasin';
    case 'KALIMANTAN BARAT': return 'Pontianak';
    case 'KALIMANTAN TIMUR': return 'Samarinda';
    case 'KALIMANTAN TENGAH': return 'Palangkaraya';
    case 'KALIMANTAN UTARA': return 'TanjungSelor';
    default: return 'Banjarmasin';
  }
};

// Fungsi penjelas kode cuaca Open-Meteo ke bahasa manusia biasa
const tafsirkanKodeCuaca = (code) => {
  if (code === 0) return 'Cerah';
  if ([1, 2, 3].includes(code)) return 'Cerah Berawan';
  if ([45, 48].includes(code)) return 'Berkabut';
  if ([51, 53, 55, 61, 63, 65].includes(code)) return 'Hujan Ringan';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Hujan Salju / Es';
  if ([80, 81, 82, 95, 96, 99].includes(code)) return 'Hujan Lebat / Petir';
  return 'Berawan';
};

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('beranda'); 
  const [currentLocation, setCurrentLocation] = useState('KALIMANTAN SELATAN'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  
  // State Kalender dipindahkan ke sini agar bisa diakses oleh sub-komponen jika dibutuhkan
  const [selectedDate, setSelectedDate] = useState(new Date());

  /* --- STATE MANAGEMENT UTK DATA LIVE --- */
  const [liveWeather, setLiveWeather] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('Sedang merumuskan saran terbaik dari Gemini AI...');
  const [isLoading, setIsLoading] = useState(false);

  /* ========================================================= */
  /* ALUR PROSES DATA BACKEND & AI - SEHAT & ANTI LOOP         */
  /* ========================================================= */

  // EFEK 1: Hanya bertugas mengambil data cuaca mentah dari API Open-Meteo
  useEffect(() => {
    const ambilDataCuacaSatelit = async () => {
      setIsLoading(true);
      try {
        const targetKota = dapatkanKotaDariProvinsi(currentLocation);
        const dataCuaca = await fetchWeatherByCity(targetKota);
        setLiveWeather(dataCuaca);
      } catch (err) {
        console.error("Gagal menarik data stasiun cuaca:", err);
      } finally {
        setIsLoading(false);
      }
    };

    ambilDataCuacaSatelit();
  }, [currentLocation]); // Hanya terpicu jika wilayah provinsi diganti!

  useEffect(() => {
    const ambilRekomendasiDariGemini = async () => {
      if (!liveWeather || !liveWeather.name) return; 

      setAiSuggestion('Gemini AI sedang membaca satelit cuaca...');
      try {
        const saranTerbaru = await getAIOpinion(liveWeather);
        setAiSuggestion(saranTerbaru);
      } catch (aiErr) {
        console.error("Koneksi API Gemini bermasalah:", aiErr);
        setAiSuggestion("Gagal memuat saran aktivitas otomatis untuk saat ini.");
      }
    };

    ambilRekomendasiDariGemini();
  }, [liveWeather?.name]);

  return (
    <div className="flex h-screen bg-[#F0F5FA] font-sans text-[#003366] overflow-hidden relative">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#E9F1F8] flex flex-col py-10 px-6 border-r border-slate-200 shrink-0 z-50">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-white shadow-sm bg-white">
            <img src={avatarBahlil} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-black text-xl tracking-tight uppercase">Bahlil</h3>
          <p className="text-[10px] opacity-40 uppercase font-black tracking-widest mt-1">Welcome!</p>
        </div>

        <nav className="flex-1 space-y-3">
          <NavItem icon={iconHome} label="Beranda" active={activeMenu === 'beranda'} onClick={() => setActiveMenu('beranda')} />
          <NavItem icon={iconCalendar} label="Kalender" active={activeMenu === 'kalender'} onClick={() => setActiveMenu('kalender')} />
          <NavItem icon={iconMap} label="Peta" active={activeMenu === 'peta'} onClick={() => setActiveMenu('peta')} />
          {/* PERBAIKAN: Target diubah ke 'kualitas udara' agar match dengan kondisional kontent */}
          <NavItem icon={iconWind} label="Kualitas Udara" active={activeMenu === 'kualitas udara'} onClick={() => setActiveMenu('kualitas udara')} />
        </nav>

        <div className="space-y-6 pt-10 border-t border-slate-200">
          <button className="flex items-center gap-5 px-4 font-bold text-sm opacity-40 hover:opacity-100 transition cursor-pointer">
            <img src={iconSetting} alt="" className="w-6 h-6" /> Setting
          </button>
          <button className="flex items-center gap-5 px-4 font-bold text-sm text-[#E74C3C] hover:scale-105 transition cursor-pointer">
            <img src={iconLogout} alt="" className="w-6 h-6" /> Log Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-linear-to-b from-[#7ab7f0] to-white">
        
        <header className="flex justify-between items-center px-10 py-6 bg-white/30 backdrop-blur-md border-b border-white/50 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <img src={weatherRainSun} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-black text-lg uppercase tracking-tighter text-[#55ACEE]">Cirrus</span>
          </div>
          <div className="relative w-full max-w-xl mx-10">
            <input type="text" placeholder="Cari wilayah..." className="w-full bg-white/50 backdrop-blur-sm py-3 px-8 rounded-full border border-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#A4D8FB]" />
            <span className="absolute right-6 top-3.5 opacity-30">🔍</span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm shrink-0 bg-white">
             <img src={avatarBahlil} alt="" className="w-full h-full object-cover" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
          {activeMenu === 'beranda' && (
             <BerandaView 
               currentLocation={currentLocation} 
               openFilter={() => setIsFilterOpen(true)} 
               liveWeather={liveWeather}
               aiSuggestion={aiSuggestion}
               isLoading={isLoading}
             />
          )}
          {activeMenu === 'kalender' && (
             <KalenderView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          )}
          {activeMenu === 'peta' && (
              <PetaView />
          )}
          {/* PERBAIKAN: Menambahkan render halaman Kualitas Udara */}
          {activeMenu === 'kualitas udara' && (
              <KualitasUdaraView />
          )}
        </div>
      </main>

      {isFilterOpen && (
        <FilterModal currentLocation={currentLocation} close={() => setIsFilterOpen(false)} save={(loc) => { setCurrentLocation(loc); setIsFilterOpen(false); }} />
      )}

    </div>
  );
}

/* ========================================================= */
/* SUB-KOMPONEN 1: KALENDER                                  */
/* ========================================================= */
function KalenderView({ selectedDate, setSelectedDate }) {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#003366]">Kalender</h1>
          <p className="text-xs font-bold opacity-40 uppercase mt-1 text-[#003366]">Kamis, 21 Mei 2026, 12:37</p>
        </div>
        <button className="text-2xl opacity-40 hover:opacity-100 transition cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        </button>
      </div>

      <div className="flex justify-center items-center py-6">
        <div className="text-slate-800 custom-cirrus-calendar w-full max-w-3xl drop-shadow-2xl animate-float">
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-black text-[#003366] mb-4 uppercase tracking-widest">My Schedule</h2>
        <div className="space-y-4">
          <ScheduleCard icon={iconUmbrella} fallbackEmoji="☂️" text="Hujan di sore hari, " highlight="bawa payung" location="Nordu Cafe" time="16:00" active={true} />
          <ScheduleCard icon={iconUmbrella} fallbackEmoji="☂️" text="Hujan di malam hari, " highlight="bawa payung" location="Mall" time="20:00" active={true} />
          <ScheduleCard icon={iconCold} fallbackEmoji="🥶" text="Cuaca mencapai 10°, " highlight="pakai jaket" location="Olahraga di SKB" time="04:00" active={false} />
          <ScheduleCard icon={iconMask} fallbackEmoji="😷" text="Polusi tebal, " highlight="bawa masker" location="Nordu Cafe" time="12:00" active={false} />
        </div>
      </div>

      <div className="pt-6">
        <h2 className="text-lg font-black text-[#003366] mb-4 uppercase tracking-widest">Saran Harian</h2>
        <div className="space-y-4">
          <SuggestionCard icon={iconNetflix} fallbackEmoji="☀️" text="Hari ini cocok buat jemur baju" time="08:00" active={true} />
          <SuggestionCard icon={iconNoodles} fallbackEmoji="🍜" text="Hari ini cocok makan mie ayam" time="18:00" active={true} />
          <SuggestionCard icon={iconNetflix} fallbackEmoji="🎬" text="Hari ini cocok buat nonton Film" time="21:00" active={true} />
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SUB-KOMPONEN 2: BERANDA                                   */
/* ========================================================= */
function BerandaView({ currentLocation, openFilter, liveWeather, aiSuggestion, isLoading }) {
  const [activeTab, setActiveTab] = useState('7hari');

  return (
    <div className="space-y-12 pb-20">
      <section>
        <div className="flex justify-between items-end mb-6 px-2">
          <div onClick={openFilter} className="cursor-pointer group">
            <h1 className="text-3xl font-black uppercase tracking-widest text-[#4A86CC] group-hover:text-[#2C5282] transition-colors">
              {currentLocation} <span className="text-lg opacity-50">▼</span>
            </h1>
            <p className="text-xs font-bold opacity-30 uppercase mt-1">Kamis, 21 Mei 2026, 12:37 (Klik untuk ganti wilayah)</p>
          </div>
          <button onClick={openFilter} className="flex items-center gap-2 bg-white/60 hover:bg-white backdrop-blur-md border border-white px-5 py-2.5 rounded-xl font-black text-sm text-[#4A86CC] uppercase tracking-widest shadow-sm cursor-pointer">
            <span>🗺️</span> Filter
          </button>
        </div>  
        
        {/* KOTAK INDUK CUACA UTAMA */}
        <div className="relative bg-linear-to-r from-[#A4D8FB]/90 to-[#DDEEFE]/60 backdrop-blur-2xl rounded-[40px] border border-white p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center overflow-hidden min-h-80 w-full mb-6">
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#4A86CC] opacity-80"></div>
          
          <div className="flex items-center gap-10 shrink-0 w-full md:w-auto mr-4">
            <img src={weatherMain} alt="" className="w-64 md:w-80 h-auto animate-float drop-shadow-2xl" />
            <div className="h-36 w-0.5 bg-[#003366]/10 mx-4"></div>
            
            {/* LOGIKA DATA LIVE SATELIT CUACA */}
            <div className="flex-1">
              <h2 className="text-xl font-black opacity-60 uppercase tracking-widest mb-1 leading-none">
                {isLoading ? 'Menghubungkan ke Stasiun Cuaca...' : 'Keadaan Cuaca Sekarang'}
              </h2>
              <div className="flex items-start">
                <span className="text-[100px] md:text-[120px] font-black leading-none tracking-tighter">
                  {liveWeather ? liveWeather.suhu : '...'}
                </span>
                <div className="mt-8 ml-4">
                  <span className="text-2xl font-bold opacity-70 block leading-none text-[#2C5282]">
                    {liveWeather ? tafsirkanKodeCuaca(liveWeather.kodeCuaca) : 'Loading...'}
                  </span>
                  {liveWeather && (
                    <span className="text-xs font-medium opacity-50 block mt-2">
                      💨 Angin: {liveWeather.kecepatanAngin} | 💧 Lembap: {liveWeather.kelembapan}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOTAK REKOMENDASI GEMINI AI */}
        <div className="w-full mt-4 z-10">
          <div className="bg-[#2C5282] text-white p-6 rounded-[25px] text-sm font-semibold shadow-xl border border-white/20 leading-relaxed w-full text-left">
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <span className="text-xl">🤖</span>
              <span className="font-black text-xs uppercase tracking-widest text-[#A4D8FB]">Gemini AI Smart Assistant</span>
            </div>
            <p className="italic text-base">"{aiSuggestion}"</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-14 pb-20">
        <div className="space-y-6">
          <h3 className="font-black uppercase tracking-widest opacity-40 text-sm px-2">Prakiraan Per Jam</h3>
          <div className="bg-[#DDEEFE]/60 rounded-[35px] p-2 flex justify-between overflow-x-auto no-scrollbar gap-4">
            <HourCard time="12:00" temp={liveWeather ? liveWeather.suhu : '29°'} icon={weatherRainSun} active />
            <HourCard time="13:00" temp="30°" icon={weatherCloud} />
            <HourCard time="14:00" temp="31°" icon={weatherSunnyUmbrella} />
            <HourCard time="15:00" temp="28°" icon={weatherRainSun} />
            <HourCard time="16:00" temp="27°" icon={weatherRainSun} />
            <HourCard time="17:00" temp="27°" icon={weatherCloud} />
          </div>
        </div>

        <div className="space-y-6 max-w-4xl">
          <div className="flex bg-[#E9F1F8] p-1.5 rounded-2xl w-full max-w-md shadow-inner">
            <button onClick={() => setActiveTab('7hari')} className={`flex-1 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer ${activeTab === '7hari' ? 'bg-[#2C5282] text-white shadow-lg' : 'text-[#003366]/30'}`}>Ramalan 7 Hari</button>
            <button onClick={() => setActiveTab('wilayah')} className={`flex-1 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'wilayah' ? 'bg-[#2C5282] text-white shadow-lg' : 'text-[#003366]/30'}`}>Ramalan Per Wilayah</button>
          </div>
          
          <div className="space-y-2.5 overflow-y-auto max-h-105 pr-2 no-scrollbar">
            {activeTab === '7hari' ? (
              <>
                <DayRow label="Senin" temp="29° / 32°" icon={weatherCloud} />
                <DayRow label="Selasa" temp="28° / 31°" icon={weatherRainSun} />
                <DayRow label="Rabu" temp="27° / 30°" icon={weatherRainSun} />
                <DayRow label="Kamis" temp="30° / 33°" icon={weatherSunnyUmbrella} />
                <DayRow label="Jumat" temp="29° / 32°" icon={weatherCloud} />
                <DayRow label="Sabtu" temp="31° / 34°" icon={weatherSunnyUmbrella} />
                <DayRow label="Minggu" temp="28° / 31°" icon={weatherRainSun} />
              </>
            ) : (
              <>
                <DayRow label="Banjarmasin" temp="29° / 32°" icon={weatherRainSun} />
                <DayRow label="Banjarbaru" temp="29° / 32°" icon={weatherRainSun} />
                <DayRow label="Kapuas" temp="29° / 32°" icon={weatherRainSun} />
                <DayRow label="Martapura" temp="29° / 32°" icon={weatherRainSun} />
                <DayRow label="Pelaihari" temp="29° / 32°" icon={weatherRainSun} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* KOMPONEN PENDUKUNG MURNI                                  */
/* ========================================================= */
function NavItem({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-5 px-6 py-4 rounded-2xl font-black transition cursor-pointer ${active ? 'bg-[#55ACEE] text-white shadow-xl shadow-blue-200' : 'text-[#003366] opacity-30 hover:opacity-100 hover:bg-white/40'}`}>
      <img src={icon} alt="" className={`w-6 h-6 object-contain ${active ? 'brightness-0 invert' : ''}`} />
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  );
}

function ScheduleCard({ icon, fallbackEmoji, text, highlight, location, time, active }) {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="flex justify-between items-center bg-white p-5 px-8 rounded-[25px] shadow-sm hover:shadow-md transition-shadow border border-slate-100 group">
      <div className="flex items-center gap-6">
        <div className="text-3xl drop-shadow-sm w-10 text-center">
          {icon ? <img src={icon} alt="" className="w-10 h-10 object-contain" onError={(e) => e.target.style.display='none'} /> : fallbackEmoji}
        </div>
        <div>
          <p className="font-bold text-[#2C5282] text-sm">{text} <span className="font-black">{highlight}</span></p>
          <p className="font-bold text-xs opacity-40 uppercase tracking-widest mt-1 text-[#003366]">{location}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="font-black text-[#4A86CC]">{time}</span>
        <div className="h-6 w-0.5 bg-slate-200"></div>
        <div onClick={() => setIsOn(!isOn)} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-[#4A86CC]' : 'bg-gray-300'}`}>
          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ icon, fallbackEmoji, text, time, active }) {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="flex justify-between items-center bg-white p-5 px-8 rounded-[25px] shadow-sm hover:shadow-md transition-shadow border border-slate-100 group">
      <div className="flex items-center gap-6">
        <div className="text-3xl drop-shadow-sm w-10 text-center">
          {icon ? <img src={icon} alt="" className="w-10 h-10 object-contain" onError={(e) => e.target.style.display='none'} /> : fallbackEmoji}
        </div>
        <p className="font-bold text-[#2C5282] text-sm">{text}</p>
      </div>
      <div className="flex items-center gap-6">
        <span className="font-black text-[#4A86CC]">{time}</span>
        <div className="h-6 w-0.5 bg-slate-200"></div>
        <div onClick={() => setIsOn(!isOn)} className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-[#4A86CC]' : 'bg-gray-300'}`}>
          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      </div>
    </div>
  );
}

function FilterModal({ currentLocation, close, save }) {
  const [temp, setTemp] = useState(currentLocation);
  const provinces = ['KALIMANTAN SELATAN', 'KALIMANTAN TENGAH', 'KALIMANTAN BARAT', 'KALIMANTAN TIMUR', 'KALIMANTAN UTARA'];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#003366]/40 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-linear-to-br from-[#D9F2E6] to-[#DDEEFE] rounded-3xl w-full max-w-md p-6 shadow-2xl relative border-2 border-white/50">
        <div className="flex justify-between items-start mb-6 px-1">
          <h2 className="text-[#003366]/60 font-bold text-sm tracking-widest uppercase">Filter</h2>
          <span className="text-4xl drop-shadow-md">🗺️</span>
        </div>
        <div className="space-y-3 mb-8">
          {provinces.map((prov) => (
            <button key={prov} onClick={() => setTemp(prov)} className={`w-full py-4 px-6 text-left font-black tracking-widest text-sm rounded-xl transition-all border-2 cursor-pointer ${temp === prov ? 'bg-[#BEE6FF] border-[#55ACEE] text-[#003366] shadow-md scale-105' : 'bg-[#A4D8FB]/60 border-transparent text-[#003366] hover:bg-[#A4D8FB] opacity-80'}`}>
              {prov}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <button onClick={close} className="flex-1 py-3.5 font-bold text-[#003366]/50 bg-[#003366]/10 rounded-xl uppercase tracking-widest transition hover:bg-[#003366]/20 cursor-pointer">Batal</button>
          <button onClick={() => save(temp)} className="flex-1 py-3.5 font-bold text-white bg-[#4A86CC] rounded-xl uppercase tracking-widest shadow-lg transition hover:bg-[#2C5282] cursor-pointer">Simpan</button>
        </div>
      </div>
    </div>
  );
}

function HourCard({ time, temp, icon, active = false }) {
  return (
    <div className={`flex-1 min-w-24 p-5 rounded-[30px] flex flex-col items-center gap-4 transition-all ${active ? 'bg-white shadow-xl scale-105' : 'opacity-60'}`}>
      <span className="font-black text-[11px]">{time}</span>
      <img src={icon} alt="" className="w-10 h-10 object-contain" />
      <span className="font-black text-lg">{temp}</span>
    </div>
  );
}

function DayRow({ label, temp, icon }) {
  return (
    <div className="flex justify-between items-center bg-white/40 hover:bg-white transition-all p-4 px-8 rounded-2xl border border-white/50 group shadow-sm cursor-pointer">
      <span className="font-black text-xs uppercase tracking-widest text-[#2C5282]">{label}</span>
      <div className="flex items-center gap-8">
        <img src={icon} alt="" className="w-10 h-10 object-contain" />
        <span className="font-black text-sm text-[#2C5282] opacity-60 group-hover:opacity-100">{temp}</span>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SUB-KOMPONEN 3: PETA ASLI INTERAKTIF                      */
/* ========================================================= */
function PetaView() {
  // Koordinat tengah untuk memposisikan seluruh pulau Kalimantan di Map
  const posisiBorneo = [-0.5, 114.5]; 
  
  // Data representatif untuk kota-kota besar di setiap Provinsi Kalimantan
  const dataWilayah = [
    { nama: 'BANJARMASIN (KALSEL)', koordinat: [-3.3167, 114.5901], suhu: '32°C', kondisi: 'Cerah Berawan', waktu: '14:00' },
    { nama: 'PALANGKARAYA (KALTENG)', koordinat: [-2.2084, 113.9181], suhu: '31°C', kondisi: 'Hujan Ringan', waktu: '14:00' },
    { nama: 'SAMARINDA (KALTIM)', koordinat: [-0.5022, 117.1536], suhu: '33°C', kondisi: 'Cerah', waktu: '14:00' },
    { nama: 'PONTIANAK (KALBAR)', koordinat: [-0.0263, 109.3425], suhu: '32°C', kondisi: 'Berawan', waktu: '14:00' },
    { nama: 'TANJUNG SELOR (KALTARA)', koordinat: [2.8375, 117.3653], suhu: '30°C', kondisi: 'Hujan Petir', waktu: '14:00' }
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-wider">PETA SEBARAN</h1>
          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Jumat, 22 Mei 2026, 15:20</p>
        </div>
        <button className="text-slate-700 hover:text-blue-600 transition cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
        </button>
      </div>

      <div className="w-full h-112.5 bg-white rounded-4xl overflow-hidden shadow-md border-4 border-white relative">
        <MapContainer center={posisiBorneo} zoom={6} className="w-full h-full z-10">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {dataWilayah.map((wilayah, index) => (
            <Marker key={index} position={wilayah.coordinates || wilayah.koordinat}>
              <Popup>
                <div className="font-sans p-1 text-slate-800">
                  <h4 className="font-black text-sm text-blue-600">{wilayah.nama}</h4>
                  <p className="text-xs font-bold mt-1">Suhu: <span className="text-orange-500">{wilayah.suhu}</span></p>
                  <p className="text-[10px] text-gray-500">{wilayah.kondisi}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm py-2 px-4 rounded-xl shadow-md z-1000 flex items-center gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5"><span className="w-6 h-1.5 bg-blue-500 rounded-full"></span> Dingin</div>
          <div className="flex items-center gap-1.5"><span className="w-6 h-1.5 bg-yellow-400 rounded-full"></span> Hangat</div>
          <div className="flex items-center gap-1.5"><span className="w-6 h-1.5 bg-red-500 rounded-full"></span> Panas</div>
        </div>
      </div>

      <hr className="border-slate-200/60 my-2" />

      <div className="space-y-3">
        {dataWilayah.map((wilayah, index) => (
          <div key={index} className="flex justify-between items-center bg-white p-4 px-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-2xl">
                {wilayah.kondisi === 'Cerah' ? '☀️' : wilayah.kondisi === 'Hujan Ringan' ? '🌧️' : wilayah.kondisi === 'Hujan Petir' ? '⛈️' : '🌤️'}
              </span>
              <span className="font-extrabold text-sm text-blue-950 tracking-wide">{wilayah.nama}</span>
            </div>
            <div className="font-black text-blue-950 tracking-wide text-sm opacity-90">
              {wilayah.waktu} | <span className="text-blue-600">{wilayah.suhu}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================= */
/* SUB-KOMPONEN 4: KUALITAS UDARA (SLICING FRONT-END MURNI)   */
/* ========================================================= */
function KualitasUdaraView() {
  // State filter Provinsi aktif
  const [provinsiAktif, setProvinsiAktif] = React.useState('Kalsel');

  // Master data kualitas udara per Provinsi
  const dataProvinsi = {
    Kalsel: {
      nama: "Banjarmasin (Kalimantan Selatan)",
      aqi: 55, status: "MODERAT", desc: "Udara cukup sehat, namun tetap awasi aktivitas luar ruangan jika sensitif.",
      polutan: [
        { label: "PM2.5", nilai: "13", unit: "µg/m³", status: "Baik", icon: "🍃" },
        { label: "PM10", nilai: "33", unit: "µg/m³", status: "Baik", icon: "🍃" },
        { label: "NO2", nilai: "45", unit: "µg/m³", status: "Baik", icon: "🛵" },
        { label: "O3", nilai: "64", unit: "µg/m³", status: "Moderat", icon: "🧴" }
      ]
    },
    Kalteng: {
      nama: "Palangkaraya (Kalimantan Tengah)",
      aqi: 32, status: "BAIK", desc: "Kualitas udara sangat baik, tidak berisiko bagi kesehatan manusia atau lingkungan.",
      polutan: [
        { label: "PM2.5", nilai: "7", unit: "µg/m³", status: "Baik", icon: "🍃" },
        { label: "PM10", nilai: "18", unit: "µg/m³", status: "Baik", icon: "🍃" },
        { label: "NO2", nilai: "12", unit: "µg/m³", status: "Baik", icon: "🛵" },
        { label: "O3", nilai: "28", unit: "µg/m³", status: "Baik", icon: "🧴" }
      ]
    },
    Kaltim: {
      nama: "Samarinda (Kalimantan Timur)",
      aqi: 78, status: "MODERAT", desc: "Tingkat kualitas udara yang dapat diterima, namun beberapa polutan mungkin berdampak.",
      polutan: [
        { label: "PM2.5", nilai: "25", unit: "µg/m³", status: "Moderat", icon: "😷" },
        { label: "PM10", nilai: "48", unit: "µg/m³", status: "Baik", icon: "🍃" },
        { label: "NO2", nilai: "52", unit: "µg/m³", status: "Moderat", icon: "🛵" },
        { label: "O3", nilai: "70", unit: "µg/m³", status: "Moderat", icon: "🧴" }
      ]
    },
    Kalbar: {
      nama: "Pontianak (Kalimantan Barat)",
      aqi: 105, status: "TIDAK SEHAT", desc: "Kelompok sensitif dapat mengalami dampak kesehatan. Kurangi aktivitas luar rumah.",
      polutan: [
        { label: "PM2.5", nilai: "37", unit: "µg/m³", status: "Tidak Sehat", icon: "😷" },
        { label: "PM10", nilai: "65", unit: "µg/m³", status: "Moderat", icon: "😷" },
        { label: "NO2", nilai: "58", unit: "µg/m³", status: "Moderat", icon: "🛵" },
        { label: "O3", stroke: "82", nilai: "82", unit: "µg/m³", status: "Moderat", icon: "🧴" }
      ]
    },
    Kaltara: {
      nama: "Tanjung Selor (Kalimantan Utara)",
      aqi: 24, status: "BAIK", desc: "Kualitas udara sangat ideal untuk dinikmati bersama keluarga di luar ruangan.",
      polutan: [
        { label: "PM2.5", nilai: "5", unit: "µg/m³", status: "Baik", icon: "🍃" },
        { label: "PM10", nilai: "14", unit: "µg/m³", status: "Baik", icon: "🍃" },
        { label: "NO2", nilai: "9", unit: "µg/m³", status: "Baik", icon: "🛵" },
        { label: "O3", nilai: "21", unit: "µg/m³", status: "Baik", icon: "🧴" }
      ]
    }
  };

  const infoAktif = dataProvinsi[provinsiAktif];

  return (
    <div className="w-full space-y-8 animate-fade-in text-[#003366]">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wide">
            Kualitas Udara <span className="font-normal text-slate-600">wilayah</span> Pulau Kalimantan
          </h1>
          <p className="text-xs font-bold text-slate-400 mt-1">Pilih provinsi untuk melihat visualisasi data</p>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
          {Object.keys(dataProvinsi).map((prov) => (
            <button
              key={prov}
              onClick={() => setProvinsiAktif(prov)}
              className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wider transition-all cursor-pointer ${
                provinsiAktif === prov
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {prov.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full bg-white rounded-4xl p-8 px-10 shadow-lg border border-white relative overflow-hidden flex flex-col md:flex-row justify-between min-h-105">
        <div className="flex-1 z-20 flex flex-col justify-between space-y-6 md:space-y-0">
          <div>
            <h2 className="text-2xl font-black">{infoAktif.nama}</h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">Jumat, 22/05/2026</p>
            
            <div className={`mt-4 border rounded-3xl p-4 max-w-sm shadow-inner flex gap-4 items-center ${
              infoAktif.status === 'BAIK' ? 'bg-emerald-50 border-emerald-100' :
              infoAktif.status === 'MODERAT' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'
            }`}>
              <span className="text-4xl">
                {infoAktif.status === 'BAIK' ? '🍃' : infoAktif.status === 'MODERAT' ? '😷' : '🚨'}
              </span>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black">{infoAktif.aqi}</span>
                  <span className="text-[10px] font-bold text-slate-400">AQI</span>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wide uppercase ${
                  infoAktif.status === 'BAIK' ? 'bg-emerald-100 text-emerald-700' :
                  infoAktif.status === 'MODERAT' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {infoAktif.status}
                </span>
                <p className="text-[9px] font-bold text-slate-500 mt-1 leading-tight">{infoAktif.desc}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xl w-full">
            {infoAktif.polutan.map((p, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-3xl p-4 flex flex-col justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <span className="text-xs font-black block text-slate-500">{p.label}</span>
                    <p className="flex items-baseline gap-0.5 leading-none">
                      <span className="text-lg font-black">{p.nilai}</span>
                      <span className="text-[9px] font-bold text-slate-400">{p.unit}</span>
                    </p>
                  </div>
                </div>
                <span className={`text-[9px] font-extrabold mt-3 py-1 rounded-xl text-center tracking-wider uppercase block ${
                  p.status === 'Baik' ? 'bg-emerald-50 text-emerald-600' :
                  p.status === 'Moderat' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[45%] flex justify-end items-center relative min-h-50 md:min-h-0">
          <div className="absolute inset-0 bg-[#E3EDF3] rounded-3xl opacity-40 flex items-center justify-center border border-slate-200">
            <span className="text-slate-300 font-black text-xs uppercase tracking-widest">Borneo Map Base</span>
          </div>
          <div className="relative z-20 flex flex-col items-center gap-2 transform -translate-x-5 md:-translate-x-15 animate-float">
            <span className="text-7xl drop-shadow-md">
              {infoAktif.status === 'BAIK' ? '☀️' : infoAktif.status === 'MODERAT' ? '⛅' : '🌫️'}
            </span>
            <div className="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black shadow-sm text-slate-500">
              {infoAktif.status === 'BAIK' ? 'Cerah Maksimal' : infoAktif.status === 'MODERAT' ? 'Berawan Tipis' : 'Polusi Terdeteksi'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SUB-KOMPONEN 5: PENGATURAN (AUTO-RENDER & POPUP MANDIRI) */
/* ========================================================= */
function SettingView() {
  const [notifHarian, setNotifHarian] = useState(true);
  const [pengingatJadwal, setPengingatJadwal] = useState(true);
  const [smartSuggestion, setSmartSuggestion] = useState(true);
  const [cuacaEkstrem, setCuacaEkstrem] = useState(true);
  const [activeFrame, setActiveFrame] = useState(null);

  // Trik otomatis: Saat komponen ini dimuat, kita paksa kontainer utama menampilkan section ini
  React.useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, []);

  return (
    <div id="setting-panel-view" className="w-full space-y-6 text-[#003366] relative animate-fade-in">
      {/* Header Utama Pengaturan */}
      <div className="flex justify-between items-center max-w-3xl">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-[#002B56]">Pengaturan</h1>
          <p className="text-xs font-bold text-[#8EA9C7] mt-0.5">Kelola akun dan sesuaikan dengan keinginan</p>
        </div>
        {/* Ikon Filter / Jam Sesuai Desain */}
        <button className="text-slate-400 text-xl hover:text-blue-600 transition cursor-pointer">
          ⏳
        </button>
      </div>

      <div className="w-full max-w-3xl space-y-5">
        
        {/* 1. SECTION PROFILE PENGGUNA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-sm tracking-wide text-[#002B56] flex items-center gap-2 mb-4">
            👤 Profile Pengguna
          </h3>
          <div className="flex justify-between items-center bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 shadow-inner">
                <img src={avatarBahlil} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">Bahlil Septian</h4>
                <p className="text-[11px] text-[#8EA9C7] font-semibold">Bahlil.orang.baik@gmail.com</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveFrame('frame13')}
              className="bg-[#5BC0BE] hover:bg-[#45a3a1] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
            >
              🖊️ Edit Profile
            </button>
          </div>
        </div>

        {/* 2. SECTION NOTIFIKASI & PENGINGAT */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-black text-sm tracking-wide text-[#002B56] flex items-center gap-2 border-b border-slate-100 pb-2">
            🔔 Notifikasi & Pengingat
          </h3>
          
          {[
            { label: 'Notifikasi Cuaca Harian', state: notifHarian, setState: setNotifHarian, icon: '🔔' },
            { label: 'Pengingat Jadwal (kalender)', state: pengingatJadwal, setState: setPengingatJadwal, icon: '📅' },
            { label: 'Smart Daily Suggestion', state: smartSuggestion, setState: setSmartSuggestion, icon: '💡' },
            { label: 'Peringatan Cuaca Ekstrem', state: cuacaEkstrem, setState: setCuacaEkstrem, icon: '⛈️' }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 px-3 bg-slate-50/40 rounded-xl border border-slate-100/70">
              <div className="flex items-center gap-3 text-xs font-extrabold text-slate-700">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <button 
                onClick={() => item.setState(!item.state)} 
                className={`w-12 h-6 flex items-center rounded-full p-1 border transition-colors cursor-pointer ${item.state ? 'bg-blue-600 border-blue-600' : 'bg-slate-300 border-slate-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* 3. SECTION KEAMANAN AKUN */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-sm tracking-wide text-[#002B56] mb-3">🔑 Keamanan Akun</h3>
          <button 
            onClick={() => setActiveFrame('frame14')} 
            className="w-full flex justify-between items-center p-4 bg-slate-50/50 border border-slate-100 hover:bg-slate-100 rounded-2xl text-xs font-extrabold text-slate-700 transition cursor-pointer"
          >
            <span className="flex items-center gap-2">🔑 Ubah Password</span>
            <span className="text-slate-400 font-black">&gt;</span>
          </button>
        </div>

        {/* 4. SECTION HAPUS AKUN */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-sm tracking-wide text-[#002B56] mb-3">❌ Hapus Akun</h3>
          <button 
            onClick={() => setActiveFrame('frame15')} 
            className="w-full p-4 bg-rose-50 text-xs font-extrabold text-red-600 text-left border border-rose-100 hover:bg-rose-100 rounded-2xl transition cursor-pointer flex items-center gap-2"
          >
            🗑️ Hapus Akun
          </button>
        </div>

      </div>

      {/* MODAL ARTIFAK LAYER (FRAME 13, 14, 15) */}
      {activeFrame && (
        <div className="fixed inset-0 bg-[#808080]/80 z-9999 flex items-center justify-center p-4">
          <div className="relative bg-[#808080] p-12 border-2 border-dashed border-slate-400 rounded-lg shadow-2xl">
            
            {/* FRAME 13 */}
            {activeFrame === 'frame13' && (
              <div className="w-96 bg-white rounded-md p-6 shadow-xl text-[#003366]">
                <h3 className="font-extrabold text-sm text-slate-500 mb-4 border-b pb-2">Profiles</h3>
                <div className="flex gap-4 items-center mb-6">
                  <div className="w-16 h-16 rounded-full border border-dashed border-slate-300 flex flex-col items-center justify-center text-[8px] p-2 text-center font-bold text-slate-400 bg-slate-50 cursor-pointer">
                    🔄 <br/>Tambahkan Gambar
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 block mb-0.5">Nama</label>
                      <input type="text" className="w-full bg-[#E6E6E6] rounded p-2 text-xs font-bold text-slate-800 outline-none" defaultValue="Bahlil Septian" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 block mb-0.5">Email</label>
                      <input type="email" className="w-full bg-[#E6E6E6] rounded p-2 text-xs font-bold text-slate-800 outline-none" defaultValue="Bahlil.orang.baik@gmail.com" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => setActiveFrame(null)} className="bg-[#E6E6E6] text-slate-600 font-bold text-xs px-4 py-2 rounded cursor-pointer">BATAL</button>
                  <button onClick={() => setActiveFrame(null)} className="bg-[#C4F07B] text-slate-800 font-black text-xs px-4 py-2 rounded cursor-pointer">SIMPAN</button>
                </div>
              </div>
            )}

            {/* FRAME 14 */}
            {activeFrame === 'frame14' && (
              <div className="w-96 bg-white rounded-md p-6 shadow-xl text-[#003366]">
                <h3 className="font-extrabold text-sm text-slate-500 mb-4 border-b pb-2">Keamanan Akun</h3>
                <div className="space-y-3 mb-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-0.5">Password Baru</label>
                    <input type="password" className="w-full bg-[#E6E6E6] rounded p-2 text-xs outline-none" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 block mb-0.5">Konfirmasi Password Baru</label>
                    <input type="password" className="w-full bg-[#E6E6E6] rounded p-2 text-xs outline-none" placeholder="••••••••" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => setActiveFrame(null)} className="bg-[#E6E6E6] text-slate-600 font-bold text-xs px-4 py-2 rounded cursor-pointer">BATAL</button>
                  <button onClick={() => setActiveFrame(null)} className="bg-[#C4F07B] text-slate-800 font-black text-xs px-4 py-2 rounded cursor-pointer">SIMPAN</button>
                </div>
              </div>
            )}

            {/* FRAME 15 */}
            {activeFrame === 'frame15' && (
              <div className="w-96 bg-white rounded-md p-6 shadow-xl text-[#003366]">
                <h3 className="font-extrabold text-sm text-slate-500 mb-3 border-b pb-2">Hapus Akun</h3>
                <p className="text-xs font-bold text-slate-700 leading-relaxed mb-6">
                  Apakah kamu yakin ingin menghapus akunmu secara permanen?
                </p>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button onClick={() => setActiveFrame(null)} className="bg-[#E6E6E6] text-slate-600 font-bold text-xs px-4 py-2 rounded cursor-pointer">BATAL</button>
                  <button onClick={() => setActiveFrame(null)} className="bg-[#C82333] text-white font-black text-xs px-5 py-2 rounded cursor-pointer">IYA</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}