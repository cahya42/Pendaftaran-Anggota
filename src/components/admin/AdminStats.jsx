export default function StatCard({ label, value, icon, box, text }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
      <div>
        <p className={`text-xs font-bold uppercase tracking-wider ${text}`}>{label}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${box}`}>
        <i className={icon}></i>
      </div>
    </div>
  );
}
