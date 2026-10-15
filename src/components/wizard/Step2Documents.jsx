import { useRef } from 'react';
import { readFileAsDataURL } from '../../utils/helpers.js';

function UploadBox({ label, hint, note, noteIcon, preview, accentBox, onFile }) {
  const inputRef = useRef(null);
  const handleChange = async (e) => {
    const f = e.target.files?.[0];
    if (f) onFile(await readFileAsDataURL(f));
  };
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label} <span className="text-red-500">*</span></label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-tjokro-green bg-slate-50/60 min-h-[190px] flex flex-col items-center justify-center relative overflow-hidden transition group cursor-pointer"
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
        {!preview ? (
          <div className="flex flex-col items-center pointer-events-none">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 text-xl group-hover:scale-110 transition ${accentBox}`}>
              <i className={noteIcon}></i>
            </div>
            <p className="text-xs font-bold text-slate-700">{hint}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{note}</p>
          </div>
        ) : (
          <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
        )}
      </div>
      <p className="text-[11px] text-slate-400"><i className={`mr-1 ${noteIcon}`}></i>{note}</p>
    </div>
  );
}

export default function Step2Documents({ form, setForm }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-tjokro-mint text-tjokro-green flex items-center justify-center text-xs">
            <i className="fa-solid fa-camera"></i>
          </span>
          Unggah Dokumen Verifikasi
        </h2>
        <p className="text-xs text-slate-500 mt-1">Dapat difoto langsung dengan kamera ponsel pintar Anda atau diunggah dari galeri.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <UploadBox
          label="Foto e-KTP Asli"
          hint="Sentuh untuk foto/ambil KTP"
          note="Format JPG/PNG, teks terbaca jelas"
          noteIcon="fa-regular fa-address-card"
          accentBox="bg-tjokro-mint text-tjokro-green"
          preview={form.ktpPreview}
          onFile={(url) => setForm((p) => ({ ...p, ktpPreview: url }))}
        />
        <UploadBox
          label="Pasfoto / Swafoto Wajah"
          hint="Sentuh untuk selfie / pasfoto"
          note="Wajah menghadap lurus ke depan"
          noteIcon="fa-solid fa-camera-rotate"
          accentBox="bg-amber-50 text-tjokro-gold"
          preview={form.selfiePreview}
          onFile={(url) => setForm((p) => ({ ...p, selfiePreview: url }))}
        />
      </div>
    </div>
  );
}
