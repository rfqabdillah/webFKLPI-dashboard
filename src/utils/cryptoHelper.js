export async function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

export async function encryptAes256GcmHex(obj, keyHex) {
    const keyBytes = await hexToBytes(keyHex);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const cryptoKey = await crypto.subtle.importKey(
        "raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]
    );

    const encoded = new TextEncoder().encode(JSON.stringify(obj));
    const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv }, cryptoKey, encoded
    );

    const encryptedBytes = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(iv.length + encryptedBytes.length);
    combined.set(iv);
    combined.set(encryptedBytes, iv.length);

    return Array.from(combined).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function decryptAes256GcmHex(hexString, keyHex) {
    const raw = await hexToBytes(hexString);
    const keyBytes = await hexToBytes(keyHex);

    const iv = raw.slice(0, 12);
    const ciphertext = raw.slice(12);

    const cryptoKey = await crypto.subtle.importKey(
        "raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv }, cryptoKey, ciphertext
    );

    return JSON.parse(new TextDecoder().decode(decryptedBuffer));
}

