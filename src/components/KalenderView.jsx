import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Hubungkan client

export default function KalenderView({ selectedDate, setSelectedDate, waktuSistem }) {
  const [schedules, setSchedules] = useState([]);
  const [loadingJadwal, setLoadingJadwal] = useState(false);

  // State untuk melacak navigasi bulan & tahun di kalender (Default ke bulan berjalan)
  const [navDate, setNavDate] = useState(new Date(waktuSistem.getFullYear(), waktuSistem.getMonth(), 1));

  // State Input Form
  const [inputAgenda, setInputAgenda] = useState('');
  const [inputWaktu, setInputWaktu] = useState('08:00');
  const [inputEmoji, setInputEmoji] = useState('📅');
  const [inputNotify, setInputNotify] = useState(true);

  // Helper untuk mengubah objek Date menjadi string format database YYYY-MM-DD
  const dapatkanFormatKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Helper format tampilan tanggal lokal Indonesia
  const formatTanggalLokal = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
  };

  // --- 1. FUNGSI AMBIL DATA DARI SUPABASE (READ) ---
  const muatJadwalDariSupabase = async () => {
    try {
      setLoadingJadwal(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const dataTerformat = data.map(item => ({
          id: item.id,
          tanggal: item.tanggal,
          waktu: item.waktu.substring(0, 5), // Potong detik (:00) agar rapi
          agenda: item.agenda,
          emoji: item.emoji,
          isNotify: item.is_notify 
        }));
        setSchedules(dataTerformat);
      }
    } catch (e) {
      console.error("Gagal mengambil data jadwal:", e.message);
    } finally {
      setLoadingJadwal(false);
    }
  };

  useEffect(() => {
    muatJadwalDariSupabase();
  }, []);

  // --- 2. FUNGSI SIMPAN DATA KE SUPABASE (CREATE) ---
  const handleTambahJadwal = async (e) => {
    e.preventDefault();
    if (!inputAgenda.trim()) return alert('Isi agenda kegiatan terlebih dahulu!');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert('Sesi masuk Anda telah habis, silakan login kembali.');

      const formatTanggalString = dapatkanFormatKey(selectedDate);

      const { error } = await supabase
        .from('schedules')
        .insert([
          {
            user_id: user.id,
            tanggal: formatTanggalString,
            waktu: `${inputWaktu}:00`,
            agenda: inputAgenda,
            emoji: inputEmoji,
            is_notify: inputNotify
          }
        ]);

      if (error) throw error;

      alert('Jadwal berhasil disimpan ke database Supabase!');
      muatJadwalDariSupabase(); // Refresh list data dari awan
      setInputAgenda('');
    } catch (error) {
      alert(`Gagal menyimpan: ${error.message}`);
    }
  };

  // --- 3. FUNGSI TOGGLE NOTIFIKASI (UPDATE) ---
  const toggleNotification = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({ is_notify: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      muatJadwalDariSupabase(); // Sinkronkan ulang state
    } catch (error) {
      console.error(error.message);
    }
  };

  // --- LOGIKA UTAMA MATEMATIKA KALENDER BULANAN ---
  const jadwalTerfilter = schedules.filter(item => item.tanggal === dapatkanFormatKey(selectedDate));
  const tahunNav = navDate.getFullYear();
  const bulanNav = navDate.getMonth();

  const namaBulanTahunNav = navDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const hariPertamaIndex = new Date(tahunNav, bulanNav, 1).getDay();
  const jumlahHariBulanIni = new Date(tahunNav, bulanNav + 1, 0).getDate();

  const renderGridBulanan = () => {
    const listGrid = [];

    // 1. Slot kosong bulan sebelumnya
    for (let i = 0; i < hariPertamaIndex; i++) {
      listGrid.push(<div key={`empty-${i}`} className="p-3"></div>);
    }

    // 2. Tombol tanggal bulan aktif
    for (let hari = 1; hari <= jumlahHariBulanIni; hari++) {
      const tanggalTarget = new Date(tahunNav, bulanNav, hari);
      const isSelected = dapatkanFormatKey(tanggalTarget) === dapatkanFormatKey(selectedDate);
      const isToday = dapatkanFormatKey(tanggalTarget) === dapatkanFormatKey(waktuSistem);
      const adaJadwal = schedules.some(s => s.tanggal === dapatkanFormatKey(tanggalTarget));

      listGrid.push(
        <button
          key={`day-${hari}`}
          type="button"
          onClick={() => setSelectedDate(tanggalTarget)}
          className={`p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border text-sm relative ${
            isSelected 
              ? 'bg-[#2C5282] text-white border-[#2C5282] font-black shadow-md scale-105' 
              : isToday
                ? 'bg-[#E9F1F8] text-[#2C5282] border-[#4A86CC] font-bold'
                : 'bg-white text-[#003366]/70 border-transparent hover:bg-[#F0F5FA]'
          }`}
        >
          <span>{hari}</span>
          {adaJadwal && (
            <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 block ${isSelected ? 'bg-white' : 'bg-[#4A86CC]'}`}></span>
          )}
        </button>
      );
    }

    return listGrid;
  };

  const ubahBulan = (offset) => {
    setNavDate(new Date(tahunNav, bulanNav + offset, 1));
  };

  return (
    <div className="space-y-8 pb-16 w-full max-w-5xl mx-auto">
      {/* Header Info Waktu */}
      <div className="px-2">
        <h1 className="text-3xl font-black uppercase tracking-widest text-[#2C5282]">Kalender & Agenda</h1>
        <p className="text-xs font-bold opacity-40 uppercase mt-1">
          Waktu Sistem: {waktuSistem.toLocaleTimeString('id-ID')} WITA — {formatTanggalLokal(waktuSistem)}
        </p>
      </div>

      {/* --- SEKSI 1: KALENDER BULANAN --- */}
      <div className="bg-white border border-[#DDEEFE] p-6 rounded-[30px] shadow-sm space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-md font-black text-[#003366] uppercase tracking-wide">{namaBulanTahunNav}</h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => ubahBulan(-1)} className="p-2 bg-[#F0F5FA] hover:bg-[#DDEEFE] rounded-lg text-xs font-bold cursor-pointer">◀ Mv</button>
            <button type="button" onClick={() => setNavDate(new Date(waktuSistem.getFullYear(), waktuSistem.getMonth(), 1))} className="px-3 py-2 bg-[#E9F1F8] text-[#2C5282] text-xs font-black rounded-lg cursor-pointer">BULAN INI</button>
            <button type="button" onClick={() => ubahBulan(1)} className="p-2 bg-[#F0F5FA] hover:bg-[#DDEEFE] rounded-lg text-xs font-bold cursor-pointer">Mv ▶</button>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-7 gap-2 text-center mb-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((h, idx) => (
              <span key={idx} className="text-xs font-black uppercase opacity-30 tracking-wider py-1">{h}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {renderGridBulanan()}
          </div>
        </div>
      </div>

      {/* --- SEKSI 2 & 3: FORM & LIST SCHEDULE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-[#DDEEFE]/40 border border-[#DDEEFE]/60 rounded-[35px] p-6 space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#003366] uppercase tracking-wider">My Schedule</h2>
            <p className="text-xs font-bold text-[#4A86CC] uppercase mt-0.5">{formatTanggalLokal(selectedDate)}</p>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
            {loadingJadwal ? (
              <div className="text-center py-8 text-xs font-bold text-slate-400">Menghubungkan ke server cloud...</div>
            ) : jadwalTerfilter.length === 0 ? (
              <div className="bg-white/50 border border-dashed border-[#003366]/20 p-8 rounded-2xl text-center text-sm font-semibold opacity-40">
                📭 Tidak ada agenda untuk tanggal ini.
              </div>
            ) : (
              jadwalTerfilter
                .sort((a, b) => a.waktu.localeCompare(b.waktu))
                .map((item) => (
                  <div key={item.id} className="bg-white p-4 px-6 rounded-2xl border border-white/80 shadow-xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-2xl p-2.5 bg-[#E9F1F8] rounded-xl">{item.emoji}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-[#4A86CC] block tracking-wide">{item.waktu} WITA</span>
                        <h4 className="text-sm font-bold text-[#003366] truncate">{item.agenda}</h4>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => toggleNotification(item.id, item.isNotify)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer border ${
                        item.isNotify 
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs' 
                          : 'bg-gray-100 text-gray-400 border-gray-200'
                      }`}
                    >
                      {item.isNotify ? '🔔 ON' : '🔕 OFF'}
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

        <form onSubmit={handleTambahJadwal} className="lg:col-span-5 bg-white border border-[#DDEEFE] p-6 rounded-[35px] shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase text-[#003366]/40 tracking-widest">Tambah Kegiatan Baru</h3>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-[#003366]/50">Nama Kegiatan</label>
            <input 
              type="text" required value={inputAgenda} onChange={(e) => setInputAgenda(e.target.value)}
              placeholder="Contoh: Rapat Koordinasi Oxy-Flow"
              className="w-full px-4 py-3 bg-[#F0F5FA] border border-[#DDEEFE] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#2C5282] focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[#003366]/50">Jam Mulai</label>
              <input 
                type="time" required value={inputWaktu} onChange={(e) => setInputWaktu(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F0F5FA] border border-[#DDEEFE] rounded-xl text-xs font-bold text-[#003366] focus:outline-none focus:border-[#2C5282]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-[#003366]/50">Pilih Emoji</label>
              <select 
                value={inputEmoji} onChange={(e) => setInputEmoji(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F0F5FA] border border-[#DDEEFE] rounded-xl text-xs font-bold focus:outline-none focus:border-[#2C5282]"
              >
                <option value="📅">📅 Umum</option>
                <option value="💻">💻 Kuliah</option>
                <option value="🌊">🌊 PKM / Riset</option>
                <option value="🌿">🌿 Organik / Oxy</option>
                <option value="🚨">🚨 Penting</option>
                <option value="☕">☕ Istirahat</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#F0F5FA] p-3 px-4 rounded-xl border border-[#DDEEFE]">
            <span className="text-xs font-bold text-[#003366]/70">Aktifkan Pengingat Suara</span>
            <input 
              type="checkbox" checked={inputNotify} onChange={(e) => setInputNotify(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#2C5282] focus:ring-[#2C5282] cursor-pointer"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-[#2C5282] hover:bg-[#1A365D] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer transform hover:-translate-y-0.5"
          >
            ➕ Simpan Ke My Schedule
          </button>
        </form>
      </div>
    </div>
  );
}