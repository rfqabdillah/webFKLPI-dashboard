import axios from 'axios';
import { encryptAes256GcmHex, decryptAes256GcmHex } from './cryptoHelper';

const keyHex = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// const encryptionEnabled = false;

const encryptionEnabled = process.env.VUE_APP_API_ENCRYPTION 
  ? process.env.VUE_APP_API_ENCRYPTION.trim() === 'true' 
  : false;

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

// 🔹 Request interceptor (TETAP PATUH PADA ENV)
// Kita hanya mengenkripsi kiriman jika ENV = true
apiClient.interceptors.request.use(async (config) => {
  if (!encryptionEnabled) return config;

  const isFormData = config.data instanceof FormData;
  if (isFormData) return config;

  try {
    if (config.method === 'get' || config.method === 'delete') {
      if (config.params && Object.keys(config.params).length > 0) {
        const encrypted = await encryptAes256GcmHex(config.params, keyHex);
        config.params = { payload: encrypted };
      }
    } else if (config.data) {
      const encrypted = await encryptAes256GcmHex(config.data, keyHex);
      config.data = { payload: encrypted };
    }
  } catch (error) {
    console.error('❌ Error encrypting request:', error);
    return Promise.reject(error);
  }

  return config;
}, error => Promise.reject(error));

// 🔹 Response interceptor (AUTO DETECT)
// Kita akan mendekripsi jika ENV = true ATAU jika respon mengandung 'payload'
apiClient.interceptors.response.use(async (response) => {
  
  // 1. CEK KERAS: Jika fitur dimatikan, JANGAN pernah mencoba mendekripsi apapun.
  // Kembalikan response mentah-mentah.
  if (!encryptionEnabled) {
    return response; 
  }

  // 2. CEK SAFETY: Jika browser tidak mendukung crypto (karena HTTP), skip dekripsi
  if (!window.crypto || !window.crypto.subtle) {
      console.warn("⚠️ Browser memblokir Crypto API (Koneksi Tidak Aman). Skip dekripsi.");
      return response;
  }

  // --- Kode Lama di bawah ini (Hanya jalan jika encryptionEnabled = true) ---
  const hasEncryptedPayload = response.data && response.data.payload;

  if (hasEncryptedPayload) {
      try {
        const decryptedString = await decryptAes256GcmHex(response.data.payload, keyHex);
        
        let decryptedData;
        if (typeof decryptedString === 'string') {
          try {
              decryptedData = JSON.parse(decryptedString);
          } catch (jsonError) {
              decryptedData = decryptedString;
          }
        } else {
            decryptedData = decryptedString;
        }
        response.data = decryptedData;

      } catch (e) {
        console.error('❌ Gagal decrypt response:', e);
      }
  }

  return response;
}, error => Promise.reject(error));

export default apiClient;