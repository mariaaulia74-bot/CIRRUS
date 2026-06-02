import { useState } from 'react';
import weatherMain from '../assets/weather-main.svg';
import weatherRainSun from '../assets/weather-rain-sun.svg';
import weatherCloud from '../assets/weather-cloud.svg';
import weatherSunnyUmbrella from '../assets/weather-sunny-umbrella.svg';

export default function BerandaView({ currentLocation, openFilter, liveWeather, aiSuggestion, isLoading, tafsirkanKodeCuaca }) {
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
        
        <div className="relative bg-linear-to-r from-[#A4D8FB]/90 to-[#DDEEFE]/60 backdrop-blur-2xl rounded-[40px] border border-white p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center overflow-hidden min-h-80 w-full mb-6">
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#4A86CC] opacity-80"></div>
          
          <div className="flex items-center gap-10 shrink-0 w-full md:w-auto mr-4">
            <img src={weatherMain} alt="" className="w-64 md:w-80 h-auto animate-float drop-shadow-2xl" />
            <div className="h-36 w-0.5 bg-[#003366]/10 mx-4"></div>
            
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

function HourCard({ time, temp, icon, active = false }) {
  return (
    <div className={`flex-1 min-w-20 p-5 rounded-[30px] flex flex-col items-center gap-4 transition-all ${active ? 'bg-[#55ACEE] text-white shadow-xl scale-105' : 'bg-white/50'}`}>
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