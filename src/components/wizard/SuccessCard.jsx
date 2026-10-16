export default function SuccessCard({ ticket, onReset, notify }) {
  if (!ticket) return null;
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-lg border border-slate-200 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-100 text-tjokro-green rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
        <i className="fa-solid fa-check-double"></i>
      </div>
      <div className="space-y-1">
        <span className="inline-block px-3 py-1 bg-amber-100 text-tjokro-amber font-bold text-xs rounded-full">Status: Menunggu Konfirmasi Pengurus</span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">Formulir Pendaftaran Berhasil Dikirim!</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Selamat! Formulir Anda telah tercatat di sistem <strong>Koperasi Konsumen HOS TJOKROAMINOTO PURWAKARTA ISTIMEWA</strong>. Silakan simpan kartu bukti registrasi berikut.
        </p>
      </div>
      <div className="bg-gradient-to-br from-tjokro-darkgreen via-tjokro-green to-slate-900 text-white p-6 rounded-3xl max-w-md mx-auto shadow-2xl text-left border-2 border-tjokro-accentgold/30 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-tjokro-gold/15 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-tjokro-accentgold">BUKTI PENDAFTARAN ANGGOTA</p>
            <h4 className="font-black text-sm tracking-tight text-white leading-tight">KOP. KONSUMEN HOS TJOKROAMINOTO PURWAKARTA ISTIMEWA</h4>
            <p className="text-[9px] text-emerald-200">Purwakarta Istimewa</p>
          </div>
          <i className="fa-solid fa-award text-tjokro-accentgold text-3xl"></i>
        </div>
        <div className="py-4 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-300">No. Registrasi:</span><span className="font-mono font-bold text-tjokro-accentgold">{ticket.id}</span></div>
          <div className="flex justify-between"><span className="text-slate-300">Nama Calon:</span><span className="font-bold text-white">{ticket.nama}</span></div>
          <div className="flex justify-between"><span className="text-slate-300">NIK:</span><span className="font-mono text-slate-200">{ticket.nik}</span></div>
          <div className="flex justify-between"><span className="text-slate-300">Waktu Scan &amp; Daftar:</span><span className="text-slate-200">{ticket.tanggalDaftar}</span></div>
        </div>
        <div className="pt-3 border-t border-white/15 flex flex-col items-center">
          <div className="h-8 w-full bg-white/95 rounded-lg px-2 flex items-center justify-center space-x-1">
            {[1, 2.5, 1, 3, 1, 2, 1.5, 3, 1, 2].map((w, i) => (
              <span key={i} className="h-full bg-black inline-block" style={{ width: w * 3 }}></span>
            ))}
          </div>
          <span className="text-[9px] text-slate-300 tracking-widest mt-1.5 font-mono">TUNJUKKAN KARTU INI SAAT VERIFIKASI</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => notify('Kartu registrasi berhasil disimpan. Tunjukkan ke pengurus saat validasi.', 'success')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-download"></i> Simpan Kartu Digital
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Isi Pendaftaran Lain
        </button>
      </div>
    </div>
  );
}
