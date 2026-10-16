import { supabase } from './supabase.js';

const TABLE = 'applicants';

// DB (snake_case) -> App (camelCase)
export function rowToApplicant(row) {
  if (!row) return null;
  return {
    // id unik internal (uuid dari supabase) — dipakai sebagai key React
    _key: row.id,
    id: row.reg_no,
    nia: row.nia || '-',
    nama: row.nama,
    nik: row.nik,
    ttl: row.ttl || '-',
    gender: row.gender || '-',
    pekerjaan: row.pekerjaan || '-',
    hp: row.hp || '-',
    email: row.email || '-',
    alamat: row.alamat || '-',
    simpananPokok: Number(row.simpanan_pokok || 0),
    simpananWajib: Number(row.simpanan_wajib || 0),
    metode: row.metode || '-',
    status: row.status || 'Menunggu',
    tanggalDaftar: row.tanggal_daftar || '-',
    ktpUrl: row.ktp_url || '',
    selfieUrl: row.selfie_url || '',
    ttdUrl: row.ttd_url || '',
  };
}

// App (camelCase) -> DB (snake_case)
export function applicantToRow(a) {
  return {
    reg_no: a.id,
    nia: a.nia === '-' ? null : a.nia,
    nama: a.nama,
    nik: a.nik,
    ttl: a.ttl,
    gender: a.gender,
    pekerjaan: a.pekerjaan,
    hp: a.hp,
    email: a.email,
    alamat: a.alamat,
    simpanan_pokok: a.simpananPokok,
    simpanan_wajib: a.simpananWajib,
    metode: a.metode,
    status: a.status,
    tanggal_daftar: a.tanggalDaftar,
    ktp_url: a.ktpUrl || null,
    selfie_url: a.selfieUrl || null,
    ttd_url: a.ttdUrl || null,
  };
}

export async function fetchApplicants() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToApplicant);
}

export async function insertApplicant(applicant) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(applicantToRow(applicant))
    .select()
    .single();
  if (error) throw error;
  return rowToApplicant(data);
}

export async function updateApplicantStatus(regNo, status, nia = null) {
  const patch = { status };
  if (nia) patch.nia = nia;
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq('reg_no', regNo)
    .select()
    .single();
  if (error) throw error;
  return rowToApplicant(data);
}
