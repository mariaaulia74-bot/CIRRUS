export default function Footer() {
  return (
    <footer id="contact" className="bg-[#003366] text-white/80 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/10 pb-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-black text-white tracking-wider">CIRRUS</h3>
          <p className="text-xs opacity-60">Smart Weather App for Smart People.</p>
        </div>
        <div className="text-sm space-y-1.5 text-center md:text-right font-medium">
          <p>📧 Email : <span className="text-[#A4D8FB] font-bold">Cirrus@gmail.com</span></p>
          <p>📸 Instagram : <span className="text-[#A4D8FB] font-bold">@cirruskeren</span></p>
        </div>
      </div>
      <div className="text-center pt-8 text-xs opacity-40 font-bold tracking-widest">
        © {new Date().getFullYear()} CIRRUS. All Rights Reserved.
      </div>
    </footer>
  );
}