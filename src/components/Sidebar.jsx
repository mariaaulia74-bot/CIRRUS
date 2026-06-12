import React from 'react';
import { 
  HomeIcon, 
  CalendarIcon, 
  MapIcon, 
  CloudIcon, 
  CogIcon, 
  LogOutIcon,
  UserIcon 
} from 'lucide-react'; 

export default function Sidebar({ activeMenu, setActiveMenu, user, onLogout }) {
  
  const menuItems = [
    { id: 'beranda', name: 'BERANDA', icon: HomeIcon },
    { id: 'kalender', name: 'KALENDER', icon: CalendarIcon },
    { id: 'peta', name: 'PETA', icon: MapIcon },
    { id: 'kualitas udara', name: 'KUALITAS UDARA', icon: CloudIcon },
  ];

  return (
    <div className="w-full md:w-72 md:h-screen flex flex-col bg-[#E9F1F8] p-4 text-[#003366] font-sans justify-between overflow-hidden flex-shrink-0 box-border">
      
      {/* Bagian Atas: Avatar & Nama */}
      <div className="text-center my-1 flex-shrink-0 flex flex-col items-center">
        {/* Lingkaran Bulat Foto Profil */}
        <div className="w-16 h-16 rounded-full bg-white shadow-md border-2 border-white overflow-hidden flex items-center justify-center mb-2">
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* 📌 FIX: Membaca semua kemungkinan key nama dari Supabase secara fleksibel */}
        <h2 className="text-xl font-black tracking-wider text-[#003366] uppercase">
          {user?.user_metadata?.name || 
           user?.user_metadata?.full_name || 
           user?.user_metadata?.nama_lengkap || 
           user?.email?.split('@')[0] || 
           'USER'}
        </h2>
        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">WELCOME!</p>
      </div>

      {/* Navigasi Menu */}
      <nav className="flex-1 flex flex-col space-y-1 mt-2 overflow-hidden">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenu === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex items-center space-x-3 w-full p-3 rounded-xl font-black tracking-wider transition-all duration-300 text-left flex-shrink-0 ${
                isActive 
                  ? 'bg-[#54A5F4] text-white shadow-md shadow-blue-200' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-[#003366]'
              }`}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs uppercase whitespace-nowrap">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Bagian Bawah: Setting dan Log Out */}
      <div className="mt-auto pt-2 border-t border-gray-200 flex-shrink-0 space-y-1">
        
        <button
          onClick={() => setActiveMenu('setting')}
          className={`flex items-center space-x-3 w-full p-3 rounded-xl font-black tracking-wider transition-all ${
            activeMenu === 'setting' 
              ? 'bg-[#54A5F4] text-white' 
              : 'text-gray-400 hover:bg-gray-100 hover:text-[#003366]'
          }`}
        >
          <CogIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs">Setting</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-xl font-black tracking-wider text-red-500 hover:bg-red-50 transition-all text-left"
        >
          <LogOutIcon className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs">Log Out</span>
        </button>

      </div>

    </div>
  );
}