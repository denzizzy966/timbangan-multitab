// scale-connection.js

/**
 * Kelas ScaleConnection menangani koneksi dan komunikasi dengan timbangan digital
 * melalui Web Serial API.
 */
class ScaleConnection {
    /**
     * Konstruktor untuk membuat instance ScaleConnection baru.
     * @param {number} baudRate - Baud rate untuk komunikasi serial (default: 57600).
     */
    constructor(baudRate = 57600) {
        this.port = null; // Menyimpan objek port serial
        this.reader = null; // Menyimpan objek reader untuk membaca data dari port
        this.keepReading = false; // Flag untuk mengontrol loop pembacaan
        this.isConnected = false; // Status koneksi timbangan
        this.BAUD_RATE = baudRate; // Baud rate untuk komunikasi serial
    }

    /**
     * Metode untuk menghubungkan ke timbangan.
     * Mencoba menggunakan port yang tersimpan atau meminta pengguna memilih port baru.
     * @returns {Promise<Object>} - Informasi port yang terhubung.
     * @throws {Error} Jika terjadi kesalahan saat menghubungkan.
     */
    async connect() {
        try {
            // Jika sudah terhubung, tidak perlu melakukan koneksi ulang
            if (this.isConnected) {
                console.log('Sudah terhubung');
                return;
            }

            // Mencoba mendapatkan port yang tersimpan sebelumnya
            const storedPortInfo = JSON.parse(localStorage.getItem('lastUsedPort'));
            if (storedPortInfo) {
                console.log('Mencoba menggunakan port terakhir yang digunakan');
                const availablePorts = await navigator.serial.getPorts();
                this.port = availablePorts.find(p => p.getInfo().usbVendorId === storedPortInfo.usbVendorId && 
                                                p.getInfo().usbProductId === storedPortInfo.usbProductId);
            }
            
            // Jika tidak ada port tersimpan atau port tidak ditemukan, minta pengguna memilih
            if (!this.port) {
                console.log('Meminta pengguna memilih port');
                this.port = await navigator.serial.requestPort();
                const portInfo = this.port.getInfo();
                // Simpan informasi port untuk penggunaan berikutnya
                localStorage.setItem('lastUsedPort', JSON.stringify({
                    usbVendorId: portInfo.usbVendorId,
                    usbProductId: portInfo.usbProductId
                }));
            }
            
            // Membuka koneksi ke port
            console.log('Membuka port');
            await this.port.open({ baudRate: this.BAUD_RATE });
            
            this.isConnected = true;
            console.log('Terhubung ke timbangan');
            
            return this.port.getInfo();
        } catch (error) {
            console.error('Error saat menghubungkan:', error);
            this.isConnected = false;
            throw error;
        }
    }

    /**
     * Memulai pembacaan data dari timbangan.
     * @param {function} callback - Fungsi yang akan dipanggil setiap kali data baru diterima.
     */
    async startReading(callback) {
        console.log('Memulai pembacaan');
        this.keepReading = true;
        while (this.port.readable && this.keepReading) {
            try {
                this.reader = this.port.readable.getReader();
                while (true) {
                    const { value, done } = await this.reader.read();
                    if (done || !this.keepReading) {
                        console.log('Pembacaan selesai atau dihentikan');
                        break;
                    }
                    // Mengubah data yang diterima menjadi string dan menghapus whitespace
                    const weight = new TextDecoder().decode(value).trim();
                    if (callback) callback(weight);
                }
            } catch (error) {
                console.error('Error saat membaca:', error);
            } finally {
                // Selalu lepaskan reader setelah selesai atau jika terjadi error
                this.reader.releaseLock();
            }
            // Jeda singkat sebelum mencoba membaca lagi jika terjadi error
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        console.log('Keluar dari loop pembacaan');
    }

    /**
     * Menutup koneksi dengan timbangan.
     */
    async close() {
        console.log('Menutup koneksi timbangan');
        this.keepReading = false;
        
        // Membatalkan reader jika sedang aktif
        if (this.reader) {
            try {
                await this.reader.cancel();
                console.log('Reader dibatalkan');
            } catch (error) {
                console.error('Error saat membatalkan reader:', error);
            }
            this.reader = null;
        }

        // Menutup port jika masih terbuka
        if (this.port) {
            try {
                await this.port.close();
                console.log('Port ditutup');
            } catch (error) {
                console.error('Error saat menutup port:', error);
            }
            this.port = null;
        }
        this.isConnected = false;
    }

    /**
     * Mendapatkan informasi tentang port yang sedang digunakan.
     * @returns {Object|null} Informasi port atau null jika tidak terhubung.
     */
    getPortInfo() {
        return this.port ? this.port.getInfo() : null;
    }
}

export default ScaleConnection;