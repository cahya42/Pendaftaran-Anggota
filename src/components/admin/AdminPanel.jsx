import { useState } from 'react';
import QrStandee from './QrStandee.jsx';
import ApplicantModal from './ApplicantModal.jsx';
import StatCard from './AdminStats.jsx';
import AdminToolbar from './AdminToolbar.jsx';
import { ApplicantRows } from './ApplicantRows.jsx';
import { exportApplicantsToCSV, generateNia } from '../../utils/helpers.js';

const HEADERS = ['No. Registrasi', 'Calon Anggota', 'Kontak WhatsApp', 'Pekerjaan', 'Komitmen Setoran', 'Status & NIA', 'Aksi'];

export default function AdminPanel({ applicants, setApplicants, notify, onPreviewHp }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [detailId, setDetailId] = useState(null);
  const [eventTag, setEventTag] = useState('EVENT-PURWAKARTA-ISTIMEWA');
  const [officer, setOfficer] = useState('Pengurus Koperasi HOS TJOKRO');

  const count = (s) => applicants.filter((a) => a.status === s).length;
  const q = search.toLowerCase();
  const rows = applicants.filter((a) => {
    const mq = a.nama.toLowerCase().includes(q) || a.nik.includes(q) || a.id.toLowerCase().includes(q);
    return mq && (filter === 'ALL' || a.status === filter);
  });

  const changeStatus = (id, status) => {
    setApplicants((prev) => prev.map((a) => (a.id !== id ? a : { ...a, status, nia: status === 'Disetujui' && a.nia === '-' ? generateNia() : a.nia })));
    setDetailId(null);
    notify(status === 'Disetujui' ? 'Pendaftar disetujui & NIA diterbitkan!' : `Status diubah menjadi ${status}`, status === 'Disetujui' ? 'success' : 'info');
  };

  const onExport = () => {
    if (!applicants.length) { notify('Tidak ada data untuk diekspor', 'error'); return; }
    exportApplicantsToCSV(applicants);
    notify('File CSV berhasil diunduh!', 'success');
  };

  return (
    <section className="space-y-7">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Rekrutmen" value={applicants.length} icon="fa-solid fa-users" box="bg-tjokro-mint text-tjokro-green" text="text-slate-400" />
        <StatCard label="Menunggu Verifikasi" value={count('Menunggu')} icon="fa-solid fa-clock-rotate-left" box="bg-amber-50 text-tjokro-gold" text="text-amber-600" />
        <StatCard label="Disetujui (Ber-NIA)" value={count('Disetujui')} icon="fa-solid fa-id-card" box="bg-emerald-50 text-emerald-600" text="text-emerald-600" />
        <StatCard label="Perlu Perbaikan" value={count('Ditolak')} icon="fa-solid fa-circle-exclamation" box="bg-rose-50 text-rose-600" text="text-rose-600" />
      </div>
      <QrStandee eventTag={eventTag} setEventTag={setEventTag} officer={officer} setOfficer={setOfficer} onPreviewHp={onPreviewHp} notify={notify} />
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <AdminToolbar search={search} setSearch={setSearch} statusFilter={filter} setStatusFilter={setFilter} onExport={onExport} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200 text-[11px]">
              <tr>{HEADERS.map((h) => (<th key={h} className="py-3.5 px-4">{h}</th>))}</tr>
            </thead>
            <ApplicantRows rows={rows} onDetail={setDetailId} onQuickApprove={(id) => changeStatus(id, 'Disetujui')} />
          </table>
        </div>
        {rows.length === 0 && (<div className="p-8 text-center text-slate-400 text-xs"><i className="fa-regular fa-folder-open text-2xl mb-1 block"></i>Tidak ditemukan data pendaftar.</div>)}
      </div>
      <ApplicantModal applicant={applicants.find((a) => a.id === detailId) || null} onClose={() => setDetailId(null)} onChangeStatus={changeStatus} />
    </section>
  );
}
