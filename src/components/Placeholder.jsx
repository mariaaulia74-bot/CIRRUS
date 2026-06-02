import React from 'react';

export default function Placeholder({ children }) {
  return (
    // Style ini akan membuat semua halaman punya efek kaca (glassmorphism) yang sama
    <div className="w-full h-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-[40px] p-8 shadow-2xl overflow-y-auto">
      {children}
    </div>
  );
}