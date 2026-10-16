# Pendaftaran Anggota — Koperasi Konsumen HOS TJOKROAMINOTO PURWAKARTA ISTIMEWA (React + Vite)

Hasil konversi dari `sistem_perekrutan_anggota.html` menjadi aplikasi React-Vite
dengan Tailwind CSS, QR Code standee, wizard 4 langkah, tanda tangan digital,
dan panel pengurus.

## Cara menjalankan

```powershell
cd "D:\Abi\Project\Aplikasi\Koperasi HOS\Pendaftaran-Anggota"
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build produksi

```powershell
npm run build
npm run preview
```

## Struktur

- `src/App.jsx` — layout, navigasi Form QR / Panel Pengurus, toast
- `src/components/Header.jsx` — logo + switcher view
- `src/components/wizard/` — StepProgress, Step1-4, SignaturePad, MemberView, SuccessCard
- `src/components/admin/` — AdminPanel, QrStandee (qrcode.react), ApplicantRows, ApplicantModal
- `src/data/applicants.js` — data contoh + konstanta simpanan
- `src/utils/helpers.js` — format rupiah, ekspor CSV, generator NIA/REG
