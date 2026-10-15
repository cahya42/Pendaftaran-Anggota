import { DAFTAR_PEKERJAAN } from '../../data/applicants.js';

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-tjokro-green focus:ring-2 focus:ring-tjokro-green/20 text-sm transition outline-none';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1';

export default function Step1Identity({ form, setForm }) {
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-tjokro-mint text-tjokro-green flex items-center justify-center text-xs">
            <i className="fa-solid fa-user"></i>
          </span>
          Identitas Calon Anggota (Sesuai KTP)
        </h2>
        <p className="text-xs text-slate-500 mt-1">Data Anda tersimpan secara aman dan terenkripsi untuk keperluan legalitas koperasi.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Nomor Induk Kependudukan (NIK) <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <i className="fa-solid fa-id-card"></i>
            </span>
            <input
              type="text" maxLength={16} placeholder="Contoh: 321401..." value={form.nik}
              onChange={set('nik')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-tjokro-green focus:ring-2 focus:ring-tjokro-green/20 text-sm font-mono tracking-wider transition outline-none"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Wajib 16 digit tertera di e-KTP.</p>
        </div>
        <div>
          <label className={labelCls}>Nama Lengkap (Sesuai e-KTP) <span className="text-red-500">*</span></label>
          <input type="text" placeholder="Nama lengkap tanpa singkatan" value={form.nama} onChange={set('nama')} className={inputCls} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelCls}>Tempat Lahir <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: Purwakarta" value={form.tempatLahir} onChange={set('tempatLahir')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Tanggal Lahir <span className="text-red-500">*</span></label>
            <input type="date" value={form.tanggalLahir} onChange={set('tanggalLahir')} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelCls}>Jenis Kelamin <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              {['Laki-laki', 'Perempuan'].map((g) => (
                <label key={g} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                  <input
                    type="radio" name="jenis_kelamin" value={g} checked={form.gender === g}
                    onChange={set('gender')} className="text-tjokro-green focus:ring-tjokro-green"
                  />
                  <span className="text-xs font-semibold">{g}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Pekerjaan / Usaha <span className="text-red-500">*</span></label>
            <select value={form.pekerjaan} onChange={set('pekerjaan')} className={`${inputCls} bg-white`}>
              <option value="">Pilih Profesi</option>
              {DAFTAR_PEKERJAAN.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelCls}>Nomor WhatsApp Aktif <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-600 font-bold">
                <i className="fa-brands fa-whatsapp text-base"></i>
              </span>
              <input type="tel" placeholder="08xxxxxxxxxx" value={form.hp} onChange={set('hp')} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-tjokro-green focus:ring-2 focus:ring-tjokro-green/20 text-sm transition outline-none" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email <span className="text-slate-400 font-normal">(Opsional)</span></label>
            <input type="email" placeholder="nama@email.com" value={form.email} onChange={set('email')} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Alamat Domisili Lengkap (Purwakarta &amp; Sekitarnya) <span className="text-red-500">*</span></label>
          <textarea rows={2} placeholder="Nama Jalan, RT/RW, Dusun, Desa/Kelurahan, Kecamatan" value={form.alamat} onChange={set('alamat')} className={inputCls}></textarea>
        </div>
      </div>
    </div>
  );
}
