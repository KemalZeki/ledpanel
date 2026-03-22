@echo off
title LED Ekran - Proje Baslatici
color 0B

echo.
echo  ========================================
echo       LED EKRAN - PROJE BASLATICI
echo  ========================================
echo.

:: ---- XAMPP yolunu kontrol et ----
set XAMPP_PATH=C:\xampp
if not exist "%XAMPP_PATH%" (
    echo  [!] XAMPP bulunamadi: %XAMPP_PATH%
    echo      Lutfen XAMPP yukleyin veya yolu duzenleyin.
    pause
    exit /b
)

:: ---- Apache baslat ----
echo  [1/7] Apache baslatiliyor...
tasklist /FI "IMAGENAME eq httpd.exe" 2>nul | find /I "httpd.exe" >nul
if %ERRORLEVEL% equ 0 (
    echo        Apache zaten calisiyor.
) else (
    start "" /B "%XAMPP_PATH%\apache\bin\httpd.exe"
    timeout /t 2 /nobreak >nul
    echo        Apache baslatildi.
)

:: ---- MySQL baslat ----
echo  [2/7] MySQL baslatiliyor...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>nul | find /I "mysqld.exe" >nul
if %ERRORLEVEL% equ 0 (
    echo        MySQL zaten calisiyor.
) else (
    start "" /B "%XAMPP_PATH%\mysql\bin\mysqld.exe" --defaults-file="%XAMPP_PATH%\mysql\bin\my.ini"
    timeout /t 3 /nobreak >nul
    echo        MySQL baslatildi.
)

:: ---- API symlink olustur ----
echo  [3/7] API baglantisi kontrol ediliyor...
if exist "%XAMPP_PATH%\htdocs\ledapi" (
    echo        API baglantisi mevcut.
) else (
    mklink /J "%XAMPP_PATH%\htdocs\ledapi" "%~dp0api" >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo        API symlink olusturuldu.
    ) else (
        echo        [!] Symlink olusturulamadi. BAT dosyasini yonetici olarak calistirin.
        echo            Veya manuel olarak kopyalayin:
        echo            xcopy "%~dp0api" "%XAMPP_PATH%\htdocs\ledapi\" /E /I /Y
    )
)

:: ---- Uploads klasorunu olustur ----
echo  [4/7] Uploads klasoru kontrol ediliyor...
if not exist "%~dp0api\uploads" (
    mkdir "%~dp0api\uploads"
    echo        Uploads klasoru olusturuldu.
) else (
    echo        Uploads klasoru mevcut.
)

:: ---- Veritabanini kontrol et ve olustur ----
echo  [5/7] Veritabani kontrol ediliyor...
"%XAMPP_PATH%\mysql\bin\mysql.exe" -u root -e "USE ledekran_db;" 2>nul
if %ERRORLEVEL% equ 0 (
    echo        Veritabani mevcut.
) else (
    echo        Veritabani olusturuluyor...
    "%XAMPP_PATH%\mysql\bin\mysql.exe" -u root < "%~dp0database.sql"
    if %ERRORLEVEL% equ 0 (
        echo        Veritabani basariyla olusturuldu.
    ) else (
        echo        [!] Veritabani olusturulamadi. MySQL calistigindan emin olun.
    )
)

:: ---- npm bagimliliklarini kontrol et ----
echo  [6/7] Bagimliliklar kontrol ediliyor...
if not exist "%~dp0node_modules" (
    echo        npm install calistiriliyor...
    cd /d "%~dp0"
    call npm install --legacy-peer-deps
    echo        Bagimliliklar yuklendi.
) else (
    echo        Bagimliliklar mevcut.
)

:: ---- Vite dev server baslat ----
echo  [7/7] Gelistirme sunucusu baslatiliyor...
echo.
echo  ========================================
echo   Site:    http://localhost:5173
echo   Admin:   http://localhost:5173/admin/login
echo.
echo   Kullanici Adi: admin
echo   Sifre:         password
echo.
echo   Dil Destegi: TR / EN / DE / AR
echo.
echo   Kapatmak icin Ctrl+C basin.
echo  ========================================
echo.

:: Tarayiciyi ac
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173"

:: Vite dev server baslat
cd /d "%~dp0"
call npm run dev
