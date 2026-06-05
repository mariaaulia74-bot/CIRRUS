import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Features from './Features';
import Footer from './Footer';

// 👍 TANGKAP PROPS 'user' DI SINI
export default function LandingPage({ onNavigate, user }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F8FD] to-[#E9F1F8] text-[#003366] overflow-x-hidden selection:bg-[#A4D8FB]">
      
      {/* 👍 OPER DATA 'user' KEDALAM NAVBAMU AGAR DIOLAH MENJADI AVATAR/INISIAL */}
      <Navbar onNavigate={onNavigate} user={user} />
      
      <HeroSection onNavigate={onNavigate} />
      <Features />
      <Footer />
    </div>
  );
}