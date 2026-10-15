import { useEffect, useState } from 'react';

export default function Toast({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!toast) return null;
  const icon =
    toast.type === 'success'
      ? 'fa-solid fa-circle-check text-tjokro-accentgold text-base'
      : toast.type === 'error'
        ? 'fa-solid fa-circle-exclamation text-rose-400 text-base'
        : 'fa-solid fa-circle-info text-blue-400 text-base';

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <i className={icon}></i>
      <span className="font-semibold">{toast.message}</span>
    </div>
  );
}
