import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Sesuaikan jalur impor jika berbeda
import { User, Mail, Shield, Save } from 'lucide-react';

export default function SettingView({ user, onProfileUpdate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Memuat data user saat awal halaman dibuka
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // 📌 FUNGSI UTAMA: Menyimpan perubahan nama ke Supabase dan memperbarui Sidebar
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      // 1. Kirim pembaruan data ke database Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        data: { name: name }
      });

      if (error) throw error;

      if (data && data.user) {
        setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
        
        // 📌 KUNCI UTAMA: Memicu App.jsx agar memperbarui state nama di Sidebar secara real-time!
        if (typeof onProfileUpdate === 'function') {
          onProfileUpdate(data.user);
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Gagal memperbarui profil.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 text-[#003366] max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 mb-6">
        <Shield className="w-6 h-6 text-[#54A5F4]" />
        <h2 className="text-xl font-black tracking-wider uppercase">Pengaturan Akun</h2>
      </div>

      {/* Notifikasi Status */}
      {message.text && (
        <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-5">
        {/* Input Nama Lengkap */}
        <div className="space-y-2">
          <label className="text-xs font-black tracking-widest text-gray-400 uppercase block">
            Nama Profil
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F0F5FA] pl-12 pr-4 py-3.5 rounded-2xl font-bold border border-transparent focus:border-[#54A5F4] focus:bg-white outline-none transition-all text-sm"
              placeholder="Masukkan nama profil baru..."
              required
            />
          </div>
        </div>

        {/* Input Email (Disabled karena email biasanya dikunci/memerlukan verifikasi ulang) */}
        <div className="space-y-2">
          <label className="text-xs font-black tracking-widest text-gray-400 uppercase block">
            Alamat Email
          </label>
          <div className="relative opacity-60">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-[#E9F1F8] pl-12 pr-4 py-3.5 rounded-2xl font-bold outline-none text-sm cursor-not-allowed"
            />
          </div>
          <p className="text-[11px] font-medium text-gray-400">
            * Email tidak dapat diubah langsung demi alasan keamanan akun.
          </p>
        </div>

        {/* Tombol Simpan Perubahan */}
        <button
          type="submit"
          disabled={isUpdating}
          className={`flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-3.5 rounded-2xl font-black tracking-wider text-white bg-[#54A5F4] hover:bg-blue-600 active:scale-95 transition-all shadow-md shadow-blue-100 text-sm ${
            isUpdating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{isUpdating ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}</span>
        </button>
      </form>
    </div>
  );
}