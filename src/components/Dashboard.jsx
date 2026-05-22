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
    // 1. Cegah eksekusi jika data cuaca belum ada
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
  
  // 2. KUNCI DI SINI: Gunakan string nama kota, bukan object!
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
          <NavItem icon={iconWind} label="Kualitas Udara" active={activeMenu === 'kualitas'} onClick={() => setActiveMenu('kualitas')} />
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
          
          {/* --- BAGIAN PETA YANG SUDAH DISELIPKAN DENGAN AMAN --- */}
          {activeMenu === 'peta' && (
             <PetaView />
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

/* --- 3. KOMPONEN HALAMAN PETA ASLI INTERAKTIF --- */
function PetaView() {
  // Koordinat tengah untuk area Kalimantan Selatan agar pas di layar
  const posisiKalsel = [-3.3, 114.8]; 

  // Data tiruan kota untuk penanda di peta & list kartu di bawahnya
  const dataWilayah = [
    { nama: 'BANJARMASIN', koordinat: [-3.316694, 114.590111], suhu: '32°C', kondisi: 'Cerah Berawan', waktu: '14:00' },
    { nama: 'BANJARBARU', koordinat: [-3.442344, 114.830116], suhu: '32°C', kondisi: 'Cerah Berawan', waktu: '14:00' },
    { nama: 'MARTAPURA', koordinat: [-3.416667, 114.850000], suhu: '35°C', kondisi: 'Cerah Berawan', waktu: '14:00' }
  ];

  return (
    <div className="w-full space-y-6">
      {/* HEADER MENU PETA */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-wider">PETA</h1>
          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Minggu, 11 April 2026, 21:30</p>
        </div>
        <button className="text-slate-700 hover:text-blue-600 transition cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
        </button>
      </div>

      {/* BOX PETA ASLI (LEAFLET MAP CONTAINER) */}
      <div className="w-full h-[450px] bg-white rounded-[32px] overflow-hidden shadow-md border-4 border-white relative">
        <MapContainer center={posisiKalsel} zoom={9} className="w-full h-full z-10">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {/* Loop untuk menyebar PIN marker di atas peta */}
          {dataWilayah.map((wilayah, index) => (
            <Marker key={index} position={wilayah.koordinat}>
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

        {/* LEGEND INDIKATOR WARNA SUHU */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm py-2 px-4 rounded-xl shadow-md z-[1000] flex items-center gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5"><span className="w-6 h-1.5 bg-blue-500 rounded-full"></span> Dingin</div>
          <div className="flex items-center gap-1.5"><span className="w-6 h-1.5 bg-yellow-400 rounded-full"></span> Hangat</div>
          <div className="flex items-center gap-1.5"><span className="w-6 h-1.5 bg-red-500 rounded-full"></span> Panas</div>
        </div>
      </div>

      <hr className="border-slate-200/60 my-2" />

      {/* DAFTAR LIST KARTU KOTA DI BAWAH PETA */}
      <div className="space-y-3">
        {dataWilayah.map((wilayah, index) => (
          <div key={index} className="flex justify-between items-center bg-white p-4 px-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🌤️</span>
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