import { useEffect, useState } from 'react';

export function DeleteConfirmDialog({ applicant, busy, onCancel, onConfirm }) {
  if (!applicant) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 text-center space-y-3">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            <i className="fa-solid fa-trash-can"></i>
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Hapus data pendaftar?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Data berikut akan dihapus <strong className="text-rose-600">permanen</strong> dari database dan
            tidak bisa dikembalikan:
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-left text-xs">
            <p className="font-bold text-slate-900">{applicant.nama}</p>
            <p className="font-mono text-slate-500">{applicant.id} • NIK: {applicant.nik}</p>
            <p className="text-slate-500 mt-0.5">Status: {applicant.status} • Bayar: {applicant.statusBayar || 'Belum'}</p>
          </div>
          {applicant.status === 'Disetujui' && (
            <p className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <i className="fa-solid fa-triangle-exclamation mr-1"></i>
              Perhatian: anggota ini sudah Disetujui (NIA: {applicant.nia}).
            </p>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onCancel} disabled={busy}
            className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-200 transition disabled:opacity-60"
          >
            Batal
          </button>
          <button
            onClick={onConfirm} disabled={busy}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-60"
          >
            <i className={`fa-solid ${busy ? 'fa-circle-notch fa-spin' : 'fa-trash-can'}`}></i>
            {busy ? 'Menghapus...' : 'Ya, Hapus Permanen'}
          </button>
        </div>
      </div>
    </div>
  );
}

const EDIT_FIELDS = [
  { key: 'nama', label: 'Nama Lengkap Sesuai KTP', type: 'text' },
  { key: 'nik', label: 'NIK (16 digit)', type: 'text' },
  { key: 'ttl', label: 'Tempat, Tanggal Lahir', type: 'text' },
  { key: 'gender', label: 'Jenis Kelamin', type: 'select', options: ['Laki-laki', 'Perempuan'] },
  { key: 'pekerjaan', label: 'Pekerjaan', type: 'text' },
  { key: 'hp', label: 'No. WhatsApp', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'alamat', label: 'Alamat Domisili', type: 'textarea' },
  { key: 'simpananWajib', label: 'Simpanan Wajib (Rp/bln)', type: 'number' },
  { key: 'simpananSukarela', label: 'Simpanan Sukarela (Rp)', type: 'number' },
  { key: 'metode', label: 'Metode Pembayaran', type: 'select', options: ['QRIS', 'Transfer Bank / Kasir'] },
];

export function EditApplicantDialog({ applicant, busy, onCancel, onSave }) {
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (applicant) {
      setDraft({
        nama: applicant.nama || '',
        nik: applicant.nik || '',
        ttl: applicant.ttl || '',
        gender: applicant.gender || 'Laki-laki',
        pekerjaan: applicant.pekerjaan || '',
        hp: applicant.hp || '',
        email: applicant.email === '-' ? '' : applicant.email || '',
        alamat: applicant.alamat || '',
        simpananWajib: applicant.simpananWajib || 10000,
        simpananSukarela: applicant.simpananSukarela || 0,
        metode: applicant.metode || 'QRIS',
      });
    } else {
      setDraft(null);
    }
  }, [applicant]);

  if (!applicant || !draft) return null;
  const set = (key, value) => setDraft((p) => ({ ...p, [key]: value }));
  const handleSave = () => {
    if (!String(draft.nama).trim()) return;
    if (String(draft.nik).length < 16) return;
    onSave({
      ...draft,
      nama: String(draft.nama).trim(),
      nik: String(draft.nik).trim(),
      email: String(draft.email).trim() || '-',
      simpananWajib: Number(draft.simpananWajib) || 0,
      simpananSukarela: Number(draft.simpananSukarela) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-mono font-bold text-tjokro-green bg-tjokro-mint px-2.5 py-0.5 rounded-md">{applicant.id}</span>
            <h3 className="font-extrabold text-base text-slate-900 mt-1">Perbaiki Data Pendaftar</h3>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto text-xs">
          {EDIT_FIELDS.map((f) => (
            <div key={f.key} className={f.key === 'alamat' ? 'sm:col-span-2' : ''}>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">{f.label}</label>
              {f.type === 'select' ? (
                <select value={draft[f.key]} onChange={(e) => set(f.key, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-tjokro-green font-semibold">
                  {f.options.map((o) => (<option key={o} value={o}>{o}</option>))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea value={draft[f.key]} rows={2} onChange={(e) => set(f.key, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-tjokro-green font-semibold" />
              ) : (
                <input type={f.type} value={draft[f.key]} onChange={(e) => set(f.key, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-tjokro-green font-semibold" />
              )}
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button onClick={onCancel} disabled={busy} className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-200 transition disabled:opacity-60">
            Batal
          </button>
          <button onClick={handleSave} disabled={busy} className="px-5 py-2 rounded-xl bg-tjokro-green hover:bg-tjokro-darkgreen text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-60">
            <i className={`fa-solid ${busy ? 'fa-circle-notch fa-spin' : 'fa-floppy-disk'}`}></i>
            {busy ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
