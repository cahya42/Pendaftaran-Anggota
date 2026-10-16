import { useRef, useState } from 'react';
import QrStandee from './QrStandee.jsx';
import ApplicantModal from './ApplicantModal.jsx';
import StatCard from './AdminStats.jsx';
import AdminToolbar from './AdminToolbar.jsx';
import { ApplicantRows } from './ApplicantRows.jsx';
import { PrintApplicantList, PrintApplicantDetail } from './PrintSheets.jsx';
import { exportApplicantsToCSV } from '../../utils/helpers.js';

const HEADERS = ['No. Registrasi', 'Calon Anggota', 'Kontak WhatsApp', 'Pekerjaan', 'Komitmen Setoran', 'Status & NIA', 'Aksi'];

// Set mode cetak di <body> lalu panggil dialog print browser
function doPrint(mode) {
  document.body.classList.remove('print-mode-qr', 'print-mode-list', 'print-mode-detail');
  document.body.classList.add(`print-mode-${mode}`);
  const cleanup = () => {
    document.body.classList.remove(`print-mode-${mode}`);
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  window.print();
}

export default function AdminPanel({ applicants, onChangeStatus, onChangePaymentStatus, notify, onPreviewHp }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [detailId, setDetailId] = useState(null);
  const [eventTag, setEventTag] = useState('EVENT-PURWAKARTA-ISTIMEWA');
  const [officer, setOfficer] = useState('Pengurus Koperasi HOS TJOKRO');
  const [printDetailData, setPrintDetailData] = useState(null);
  const printListRef = useRef(null);
  const printDetailRef = useRef(null);

  const count = (s) => applicants.filter((a) => a.status === s).length;
  const q = search.toLowerCase();
  const rows = applicants.filter((a) => {
    const mq = a.nama.toLowerCase().includes(q) || a.nik.includes(q) || a.id.toLowerCase().includes(q);
    return mq && (filter === 'ALL' || a.status === filter);
  });

  const changeStatus = (id, status) => {
    setDetailId(null);
    onChangeStatus(id, status);
  };

  const onExport = () => {
    if (!applicants.length) { notify('Tidak ada data untuk diekspor', 'error'); return; }
    exportApplicantsToCSV(applicants);
    notify('File CSV berhasil diunduh!', 'success');
  };

  const onPrintList = () => {
    if (!rows.length) { notify('Tidak ada data pendaftar untuk dicetak', 'error'); return; }
    doPrint('list');
  };

  const onPrintDetail = (applicant) => {
    setPrintDetailData(applicant);
    // beri React satu frame untuk merender lembar cetak sebelum dialog print
    requestAnimationFrame(() => doPrint('detail'));
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
        <AdminToolbar search={search} setSearch={setSearch} statusFilter={filter} setStatusFilter={setFilter} onExport={onExport} onPrintList={onPrintList} />
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
      <ApplicantModal applicant={applicants.find((a) => a.id === detailId) || null} onClose={() => setDetailId(null)} onChangeStatus={changeStatus} onPrintDetail={onPrintDetail} onChangePaymentStatus={onChangePaymentStatus} />

      {/* Lembar tersembunyi — hanya muncul saat Ctrl+P / tombol cetak */}
      <PrintApplicantList rows={rows} statusFilter={filter} search={search} printRef={printListRef} />
      <PrintApplicantDetail applicant={printDetailData} printRef={printDetailRef} />
    </section>
  );
}
