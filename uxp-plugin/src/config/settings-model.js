"use strict";

const PROVIDER_OPTIONS = [
    { id: "deepl", label: "DeepL", description: "Standardanbieter fuer schnelle, stabile Uebersetzungen." },
    { id: "openai", label: "OpenAI", description: "XML-/Tag-sichere Struktur mit GPT-Modellen." },
    { id: "gemini", label: "Gemini", description: "Google Gemini fuer strukturierte Uebersetzungen." },
    { id: "claude", label: "Claude", description: "Anthropic Claude fuer strukturierte Uebersetzungen." },
    { id: "local", label: "Local LLM", description: "LM Studio oder Ollama ueber OpenAI-kompatible Endpunkte." }
];

const UI_LANGUAGE_OPTIONS = [
    { id: "auto", label: "Auto (Systemsprache)" },
    { id: "de", label: "Deutsch" },
    { id: "en", label: "English" }
];

const TARGET_LANGUAGE_OPTIONS = [
    { id: "DE", label: "Deutsch" },
    { id: "EN-GB", label: "English (UK)" },
    { id: "EN-US", label: "English (US)" },
    { id: "FR", label: "Francais" },
    { id: "ES", label: "Espanol" },
    { id: "IT", label: "Italiano" },
    { id: "NL", label: "Nederlands" },
    { id: "PL", label: "Polski" },
    { id: "PT-BR", label: "Portugues (BR)" }
];

const SECRET_KEYS = [
    "deeplKey",
    "openaiKey",
    "geminiKey",
    "claudeKey",
    "localApiKey"
];

function createDefaultAppSettings() {
    return {
        uiLanguage: "auto",
        translationProvider: "deepl",
        translation: {
            targetLanguage: "DE"
        },
        providers: {
            openaiModel: "gpt-5.4-mini",
            geminiModel: "gemini-2.5-flash",
            claudeModel: "claude-sonnet-4-6",
            localBaseUrl: "",
            localModel: ""
        },
        secrets: {
            deeplKey: "",
            openaiKey: "",
            geminiKey: "",
            claudeKey: "",
            localApiKey: ""
        },
        resources: {
            glossaryToken: "",
            glossaryPath: "",
            glossaryStatus: "empty",
            memoryToken: "",
            memoryPath: "",
            memoryStatus: "empty"
        },
        automation: {
            refSymbols: "[]",
            autoHyperlinks: false,
            backPageTracker: "©"
        },
        typography: {
            copyfitEnabled: true,
            copyfitMaxTracking: -10,
            copyfitMinScale: 98,
            copyfitTrackingStep: 2,
            copyfitScaleStep: 1,
            fontFallbackEnabled: true,
            fontFallbackRules: ""
        }
    };
}

function normalizeAppSettings(rawValue) {
    const raw = rawValue || {};
    const defaults = createDefaultAppSettings();

    return {
        uiLanguage: normalizeUiLanguage(raw.uiLanguage || defaults.uiLanguage),
        translationProvider: normalizeTranslationProvider(raw.translationProvider || defaults.translationProvider),
        translation: {
            targetLanguage: normalizeTargetLanguage(readNested(raw, ["translation", "targetLanguage"], defaults.translation.targetLanguage))
        },
        providers: {
            openaiModel: normalizeOpenAIModel(readNested(raw, ["providers", "openaiModel"], defaults.providers.openaiModel)),
            geminiModel: normalizeGeminiModel(readNested(raw, ["providers", "geminiModel"], defaults.providers.geminiModel)),
            claudeModel: normalizeClaudeModel(readNested(raw, ["providers", "claudeModel"], defaults.providers.claudeModel)),
            localBaseUrl: normalizeLocalLLMBaseURL(readNested(raw, ["providers", "localBaseUrl"], defaults.providers.localBaseUrl)),
            localModel: normalizeLocalLLMModel(readNested(raw, ["providers", "localModel"], defaults.providers.localModel))
        },
        secrets: {
            deeplKey: normalizePlainText(readNested(raw, ["secrets", "deeplKey"], defaults.secrets.deeplKey)),
            openaiKey: normalizePlainText(readNested(raw, ["secrets", "openaiKey"], defaults.secrets.openaiKey)),
            geminiKey: normalizePlainText(readNested(raw, ["secrets", "geminiKey"], defaults.secrets.geminiKey)),
            claudeKey: normalizePlainText(readNested(raw, ["secrets", "claudeKey"], defaults.secrets.claudeKey)),
            localApiKey: normalizePlainText(readNested(raw, ["secrets", "localApiKey"], defaults.secrets.localApiKey))
        },
        resources: {
            glossaryToken: normalizePlainText(readNested(raw, ["resources", "glossaryToken"], defaults.resources.glossaryToken)),
            glossaryPath: normalizePlainText(readNested(raw, ["resources", "glossaryPath"], defaults.resources.glossaryPath)),
            glossaryStatus: normalizeResourceStatus(readNested(raw, ["resources", "glossaryStatus"], defaults.resources.glossaryStatus)),
            memoryToken: normalizePlainText(readNested(raw, ["resources", "memoryToken"], defaults.resources.memoryToken)),
            memoryPath: normalizePlainText(readNested(raw, ["resources", "memoryPath"], defaults.resources.memoryPath)),
            memoryStatus: normalizeResourceStatus(readNested(raw, ["resources", "memoryStatus"], defaults.resources.memoryStatus))
        },
        automation: {
            refSymbols: normalizeRefSymbols(readNested(raw, ["automation", "refSymbols"], defaults.automation.refSymbols)),
            autoHyperlinks: normalizeBoolean(readNested(raw, ["automation", "autoHyperlinks"], defaults.automation.autoHyperlinks)),
            backPageTracker: normalizeBackPageTrackerSetting(readNested(raw, ["automation", "backPageTracker"], defaults.automation.backPageTracker))
        },
        typography: {
            copyfitEnabled: normalizeBoolean(readNested(raw, ["typography", "copyfitEnabled"], defaults.typography.copyfitEnabled)),
            copyfitMaxTracking: normalizeCopyfitMaxTrackingSetting(readNested(raw, ["typography", "copyfitMaxTracking"], defaults.typography.copyfitMaxTracking)),
            copyfitMinScale: normalizeCopyfitMinScaleSetting(readNested(raw, ["typography", "copyfitMinScale"], defaults.typography.copyfitMinScale)),
            copyfitTrackingStep: normalizeCopyfitTrackingStepSetting(readNested(raw, ["typography", "copyfitTrackingStep"], defaults.typography.copyfitTrackingStep)),
            copyfitScaleStep: normalizeCopyfitScaleStepSetting(readNested(raw, ["typography", "copyfitScaleStep"], defaults.typography.copyfitScaleStep)),
            fontFallbackEnabled: normalizeBoolean(readNested(raw, ["typography", "fontFallbackEnabled"], defaults.typography.fontFallbackEnabled)),
            fontFallbackRules: normalizeFontFallbackRulesSetting(readNested(raw, ["typography", "fontFallbackRules"], defaults.typography.fontFallbackRules))
        }
    };
}

function stripSecrets(settings) {
    const normalized = normalizeAppSettings(settings);
    return {
        uiLanguage: normalized.uiLanguage,
        translationProvider: normalized.translationProvider,
        translation: normalized.translation,
        providers: normalized.providers,
        resources: normalized.resources,
        automation: normalized.automation,
        typography: normalized.typography
    };
}

function mergeSecrets(settings, secrets) {
    const normalized = normalizeAppSettings(settings);
    normalized.secrets = {
        deeplKey: normalizePlainText(secrets && secrets.deeplKey),
        openaiKey: normalizePlainText(secrets && secrets.openaiKey),
        geminiKey: normalizePlainText(secrets && secrets.geminiKey),
        claudeKey: normalizePlainText(secrets && secrets.claudeKey),
        localApiKey: normalizePlainText(secrets && secrets.localApiKey)
    };
    return normalized;
}

function buildProviderStatus(settings) {
    const normalized = normalizeAppSettings(settings);
    const provider = normalized.translationProvider;
    const secrets = normalized.secrets;

    if (provider === "openai") {
        return secrets.openaiKey
            ? { tone: "ready", badge: "OpenAI bereit", message: "OpenAI-Key und Modell sind konfiguriert." }
            : { tone: "warm", badge: "OpenAI unvollstaendig", message: "Fuer OpenAI fehlt noch der API-Key." };
    }

    if (provider === "gemini") {
        return secrets.geminiKey
            ? { tone: "ready", badge: "Gemini bereit", message: "Gemini-Key und Modell sind konfiguriert." }
            : { tone: "warm", badge: "Gemini unvollstaendig", message: "Fuer Gemini fehlt noch der API-Key." };
    }

    if (provider === "claude") {
        return secrets.claudeKey
            ? { tone: "ready", badge: "Claude bereit", message: "Claude-Key und Modell sind konfiguriert." }
            : { tone: "warm", badge: "Claude unvollstaendig", message: "Fuer Claude fehlt noch der API-Key." };
    }

    if (provider === "local") {
        if (!normalized.providers.localBaseUrl) {
            return { tone: "warm", badge: "Local LLM offen", message: "Fuer Local LLM fehlt noch die Base URL." };
        }
        if (!normalized.providers.localModel) {
            return { tone: "warm", badge: "Local LLM offen", message: "Fuer Local LLM fehlt noch das Modell." };
        }
        return { tone: "ready", badge: "Local LLM bereit", message: "Lokaler Provider ist fuer den naechsten Port-Schritt vorbereitet." };
    }

    return secrets.deeplKey
        ? { tone: "ready", badge: "DeepL bereit", message: "DeepL ist als Standardanbieter konfiguriert." }
        : { tone: "warm", badge: "DeepL offen", message: "Fuer DeepL fehlt noch der API-Key." };
}

function buildResourceStatus(settings) {
    const normalized = normalizeAppSettings(settings);
    const glossaryReady = normalized.resources.glossaryStatus === "ready";
    const memoryReady = normalized.resources.memoryStatus === "ready";

    if (glossaryReady && memoryReady) {
        return { tone: "ready", badge: "Dateien bereit", message: "Glossar- und Memory-Datei sind verbunden." };
    }

    if (glossaryReady || memoryReady) {
        return { tone: "warm", badge: "Teilweise bereit", message: "Mindestens eine Datenquelle ist bereits angebunden." };
    }

    return { tone: "muted", badge: "Noch lokal", message: "Glossar und Memory muessen noch verbunden oder erzeugt werden." };
}

function getActiveProviderModel(settings) {
    const normalized = normalizeAppSettings(settings);
    if (normalized.translationProvider === "openai") return normalized.providers.openaiModel;
    if (normalized.translationProvider === "gemini") return normalized.providers.geminiModel;
    if (normalized.translationProvider === "claude") return normalized.providers.claudeModel;
    if (normalized.translationProvider === "local") return normalized.providers.localModel || "Kein Modell";
    return "DeepL API";
}

function getMaskedSecret(value) {
    const raw = normalizePlainText(value);
    if (!raw) return "Nicht gesetzt";
    if (raw.length <= 6) return "Gesetzt";
    return raw.slice(0, 3) + "..." + raw.slice(-3);
}

function readNested(obj, path, fallbackValue) {
    let current = obj;
    for (let index = 0; index < path.length; index += 1) {
        if (!current || typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, path[index])) {
            return fallbackValue;
        }
        current = current[path[index]];
    }
    return current === undefined ? fallbackValue : current;
}

function normalizeUiLanguage(value) {
    const normalized = String(value || "").replace(/^\s+|\s+$/g, "").toLowerCase();
    if (normalized === "de" || normalized === "en") return normalized;
    return "auto";
}

function normalizeTranslationProvider(providerId) {
    const normalized = String(providerId || "").replace(/^\s+|\s+$/g, "").toLowerCase();
    if (normalized === "local" || normalized === "local_llm" || normalized.indexOf("lm studio") !== -1 || normalized.indexOf("ollama") !== -1) return "local";
    if (normalized === "gemini" || normalized === "google" || normalized.indexOf("gemini") !== -1) return "gemini";
    if (normalized === "claude" || normalized === "anthropic" || normalized.indexOf("claude") !== -1) return "claude";
    if (normalized === "openai" || normalized === "chatgpt") return "openai";
    return "deepl";
}

function normalizeTargetLanguage(value) {
    const normalized = String(value || "").replace(/^\s+|\s+$/g, "").toUpperCase();
    for (let index = 0; index < TARGET_LANGUAGE_OPTIONS.length; index += 1) {
        if (TARGET_LANGUAGE_OPTIONS[index].id === normalized) return normalized;
    }
    return "DE";
}

function normalizeOpenAIModel(modelName) {
    const normalized = normalizePlainText(modelName);
    return normalized || "gpt-5.4-mini";
}

function normalizeGeminiModel(modelName) {
    const normalized = normalizePlainText(modelName);
    return normalized || "gemini-2.5-flash";
}

function normalizeClaudeModel(modelName) {
    const normalized = normalizePlainText(modelName);
    return normalized || "claude-sonnet-4-6";
}

function normalizeLocalLLMModel(modelName) {
    return normalizePlainText(modelName);
}

function normalizeLocalLLMBaseURL(url) {
    let normalized = normalizePlainText(url);
    if (!normalized) return "";
    normalized = normalized.replace(/\/+$/g, "");
    normalized = normalized.replace(/\/(responses|chat\/completions)$/i, "");
    normalized = normalized.replace(/\/api$/i, "");
    if (!/\/v\d+$/i.test(normalized)) normalized += "/v1";
    return normalized;
}

function normalizeRefSymbols(symbols) {
    let raw = normalizePlainText(symbols);
    if (!raw) raw = "[]";

    const compact = raw.replace(/\s+/g, "");
    let tokens = [];
    if (/[;,|]/.test(compact)) {
        tokens = compact.split(/[;,|]+/);
    } else if (compact.length >= 2 && compact.length % 2 === 0) {
        for (let index = 0; index < compact.length; index += 2) tokens.push(compact.substr(index, 2));
    } else {
        tokens = [compact];
    }

    const normalized = [];
    const seen = {};
    for (let index = 0; index < tokens.length; index += 1) {
        const token = tokens[index];
        if (!token || token.length < 2) continue;
        const openChar = token.charAt(0);
        const closeChar = token.charAt(token.length - 1);
        const pair = openChar + closeChar;
        if (!seen[pair]) {
            normalized.push(pair);
            seen[pair] = true;
        }
    }

    if (!normalized.length) normalized.push("[]");
    return normalized.join(", ");
}

function normalizeBackPageTrackerSetting(value) {
    const raw = normalizePlainText(value);
    return raw || "©";
}

function parseCopyfitNumericSetting(value, fallbackValue) {
    const raw = String(value === null || value === undefined ? "" : value).replace(/,/g, ".").replace(/^\s+|\s+$/g, "");
    if (raw === "") return fallbackValue;
    const parsed = parseFloat(raw);
    return isNaN(parsed) ? fallbackValue : parsed;
}

function normalizeCopyfitMaxTrackingSetting(value) {
    let parsed = Math.round(parseCopyfitNumericSetting(value, -10));
    if (parsed > 0) parsed = 0;
    if (parsed < -100) parsed = -100;
    return parsed;
}

function normalizeCopyfitMinScaleSetting(value) {
    let parsed = Math.round(parseCopyfitNumericSetting(value, 98));
    if (parsed > 100) parsed = 100;
    if (parsed < 50) parsed = 50;
    return parsed;
}

function normalizeCopyfitTrackingStepSetting(value) {
    let parsed = Math.round(parseCopyfitNumericSetting(value, 2));
    if (parsed < 1) parsed = 1;
    if (parsed > 20) parsed = 20;
    return parsed;
}

function normalizeCopyfitScaleStepSetting(value) {
    let parsed = Math.round(parseCopyfitNumericSetting(value, 1));
    if (parsed < 1) parsed = 1;
    if (parsed > 10) parsed = 10;
    return parsed;
}

function normalizeFontFallbackRulesSetting(value) {
    return String(value === null || value === undefined ? "" : value).replace(/\r\n?/g, "\n");
}

function normalizePlainText(value) {
    return String(value === null || value === undefined ? "" : value).replace(/^\s+|\s+$/g, "");
}

function normalizeBoolean(value) {
    if (typeof value === "boolean") return value;
    return String(value || "") === "1" || String(value || "").toLowerCase() === "true";
}

function normalizeResourceStatus(value) {
    const normalized = String(value || "").toLowerCase();
    if (normalized === "ready" || normalized === "missing" || normalized === "error") return normalized;
    return "empty";
}

module.exports = {
    PROVIDER_OPTIONS: PROVIDER_OPTIONS,
    SECRET_KEYS: SECRET_KEYS,
    TARGET_LANGUAGE_OPTIONS: TARGET_LANGUAGE_OPTIONS,
    UI_LANGUAGE_OPTIONS: UI_LANGUAGE_OPTIONS,
    buildProviderStatus: buildProviderStatus,
    buildResourceStatus: buildResourceStatus,
    createDefaultAppSettings: createDefaultAppSettings,
    getActiveProviderModel: getActiveProviderModel,
    getMaskedSecret: getMaskedSecret,
    mergeSecrets: mergeSecrets,
    normalizeAppSettings: normalizeAppSettings,
    stripSecrets: stripSecrets
};
