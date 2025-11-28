import { importRsaPublicKey, rsaEncryptAesKey } from "./rsaHelper";
import { bytesToHex } from "./cryptoHelper";

export async function performHandshake() {

    // 1. Ambil public RSA key dari backend (via proxy)
    const res = await fetch(`/api/api/crypto/public-key`);
    const data = await res.json();
    const publicKeyPem = data.public_key;

    const rsaKey = await importRsaPublicKey(publicKeyPem);

    // 2. Generate random AES key (32 bytes)
    const aesKeyBytes = crypto.getRandomValues(new Uint8Array(32));
    const aesKeyHex = bytesToHex(aesKeyBytes);

    // 3. Encrypt AES key with RSA
    const encryptedKeyHex = await rsaEncryptAesKey(aesKeyBytes, rsaKey);

    // 4. Kirim AES key terenkripsi ke backend (via proxy)
    const handshakeRes = await fetch(`/api/api/crypto/handshake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: encryptedKeyHex })
    });

    const handshakeJson = await handshakeRes.json();
    const sessionToken = handshakeJson.session_token;

    // 5. Simpan session token & AES key
    localStorage.setItem("ENCRYPTION_SESSION", sessionToken);
    localStorage.setItem("AES_KEY", aesKeyHex);

    return { aesKeyHex, sessionToken };
}

export function getSessionToken() {
    return localStorage.getItem("ENCRYPTION_SESSION");
}

export function getAesKey() {
    return localStorage.getItem("AES_KEY");
}
