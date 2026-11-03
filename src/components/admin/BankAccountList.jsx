import { useState } from 'react';

export default function BankAccountList({ accounts, loading, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-university text-tjokro-green"></i> Rekening Bank
        </h4>
      </div>

      {loading ? (
        <p className="text-xs text-slate-500 text-center py-4">Memuat rekening bank...</p>
      ) : accounts.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">Belum ada rekening bank.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Bank</th>
                <th className="py-3 px-4">No. Rekening</th>
                <th className="py-3 px-4">Pemilik</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-semibold text-slate-900">{acc.bank}</td>
                  <td className="py-3 px-4 font-mono text-slate-800">{acc.nomor_rekening}</td>
                  <td className="py-3 px-4 text-slate-600">{acc.nama_pemilik || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => onEdit(acc)} className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-[11px] flex items-center gap-1 transition">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button onClick={() => onDelete(acc.id)} className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-[11px] flex items-center gap-1 transition">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
