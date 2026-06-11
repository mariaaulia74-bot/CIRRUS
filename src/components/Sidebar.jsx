import React from 'react';
import { 
  HomeIcon, 
  CalendarIcon, 
  MapIcon, 
  CloudIcon, 
  CogIcon, 
  LogOutIcon,
  UserIcon // Icon cadangan jika foto profil gagal memuat
} from 'lucide-react';

export default function Sidebar({ activeMenu, setActiveMenu, user, onLogout }) {
  
  const menuItems = [
    { id: 'beranda', name: 'BERANDA', icon: HomeIcon },
    { id: 'kalender', name: 'KALENDER', icon: CalendarIcon },
    { id: 'peta', name: 'PETA', icon: MapIcon },
    { id: 'kualitas udara', name: 'KUALITAS UDARA', icon: CloudIcon },
  ];

  return (
    // Mengunci tinggi sidebar pas satu layar penuh, overflow-hidden membuang scrollbar nakal
    <div className="w-full md:w-72 md:h-screen flex flex-col bg-[#E9F1F8] p-6 text-[#003366] font-sans justify-between overflow-hidden flex-shrink-0">
      
      {/* 📌 KEMBALIKAN FOTO PROFIL DI SINI */}
      <div className="text-center my-2 flex-shrink-0 flex flex-col items-center">
        {/* Lingkaran Bulat Foto Profil */}
        <div className="w-20 h-20 rounded-full bg-white shadow-md border-2 border-white overflow-hidden flex items-center justify-center mb-3">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            // Jika user belum upload foto, pakai icon user default yang keren ini
            <UserIcon className="w-10 h-10 text-gray-400" />
          )}
        </div>

        {/* Nama User */}
        <h2 className="text-2xl font-black tracking-wider text-[#003366] uppercase">
          {user?.user_metadata?.name || 'MARIA'}
        </h2>
        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">WELCOME!</p>
      </div>

      {/* Bagian Menu Utama: Menggunakan flex-1 tanpa scrollbar */}
      <nav className="flex-1 flex flex-col space-y-2 mt-4 overflow-hidden">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex items-center space-x-4 w-full p-4 rounded-2xl font-black tracking-wider transition-all duration-300 text-left flex-shrink-0 ${
                isActive 
                  ? 'bg-[#54A5F4] text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-[#003366]'
              }`}
            >
              <IconComponent className="w-6 h-6 flex-shrink-0" />
              <span className="text-sm uppercase whitespace-nowrap">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Bagian Bawah: Garis Pembatas, Setting, dan Log Out */}
      <div className="mt-auto pt-4 border-t border-gray-200 flex-shrink-0 space-y-2">
        
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

        {/* Tombol Log Out Asli */}
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