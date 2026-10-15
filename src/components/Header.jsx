export function LogoEmblem({ size = 'w-12 h-12 sm:w-14 sm:h-14' }) {
  return (
    <div className={`relative ${size} flex-shrink-0`}>
      <img
        src="/logo-koperasi.png"
        alt="Logo Koperasi Konsumen HOS Tjokroaminoto"
        className="w-full h-full object-contain drop-shadow-md rounded-full bg-white"
      />
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
