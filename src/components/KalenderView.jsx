import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Import ikon
import iconUmbrella from '../assets/icon-umbrella.svg';
import iconCold from '../assets/icon-cold.svg';
import iconMask from '../assets/icon-mask.svg';
import iconNoodles from '../assets/icon-noodles.svg';
import iconNetflix from '../assets/icon-netflix.svg';

export default function KalenderView({ selectedDate, setSelectedDate }) {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#003366]">Kalender</h1>
          <p className="text-xs font-bold opacity-40 uppercase mt-1 text-[#003366]">Kamis, 21 Mei 2026, 12:37</p>
        </div>
        <button className="text-2xl opacity-40 hover:opacity-100 transition cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        </button>
      </div>

      {/* Kalender */}
      <div className="flex justify-center items-center py-6">
        <div className="text-slate-800 custom-cirrus-calendar w-full max-w-3xl drop-shadow-2xl animate-float">
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      </div>

      {/* Schedule Section */}
      <div>
        <h2 className="text-lg font-black text-[#003366] mb-4 uppercase tracking-widest">My Schedule</h2>
        <div className="space-y-4">
          <ScheduleCard icon={iconUmbrella} fallbackEmoji="☂️" text="Hujan di sore hari, " highlight="bawa payung" location="Nordu Cafe" time="16:00" active={true} />
          <ScheduleCard icon={iconUmbrella} fallbackEmoji="☂️" text="Hujan di malam hari, " highlight="bawa payung" location="Mall" time="20:00" active={true} />
          <ScheduleCard icon={iconCold} fallbackEmoji="🥶" text="Cuaca mencapai 10°, " highlight="pakai jaket" location="Olahraga di SKB" time="04:00" active={false} />
          <ScheduleCard icon={iconMask} fallbackEmoji="😷" text="Polusi tebal, " highlight="bawa masker" location="Nordu Cafe" time="12:00" active={false} />
        </div>
      </div>

      {/* Saran Section */}
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

// Komponen Pendukung
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