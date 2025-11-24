import imageCompression from 'browser-image-compression';

/**
 * Kompres gambar sebelum upload.
 * @param {File} file - File gambar yang akan dikompres.
 * @param {Object} options - Opsi tambahan untuk kompresi.
 * @returns {Promise<File>} - File hasil kompresi.
 */
export async function compressImage(file, options = {}) {
  if (!file) throw new Error("File tidak ditemukan.");

  const defaultOptions = {
    maxSizeMB: 1,            
    // maxWidthOrHeight: 1920,    
    initialQuality: 0.8,       
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error("Gagal mengompres gambar:", error);
    throw error;
  }
}
