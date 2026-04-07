"use strict";

let secureStorage = null;
let textDecoder = null;

try {
    const uxpModule = require("uxp");
    if (uxpModule && uxpModule.storage && uxpModule.storage.secureStorage) {
        secureStorage = uxpModule.storage.secureStorage;
    }
} catch (error) {
    secureStorage = null;
}

try {
    textDecoder = new TextDecoder();
} catch (error) {
    textDecoder = null;
}

function createSecureStore(prefix) {
    async function loadMany(keys) {
        const result = {};
        const keyList = Array.isArray(keys) ? keys : [];

        for (let index = 0; index < keyList.length; index += 1) {
            const key = keyList[index];
            result[key] = await loadItem(key);
        }

        return result;
    }

    async function saveMany(values) {
        const source = values || {};
        const keys = Object.keys(source);

        for (let index = 0; index < keys.length; index += 1) {
            const key = keys[index];
            await saveItem(key, source[key]);
        }
    }

    async function loadItem(key) {
        if (!secureStorage) return "";
        try {
            const rawValue = await secureStorage.getItem(buildKey(prefix, key));
            return decodeSecureValue(rawValue);
        } catch (error) {
            return "";
        }
    }

    async function saveItem(key, value) {
        if (!secureStorage) return;
        const normalized = String(value === null || value === undefined ? "" : value);
        const namespacedKey = buildKey(prefix, key);

        try {
            if (!normalized) {
                await secureStorage.removeItem(namespacedKey);
                return;
            }
        } catch (removeError) {}

        if (!normalized) return;

        try {
            await secureStorage.setItem(namespacedKey, normalized);
        } catch (error) {}
    }

    return {
        loadMany: loadMany,
        saveMany: saveMany
    };
}

function buildKey(prefix, key) {
    return String(prefix || "stp.secure.") + String(key || "");
}

function decodeSecureValue(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (textDecoder && value && typeof value.byteLength === "number") {
        try {
            return textDecoder.decode(value);
        } catch (error) {}
    }

    try {
        return String.fromCharCode.apply(null, value);
    } catch (fallbackError) {
        return "";
    }
}

module.exports = {
    createSecureStore: createSecureStore
};
