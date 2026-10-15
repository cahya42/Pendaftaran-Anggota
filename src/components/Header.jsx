export function LogoEmblem({ size = 'w-12 h-12 sm:w-14 sm:h-14' }) {
  return (
    <div className={`relative ${size} flex-shrink-0`}>
      <svg className="w-full h-full drop-shadow-md" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="96" fill="#FFFFFF" stroke="#0b5336" strokeWidth="7" />
        <circle cx="100" cy="100" r="88" stroke="#d97706" strokeWidth="3" strokeDasharray="2 1" />
        <circle cx="100" cy="100" r="62" fill="#0b5336" fillOpacity="0.08" stroke="#0b5336" strokeWidth="2" />
        <path d="M75 75 Q90 60 110 65 Q130 70 135 85 Q140 105 125 120 Q110 135 85 130 Q65 125 65 105 Q65 85 75 75 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
        <circle cx="100" cy="132" r="14" fill="#d97706" stroke="#073824" strokeWidth="2" />
        <circle cx="100" cy="132" r="6" fill="#FFFFFF" />
        <path d="M142 98 L142 118 M154 98 L154 118 M138 104 Q148 98 158 104" stroke="#0b5336" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="50" cy="112" rx="10" ry="4" fill="#b45309" />
        <circle cx="45" cy="104" r="3" fill="#0b5336" />
        <circle cx="51" cy="102" r="3.5" fill="#f59e0b" />
        <circle cx="56" cy="104" r="3" fill="#0b5336" />
        <path d="M68 145 C80 155 95 155 100 155 C105 155 120 155 132 145" stroke="#0b5336" strokeWidth="4" strokeLinecap="round" />
        <path id="textArcHeader" d="M 30,100 A 70,70 0 1,1 170,100" fill="none" />
        <text fontSize="12" fontWeight="900" fill="#0b5336" letterSpacing="1.5">
          <textPath href="#textArcHeader" startOffset="50%" textAnchor="middle">
            HOS TJOKROAMINOTO
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export default function Header({ view, onSwitch }) {
  const btnActive = 'flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm bg-tjokro-green text-white';
  const btnIdle = 'flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all text-slate-600 hover:text-slate-900';
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tjokro-green/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3.5">
            <LogoEmblem />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-tjokro-darkgreen tracking-tight leading-snug">
                  KOPERASI KONSUMEN HOS TJOKROAMINOTO
                </span>
              </div>
              <p className="text-xs font-semibold text-tjokro-gold flex items-center gap-1.5">
                <span>PURWAKARTA ISTIMEWA</span>
                <span className="text-slate-300">&bull;</span>
                <span className="hidden sm:inline text-slate-500 font-normal italic">&quot;Bersama Membangun, Sejahtera Bersama&quot;</span>
              </p>
            </div>
          </div>
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button onClick={() => onSwitch('member')} className={view === 'member' ? btnActive : btnIdle}>
              <i className="fa-solid fa-qrcode text-tjokro-accentgold"></i>
              <span className="hidden sm:inline">Formulir Calon Anggota</span>
              <span className="sm:hidden">Form QR</span>
            </button>
            <button onClick={() => onSwitch('admin')} className={view === 'admin' ? btnActive : btnIdle}>
              <i className="fa-solid fa-users-gear text-xs"></i>
              <span className="hidden sm:inline">Panel Pengurus</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
