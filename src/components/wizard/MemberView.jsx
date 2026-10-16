import { useRef, useState } from 'react';
import StepProgress from '../StepProgress.jsx';
import Step1Identity from './Step1Identity.jsx';
import Step2Documents from './Step2Documents.jsx';
import Step3Simpanan from './Step3Simpanan.jsx';
import Step4Agreement from './Step4Agreement.jsx';
import SuccessCard from './SuccessCard.jsx';
import { SIMPANAN_POKOK } from '../../data/applicants.js';
import { generateRegId } from '../../utils/helpers.js';

const EMPTY_FORM = {
  nik: '',
  nama: '',
  tempatLahir: '',
  tanggalLahir: '',
  gender: 'Laki-laki',
  pekerjaan: '',
  hp: '',
  email: '',
  alamat: '',
  ktpPreview: '',
  selfiePreview: '',
  simpananWajib: 10000,
  simpananSukarela: 0,
  metode: 'QRIS',
  buktiBayarPreview: '',
  agreed: false,
};

export default function MemberView({ onAddApplicant, notify }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [ticket, setTicket] = useState(null);
  const [hasSignature, setHasSignature] = useState(false);
  const canvasRef = useRef(null);

  const validateStep = (step) => {
    if (step === 1) {
      if (!form.nik || form.nik.length < 16) {
        notify('NIK wajib 16 digit sesuai e-KTP', 'error');
        return false;
      }
      if (!form.nama || !form.tempatLahir || !form.tanggalLahir || !form.hp || !form.pekerjaan || !form.alamat) {
        notify('Mohon lengkapi semua kolom bertanda bintang (*)', 'error');
        return false;
      }
    } else if (step === 2) {
      if (!form.ktpPreview) {
        notify('Silakan unggah foto e-KTP terlebih dahulu', 'error');
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prev = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submit = async () => {
    if (!form.agreed) {
      notify('Centang persetujuan AD/ART Koperasi HOS Tjokroaminoto', 'error');
      return;
    }
    if (!hasSignature) {
      notify('Mohon bubuhkan tanda tangan digital Anda', 'error');
      return;
    }
    const regId = generateRegId();
    const signatureData = canvasRef.current ? canvasRef.current.toDataURL('image/png') : '';
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const newMember = {
      id: regId,
      nia: '-',
      nama: form.nama,
      nik: form.nik,
      ttl: `${form.tempatLahir}, ${form.tanggalLahir}`,
      gender: form.gender,
      pekerjaan: form.pekerjaan,
      hp: form.hp,
      email: form.email || '-',
      alamat: form.alamat,
      simpananPokok: SIMPANAN_POKOK,
      simpananWajib: Number(form.simpananWajib),
      simpananSukarela: Number(form.simpananSukarela || 0),
      metode: form.metode,
      status: 'Menunggu',
      statusBayar: 'Belum',
      tanggalDaftar: today,
      ktpUrl: form.ktpPreview,
      selfieUrl: form.selfiePreview,
      buktiBayarUrl: form.buktiBayarPreview || '',
      ttdUrl: signatureData,
    };
    const saved = await onAddApplicant(newMember);
    const finalId = saved?.id || regId;
    setTicket({ id: finalId, nama: form.nama, nik: form.nik, tanggalDaftar: today });
    notify('Pendaftaran Anda berhasil tercatat di Koperasi HOS Tjokroaminoto!', 'success');
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setHasSignature(false);
    if (canvasRef.current) canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setTicket(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (ticket) {
    return (
      <section className="block max-w-2xl mx-auto">
        <SuccessCard ticket={ticket} onReset={reset} notify={notify} />
      </section>
    );
  }

  return (
    <section className="block max-w-2xl mx-auto">
      <StepProgress currentStep={currentStep} />
      <div className="space-y-6">
        {currentStep === 1 && <Step1Identity form={form} setForm={setForm} />}
        {currentStep === 2 && <Step2Documents form={form} setForm={setForm} />}
        {currentStep === 3 && <Step3Simpanan form={form} setForm={setForm} />}
        {currentStep === 4 && (
          <Step4Agreement form={form} setForm={setForm} canvasRef={canvasRef} hasSignature={hasSignature} setHasSignature={setHasSignature} />
        )}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button" onClick={prev}
            className={`${currentStep === 1 ? 'hidden' : ''} px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition flex items-center gap-2`}
          >
            <i className="fa-solid fa-arrow-left"></i> Kembali
          </button>
          <div className="ml-auto flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button" onClick={next}
                className="px-6 py-2.5 rounded-2xl bg-tjokro-green hover:bg-tjokro-darkgreen text-white font-bold text-xs shadow-md shadow-tjokro-green/20 transition flex items-center gap-2"
              >
                <span>Lanjutkan</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button" onClick={submit}
                className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-tjokro-green to-tjokro-lightgreen hover:from-tjokro-darkgreen hover:to-tjokro-green text-white font-bold text-xs shadow-lg shadow-tjokro-green/30 transition flex items-center gap-2"
              >
                <i className="fa-solid fa-paper-plane text-tjokro-accentgold"></i>
                <span>Kirim Pendaftaran</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
