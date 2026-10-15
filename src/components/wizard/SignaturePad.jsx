import { useEffect, useRef } from 'react';

export default function SignaturePad({ canvasRef, hasSignature, setHasSignature }) {
  const wrapRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && canvas.width !== Math.floor(rect.width)) {
        canvas.width = Math.floor(rect.width);
        canvas.height = 160;
      }
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#073824';
      ctx.lineWidth = 2.5;
    };
    setup();
    window.addEventListener('resize', setup);
    return () => window.removeEventListener('resize', setup);
  }, [canvasRef]);

  const pos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  };

  const start = (e) => {
    drawing.current = true;
    setHasSignature(true);
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
  };
  const move = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
  };
  const stop = () => {
    if (drawing.current) {
      drawing.current = false;
      canvasRef.current.getContext('2d').closePath();
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Goreskan Tanda Tangan Anda di Bawah <span className="text-red-500">*</span>
        </label>
        <button type="button" onClick={clear} className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1">
          <i className="fa-solid fa-rotate-left"></i> Bersihkan / Ulangi
        </button>
      </div>
      <div ref={wrapRef} className="border-2 border-dashed border-slate-300 rounded-2xl bg-white relative overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          height={160}
          className="signature-canvas w-full h-40 cursor-crosshair bg-slate-50/40"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs">
            <span><i className="fa-solid fa-pen-nib mr-1 text-tjokro-gold"></i> Sentuh dengan jari di layar HP atau mouse di sini</span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400">Tanda tangan digital ini sah sebagai bukti verifikasi keanggotaan.</p>
    </div>
  );
}
