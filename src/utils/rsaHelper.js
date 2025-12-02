import { hexToBytes, bytesToHex } from "./cryptoHelper";

// Convert PEM → ArrayBuffer
function pemToArrayBuffer(pem) {
    const b64 = pem
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace(/\s+/g, "");
    const raw = atob(b64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return bytes.buffer;
}

// Import RSA-OAEP public key
export async function importRsaPublicKey(pem) {
    const binary = pemToArrayBuffer(pem);
    return await crypto.subtle.importKey(
        "spki",
        binary,
        {
            name: "RSA-OAEP",
            hash: "SHA-1"
        },
        false,
        ["encrypt"]
    );
}

export async function rsaEncryptAesKey(aesBytes, rsaKey) {
    const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" }, // ✔ default SHA-1
        rsaKey,
        aesBytes
    );

    return bytesToHex(new Uint8Array(encrypted));
}
