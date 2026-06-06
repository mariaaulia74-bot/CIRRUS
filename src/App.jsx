import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BerandaView from './components/BerandaView';
import KalenderView from './components/KalenderView';
import PetaView from './components/PetaView';
import KualitasUdaraView from './components/KualitasUdaraView';
import SettingView from './components/SettingView';

// IMPORT KOMPONEN TERBARU UNTUK LANDING PAGE & AUTH
import LandingPage from './components/landing/LandingPage';
import AuthView from './components/AuthView';

// IMPORT CLIENT SUPABASE UNTUK AUTENTIKASI DINAMIS
import { supabase } from './supabaseClient';

// GUNAKAN IMPOR STATIS BIASA AGAR VITE TIDAK CRASH / FREEZE
import { fetchWeatherByCity } from './services/weatherService';
import { getAIOpinion } from './services/aiService';

export default function App() {
  // MANAJEMEN ROUTING VIEW UTAMA ('landing', 'login', 'signup', 'dashboard')
  const [currentView, setCurrentView] = useState('landing');
  
  // State internal dashboard
  const [activeMenu, setActiveMenu] = useState('beranda');
  const [currentLocation, setCurrentLocation] = useState('Banjarmasin');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // STATE WAKTU SISTEM UTAMA (WITA)
  const [waktuSistem, setWaktuSistem] = useState(new Date());

  // State manajemen data utama
  const [liveWeather, setLiveWeather] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('Sedang menyelaraskan asisten cuaca...');
  const [isLoading, setIsLoading] = useState(true);

  // 👤 STATE UTAMA: Menyimpan data user yang sedang login secara dinamis
  const [sessionUser, setSessionUser] = useState(null);
  
  // Efek interval untuk memperbarui waktu sistem agar jam berdetak real-time setiap menit
  useEffect(() => {
    const timer = setInterval(() => {
      setWaktuSistem(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // 🔄 EFEK UTAMA: Memantau kondisi login/logout murni menggunakan Supabase Auth
  useEffect(() => {
    // 1. Periksa sesi yang ada saat aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionUser(session.user);
        setCurrentView('dashboard');
      } else {
        setSessionUser(null);
        setCurrentView('landing');
      }
    });

    // 2. Pasang pendengar (listener) perubahan status autentikasi dari Supabase
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

  // Fungsi penerjemah kode cuaca Open-Meteo
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
      const dataFallback = {
        suhu: '29°',
        kodeCuaca: 61, 
        ke速度Angin: '5.5 km/h',
        kelembapan: '85%'
      };

      try {
        setIsLoading(true);
        if (typeof fetchWeatherByCity === 'function') {
          const dataAsli = await fetchWeatherByCity(currentLocation);
          setLiveWeather(dataAsli);
          
          if (typeof getAIOpinion === 'function') {
            const parameterAI = {
              kota: currentLocation,
              suhu: dataAsli.suhu,
              kelembapan: dataAsli.kelembapan,
              keindexAngin: dataAsli.kecepatanAngin
            };
            
            const hasilAI = await getAIOpinion(parameterAI);
            if (hasilAI) {
              setAiSuggestion(hasilAI);
            } else {
              buatSaranLokalCadangan(dataAsli);
            }
          } else {
            buatSaranLokalCadangan(dataAsli);
          }
        } else {
          setLiveWeather(dataFallback);
          setAiSuggestion("Menampilkan data moda aman (offline).");
        }
      } catch (error) {
        console.error("Sistem menangkap gangguan data:", error);
        setLiveWeather(dataFallback);
        setAiSuggestion("Gagal memuat saran cuaca dinamis.");
      } finally {
        setIsLoading(false);
      }
    };

    const buatSaranLokalCadangan = (data) => {
      const angkaSuhu = parseInt(data.suhu);
      const kondisi = tafsirkanKodeCuaca(data.kodeCuaca);

      if (kondisi.includes('Hujan') || kondisi.includes('Gerimis')) {
        setAiSuggestion(`Saat ini wilayah ${currentLocation} terdeteksi ${kondisi} dengan suhu ${data.suhu}. Bagi amang dan acil yang mau beraktivitas di luar, jangan lupa sedia payung atau jas hujan ya! 🌧️`);
      } else if (angkaSuhu >= 33) {
        setAiSuggestion(`Cuaca di ${currentLocation} terasa cukup menyengat nih mencapai ${data.suhu}. Kurangi aktivitas luar ruangan yang terlalu berat dan pastikan hidrasi tubuh terjaga dengan baik! ☀️`);
      } else {
        setAiSuggestion(`Langit ${currentLocation} terpantau ${kondisi} dengan suhu ${data.suhu}. Kondisi yang cukup bersahabat dan nyaman untuk menyelesaikan agenda Anda hari ini.`);
      }
    };

    muatDataDinamis();
  }, [currentLocation, currentView]);

  const openFilter = () => {
    alert("Filter wilayah diklik!");
  };
  
  if (currentView === 'landing') {
    return <LandingPage onNavigate={setCurrentView} user={sessionUser} />; 
  }

  if (currentView === 'login' || currentView === 'signup') {
    return (
      <AuthView 
        initialMode={currentView} 
        onAuthSuccess={() => setCurrentView('dashboard')} 
        onBackToLanding={() => setCurrentView('landing')} 
        waktuSistem={waktuSistem}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#F0F5FA] font-sans text-[#003366] overflow-hidden relative">
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
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F0F5FA]">
        <div className="flex-1 overflow-y-auto p-10 no-scrollbar bg-[#F0F5FA]">
          
          {activeMenu === 'beranda' && (
            <BerandaView 
              currentLocation={currentLocation}
              openFilter={openFilter}
              liveWeather={liveWeather}
              aiSuggestion={aiSuggestion}
              isLoading={isLoading}
              tafsirkanKodeCuaca={tafsirkanKodeCuaca}
              waktuSistem={waktuSistem} 
            />
          )}

          {activeMenu === 'kalender' && (
            <KalenderView 
              selectedDate={selectedDate} 
              setSelectedDate={setSelectedDate} 
              waktuSistem={waktuSistem} 
            />
          )}

          {activeMenu === 'peta' && (
            <PetaView 
              waktuSistem={waktuSistem} 
            />
          )}
          
          {activeMenu === 'kualitas udara' && <KualitasUdaraView />}
          
          {activeMenu === 'setting' && (
            <SettingView 
              user={sessionUser}
              onProfileUpdate={(updatedUser) => setSessionUser(updatedUser)}
            />
          )}
          
        </div>
      </main>
    </div>
  );
}