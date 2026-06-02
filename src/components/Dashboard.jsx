import React, { useState } from 'react'; // <--- PASTIKAN ADA { useState }
import BerandaView from './BerandaView';
import KalenderView from './KalenderView';
import PetaView from './PetaView';
import KualitasUdaraView from './KualitasUdaraView';
import SettingView from './SettingView';
import Sidebar from './Sidebar';
import Placeholder from './Placeholder';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('beranda');

  return (
    <div className="flex h-screen bg-[#F0F5FA]">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 overflow-y-auto p-10 bg-[#F0F5FA] h-screen">
        <div className="max-w-7xl mx-auto"> 
          {activeMenu === 'beranda' && <BerandaView />}
          {activeMenu === 'kalender' && <KalenderView />}
          {activeMenu === 'peta' && <PetaView />}
          {activeMenu === 'kualitas udara' && <KualitasUdaraView />}
          {activeMenu === 'setting' && <SettingView />}
        </div>
      </main>
    </div> // <--- Tambahkan penutup div ini
  );
}