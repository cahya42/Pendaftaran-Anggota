import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Toast from './components/Toast.jsx';
import MemberView from './components/wizard/MemberView.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import { INITIAL_APPLICANTS } from './data/applicants.js';
import { fetchApplicants, insertApplicant, updateApplicantStatus, updatePaymentStatus, deleteApplicant, updateApplicant } from './lib/applicantsService.js';
import { generateNia } from './utils/helpers.js';

const SUPABASE_READY = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function App() {
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'admin';
    const path = window.location.pathname;
    if (path === '/daftar' || path.endsWith('/daftar')) return 'member';
    return 'admin';
  });
  const [applicants, setApplicants] = useState(SUPABASE_READY ? [] : INITIAL_APPLICANTS);
  const [loading, setLoading] = useState(SUPABASE_READY);
  const [dbOnline, setDbOnline] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  useEffect(() => {
    if (!SUPABASE_READY) {
      setLoading(false);
      return;
    }
    fetchApplicants()
      .then((rows) => {
        // Koneksi OK -> tandai online walau tabel masih kosong,
        // dan pakai data DB apa adanya (jangan campur data contoh).
        setApplicants(rows);
        setDbOnline(true);
      })
      .catch((err) => {
        console.error('[supabase] fetch gagal:', err.message);
        notify('Database Supabase belum siap / tabel belum dibuat. Memakai data contoh lokal.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const addApplicant = async (member) => {
    // Mode lokal (tanpa .env): simpan di memori saja.
    if (!SUPABASE_READY) {
      setApplicants((prev) => [member, ...prev]);
      return member;
    }
    // Mode Supabase: insert DULU, baru tampilkan. Jangan optimistic-update
    // sebelum insert sukses — itu yang bikin "kelihatan berhasil" padahal gagal.
    try {
      const saved = await insertApplicant(member);
      const finalRow = saved || member;
      setApplicants((prev) => [finalRow, ...prev]);
      setDbOnline(true);
      return finalRow;
    } catch (err) {
      console.error('[supabase] insert gagal:', err.message);
      // Lempar ke form agar SuccessCard TIDAK tampil saat gagal.
      throw err;
    }
  };

  const changeStatus = async (id, status) => {
    const target = applicants.find((a) => a.id === id);
    const needNia = status === 'Disetujui' && target && (target.nia === '-' || !target.nia);
    // NIA = HC-PWK-YYXXXX (tahun+urutan digabung), pertama 0001; celah bekas hapus dipakai ulang.
    const nia = needNia ? generateNia(applicants) : target?.nia;
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

  const removeApplicant = async (id) => {
    const target = applicants.find((a) => a.id === id);
    // Hapus dari layar dulu agar responsif, simpan cadangan untuk rollback.
    setApplicants((prev) => prev.filter((a) => a.id !== id));
    if (!dbOnline) {
      notify(`Data ${target?.nama || id} dihapus dari daftar lokal.`, 'info');
      return true;
    }
    try {
      await deleteApplicant(id);
      notify(`Data ${target?.nama || id} dihapus permanen dari database.`, 'success');
      return true;
    } catch (err) {
      console.error('[supabase] delete gagal:', err.message);
      // Rollback: kembalikan data ke layar karena DB menolak hapus
      // (umumnya karena RLS belum mengizinkan DELETE).
      if (target) setApplicants((prev) => [target, ...prev]);
      notify('Gagal menghapus di Supabase: ' + err.message + ' — kemungkinan policy DELETE belum ada. Jalankan SQL delete-policy di supabase-applicants.sql.', 'error');
      return false;
    }
  };

  const editApplicant = async (id, patch) => {
    const target = applicants.find((a) => a.id === id);
    if (!target) return false;
    const merged = { ...target, ...patch };
    setApplicants((prev) => prev.map((a) => (a.id === id ? merged : a)));
    if (!dbOnline) {
      notify(`Data ${target.nama} diperbarui (lokal).`, 'success');
      return true;
    }
    try {
      const saved = await updateApplicant(id, patch);
      if (saved) setApplicants((prev) => prev.map((a) => (a.id === id ? saved : a)));
      notify(`Data ${merged.nama} berhasil diperbarui.`, 'success');
      return true;
    } catch (err) {
      console.error('[supabase] edit gagal:', err.message);
      setApplicants((prev) => prev.map((a) => (a.id === id ? target : a)));
      notify('Gagal menyimpan perubahan: ' + err.message, 'error');
      return false;
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
            onDeleteApplicant={removeApplicant}
            onEditApplicant={editApplicant}
            notify={notify}
            onPreviewHp={() => {
              window.location.href = '/daftar';
              notify('Membuka halaman pendaftaran anggota...', 'info');
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
