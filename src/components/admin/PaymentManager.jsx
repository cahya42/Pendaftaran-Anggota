import { useState } from 'react';
import BankAccountManager from './BankAccountManager.jsx';
import QrisUploader from './QrisUploader.jsx';

export default function PaymentManager({ notify }) {
  const [tab, setTab] = useState('bank');

  return (
    <section className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-money-bill-transfer text-tjokro-green"></i> Manajemen Pembayaran
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Kelola rekening bank dan QRIS pembayaran.</p>
        </div>

        <div className="px-5 sm:px-6 pt-5 pb-2">
          <div className="flex gap-4 border-b border-slate-200">
            <button
              onClick={() => setTab('bank')}
              className={`pb-2 px-2 text-sm font-bold transition ${tab === 'bank' ? 'text-tjokro-green border-b-2 border-tjokro-green' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-university mr-1"></i> Rekening Bank
            </button>
            <button
              onClick={() => setTab('qris')}
              className={`pb-2 px-2 text-sm font-bold transition ${tab === 'qris' ? 'text-tjokro-green border-b-2 border-tjokro-green' : 'text-slate-500'}`}
            >
              <i className="fa-solid fa-qrcode mr-1"></i> QRIS
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {tab === 'bank' ? <BankAccountManager notify={notify} /> : <QrisUploader notify={notify} />}
        </div>
      </div>
    </section>
  );
}
