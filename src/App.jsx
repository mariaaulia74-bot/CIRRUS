import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BerandaView from './components/BerandaView';
import KalenderView from './components/KalenderView';
import PetaView from './components/PetaView';
import KualitasUdaraView from './components/KualitasUdaraView';
import SettingView from './components/SettingView';
import LandingPage from './components/landing/LandingPage';
import AuthView from './components/AuthView';
import { supabase } from './supabaseClient';
import { fetchWeatherByCity } from './services/weatherService';
import { getAIOpinion } from './services/aiService';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [activeMenu, setActiveMenu] = useState('beranda');
  const [currentLocation, setCurrentLocation] = useState('Banjarmasin');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [waktuSistem, setWaktuSistem] = useState(new Date());
  const [liveWeather, setLiveWeather] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('Sedang menyelaraskan asisten cuaca...');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState(null);
  
  useEffect(() => {
    const timer = setInterval(() => { setWaktuSistem(new Date()); }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 🔄 EFEK UTAMA: Memantau kondisi login/logout MURNI dari Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionUser(session.user);
        setCurrentView('dashboard');
      } else {
        setSessionUser(null);
        setCurrentView('landing');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSessionUser(session.user);
        setCurrentView('dashboard');
      } else {
        setSessionUser(null);
        setCurrentView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const tafsirkanKodeCuaca = (code) => {
    const c = parseInt(code);
    if (c === 0) return 'Cerah';
    if ([1, 2, 3].includes(c)) return 'Cerah Berawan';
    if ([45, 48].includes(c)) return 'Berkabut';
    if ([51, 53, 55, 56, 57].includes(c)) return 'Gerimis';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(c)) return 'Hujan';
    if ([71, 73, 75, 77, 85, 86].includes(c)) return 'Salju';
    if ([95, 96, 99].includes(c)) return 'Hujan Badai Petir';
    return 'Cerah Berawan';
  };

  useEffect(() => {
    if (currentView !== 'dashboard') return;
    const muatDataDinamis = async () => {
      const dataFallback = { suhu: '29°', kodeCuaca: 61, kecepatanAngin: '5.5 km/h', kelembapan: '85%' };
      try {
        setIsLoading(true);
        if (typeof fetchWeatherByCity === 'function') {
          const dataAsli = await fetchWeatherByCity(currentLocation);
          setLiveWeather(dataAsli);
          if (typeof getAIOpinion === 'function') {
            const hasilAI = await getAIOpinion({ kota: currentLocation, suhu: dataAsli.suhu, kelembapan: dataAsli.kelembapan, keindexAngin: dataAsli.kecepatanAngin });
            if (hasilAI) setAiSuggestion(hasilAI);
            else setLiveWeather(dataFallback);
          }
        }
      } catch (error) {
        setLiveWeather(dataFallback);
      } finally { setIsLoading(false); }
    };
    muatDataDinamis();
  }, [currentLocation, currentView]);

  if (currentView === 'landing') return <LandingPage onNavigate={setCurrentView} user={sessionUser} />;
  if (currentView === 'login' || currentView === 'signup') {
    return <AuthView initialMode={currentView} onAuthSuccess={() => setCurrentView('dashboard')} onBackToLanding={() => setCurrentView('landing')} waktuSistem={waktuSistem} />;
  }

  // 👍 KUNCI PERBAIKAN: Menggunakan pembungkus <> dan </> agar tidak bentrok
  return (
    <>
      <button 
        onClick={async () => {
          await supabase.auth.signOut();
          localStorage.clear();
          sessionStorage.clear();
          alert("Sesi berhasil dibersihkan! Menuju Landing Page...");
          window.location.reload();
        }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#E74C3C',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: 'none',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        ⚠️ KLIK INI UNTUK LOGOUT PAKSA
      </button>

      <div className="flex flex-col md:flex-row min-h-screen bg-[#F0F5FA] font-sans text-[#003366] relative">
        <Sidebar 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          user={sessionUser}
          onLogout={async () => {
            await supabase.auth.signOut();
            setSessionUser(null);
            setCurrentView('landing');
          }} 
        />
        <main className="flex-1 min-w-0 p-6 md:p-10 bg-[#F0F5FA]">
          <div className="max-w-7xl mx-auto">
            {activeMenu === 'beranda' && <BerandaView currentLocation={currentLocation} openFilter={() => alert("Filter!")} liveWeather={liveWeather} aiSuggestion={aiSuggestion} isLoading={isLoading} tafsirkanKodeCuaca={tafsirkanKodeCuaca} waktuSistem={waktuSistem} />}
            {activeMenu === 'kalender' && <KalenderView selectedDate={selectedDate} setSelectedDate={setSelectedDate} waktuSistem={waktuSistem} />}
            {activeMenu === 'peta' && <PetaView waktuSistem={waktuSistem} />}
            {activeMenu === 'kualitas udara' && <KualitasUdaraView />}
            {activeMenu === 'setting' && <SettingView user={sessionUser} onProfileUpdate={(updatedUser) => setSessionUser(updatedUser)} />}
          </div>
        </main>
      </div>
    </>
  );
}