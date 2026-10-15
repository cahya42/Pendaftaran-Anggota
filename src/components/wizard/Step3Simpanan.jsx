import { PILIHAN_WAJIB, SIMPANAN_POKOK } from '../../data/applicants.js';
import { formatRupiah } from '../../utils/helpers.js';

export default function Step3Simpanan({ form, setForm }) {
  const total = SIMPANAN_POKOK + Number(form.simpananWajib || 0);
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
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-tjokro-gold">Total Komitmen Setoran Awal</span>
            <p className="text-[11px] text-slate-500">Dibayarkan saat disahkan pengurus</p>
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
    </div>
  );
}
