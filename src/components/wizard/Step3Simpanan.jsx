import { useRef, useState, useEffect } from 'react';
import { PILIHAN_WAJIB, SIMPANAN_POKOK } from '../../data/applicants.js';
import { formatRupiah, readFileAsCompressedDataURL } from '../../utils/helpers.js';
import { fetchActiveBankAccounts } from '../../lib/bankAccountsService.js';
import { fetchQris } from '../../lib/qrisService.js';

export default function Step3Simpanan({ form, setForm }) {
  const sukarela = Number(form.simpananSukarela || 0);
  const total = SIMPANAN_POKOK + Number(form.simpananWajib || 0) + sukarela;
  const buktiRef = useRef(null);

  const setSukarela = (val) => {
    const n = val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0);
    setForm((p) => ({ ...p, simpananSukarela: n }));
  };

  const [bankAccounts, setBankAccounts] = useState([]);
  const [qrisList, setQrisList] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [zoomedQris, setZoomedQris] = useState(null);

  const downloadQris = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qris.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const [banks, qris] = await Promise.all([
          fetchActiveBankAccounts(),
          fetchQris(),
        ]);
        setBankAccounts(banks);
        setQrisList(qris);
      } catch (err) {
        console.error('[Step3] Gagal memuat opsi pembayaran:', err.message);
      } finally {
        setLoadingPayment(false);
      }
    };
    loadPaymentOptions();
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-amber-50 text-tjokro-gold flex items-center justify-center text-xs">
            <i className="fa-solid fa-coins"></i>
          </span>
          Simpanan Anggota Koperasi
        </h2>
        <p className="text-xs text-slate-500 mt-1">Sesuai AD/ART Koperasi Konsumen HOS TJOKROAMINOTO PURWAKARTA ISTIMEWA, anggota memiliki modal bersama.</p>
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

      {/* Daftar Rekening Bank & QRIS */}
      {loadingPayment ? (
        <div className="text-center py-4 text-xs text-slate-400">
          <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> Memuat opsi pembayaran...
        </div>
      ) : (
        <div className="space-y-3">
          {form.metode === 'QRIS' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Scan QRIS Koperasi</label>
              {qrisList.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">
                  Belum ada QRIS. Hubungi pengurus.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {qrisList.map((q) => (
                    <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center group relative">
                      <div className="relative mb-2">
                        <img
                          src={q.qr_image_url}
                          alt={q.label}
                          className="w-32 h-32 object-contain rounded-lg border border-slate-200 cursor-pointer"
                          onClick={() => setZoomedQris(q.qr_image_url)}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadQris(q.qr_image_url);
                          }}
                          className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-white border rounded-lg text-slate-600 hover:text-tjokro-green text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                          title="Download"
                        >
                          <i className="fa-solid fa-download"></i>
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{q.label || 'QRIS Koperasi'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {form.metode === 'Transfer Bank / Kasir' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Pilih Rekening Koperasi</label>
              {bankAccounts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">
                  Belum ada rekening bank. Hubungi pengurus.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bankAccounts.map((acc) => (
                    <div key={acc.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-tjokro-darkgreen">{acc.bank}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mb-1">No. Rekening</div>
                      <div className="font-mono font-bold text-slate-800 text-sm mb-1">{acc.nomor_rekening}</div>
                      <div className="text-[11px] text-slate-500">a/n</div>
                      <div className="font-semibold text-slate-700 text-xs">{acc.nama_pemilik || '-'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
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
              const dataUrl = await readFileAsCompressedDataURL(f);
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

    {zoomedQris && (
      <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setZoomedQris(null)}>
        <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setZoomedQris(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="p-6 flex flex-col items-center gap-4">
            <img src={zoomedQris} alt="QRIS" className="max-h-80 max-w-[300px] object-contain rounded-xl border border-slate-200" />
            <button
              onClick={(e) => { e.stopPropagation(); downloadQris(zoomedQris); }}
              className="px-4 py-2 rounded-xl bg-tjokro-green hover:bg-tjokro-darkgreen text-white font-bold text-xs transition flex items-center gap-2"
            >
              <i className="fa-solid fa-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    )}
  );
}
