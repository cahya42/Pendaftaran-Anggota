// Data default untuk mode offline (tanpa .env Supabase).
// Format field mengikuti rowToBankAccount di bankAccountsService.js.
export const INITIAL_BANK_ACCOUNTS = [
  {
    id: 'local-bank-1',
    nomor_rekening: '0001-2345-6789',
    bank: 'Bank Rapi',
    nama_pemilik: 'Koperasi Konsumen HOS',
    is_active: true,
  },
  {
    id: 'local-bank-2',
    nomor_rekening: '9998-7654-3210',
    bank: 'Bank Jabar',
    nama_pemilik: 'Koperasi Konsumen HOS',
    is_active: true,
  },
];
