@echo off
setlocal enabledelayedexpansion

:: === Konfigurasi ===
set "DATE=%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%"
set "TIME=%TIME:~0,2%-%TIME:~3,2%-%TIME:~6,2%"
set "STAMP=%DATE%_%TIME%"
set "STAMP=!STAMP: =0!"  :: replace space with zero if needed

set "MONGO_TOOLS=D:\mongodb\bin"
set "BACKUP_DIR=D:\DPoIN\backup-dpoint"
set "LOG_FILE=%BACKUP_DIR%\log_%STAMP%.txt"

set "LOCAL_URI=mongodb://localhost:27017/dpoint"
set "ATLAS_URI=mongodb+srv://vdrama72:JkmJokam354@cluster0.ud4z70o.mongodb.net/dpoin"

echo ========================= > "%LOG_FILE%"
echo 🕓 STARTED: %STAMP% >> "%LOG_FILE%"
echo ========================= >> "%LOG_FILE%"

:: === Step 1: Backup MongoDB Lokal ===
echo 🔄 Membackup database lokal... >> "%LOG_FILE%"
"%MONGO_TOOLS%\mongodump.exe" --uri="%LOCAL_URI%" --out="%BACKUP_DIR%\local" >> "%LOG_FILE%" 2>&1

:: === Step 2: Backup MongoDB Atlas sebelum ditimpa ===
echo 🔐 Membackup database Atlas (sebelum ditimpa)... >> "%LOG_FILE%"
"%MONGO_TOOLS%\mongodump.exe" --uri="%ATLAS_URI%" --out="%BACKUP_DIR%\atlas_backup_%STAMP%" >> "%LOG_FILE%" 2>&1

:: === Step 3: Restore lokal ke Atlas ===
echo 🚀 Menyinkronkan data lokal ke Atlas... >> "%LOG_FILE%"
"%MONGO_TOOLS%\mongorestore.exe" --uri="%ATLAS_URI%" --drop "%BACKUP_DIR%\local\dpoint" >> "%LOG_FILE%" 2>&1

:: === Selesai ===
echo ========================= >> "%LOG_FILE%"
echo ✅ SELESAI: %DATE% %TIME% >> "%LOG_FILE%"
echo ========================= >> "%LOG_FILE%"

echo.
echo ✅ Proses selesai. Cek log di: %LOG_FILE%
pause
