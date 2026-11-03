import { useState, useEffect } from 'react';
import { fetchQris, insertQris, deleteQris } from '../../lib/qrisService.js';
import { readFileAsCompressedDataURL } from '../../utils/helpers.js';

export default function QrisUploader({ notify }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    loadQris();
  }, []);

  const loadQris = async () => {
    setLoading(true);
    try {
      const data = await fetchQris();
      setList(data);
    } catch (err) {
      console.error('[qris] load gagal:', err.message);
      notify('Gagal memuat QRIS: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const dataUrl = await readFileAsCompressedDataURL(f, 500, 0.8);
      setPreview(dataUrl);
      setFile(f);
      setLabel(f.name.split('.')[0].replace(/[^a-zA-Z0-9]+/g, '_') || 'QRIS');
    } catch (err) {
      notify('Gagal membaca file: ' + err.message, 'error');
    }
  };

  const upload = async () => {
    if (!file) { notify('Pilih file QRIS terlebih dahulu', 'error'); return; }
    if (!label.trim()) { notify('Label QRIS wajib diisi', 'error'); return; }
    setBusy(true);
    try {
      const saved = await insertQris({ qr_image_url: preview, label: label.trim() });
      setList(prev => [saved, ...prev]);
      setFile(null);
      setPreview(null);
      setLabel('');
      notify('QRIS berhasil diunggah', 'success');
    } catch (err) {
      console.error('[qris] upload error:', err.message);
      notify(err.message || 'Gagal mengunggah QRIS', 'error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Hapus QRIS ini?')) return;
    setBusy(true);
    try {
      await deleteQris(id);
      setList(prev => prev.filter(q => q.id !== id));
      notify('QRIS dihapus', 'success');
    } catch (err) {
      console.error('[qris] delete error:', err.message);
      notify(err.message || 'Gagal menghapus QRIS', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-qrcode text-tjokro-green"></i> Upload QRIS
        </h4>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-tjokro-green hover:bg-slate-50 transition">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" id="qr-upload" />
        <label htmlFor="qr-upload" className="cursor-pointer">
          {preview ? (
            <div className="space-y-2">
              <img src={preview} alt="QRIS preview" className="max-h-28 mx-auto rounded-xl border border-slate-200" />
              <p className="text-[11px] text-slate-500 font-mono truncate">{file?.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              <i className="fa-solid fa-cloud-upload-alt text-3xl text-slate-400 mb-2"></i>
              <p className="text-sm font-bold text-slate-600">Klik untuk upload gambar QRIS</p>
              <p className="text-[11px] text-slate-400">PNG, JPG (maks 200 KB)</p>
            </div>
          )}
        </label>
      </div>

      {preview && (
        <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-4 mb-4">
          <img src={preview} alt="QRIS preview" className="w-16 h-16 object-contain rounded-xl border border-slate-200" />
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Label QRIS</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-tjokro-green font-semibold text-xs" placeholder="QRIS - Koperasi HOS" />
          </div>
          <div className="flex gap-2">
            <button onClick={upload} disabled={!file || busy} className="px-3 py-2 rounded-xl bg-tjokro-green hover:bg-tjokro-darkgreen text-white text-xs font-bold transition disabled:opacity-60 flex items-center gap-1.5">
              <i className={`fa-solid ${busy ? 'fa-circle-notch fa-spin' : 'fa-upload'}`}></i>
              {busy ? 'Upload...' : 'Upload'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-slate-500 text-center py-4">Memuat QRIS...</p>
      ) : list.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">Belum ada QRIS yang diunggah.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((q) => (
            <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <img src={q.qr_image_url} alt={q.label} className="w-14 h-14 object-contain rounded-xl border border-slate-200" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{q.label || 'QRIS'}</p>
                <p className="text-[11px] text-slate-500 truncate">{q.qr_image_url ? 'Terupload' : 'Tidak ada gambar'}</p>
              </div>
              <button onClick={() => remove(q.id)} className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-[11px] flex items-center gap-1 transition">
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
