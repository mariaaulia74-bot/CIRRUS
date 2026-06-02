import React from 'react';

export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans text-[#003366]">
      {/* Header */}
      <nav className="flex justify-between items-center px-20 py-8">
        <div className="text-2xl font-black">CIRRUS</div>
        <div className="flex gap-8 font-bold text-sm">
          {['Home', 'About Us', 'Features', 'Contact'].map(item => (
            <a href="#" key={item} className="hover:text-[#55ACEE]">{item}</a>
          ))}
          <button className="text-[#003366]">Login</button>
          <button className="bg-[#003366] text-white px-6 py-2 rounded-full">Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex items-center justify-between px-20 py-16">
        <div className="max-w-xl">
          <h1 className="text-6xl font-black mb-6 leading-tight">Smart Weather for Your Daily Life.</h1>
          <p className="mb-10 text-lg opacity-70">Dapatkan informasi cuaca akurat, pengingat pintar, dan rekomendasi harian untuk harimu.</p>
          <div className="flex gap-4">
            <button onClick={onEnter} className="bg-[#003366] text-white px-8 py-4 rounded-xl font-bold">Get Started</button>
            <button className="border-2 border-[#003366] px-8 py-4 rounded-xl font-bold">Learn More</button>
          </div>
        </div>
        <div className="w-[100px] h-[75x] bg-blue-200 rounded-3xl flex items-center justify-center">
          [Ilustrasi 3D]
        </div>
      </header>

      {/* Features Grid */}
      <section className="px-20 py-16 grid grid-cols-4 gap-6">
        {[
          { title: "Real-Time Weather", desc: "info cuaca terkini" },
          { title: "Smart Reminder", desc: "Pengingat pintar" },
          { title: "Weather Map", desc: "Peta Cuaca" },
          { title: "Daily Suggestions", desc: "Saran Aktivitas Harian" }
        ].map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-black mb-1">{f.title}</h3>
            <p className="text-xs opacity-60">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* App Preview */}
      <section className="px-20 py-20 flex flex-col items-center text-center">
        <h2 className="text-4xl font-black mb-12">Lihat Sekilas Aplikasi Kami</h2>
        <div className="flex gap-8">
           <div className="w-64 h-[100px] bg-blue-400 rounded-[40px]"></div>
           <div className="w-64 h-[100px] bg-blue-300 rounded-[40px] -mt-10"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#DDEEFE] px-20 py-10 mt-10">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-black">CIRRUS</div>
          <div>
            <p className="font-bold">Contact Us</p>
            <p className="text-sm">Email: Cirrus@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}