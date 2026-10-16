export function LogoEmblem({ size = 'w-12 h-12 sm:w-14 sm:h-14' }) {
  return (
    <div className={`relative ${size} flex-shrink-0`}>
      <img
        src="logo-koperasi.png"
        alt="Logo Koperasi Konsumen HOS Tjokroaminoto"
        className="w-full h-full object-contain drop-shadow-md rounded-full bg-white"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling.style.display = 'flex';
        }}
      />
      <span
        style={{ display: 'none' }}
        className="w-full h-full rounded-full bg-tjokro-green text-tjokro-accentgold items-center justify-center font-black text-xl"
      >
        H
      </span>
    </div>
  );
}

export default function Header({ view, onSwitch }) {
  const btnBase = 'flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm border border-transparent';
  const btnActive = `${btnBase} bg-tjokro-green text-white`;
  const btnIdle = `${btnBase} text-slate-600 hover:text-slate-900 border border-slate-200`;
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tjokro-green/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Root: stacked on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full">

          {/* Logo (left, fixed size) */}
          <div className="flex-shrink-0">
            <LogoEmblem size="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          {/* Brand block: title stretched, tagline below */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 w-full sm:w-auto flex-1 sm:flex-auto min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 min-w-0 flex-1">
              <span className="font-extrabold text-xs sm:text-base sm:leading-tight text-tjokro-darkgreen tracking-tight leading-none truncate sm:truncate block sm:inline-block w-full sm:w-auto">
                KOPERASI KONSUMEN HOS TJOKROAMINOTO
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-tjokro-gold flex items-center gap-1.5 w-full sm:w-auto mt-1 sm:mt-0">
              <span>PURWAKARTA ISTIMEWA</span>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline text-slate-500 font-normal italic">&quot;Bersama Membangun, Sejahtera Bersama&quot;</span>
            </p>
          </div>

          {/* Buttons: stacked below tagline on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-3 sm:mt-0">
            <button
              onClick={() => onSwitch('member')}
              className={`${view === 'member' ? btnActive : btnIdle} w-full sm:w-auto`}
            >
              <i className="fa-solid fa-qrcode text-tjokro-accentgold"></i>
              <span className="hidden sm:inline">Formulir Calon Anggota</span>
              <span className="sm:hidden">Form QR</span>
            </button>
            <button
              onClick={() => onSwitch('admin')}
              className={`${view === 'admin' ? btnActive : btnIdle} w-full sm:w-auto`}
            >
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
