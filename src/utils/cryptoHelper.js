// ===============================
//    HEX ↔ Bytes
// ===============================
export function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

export function bytesToHex(bytes) {
    return [...bytes]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// ===============================
//    AES-256-GCM Encrypt (HEX)
// ===============================
export async function encryptAes256GcmHex(obj, keyHex) {
    const keyBytes = hexToBytes(keyHex);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const cryptoKey = await crypto.subtle.importKey(
        "raw", keyBytes,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    );

    const encoded = new TextEncoder().encode(JSON.stringify(obj));

    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        encoded
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(iv.length + encryptedBytes.length);

    combined.set(iv);
    combined.set(encryptedBytes, iv.length);

    return bytesToHex(combined);
}

// ===============================
//    AES-256-GCM Decrypt (HEX)
// ===============================
export async function decryptAes256GcmHex(hexString, keyHex) {
    const raw = hexToBytes(hexString);
    const keyBytes = hexToBytes(keyHex);

    const iv = raw.slice(0, 12);
    const ciphertext = raw.slice(12);

    const cryptoKey = await crypto.subtle.importKey(
        "raw", keyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        ciphertext
    );

    return JSON.parse(new TextDecoder().decode(decryptedBuffer));
}
