export function formatRupiah(n) {
  return 'Rp ' + Number(n || 0).toLocaleString('id-ID');
}

export function waLink(hp) {
  if (!hp) return '#';
  return `https://wa.me/${String(hp).replace(/^0/, '62')}`;
}

export function generateRegId() {
  return 'REG-2026-' + Math.floor(1000 + Math.random() * 9000);
}

export function generateNia() {
  return 'NIA-PWK-26' + Math.floor(1000 + Math.random() * 9000);
}

export function exportApplicantsToCSV(applicants) {
  const headers = [
    'No Registrasi',
    'Nomor Induk Anggota (NIA)',
    'Nama Lengkap Sesuai KTP',
    'NIK',
    'Jenis Kelamin',
    'Tempat Tanggal Lahir',
    'No WhatsApp',
    'Email',
    'Pekerjaan',
    'Alamat Lengkap',
    'Simpanan Pokok (Rp)',
    'Simpanan Wajib (Rp)',
    'Simpanan Sukarela (Rp)',
    'Metode Pembayaran',
    'Status Verifikasi',
    'Status Bayar',
  ];
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = applicants.map((a) => [
    esc(a.id),
    esc(a.nia),
    esc(a.nama),
    `"'${a.nik}"`,
    esc(a.gender),
    esc(a.ttl),
    `"'${a.hp}"`,
    esc(a.email),
    esc(a.pekerjaan),
    esc(a.alamat),
    a.simpananPokok,
    a.simpananWajib,
    a.simpananSukarela || 0,
    esc(a.metode),
    esc(a.status),
    esc(a.statusBayar || 'Belum'),
  ]);
  const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Data_Anggota_Koperasi_HOS_Tjokroaminoto_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
