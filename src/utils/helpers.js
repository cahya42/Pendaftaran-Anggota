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

export function generateNia(existing = [], date = new Date()) {
  // Format: HC-PWK-YYXXXX (2 digit tahun + 4 digit urutan digabung, tanpa strip)
  // Contoh: HC-PWK-260001, HC-PWK-260002. Anggota pertama = 0001.
  // Nomor terkecil yang BELUM dipakai (celah bekas hapus dipakai ulang).
  const yy = String(date.getFullYear()).slice(-2).padStart(2, '0');
  const norm = (s) => String(s || '').trim().toUpperCase();
  const used = new Set();
  for (const a of existing || []) {
    const nia = norm(a?.nia);
    // Format baru: HC-PWK-260001
    let m = nia.match(/^HC-PWK-(\d{2})(\d{4})\s*$/);
    // Kompatibel format lama: HC-PWK-26-0001
    if (!m) {
      const mOld = nia.match(/^HC-PWK-(\d{2})-(\d{4})\s*$/);
      if (mOld) m = [mOld[0], mOld[1], mOld[2]];
    }
    if (m && m[1] === yy) used.add(parseInt(m[2], 10));
  }
  let next = 1;
  while (used.has(next)) next += 1;
  return `HC-PWK-${yy}${String(next).padStart(4, '0')}`;
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
  link.download = `Data_Anggota_Koperasi_HOS_Tjokroaminoto_Purwakarta_Istimewa_${new Date().toISOString().slice(0, 10)}.csv`;
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

// Kompres gambar ke max 900px & JPEG 0.7 agar muat di kolom text Supabase
// (base64 foto HP asli bisa 3–8 MB → insert ditolak / payload too large).
export function readFileAsCompressedDataURL(file, maxDim = 900, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
