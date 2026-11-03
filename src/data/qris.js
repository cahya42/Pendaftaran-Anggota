// Seed QRIS untuk mode offline (tanpa Supabase).
// Format mengikuti rowToQris di qrisService.js.
export const INITIAL_QRIS = [
  {
    id: 'qris-default-1',
    label: 'QRIS Koperasi Konsumen HOS',
    qr_image_url: 'https://placehold.co/200x200/eaf6f0/0b5336?text=QRIS',
    is_active: true,
  },
];
