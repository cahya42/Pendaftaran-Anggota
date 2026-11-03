import { supabase, SUPABASE_READY } from './supabase.js';
import { INITIAL_BANK_ACCOUNTS } from '../data/bankAccounts.js';

const TABLE = 'bank_accounts';

// DB (snake_case) -> App (camelCase)
export function bankAccountFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    nomor_rekening: row.nomor_rekening,
    bank: row.bank,
    nama_pemilik: row.nama_pemilik || '',
    is_active: row.is_active,
    created_at: row.created_at,
  };
}

// App (camelCase) -> DB (snake_case)
export function bankAccountToRow(a) {
  return {
    nomor_rekening: a.nomor_rekening,
    bank: a.bank,
    nama_pemilik: a.nama_pemilik || null,
    is_active: a.is_active ?? true,
  };
}

export async function fetchBankAccounts() {
  if (!SUPABASE_READY) {
    return INITIAL_BANK_ACCOUNTS;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(bankAccountFromRow);
}

export async function fetchActiveBankAccounts() {
  if (!SUPABASE_READY) {
    return INITIAL_BANK_ACCOUNTS.filter((a) => a.is_active);
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('is_active', true)
    .order('bank', { ascending: true });
  if (error) throw error;
  return (data || []).map(bankAccountFromRow);
}

export async function insertBankAccount(account) {
  if (!SUPABASE_READY) {
    // mode offline: tidak bisa menyimpan kembali ke server
    throw new Error('Mode offline: fitur ini hanya aktif saat terhubung ke Supabase.');
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert(bankAccountToRow(account))
    .select()
    .single();
  if (error) throw error;
  return bankAccountFromRow(data);
}

export async function updateBankAccount(id, patch) {
  if (!SUPABASE_READY) {
    throw new Error('Mode offline: fitur ini hanya aktif saat terhubung ke Supabase.');
  }
  const { data, error } = await supabase
    .from(TABLE)
    .update(bankAccountToRow(patch))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return bankAccountFromRow(data);
}

export async function deleteBankAccount(id) {
  if (!SUPABASE_READY) {
    throw new Error('Mode offline: fitur ini hanya aktif saat terhubung ke Supabase.');
  }
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
}
