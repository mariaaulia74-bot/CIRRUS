import React from 'react';
// 👍 IMPORT FILE LOGO KAMU DARI FOLDER ASSETS
import logoAplikasi from '../../assets/logo.png'; 

// Tambahkan parameter 'user' di dalam objek props
export default function Navbar({ onNavigate, user }) {
  
  // Fungsi mengambil huruf pertama dari nama user (Contoh: "Budi" -> "B")
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#DDEEFE]">
      
      {/* 🖼️ LOGO KIRI ATAS BARU */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
        <img 
          src={logoAplikasi} 
          alt="Cirrus Logo" 
          className="w-9 h-9 object-contain rounded-lg" 
        />
        <span className="font-black text-xl tracking-wider text-[#2C5282]">CIRRUS</span>
      </div>

      {/* MENU NAVIGASI KANAN */}
      <div className="hidden md:flex items-center gap-8 font-bold text-sm text-[#003366]/60">
        <a href="#home" className="hover:text-[#2C5282] transition-colors">Home</a>
        <a href="#about" className="hover:text-[#2C5282] transition-colors">About Us</a>
        <a href="#features" className="hover:text-[#2C5282] transition-colors">Features</a>
        <a href="#contact" className="hover:text-[#2C5282] transition-colors">Contact</a>
      </div>

      {/* TOMBOL AUTENTIKASI ATAU PROFIL USER */}
      <div className="flex items-center gap-4">
        {user ? (
          /* 👤 JIKA ADA USER YANG LOGIN (BERHASIL MASUK) */
          <div className="flex items-center gap-3">
            {/* Tampilkan nama user di sebelah kiri avatar (hanya muncul di layar sm ke atas) */}
            <span className="hidden sm:inline font-bold text-sm text-[#003366]">{user.name}</span>
            
            {user.avatarUrl ? (
              /* Akun yang punya foto profil akan merender gambar asli */
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2C5282] shadow-sm"
              />
            ) : (
              /* 👍 AKUN LAIN YANG GA ADA FOTONYA: Otomatis dibuatin avatar inisial nama bulat estetik */
              <div className="w-10 h-10 rounded-full bg-[#2C5282] text-white flex items-center justify-center font-black text-base shadow-md select-none">
                {getInitial(user.name)}
              </div>
            )}
          </div>
        ) : (
          /* 🔑 JIKA TIDAK ADA USER (TAMPILKAN TOMBOL DEFAULT) */
          <>
            <button 
              onClick={() => onNavigate('login')} 
              className="px-5 py-2 text-sm font-bold text-[#2C5282] hover:text-[#1A365D] transition-colors cursor-pointer"
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('signup')} 
              className="px-5 py-2.5 bg-[#2C5282] hover:bg-[#1A365D] text-white text-sm font-black rounded-xl tracking-wide shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}