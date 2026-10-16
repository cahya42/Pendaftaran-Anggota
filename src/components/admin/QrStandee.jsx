import { QRCodeSVG } from 'qrcode.react';

export default function QrStandee({ eventTag, setEventTag, officer, setOfficer, onPreviewHp, notify }) {
  const isFile = window.location.protocol === 'file:';
  const base = isFile
    ? window.location.href.split('?')[0]
    : `${window.location.origin}${window.location.pathname}`;
  const qrValue = `${base}?koperasi=hostjokroaminoto&ref=${encodeURIComponent(eventTag || 'REKRUTMEN-TJOKRO')}`;
  return (
    <div className="bg-gradient-to-br from-tjokro-darkgreen via-tjokro-green to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-tjokro-gold/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-tjokro-accentgold border border-amber-400/30">
            <i className="fa-solid fa-qrcode"></i> Generator Standee / Poster Scan QR Calon Anggota
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            Cetak Standee QR Pendaftaran di Kantor &amp; Acara Koperasi
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Cukup cetak standee ini di meja kasir, banner rekrutmen warga Purwakarta, atau brosur. Calon anggota hanya perlu membuka kamera ponsel untuk langsung mengisi formulir pendaftaran digital.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-emerald-200 uppercase mb-1">Nama Lokasi / Event Rekrutmen:</label>
              <input
                type="text" value={eventTag}
                onChange={(e) => setEventTag(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900/80 border border-emerald-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-tjokro-accentgold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-emerald-200 uppercase mb-1">Petugas Lapangan / Referral:</label>
              <input
                type="text" value={officer}
                onChange={(e) => setOfficer(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900/80 border border-emerald-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-tjokro-accentgold"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-tjokro-gold to-tjokro-accentgold hover:from-tjokro-amber hover:to-tjokro-gold text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/30"
            >
              <i className="fa-solid fa-print"></i> Cetak Poster / Standee QR
            </button>
            <button
              onClick={onPreviewHp}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <i className="fa-solid fa-mobile-screen"></i> Buka Preview HP Calon
            </button>
          </div>
        </div>
        <div className="lg:col-span-5 flex justify-center">
          <div id="print-qr-target" className="bg-white text-slate-900 p-6 rounded-3xl shadow-2xl max-w-xs w-full text-center border-4 border-tjokro-gold">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-tjokro-green text-tjokro-accentgold flex items-center justify-center text-sm font-black">
                <i className="fa-solid fa-handshake-angle"></i>
              </div>
              <div className="text-left">
                <span className="block font-black text-[11px] text-tjokro-darkgreen leading-tight">KOP. KONSUMEN</span>
                <span className="block font-black text-xs text-tjokro-gold leading-tight">HOS TJOKROAMINOTO</span>
              </div>
            </div>
            <div className="my-2 py-1 bg-tjokro-mint rounded-lg border border-tjokro-green/20">
              <p className="text-[10px] font-black text-tjokro-darkgreen uppercase tracking-wider">SCAN UNTUK JADI ANGGOTA</p>
              <p className="text-[9px] text-tjokro-green italic">&quot;Bersama Membangun, Sejahtera Bersama&quot;</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex justify-center my-3 shadow-inner">
              <QRCodeSVG value={qrValue} size={140} fgColor="#073824" bgColor="#ffffff" level="M" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-slate-900">Arahkan Kamera HP Anda ke Sini</p>
              <p className="text-[10px] font-mono text-slate-500">Ref: {eventTag} ({officer})</p>
              <div className="pt-2 text-[9px] text-slate-400 font-semibold border-t border-slate-100 uppercase tracking-widest">
                PURWAKARTA ISTIMEWA &bull; RESMI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
