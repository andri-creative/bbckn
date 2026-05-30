const MAX_TIME_DIFFERENCE = 5 * 60 * 1000;

export const isTimestampValid = (timestampStr: string | undefined | string[]): { isValid: boolean, message?: string } => {
    if (!timestampStr) {
        return { isValid: false, message: 'Header timestamp tidak ditemukan' };
    }

    const clientTimestamp = parseInt(timestampStr as string, 10);

    if (isNaN(clientTimestamp)) {
        return { isValid: false, message: 'Format timestamp tidak valid' };
    }

    const currentServerTime = Date.now();
    const timeDifference = Math.abs(currentServerTime - clientTimestamp);

    // Jika perbedaan waktu antara client dan server melebihi batas toleransi
    if (timeDifference > MAX_TIME_DIFFERENCE) {
        return { isValid: false, message: 'Waktu (timestamp) request sudah kedaluwarsa atau tidak sesuai' };
    }

    return { isValid: true };
};
