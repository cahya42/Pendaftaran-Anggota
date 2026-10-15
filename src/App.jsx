import { useState } from 'react';
import Header from './components/Header.jsx';
import Toast from './components/Toast.jsx';
import MemberView from './components/wizard/MemberView.jsx';
import AdminPanel from './components/admin/AdminPanel.jsx';
import { INITIAL_APPLICANTS } from './data/applicants.js';

export default function App() {
  const [view, setView] = useState('member');
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  };

  const addApplicant = (member) => {
    setApplicants((prev) => [member, ...prev]);
  };

  return (
    <div className="bg-slate-100 text-slate-800 font-sans min-h-screen antialiased flex flex-col selection:bg-tjokro-green selection:text-white">
      <Header view={view} onSwitch={setView} />
      <div className="bg-tjokro-mint border-b border-tjokro-green/10 px-4 py-2 sm:hidden text-center text-[11px] font-semibold text-tjokro-darkgreen">
        <i className="fa-solid fa-bullhorn text-tjokro-gold mr-1.5"></i> &quot;Bersama Membangun, Sejahtera Bersama&quot;
      </div>
      <main className="flex-1 py-6 sm:py-9 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {view === 'member' ? (
          <MemberView onAddApplicant={addApplicant} notify={notify} />
        ) : (
          <AdminPanel
            applicants={applicants}
            setApplicants={setApplicants}
            notify={notify}
            onPreviewHp={() => {
              setView('member');
              notify('Simulasi: Halaman formulir terbuka otomatis di HP calon anggota!', 'info');
            }}
          />
        )}
      </main>
      <Toast toast={toast} />
    </div>
  );
}
