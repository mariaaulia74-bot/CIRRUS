import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BerandaView from './components/BerandaView';
import KalenderView from './components/KalenderView';
import PetaView from './components/PetaView';
import KualitasUdaraView from './components/KualitasUdaraView';
import SettingView from './components/SettingView';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('beranda');
  
  // State yang dibutuhkan oleh komponen
  const [currentLocation, setCurrentLocation] = useState('Banjarmasin');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [liveWeather, setLiveWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Contoh fungsi pendukung
  const openFilter = () => console.log('Filter dibuka');
  const tafsirkanKodeCuaca = (kode) => "Cerah Berawan"; 

  return (
    <div className="flex h-screen bg-[#F0F5FA] font-sans text-[#003366] overflow-hidden relative">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-linear-to-b from-[#7ab7f0] to-white">
        <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
          
          {/* Mengirimkan props secara eksplisit, bukan ...props[cite: 1] */}
          {activeMenu === 'beranda' && (
            <BerandaView 
              currentLocation={currentLocation}
              openFilter={openFilter}
              liveWeather={liveWeather}
              aiSuggestion="Jangan lupa bawa payung hari ini, Diva!"
              isLoading={isLoading}
              tafsirkanKodeCuaca={tafsirkanKodeCuaca}
            />
          )}

          {activeMenu === 'kalender' && (
            <KalenderView 
              selectedDate={selectedDate} 
              setSelectedDate={setSelectedDate} 
            />
          )}

          {activeMenu === 'peta' && <PetaView />}
          {activeMenu === 'kualitas udara' && <KualitasUdaraView />}
          {activeMenu === 'setting' && <SettingView />}
          
        </div>
      </main>
    </div>
  );
}