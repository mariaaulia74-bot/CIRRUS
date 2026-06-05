import { useState, useEffect } from 'react';
import weatherMain from '../assets/weather-main.svg';
import weatherRainSun from '../assets/weather-rain-sun.svg';
import weatherCloud from '../assets/weather-cloud.svg';
import weatherSunnyUmbrella from '../assets/weather-sunny-umbrella.svg';

export default function BerandaView({ currentLocation, openFilter, liveWeather, aiSuggestion, isLoading, tafsirkanKodeCuaca }) {
  const [activeTab, setActiveTab] = useState('7hari');
  const [waktuSekarang, setWaktuSekarang] = useState(new Date());

  // Sinkronisasi waktu sistem lokal secara real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setWaktuSekarang(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const dapatkanAngkaMurni = () => {
    console.log("Data liveWeather yang masuk ke BerandaView:", liveWeather);
    if (!liveWeather || !liveWeather.suhu) return 28;
    const suhuBersih = String(liveWeather.suhu).replace(/[^0-9-]/g, '');
    const hasilParse = parseInt(suhuBersih);
    return isNaN(hasilParse) ? 28 : hasilParse;
  };

  const suhuSekarangAngka = dapatkanAngkaMurni();

  // Pemetaan Ikon Aset SVG berdasarkan kondisi kode cuaca BMKG
  const dapatkanIkonCuaca = (kode) => {
    const k = parseInt(kode);
    if ([0, 1, 2].includes(k)) return weatherSunnyUmbrella;
    if ([3, 4, 100, 101, 102].includes(k)) return weatherCloud;
    if ([60, 61, 63, 80].includes(k)) return weatherRainSun;
    return weatherMain;
  };

  // 1. GENERATOR PRAKIRAAN PER JAM DINAMIS (SINKRON DENGAN LIVE WEATHER)
  const dapatkanPrakiraanPerJam = () => {
    const listJam = [];
    const jamSekarang = waktuSekarang.getHours();
    const kodeCuacaSekarang = liveWeather ? liveWeather.kodeCuaca : 60;

    for (let i = 0; i < 6; i++) {
      const targetJam = (jamSekarang + i) % 24;
      const formatJamStr = `${String(targetJam).padStart(2, '0')}:00`;
      
      let penyesuaianSuhu = 0;
      let targetKodeCuaca = kodeCuacaSekarang;

      // Logika fluktuasi cuaca alami berdasarkan jam dinding
      if (targetJam >= 11 && targetJam <= 14) {
        penyesuaianSuhu = 2; // Jam puncak panas siang
        targetKodeCuaca = 1; // Cenderung cerah berawan
      } else if (targetJam >= 15 && targetJam <= 18) {
        penyesuaianSuhu = -1; // Sore hari
        targetKodeCuaca = 60; // Potensi gerimis / hujan ringan
      } else if (targetJam >= 19 || targetJam <= 5) {
        penyesuaianSuhu = -3; // Malam / subuh dingin
        targetKodeCuaca = 3; // Berawan
      }

      listJam.push({
        waktu: formatJamStr,
        suhu: `${suhuSekarangAngka + penyesuaianSuhu}°`,
        ikon: dapatkanIkonCuaca(targetKodeCuaca),
        isActive: i === 0
      });
    }
    return listJam;
  };

  // 2. GENERATOR RAMALAN 7 HARI (URUTAN HARI & SUHU SINKRON KALENDER)
  const dapatkanRamalan7Hari = () => {
    const namaHariIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const listHari = [];
    const hariIndexSekarang = waktuSekarang.getDay();

    for (let i = 0; i < 7; i++) {
      const indexTarget = (hariIndexSekarang + i) % 7;
      let labelHari = namaHariIndo[indexTarget];
      
      if (i === 0) labelHari = "Hari Ini";

      // UBAH DI SINI: Gunakan indeks i (hari ke-i) sebagai pola perubahan suhu, bukan Math.random()
      // Hari esok dan seterusnya akan dibuat semakin bervariasi secara konsisten
      const minTemp = suhuSekarangAngka - 2 - (i % 2); 
      const maxTemp = suhuSekarangAngka + 2 + (i % 3); 
      
      const kodePrediksi = [1, 60, 3, 0, 61, 4, 80][(hariIndexSekarang + i) % 7];

      listHari.push({
        label: labelHari,
        temp: `${minTemp}° / ${maxTemp}°`,
        icon: dapatkanIkonCuaca(kodePrediksi)
      });
    }
    return listHari;
  };

  // 3. DAFTAR WILAYAH SEKITAR KALIMANTAN SELATAN (SINKRON SUHU DENGAN WILAYAH UTAMA)
  const dapatkanRamalanWilayah = () => {
    // Array wilayah lokal sekitar dengan pengkondisian offset suhu dari stasiun utama
    const dataWilayah = [
      { nama: "Banjarmasin", offsetMin: -1, offsetMax: 3, kode: 60 },
      { nama: "Banjarbaru", offsetMin: -2, offsetMax: 2, kode: 3 },
      { nama: "Kapuas", offsetMin: -1, offsetMax: 2, kode: 60 },
      { nama: "Martapura", offsetMin: -2, offsetMax: 3, kode: 3 },
      { nama: "Pelaihari", offsetMin: -3, offsetMax: 1, kode: 1 }
    ];

    return dataWilayah.map(w => ({
      label: w.nama,
      temp: `${suhuSekarangAngka + w.offsetMin}° / ${suhuSekarangAngka + w.offsetMax}°`,
      icon: dapatkanIkonCuaca(w.kode)
    }));
  };

  const formatTanggal = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatJam = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace('.', ':');
  };

  return (
    <div className="space-y-12 pb-20 w-full max-w-full overflow-hidden">
      <section className="w-full">
        {/* Header: Wilayah & Lokasi */}
        <div className="flex justify-between items-end mb-6 px-2 w-full">
          <div onClick={openFilter} className="cursor-pointer group">
            <h1 className="text-3xl font-black uppercase tracking-widest text-[#4A86CC] group-hover:text-[#2C5282] transition-colors">
              {currentLocation} <span className="text-lg opacity-50">▼</span>
            </h1>
            <p className="text-xs font-bold opacity-30 uppercase mt-1">
              {formatTanggal(waktuSekarang)}, {formatJam(waktuSekarang)} WITA (Klik untuk ganti wilayah)
            </p>
          </div>
          <button onClick={openFilter} className="flex items-center gap-2 bg-white/60 hover:bg-white backdrop-blur-md border border-white px-5 py-2.5 rounded-xl font-black text-sm text-[#4A86CC] uppercase tracking-widest shadow-sm cursor-pointer shrink-0">
            <span>🗺️</span> Filter
          </button>
        </div>  
        
        {/* Utama: Kartu Cuaca Utama */}
        <div className="relative bg-linear-to-r from-[#A4D8FB]/90 to-[#DDEEFE]/60 backdrop-blur-2xl rounded-[40px] border border-white p-8 md:p-12 pr-16 shadow-2xl flex flex-col lg:flex-row justify-between items-center overflow-hidden min-h-80 w-full mb-6">
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-[#4A86CC] opacity-80 rounded-r-[40px]"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full">
            <div className="flex justify-center items-center shrink-0 w-full md:w-auto">
              <img src={liveWeather ? dapatkanIkonCuaca(liveWeather.kodeCuaca) : weatherMain} alt="" className="w-56 md:w-72 h-auto animate-float drop-shadow-2xl" />
            </div>
            
            <div className="hidden md:block h-36 w-0.5 bg-[#003366]/10 mx-2"></div>
            
            <div className="flex-1 text-center md:text-left min-w-0">
              <h2 className="text-lg md:text-xl font-black opacity-60 uppercase tracking-widest mb-2 leading-none">
                {isLoading ? 'Menghubungkan ke Stasiun Cuaca...' : 'Keadaan Cuaca Sekarang'}
              </h2>
              
              <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-2 md:gap-6">
                <span className="text-[80px] md:text-[110px] font-black leading-none tracking-tighter block select-none">
                  {liveWeather ? liveWeather.suhu : '...'}
                </span>
                
                <div className="mt-2 md:mt-4">
                  <span className="text-2xl font-bold opacity-70 block leading-none text-[#2C5282] mb-2">
                    {liveWeather ? tafsirkanKodeCuaca(liveWeather.kodeCuaca) : 'Loading...'}
                  </span>
                  {liveWeather && (
                    <span className="text-xs font-medium opacity-50 block leading-relaxed max-w-full">
                      💨 Angin: {liveWeather.kecepatanAngin} <span className="mx-1 opacity-30">|</span> 💧 Lembap: {liveWeather.kelembapan}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini AI Smart Assistant */}
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

      {/* Bagian Bawah: Prakiraan Cuaca */}
      <div className="flex flex-col gap-14 pb-20 w-full">
        
        {/* Prakiraan Per Jam Dinamis */}
        <div className="space-y-6 w-full">
          <h3 className="font-black uppercase tracking-widest opacity-40 text-sm px-2">Prakiraan Per Jam</h3>
          <div className="bg-[#DDEEFE]/60 rounded-[35px] p-2 flex justify-between overflow-x-auto no-scrollbar gap-4 w-full">
            {dapatkanPrakiraanPerJam().map((item, index) => (
              <HourCard 
                key={index}
                time={item.waktu} 
                temp={item.suhu} 
                icon={item.ikon} 
                active={item.isActive} 
              />
            ))}
          </div>
        </div>

        {/* Tab Ramalan Hari / Wilayah Dinamis */}
        <div className="space-y-6 w-full max-w-4xl">
          <div className="flex bg-[#E9F1F8] p-1.5 rounded-2xl w-full max-w-md shadow-inner">
            <button onClick={() => setActiveTab('7hari')} className={`flex-1 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer ${activeTab === '7hari' ? 'bg-[#2C5282] text-white shadow-lg' : 'text-[#003366]/30'}`}>Ramalan 7 Hari</button>
            <button onClick={() => setActiveTab('wilayah')} className={`flex-1 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'wilayah' ? 'bg-[#2C5282] text-white shadow-lg' : 'text-[#003366]/30'}`}>Ramalan Per Wilayah</button>
          </div>
          
          <div className="space-y-2.5 overflow-y-auto max-h-105 pr-2 no-scrollbar w-full">
            {activeTab === '7hari' ? (
              dapatkanRamalan7Hari().map((day, index) => (
                <DayRow key={index} label={day.label} temp={day.temp} icon={day.icon} />
              ))
            ) : (
              dapatkanRamalanWilayah().map((wilayah, index) => (
                <DayRow key={index} label={wilayah.label} temp={wilayah.temp} icon={wilayah.icon} />
              ))
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
    <div className="flex justify-between items-center bg-white/40 hover:bg-white transition-all p-4 px-8 rounded-2xl border border-white/50 group shadow-sm cursor-pointer w-full">
      <span className="font-black text-xs uppercase tracking-widest text-[#2C5282]">{label}</span>
      <div className="flex items-center gap-8">
        <img src={icon} alt="" className="w-10 h-10 object-contain" />
        <span className="font-black text-sm text-[#2C5282] opacity-60 group-hover:opacity-100">{temp}</span>
      </div>
    </div>
  );
}