import { useState, useEffect } from 'react';
import { fetchActiveBankAccounts, insertBankAccount, updateBankAccount, deleteBankAccount } from '../../lib/bankAccountsService.js';
import BankAccountList from './BankAccountList.jsx';
import BankAccountForm from './BankAccountForm.jsx';

export default function BankAccountManager({ notify }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ bank: '', nomor_rekening: '', nama_pemilik: '', is_active: true });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const list = await fetchActiveBankAccounts();
      setAccounts(list);
    } catch (err) {
      console.error('[bank accounts] load gagal:', err.message);
      const hint = err.message?.includes('does not exist') || err.message?.includes('relation')
        ? ' — Tabel bank_accounts belum dibuat. Jalankan migration-bank-qris.sql di Supabase SQL Editor.'
        : '';
      notify('Gagal memuat rekening bank: ' + err.message + hint, 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ bank: '', nomor_rekening: '', nama_pemilik: '', is_active: true });
    setShowForm(true);
  };

  const openEdit = (acc) => {
    setEditingId(acc.id);
    setForm({ bank: acc.bank || '', nomor_rekening: acc.nomor_rekening || '', nama_pemilik: acc.nama_pemilik || '', is_active: acc.is_active ?? true });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ bank: '', nomor_rekening: '', nama_pemilik: '', is_active: true });
  };

  const save = async (formData) => {
    if (!formData.bank.trim()) { notify('Nama bank wajib diisi', 'error'); return; }
    if (!formData.nomor_rekening.trim()) { notify('Nomor rekening wajib diisi', 'error'); return; }
    setBusy(true);
    try {
      if (editingId) {
        await updateBankAccount(editingId, formData);
        setAccounts(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } : a));
        notify('Rekening bank diperbarui', 'success');
      } else {
        const saved = await insertBankAccount(formData);
        setAccounts(prev => [saved, ...prev]);
        notify('Rekening bank ditambahkan', 'success');
      }
      closeForm();
    } catch (err) {
      console.error('[bank account] save error:', err.message);
      const hint = err.message?.includes('does not exist') || err.message?.includes('relation')
        ? ' — Tabel bank_accounts belum dibuat. Jalankan migration-bank-qris.sql di Supabase SQL Editor.'
        : err.message?.includes('row-level security') || err.message?.includes('policy')
        ? ' — RLS policy belum diatur. Jalankan migration-bank-qris.sql di Supabase SQL Editor.'
        : '';
      notify('Gagal menyimpan rekening: ' + (err.message || 'Error') + hint, 'error');
    } finally { setBusy(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Hapus rekening bank ini?')) return;
    setBusy(true);
    try { await deleteBankAccount(id); setAccounts(prev => prev.filter(a => a.id !== id)); notify('Rekening bank dihapus', 'success'); }
    catch (err) { console.error('[bank account] delete error:', err.message); notify(err.message || 'Gagal menghapus rekening', 'error'); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-university text-tjokro-green"></i> Rekening Bank
        </h4>
        <button onClick={openAdd} className="px-3 py-1.5 rounded-xl bg-tjokro-green hover:bg-tjokro-darkgreen text-white text-xs font-bold transition flex items-center gap-1.5">
          <i className="fa-solid fa-plus"></i> Tambah
        </button>
      </div>

      <BankAccountList accounts={accounts} loading={loading} onEdit={openEdit} onDelete={remove} />

      {showForm && <BankAccountForm mode={editingId ? 'edit' : 'add'} initialData={editingId ? accounts.find(a => a.id === editingId) : null} onCancel={closeForm} onSave={save} busy={busy} notify={notify} />}
    </div>
  );
}
