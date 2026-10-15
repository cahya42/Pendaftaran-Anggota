import SignaturePad from './SignaturePad.jsx';

export default function Step4Agreement({ form, setForm, canvasRef, hasSignature, setHasSignature }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-tjokro-mint text-tjokro-green flex items-center justify-center text-xs">
            <i className="fa-solid fa-signature"></i>
          </span>
          Persetujuan &amp; Tanda Tangan Digital
        </h2>
        <p className="text-xs text-slate-500 mt-1">Tahap akhir permohonan keanggotaan Koperasi HOS TJOKROAMINOTO.</p>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2 max-h-36 overflow-y-auto">
        <p className="font-bold text-tjokro-darkgreen">Pernyataan Komitmen Calon Anggota:</p>
        <ol className="list-decimal pl-4 space-y-1 text-[11px]">
          <li>Menyatakan bersedia menjadi anggota <strong>Koperasi Konsumen HOS TJOKROAMINOTO</strong> atas kemauan sendiri secara sadar.</li>
          <li>Tunduk dan taat pada Anggaran Dasar / Anggaran Rumah Tangga (AD/ART) serta keputusan Rapat Anggota Tahunan (RAT).</li>
          <li>Bersedia memenuhi kewajiban Simpanan Pokok dan Simpanan Wajib secara tertib.</li>
          <li>Menjunjung tinggi asas kekeluargaan dan gotong royong sesuai amanah kepemimpinan H.O.S. Tjokroaminoto.</li>
        </ol>
      </div>
      <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-tjokro-green/30 bg-tjokro-mint/50 cursor-pointer">
        <input
          type="checkbox" checked={form.agreed}
          onChange={(e) => setForm((p) => ({ ...p, agreed: e.target.checked }))}
          className="mt-0.5 w-4 h-4 text-tjokro-green rounded border-slate-300 focus:ring-tjokro-green"
        />
        <span className="text-xs font-semibold text-tjokro-darkgreen leading-relaxed">
          Saya telah membaca, memahami, dan menyetujui seluruh ketentuan AD/ART Koperasi di atas serta bertanggung jawab atas kebenaran data saya.
        </span>
      </label>
      <SignaturePad canvasRef={canvasRef} hasSignature={hasSignature} setHasSignature={setHasSignature} />
    </div>
  );
}
