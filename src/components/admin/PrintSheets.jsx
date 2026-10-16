import { formatRupiah } from '../../utils/helpers.js';

function PrintHeader({ title, subtitle }) {
  return (
    <div className="print-kop">
      <img src="logo-koperasi.png" alt="Logo Koperasi" className="print-logo" />
      <div className="print-kop-text">
        <h1>KOPERASI KONSUMEN HOS TJOKROAMINOTO</h1>
        <p>Purwakarta Istimewa &bull; &quot;Bersama Membangun, Sejahtera Bersama&quot;</p>
        <h2>{title}</h2>
        {subtitle && <p className="print-sub">{subtitle}</p>}
      </div>
    </div>
  );
}

// Daftar pendaftar (mengikuti filter/pencarian yang tampil di tabel)
export function PrintApplicantList({ rows, statusFilter, search, printRef }) {
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const filterLabel = statusFilter === 'ALL' ? 'Semua Status' : statusFilter;
  return (
    <div id="print-applicant-list" ref={printRef} className="print-area">
      <PrintHeader
        title="DAFTAR PENDAFTAR CALON ANGGOTA"
        subtitle={`Filter: ${filterLabel}${search ? ` • Pencarian: "${search}"` : ''} • Dicetak: ${today} • Total: ${rows.length} orang`}
      />
      <table className="print-table">
        <thead>
          <tr>
            <th>No</th>
            <th>No. Registrasi / NIA</th>
            <th>Nama / NIK</th>
            <th>Kontak</th>
            <th>Setoran (Pokok+Wajib+Sukarela)</th>
            <th>Status</th>
            <th>Bayar</th>
            <th>TTD Pengurus</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a, i) => (
            <tr key={a.id}>
              <td className="text-center">{i + 1}</td>
              <td>{a.id}<br />{a.nia}</td>
              <td><strong>{a.nama}</strong><br />NIK: {a.nik}<br />{a.ttl}</td>
              <td>{a.hp}<br />{a.pekerjaan}</td>
              <td>{formatRupiah(a.simpananPokok + a.simpananWajib + (a.simpananSukarela || 0))}<br />{a.metode}</td>
              <td>{a.status}</td>
              <td>{a.statusBayar || 'Belum'}</td>
              <td className="print-sign-col"></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="print-sign-row">
        <div className="print-sign-box">
          <p>Mengetahui,</p>
          <p className="font-bold">Ketua Koperasi</p>
          <div className="print-sign-space"></div>
          <p>( ........................................ )</p>
        </div>
        <div className="print-sign-box text-right">
          <p>Purwakarta, {today}</p>
          <p className="font-bold">Petugas Verifikasi</p>
          <div className="print-sign-space"></div>
          <p>( ........................................ )</p>
        </div>
      </div>
    </div>
  );
}

// Formulir/detail satu anggota
export function PrintApplicantDetail({ applicant, printRef }) {
  if (!applicant) return null;
  const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const row = (label, value) => (
    <tr key={label}>
      <td className="print-label">{label}</td>
      <td className="print-sep">:</td>
      <td>{value}</td>
    </tr>
  );
  return (
    <div id="print-applicant-detail" ref={printRef} className="print-area">
      <PrintHeader title="FORMULIR VERIFIKASI CALON ANGGOTA" subtitle={`No. Registrasi: ${applicant.id} • Status: ${applicant.status}`} />
      <table className="print-detail-table">
        <tbody>
          {row('Nama Lengkap', <strong>{applicant.nama}</strong>)}
          {row('NIK e-KTP', applicant.nik)}
          {row('Nomor Induk Anggota (NIA)', applicant.nia)}
          {row('Tempat, Tanggal Lahir', applicant.ttl)}
          {row('Jenis Kelamin', applicant.gender)}
          {row('Pekerjaan', applicant.pekerjaan)}
          {row('No. WhatsApp', applicant.hp)}
          {row('Email', applicant.email)}
          {row('Alamat Domisili', applicant.alamat)}
          {row('Simpanan Pokok', formatRupiah(applicant.simpananPokok))}
          {row('Simpanan Wajib', `${formatRupiah(applicant.simpananWajib)} / bulan`)}
          {applicant.simpananSukarela && row('Simpanan Sukarela', formatRupiah(applicant.simpananSukarela))}
          {row('Total Setoran Awal', <strong>{formatRupiah(applicant.simpananPokok + applicant.simpananWajib + (applicant.simpananSukarela || 0))}</strong>)}
          {row('Metode Pembayaran', applicant.metode)}
          {row('Status Pembayaran', applicant.statusBayar || 'Belum')}
          {row('Tanggal Daftar', applicant.tanggalDaftar)}
          {applicant.buktiBayarUrl && (
            <tr>
              <td className="print-label">Bukti Pembayaran</td>
              <td className="print-sep">:</td>
              <td>
                <img src={applicant.buktiBayarUrl} alt="Bukti pembayaran" className="print-bukti" />
                <p className="print-caption">Bukti diunggah calon anggota — verifikasi dengan mutasi rekening.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="print-sign-row">
        <div className="print-sign-box">
          <p>Calon Anggota,</p>
          <div className="print-sign-space"></div>
          <p className="font-bold">( {applicant.nama} )</p>
        </div>
        <div className="print-sign-box text-right">
          <p>Purwakarta, {today}</p>
          <p className="font-bold">Pengurus Koperasi</p>
          <div className="print-sign-space"></div>
          <p>( ........................................ )</p>
        </div>
      </div>
    </div>
  );
}
