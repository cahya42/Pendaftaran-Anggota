import { formatRupiah } from '../../utils/helpers.js';

export default function ApplicantModal({ applicant, onClose, onChangeStatus, onPrintDetail }) {
  if (!applicant) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-mono font-bold text-tjokro-green bg-tjokro-mint px-2.5 py-0.5 rounded-md">{applicant.id}</span>
            <h3 className="font-extrabold text-base text-slate-900 mt-1">Verifikasi Calon Anggota Koperasi</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div><span className="text-slate-400 uppercase text-[10px] font-bold">Nama Lengkap</span><p className="font-bold text-slate-900 text-sm">{applicant.nama}</p></div>
            <div><span className="text-slate-400 uppercase text-[10px] font-bold">NIK e-KTP</span><p className="font-mono font-semibold text-slate-800">{applicant.nik}</p></div>
            <div><span className="text-slate-400 uppercase text-[10px] font-bold">Jenis Kelamin</span><p className="font-semibold text-slate-800">{applicant.gender}</p></div>
            <div><span className="text-slate-400 uppercase text-[10px] font-bold">TTL</span><p className="font-semibold text-slate-800">{applicant.ttl}</p></div>
            <div><span className="text-slate-400 uppercase text-[10px] font-bold">WhatsApp</span><p className="font-semibold text-emerald-700">{applicant.hp}</p></div>
            <div><span className="text-slate-400 uppercase text-[10px] font-bold">Pekerjaan</span><p className="font-semibold text-slate-800">{applicant.pekerjaan}</p></div>
            <div className="col-span-2 sm:col-span-3"><span className="text-slate-400 uppercase text-[10px] font-bold">Alamat Domisili</span><p className="font-semibold text-slate-800">{applicant.alamat}</p></div>
          </div>
          <div className="bg-tjokro-mint/60 border border-tjokro-green/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-tjokro-darkgreen uppercase font-bold">Komitmen Setoran Awal</span>
              <p className="text-slate-600 text-xs mt-0.5">Pokok: {formatRupiah(applicant.simpananPokok)} + Wajib: <span className="font-bold font-mono">{formatRupiah(applicant.simpananWajib)}</span></p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase">Metode Rencana:</span>
              <p className="font-bold text-tjokro-darkgreen text-xs">{applicant.metode}</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Lampiran Berkas &amp; Tanda Tangan:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-2xl p-3 text-center bg-slate-50">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Foto KTP</span>
                <img src={applicant.ktpUrl} alt="KTP" className="max-h-36 mx-auto rounded-xl object-contain border border-slate-200 shadow-sm bg-white" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-3 text-center bg-slate-50">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tanda Tangan Digital</span>
                <img src={applicant.ttdUrl} alt="TTD" className="max-h-36 mx-auto rounded-xl object-contain border border-slate-200 shadow-sm bg-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 flex-wrap">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-200 transition">Tutup</button>
          <button type="button" onClick={() => onPrintDetail(applicant)} className="cursor-pointer px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5">
            <i className="fa-solid fa-print text-tjokro-accentgold"></i> Cetak Formulir
          </button>
          {applicant.status !== 'Disetujui' && (
            <button onClick={() => onChangeStatus(applicant.id, 'Disetujui')} className="px-5 py-2 rounded-xl bg-tjokro-green hover:bg-tjokro-darkgreen text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-tjokro-green/20">
              <i className="fa-solid fa-check text-tjokro-accentgold"></i> Setujui &amp; Terbitkan NIA
            </button>
          )}
          {applicant.status !== 'Ditolak' && (
            <button onClick={() => onChangeStatus(applicant.id, 'Ditolak')} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center gap-1.5">
              <i className="fa-solid fa-xmark"></i> Tolak / Berkas Kurang
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
