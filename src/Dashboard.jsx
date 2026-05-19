import React, { useState } from 'react';

/* --- 1. IMPORT ASET MENU & CUACA UTAMA --- */
import iconHome from './assets/home.svg';
import iconCalendar from './assets/calendar.svg';
import iconMap from './assets/map.svg';
import iconWind from './assets/wind.svg';
import iconSetting from './assets/setting.svg';
import iconLogout from './assets/logout.svg';
import weatherMain from './assets/weather-main.svg'; 
import weatherRainSun from './assets/weather-rain-sun.svg';
import weatherCloud from './assets/weather-cloud.svg';
import weatherSunnyUmbrella from './assets/weather-sunny-umbrella.svg';
import avatarBahlil from './assets/avatar-bahlil.svg';

/* --- 2. IMPORT ASET KALENDER & JADWAL --- */
import kalenderUtuh from './assets/kalender-utuh.svg'; 
import iconUmbrella from './assets/icon-umbrella.svg';
import iconCold from './assets/icon-cold.svg';
import iconMask from './assets/icon-mask.svg';
import iconNoodles from './assets/icon-noodles.svg';
import iconNetflix from './assets/icon-netflix.svg';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('kalender'); 
  const [currentLocation, setCurrentLocation] = useState('KALIMANTAN SELATAN'); 
  const [isFilterOpen, setIsFilterOpen] = useState(false); 

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
             <BerandaView currentLocation={currentLocation} openFilter={() => setIsFilterOpen(true)} />
          )}
          {activeMenu === 'kalender' && (
             <KalenderView />
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
function KalenderView() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* Header Kalender */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#003366]">Kalender</h1>
          <p className="text-xs font-bold opacity-40 uppercase mt-1 text-[#003366]">Minggu, 11 April 2026, 21:30</p>
        </div>
        <button className="text-2xl opacity-40 hover:opacity-100 transition cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        </button>
      </div>

      {/* WIDGET KALENDER UTUH */}
      <div className="flex justify-center items-center py-6">
        {kalenderUtuh ? (
          <img 
            src={kalenderUtuh} 
            alt="Kalender Bulan Ini" 
            className="w-full max-w-3xl h-auto drop-shadow-2xl animate-float" 
          />
        ) : (
          <div className="bg-slate-200 w-full max-w-3xl h-100 rounded-[40px] flex items-center justify-center text-slate-400 font-bold">
            (Gambar Kalender Utuh Belum Dimasukkan)
          </div>
        )}
      </div>

      {/* MY SCHEDULE */}
      <div>
        <h2 className="text-lg font-black text-[#003366] mb-4 uppercase tracking-widest">My Schedule</h2>
        <div className="space-y-4">
          <ScheduleCard icon={iconUmbrella} fallbackEmoji="☂️" text="Hujan di sore hari, " highlight="bawa payung" location="Nordu Cafe" time="16:00" active={true} />
          <ScheduleCard icon={iconUmbrella} fallbackEmoji="☂️" text="Hujan di malam hari, " highlight="bawa payung" location="Mall" time="20:00" active={true} />
          <ScheduleCard icon={iconCold} fallbackEmoji="🥶" text="Cuaca mencapai 10°, " highlight="pakai jaket" location="Olahraga di SKB" time="04:00" active={false} />
          <ScheduleCard icon={iconMask} fallbackEmoji="😷" text="Polusi tebal, " highlight="bawa masker" location="Nordu Cafe" time="12:00" active={false} />
        </div>
      </div>

      {/* SARAN HARIAN */}
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
function BerandaView({ currentLocation, openFilter }) {
  const [activeTab, setActiveTab] = useState('7hari');

  return (
    <div className="space-y-12 pb-20">
      <section>
        <div className="flex justify-between items-end mb-6 px-2">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-[#4A86CC]">{currentLocation}</h1>
            <p className="text-xs font-bold opacity-30 uppercase mt-1">Minggu, 11 April 2026, 21:30</p>
          </div>
          <button onClick={openFilter} className="flex items-center gap-2 bg-white/60 hover:bg-white backdrop-blur-md border border-white px-5 py-2.5 rounded-xl font-black text-sm text-[#4A86CC] uppercase tracking-widest shadow-sm cursor-pointer">
            <span>⚙️</span> Filter
          </button>
        </div>
        <div className="relative bg-linear-to-r from-[#A4D8FB]/90 to-[#DDEEFE]/60 backdrop-blur-2xl rounded-[40px] border border-white p-12 shadow-2xl flex justify-between items-center overflow-hidden min-h-80">
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#4A86CC] opacity-80"></div>
          <div className="flex items-center gap-10 shrink-0">
            <img src={weatherMain} alt="" className="w-64 md:w-80 h-auto animate-float drop-shadow-2xl" />
            <div className="h-36 w-0.5 bg-[#003366]/10 mx-4"></div>
            <div>
              <h2 className="text-xl font-black opacity-60 uppercase tracking-widest mb-1 leading-none">Keadaan Cuaca Sekarang</h2>
              <div className="flex items-start">
                <span className="text-[120px] font-black leading-none tracking-tighter">29°</span>
                <div className="mt-8 ml-4"><span className="text-2xl font-bold opacity-70 block leading-none">Hujan Ringan</span></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 self-end mb-2">
            <div className="bg-[#55ACEE] text-white px-6 py-3 rounded-full text-[11px] font-bold shadow-lg">👋 Hari ini cocok buat nyantai di rumah</div>
            <div className="bg-[#55ACEE]/80 text-white px-6 py-3 rounded-full text-[11px] font-bold shadow-lg">📋 Hari ini pukul 4 sore check up mata</div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-14 pb-20">
        <div className="space-y-6">
          <h3 className="font-black uppercase tracking-widest opacity-40 text-sm px-2">Prakiraan Per Jam</h3>
          <div className="bg-[#DDEEFE]/60 rounded-[35px] p-2 flex justify-between overflow-x-auto no-scrollbar gap-4">
            <HourCard time="18:00" temp="29°" icon={weatherRainSun} active />
            <HourCard time="19:00" temp="25°" icon={weatherRainSun} />
            <HourCard time="20:00" temp="20°" icon={weatherRainSun} />
            <HourCard time="21:00" temp="20°" icon={weatherRainSun} />
            <HourCard time="22:00" temp="21°" icon={weatherRainSun} />
            <HourCard time="23:00" temp="35°" icon={weatherSunnyUmbrella} />
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
/* KOMPONEN PENDUKUNG                                        */
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