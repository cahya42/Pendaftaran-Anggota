export default function AdminToolbar({ search, setSearch, statusFilter, setStatusFilter, onExport, onPrintList, onRefresh, refreshing }) {
  return (
    <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-extrabold text-slate-900">Data Pendaftar Calon Anggota</h3>
        <p className="text-xs text-slate-500">Verifikasi berkas, setujui pendaftaran, terbitkan NIA, atau ekspor data.</p>
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau NIK..." className="pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-tjokro-green" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold">
          <option value="ALL">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
        <button type="button" onClick={onRefresh} disabled={refreshing} title="Muat ulang data terbaru dari database" className="cursor-pointer px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-60">
          <i className={`fa-solid fa-rotate-right ${refreshing ? 'fa-spin' : ''}`}></i><span>{refreshing ? 'Memuat...' : 'Segarkan'}</span>
        </button>
        <button type="button" onClick={onPrintList} className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition">
          <i className="fa-solid fa-print text-tjokro-accentgold"></i><span>Cetak Daftar</span>
        </button>
        <button onClick={onExport} className="px-3.5 py-2 rounded-xl bg-tjokro-green hover:bg-tjokro-darkgreen text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
          <i className="fa-solid fa-file-excel text-tjokro-accentgold"></i><span>Ekspor Excel/CSV</span>
        </button>
      </div>
    </div>
  );
}
