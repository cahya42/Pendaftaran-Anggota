export function LogoEmblem({ size = 'w-12 h-12 sm:w-14 sm:h-14' }) {
  return (
    <div className={`relative ${size} flex-shrink-0`}>
      <img
        src="logo-koperasi.png"
        alt="Logo Koperasi Konsumen HOS Tjokroaminoto Purwakarta Istimewa"
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
  const btnBase = 'flex items-center justify-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm border border-transparent';
  const btnActive = `${btnBase} bg-tjokro-green text-white`;
  const btnIdle = `${btnBase} text-slate-600 hover:text-slate-900 border border-slate-200`;

  // Halaman /daftar (diakses calon anggota via QR) — tidak ada tombol navigasi sama sekali
  const isDaftarPage = typeof window !== 'undefined' &&
    (window.location.pathname === '/daftar' || window.location.pathname.endsWith('/daftar'));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tjokro-green/15 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-3 w-full">
          {/* Baris 1: Logo + Judul + Subtitel di samping */}
          <div className="flex items-center gap-2 sm:gap-3 w-full">
            <div className="flex-shrink-0">
              <LogoEmblem size="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-xs sm:text-base text-tjokro-darkgreen tracking-tight leading-none truncate sm:truncate">
                KOPERASI KONSUMEN HOS TJOKROAMINOTO
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-tjokro-gold mt-0.5 leading-none">
                PURWAKARTA ISTIMEWA
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-tjokro-gold mt-0.5 leading-none">
                &quot;Bersama Membangun, Sejahtera Bersama&quot;
              </span>
            </div>
          </div>

          {/* Baris 3: Tombol navigasi — hanya di halaman utama, SELALU 2 tombol (Daftar + Admin) */}
          {!isDaftarPage && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => onSwitch('member')}
                className={`${view === 'member' ? btnActive : btnIdle} flex-1`}
              >
                <i className="fa-solid fa-qrcode text-tjokro-accentgold"></i>
                <span className="hidden sm:inline">Formulir Calon Anggota</span>
                <span className="sm:inline-block sm:hidden">Form QR</span>
              </button>
              <button
                onClick={() => onSwitch('admin')}
                className={`${view === 'admin' ? btnActive : btnIdle} flex-1`}
              >
                <i className="fa-solid fa-users-gear text-xs"></i>
                <span className="hidden sm:inline">Panel Pengurus</span>
                <span className="sm:inline-block sm:hidden">Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
