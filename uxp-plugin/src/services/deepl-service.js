"use strict";

function translateTextsWithDeepL(options) {
    const apiKey = normalizePlainText(options && options.apiKey);
    const texts = normalizeTextList(options && options.texts);
    const targetLanguage = normalizeTargetLanguage(options && options.targetLanguage);

    if (!apiKey) {
        return Promise.reject(new Error("DeepL API Key fehlt."));
    }

    if (!texts.length) {
        return Promise.resolve({
            translations: [],
            detectedSourceLanguage: ""
        });
    }

    const endpoint = apiKey.slice(-3).toLowerCase() === ":fx"
        ? "https://api-free.deepl.com/v2/translate"
        : "https://api.deepl.com/v2/translate";

    return fetch(endpoint, {
        method: "POST",
        headers: {
            "Authorization": "DeepL-Auth-Key " + apiKey,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: encodeFormBody({
            target_lang: targetLanguage,
            preserve_formatting: "1",
            text: texts
        })
    }).then(async function (response) {
        const payload = await readResponsePayload(response);
        if (!response.ok) {
            throw new Error(extractDeepLError(payload, response.status));
        }

        const translations = payload && Array.isArray(payload.translations)
            ? payload.translations.map(function (item) {
                return String(item && item.text ? item.text : "");
            })
            : [];

        return {
            translations: translations,
            detectedSourceLanguage: translations.length && payload.translations[0] && payload.translations[0].detected_source_language
                ? String(payload.translations[0].detected_source_language)
                : ""
        };
    });
}

function normalizeTargetLanguage(value) {
    const normalized = String(value || "").replace(/^\s+|\s+$/g, "").toUpperCase();
    return normalized || "DE";
}

function normalizeTextList(values) {
    if (!Array.isArray(values)) return [];
    return values
        .map(function (value) { return String(value === undefined || value === null ? "" : value); })
        .filter(function (value) { return value.replace(/\s+/g, "").length > 0; });
}

function normalizePlainText(value) {
    return String(value === undefined || value === null ? "" : value).replace(/^\s+|\s+$/g, "");
}

function encodeFormBody(fields) {
    const parts = [];
    const keys = Object.keys(fields || {});

    for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        const rawValue = fields[key];
        if (Array.isArray(rawValue)) {
            for (let arrayIndex = 0; arrayIndex < rawValue.length; arrayIndex += 1) {
                parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(rawValue[arrayIndex])));
            }
            continue;
        }

        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(rawValue)));
    }

    return parts.join("&");
}

async function readResponsePayload(response) {
    const text = await response.text();
    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch (error) {
        return {
            message: text
        };
    }
}

function extractDeepLError(payload, statusCode) {
    if (payload && payload.message) return String(payload.message);
    if (payload && payload.detail) return String(payload.detail);
    return "DeepL-Request fehlgeschlagen (HTTP " + String(statusCode || "?") + ").";
}

module.exports = {
    translateTextsWithDeepL: translateTextsWithDeepL
};
