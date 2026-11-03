import { supabase, SUPABASE_READY } from './supabase.js';
import { INITIAL_QRIS } from '../data/qris.js';

const TABLE = 'qris';

// DB (snake_case) -> App (camelCase)
export function qrisFromRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    label: row.label || '',
    qr_image_url: row.qr_image_url || '',
    is_active: row.is_active ?? true,
    created_at: row.created_at,
  };
}

// App (camelCase) -> DB (snake_case)
export function qrisToRow(a) {
  return {
    qr_image_url: a.qr_image_url || null,
    label: a.label || null,
    is_active: a.is_active ?? true,
  };
}

export async function fetchQris() {
  if (!SUPABASE_READY) {
    return INITIAL_QRIS;
  }
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(qrisFromRow);
}

export async function insertQris(qris) {
  if (!SUPABASE_READY) {
    throw new Error('Mode offline: fitur ini hanya aktif saat terhubung ke Supabase.');
  }
  const { data, error } = await supabase
    .from(TABLE)
    .insert(qrisToRow(qris))
    .select()
    .single();
  if (error) throw error;
  return qrisFromRow(data);
}

export async function deleteQris(id) {
  if (!SUPABASE_READY) {
    throw new Error('Mode offline: fitur ini hanya aktif saat terhubung ke Supabase.');
  }
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
}
