import React, { useState, useEffect } from 'react'; 
import { supabase } from '../supabaseClient'; 

export default function SettingView({ user, onProfileUpdate }) {
  const [notifHarian, setNotifHarian] = useState(true);
  const [pengingatJadwal, setPengingatJadwal] = useState(true);
  const [smartSuggestion, setSmartSuggestion] = useState(true);
  const [cuacaEkstrem, setCuacaEkstrem] = useState(true);
  const [activeFrame, setActiveFrame] = useState(null);

  // Ambil data nama tersimpan di LocalStorage jika ada (supaya tidak reset saat pindah menu)
  const emailUser = user?.email || localStorage.getItem('last_logged_in_email') || 'dummy.email@gmail.com';
  const savedBypassName = localStorage.getItem(`bypass_name_${emailUser}`);

  const namaAwal = user?.user_metadata?.display_name || 
                   savedBypassName || 
                   user?.email?.split('@')[0] || 
                   (localStorage.getItem('last_logged_in_email') ? emailUser.split('@')[0].toUpperCase() : 'Pengguna CIRRUS');

  const [inputNama, setInputNama] = useState(namaAwal);
  const [isUpdating, setIsUpdating] = useState(false);

  // PASTIKAN INPUT NAMA SELALU MENGIKUTI USER YANG SEDANG AKTIF
  useEffect(() => {
    setInputNama(namaAwal);
  }, [user, namaAwal]);

  // FUNGSI UTAMA UNTUK UPDATE (YANG SUDAH DIPERBAIKI UNTUK BYPASS)
  const handleUpdateProfile = async () => {
    if (!inputNama.trim()) {
      alert("Nama tidak boleh kosong!");
      return;
    }

    setIsUpdating(true);
    try {
      // 1. Cek Sesi: Apakah user login lewat Supabase asli atau Bypass?
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // JIKA LOGIN ASLI: Tembak ke metadata Supabase Auth
        const { data, error } = await supabase.auth.updateUser({
          data: { display_name: inputNama }
        });

        if (error) throw error;

        if (data?.user && typeof onProfileUpdate === 'function') {
          onProfileUpdate(data.user);
        }
      } else {
        // 💡 JIKA LOGIN BYPASS: Lakukan simulasi lokal agar lolos dari error "Auth session missing"
        localStorage.setItem(`bypass_name_${emailUser}`, inputNama);

        const mockUpdatedUser = {
          ...user,
          id: 'bypass-dummy-id',
          email: emailUser,
          user_metadata: {
            ...user?.user_metadata,
            display_name: inputNama
          }
        };

        // Kirim state baru ke App.jsx supaya nama di Sidebar kiri langsung ikut berubah instan!
        if (typeof onProfileUpdate === 'function') {
          onProfileUpdate(mockUpdatedUser);
        }
      }

      alert("Profil berhasil diperbarui!");
      setActiveFrame(null); // Tutup modal
    } catch (error) {
      alert("Gagal memperbarui profil: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div id="setting-panel-view" className="w-full space-y-6 text-[#003366] relative animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center max-w-5xl">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-[#002B56]">Pengaturan</h1>
          <p className="text-xs font-bold text-[#8EA9C7] mt-0.5">Kelola akun dan sesuaikan dengan keinginan</p>
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-5">
        {/* Profile */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-black text-sm tracking-wide text-[#002B56] flex items-center gap-2 mb-4">👤 Profile Pengguna</h3>
          <div className="flex justify-between items-center bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 shadow-inner flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">{namaAwal}</h4>
                <p className="text-[11px] text-[#8EA9C7] font-semibold">{emailUser}</p>
              </div>
            </div>
            {/* Tombol Edit Profile */}
            <button 
              onClick={() => {
                setInputNama(namaAwal); // Reset input sesuai nama saat ini sebelum modal buka
                setActiveFrame('frame13');
              }} 
              className="bg-[#5BC0BE] hover:bg-[#45a3a1] text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
            >
              🖊️ Edit Profile
            </button>
          </div>
        </div>

        {/* Notifikasi */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-black text-sm tracking-wide text-[#002B56] flex items-center gap-2 border-b border-slate-100 pb-2">🔔 Notifikasi & Pengingat</h3>
          {[
            { label: 'Notifikasi Cuaca Harian', state: notifHarian, setState: setNotifHarian, icon: '🔔' },
            { label: 'Pengingat Jadwal (kalender)', state: pengingatJadwal, setState: setPengingatJadwal, icon: '📅' },
            { label: 'Smart Daily Suggestion', state: smartSuggestion, setState: setSmartSuggestion, icon: '💡' },
            { label: 'Peringatan Cuaca Ekstrem', state: cuacaEkstrem, setState: setCuacaEkstrem, icon: '⛈️' }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-2 px-3 bg-slate-50/40 rounded-xl border border-slate-100/70">
              <div className="flex items-center gap-3 text-xs font-extrabold text-slate-700">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <button onClick={() => item.setState(!item.state)} className={`w-12 h-6 flex items-center rounded-full p-1 border transition-colors cursor-pointer ${item.state ? 'bg-blue-600 border-blue-600' : 'bg-slate-300 border-slate-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal/Overlay Edit Profile */}
      {activeFrame && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full">
            {activeFrame === 'frame13' && (
              <div className="space-y-4 text-left">
                <h3 className="font-extrabold text-lg text-slate-800">Edit Profile</h3>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Nama Lengkap</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-100 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={inputNama}
                    onChange={(e) => setInputNama(e.target.value)}
                    disabled={isUpdating}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => setActiveFrame(null)} 
                    disabled={isUpdating}
                    className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    BATAL
                  </button>
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition disabled:opacity-50"
                  >
                    {isUpdating ? 'MENYIMPAN...' : 'SIMPAN'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}