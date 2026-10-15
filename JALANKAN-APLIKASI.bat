@echo off
REM Jalankan aplikasi Pendaftaran Anggota Koperasi HOS
REM Cara pakai: double-click file ini, tunggu browser terbuka di http://localhost:5173
cd /d "%~dp0"
echo Mengecek node_modules...
if not exist "node_modules" (
  echo Menginstall dependency, mohon tunggu...
  call npm install
)
echo Menjalankan server pengembangan...
call npm run dev
pause
