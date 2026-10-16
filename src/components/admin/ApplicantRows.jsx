import { waLink } from '../../utils/helpers.js';

export function badgeClass(status) {
  if (status === 'Disetujui') return 'bg-emerald-100 text-emerald-800';
  if (status === 'Ditolak') return 'bg-rose-100 text-rose-800';
  return 'bg-amber-100 text-amber-800';
}

export function ApplicantRows({ rows, onDetail, onQuickApprove }) {
  return (
    <tbody className="divide-y divide-slate-100">
      {rows.map((item) => (
        <tr key={item.id} className="hover:bg-slate-50 transition border-b border-slate-100">
          <td className="py-3 px-4 font-mono font-semibold text-slate-700">
            {item.id}
            <div className="text-[10px] text-slate-400 font-normal">{item.tanggalDaftar}</div>
          </td>
          <td className="py-3 px-4">
            <div className="font-bold text-slate-900">{item.nama}</div>
            <div className="text-[11px] text-slate-500 font-mono">NIK: {item.nik}</div>
          </td>
          <td className="py-3 px-4">
            <a href={waLink(item.hp)} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold inline-flex items-center gap-1">
              <i className="fa-brands fa-whatsapp text-emerald-600"></i> {item.hp}
            </a>
          </td>
          <td className="py-3 px-4 text-slate-600">{item.pekerjaan}</td>
          <td className="py-3 px-4">
            <span className="font-mono font-bold text-slate-800">Rp {(item.simpananPokok + item.simpananWajib + (item.simpananSukarela || 0)).toLocaleString('id-ID')}</span>
            <div className="text-[10px] text-slate-400">{item.metode}</div>
            <span className={`mt-0.5 inline-block px-1.5 py-px rounded text-[9px] font-black ${
              item.statusBayar === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
              Bayar: {item.statusBayar || 'Belum'}
            </span>
          </td>
          <td className="py-3 px-4">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeClass(item.status)}`}>{item.status}</span>
            <div className="font-mono text-[10px] text-tjokro-darkgreen font-bold mt-0.5">{item.nia}</div>
          </td>
          <td className="py-3 px-4 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <button onClick={() => onDetail(item.id)} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-[11px] flex items-center gap-1 transition">
                <i className="fa-regular fa-eye"></i> Detail
              </button>
              {item.status === 'Menunggu' && (
                <button onClick={() => onQuickApprove(item.id)} title="Setujui Cepat" className="w-7 h-7 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition flex items-center justify-center">
                  <i className="fa-solid fa-check"></i>
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
