import { useState } from 'react';
import { supabase } from '../supabaseClient'; // Impor client supabase

export default function AuthView({ initialMode = 'login', onAuthSuccess, onBackToLanding }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- PROSES LOGIN NYATA KE SUPABASE ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        
        alert('Login berhasil!');
        onAuthSuccess(); // Berpindah ke dashboard
      } else {
        // --- PROSES SIGN UP NYATA KE SUPABASE ---
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { display_name: nama } // Menyimpan nama tambahan di metadata profile
          }
        });
        if (error) throw error;

        // 👍 KARENA CONFIRM EMAIL SUDAH MATI, KITA LANGSUNG LEMPAR KE DASHBOARD UTAMA
        alert('Pendaftaran berhasil! Selamat datang di CIRRUS.');
        onAuthSuccess(); 
      }
    } catch (error) {
      setErrorMsg(error.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#E9F1F8] to-[#DDEEFE] flex flex-col justify-center items-center p-6 relative">
      {/* Tombol Kembali ke Landing */}
      <button 
        onClick={onBackToLanding}
        className="absolute top-6 left-6 font-black text-xs uppercase tracking-widest text-[#2C5282] hover:text-[#003366] bg-white/60 px-4 py-2.5 rounded-xl border border-white shadow-sm cursor-pointer"
      >
        ⬅️ Kembali
      </button>

      <div className="bg-white border border-white p-8 md:p-10 rounded-[35px] shadow-2xl w-full max-w-md space-y-8 text-center">
        <div>
          <span className="text-5xl block mb-2">☁️</span>
          <h2 className="text-2xl font-black text-[#003366] uppercase tracking-wider">
            {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
          </h2>
          <p className="text-xs font-bold text-[#4A86CC] uppercase mt-1">
            {isLogin ? 'Masuk ke akun CIRRUS Anda' : 'Mulai kelola aktivitasmu dengan cerdas'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
  
          {/* MENAMPILKAN ERROR KE LAYAR */}
          {errorMsg && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center uppercase tracking-wide">
              ⚠️ {errorMsg}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-[#003366]/50 tracking-wider">Nama Lengkap</label>
              <input 
                type="text" required value={nama} onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full px-4 py-3.5 bg-[#E9F1F8]/60 border border-[#DDEEFE] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#2C5282] focus:bg-white transition-all"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-[#003366]/50 tracking-wider">Alamat Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3.5 bg-[#E9F1F8]/60 border border-[#DDEEFE] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#2C5282] focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-[#003366]/50 tracking-wider">Kata Sandi</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-[#E9F1F8]/60 border border-[#DDEEFE] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#2C5282] focus:bg-white transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#2C5282] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer mt-2 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Akun')}
          </button>
        </form>

        <div className="text-xs font-bold text-[#003366]/50">
          {isLogin ? "Belum punya akun? " : "Sudah memiliki akun? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-[#2C5282] hover:underline font-black bg-transparent border-none cursor-pointer"
          >
            {isLogin ? 'Daftar di sini' : 'Login di sini'}
          </button>
        </div>
      </div>
    </div>
  );
}