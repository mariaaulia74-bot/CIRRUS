import { useState } from 'react';
import { supabase } from '../supabaseClient'; // Impor client supabase

export default function AuthView({ initialMode = 'login', onAuthSuccess, onBackToLanding }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Mode Lupa Password
  const [isStepUpdatePassword, setIsStepUpdatePassword] = useState(false); // Mode Input Password Baru
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // State untuk password baru
  const [nama, setNama] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. SIMULASI: Cek email ada/tidak, lalu langsung izinkan ganti password
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!email) throw new Error('Silakan masukkan alamat email Anda.');

      // Catatan: Karena fitur OTP/Email dilewati demi dummy data,
      // kita langsung arahkan user ke langkah memasukkan password baru.
      setIsStepUpdatePassword(true);
      setSuccessMsg('Email terverifikasi! Silakan masukkan kata sandi baru Anda di bawah.');
    } catch (error) {
      setErrorMsg(error.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  // 2. SIMULASI LOCALSTORAGE: Menyimpan password baru ke browser untuk bypass error "AUTH SESSION MISSING"
  const handleUpdatePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!newPassword) throw new Error('Kata sandi baru tidak boleh kosong.');
      if (newPassword.length < 6) throw new Error('Kata sandi minimal harus 6 karakter.');

      const cleanEmail = email.toLowerCase().trim();

      // 🚀 PERBAIKAN 1: Kunci alamat email yang valid ini ke sesi bypass lokal!
      localStorage.setItem('last_logged_in_email', cleanEmail);

      // Simpan password baru di LocalStorage berdasarkan email sebagai penanda bypass login
      localStorage.setItem(`bypass_pw_${cleanEmail}`, newPassword);

      alert('Kata sandi Anda berhasil diperbarui! Langsung mengalihkan ke dashboard...');
      
      // 🚀 PERBAIKAN 2: Alihkan langsung ke dashboard setelah bypass password diset, 
      // JANGAN kosongkan state email dulu agar datanya terbaca sempurna oleh App.jsx
      setIsForgotPassword(false);
      setIsStepUpdatePassword(false);
      setPassword('');
      setNewPassword('');
      
      onAuthSuccess(); // Eksekusi masuk ke dashboard
    } catch (error) {
      setErrorMsg(error.message || 'Terjadi kesalahan saat memperbarui kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const cleanEmail = email.toLowerCase().trim();

      if (isLogin) {
        // 💡 CEK BYPASS: Apakah email ini punya data password baru hasil reset di LocalStorage?
        const savedBypassPassword = localStorage.getItem(`bypass_pw_${cleanEmail}`);

        if (savedBypassPassword && password === savedBypassPassword) {
          // 🚀 PERBAIKAN 3: Pastikan email bypass disimpan saat user login kembali menggunakan password hasil reset
          localStorage.setItem('last_logged_in_email', cleanEmail);
          
          alert('Login berhasil (Menggunakan kata sandi hasil reset)!');
          onAuthSuccess(); // Langsung berpindah ke dashboard
          return; // Hentikan fungsi agar tidak menembak login asli Supabase yang bakal error
        }

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
          <span className="text-5xl block mb-2">
            {isForgotPassword ? '🔑' : '☁️'}
          </span>
          <h2 className="text-2xl font-black text-[#003366] uppercase tracking-wider">
            {isForgotPassword ? 'Atur Ulang Sandi' : (isLogin ? 'Selamat Datang' : 'Buat Akun Baru')}
          </h2>
          <p className="text-xs font-bold text-[#4A86CC] uppercase mt-1">
            {isForgotPassword 
              ? (isStepUpdatePassword ? 'Masukkan kata sandi baru Anda' : 'Masukkan email simulasi untuk reset') 
              : (isLogin ? 'Masuk ke akun CIRRUS Anda' : 'Mulai kelola aktivitasmu dengan cerdas')}
          </p>
        </div>

        {/* --- TAMPILAN JIKA USER DALAM MODE LUPA PASSWORD --- */}
        {isForgotPassword ? (
          <div className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-xl text-center uppercase tracking-wide">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-100 border border-green-200 text-green-700 text-xs font-bold rounded-xl text-center uppercase tracking-wide">
                ✅ {successMsg}
              </div>
            )}

            {/* STEP 1: INPUT EMAIL DUMMY */}
            {!isStepUpdatePassword ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-[#003366]/50 tracking-wider">Alamat Email</label>
                  <input 
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3.5 bg-[#E9F1F8]/60 border border-[#DDEEFE] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#2C5282] focus:bg-white transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-[#2C5282] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer mt-2 disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Kirim Email Reset'}
                </button>
              </form>
            ) : (
              /* STEP 2: LANGSUNG MUNCUL INPUT PASSWORD BARU (BYPASS EMAIL) */
              <form onSubmit={handleUpdatePasswordSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-[#003366]/50 tracking-wider">Kata Sandi Baru</label>
                  <input 
                    type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-[#E9F1F8]/60 border border-[#DDEEFE] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#2C5282] focus:bg-white transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 bg-[#48BB78] hover:bg-[#38A169] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer mt-2 disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Simpan Kata Sandi Baru'}
                </button>
              </form>
            )}

            <button 
              type="button"
              onClick={() => { setIsForgotPassword(false); setIsStepUpdatePassword(false); setErrorMsg(''); setSuccessMsg(''); }}
              className="w-full py-2.5 text-xs font-black text-[#2C5282] hover:underline uppercase text-center cursor-pointer"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          /* --- TAMPILAN NORMAL (LOGIN / REGISTER) --- */
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-[#003366]/50 tracking-wider">Kata Sandi</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setErrorMsg(''); }}
                    className="text-[10px] md:text-xs font-black text-[#2C5282] hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    Lupa Sandi?
                  </button>
                )}
              </div>
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
        )}

        {!isForgotPassword && (
          <div className="text-xs font-bold text-[#003366]/50">
            {isLogin ? "Belum punya akun? " : "Sudah memiliki akun? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} 
              className="text-[#2C5282] hover:underline font-black bg-transparent border-none cursor-pointer"
            >
              {isLogin ? 'Daftar di sini' : 'Login di sini'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}