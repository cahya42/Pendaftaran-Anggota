const STEPS = ['Data Pribadi', 'Dokumen', 'Simpanan', 'Tanda Tangan'];

export default function StepProgress({ currentStep }) {
  const widths = { 1: '25%', 2: '50%', 3: '75%', 4: '100%' };
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 mb-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-tjokro-green via-tjokro-lightgreen to-tjokro-accentgold"></div>
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-tjokro-gold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <i className="fa-solid fa-id-card-clip"></i> Formulir Rekrutmen Anggota Baru
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Pendaftaran Anggota Koperasi</h1>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500">Tahap</span>
          <div className="text-lg font-black text-tjokro-green leading-none">
            {currentStep}<span className="text-slate-400 font-medium text-xs">/4</span>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {STEPS.map((label, idx) => {
            const n = idx + 1;
            const done = n < currentStep;
            const active = n === currentStep;
            const circle = done
              ? 'w-9 h-9 rounded-2xl flex items-center justify-center text-xs mb-1.5 transition-all bg-emerald-600 text-white'
              : active
                ? 'w-9 h-9 rounded-2xl flex items-center justify-center text-xs mb-1.5 transition-all bg-tjokro-green text-white shadow-md ring-4 ring-tjokro-mint'
                : 'w-9 h-9 rounded-2xl flex items-center justify-center text-xs mb-1.5 transition-all bg-slate-200 text-slate-600';
            return (
              <div key={label} className={`flex flex-col items-center ${!done && !active ? 'opacity-40' : ''}`}>
                <div className={circle}>{done ? <i className="fa-solid fa-check"></i> : n}</div>
                <span className={`${active ? 'text-tjokro-darkgreen' : 'text-slate-600'} text-[11px] sm:text-xs`}>{label}</span>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-tjokro-green to-tjokro-accentgold transition-all duration-300 rounded-full"
            style={{ width: widths[currentStep] }}
          ></div>
        </div>
      </div>
    </div>
  );
}
