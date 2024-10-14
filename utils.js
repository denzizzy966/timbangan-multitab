// utils.js

/**
 * Menambahkan pesan log ke container log dan console.
 * @param {string} message - Pesan yang akan ditambahkan ke log.
 * @param {string} [logContainerId='logContainer'] - ID elemen HTML untuk container log.
 */
export function log(message, logContainerId = 'logContainer') {
    const logContainer = document.getElementById(logContainerId);
    if (logContainer) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        logContainer.insertBefore(logEntry, logContainer.firstChild);
    }
    console.log(message);
}

/**
 * Menyimpan data ke localStorage.
 * @param {string} key - Kunci untuk menyimpan data.
 * @param {any} value - Nilai yang akan disimpan.
 */
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Mengambil data dari localStorage.
 * @param {string} key - Kunci untuk mengambil data.
 * @returns {any} Data yang diambil, atau null jika tidak ada.
 */
export function loadFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

/**
 * Memformat angka menjadi string dengan jumlah desimal tertentu.
 * @param {number} number - Angka yang akan diformat.
 * @param {number} [decimals=2] - Jumlah angka desimal.
 * @returns {string} Angka yang telah diformat.
 */
export function formatNumber(number, decimals = 2) {
    return number.toFixed(decimals);
}

/**
 * Membuat delay dengan Promise.
 * @param {number} ms - Jumlah milidetik untuk delay.
 * @returns {Promise} Promise yang resolve setelah delay.
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}