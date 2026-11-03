import { useState, useEffect } from 'react';

export default function BankAccountForm({ mode, initialData, onCancel, onSave, busy, notify }) {
  const [form, setForm] = useState({ bank: '', nomor_rekening: '', nama_pemilik: '', is_active: true });

  useEffect(() => {
    if (initialData) {
      setForm({
        bank: initialData.bank || '',
        nomor_rekening: initialData.nomor_rekening || '',
        nama_pemilik: initialData.nama_pemilik || '',
        is_active: initialData.is_active ?? true,
      });
    } else {
      setForm({ bank: '', nomor_rekening: '', nama_pemilik: '', is_active: true });
    }
  }, [initialData, mode]);

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSave = () => {
    if (!form.bank.trim()) { notify('Nama bank wajib diisi', 'error'); return; }
    if (!form.nomor_rekening.trim()) { notify('Nomor rekening wajib diisi', 'error'); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-mono font-bold text-tjokro-green bg-tjokro-mint px-2.5 py-0.5 rounded-md">{mode}</span>
            <h3 className="font-extrabold text-base text-slate-900 mt-1">{mode === 'edit' ? 'Perbarui Rekening Bank' : 'Tambah Rekening Bank'}</h3>
          </div>
          <button onClick={onCancel} disabled={busy} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Bank</label>
            <input type="text" value={form.bank} onChange={(e) => set(e, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-tjokro-green font-semibold" placeholder="Contoh: BCA" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Nomor Rekening</label>
            <input type="text" value={form.nomor_rekening} onChange={(e) => set(e, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-tjokro-green font-semibold" placeholder="1234567890" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Pemilik</label>
            <input type="text" value={form.nama_pemilik} onChange={(e) => set(e, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-tjokro-green font-semibold" placeholder="Nama pemilik rekening" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={onCancel} disabled={busy} className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-200 transition disabled:opacity-60">Batal</button>
            <button onClick={handleSave} disabled={busy} className="px-5 py-2 rounded-xl bg-tjokro-green hover:bg-tjokro-darkgreen text-white font-bold text-xs transition disabled:opacity-60 flex items-center gap-1.5">
              <i className={`fa-solid ${busy ? 'fa-circle-notch fa-spin' : 'fa-floppy-disk'}`}></i>
              {busy ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
