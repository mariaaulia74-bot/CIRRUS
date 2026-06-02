import iconHome from '../assets/home.svg';
import iconCalendar from '../assets/calendar.svg';
import iconMap from '../assets/map.svg';
import iconWind from '../assets/wind.svg';
import iconSetting from '../assets/setting.svg';
import iconLogout from '../assets/logout.svg';
import avatarBahlil from '../assets/avatar-bahlil.svg';

export default function Sidebar({ activeMenu, setActiveMenu }) {
  return (
    <aside className="w-72 bg-[#E9F1F8] flex flex-col py-10 px-6 border-r border-slate-200 shrink-0 z-50">
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-white shadow-sm bg-white">
          <img src={avatarBahlil} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <h3 className="font-black text-xl tracking-tight uppercase">Bahlil</h3>
        <p className="text-[10px] opacity-40 uppercase font-black tracking-widest mt-1">Welcome!</p>
      </div>

      <nav className="flex-1 space-y-3">
        <NavItem icon={iconHome} label="Beranda" active={activeMenu === 'beranda'} onClick={() => setActiveMenu('beranda')} />
        <NavItem icon={iconCalendar} label="Kalender" active={activeMenu === 'kalender'} onClick={() => setActiveMenu('kalender')} />
        <NavItem icon={iconMap} label="Peta" active={activeMenu === 'peta'} onClick={() => setActiveMenu('peta')} />
        <NavItem icon={iconWind} label="Kualitas Udara" active={activeMenu === 'kualitas udara'} onClick={() => setActiveMenu('kualitas udara')} />
      </nav>

      <div className="space-y-6 pt-10 border-t border-slate-200">
        <button 
          onClick={() => setActiveMenu('setting')}
          className={`w-full flex items-center gap-5 px-4 font-bold text-sm transition cursor-pointer ${activeMenu === 'setting' ? 'text-blue-500 opacity-100 scale-105' : 'opacity-40 hover:opacity-100'}`}
        >
          <img src={iconSetting} alt="" className="w-6 h-6" /> Setting
        </button>
        <button className="w-full flex items-center gap-5 px-4 font-bold text-sm text-[#E74C3C] hover:scale-105 transition cursor-pointer">
          <img src={iconLogout} alt="" className="w-6 h-6" /> Log Out
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-5 px-6 py-4 rounded-2xl font-black transition cursor-pointer ${active ? 'bg-[#55ACEE] text-white shadow-xl shadow-blue-200' : 'text-[#003366] opacity-30 hover:opacity-100 hover:bg-white/40'}`}>
      <img src={icon} alt="" className={`w-6 h-6 object-contain ${active ? 'brightness-0 invert' : ''}`} />
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  );
}