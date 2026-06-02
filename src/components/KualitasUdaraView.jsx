import React, { useState } from 'react';

export default function KualitasUdaraView() {
  const [provinsiAktif, setProvinsiAktif] = useState('Kalsel');

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
        { label: "O3", nilai: "82", unit: "µg/m³", status: "Moderat", icon: "🧴" }
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
                provinsiAktif === prov ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {prov.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

     <div className="w-full bg-white rounded-3xl p-8 px-10 shadow-lg border border-white relative overflow-hidden flex flex-col md:flex-row justify-between min-h-100 transition-all duration-500">
        <div className="flex-1 z-20 flex flex-col justify-between space-y-6 md:space-y-0">
          <div>
            <h2 className="text-2xl font-black">{infoAktif.nama}</h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">Jumat, 22/05/2026</p>
            
            <div className={`mt-4 border rounded-3xl p-4 max-w-sm shadow-inner flex gap-4 items-center ${
              infoAktif.status === 'BAIK' ? 'bg-emerald-50 border-emerald-100' :
              infoAktif.status === 'MODERAT' ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'
            }`}>
              <span className="text-4xl">{infoAktif.status === 'BAIK' ? '🍃' : infoAktif.status === 'MODERAT' ? '😷' : '🚨'}</span>
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
      </div>
    </div>
  );
}