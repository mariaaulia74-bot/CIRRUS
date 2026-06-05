import React, { useState, useEffect } from 'react';
import BerandaView from './BerandaView';
import KalenderView from './KalenderView';
import PetaView from './PetaView';
import KualitasUdaraView from './KualitasUdaraView';
import SettingView from './SettingView';
import Sidebar from './Sidebar';

// Import services Anda
import { fetchWeatherByCity } from '../services/weatherService';
import { getAIOpinion } from '../services/aiService';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('beranda');
  const [currentLocation, setCurrentLocation] = useState('Banjarmasin');
  
  // State manajemen data
  const [liveWeather, setLiveWeather] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('Sedang merumuskan saran cuaca pintar...');
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi translasi WMO Code dari Open-Meteo
  const tafsirkanKodeCuaca = (code) => {
    if (code === 0) return 'Cerah';
    if ([1, 2, 3].includes(code)) return 'Cerah Berawan';
    if ([45, 48].includes(code)) return 'Berkabut';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Gerimis';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Hujan';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Salju';
    if ([95, 96, 99].includes(code)) return 'Hujan Badai Petir';
    return 'Kondisi Tidak Diketahui';
  };

  useEffect(() => {
    const muatDataDashboard = async () => {
      let dataCuacaSukses = null;

      // KANDANG 1: Khusus mengambil data cuaca asli 
      try {
        setIsLoading(true);
        const dataCuacaAsli = await fetchWeatherByCity(currentLocation);
        setLiveWeather(dataCuacaAsli);
        dataCuacaSukses = dataCuacaAsli; // Simpan salinan data untuk dikirim ke Gemini nanti
      } catch (error) {
        console.error("Gagal mengambil data dari stasiun cuaca:", error);
      } finally {
        // Apapun yang terjadi pada jaringan, matikan status loading agar UI tidak macet
        setIsLoading(false);
      }

      // KANDANG 2: Khusus memproses Gemini AI (Berjalan setelah cuaca tampil/gagal)
      if (dataCuacaSukses) {
        try {
          const parameterUntukGemini = {
            kota: currentLocation,
            suhu: dataCuacaSukses.suhu,
            kelembapan: dataCuacaSukses.kelembapan,
            kecepatanAngin: dataCuacaSukses.kecepatanAngin
          };
          
          const hasilRekomendasiAI = await getAIOpinion(parameterUntukGemini);
          setAiSuggestion(hasilRekomendasiAI);
        } catch (error) {
          console.error("Gagal memuat rekomendasi otomatis Gemini:", error);
          setAiSuggestion("Gagal menyinkronkan asisten pintar saat ini.");
        }
      } else {
        setAiSuggestion("Tidak dapat memberikan saran karena data cuaca terputus.");
      }
    };

    muatDataDashboard();
  }, [currentLocation]);

  const openFilter = () => {
    alert("Fitur pemilihan wilayah/filter sedang dibuka!");
  };

  return (
    <div className="flex h-screen bg-[#F0F5FA]">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 overflow-y-auto p-10 bg-[#F0F5FA] h-screen">
        <div className="max-w-7xl mx-auto"> 
          
          {activeMenu === 'beranda' && (
            <BerandaView 
              currentLocation={currentLocation}
              openFilter={openFilter}
              liveWeather={liveWeather}
              aiSuggestion={aiSuggestion}
              isLoading={isLoading}
              tafsirkanKodeCuaca={tafsirkanKodeCuaca}
            />
          )}
          
          {activeMenu === 'kalender' && <KalenderView />}
          {activeMenu === 'peta' && <PetaView />}
          {activeMenu === 'kualitas udara' && <KualitasUdaraView />}
          {activeMenu === 'setting' && <SettingView />}
        </div>
      </main>
    </div>
  );
}