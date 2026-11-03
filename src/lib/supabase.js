import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SUPABASE_READY = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diset. ' +
    'Cek file .env di root proyek (sejajar package.json).',
  );
} else if (String(supabaseAnonKey).startsWith('sb_publishable_')) {
  // Kunci model baru Supabase — butuh @supabase/supabase-js >= 2.76.
  // Jika insert/fetch gagal dengan "Invalid API key", jalankan: npm install
  console.info('[supabase] memakai publishable key (sb_publishable_...), pastikan dependency @supabase/supabase-js terbaru.');
} else if (!SUPABASE_READY) {
  console.warn('[supabase] Variabel lingkungan tidak lengkap, pastikan .env memiliki VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
