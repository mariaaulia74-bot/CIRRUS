export default function Features() {
  const listFitur = [
    { icon: "🌧️", title: "Informasi Cuaca Real-Time", desc: "Menampilkan data cuaca terkini berbasis lokasi wilayah yang dipilih secara presisi." },
    { icon: "🗺️", title: "Peta Cuaca Interaktif", desc: "Memantau kondisi cuaca di berbagai wilayah Kalimantan Selatan menggunakan monitor visual." },
    { icon: "📅", title: "Pengingat Berbasis Cuaca", desc: "Memberi tahu Anda jika kondisi cuaca berpotensi mempengaruhi jadwal kegiatan." },
    { icon: "🔔", title: "Saran Harian (Daily Suggestion)", desc: "Rekomendasi AI pintar mengenai pakaian dan barang bawaan yang tepat sesuai cuaca hari ini." }
  ];

  return (
    <section id="features" className="py-24 bg-[#DDEEFE]/30 border-y border-[#DDEEFE]/50 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-[#003366] uppercase tracking-widest">Features</h2>
          <p className="text-sm font-bold text-[#4A86CC] uppercase tracking-widest">Fitur yang Membantu Aktivitasmu Lebih Terencana</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {listFitur.map((fitur, i) => (
            <div key={i} className="bg-white border border-white/80 p-8 rounded-[30px] shadow-sm hover:shadow-xl transition-all group flex gap-6 items-start">
              <div className="text-4xl p-4 bg-[#E9F1F8] rounded-2xl group-hover:bg-[#2C5282] group-hover:scale-110 transition-all shrink-0">
                {fitur.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#003366] group-hover:text-[#4A86CC] transition-colors">{fitur.title}</h3>
                <p className="text-sm text-[#003366]/60 font-medium leading-relaxed">{fitur.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}