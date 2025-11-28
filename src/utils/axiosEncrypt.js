import axios from "axios";
import { encryptAes256GcmHex, decryptAes256GcmHex } from "./cryptoHelper";
import { performHandshake } from "./handshake";

/* =========================== CONFIG =========================== */
const encryptionEnabled = process.env.VUE_APP_API_ENCRYPTION === "true";
const FALLBACK_TO_PLAIN = false;
const MAX_HANDSHAKE_RETRY = 5;
const BASE_DELAY = 200;

/* =========================== STATE =========================== */
let AES_KEY = null;
let SESSION = null;
let handshakePromise = null;
let handshakeRetryCount = 0;
let requestQueue = [];
let isHandshaking = false;

/* =========================== UTILS =========================== */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function startHandshakeOnce() {
    if (handshakePromise) return handshakePromise;
    isHandshaking = true;

    handshakePromise = (async () => {
        while (handshakeRetryCount < MAX_HANDSHAKE_RETRY) {
            try {
                const result = await performHandshake();
                AES_KEY = result.aesKeyHex;
                SESSION = result.sessionToken;
                handshakeRetryCount = 0;
                isHandshaking = false;
                return result;
            } catch (err) {
                handshakeRetryCount++;
                await delay(BASE_DELAY * handshakeRetryCount);
            }
        }
        isHandshaking = false;
        throw new Error("Handshake permanently failed");
    })();

    return handshakePromise.finally(() => {
        handshakePromise = null;
    });
}

async function ensureReady() {
    if (!encryptionEnabled) return;
    if (AES_KEY && SESSION) return;

    try {
        await startHandshakeOnce();
    } catch (err) {
        if (FALLBACK_TO_PLAIN) {
            console.warn("Handshake gagal total, fallback ke plain request");
            AES_KEY = null;
            SESSION = null;
        } else {
            throw err;
        }
    }
}

async function flushQueue() {
    const pending = [...requestQueue];
    requestQueue = [];

    for (const item of pending) {
        try {
            const res = await apiClient(item.config); // pakai instance
            item.resolve(res);
        } catch (err) {
            item.reject(err);
        }
    }
}

/* =========================== AXIOS INSTANCE =========================== */
const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
});

/* =========================== REQUEST INTERCEPTOR =========================== */
apiClient.interceptors.request.use(async (config) => {
    if (!encryptionEnabled) return config;

    await ensureReady();

    config.headers["X-Session-Token"] = SESSION;

    const method = config.method.toLowerCase();
    config._origData = config.data;
    config._origParams = config.params;

    if (config.data instanceof FormData) return config;

    if (["get", "delete"].includes(method)) {
        if (config._origParams && AES_KEY) {
            config.params = {
                payload: await encryptAes256GcmHex(config._origParams, AES_KEY),
            };
        }
    } else if (config._origData && AES_KEY) {
        config.data = {
            payload: await encryptAes256GcmHex(config._origData, AES_KEY),
        };
    }

    return config;
});

/* =========================== RESPONSE INTERCEPTOR =========================== */
apiClient.interceptors.response.use(
    async (response) => {
        if (!encryptionEnabled || !AES_KEY) return response;

        if (response.data?.payload) {
            try {
                response.data = await decryptAes256GcmHex(response.data.payload, AES_KEY);
            } catch (e) {
                console.warn("Decrypt failed:", e);
            }
        }

        return response;
    },
    async (error) => {
        if (!encryptionEnabled || !error.response) return Promise.reject(error);

        const status = error.response.status;
        const msg = error.response.data?.message || "";
        const expired = status === 401 || status === 403 || msg.includes("Missing session") || msg.includes("expired");

        if (!expired) return Promise.reject(error);

        const original = error.config;
        if (original._retryDone) return Promise.reject(error);
        original._retryDone = true;

        AES_KEY = null;
        SESSION = null;

        await ensureReady();
        await flushQueue();

        if (AES_KEY) {
            if (original._origData) {
                original.data = { payload: await encryptAes256GcmHex(original._origData, AES_KEY) };
            }
            if (original._origParams) {
                original.params = { payload: await encryptAes256GcmHex(original._origParams, AES_KEY) };
            }
            original.headers["X-Session-Token"] = SESSION;
        }

        return apiClient(original);
    }
);

export default apiClient;
