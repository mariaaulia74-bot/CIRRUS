import React from 'react';
import { 
  HomeIcon, 
  CalendarIcon, 
  MapIcon, 
  CloudIcon, 
  CogIcon, 
  LogOutIcon 
} from 'lucide-react'; // Sesuaikan dengan library icon yang kalian pakai (Heroicons / Lucide)

export default function Sidebar({ activeMenu, setActiveMenu, user, onLogout }) {
  
  const menuItems = [
    { id: 'beranda', name: 'BERANDA', icon: HomeIcon },
    { id: 'kalender', name: 'KALENDER', icon: CalendarIcon },
    { id: 'peta', name: 'PETA', icon: MapIcon },
    { id: 'kualitas udara', name: 'KUALITAS UDARA', icon: CloudIcon },
  ];

  return (
    <div className="w-full md:w-72 h-full flex flex-col bg-[#E9F1F8] p-6 text-[#003366] font-sans justify-between">
      
      {/* Bagian Atas: Profil / Nama */}
      <div className="text-center my-4 flex-shrink-0">
        <h2 className="text-2xl font-black tracking-wider text-[#003366] uppercase">
          {user?.user_metadata?.name || 'MARIA'}
        </h2>
        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">WELCOME!</p>
      </div>

      {/* 📌 PERBAIKAN UTAMA (Berdasarkan image_4a0e5b.png): Area Menu Utama */}
      {/* Menghilangkan h-xxx atau overflow-y-auto pengganggu agar tidak muncul scrollbar internal */}
      <nav className="flex-1 flex flex-col space-y-3 mt-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex items-center space-x-4 w-full p-4 rounded-2xl font-black tracking-wider transition-all duration-300 text-left ${
                isActive 
                  ? 'bg-[#54A5F4] text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-[#003366]'
              }`}
            >
              <IconComponent className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm uppercase">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Bagian Bawah: Garis Pembatas, Setting, dan Log Out */}
      <div className="mt-auto pt-6 border-t border-gray-200 flex-shrink-0 space-y-2">
        
        {/* Tombol Setting */}
        <button
          onClick={() => setActiveMenu('setting')}
          className={`flex items-center space-x-4 w-full p-4 rounded-2xl font-black tracking-wider transition-all ${
            activeMenu === 'setting' 
              ? 'bg-[#54A5F4] text-white' 
              : 'text-gray-400 hover:bg-gray-100 hover:text-[#003366]'
          }`}
        >
          <CogIcon className="w-6 h-6 flex-shrink-0" />
          <span className="text-sm">Setting</span>
        </button>

        {/* Tombol Log Out Asli (Tombol Darurat Luar Sudah Hilang) */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-4 w-full p-4 rounded-2xl font-black tracking-wider text-red-500 hover:bg-red-50 transition-all text-left"
        >
          <LogOutIcon className="w-6 h-6 flex-shrink-0" />
          <span className="text-sm">Log Out</span>
        </button>

      </div>

    </div>
  );
}