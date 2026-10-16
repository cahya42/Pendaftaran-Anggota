import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Toast from './components/Toast.jsx';
import MemberView from './components/wizard/MemberView.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import { INITIAL_APPLICANTS } from './data/applicants.js';
import { fetchApplicants, insertApplicant, updateApplicantStatus, updatePaymentStatus } from './lib/applicantsService.js';
import { generateNia } from './utils/helpers.js';

const SUPABASE_READY = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function App() {
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    const params = new URLSearchParams(window.location.search);
    if (params.get('daftar') === '1' || params.get('view') === 'member') return 'member';
    if (params.get('admin') === '1' || params.get('view') === 'admin') return 'admin';
    return 'home';
  });
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [loading, setLoading] = useState(SUPABASE_READY);
  const [dbOnline, setDbOnline] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (!SUPABASE_READY) return;
    fetchApplicants()
      .then((rows) => {
        if (rows.length > 0) setApplicants(rows);
        setDbOnline(true);
      })
      .catch((err) => {
        console.error('[supabase] fetch gagal:', err.message);
        notify('Database Supabase belum siap / tabel belum dibuat. Memakai data contoh lokal.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const addApplicant = async (member) => {
    setApplicants((prev) => [member, ...prev]);
    if (!dbOnline) return member;
    try {
      const saved = await insertApplicant(member);
      setApplicants((prev) => prev.map((a) => (a.id === member.id ? saved : a)));
      return saved;
    } catch (err) {
      console.error('[supabase] insert gagal:', err.message);
      notify('Gagal menyimpan ke Supabase: ' + err.message, 'error');
      return member;
    }
  };

  const changeStatus = async (id, status) => {
    const target = applicants.find((a) => a.id === id);
    const nia = status === 'Disetujui' && target && (target.nia === '-' || !target.nia) ? generateNia() : target?.nia;
    setApplicants((prev) => prev.map((a) => (a.id !== id ? a : { ...a, status, nia: nia || a.nia })));
    if (!dbOnline) {
      notify(status === 'Disetujui' ? `Pendaftar disetujui! NIA: ${nia}` : `Status diubah menjadi ${status}`, status === 'Disetujui' ? 'success' : 'info');
      return;
    }
    try {
      await updateApplicantStatus(id, status, status === 'Disetujui' ? nia : null);
      notify(status === 'Disetujui' ? `Pendaftar disetujui! NIA: ${nia}` : `Status diubah menjadi ${status}`, status === 'Disetujui' ? 'success' : 'info');
    } catch (err) {
      console.error('[supabase] update gagal:', err.message);
      notify('Gagal menyimpan status ke Supabase: ' + err.message, 'error');
      return;
    }
  };

  const changePaymentStatus = async (id, statusBayar) => {
    setApplicants((prev) => prev.map((a) => (a.id !== id ? a : { ...a, statusBayar })));
    notify(`Pembayaran ${id} ditandai: ${statusBayar === 'Lunas' ? 'LUNAS ✓' : 'Belum Lunas'}`, statusBayar === 'Lunas' ? 'success' : 'info');
    if (!dbOnline) return;
    try {
      await updatePaymentStatus(id, statusBayar);
    } catch (err) {
      console.error('[supabase] update status bayar gagal:', err.message);
      notify('Gagal menyimpan status pembayaran ke Supabase: ' + err.message, 'error');
    }
  };

  return (
    <div className="bg-slate-100 text-slate-800 font-sans min-h-screen antialiased flex flex-col selection:bg-tjokro-green selection:text-white">
      <Header view={view} onSwitch={setView} />
      <div className="bg-tjokro-mint border-b border-tjokro-green/10 px-4 py-2 sm:hidden text-center text-[11px] font-semibold text-tjokro-darkgreen">
        <i className="fa-solid fa-bullhorn text-tjokro-gold mr-1.5"></i> &quot;Bersama Membangun, Sejahtera Bersama&quot;
      </div>
      {!SUPABASE_READY && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-[11px] font-semibold text-amber-800">
          <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
          Mode lokal: .env Supabase belum terdeteksi. Data hanya tersimpan di memori browser.
        </div>
      )}
      {SUPABASE_READY && !dbOnline && !loading && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-center text-[11px] font-semibold text-rose-700">
          <i className="fa-solid fa-database mr-1.5"></i>
          Supabase tidak terhubung (cek tabel <code>applicants</code> + RLS policy). Menampilkan data contoh lokal.
        </div>
      )}
      <main className="flex-1 py-6 sm:py-9 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-200 text-sm text-slate-500">
            <i className="fa-solid fa-circle-notch fa-spin text-tjokro-green text-2xl mb-3"></i>
            <p className="font-semibold">Menghubungkan ke database Supabase...</p>
          </div>
        ) : view === 'admin' ? (
          <AdminPanel
            applicants={applicants}
            onChangeStatus={changeStatus}
            onChangePaymentStatus={changePaymentStatus}
            notify={notify}
            onPreviewHp={() => {
              setView('member');
              notify('Simulasi: Halaman formulir terbuka otomatis di HP calon anggota!', 'info');
            }}
          />
        ) : (
          <MemberView onAddApplicant={addApplicant} notify={notify} />
        )}
      </main>
      <Toast toast={toast} />
    </div>
  );
}
