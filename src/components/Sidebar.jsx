import React from 'react';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-white/10 backdrop-blur-3xl border-r border-white/20 flex flex-col py-8 px-4 z-50">
      
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
          <span className="text-[#55ACEE] font-black text-xl">C</span>
        </div>
        <span className="font-black text-xl tracking-tighter text-white hidden md:block">
          CIRRUS
        </span>
      </div>

      <nav className="flex-1 space-y-3">
        <SidebarItem icon="🏠" label="Beranda" active />
        <SidebarItem icon="📅" label="Kalender" />
        <SidebarItem icon="📍" label="Peta" />
        <SidebarItem icon="🌬️" label="Kualitas Udara" />
      </nav>

      <div className="pt-8 border-t border-white/10 space-y-3">
        <SidebarItem icon="⚙️" label="Setting" />
        <SidebarItem icon="🚪" label="Log Out" isLogout />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active = false, isLogout = false }) {
  return (
    <div className={`
      flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group
      ${active ? 'bg-white/20 shadow-lg border border-white/20' : 'hover:bg-white/10'}
      ${isLogout ? 'text-red-200 hover:text-red-400 mt-4' : 'text-white'}
    `}>
      <span className={`text-xl transition-transform group-hover:scale-110 ${active ? 'scale-110' : 'opacity-80'}`}>
        {icon}
      </span>

      <span className={`
        font-bold text-sm tracking-wide hidden md:block
        ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}
      `}>
        {label}
      </span>

      {active && (
        <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full hidden md:block" />
      )}
    </div>
  );
}