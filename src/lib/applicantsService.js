import { supabase } from './supabase.js';

const TABLE = 'applicants';

// DB (snake_case) -> App (camelCase)
// Dibuat toleran: kalau kolom belum ada di DB (tabel lama),
// pakai nilai default agar fetch tidak crash.
export function rowToApplicant(row) {
  if (!row) return null;
  return {
    // id unik internal (uuid dari supabase) — dipakai sebagai key React
    _key: row.id ?? row.reg_no,
    id: row.reg_no ?? row.id,
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
    simpananSukarela: Number(row.simpanan_sukarela || 0),
    metode: row.metode || '-',
    status: row.status || 'Menunggu',
    statusBayar: row.status_bayar || 'Belum',
    tanggalDaftar: row.tanggal_daftar || '-',
    ktpUrl: row.ktp_url || '',
    selfieUrl: row.selfie_url || '',
    buktiBayarUrl: row.bukti_bayar_url || '',
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
    simpanan_sukarela: a.simpananSukarela || 0,
    metode: a.metode,
    status: a.status,
    status_bayar: a.statusBayar || 'Belum',
    tanggal_daftar: a.tanggalDaftar,
    ktp_url: a.ktpUrl || null,
    selfie_url: a.selfieUrl || null,
    bukti_bayar_url: a.buktiBayarUrl || null,
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
  // Tahan terhadap tabel lama yang belum punya kolom baru:
  // kalau Supabase protes "Could not find the 'xxx' column",
  // buang kolom itu dari payload lalu coba lagi.
  let payload = applicantToRow(applicant);
  for (let attempt = 0; attempt < 12; attempt++) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select();
    if (!error) {
      const row = (data || [])[0];
      return row ? rowToApplicant(row) : null;
    }
    const m = String(error.message || '').match(/Could not find the '([^']+)' column/i);
    if (m && m[1] && m[1] in payload) {
      console.warn(`[supabase] kolom ${m[1]} belum ada di tabel, dicoba tanpa kolom itu...`);
      const { [m[1]]: _dropped, ...rest } = payload;
      payload = rest;
      continue;
    }
    throw error;
  }
  throw new Error('Insert gagal setelah retry tanpa kolom baru.');
}

export async function updateApplicantStatus(regNo, status, nia = null) {
  const patch = { status };
  if (nia) patch.nia = nia;
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq('reg_no', regNo)
    .select();
  if (error) throw error;
  const row = (data || [])[0];
  return row ? rowToApplicant(row) : null;
}

export async function updatePaymentStatus(regNo, statusBayar) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status_bayar: statusBayar })
    .eq('reg_no', regNo)
    .select();
  if (error) throw error;
  const row = (data || [])[0];
  return row ? rowToApplicant(row) : null;
}

export async function deleteApplicant(regNo) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('reg_no', regNo);
  if (error) throw error;
  return true;
}

// Patch umum untuk edit data (nama, NIK, HP, alamat, pekerjaan, dll).
// key App (camelCase) -> kolom DB (snake_case).
const EDITABLE_MAP = {
  nama: 'nama',
  nik: 'nik',
  nia: 'nia',
  ttl: 'ttl',
  gender: 'gender',
  pekerjaan: 'pekerjaan',
  hp: 'hp',
  email: 'email',
  alamat: 'alamat',
  simpananWajib: 'simpanan_wajib',
  simpananSukarela: 'simpanan_sukarela',
  metode: 'metode',
};

export async function updateApplicant(regNo, patchApp) {
  const patch = {};
  for (const [k, v] of Object.entries(patchApp || {})) {
    const col = EDITABLE_MAP[k];
    if (col) patch[col] = v;
  }
  if (!Object.keys(patch).length) throw new Error('Tidak ada perubahan untuk disimpan.');
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq('reg_no', regNo)
    .select();
  if (error) throw error;
  const row = (data || [])[0];
  return row ? rowToApplicant(row) : null;
}
