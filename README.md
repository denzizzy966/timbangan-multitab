# Aplikasi Pembaca Timbangan Digital

Aplikasi ini adalah sistem pembaca timbangan digital yang menggunakan Web Serial API untuk berkomunikasi dengan timbangan melalui port serial.

## Persyaratan Sistem

- **Browser**: Google Chrome 89+ atau Microsoft Edge 89+
- **Sistem Operasi**: Windows 10+, macOS 10.15+, atau Linux dengan dukungan Web Serial API
- **JavaScript**: ECMAScript 2017 atau lebih baru
- **Timbangan Digital**: Timbangan dengan koneksi serial (USB atau RS-232)

## Pengaturan Browser

### Mengaktifkan Web Serial API

1. Buka `chrome://flags/` atau `edge://flags/` di browser Anda.
2. Cari "Experimental Web Platform features".
3. Aktifkan fitur ini.
4. Restart browser Anda.

### Pengaturan untuk Pengembangan Lokal (HTTP)

Karena aplikasi ini menggunakan Web Serial API, yang memerlukan konteks aman (HTTPS), beberapa pengaturan tambahan diperlukan untuk pengembangan lokal menggunakan HTTP:

#### Untuk Google Chrome:

1. Buka `chrome://flags/#unsafely-treat-insecure-origin-as-secure` di Chrome.
2. Aktifkan fitur "Insecure origins treated as secure".
3. Di kolom teks, tambahkan URL pengembangan lokal Anda (misalnya `http://localhost:8000`).
4. Klik "Relaunch" untuk menerapkan perubahan.

#### Untuk Microsoft Edge:

1. Buka `edge://flags/#unsafely-treat-insecure-origin-as-secure` di Edge.
2. Ikuti langkah yang sama seperti di Chrome.

#### Untuk Firefox:

Firefox saat ini tidak mendukung Web Serial API. Gunakan Chrome atau Edge untuk pengembangan dan pengujian.

### Catatan Keamanan Penting

Pengaturan ini hanya direkomendasikan untuk pengembangan lokal dan pengujian. Jangan menggunakan pengaturan ini di lingkungan produksi atau untuk mengakses situs web lain, karena dapat membahayakan keamanan browsing Anda.

## Instalasi

1. Clone repositori ini ke komputer lokal Anda.
2. Buka folder proyek di editor kode Anda.
3. Jalankan server web lokal. Contoh menggunakan Python:
   - Python 3: `python -m http.server 8000`
   - Python 2: `python -m SimpleHTTPServer 8000`
4. Buka browser dan akses `http://localhost:8000`

## Penggunaan

### Contoh Penggunaan Sederhana

Berikut adalah contoh penggunaan sederhana dari aplikasi ini menggunakan HTML dan JavaScript:

```html



    
    
    Contoh Pembaca Timbangan Sederhana


    Pembaca Timbangan Sederhana
    Status: Tidak Terhubung
    Berat: 0.00 kg
    Hubungkan Timbangan

    
        import ScaleConnection from './scale-connection.js';
        import { log } from './utils.js';

        const scaleConnection = new ScaleConnection();
        const statusElement = document.getElementById('status');
        const weightElement = document.getElementById('weight');
        const connectButton = document.getElementById('connectButton');

        connectButton.addEventListener('click', async () => {
            try {
                await scaleConnection.connect();
                statusElement.textContent = 'Status: Terhubung';
                scaleConnection.startReading((weight) => {
                    weightElement.textContent = `Berat: ${weight} kg`;
                    log(`Berat terbaca: ${weight} kg`);
                });
            } catch (error) {
                statusElement.textContent = 'Status: Gagal Terhubung';
                log(`Error: ${error.message}`);
            }
        });
    


```

Dalam contoh ini:

1. Kita membuat halaman HTML sederhana dengan elemen untuk menampilkan status, berat, dan tombol untuk menghubungkan timbangan.

2. Kita mengimpor `ScaleConnection` dari `scale-connection.js` dan fungsi `log` dari `utils.js`.

3. Saat tombol "Hubungkan Timbangan" diklik:
   - Kita mencoba menghubungkan ke timbangan menggunakan `scaleConnection.connect()`.
   - Jika berhasil, kita memulai pembacaan dengan `scaleConnection.startReading()`.
   - Setiap pembacaan berat akan memperbarui elemen `weightElement` dan mencatat ke log.

4. Jika terjadi error, kita memperbarui status dan mencatat error ke log.

Untuk menggunakan contoh ini:

1. Simpan kode HTML di atas sebagai `simple-example.html` dalam folder proyek Anda.
2. Pastikan `scale-connection.js` dan `utils.js` berada dalam folder yang sama.
3. Buka `simple-example.html` menggunakan server web lokal (seperti yang dijelaskan di bagian Instalasi).
4. Klik tombol "Hubungkan Timbangan" dan ikuti petunjuk untuk memilih port timbangan.

Contoh ini mendemonstrasikan penggunaan dasar dari `ScaleConnection` untuk menghubungkan dan membaca data dari timbangan digital.


### Menghubungkan Timbangan

1. Klik tombol "Hubungkan Timbangan".
2. Pilih port serial yang sesuai dengan timbangan Anda.
3. Aplikasi akan mulai membaca data dari timbangan.

### Membaca Berat

- Berat akan ditampilkan secara otomatis di layar.
- Riwayat pembacaan akan ditampilkan di tabel.

### Fungsi-fungsi Utama

#### `ScaleConnection` (scale-connection.js)

- `connect()`: Menghubungkan ke timbangan.
- `startReading(callback)`: Memulai pembacaan data dari timbangan.
- `close()`: Menutup koneksi timbangan.
- `getPortInfo()`: Mendapatkan informasi port yang digunakan.

#### Utilitas (utils.js)

- `log(message, logContainerId)`: Menambahkan pesan ke log.
- `saveToLocalStorage(key, value)`: Menyimpan data ke localStorage.
- `loadFromLocalStorage(key)`: Mengambil data dari localStorage.
- `formatNumber(number, decimals)`: Memformat angka dengan jumlah desimal tertentu.
- `delay(ms)`: Membuat delay dengan Promise.

## Troubleshooting

- Jika timbangan tidak terdeteksi, pastikan driver timbangan terinstal dengan benar.
- Jika koneksi gagal, coba lepas dan pasang kembali kabel timbangan.
- Pastikan tidak ada aplikasi lain yang menggunakan port serial timbangan.

## Pengembangan

- Gunakan editor kode modern seperti Visual Studio Code untuk pengembangan lebih lanjut.
- Pastikan untuk menguji aplikasi di berbagai browser dan sistem operasi yang didukung.

## Lisensi

[MIT License](LICENSE)

## Kontak

Untuk pertanyaan atau dukungan, silakan buat issue di repositori GitHub ini.
