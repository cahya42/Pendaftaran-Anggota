import { useRef } from 'react';
import { PILIHAN_WAJIB, SIMPANAN_POKOK } from '../../data/applicants.js';
import { formatRupiah, readFileAsDataURL } from '../../utils/helpers.js';

export default function Step3Simpanan({ form, setForm }) {
  const sukarela = Number(form.simpananSukarela || 0);
  const total = SIMPANAN_POKOK + Number(form.simpananWajib || 0) + sukarela;
  const buktiRef = useRef(null);

  const setSukarela = (val) => {
    const n = val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0);
    setForm((p) => ({ ...p, simpananSukarela: n }));
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-50 text-tjokro-gold flex items-center justify-center text-xs">
            <i className="fa-solid fa-coins"></i>
          </span>
          Simpanan Anggota Koperasi
        </h2>
        <p className="text-xs text-slate-500 mt-1">Sesuai AD/ART Koperasi Konsumen HOS TJOKROAMINOTO, anggota memiliki modal bersama.</p>
      </div>
      <div className="bg-gradient-to-br from-tjokro-mint/70 via-white to-amber-50/50 border border-tjokro-green/20 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-tjokro-green/10">
          <div>
            <h3 className="font-bold text-sm text-tjokro-darkgreen">1. Simpanan Pokok (1x di awal)</h3>
            <p className="text-xs text-slate-500">Iuran kepemilikan saham anggota pertama kali</p>
          </div>
          <span className="font-mono font-bold text-sm text-tjokro-darkgreen">{formatRupiah(SIMPANAN_POKOK)}</span>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-tjokro-green/10">
          <div>
            <h3 className="font-bold text-sm text-tjokro-darkgreen">2. Simpanan Wajib (Bulanan)</h3>
            <p className="text-xs text-slate-500">Pilihan iuran rutin bulanan anggota</p>
          </div>
          <div>
            <select
              value={form.simpananWajib}
              onChange={(e) => setForm((p) => ({ ...p, simpananWajib: Number(e.target.value) }))}
              className="px-2.5 py-1.5 bg-white border border-tjokro-green/30 rounded-xl text-xs font-bold text-tjokro-darkgreen focus:outline-none"
            >
              {PILIHAN_WAJIB.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Simpanan Sukarela — nominal bebas diisi calon anggota */}
        <div className="flex items-center justify-between pb-3 border-b border-tjokro-green/10">
          <div>
            <h3 className="font-bold text-sm text-tjokro-darkgreen">3. Simpanan Sukarela <span className="text-tjokro-gold text-[10px] font-black">(Opsional)</span></h3>
            <p className="text-xs text-slate-500">Nominal ditambahkan sendiri oleh calon anggota — boleh dikosongkan</p>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 text-[11px] font-black pointer-events-none">Rp</span>
            <input
              type="number" min="0" step="1000" placeholder="0"
              value={form.simpananSukarela || ''}
              onChange={(e) => setSukarela(e.target.value)}
              className="w-32 pl-7 pr-2.5 py-1.5 bg-white border border-tjokro-green/30 rounded-xl text-xs font-bold text-tjokro-darkgreen focus:outline-none text-right"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-tjokro-gold">Total Komitmen Setoran Awal</span>
            <p className="text-[11px] text-slate-500">Pokok + Wajib + Sukarela — dibayarkan saat disahkan pengurus</p>
          </div>
          <span className="text-xl font-black text-tjokro-green font-mono">{formatRupiah(total)}</span>
        </div>
      </div>
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Rencana Pembayaran Setoran Awal</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'QRIS', title: 'QRIS Koperasi (Instan)', desc: 'BCA, Mandiri, BRI, GoPay, Dana, OVO', icon: 'fa-solid fa-qrcode text-tjokro-green' },
            { value: 'Transfer Bank / Kasir', title: 'Rekening Koperasi / Kasir', desc: 'Transfer BJB / BRI / Setor Langsung di Kantor', icon: 'fa-solid fa-building-columns text-slate-600' },
          ].map((m) => {
            const active = form.metode === m.value;
            return (
              <label
                key={m.value}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer ${
                  active ? 'border-2 border-tjokro-green bg-tjokro-mint/40' : 'border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio" name="metode_bayar" value={m.value} checked={active}
                  onChange={(e) => setForm((p) => ({ ...p, metode: e.target.value }))}
                  className="text-tjokro-green focus:ring-tjokro-green"
                />
                <div>
                  <div className={`font-bold text-xs flex items-center gap-1.5 ${active ? 'text-tjokro-darkgreen' : 'text-slate-800'}`}>
                    <i className={m.icon}></i> {m.title}
                  </div>
                  <p className="text-[11px] text-slate-500">{m.desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Upload Bukti Pembayaran (opsional) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Bukti Pembayaran Setoran Awal <span className="text-slate-400 font-normal">(Opsional)</span>
        </label>
        <div
          onClick={() => buktiRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-tjokro-green bg-slate-50/60 min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden transition group cursor-pointer"
        >
          <input
            ref={buktiRef} type="file" accept="image/*" className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const dataUrl = await readFileAsDataURL(f);
              setForm((p) => ({ ...p, buktiBayarPreview: dataUrl }));
            }}
          />
          {!form.buktiBayarPreview ? (
            <div className="flex flex-col items-center pointer-events-none">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 text-lg group-hover:scale-110 transition">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <p className="text-xs font-bold text-slate-700">Unggah screenshot QRIS / struk transfer</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Boleh dilewati — unggah setelah Anda membayar</p>
            </div>
          ) : (
            <img src={form.buktiBayarPreview} alt="Bukti bayar" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          <i className="fa-solid fa-shield-halved text-tjokro-green mr-1"></i>
          Tampil di Panel Pengurus untuk verifikasi — status &quot;Lunas&quot; ditandai setelah cocok dengan mutasi rekening.
        </p>
      </div>
    </div>
  );
}
