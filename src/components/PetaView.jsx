import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function PetaView() {
  const posisiBorneo = [-0.5, 114.5]; 
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
      </div>

      <div className="w-full h-96 bg-white rounded-4xl overflow-hidden shadow-md border-4 border-white relative">
        <MapContainer center={posisiBorneo} zoom={6} className="w-full h-full z-10">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {dataWilayah.map((wilayah, index) => {
            const warna = wilayah.kondisi.includes('Hujan') ? '#EF4444' : 
                          wilayah.kondisi === 'Cerah' ? '#FBBF24' : 
                          '#3B82F6';

            return (
              <CircleMarker 
                key={index} 
                center={wilayah.koordinat} 
                radius={8} 
                fillColor={warna} 
                color="#ffffff" 
                weight={2} 
                fillOpacity={0.8}
              >
                <Popup>
                  <div className="font-sans p-1 text-slate-800">
                    <h4 className="font-black text-sm text-blue-600">{wilayah.nama}</h4>
                    <p className="text-xs font-bold mt-1">Suhu: <span className="text-orange-500">{wilayah.suhu}</span></p>
                    <p className="text-[10px] text-gray-500">{wilayah.kondisi}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
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