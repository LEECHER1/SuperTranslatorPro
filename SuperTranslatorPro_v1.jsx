#targetengine "SuperTranslatorPRO282"

// ==============================================
// SUPER ÜBERSETZER PRO - VERSION 28.2 (API-KEY ENTFERNT)
// ==============================================

// --- 0. EINSTELLUNGEN (API-KEY, CSV-PFAD & TM-PFAD) ---
var DEEPL_KEY_LABEL = "SuperTranslatorPRO_DeepL_API_Key";
var OPENAI_KEY_LABEL = "SuperTranslatorPRO_OpenAI_API_Key";
var OPENAI_MODEL_LABEL = "SuperTranslatorPRO_OpenAI_Model";
var GEMINI_KEY_LABEL = "SuperTranslatorPRO_Gemini_API_Key";
var GEMINI_MODEL_LABEL = "SuperTranslatorPRO_Gemini_Model";
var CLAUDE_KEY_LABEL = "SuperTranslatorPRO_Claude_API_Key";
var CLAUDE_MODEL_LABEL = "SuperTranslatorPRO_Claude_Model";
var LOCAL_LLM_BASE_URL_LABEL = "SuperTranslatorPRO_LocalLLM_BaseURL";
var LOCAL_LLM_API_KEY_LABEL = "SuperTranslatorPRO_LocalLLM_API_Key";
var LOCAL_LLM_MODEL_LABEL = "SuperTranslatorPRO_LocalLLM_Model";
var TRANSLATION_PROVIDER_LABEL = "SuperTranslatorPRO_TranslationProvider";
var CSV_PATH_LABEL = "SuperTranslatorPRO_CSV_Path";
var TM_PATH_LABEL = "SuperTranslatorPRO_TM_Path"; 
var REF_SYMBOLS_LABEL = "SuperTranslatorPRO_RefSymbols";
var HYPERLINK_PAGE_MAP_LABEL = "SuperTranslatorPRO_HyperlinkPageMap";
var AUTO_HYPERLINKS_LABEL = "SuperTranslatorPRO_BDAAutoHyperlinks";
var BACK_PAGE_TRACKER_LABEL = "SuperTranslatorPRO_BackPageTracker";
var UI_LANGUAGE_LABEL = "SuperTranslatorPRO_UILanguage";
var COPYFIT_ENABLED_LABEL = "SuperTranslatorPRO_CopyfitEnabled";
var COPYFIT_MAX_TRACKING_LABEL = "SuperTranslatorPRO_CopyfitMaxTracking";
var COPYFIT_MIN_SCALE_LABEL = "SuperTranslatorPRO_CopyfitMinScale";
var COPYFIT_TRACKING_STEP_LABEL = "SuperTranslatorPRO_CopyfitTrackingStep";
var COPYFIT_SCALE_STEP_LABEL = "SuperTranslatorPRO_CopyfitScaleStep";
var FONT_FALLBACK_ENABLED_LABEL = "SuperTranslatorPRO_FontFallbackEnabled";
var FONT_FALLBACK_RULES_LABEL = "SuperTranslatorPRO_FontFallbackRules";
var PDF_EXPORT_PRINT_PRESET_LABEL = "SuperTranslatorPRO_PDF_Print_Preset";
var PDF_EXPORT_WEB_PRESET_LABEL = "SuperTranslatorPRO_PDF_Web_Preset";
var PDF_EXPORT_WEB_SPREADS_LABEL = "SuperTranslatorPRO_PDF_Web_Spreads";
var PDF_EXPORT_WEB_HYPERLINKS_LABEL = "SuperTranslatorPRO_PDF_Web_Hyperlinks";

function detectUILanguage() {
    var localeText = "";
    try { localeText = String(app.locale || ""); } catch (e) { localeText = ""; }
    localeText = localeText.replace(/^\s+|\s+$/g, "").toLowerCase();
    if (localeText.indexOf("de") === 0) return "de";
    if (localeText.indexOf("german") !== -1 || localeText.indexOf("deutsch") !== -1) return "de";
    if (localeText.indexOf("fr") === 0) return "fr";
    if (localeText.indexOf("french") !== -1 || localeText.indexOf("francais") !== -1 || localeText.indexOf("français") !== -1) return "fr";
    if (localeText.indexOf("es") === 0) return "es";
    if (localeText.indexOf("spanish") !== -1 || localeText.indexOf("espanol") !== -1 || localeText.indexOf("español") !== -1 || localeText.indexOf("castellano") !== -1) return "es";
    if (localeText.indexOf("it") === 0) return "it";
    if (localeText.indexOf("italian") !== -1 || localeText.indexOf("italiano") !== -1) return "it";
    return "en";
}

function normalizeUILanguageSetting(value) {
    var normalized = String(value || "").replace(/^\s+|\s+$/g, "").toLowerCase();
    return (normalized === "de" || normalized === "en" || normalized === "fr" || normalized === "es" || normalized === "it") ? normalized : "auto";
}

#include "includes/ui_language.jsxinc"

function parseCopyfitNumericSetting(value, fallbackValue) {
    var raw = String(value === null || value === undefined ? "" : value);
    raw = raw.replace(/,/g, ".").replace(/^\s+|\s+$/g, "");
    if (raw === "") return fallbackValue;
    var parsed = parseFloat(raw);
    return isNaN(parsed) ? fallbackValue : parsed;
}

function normalizeCopyfitMaxTrackingSetting(value) {
    var parsed = Math.round(parseCopyfitNumericSetting(value, -10));
    if (parsed > 0) parsed = 0;
    if (parsed < -100) parsed = -100;
    return parsed;
}

function normalizeCopyfitMinScaleSetting(value) {
    var parsed = Math.round(parseCopyfitNumericSetting(value, 98));
    if (parsed > 100) parsed = 100;
    if (parsed < 50) parsed = 50;
    return parsed;
}

function normalizeCopyfitEnabledSetting(value) {
    return String(value || "1") !== "0";
}

function normalizeCopyfitTrackingStepSetting(value) {
    var parsed = Math.round(parseCopyfitNumericSetting(value, 2));
    if (parsed < 1) parsed = 1;
    if (parsed > 20) parsed = 20;
    return parsed;
}

function normalizeCopyfitScaleStepSetting(value) {
    var parsed = Math.round(parseCopyfitNumericSetting(value, 1));
    if (parsed < 1) parsed = 1;
    if (parsed > 10) parsed = 10;
    return parsed;
}

function normalizeMultilineSetting(value) {
    return String(value === null || value === undefined ? "" : value).replace(/\r\n?/g, "\n");
}

function normalizeFontFallbackEnabledSetting(value) {
    return String(value || "1") !== "0";
}

function normalizeFontFallbackRuleKey(value) {
    return String(value || "").replace(/^\s+|\s+$/g, "").toUpperCase().replace(/\s+/g, "");
}

function normalizeFontFallbackRuleValue(value) {
    var normalized = String(value || "").replace(/^\s+|\s+$/g, "");
    normalized = normalized.replace(/^["']+/, "").replace(/["']+$/, "");
    return normalized;
}

function normalizeFontFallbackRulesSetting(value) {
    return normalizeMultilineSetting(value);
}

function encodeFontFallbackRulesSettingForLabel(value) {
    var normalized = normalizeFontFallbackRulesSetting(value);
    return normalized === "" ? "__EMPTY__" : normalized;
}

function decodeFontFallbackRulesSettingFromLabel(value) {
    var normalized = normalizeFontFallbackRulesSetting(value);
    if (normalized === "__EMPTY__") return "";
    if (normalized === "") return buildDefaultFontFallbackRulesSetting();
    return normalized;
}

function normalizeFontLookupKey(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

var installedFontFamilyLookupCache = null;
var parsedFontFallbackRulesCacheRaw = null;
var parsedFontFallbackRulesCache = {};
var resolvedFontFallbackFamilyCache = {};
var fontFallbackWarningCache = {};

function getInstalledFontFamilyLookup() {
    if (installedFontFamilyLookupCache !== null) return installedFontFamilyLookupCache;
    var lookup = {};
    var fonts = [];
    try { fonts = app.fonts.everyItem().getElements(); } catch (e) {
        try { fonts = app.fonts; } catch (e2) { fonts = []; }
    }
    for (var i = 0; i < fonts.length; i++) {
        var font = fonts[i];
        if (!font) continue;
        var family = "";
        var name = "";
        var fullName = "";
        try { family = String(font.fontFamily || ""); } catch (familyErr) { family = ""; }
        try { name = String(font.name || ""); } catch (nameErr) { name = ""; }
        try { fullName = String(font.fullName || ""); } catch (fullNameErr) { fullName = ""; }
        if (family !== "") lookup[normalizeFontLookupKey(family)] = family;
        if (name !== "" && family !== "" && !lookup[normalizeFontLookupKey(name)]) lookup[normalizeFontLookupKey(name)] = family;
        if (fullName !== "" && family !== "" && !lookup[normalizeFontLookupKey(fullName)]) lookup[normalizeFontLookupKey(fullName)] = family;
    }
    installedFontFamilyLookupCache = lookup;
    return lookup;
}

function resolveInstalledFontFamily(fontName) {
    var requested = normalizeFontFallbackRuleValue(fontName);
    if (requested === "") return "";
    var cacheKey = normalizeFontLookupKey(requested);
    if (resolvedFontFallbackFamilyCache.hasOwnProperty(cacheKey)) return resolvedFontFallbackFamilyCache[cacheKey];
    var lookup = getInstalledFontFamilyLookup();
    var resolved = lookup[cacheKey] || "";
    resolvedFontFallbackFamilyCache[cacheKey] = resolved;
    return resolved;
}

function pickInstalledFontFamily(candidates) {
    for (var i = 0; i < candidates.length; i++) {
        var resolved = resolveInstalledFontFamily(candidates[i]);
        if (resolved !== "") return resolved;
    }
    return "";
}

function getDefaultFontFallbackRuleDefinitions() {
    return [
        { key: "CYRILLIC", candidates: ["Arial", "Arial MT", "Helvetica Neue", "Segoe UI", "Noto Sans"] },
        { key: "GREEK", candidates: ["Arial", "Arial MT", "Helvetica Neue", "Segoe UI", "Noto Sans"] },
        { key: "ARABIC", candidates: ["Geeza Pro", "Adobe Arabic", "Arial", "Arial Unicode MS", "Tahoma", "Segoe UI", "Noto Sans Arabic", "Noto Naskh Arabic"] },
        { key: "HEBREW", candidates: ["Arial Hebrew", "Arial", "Tahoma", "Segoe UI", "Noto Sans Hebrew"] },
        { key: "DEVANAGARI", candidates: ["Kohinoor Devanagari", "Nirmala UI", "Mangal", "Noto Sans Devanagari"] },
        { key: "THAI", candidates: ["Thonburi", "Leelawadee UI", "Tahoma", "Noto Sans Thai"] },
        { key: "ARMENIAN", candidates: ["Mshtakan", "Arial Unicode MS", "Noto Sans Armenian"] },
        { key: "GEORGIAN", candidates: ["Helvetica Neue", "Sylfaen", "Arial Unicode MS", "Noto Sans Georgian"] },
        { key: "BENGALI", candidates: ["Bangla MN", "Nirmala UI", "Vrinda", "Noto Sans Bengali"] },
        { key: "GURMUKHI", candidates: ["Raavi", "Noto Sans Gurmukhi"] },
        { key: "GUJARATI", candidates: ["Gujarati MT", "Shruti", "Noto Sans Gujarati"] },
        { key: "TAMIL", candidates: ["Tamil MN", "Latha", "Noto Sans Tamil"] },
        { key: "TELUGU", candidates: ["Kohinoor Telugu", "Gautami", "Noto Sans Telugu"] },
        { key: "KANNADA", candidates: ["Kohinoor Kannada", "Tunga", "Noto Sans Kannada"] },
        { key: "MALAYALAM", candidates: ["Malayalam MN", "Kartika", "Noto Sans Malayalam"] },
        { key: "SINHALA", candidates: ["Sinhala MN", "Iskoola Pota", "Noto Sans Sinhala"] },
        { key: "LAO", candidates: ["Lao MN", "DokChampa", "Noto Sans Lao"] },
        { key: "JA", candidates: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "Noto Sans CJK JP"] },
        { key: "ZH", candidates: ["PingFang SC", "PingFang TC", "Microsoft YaHei", "SimSun", "Noto Sans CJK SC"] },
        { key: "KO", candidates: ["Apple SD Gothic Neo", "Malgun Gothic", "NanumGothic", "Noto Sans CJK KR"] },
        { key: "CJK", candidates: ["PingFang SC", "Hiragino Sans", "Apple SD Gothic Neo", "Microsoft YaHei", "Yu Gothic", "Malgun Gothic", "Noto Sans CJK SC"] }
    ];
}

function buildDefaultFontFallbackRulesSetting() {
    var defs = getDefaultFontFallbackRuleDefinitions();
    var lines = [];
    for (var i = 0; i < defs.length; i++) {
        lines.push(defs[i].key + "=" + pickInstalledFontFamily(defs[i].candidates));
    }
    return lines.join("\n");
}

function parseFontFallbackRules(rawValue) {
    var text = normalizeFontFallbackRulesSetting(rawValue);
    var lines = text.split("\n");
    var parsed = {};
    for (var i = 0; i < lines.length; i++) {
        var line = String(lines[i] || "").replace(/^\s+|\s+$/g, "");
        if (line === "" || line.indexOf("#") === 0 || line.indexOf("//") === 0 || line.indexOf(";") === 0) continue;
        var separatorIndex = line.indexOf("=");
        if (separatorIndex < 0) separatorIndex = line.indexOf(":");
        if (separatorIndex < 0) continue;
        var key = normalizeFontFallbackRuleKey(line.substring(0, separatorIndex));
        var value = normalizeFontFallbackRuleValue(line.substring(separatorIndex + 1));
        if (key === "") continue;
        if (value === "") {
            delete parsed[key];
        } else {
            parsed[key] = value;
        }
    }
    return parsed;
}

function getParsedFontFallbackRules() {
    var raw = normalizeFontFallbackRulesSetting(fontFallbackRulesSetting);
    if (parsedFontFallbackRulesCacheRaw !== raw) {
        parsedFontFallbackRulesCacheRaw = raw;
        parsedFontFallbackRulesCache = parseFontFallbackRules(raw);
        fontFallbackWarningCache = {};
    }
    return parsedFontFallbackRulesCache;
}

function countConfiguredFontFallbackRules(rawValue) {
    var parsed = parseFontFallbackRules(rawValue);
    var count = 0;
    for (var key in parsed) {
        if (!parsed.hasOwnProperty(key)) continue;
        count++;
    }
    return count;
}

function resetFontFallbackCaches() {
    parsedFontFallbackRulesCacheRaw = null;
    parsedFontFallbackRulesCache = {};
    resolvedFontFallbackFamilyCache = {};
    fontFallbackWarningCache = {};
}

function extractPrimaryLanguageSubtag(langCode) {
    var normalized = normalizeFontFallbackRuleKey(langCode);
    if (normalized === "") return "";
    var parts = normalized.split(/[-_]/);
    return parts.length > 0 ? parts[0] : normalized;
}

function getFontFallbackScriptKeysForLanguage(langCode) {
    var primary = extractPrimaryLanguageSubtag(langCode);
    var keys = [];
    var addKey = function(key) {
        if (!key) return;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === key) return;
        }
        keys.push(key);
    };

    if (primary === "BG" || primary === "RU" || primary === "UK" || primary === "SR" || primary === "MK" || primary === "BE" || primary === "KK" || primary === "KY" || primary === "TG" || primary === "MN") addKey("CYRILLIC");
    if (primary === "EL") addKey("GREEK");
    if (primary === "AR" || primary === "FA" || primary === "UR" || primary === "PS" || primary === "KU" || primary === "SD") addKey("ARABIC");
    if (primary === "HE" || primary === "IW" || primary === "YI") addKey("HEBREW");
    if (primary === "HI" || primary === "MR" || primary === "NE" || primary === "SA") addKey("DEVANAGARI");
    if (primary === "TH") addKey("THAI");
    if (primary === "HY") addKey("ARMENIAN");
    if (primary === "KA") addKey("GEORGIAN");
    if (primary === "BN") addKey("BENGALI");
    if (primary === "PA") addKey("GURMUKHI");
    if (primary === "GU") addKey("GUJARATI");
    if (primary === "TA") addKey("TAMIL");
    if (primary === "TE") addKey("TELUGU");
    if (primary === "KN") addKey("KANNADA");
    if (primary === "ML") addKey("MALAYALAM");
    if (primary === "SI") addKey("SINHALA");
    if (primary === "LO") addKey("LAO");
    if (primary === "JA") { addKey("JA"); addKey("CJK"); }
    if (primary === "ZH") { addKey("ZH"); addKey("CJK"); }
    if (primary === "KO") { addKey("KO"); addKey("CJK"); }

    return keys;
}

function detectFontFallbackScriptKeysFromText(text) {
    var content = String(text || "");
    var keys = [];
    var addKey = function(key) {
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === key) return;
        }
        keys.push(key);
    };

    if (/[\u0400-\u04FF\u0500-\u052F]/.test(content)) addKey("CYRILLIC");
    if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(content)) addKey("GREEK");
    if (/[\u0590-\u05FF]/.test(content)) addKey("HEBREW");
    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(content)) addKey("ARABIC");
    if (/[\u0900-\u097F]/.test(content)) addKey("DEVANAGARI");
    if (/[\u0E00-\u0E7F]/.test(content)) addKey("THAI");
    if (/[\u0530-\u058F]/.test(content)) addKey("ARMENIAN");
    if (/[\u10A0-\u10FF]/.test(content)) addKey("GEORGIAN");
    if (/[\u0980-\u09FF]/.test(content)) addKey("BENGALI");
    if (/[\u0A00-\u0A7F]/.test(content)) addKey("GURMUKHI");
    if (/[\u0A80-\u0AFF]/.test(content)) addKey("GUJARATI");
    if (/[\u0B80-\u0BFF]/.test(content)) addKey("TAMIL");
    if (/[\u0C00-\u0C7F]/.test(content)) addKey("TELUGU");
    if (/[\u0C80-\u0CFF]/.test(content)) addKey("KANNADA");
    if (/[\u0D00-\u0D7F]/.test(content)) addKey("MALAYALAM");
    if (/[\u0D80-\u0DFF]/.test(content)) addKey("SINHALA");
    if (/[\u0E80-\u0EFF]/.test(content)) addKey("LAO");
    if (/[\u3040-\u30FF]/.test(content)) { addKey("JA"); addKey("CJK"); }
    if (/[\uAC00-\uD7AF]/.test(content)) { addKey("KO"); addKey("CJK"); }
    if (/[\u3400-\u4DBF\u4E00-\u9FFF]/.test(content)) addKey("CJK");

    return keys;
}

function buildFontFallbackCandidateKeys(langCode, textContent) {
    var textScriptKeys = detectFontFallbackScriptKeysFromText(textContent);
    if (textScriptKeys.length === 0) return [];

    var keys = [];
    var addKey = function(key) {
        var normalized = normalizeFontFallbackRuleKey(key);
        if (normalized === "") return;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === normalized) return;
        }
        keys.push(normalized);
    };

    var fullCode = normalizeFontFallbackRuleKey(langCode);
    var primaryCode = extractPrimaryLanguageSubtag(langCode);
    if (fullCode !== "") addKey(fullCode);
    if (primaryCode !== "" && primaryCode !== fullCode) addKey(primaryCode);

    var langScriptKeys = getFontFallbackScriptKeysForLanguage(langCode);
    for (var i = 0; i < langScriptKeys.length; i++) addKey(langScriptKeys[i]);
    for (var j = 0; j < textScriptKeys.length; j++) addKey(textScriptKeys[j]);
    return keys;
}

function resolveFontFallbackForText(langCode, textContent) {
    if (!fontFallbackEnabled) return null;
    var parsed = getParsedFontFallbackRules();
    var candidateKeys = buildFontFallbackCandidateKeys(langCode, textContent);
    if (candidateKeys.length === 0) return null;

    for (var i = 0; i < candidateKeys.length; i++) {
        var key = candidateKeys[i];
        if (!parsed.hasOwnProperty(key)) continue;
        var requestedFamily = parsed[key];
        var resolvedFamily = resolveInstalledFontFamily(requestedFamily);
        if (resolvedFamily !== "") {
            return { key: key, requestedFamily: requestedFamily, family: resolvedFamily, verifiedInstalled: true };
        }
        if (requestedFamily !== "") {
            return { key: key, requestedFamily: requestedFamily, family: requestedFamily, verifiedInstalled: false };
        }
    }
    return null;
}

function applyOptionalFontFallback(appliedRange, originalFamily, originalStyle, fallbackInfo, langCode, textContent) {
    if (!fallbackInfo || !fallbackInfo.family) return;
    if (normalizeFontLookupKey(fallbackInfo.family) === normalizeFontLookupKey(originalFamily)) return;

    var applied = false;
    try {
        appliedRange.appliedFont = fallbackInfo.family;
        applied = true;
    } catch (fontErr) {
        var warningKey = normalizeFontFallbackRuleKey(fallbackInfo.key) + "::apply::" + normalizeFontLookupKey(fallbackInfo.family);
        if (!fontFallbackWarningCache[warningKey]) {
            fontFallbackWarningCache[warningKey] = true;
            writeLog("Schrift-Fallback '" + fallbackInfo.family + "' fuer '" + fallbackInfo.key + "' konnte nicht angewendet werden (" + (fontErr.message || fontErr) + ").", "WARNUNG");
        }
    }

    if (!applied) return;
    try { appliedRange.fontStyle = originalStyle; } catch (styleErr) { try { appliedRange.fontStyle = "Regular"; } catch (styleErr2) {} }
    writeDebugLog("font_fallback: lang=" + normalizeFontFallbackRuleKey(langCode) + " key=" + fallbackInfo.key + " family=" + fallbackInfo.family + " text=" + normalizeDebugSnippet(textContent, 80));
}

function normalizeTranslationProvider(providerId) {
    var normalized = String(providerId || "").replace(/^\s+|\s+$/g, "").toLowerCase();
    if (normalized === "local" || normalized === "local_llm" || normalized.indexOf("lm studio") !== -1 || normalized.indexOf("ollama") !== -1) return "local";
    if (normalized === "gemini" || normalized === "google" || normalized.indexOf("gemini") !== -1) return "gemini";
    if (normalized === "claude" || normalized === "anthropic" || normalized.indexOf("claude") !== -1) return "claude";
    if (normalized === "openai" || normalized === "chatgpt") return "openai";
    return "deepl";
}

function normalizeOpenAIModel(modelName) {
    var normalized = String(modelName || "").replace(/^\s+|\s+$/g, "");
    return normalized !== "" ? normalized : "gpt-5.4-mini";
}

function normalizeGeminiModel(modelName) {
    var normalized = String(modelName || "").replace(/^\s+|\s+$/g, "");
    return normalized !== "" ? normalized : "gemini-2.5-flash";
}

function normalizeClaudeModel(modelName) {
    var normalized = String(modelName || "").replace(/^\s+|\s+$/g, "");
    return normalized !== "" ? normalized : "claude-sonnet-4-6";
}

function normalizeLocalLLMModel(modelName) {
    return String(modelName || "").replace(/^\s+|\s+$/g, "");
}

function normalizeLocalLLMBaseURL(url) {
    var normalized = String(url || "").replace(/^\s+|\s+$/g, "");
    if (normalized === "") return "";
    normalized = normalized.replace(/\/+$/g, "");
    normalized = normalized.replace(/\/(responses|chat\/completions)$/i, "");
    normalized = normalized.replace(/\/api$/i, "");
    if (!/\/v\d+$/i.test(normalized)) normalized += "/v1";
    return normalized;
}

function getTranslationProviderDisplayName(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "local") return t("provider_local");
    if (normalized === "openai") return t("provider_openai");
    if (normalized === "gemini") return t("provider_gemini");
    if (normalized === "claude") return t("provider_claude");
    return t("provider_deepl");
}

function getActiveTranslationProvider() {
    return normalizeTranslationProvider(translationProviderSetting);
}

function getProviderValidationMessage(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "openai") {
        return (!openAIKey || openAIKey === "") ? t("validation_enter_openai_key") : "";
    }
    if (normalized === "gemini") {
        return (!geminiKey || geminiKey === "") ? t("validation_enter_gemini_key") : "";
    }
    if (normalized === "claude") {
        return (!claudeKey || claudeKey === "") ? t("validation_enter_claude_key") : "";
    }
    if (normalized === "local") {
        if (!localLLMBaseURL || localLLMBaseURL === "") return t("validation_enter_local_llm_base_url");
        if (!localLLMModel || localLLMModel === "") return t("validation_enter_local_llm_model");
        return "";
    }
    return (!apiKey || apiKey === "") ? t("validation_enter_deepl_key") : "";
}

function getStructuredProviderModel(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "local") return normalizeLocalLLMModel(localLLMModel);
    if (normalized === "openai") return normalizeOpenAIModel(openAIModel);
    if (normalized === "gemini") return normalizeGeminiModel(geminiModel);
    if (normalized === "claude") return normalizeClaudeModel(claudeModel);
    return "";
}

function getProviderStringKey(providerId, suffix) {
    var normalized = normalizeTranslationProvider(providerId);
    return normalized + "_" + suffix;
}

function getProviderDebugPrefix(providerId) {
    return normalizeTranslationProvider(providerId);
}

function isStructuredLLMProvider(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    return normalized === "local" || normalized === "openai" || normalized === "gemini" || normalized === "claude";
}

function isProviderBrandedError(providerId, message) {
    var providerName = getTranslationProviderDisplayName(providerId);
    var raw = String(message || "");
    return raw.indexOf(providerName) === 0 ||
        raw.indexOf("Local LLM") === 0 ||
        raw.indexOf("Lokales LLM") === 0 ||
        raw.indexOf("OpenAI") === 0 ||
        raw.indexOf("Gemini") === 0 ||
        raw.indexOf("Claude") === 0;
}

function getDefaultProviderTargetLangCode(code) {
    var normalized = String(code || "").toUpperCase();
    if (normalized === "EN") return "EN-GB";
    if (normalized === "PT") return "PT-PT";
    return normalized;
}

function normalizeRefSymbols(symbols) {
    var raw = (symbols === null || symbols === undefined) ? "" : String(symbols);
    raw = raw.replace(/^\s+|\s+$/g, "");
    if (raw === "") raw = "[]";

    var compact = raw.replace(/\s+/g, "");
    var tokens = [];
    if (/[;,|]/.test(compact)) {
        tokens = compact.split(/[;,|]+/);
    } else if (compact.length >= 2 && compact.length % 2 === 0) {
        for (var i = 0; i < compact.length; i += 2) tokens.push(compact.substr(i, 2));
    } else {
        tokens = [compact];
    }

    var normalized = [];
    var seen = {};
    for (var j = 0; j < tokens.length; j++) {
        var token = tokens[j];
        if (!token || token.length < 2) continue;
        var openChar = token.charAt(0);
        var closeChar = token.charAt(token.length - 1);
        var pair = openChar + closeChar;
        if (!seen[pair]) {
            normalized.push(pair);
            seen[pair] = true;
        }
    }
    if (normalized.length === 0) normalized.push("[]");
    return normalized.join(", ");
}

function normalizeBackPageTrackerSetting(value) {
    var raw = (value === null || value === undefined) ? "" : String(value);
    raw = raw.replace(/^\s+|\s+$/g, "");
    if (raw === "") raw = "©";
    return raw;
}

function getReferenceSymbolPairs(symbols) {
    var normalized = normalizeRefSymbols(symbols);
    var parts = normalized.split(/\s*,\s*/);
    var pairs = [];
    for (var i = 0; i < parts.length; i++) {
        if (!parts[i] || parts[i].length < 2) continue;
        pairs.push({ token: parts[i], open: parts[i].charAt(0), close: parts[i].charAt(parts[i].length - 1) });
    }
    if (pairs.length === 0) pairs.push({ token: "[]", open: "[", close: "]" });
    return pairs;
}

function escapeGrepLiteral(text) {
    return String(text).replace(/([\\\^\$\.\|\?\*\+\(\)\[\]\{\}\-])/g, "\\$1");
}

function buildReferenceMarkerPattern(symbols) {
    var pairs = getReferenceSymbolPairs(symbols);
    var patterns = [];
    for (var i = 0; i < pairs.length; i++) {
        patterns.push(escapeGrepLiteral(pairs[i].open) + "\\s*\\d+\\s*" + escapeGrepLiteral(pairs[i].close));
    }
    if (patterns.length === 0) return "(\\[[0-9]+\\])";
    return "(" + patterns.join("|") + ")";
}

function extractReferenceNumber(text) {
    var match = String(text || "").match(/\d+/);
    if (!match) return "";
    return String(parseInt(match[0], 10));
}

function getLocalizedLanguageName(code) {
    var upper = normalizeTranslationLanguageCode(code);
    if (upper === "DE") return UI_IS_GERMAN ? "Deutsch" : "German";
    var option = getTranslationLanguageOption(upper);
    if (option) {
        if (UI_IS_GERMAN) return option.labelDe || option.labelEn || upper;
        return option.labelEn || option.labelDe || upper;
    }
    return upper;
}

function buildManualLanguageList() {
    return buildManualLanguageListForMode(false);
}

function appendManualLanguageOptionItems(list, options, seen) {
    for (var i = 0; i < options.length; i++) {
        var code = normalizeTranslationLanguageCode(options[i].code);
        if (code === "" || seen[code]) continue;
        list.push(code + " (" + getLocalizedLanguageName(code) + ")");
        seen[code] = true;
    }
}

function buildManualLanguageListForMode(includeExtended) {
    var list = [];
    var seen = {};
    var favoriteCodes = ["EN", "FR", "IT", "ES", "CS", "HU", "DE"];
    list.push(t("lang_group_favorites"));
    for (var i = 0; i < favoriteCodes.length; i++) {
        var favoriteCode = normalizeTranslationLanguageCode(favoriteCodes[i]);
        list.push(favoriteCode + " (" + getLocalizedLanguageName(favoriteCode) + ")");
        seen[favoriteCode] = true;
    }

    list.push(t("lang_group_other_eu"));
    appendManualLanguageOptionItems(list, LEGACY_BDA_LANGUAGE_OPTIONS, seen);

    if (includeExtended) {
        list.push(t("lang_group_more_deepl"));
        appendManualLanguageOptionItems(list, DEEPL_TARGET_LANGUAGE_OPTIONS, seen);
    }
    return list;
}

function getHyperlinkLanguageEntries() {
    var entries = [{ code: "DE", label: getLocalizedLanguageName("DE") }];
    for (var i = 0; i < LEGACY_BDA_EXTENDED_LANGUAGE_OPTIONS.length; i++) {
        entries.push({
            code: LEGACY_BDA_EXTENDED_LANGUAGE_OPTIONS[i].code,
            label: getLocalizedLanguageName(LEGACY_BDA_EXTENDED_LANGUAGE_OPTIONS[i].code)
        });
    }
    return entries;
}

function buildHyperlinkLanguageList() {
    var entries = getHyperlinkLanguageEntries();
    var list = [];
    for (var i = 0; i < entries.length; i++) {
        list.push(entries[i].code + " (" + entries[i].label + ")");
    }
    return list;
}

function extractLanguageCodeFromOption(optionText) {
    var match = String(optionText || "").match(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*/);
    return match ? normalizeTranslationLanguageCode(match[0]) : "";
}

function normalizeHyperlinkPageMappings(rawMappings) {
    var normalized = {};
    if (!rawMappings) return normalized;
    for (var key in rawMappings) {
        if (!rawMappings.hasOwnProperty(key)) continue;
        var code = normalizeTranslationLanguageCode(key);
        if (!isSupportedLegacyLanguageCode(code)) continue;
        var pageValue = String(rawMappings[key] === null || rawMappings[key] === undefined ? "" : rawMappings[key]).replace(/^\s+|\s+$/g, "");
        if (pageValue === "") continue;
        normalized[code] = pageValue;
    }
    return normalized;
}

function mergeHyperlinkPageMappings(baseMappings, overrideMappings) {
    var merged = normalizeHyperlinkPageMappings(baseMappings);
    var override = normalizeHyperlinkPageMappings(overrideMappings);
    for (var key in override) {
        if (!override.hasOwnProperty(key)) continue;
        merged[key] = override[key];
    }
    return merged;
}

function loadHyperlinkPageMappings(rawText) {
    var content = String(rawText || "").replace(/^\s+|\s+$/g, "");
    if (content === "") return {};
    try {
        return normalizeHyperlinkPageMappings(eval("(" + content + ")"));
    } catch (e) {
        return {};
    }
}

function serializeHyperlinkPageMappings(pageMappings) {
    var mappings = normalizeHyperlinkPageMappings(pageMappings);
    var parts = [];
    for (var key in mappings) {
        if (!mappings.hasOwnProperty(key)) continue;
        var safeKey = String(key).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        var safeValue = String(mappings[key]).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        parts.push('"' + safeKey + '":"' + safeValue + '"');
    }
    return "{" + parts.join(",") + "}";
}

function formatHyperlinkPageMappings(pageMappings) {
    var mappings = normalizeHyperlinkPageMappings(pageMappings);
    var entries = getHyperlinkLanguageEntries();
    var lines = [];
    var seen = {};
    for (var i = 0; i < entries.length; i++) {
        var code = entries[i].code;
        if (!mappings.hasOwnProperty(code)) continue;
        lines.push(code + " -> " + mappings[code]);
        seen[code] = true;
    }
    for (var key in mappings) {
        if (!mappings.hasOwnProperty(key) || seen[key]) continue;
        lines.push(key + " -> " + mappings[key]);
    }
    if (lines.length === 0) return t("hyperlink_no_mappings_saved");
    return lines.join("\r");
}

function hasOwnMappings(map) {
    if (!map) return false;
    for (var key in map) {
        if (map.hasOwnProperty(key)) return true;
    }
    return false;
}

function saveHyperlinkSettings(symbols, pageMappings) {
    refSymbolsSetting = normalizeRefSymbols(symbols || refSymbolsSetting);
    app.insertLabel(REF_SYMBOLS_LABEL, refSymbolsSetting);
    if (pageMappings) {
        hyperlinkPageMappings = normalizeHyperlinkPageMappings(pageMappings);
        app.insertLabel(HYPERLINK_PAGE_MAP_LABEL, serializeHyperlinkPageMappings(hyperlinkPageMappings));
    }
}

function collectTOCTextEntries(page) {
    var items = [];
    if (!page || !page.isValid) return items;
    var allPageItems = [];
    try { allPageItems = page.allPageItems; } catch (e) { allPageItems = []; }
    for (var i = 0; i < allPageItems.length; i++) {
        if (!allPageItems[i] || !allPageItems[i].isValid || allPageItems[i].constructor.name !== "TextFrame") continue;
        items.push({ type: "frame", obj: allPageItems[i] });
        try {
            var tables = allPageItems[i].tables;
            for (var tIndex = 0; tIndex < tables.length; tIndex++) {
                var cells = tables[tIndex].cells;
                for (var c = 0; c < cells.length; c++) items.push({ type: "cell", obj: cells[c] });
            }
        } catch (tableErr) {}
    }
    return items;
}

function getTOCItemContents(itemEntry) {
    var textObj = getHyperlinkTextObjectFromItemEntry(itemEntry);
    if (!textObj || !textObj.isValid) return "";
    try { return String(textObj.contents); } catch (e) { return ""; }
}

function extractTOCLanguageCodeFromItem(itemEntry) {
    var rawText = getTOCItemContents(itemEntry);
    var code = extractSupportedLanguageCode(rawText);
    return code ? code.toUpperCase() : "";
}

function hasTOCPageMarkerText(text) {
    return /\([^()]*\)/.test(String(text || ""));
}

function extractTOCPageSetting(text) {
    var match = String(text || "").match(/\(([^()]*)\)/);
    if (!match) return "";
    var value = String(match[1] || "").replace(/^\s+|\s+$/g, "");
    if (value === "" || /^[Xx]+$/.test(value)) return "";
    return value;
}

function findTOCPageTargetItem(items, markerItem) {
    if (!items || !markerItem) return null;
    if (markerItem.type === "cell") {
        try {
            var rowCells = markerItem.obj.parentRow.cells;
            for (var c = 0; c < rowCells.length; c++) {
                if (rowCells[c] === markerItem.obj) continue;
                if (hasTOCPageMarkerText(getTOCItemContents({ type: "cell", obj: rowCells[c] }))) {
                    return { type: "cell", obj: rowCells[c] };
                }
            }
        } catch (e) {}
        return null;
    }

    var markerBounds = null;
    try { markerBounds = markerItem.obj.geometricBounds; } catch (boundsErr) { markerBounds = null; }
    if (!markerBounds) return null;
    var markerCenterY = (markerBounds[0] + markerBounds[2]) / 2;
    for (var i = 0; i < items.length; i++) {
        if (items[i].type !== "frame" || items[i].obj === markerItem.obj) continue;
        var frameBounds = null;
        try { frameBounds = items[i].obj.geometricBounds; } catch (e2) { frameBounds = null; }
        if (!frameBounds) continue;
        var frameCenterY = (frameBounds[0] + frameBounds[2]) / 2;
        if (Math.abs(markerCenterY - frameCenterY) >= 10) continue;
        if (hasTOCPageMarkerText(getTOCItemContents(items[i]))) return items[i];
    }
    return null;
}

function collectCoverHyperlinkPageMappings(doc) {
    var mappings = {};
    if (!doc || !doc.isValid || doc.pages.length === 0) return mappings;
    var items = collectTOCTextEntries(doc.pages[0]);
    for (var i = 0; i < items.length; i++) {
        var langCode = extractTOCLanguageCodeFromItem(items[i]);
        if (!langCode || mappings.hasOwnProperty(langCode)) continue;
        var targetItem = findTOCPageTargetItem(items, items[i]);
        if (!targetItem) continue;
        var pageSetting = extractTOCPageSetting(getTOCItemContents(targetItem));
        if (pageSetting !== "") mappings[langCode] = pageSetting;
    }
    return mappings;
}

function getHyperlinkPageMappingsForDialog(doc) {
    return mergeHyperlinkPageMappings(collectCoverHyperlinkPageMappings(doc), hyperlinkPageMappings);
}

function getRuntimeHyperlinkPageMappings(doc, explicitMappings) {
    return mergeHyperlinkPageMappings(collectCoverHyperlinkPageMappings(doc), explicitMappings ? explicitMappings : hyperlinkPageMappings);
}

function getTextObjectParentPage(textObj) {
    if (!textObj || !textObj.isValid) return null;
    try {
        var parentFrames = textObj.parentTextFrames;
        if (parentFrames && parentFrames.length > 0) {
            for (var i = 0; i < parentFrames.length; i++) {
                if (parentFrames[i] && parentFrames[i].isValid && parentFrames[i].parentPage && parentFrames[i].parentPage.isValid) {
                    return parentFrames[i].parentPage;
                }
            }
        }
    } catch (e) {}
    try {
        var story = textObj.parentStory;
        if (story && story.isValid && story.textContainers && story.textContainers.length > 0) {
            for (var j = 0; j < story.textContainers.length; j++) {
                var container = story.textContainers[j];
                if (container && container.isValid && container.parentPage && container.parentPage.isValid) {
                    return container.parentPage;
                }
            }
        }
    } catch (e2) {}
    return null;
}

function findPageLanguageBadgeCode(page) {
    if (!page || !page.isValid) return "";
    var frames = getTextFramesFromContainer(page);
    var best = null;
    for (var i = 0; i < frames.length; i++) {
        var tf = frames[i];
        var textObj = null;
        try { if (tf.texts && tf.texts.length > 0) textObj = tf.texts[0]; } catch (e) { textObj = null; }
        if (!textObj || !textObj.isValid) {
            var story = getTextFrameStory(tf);
            if (!story) continue;
            textObj = story;
        }
        var code = extractSupportedLanguageCode(textObj.contents);
        if (!code) continue;
        var score = 0;
        try { if (hasBlackBadgeBackground(tf)) score += 40; } catch (e2) {}
        try {
            var bounds = tf.geometricBounds;
            var pageBounds = page.bounds;
            var frameCenterX = (bounds[1] + bounds[3]) / 2;
            var frameCenterY = (bounds[0] + bounds[2]) / 2;
            var pageCenterX = (pageBounds[1] + pageBounds[3]) / 2;
            var pageCenterY = (pageBounds[0] + pageBounds[2]) / 2;
            if (frameCenterX >= pageCenterX) score += 20;
            if (frameCenterY <= pageCenterY) score += 20;
        } catch (e3) {}
        if (!best || score > best.score) best = { code: code, score: score };
    }
    return best ? String(best.code).toUpperCase() : "";
}

function getPageLanguageCode(page) {
    if (!page || !page.isValid) return "";
    try {
        if (page.appliedMaster && page.appliedMaster.isValid) {
            var masterLang = getMasterLang(page.appliedMaster.name);
            if (masterLang) return String(masterLang).toUpperCase();
        }
    } catch (e) {}
    var pageBadgeCode = findPageLanguageBadgeCode(page);
    if (pageBadgeCode) return pageBadgeCode;
    try {
        if (page.appliedMaster && page.appliedMaster.isValid) {
            var masterBadge = findMasterLanguageBadge(page.appliedMaster, null);
            if (masterBadge && masterBadge.code) return String(masterBadge.code).toUpperCase();
        }
    } catch (e2) {}
    return "";
}

function getSelectionParentPageSafe(item) {
    if (!item || !item.isValid) return null;
    try {
        if (item.parentPage && item.parentPage.isValid) return item.parentPage;
    } catch (e) {}
    try {
        var textPage = getTextObjectParentPage(item);
        if (textPage && textPage.isValid) return textPage;
    } catch (e2) {}
    try {
        if (item.parent && item.parent.parentPage && item.parent.parentPage.isValid) return item.parent.parentPage;
    } catch (e3) {}
    return null;
}

function addUniquePageById(targetPages, seenPageIds, page) {
    if (!page || !page.isValid) return;
    var pageId = null;
    try { pageId = page.id; } catch (e) { pageId = null; }
    var pageKey = (pageId !== null) ? String(pageId) : String(page.name || targetPages.length);
    if (seenPageIds[pageKey]) return;
    seenPageIds[pageKey] = true;
    targetPages.push(page);
}

function getPagesFromCurrentSpellcheckContext(doc) {
    var pages = [];
    var seen = {};
    if (!doc || !doc.isValid) return pages;

    if (radioSelection && radioSelection.value) {
        try {
            var selectionItems = app.selection || [];
            for (var i = 0; i < selectionItems.length; i++) {
                addUniquePageById(pages, seen, getSelectionParentPageSafe(selectionItems[i]));
            }
        } catch (eSel) {}
        if (pages.length > 0) return pages;
    }

    if (radioPages && radioPages.value) {
        try {
            var manualPages = getPagesFromString(doc, editPages.text);
            for (var j = 0; j < manualPages.length; j++) addUniquePageById(pages, seen, manualPages[j]);
        } catch (ePages) {}
        if (pages.length > 0) return pages;
    }

    if (radioBDA && radioBDA.value) {
        var rawSourcePages = String(bdaSourceInput && bdaSourceInput.text ? bdaSourceInput.text : "").replace(/^\s+|\s+$/g, "");
        if (rawSourcePages !== "" && rawSourcePages.toUpperCase() !== "AUTO") {
            try {
                var bdaPages = getPagesFromString(doc, rawSourcePages);
                for (var k = 0; k < bdaPages.length; k++) addUniquePageById(pages, seen, bdaPages[k]);
            } catch (eBda) {}
            if (pages.length > 0) return pages;
        }
    }

    return pages;
}

function detectSourceLanguageCode(doc) {
    var contextualPages = getPagesFromCurrentSpellcheckContext(doc);
    var i;
    for (i = 0; i < contextualPages.length; i++) {
        var contextualCode = getPageLanguageCode(contextualPages[i]);
        if (contextualCode) return String(contextualCode).toUpperCase();
    }
    for (i = 0; i < doc.pages.length; i++) {
        var code = getPageLanguageCode(doc.pages[i]);
        if (code) return String(code).toUpperCase();
    }
    return "";
}

function getLanguageToolCodeForLanguage(langCode) {
    var upper = String(langCode || "").toUpperCase();
    var map = {
        DE: "de-DE",
        EN: "en-GB",
        FR: "fr",
        IT: "it",
        ES: "es",
        CS: "cs",
        HU: "hu",
        BG: "bg",
        DA: "da",
        EL: "el",
        ET: "et",
        FI: "fi",
        LT: "lt",
        LV: "lv",
        NL: "nl",
        PL: "pl",
        PT: "pt-PT",
        RO: "ro",
        RU: "ru",
        SK: "sk",
        SL: "sl",
        SV: "sv"
    };
    return map[upper] || "";
}

function buildFormalityOptions() {
    return [t("formality_default"), t("formality_formal"), t("formality_informal")];
}

function normalizeExistingFilePath(path) {
    if (!path || path === "") return "";
    try {
        var f = new File(path);
        if (f.exists) return f.fsName;
    } catch (e) {}
    return "";
}

function getFileModifiedTick(path) {
    if (!path || path === "") return 0;
    try {
        var f = new File(path);
        if (!f.exists) return 0;
        var modified = f.modified;
        if (modified && modified.getTime) return modified.getTime();
        return new Date(modified).getTime() || 0;
    } catch (e) {
        return 0;
    }
}

function resolveCSVPath(preferredPath) {
    var resolved = normalizeExistingFilePath(preferredPath);
    var candidates = [];
    try {
        candidates.push(Folder.desktop.fsName + "/Woerterbuch.csv");
        candidates.push(Folder.desktop.fsName + "/Wörterbuch.csv");
    } catch (e) {}

    for (var i = 0; i < candidates.length; i++) {
        var candidate = normalizeExistingFilePath(candidates[i]);
        if (!candidate) continue;
        if (!resolved) {
            resolved = candidate;
            continue;
        }
        if (getFileModifiedTick(candidate) >= getFileModifiedTick(resolved)) {
            resolved = candidate;
        }
    }

    return resolved || preferredPath || "";
}

var SCRIPT_NAME = "Super Translator Pro";
var SCRIPT_VERSION = "28.2";
var apiKey = app.extractLabel(DEEPL_KEY_LABEL);
if (!apiKey || apiKey === "") {
    apiKey = ""; // HIER WURDE DER FALLBACK-KEY ENTFERNT
}
var openAIKey = app.extractLabel(OPENAI_KEY_LABEL) || "";
var openAIModel = normalizeOpenAIModel(app.extractLabel(OPENAI_MODEL_LABEL) || "gpt-5.4-mini");
var geminiKey = app.extractLabel(GEMINI_KEY_LABEL) || "";
var geminiModel = normalizeGeminiModel(app.extractLabel(GEMINI_MODEL_LABEL) || "gemini-2.5-flash");
var claudeKey = app.extractLabel(CLAUDE_KEY_LABEL) || "";
var claudeModel = normalizeClaudeModel(app.extractLabel(CLAUDE_MODEL_LABEL) || "claude-sonnet-4-6");
var localLLMBaseURL = normalizeLocalLLMBaseURL(app.extractLabel(LOCAL_LLM_BASE_URL_LABEL) || "");
var localLLMApiKey = app.extractLabel(LOCAL_LLM_API_KEY_LABEL) || "";
var localLLMModel = normalizeLocalLLMModel(app.extractLabel(LOCAL_LLM_MODEL_LABEL) || "");
var translationProviderSetting = normalizeTranslationProvider(app.extractLabel(TRANSLATION_PROVIDER_LABEL) || "deepl");

var csvPathSettingRaw = app.extractLabel(CSV_PATH_LABEL) || "";
var csvPath = resolveCSVPath(csvPathSettingRaw);
var tmPath = app.extractLabel(TM_PATH_LABEL) || (Folder.userData + "/SuperTranslatorPRO_Memory.json"); 
var TM_LOCK_TIMEOUT_MS = 15000;
var TM_LOCK_POLL_MS = 250;
var TM_LOCK_STALE_MS = 120000;
var tmRuntimeId = String(new Date().getTime()) + "_" + String(Math.floor(Math.random() * 100000));
var tmWarningCache = {};
var CSV_LOCK_TIMEOUT_MS = 15000;
var CSV_LOCK_POLL_MS = 250;
var CSV_LOCK_STALE_MS = 120000;
var glossaryRuntimeId = String(new Date().getTime()) + "_" + String(Math.floor(Math.random() * 100000));
var glossaryWarningCache = {};
var refSymbolsSetting = normalizeRefSymbols(app.extractLabel(REF_SYMBOLS_LABEL) || "[]");
var hyperlinkPageMappings = loadHyperlinkPageMappings(app.extractLabel(HYPERLINK_PAGE_MAP_LABEL) || "");
var autoBDAHyperlinksSetting = (app.extractLabel(AUTO_HYPERLINKS_LABEL) === "1");
var backPageTrackerSetting = normalizeBackPageTrackerSetting(app.extractLabel(BACK_PAGE_TRACKER_LABEL) || "©");

var FORMALITY_LABEL = "SuperTranslatorPRO_Formality";
var DNT_LABEL = "SuperTranslatorPRO_DNT_Styles";
var DEBUG_TABLE_RESTORE_LABEL = "SuperTranslatorPRO_DebugTableRestore";
var formalitySetting = app.extractLabel(FORMALITY_LABEL) || "default";
var dntStyles = app.extractLabel(DNT_LABEL) || "";
var tableRestoreDebugEnabled = (app.extractLabel(DEBUG_TABLE_RESTORE_LABEL) === "1");
var smartCopyfitEnabled = normalizeCopyfitEnabledSetting(app.extractLabel(COPYFIT_ENABLED_LABEL) || "1");
var smartCopyfitMaxTracking = normalizeCopyfitMaxTrackingSetting(app.extractLabel(COPYFIT_MAX_TRACKING_LABEL) || "-10");
var smartCopyfitMinScale = normalizeCopyfitMinScaleSetting(app.extractLabel(COPYFIT_MIN_SCALE_LABEL) || "98");
var smartCopyfitTrackingStep = normalizeCopyfitTrackingStepSetting(app.extractLabel(COPYFIT_TRACKING_STEP_LABEL) || "2");
var smartCopyfitScaleStep = normalizeCopyfitScaleStepSetting(app.extractLabel(COPYFIT_SCALE_STEP_LABEL) || "1");
var fontFallbackEnabled = normalizeFontFallbackEnabledSetting(app.extractLabel(FONT_FALLBACK_ENABLED_LABEL) || "1");
var fontFallbackRulesSetting = decodeFontFallbackRulesSettingFromLabel(app.extractLabel(FONT_FALLBACK_RULES_LABEL) || "");
var pdfExportPrintPresetSetting = app.extractLabel(PDF_EXPORT_PRINT_PRESET_LABEL) || "";
var pdfExportWebPresetSetting = app.extractLabel(PDF_EXPORT_WEB_PRESET_LABEL) || "";
var pdfExportWebSpreadsSetting = (app.extractLabel(PDF_EXPORT_WEB_SPREADS_LABEL) !== "0"); // Default true
var pdfExportWebHyperlinksSetting = (app.extractLabel(PDF_EXPORT_WEB_HYPERLINKS_LABEL) !== "0"); // Default true

var globalStats = { apiChars: 0, savedChars: 0, fittedFrames: 0 };
var progressWin, progressBar, progressText;
var overallBar, overallText, etaText, btnStopProgress;
var progressStatusBanner, progressStatusBannerText;
var cancelFlag = false;
var startTime = 0;
var germanHighlightState = null;
var germanFocusState = { activePageKey: null, fittedPageKey: null };
var germanSpellDialogLocation = null;
var mainWindowIdleTask = null;
var mainWindowLiveSignature = "";
var manualLanguageDropdownExpanded = false;
var DEEPL_TARGET_LANGUAGE_OPTIONS = [
    { code: "ACE", labelEn: "Acehnese" },
    { code: "AF", labelEn: "Afrikaans" },
    { code: "AN", labelEn: "Aragonese" },
    { code: "AR", labelDe: "Arabisch", labelEn: "Arabic" },
    { code: "AS", labelEn: "Assamese" },
    { code: "AY", labelEn: "Aymara" },
    { code: "AZ", labelDe: "Aserbaidschanisch", labelEn: "Azerbaijani" },
    { code: "BA", labelEn: "Bashkir" },
    { code: "BE", labelDe: "Belarussisch", labelEn: "Belarusian" },
    { code: "BG", labelDe: "Bulgarisch", labelEn: "Bulgarian" },
    { code: "BHO", labelEn: "Bhojpuri" },
    { code: "BN", labelDe: "Bengalisch", labelEn: "Bengali" },
    { code: "BR", labelEn: "Breton" },
    { code: "BS", labelDe: "Bosnisch", labelEn: "Bosnian" },
    { code: "CA", labelDe: "Katalanisch", labelEn: "Catalan" },
    { code: "CEB", labelEn: "Cebuano" },
    { code: "CKB", labelEn: "Kurdish (Sorani)" },
    { code: "CS", labelDe: "Tschechisch", labelEn: "Czech" },
    { code: "CY", labelDe: "Walisisch", labelEn: "Welsh" },
    { code: "DA", labelDe: "Dänisch", labelEn: "Danish" },
    { code: "DE", labelDe: "Deutsch", labelEn: "German" },
    { code: "EL", labelDe: "Griechisch", labelEn: "Greek" },
    { code: "EN", labelDe: "Englisch", labelEn: "English" },
    { code: "EN-GB", labelDe: "Englisch (UK)", labelEn: "English (British)" },
    { code: "EN-US", labelDe: "Englisch (US)", labelEn: "English (American)" },
    { code: "EO", labelDe: "Esperanto", labelEn: "Esperanto" },
    { code: "ES", labelDe: "Spanisch", labelEn: "Spanish" },
    { code: "ES-419", labelDe: "Spanisch (Lateinamerika)", labelEn: "Spanish (Latin American)" },
    { code: "ET", labelDe: "Estnisch", labelEn: "Estonian" },
    { code: "EU", labelDe: "Baskisch", labelEn: "Basque" },
    { code: "FA", labelDe: "Persisch", labelEn: "Persian" },
    { code: "FI", labelDe: "Finnisch", labelEn: "Finnish" },
    { code: "FR", labelDe: "Französisch", labelEn: "French" },
    { code: "GA", labelDe: "Irisch", labelEn: "Irish" },
    { code: "GL", labelDe: "Galicisch", labelEn: "Galician" },
    { code: "GN", labelEn: "Guarani" },
    { code: "GOM", labelEn: "Konkani" },
    { code: "GU", labelDe: "Gujarati", labelEn: "Gujarati" },
    { code: "HA", labelEn: "Hausa" },
    { code: "HE", labelDe: "Hebräisch", labelEn: "Hebrew" },
    { code: "HI", labelDe: "Hindi", labelEn: "Hindi" },
    { code: "HR", labelDe: "Kroatisch", labelEn: "Croatian" },
    { code: "HT", labelEn: "Haitian Creole" },
    { code: "HU", labelDe: "Ungarisch", labelEn: "Hungarian" },
    { code: "HY", labelDe: "Armenisch", labelEn: "Armenian" },
    { code: "ID", labelDe: "Indonesisch", labelEn: "Indonesian" },
    { code: "IG", labelEn: "Igbo" },
    { code: "IS", labelDe: "Isländisch", labelEn: "Icelandic" },
    { code: "IT", labelDe: "Italienisch", labelEn: "Italian" },
    { code: "JA", labelDe: "Japanisch", labelEn: "Japanese" },
    { code: "JV", labelEn: "Javanese" },
    { code: "KA", labelDe: "Georgisch", labelEn: "Georgian" },
    { code: "KK", labelDe: "Kasachisch", labelEn: "Kazakh" },
    { code: "KMR", labelEn: "Kurdish (Kurmanji)" },
    { code: "KO", labelDe: "Koreanisch", labelEn: "Korean" },
    { code: "KY", labelEn: "Kyrgyz" },
    { code: "LA", labelDe: "Latein", labelEn: "Latin" },
    { code: "LB", labelEn: "Luxembourgish" },
    { code: "LMO", labelEn: "Lombard" },
    { code: "LN", labelEn: "Lingala" },
    { code: "LT", labelDe: "Litauisch", labelEn: "Lithuanian" },
    { code: "LV", labelDe: "Lettisch", labelEn: "Latvian" },
    { code: "MAI", labelEn: "Maithili" },
    { code: "MG", labelDe: "Malagasy", labelEn: "Malagasy" },
    { code: "MI", labelEn: "Maori" },
    { code: "MK", labelDe: "Mazedonisch", labelEn: "Macedonian" },
    { code: "ML", labelDe: "Malayalam", labelEn: "Malayalam" },
    { code: "MN", labelDe: "Mongolisch", labelEn: "Mongolian" },
    { code: "MR", labelDe: "Marathi", labelEn: "Marathi" },
    { code: "MS", labelDe: "Malaiisch", labelEn: "Malay" },
    { code: "MT", labelDe: "Maltesisch", labelEn: "Maltese" },
    { code: "MY", labelEn: "Burmese" },
    { code: "NB", labelDe: "Norwegisch (Bokmål)", labelEn: "Norwegian Bokmål" },
    { code: "NE", labelDe: "Nepalesisch", labelEn: "Nepali" },
    { code: "NL", labelDe: "Niederländisch", labelEn: "Dutch" },
    { code: "OC", labelDe: "Okzitanisch", labelEn: "Occitan" },
    { code: "OM", labelEn: "Oromo" },
    { code: "PA", labelDe: "Punjabi", labelEn: "Punjabi" },
    { code: "PAG", labelEn: "Pangasinan" },
    { code: "PAM", labelEn: "Kapampangan" },
    { code: "PL", labelDe: "Polnisch", labelEn: "Polish" },
    { code: "PRS", labelEn: "Dari" },
    { code: "PS", labelEn: "Pashto" },
    { code: "PT", labelDe: "Portugiesisch", labelEn: "Portuguese" },
    { code: "PT-BR", labelDe: "Portugiesisch (Brasilien)", labelEn: "Portuguese (Brazilian)" },
    { code: "PT-PT", labelDe: "Portugiesisch (Europa)", labelEn: "Portuguese (European)" },
    { code: "QU", labelEn: "Quechua" },
    { code: "RO", labelDe: "Rumänisch", labelEn: "Romanian" },
    { code: "RU", labelDe: "Russisch", labelEn: "Russian" },
    { code: "SA", labelDe: "Sanskrit", labelEn: "Sanskrit" },
    { code: "SCN", labelEn: "Sicilian" },
    { code: "SK", labelDe: "Slowakisch", labelEn: "Slovak" },
    { code: "SL", labelDe: "Slowenisch", labelEn: "Slovenian" },
    { code: "SQ", labelDe: "Albanisch", labelEn: "Albanian" },
    { code: "SR", labelDe: "Serbisch", labelEn: "Serbian" },
    { code: "ST", labelEn: "Sesotho" },
    { code: "SU", labelEn: "Sundanese" },
    { code: "SV", labelDe: "Schwedisch", labelEn: "Swedish" },
    { code: "SW", labelDe: "Suaheli", labelEn: "Swahili" },
    { code: "TA", labelDe: "Tamil", labelEn: "Tamil" },
    { code: "TE", labelDe: "Telugu", labelEn: "Telugu" },
    { code: "TG", labelDe: "Tadschikisch", labelEn: "Tajik" },
    { code: "TH", labelDe: "Thailändisch", labelEn: "Thai" },
    { code: "TK", labelEn: "Turkmen" },
    { code: "TL", labelEn: "Tagalog" },
    { code: "TN", labelEn: "Tswana" },
    { code: "TR", labelDe: "Türkisch", labelEn: "Turkish" },
    { code: "TS", labelEn: "Tsonga" },
    { code: "TT", labelDe: "Tatarisch", labelEn: "Tatar" },
    { code: "UK", labelDe: "Ukrainisch", labelEn: "Ukrainian" },
    { code: "UR", labelDe: "Urdu", labelEn: "Urdu" },
    { code: "UZ", labelDe: "Usbekisch", labelEn: "Uzbek" },
    { code: "VI", labelDe: "Vietnamesisch", labelEn: "Vietnamese" },
    { code: "WO", labelEn: "Wolof" },
    { code: "XH", labelEn: "Xhosa" },
    { code: "YI", labelDe: "Jiddisch", labelEn: "Yiddish" },
    { code: "YUE", labelDe: "Kantonesisch", labelEn: "Cantonese" },
    { code: "ZH", labelDe: "Chinesisch", labelEn: "Chinese" },
    { code: "ZH-HANS", labelDe: "Chinesisch (vereinfacht)", labelEn: "Chinese (Simplified)" },
    { code: "ZH-HANT", labelDe: "Chinesisch (traditionell)", labelEn: "Chinese (Traditional)" },
    { code: "ZU", labelEn: "Zulu" }
];
var LEGACY_BDA_DEFAULT_LANGUAGE_CODES = ["EN", "FR", "IT", "ES", "CS", "HU", "BG", "DA", "EL", "ET", "FI", "LT", "LV", "NL", "PL", "PT", "RO", "RU", "SK", "SL", "SV"];
var LEGACY_BDA_LANGUAGE_OPTIONS = buildTranslationLanguageOptionSubset(LEGACY_BDA_DEFAULT_LANGUAGE_CODES);
var LEGACY_BDA_EXTENDED_LANGUAGE_OPTIONS = buildExtendedTranslationLanguageOptions(LEGACY_BDA_DEFAULT_LANGUAGE_CODES);
var TRANSLATION_LANGUAGE_OPTION_LOOKUP = buildTranslationLanguageOptionLookup(DEEPL_TARGET_LANGUAGE_OPTIONS);
var SUPPORTED_TRANSLATION_LANGUAGE_CODES = buildSupportedTranslationLanguageCodeList(false);
var SUPPORTED_TRANSLATION_LANGUAGE_CODES_WITH_GERMAN = buildSupportedTranslationLanguageCodeList(true);

function normalizeTranslationLanguageCode(code) {
    return String(code || "").replace(/[\u2010-\u2015]/g, "-").replace(/^\s+|\s+$/g, "").replace(/\s+/g, "").toUpperCase();
}

function buildTranslationLanguageOptionLookup(options) {
    var lookup = {};
    for (var i = 0; i < options.length; i++) {
        var code = normalizeTranslationLanguageCode(options[i].code);
        if (code === "" || lookup[code]) continue;
        lookup[code] = options[i];
    }
    return lookup;
}

function buildTranslationLanguageOptionSubset(codes) {
    var subset = [];
    var seen = {};
    for (var i = 0; i < codes.length; i++) {
        var targetCode = normalizeTranslationLanguageCode(codes[i]);
        if (targetCode === "" || seen[targetCode]) continue;
        for (var j = 0; j < DEEPL_TARGET_LANGUAGE_OPTIONS.length; j++) {
            var optionCode = normalizeTranslationLanguageCode(DEEPL_TARGET_LANGUAGE_OPTIONS[j].code);
            if (optionCode !== targetCode) continue;
            subset.push(DEEPL_TARGET_LANGUAGE_OPTIONS[j]);
            seen[targetCode] = true;
            break;
        }
    }
    return subset;
}

function buildExtendedTranslationLanguageOptions(baseCodes) {
    var options = buildTranslationLanguageOptionSubset(baseCodes);
    var seen = {};
    for (var i = 0; i < options.length; i++) {
        var existingCode = normalizeTranslationLanguageCode(options[i].code);
        if (existingCode !== "") seen[existingCode] = true;
    }
    for (var j = 0; j < DEEPL_TARGET_LANGUAGE_OPTIONS.length; j++) {
        var code = normalizeTranslationLanguageCode(DEEPL_TARGET_LANGUAGE_OPTIONS[j].code);
        if (code === "" || code === "DE" || seen[code]) continue;
        options.push(DEEPL_TARGET_LANGUAGE_OPTIONS[j]);
        seen[code] = true;
    }
    return options;
}

function getTranslationLanguageOption(code) {
    var normalized = normalizeTranslationLanguageCode(code);
    return normalized === "" ? null : (TRANSLATION_LANGUAGE_OPTION_LOOKUP[normalized] || null);
}

function buildSupportedTranslationLanguageCodeList(includeGerman) {
    var codes = [];
    var seen = {};
    if (includeGerman) {
        codes.push("DE");
        seen.DE = true;
    }
    for (var i = 0; i < DEEPL_TARGET_LANGUAGE_OPTIONS.length; i++) {
        var code = normalizeTranslationLanguageCode(DEEPL_TARGET_LANGUAGE_OPTIONS[i].code);
        if (code === "" || (!includeGerman && code === "DE") || seen[code]) continue;
        codes.push(code);
        seen[code] = true;
    }
    codes.sort(function(a, b) {
        if (a.length !== b.length) return b.length - a.length;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
    return codes;
}

function getLegacyDialogLanguageOptions(includeExtended) {
    return includeExtended ? LEGACY_BDA_EXTENDED_LANGUAGE_OPTIONS : LEGACY_BDA_LANGUAGE_OPTIONS;
}

function getSupportedGlossaryLanguageHeaders() {
    var headers = ["DE"];
    var seen = { DE: true };
    for (var i = 0; i < LEGACY_BDA_LANGUAGE_OPTIONS.length; i++) {
        var code = String(LEGACY_BDA_LANGUAGE_OPTIONS[i].code || "").toUpperCase();
        if (code === "" || seen[code]) continue;
        headers.push(code);
        seen[code] = true;
    }
    return headers;
}

function normalizeGlossaryLanguageCode(code) {
    return String(code || "").replace(/^\s+|\s+$/g, "").toUpperCase();
}

function getGlossaryLanguageShortCode(code) {
    var upper = normalizeGlossaryLanguageCode(code);
    return upper.length >= 2 ? upper.substring(0, 2) : upper;
}

function isMatchingGlossaryLanguageCode(a, b) {
    var upperA = normalizeGlossaryLanguageCode(a);
    var upperB = normalizeGlossaryLanguageCode(b);
    if (upperA === "" || upperB === "") return false;
    return upperA === upperB || getGlossaryLanguageShortCode(upperA) === getGlossaryLanguageShortCode(upperB);
}

function isSupportedGlossaryLanguageHeader(header) {
    return isSupportedLegacyLanguageCode(normalizeGlossaryLanguageCode(header));
}

function isGlossaryMetaHeader(header) {
    return /^_(INFO|FLAGS|ALIASES|CATEGORY|SOURCE|NOTE|NOTES|COMMENT|COMMENTS)$/i.test(String(header || ""));
}

function isGlossaryCommentRow(value) {
    var trimmed = String(value || "").replace(/^\s+|\s+$/g, "");
    if (trimmed === "") return false;
    return trimmed.indexOf("#") === 0 || trimmed.indexOf("//") === 0;
}

function parseGlossaryFlags(value) {
    var flags = {};
    var raw = String(value || "").replace(/^\s+|\s+$/g, "");
    if (raw === "") return flags;
    var parts = raw.split(/[;,|]+/);
    for (var i = 0; i < parts.length; i++) {
        var token = String(parts[i] || "").replace(/^\s+|\s+$/g, "").toUpperCase();
        if (token !== "") flags[token] = true;
    }
    return flags;
}

function parseGlossaryAliases(value) {
    var aliases = [];
    var seen = {};
    var raw = String(value || "").replace(/^\s+|\s+$/g, "");
    if (raw === "") return aliases;
    var parts = raw.split(/[|;,]+/);
    for (var i = 0; i < parts.length; i++) {
        var alias = String(parts[i] || "").replace(/^\s+|\s+$/g, "");
        if (alias === "" || seen[alias]) continue;
        aliases.push(alias);
        seen[alias] = true;
    }
    return aliases;
}

function createGlossaryTemplateRow(headers, values) {
    var row = [];
    for (var i = 0; i < headers.length; i++) {
        row.push(values.hasOwnProperty(headers[i]) ? values[headers[i]] : "");
    }
    return row;
}

function escapeCSVField(value, separator) {
    var text = String(value === null || value === undefined ? "" : value);
    if (text.indexOf('"') !== -1) text = text.replace(/"/g, '""');
    if (text.indexOf(separator) !== -1 || text.indexOf('"') !== -1 || text.indexOf("\n") !== -1 || text.indexOf("\r") !== -1) {
        text = '"' + text + '"';
    }
    return text;
}

function buildGlossaryTemplateCSV() {
    var separator = ";";
    var headers = ["_SOURCE", "_INFO", "_FLAGS", "_ALIASES"].concat(getSupportedGlossaryLanguageHeaders());
    var rows = [];

    rows.push(headers);
    rows.push(["# Super Translator Pro Glossary Template"]);
    rows.push(["# SO WIRD DIE DATEI VERWENDET:"]);
    rows.push(["# EN / FR / IT / ES ... = gewuenschte Zieluebersetzung fuer genau diese Sprache."]);
    rows.push(["# Leere Sprachzellen bedeuten: kein Glossar-Eintrag fuer diese Sprache, DeepL darf normal uebersetzen."]);
    rows.push(["# DNT in einer Sprachzelle bedeutet: in genau dieser Sprache nicht uebersetzen, Originaltext beibehalten."]);
    rows.push(["# _FLAGS=DNT (DNT = Do Not Translate) bedeutet: in allen Sprachen nicht uebersetzen, z. B. bei technischen Codes wie M5*15."]);
    rows.push(["# _ALIASES = alternative Schreibweisen in der Quellsprache dieser Zeile, mit | trennen, z. B. Duschwanne|Duschtasse."]);
    rows.push(["# _SOURCE = Quellsprache dieser Zeile. Leer = Standard DE. Wenn die Quelle z. B. Englisch ist, hier EN eintragen."]);
    rows.push(["# _INFO = Infos & Erklaerung"]);
    rows.push(["# TIPP: Wenn mehrere Varianten derselben Quellsprache denselben Zielbegriff bekommen sollen, den Hauptbegriff in der Quellspalte pflegen und Varianten in _ALIASES eintragen."]);
    rows.push(["# TIPP: Fuer feste Produktnamen oder Artikelcodes am besten DNT oder eine feste Zieluebersetzung verwenden."]);
    rows.push([""]);

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Warnung!",
        EN: "Warning!",
        FR: "Avertissement !",
        IT: "Avvertimento!",
        ES: "Advertencia!",
        CS: "Varovani!",
        HU: "Figyelmeztetes!",
        _INFO: "Beispiel fuer UI-Hinweis"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Lieferumfang",
        EN: "Scope of delivery",
        FR: "Contenu de la livraison",
        IT: "Contenuto della fornitura",
        ES: "Alcance de la entrega",
        CS: "Rozsah dodavky",
        HU: "Szallitasi terjedelem",
        _INFO: "Produkt-/Dokumentbegriff"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Montagebox",
        EN: "Mounting box",
        _INFO: "Produktbegriff, bei Bedarf manuell fuer weitere Sprachen pflegen"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "M5*15",
        _FLAGS: "DNT",
        _INFO: "Technischer Code, in allen Sprachen unveraendert lassen"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Duschunterteil",
        EN: "Shower base",
        _ALIASES: "Duschwanne|Duschtasse",
        _INFO: "Beispiel mit Aliasen"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Montagebox",
        EN: "Mounting box",
        _SOURCE: "EN",
        _INFO: "Beispiel: Quelle ist Englisch, Ziel kann z. B. DE sein"
    }));

    var lines = [];
    for (var r = 0; r < rows.length; r++) {
        var cols = rows[r];
        var lineParts = [];
        for (var c = 0; c < cols.length; c++) lineParts.push(escapeCSVField(cols[c], separator));
        lines.push(lineParts.join(separator));
    }
    return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

function writeGlossaryTemplateFile(path) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return false;

    var lockHandle = acquireGlossaryLock(normalizedPath, CSV_LOCK_TIMEOUT_MS);
    if (!lockHandle) {
        reportGlossaryWarningOnce(
            "glossary_write_busy",
            "glossary_busy_warning",
            "Glossar-Datei ist aktuell gesperrt. Template konnte nicht geschrieben werden: " + normalizedPath
        );
        return false;
    }

    var success = false;
    try {
        success = writeGlossaryContentAtomically(normalizedPath, buildGlossaryTemplateCSV());
        if (!success) {
            reportGlossaryWarningOnce(
                "glossary_write_failed",
                "glossary_write_warning",
                "Glossar-Datei konnte nicht sicher geschrieben werden: " + normalizedPath
            );
        }
    } finally {
        releaseGlossaryLock(lockHandle);
    }
    return success;
}

function promptForGlossaryPath(currentPath, allowLater) {
    var dlg = new Window("dialog", t("glossary_setup_title"));
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.margins = 16;

    dlg.add("statictext", undefined, t("glossary_setup_message"), { multiline: true });
    if (currentPath && currentPath !== "") {
        dlg.add("statictext", undefined, t("glossary_setup_current_path"));
        var currentPathView = dlg.add("edittext", undefined, currentPath, { readonly: true });
        currentPathView.characters = 42;
    }

    var buttonRow = dlg.add("group");
    buttonRow.alignment = "center";
    var btnCreate = buttonRow.add("button", undefined, t("glossary_setup_create"));
    var btnChoose = buttonRow.add("button", undefined, t("glossary_setup_choose"));
    var btnLater = null;
    if (allowLater) btnLater = buttonRow.add("button", undefined, t("glossary_setup_later"));

    var resultPath = "";

    btnCreate.onClick = function() {
        var suggestedPath = currentPath && currentPath !== "" ? currentPath : "";
        var saveFile = File.saveDialog(t("glossary_create_select"), "*.csv");
        if (!saveFile) return;
        if (!writeGlossaryTemplateFile(saveFile.fsName)) return;
        resultPath = saveFile.fsName;
        dlg.close(1);
    };

    btnChoose.onClick = function() {
        var existingFile = File.openDialog(t("glossary_select"), "*.csv");
        if (!existingFile) return;
        resultPath = existingFile.fsName;
        dlg.close(1);
    };

    if (btnLater) {
        btnLater.onClick = function() {
            dlg.close(0);
        };
    }

    if (dlg.show() !== 1) return "";
    return resultPath;
}

function ensureGlossaryPathConfigured(currentResolvedPath, storedPath) {
    var stored = String(storedPath || "").replace(/^\s+|\s+$/g, "");
    var resolved = resolveCSVPath(currentResolvedPath || stored);
    var hasStoredPath = stored !== "";
    var hasValidStoredFile = false;
    if (hasStoredPath) {
        try {
            var storedFile = new File(resolveCSVPath(stored) || stored);
            hasValidStoredFile = storedFile.exists;
        } catch (e) { hasValidStoredFile = false; }
    }

    if (hasStoredPath && hasValidStoredFile) return resolveCSVPath(stored) || stored;

    var chosenPath = promptForGlossaryPath(resolved, true);
    if (chosenPath && chosenPath !== "") {
        csvPathSettingRaw = chosenPath;
        app.insertLabel(CSV_PATH_LABEL, chosenPath);
        return resolveCSVPath(chosenPath) || chosenPath;
    }
    return resolved || "";
}

var logPath = Folder.temp + "/SuperTranslatorPRO_Log.txt";
var debugLogPath = Folder.temp + "/SuperTranslatorPRO_DebugLog.txt";
var debugSessionId = "";

// --- 0A. PROTOKOLL (LOGGING) ---
function writeLog(message, type) {
    try {
        var f = new File(logPath);
        var d = new Date();
        var timeStr = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0"+d.getDate()).slice(-2) + " " + ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2) + ":" + ("0"+d.getSeconds()).slice(-2);
        var prefix = type ? "[" + type + "]" : "[INFO]";
        f.encoding = "UTF-8";
        f.open(f.exists ? 'e' : 'w');
        if (f.exists) f.seek(0, 2); // Ans Ende der Datei springen
        f.writeln(timeStr + " " + prefix + " " + message);
        f.close();
    } catch(e) {}
}

function writeDebugLog(message, type) {
    if (!tableRestoreDebugEnabled) return;
    try {
        var f = new File(debugLogPath);
        var d = new Date();
        var timeStr = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0"+d.getDate()).slice(-2) + " " + ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2) + ":" + ("0"+d.getSeconds()).slice(-2);
        var prefix = type ? "[" + type + "]" : "[DEBUG]";
        var sessionStr = debugSessionId ? "[SESSION " + debugSessionId + "] " : "";
        f.encoding = "UTF-8";
        f.open(f.exists ? 'e' : 'w');
        if (f.exists) f.seek(0, 2);
        f.writeln(timeStr + " " + prefix + " " + sessionStr + message);
        f.close();
    } catch (e) {}
}

function beginDebugSession(doc, config) {
    if (!tableRestoreDebugEnabled) return;
    debugSessionId = String(new Date().getTime()) + "_" + String(Math.floor(Math.random() * 100000));
    writeDebugLog("=== DEBUG-SESSION GESTARTET ===");
    try {
        writeDebugLog("Dokument: " + (doc && doc.name ? doc.name : "(unbekannt)") +
            " | Modus: " + (config && config.mode ? config.mode : "") +
            " | Zielsprache: " + (config && config.lang ? config.lang : "") +
            " | Seitenmodus: " + ((config && config.sourcePages) ? config.sourcePages : "") +
            " | BDA-Quelle: " + ((config && config.bdaSourcePages) ? config.bdaSourcePages : ""));
    } catch (e1) {}
    try {
        writeDebugLog("CSV: " + (csvPath || "(leer)") + " | TM: " + (tmPath || "(leer)") + " | Debug-Log: " + debugLogPath);
    } catch (e2) {}
}

function normalizeDebugSnippet(text, limit) {
    var maxLen = limit || 120;
    var normalized = String(text === null || text === undefined ? "" : text)
        .replace(/[\r\n\t]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/^\s+|\s+$/g, "");
    if (normalized.length > maxLen) normalized = normalized.substring(0, maxLen) + "...";
    return normalized;
}

function getDebugPageLabel(page) {
    if (!page || !page.isValid) return "(keine Seite)";
    var pageName = "";
    var docOffset = "";
    try { pageName = String(page.name || ""); } catch (e) { pageName = ""; }
    try { docOffset = String(page.documentOffset); } catch (e2) { docOffset = ""; }
    return pageName !== "" ? (pageName + (docOffset !== "" ? " [idx " + docOffset + "]" : "")) : ("idx " + docOffset);
}

function getDebugTextTargetLabel(textObj) {
    if (!textObj || !textObj.isValid) return "(ungueltiges Textziel)";
    var parts = [];
    try {
        var rangeKey = getTextObjectRangeKey(textObj);
        if (rangeKey !== "") parts.push("key=" + rangeKey);
    } catch (e) {}
    try {
        var page = getTextObjectParentPage(textObj);
        if (page) parts.push("page=" + getDebugPageLabel(page));
    } catch (e2) {}
    try {
        parts.push('text="' + normalizeDebugSnippet(textObj.contents, 90) + '"');
    } catch (e3) {}
    return parts.join(" | ");
}

function getTableDebugSummary(tbl) {
    if (!tbl || !tbl.isValid) return "rows=? cols=? cells=?";
    var rows = "?";
    var cols = "?";
    var cells = "?";
    try { rows = String(tbl.rows.length); } catch (e) {}
    try { cols = String(tbl.columns.length); } catch (e2) {}
    try { cells = String(tbl.cells.length); } catch (e3) {}
    return "rows=" + rows + " cols=" + cols + " cells=" + cells;
}

function isValidDocumentPage(page) {
    if (!page || !page.isValid) return false;
    try {
        if (page.documentOffset !== undefined && page.documentOffset !== null && page.documentOffset >= 0) return true;
    } catch (e) {}
    try {
        if (page.parent && page.parent.isValid && page.parent.constructor && page.parent.constructor.name === "Spread") return true;
    } catch (e2) {}
    return false;
}

function getDebugMarkerLocation(textObj) {
    if (!textObj || !textObj.isValid) return "(ungueltige Position)";
    var parts = [];
    try {
        var parentPage = getTextObjectParentPage(textObj);
        if (parentPage) parts.push("page=" + getDebugPageLabel(parentPage));
    } catch (e) {}
    try {
        var parentFrames = textObj.parentTextFrames;
        if (parentFrames && parentFrames.length > 0 && parentFrames[0] && parentFrames[0].isValid) {
            var layerName = "";
            try { layerName = String(parentFrames[0].itemLayer.name || ""); } catch (layerErr) { layerName = ""; }
            if (layerName !== "") parts.push("layer=" + layerName);
        }
    } catch (e2) {}
    try {
        parts.push('text="' + normalizeDebugSnippet(textObj.contents, 80) + '"');
    } catch (e3) {}
    return parts.join(" | ");
}

// --- 0B. TRANSLATION MEMORY & CSV LOGIK ---
function getTMFile() { 
    if (tmPath && tmPath !== "") return new File(tmPath);
    return new File(Folder.userData + "/SuperTranslatorPRO_Memory.json"); 
}

function getTMBackupFile() {
    return new File(getTMFile().fsName + ".bak");
}

function getTMLockFolder() {
    return new Folder(getTMFile().fsName + ".lock");
}

function getTMLockInfoFile(lockFolder) {
    return new File(lockFolder.fsName + "/owner.txt");
}

function buildTMTempFile() {
    return new File(getTMFile().fsName + ".tmp." + tmRuntimeId + "_" + String(new Date().getTime()));
}

function buildTMCorruptSnapshotFile() {
    var d = new Date();
    var stamp = d.getFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) + "_" +
        ("0" + d.getHours()).slice(-2) +
        ("0" + d.getMinutes()).slice(-2) +
        ("0" + d.getSeconds()).slice(-2);
    return new File(getTMFile().fsName + ".corrupt." + stamp + ".json");
}

function reportTMWarningOnce(cacheKey, messageKey, logMessage) {
    if (logMessage) writeLog(logMessage, "WARNUNG");
    if (tmWarningCache[cacheKey]) return;
    tmWarningCache[cacheKey] = true;
    try { alert(t(messageKey)); } catch (e) {}
}

function normalizeTMObject(rawObj) {
    var normalized = {};
    if (!rawObj || typeof rawObj !== "object") return normalized;
    for (var lang in rawObj) {
        if (!rawObj.hasOwnProperty(lang)) continue;
        var bucket = rawObj[lang];
        if (!bucket || typeof bucket !== "object") continue;
        normalized[lang] = {};
        for (var key in bucket) {
            if (!bucket.hasOwnProperty(key)) continue;
            var value = bucket[key];
            if (value === null || value === undefined || value === "") continue;
            normalized[lang][String(key)] = String(value);
        }
    }
    return normalized;
}

function isTMObjectEmpty(tmObj) {
    var normalized = normalizeTMObject(tmObj);
    for (var lang in normalized) {
        if (!normalized.hasOwnProperty(lang)) continue;
        for (var key in normalized[lang]) {
            if (normalized[lang].hasOwnProperty(key)) return false;
        }
    }
    return true;
}

function mergeTMObjects(baseObj, overlayObj) {
    var merged = normalizeTMObject(baseObj);
    var overlay = normalizeTMObject(overlayObj);
    for (var lang in overlay) {
        if (!overlay.hasOwnProperty(lang)) continue;
        if (!merged[lang]) merged[lang] = {};
        for (var key in overlay[lang]) {
            if (!overlay[lang].hasOwnProperty(key)) continue;
            merged[lang][key] = overlay[lang][key];
        }
    }
    return merged;
}

function parseTMContent(content) {
    var normalizedContent = String(content || "").replace(/^\uFEFF/, "").replace(/^\s+|\s+$/g, "");
    if (normalizedContent === "") return { ok: true, obj: {}, empty: true };
    try {
        return { ok: true, obj: normalizeTMObject(eval("(" + normalizedContent + ")")), empty: false };
    } catch (e) {
        return { ok: false, obj: {}, error: e, empty: false };
    }
}

function readTMFileData(fileObj) {
    if (!fileObj.exists) return { ok: true, obj: {}, exists: false, empty: true };
    var opened = false;
    var content = "";
    try {
        fileObj.encoding = "UTF-8";
        opened = fileObj.open('r');
        if (!opened) throw new Error("TM file could not be opened for reading.");
        content = fileObj.read();
        fileObj.close();
        opened = false;
        var parsed = parseTMContent(content);
        parsed.exists = true;
        parsed.path = fileObj.fsName;
        return parsed;
    } catch (e) {
        try { if (opened) fileObj.close(); } catch (closeErr) {}
        return { ok: false, obj: {}, exists: true, error: e, path: fileObj.fsName };
    }
}

function serializeTM(tmObj) {
    var normalized = normalizeTMObject(tmObj);
    var str = "{\n";
    var langs = [];
    for (var l in normalized) {
        if (!normalized.hasOwnProperty(l)) continue;
        var keys = [];
        for (var k in normalized[l]) {
            if (!normalized[l].hasOwnProperty(k) || !normalized[l][k]) continue;
            var ek = String(k).replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
            var ev = String(normalized[l][k]).replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
            keys.push('"' + ek + '":"' + ev + '"');
        }
        langs.push('"' + l + '":{' + keys.join(',') + '}');
    }
    str += langs.join(",\n") + "\n}";
    return str;
}

function writeTMLockInfo(lockFolder) {
    var infoFile = getTMLockInfoFile(lockFolder);
    var opened = false;
    try {
        infoFile.encoding = "UTF-8";
        opened = infoFile.open('w');
        if (!opened) return false;
        infoFile.write("owner=" + tmRuntimeId + "\ncreated=" + String(new Date().getTime()) + "\n");
        infoFile.close();
        return true;
    } catch (e) {
        try { if (opened) infoFile.close(); } catch (closeErr) {}
        return false;
    }
}

function getTMLockTimestamp(lockFolder) {
    if (!lockFolder || !lockFolder.exists) return 0;
    var infoFile = getTMLockInfoFile(lockFolder);
    var modDate = null;
    try {
        if (infoFile.exists) modDate = infoFile.modified;
        else modDate = lockFolder.modified;
    } catch (e) { modDate = null; }
    try {
        if (modDate && modDate.getTime) return modDate.getTime();
    } catch (e2) {}
    return 0;
}

function removeTMLockFolder(lockFolder) {
    if (!lockFolder || !lockFolder.exists) return true;
    try {
        var items = lockFolder.getFiles();
        for (var i = 0; i < items.length; i++) {
            try { items[i].remove(); } catch (childErr) {}
        }
        if (!lockFolder.exists) return true;
        return lockFolder.remove();
    } catch (e) {
        return !lockFolder.exists;
    }
}

function breakStaleTMLock(lockFolder) {
    var broken = removeTMLockFolder(lockFolder);
    if (broken) writeLog("Veraltete Translation-Memory-Sperre wurde entfernt: " + lockFolder.fsName, "WARNUNG");
    return broken;
}

function waitForTMLockRelease(maxWaitMs) {
    var waitMs = (maxWaitMs && maxWaitMs > 0) ? maxWaitMs : TM_LOCK_TIMEOUT_MS;
    var startMs = new Date().getTime();
    var lockFolder = getTMLockFolder();
    while (lockFolder.exists) {
        var lockTimestamp = getTMLockTimestamp(lockFolder);
        if (lockTimestamp > 0 && (new Date().getTime() - lockTimestamp) >= TM_LOCK_STALE_MS) {
            if (breakStaleTMLock(lockFolder)) continue;
        }
        if ((new Date().getTime() - startMs) >= waitMs) return false;
        try { $.sleep(TM_LOCK_POLL_MS); } catch (sleepErr) {}
    }
    return true;
}

function acquireTMLock(timeoutMs) {
    var waitMs = (timeoutMs && timeoutMs > 0) ? timeoutMs : TM_LOCK_TIMEOUT_MS;
    var startMs = new Date().getTime();
    var lockFolder = getTMLockFolder();
    while ((new Date().getTime() - startMs) < waitMs) {
        if (!lockFolder.exists) {
            try {
                if (lockFolder.create()) {
                    writeTMLockInfo(lockFolder);
                    return { folder: lockFolder };
                }
            } catch (e) {}
        }
        var lockTimestamp = getTMLockTimestamp(lockFolder);
        if (lockTimestamp > 0 && (new Date().getTime() - lockTimestamp) >= TM_LOCK_STALE_MS) {
            if (breakStaleTMLock(lockFolder)) continue;
        }
        try { $.sleep(TM_LOCK_POLL_MS); } catch (sleepErr) {}
    }
    return null;
}

function releaseTMLock(lockHandle) {
    if (!lockHandle || !lockHandle.folder) return;
    if (!removeTMLockFolder(lockHandle.folder)) {
        writeLog("Translation-Memory-Sperre konnte nicht sauber entfernt werden: " + lockHandle.folder.fsName, "WARNUNG");
    }
}

function loadTMState(options) {
    var opts = options || {};
    if (opts.waitForLock !== false) waitForTMLockRelease(TM_LOCK_TIMEOUT_MS);

    var primaryFile = getTMFile();
    var primaryResult = readTMFileData(primaryFile);
    if (primaryResult.ok) {
        primaryResult.source = "primary";
        return primaryResult;
    }

    if (primaryFile.exists) {
        var backupResult = readTMFileData(getTMBackupFile());
        if (backupResult.ok) {
            backupResult.source = "backup";
            backupResult.primaryError = primaryResult.error;
            return backupResult;
        }
    }

    primaryResult.source = "primary";
    return primaryResult;
}

function snapshotCorruptTMFile() {
    var tmFile = getTMFile();
    if (!tmFile.exists) return null;
    var snapshot = buildTMCorruptSnapshotFile();
    try {
        if (tmFile.copy(snapshot.fsName)) return snapshot;
    } catch (e) {}
    return null;
}

function writeTMContentAtomically(targetFile, content, options) {
    var opts = options || {};
    var tempFile = buildTMTempFile();
    var backupFile = getTMBackupFile();
    var opened = false;
    var targetExisted = false;
    try {
        var parentFolder = targetFile.parent;
        if (parentFolder && !parentFolder.exists) {
            try { parentFolder.create(); } catch (parentErr) {}
        }

        targetExisted = targetFile.exists;
        if (tempFile.exists) {
            try { tempFile.remove(); } catch (tempCleanupErr) {}
        }

        tempFile.encoding = "UTF-8";
        opened = tempFile.open('w');
        if (!opened) throw new Error("TM temp file could not be opened for writing.");
        if (!tempFile.write(content)) throw new Error("TM temp file could not be written.");
        tempFile.close();
        opened = false;

        if (!opts.preserveBackup && backupFile.exists) {
            try { backupFile.remove(); } catch (oldBackupErr) {}
        }

        if (targetExisted) {
            if (!opts.preserveBackup) {
                try {
                    if (!targetFile.copy(backupFile.fsName)) {
                        writeLog("Translation-Memory-Backup konnte nicht erstellt werden: " + backupFile.fsName, "WARNUNG");
                    }
                } catch (backupErr) {
                    writeLog("Translation-Memory-Backup fehlgeschlagen: " + (backupErr.message || backupErr), "WARNUNG");
                }
            }
            if (!targetFile.remove()) throw new Error("TM target file could not be replaced.");
        }

        if (!tempFile.rename(targetFile.name)) {
            if (!tempFile.copy(targetFile.fsName)) throw new Error("TM temp file could not be moved into place.");
            try { tempFile.remove(); } catch (tempRemoveErr) {}
        }
        return true;
    } catch (e) {
        try { if (opened) tempFile.close(); } catch (closeErr) {}
        try { if (tempFile.exists) tempFile.remove(); } catch (cleanupErr) {}
        if (!targetFile.exists && backupFile.exists) {
            try { backupFile.copy(targetFile.fsName); } catch (restoreErr) {}
        }
        return false;
    }
}

function loadTM() {
    var state = loadTMState({ waitForLock: true });
    if (state.ok) {
        if (state.source === "backup") {
            writeLog("Translation Memory Hauptdatei war nicht lesbar. Sicherung wird fuer den aktuellen Lauf verwendet.", "WARNUNG");
        }
        return state.obj;
    }

    var readError = state.error && state.error.message ? state.error.message : state.error;
    reportTMWarningOnce(
        "tm_read_failed",
        "memory_read_warning",
        "Translation Memory konnte nicht sicher gelesen werden: " + (readError || "unbekannter Fehler")
    );
    return {};
}

function saveTMDelta(tmDelta) {
    var normalizedDelta = normalizeTMObject(tmDelta);
    if (isTMObjectEmpty(normalizedDelta)) return true;

    var lockHandle = acquireTMLock(TM_LOCK_TIMEOUT_MS);
    if (!lockHandle) {
        reportTMWarningOnce(
            "tm_save_busy",
            "memory_busy_warning",
            "Translation Memory ist aktuell gesperrt. Neue Eintraege konnten nicht gespeichert werden."
        );
        return false;
    }

    var success = false;
    var deferredWarning = null;
    try {
        var state = loadTMState({ waitForLock: false });
        var baseTM = {};

        if (!state.ok) {
            var corruptSnapshot = snapshotCorruptTMFile();
            var errorText = state.error && state.error.message ? state.error.message : state.error;
            deferredWarning = {
                cacheKey: "tm_save_read_failed",
                messageKey: "memory_write_warning",
                logMessage: "Translation Memory konnte vor dem Speichern nicht gelesen werden: " + (errorText || "unbekannter Fehler") +
                    (corruptSnapshot ? " | Defekte Datei gesichert unter: " + corruptSnapshot.fsName : "")
            };
        } else {
            baseTM = state.obj;
            if (state.source === "backup") {
                var recoveredSnapshot = snapshotCorruptTMFile();
                writeLog(
                    "Translation Memory Hauptdatei war beschaedigt. Sicherung wird fuer die Wiederherstellung verwendet." +
                    (recoveredSnapshot ? " Defekte Datei gesichert unter: " + recoveredSnapshot.fsName : ""),
                    "WARNUNG"
                );
            }

            var mergedTM = mergeTMObjects(baseTM, normalizedDelta);
            success = writeTMContentAtomically(getTMFile(), serializeTM(mergedTM), { preserveBackup: state.source === "backup" });
            if (!success) {
                deferredWarning = {
                    cacheKey: "tm_save_write_failed",
                    messageKey: "memory_write_warning",
                    logMessage: "Translation Memory konnte nicht sicher geschrieben werden: " + getTMFile().fsName
                };
            }
        }
    } finally {
        releaseTMLock(lockHandle);
    }

    if (deferredWarning) {
        reportTMWarningOnce(deferredWarning.cacheKey, deferredWarning.messageKey, deferredWarning.logMessage);
    }
    return success;
}

function clearTM() {
    var lockHandle = acquireTMLock(TM_LOCK_TIMEOUT_MS);
    if (!lockHandle) {
        reportTMWarningOnce(
            "tm_clear_busy",
            "memory_clear_warning",
            "Translation Memory konnte nicht geleert werden, weil die Datei aktuell gesperrt ist."
        );
        return false;
    }

    var success = true;
    var deferredWarning = null;
    try {
        var tmFile = getTMFile();
        var backupFile = getTMBackupFile();
        if (tmFile.exists) {
            try { if (!tmFile.remove()) success = false; } catch (tmRemoveErr) { success = false; }
        }
        if (backupFile.exists) {
            try { if (!backupFile.remove()) success = false; } catch (backupRemoveErr) { success = false; }
        }
        if (!success) {
            success = writeTMContentAtomically(tmFile, serializeTM({}));
            if (success && backupFile.exists) {
                try { backupFile.remove(); } catch (backupCleanupErr) {}
            }
        }
        if (!success) {
            deferredWarning = {
                cacheKey: "tm_clear_failed",
                messageKey: "memory_clear_warning",
                logMessage: "Translation Memory konnte nicht sicher geleert werden: " + getTMFile().fsName
            };
        }
    } finally {
        releaseTMLock(lockHandle);
    }

    if (deferredWarning) {
        reportTMWarningOnce(deferredWarning.cacheKey, deferredWarning.messageKey, deferredWarning.logMessage);
    }
    return success;
}

function normalizeExplicitFilePath(path) {
    return String(path === null || path === undefined ? "" : path).replace(/^\s+|\s+$/g, "");
}

function getGlossaryBackupFileForPath(path) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return null;
    return new File(normalizedPath + ".bak");
}

function getGlossaryLockFolderForPath(path) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return null;
    return new Folder(normalizedPath + ".lock");
}

function getGlossaryLockInfoFile(lockFolder) {
    if (!lockFolder) return null;
    return new File(lockFolder.fsName + "/owner.txt");
}

function buildGlossaryTempFileForPath(path) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return null;
    return new File(normalizedPath + ".tmp." + glossaryRuntimeId + "_" + String(new Date().getTime()));
}

function buildGlossaryCorruptSnapshotFileForPath(path) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return null;
    var d = new Date();
    var stamp = d.getFullYear() +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) + "_" +
        ("0" + d.getHours()).slice(-2) +
        ("0" + d.getMinutes()).slice(-2) +
        ("0" + d.getSeconds()).slice(-2);
    return new File(normalizedPath + ".corrupt." + stamp + ".csv");
}

function reportGlossaryWarningOnce(cacheKey, messageKey, logMessage) {
    if (logMessage) writeLog(logMessage, "WARNUNG");
    if (glossaryWarningCache[cacheKey]) return;
    glossaryWarningCache[cacheKey] = true;
    try { alert(t(messageKey)); } catch (e) {}
}

function writeGlossaryLockInfo(lockFolder) {
    var infoFile = getGlossaryLockInfoFile(lockFolder);
    var opened = false;
    if (!infoFile) return false;
    try {
        infoFile.encoding = "UTF-8";
        opened = infoFile.open('w');
        if (!opened) return false;
        infoFile.write("owner=" + glossaryRuntimeId + "\ncreated=" + String(new Date().getTime()) + "\n");
        infoFile.close();
        return true;
    } catch (e) {
        try { if (opened) infoFile.close(); } catch (closeErr) {}
        return false;
    }
}

function getGlossaryLockTimestamp(lockFolder) {
    if (!lockFolder || !lockFolder.exists) return 0;
    var infoFile = getGlossaryLockInfoFile(lockFolder);
    var modDate = null;
    try {
        if (infoFile && infoFile.exists) modDate = infoFile.modified;
        else modDate = lockFolder.modified;
    } catch (e) { modDate = null; }
    try {
        if (modDate && modDate.getTime) return modDate.getTime();
    } catch (e2) {}
    return 0;
}

function removeGlossaryLockFolder(lockFolder) {
    if (!lockFolder || !lockFolder.exists) return true;
    try {
        var items = lockFolder.getFiles();
        for (var i = 0; i < items.length; i++) {
            try { items[i].remove(); } catch (childErr) {}
        }
        if (!lockFolder.exists) return true;
        return lockFolder.remove();
    } catch (e) {
        return !lockFolder.exists;
    }
}

function breakStaleGlossaryLock(lockFolder) {
    var broken = removeGlossaryLockFolder(lockFolder);
    if (broken) writeLog("Veraltete Glossar-Sperre wurde entfernt: " + lockFolder.fsName, "WARNUNG");
    return broken;
}

function waitForGlossaryLockRelease(path, maxWaitMs) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return false;
    var waitMs = (maxWaitMs && maxWaitMs > 0) ? maxWaitMs : CSV_LOCK_TIMEOUT_MS;
    var startMs = new Date().getTime();
    var lockFolder = getGlossaryLockFolderForPath(normalizedPath);
    while (lockFolder && lockFolder.exists) {
        var lockTimestamp = getGlossaryLockTimestamp(lockFolder);
        if (lockTimestamp > 0 && (new Date().getTime() - lockTimestamp) >= CSV_LOCK_STALE_MS) {
            if (breakStaleGlossaryLock(lockFolder)) continue;
        }
        if ((new Date().getTime() - startMs) >= waitMs) return false;
        try { $.sleep(CSV_LOCK_POLL_MS); } catch (sleepErr) {}
    }
    return true;
}

function acquireGlossaryLock(path, timeoutMs) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return null;
    var waitMs = (timeoutMs && timeoutMs > 0) ? timeoutMs : CSV_LOCK_TIMEOUT_MS;
    var startMs = new Date().getTime();
    var lockFolder = getGlossaryLockFolderForPath(normalizedPath);
    while ((new Date().getTime() - startMs) < waitMs) {
        if (lockFolder && !lockFolder.exists) {
            try {
                if (lockFolder.create()) {
                    writeGlossaryLockInfo(lockFolder);
                    return { folder: lockFolder, path: normalizedPath };
                }
            } catch (e) {}
        }
        var lockTimestamp = getGlossaryLockTimestamp(lockFolder);
        if (lockTimestamp > 0 && (new Date().getTime() - lockTimestamp) >= CSV_LOCK_STALE_MS) {
            if (breakStaleGlossaryLock(lockFolder)) continue;
        }
        try { $.sleep(CSV_LOCK_POLL_MS); } catch (sleepErr) {}
    }
    return null;
}

function releaseGlossaryLock(lockHandle) {
    if (!lockHandle || !lockHandle.folder) return;
    if (!removeGlossaryLockFolder(lockHandle.folder)) {
        writeLog("Glossar-Sperre konnte nicht sauber entfernt werden: " + lockHandle.folder.fsName, "WARNUNG");
    }
}

function snapshotCorruptGlossaryFile(path) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return null;
    var glossaryFile = new File(normalizedPath);
    if (!glossaryFile.exists) return null;
    var snapshot = buildGlossaryCorruptSnapshotFileForPath(normalizedPath);
    if (!snapshot) return null;
    try {
        if (glossaryFile.copy(snapshot.fsName)) return snapshot;
    } catch (e) {}
    return null;
}

function tryReadCSVContentStable(path, encoding, maxAttempts) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return null;
    var attempts = (maxAttempts && maxAttempts > 0) ? maxAttempts : 3;
    for (var attempt = 0; attempt < attempts; attempt++) {
        var beforeTick = 0;
        var afterTick = 0;
        try {
            var beforeFile = new File(normalizedPath);
            if (!beforeFile.exists) return null;
            try {
                if (beforeFile.modified && beforeFile.modified.getTime) beforeTick = beforeFile.modified.getTime();
            } catch (beforeModErr) {}
        } catch (beforeErr) {}

        var content = tryReadCSVContent(normalizedPath, encoding);

        try {
            var afterFile = new File(normalizedPath);
            if (!afterFile.exists) return null;
            try {
                if (afterFile.modified && afterFile.modified.getTime) afterTick = afterFile.modified.getTime();
            } catch (afterModErr) {}
        } catch (afterErr) {}

        if (content !== null && (beforeTick === 0 || afterTick === 0 || beforeTick === afterTick)) return content;
        if (attempt + 1 < attempts) {
            try { $.sleep(CSV_LOCK_POLL_MS); } catch (sleepErr) {}
        }
    }
    return null;
}

function loadBestCSVRowsFromPath(path) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return { ok: false, path: normalizedPath };
    var f = new File(normalizedPath);
    if (!f.exists) return { ok: false, path: normalizedPath, missing: true };

    var rows = null;
    var bestScore = 999999;
    var bestSeparator = ";";
    var bestEncoding = "UTF-8";
    var encodings = ["UTF-8", "CP1252", "Macintosh", "UTF-16", "UTF-16LE", "UTF-16BE", ""];
    for (var encIdx = 0; encIdx < encodings.length; encIdx++) {
        var candidateContent = tryReadCSVContentStable(normalizedPath, encodings[encIdx], 3);
        if (!candidateContent || candidateContent === "") continue;
        var candidateSep = guessCSVSeparator(candidateContent);
        var candidateRows = parseCSVRows(candidateContent, candidateSep);
        var candidateScore = getCSVDecodeScore(candidateContent, candidateRows);
        if (candidateRows.length >= 2 && candidateRows[0] && candidateRows[0].length >= 2 && candidateScore < bestScore) {
            bestScore = candidateScore;
            rows = candidateRows;
            bestSeparator = candidateSep;
            bestEncoding = encodings[encIdx] || "";
        }
    }

    if (!rows || rows.length < 2) return { ok: false, path: normalizedPath };
    return { ok: true, rows: rows, path: normalizedPath, separator: bestSeparator, encoding: bestEncoding };
}

function loadGlossaryRowsState(path) {
    var resolvedPath = resolveCSVPath(path);
    if (!resolvedPath || resolvedPath === "") return { ok: false, path: "" };

    waitForGlossaryLockRelease(resolvedPath, CSV_LOCK_TIMEOUT_MS);

    var primaryResult = loadBestCSVRowsFromPath(resolvedPath);
    if (primaryResult.ok) {
        primaryResult.source = "primary";
        return primaryResult;
    }

    var backupFile = getGlossaryBackupFileForPath(resolvedPath);
    if (backupFile && backupFile.exists) {
        var backupResult = loadBestCSVRowsFromPath(backupFile.fsName);
        if (backupResult.ok) {
            backupResult.source = "backup";
            backupResult.primaryPath = resolvedPath;
            return backupResult;
        }
    }

    primaryResult.source = "primary";
    return primaryResult;
}

function writeGlossaryContentAtomically(path, content, options) {
    var normalizedPath = normalizeExplicitFilePath(path);
    if (normalizedPath === "") return false;
    var opts = options || {};
    var targetFile = new File(normalizedPath);
    var tempFile = buildGlossaryTempFileForPath(normalizedPath);
    var backupFile = getGlossaryBackupFileForPath(normalizedPath);
    var opened = false;
    var targetExisted = false;
    if (!tempFile || !backupFile) return false;

    try {
        var parentFolder = targetFile.parent;
        if (parentFolder && !parentFolder.exists) {
            try { parentFolder.create(); } catch (parentErr) {}
        }

        targetExisted = targetFile.exists;
        if (tempFile.exists) {
            try { tempFile.remove(); } catch (tempCleanupErr) {}
        }

        tempFile.encoding = "UTF-8";
        opened = tempFile.open('w');
        if (!opened) throw new Error("Glossary temp file could not be opened for writing.");
        if (!tempFile.write(content)) throw new Error("Glossary temp file could not be written.");
        tempFile.close();
        opened = false;

        if (!opts.preserveBackup && backupFile.exists) {
            try { backupFile.remove(); } catch (oldBackupErr) {}
        }

        if (targetExisted) {
            if (!opts.preserveBackup) {
                try {
                    if (!targetFile.copy(backupFile.fsName)) {
                        writeLog("Glossar-Backup konnte nicht erstellt werden: " + backupFile.fsName, "WARNUNG");
                    }
                } catch (backupErr) {
                    writeLog("Glossar-Backup fehlgeschlagen: " + (backupErr.message || backupErr), "WARNUNG");
                }
            }
            if (!targetFile.remove()) throw new Error("Glossary target file could not be replaced.");
        }

        if (!tempFile.rename(targetFile.name)) {
            if (!tempFile.copy(targetFile.fsName)) throw new Error("Glossary temp file could not be moved into place.");
            try { tempFile.remove(); } catch (tempRemoveErr) {}
        }
        return true;
    } catch (e) {
        try { if (opened) tempFile.close(); } catch (closeErr) {}
        try { if (tempFile.exists) tempFile.remove(); } catch (cleanupErr) {}
        if (!targetFile.exists && backupFile.exists) {
            try { backupFile.copy(targetFile.fsName); } catch (restoreErr) {}
        }
        return false;
    }
}

function trimGlossaryEditorValue(value) {
    return sanitizeCSVContent(value).replace(/^\s+|\s+$/g, "");
}

function normalizeGlossaryHeaderKey(header) {
    return trimGlossaryEditorValue(header).toUpperCase();
}

function cloneGlossaryEditorRow(row, targetLength) {
    var length = targetLength || (row ? row.length : 0);
    var clone = [];
    for (var i = 0; i < length; i++) {
        clone.push((row && i < row.length) ? sanitizeCSVContent(row[i]) : "");
    }
    return clone;
}

function createBlankGlossaryEditorRow(length) {
    var row = [];
    for (var i = 0; i < length; i++) row.push("");
    return row;
}

function findGlossaryHeaderIndex(headers, targetKey) {
    var normalizedTarget = normalizeGlossaryHeaderKey(targetKey);
    for (var i = 0; i < headers.length; i++) {
        if (normalizeGlossaryHeaderKey(headers[i]) === normalizedTarget) return i;
    }
    return -1;
}

function getFirstNonEmptyGlossaryRowValue(row) {
    if (!row) return "";
    for (var i = 0; i < row.length; i++) {
        var value = trimGlossaryEditorValue(row[i]);
        if (value !== "") return value;
    }
    return "";
}

function buildGlossaryEditorHeaders(rows) {
    var headers = [];
    var seen = {};
    var sourceHeaders = (rows && rows.length > 0) ? rows[0] : [];
    var preferredHeaders = ["_SOURCE", "_INFO", "_FLAGS", "_ALIASES"];

    function addHeaderValue(value) {
        var text = trimGlossaryEditorValue(value);
        var key = normalizeGlossaryHeaderKey(text);
        if (text === "" || key === "" || seen[key]) return;
        headers.push(text);
        seen[key] = true;
    }

    for (var i = 0; i < sourceHeaders.length; i++) addHeaderValue(sourceHeaders[i]);
    for (var j = 0; j < preferredHeaders.length; j++) addHeaderValue(preferredHeaders[j]);
    if (!seen.DE) addHeaderValue("DE");

    if (headers.length === 0) {
        headers = ["_SOURCE", "_INFO", "_FLAGS", "_ALIASES"].concat(getSupportedGlossaryLanguageHeaders());
    }
    return headers;
}

function getGlossaryEditorStaticRows(rows, headerLength) {
    var staticRows = [];
    for (var i = 1; i < rows.length; i++) {
        var normalizedRow = cloneGlossaryEditorRow(rows[i], headerLength);
        var firstNonEmpty = getFirstNonEmptyGlossaryRowValue(normalizedRow);
        if (firstNonEmpty !== "" && isGlossaryCommentRow(firstNonEmpty)) staticRows.push(normalizedRow);
    }
    return staticRows;
}

function getGlossaryEditorSourceLangFromRow(headers, row) {
    var sourceIdx = findGlossaryHeaderIndex(headers, "_SOURCE");
    var sourceLang = "DE";
    if (sourceIdx >= 0) {
        var sourceCandidate = normalizeGlossaryLanguageCode(row[sourceIdx]);
        if (isSupportedGlossaryLanguageHeader(sourceCandidate)) sourceLang = sourceCandidate;
    }
    return sourceLang;
}

function getGlossaryEditorSourceTextFromRow(headers, row, sourceLang) {
    var preferredSource = normalizeGlossaryLanguageCode(sourceLang || "DE");
    var sourceIdx = findGlossaryHeaderIndex(headers, preferredSource);
    if (sourceIdx >= 0) {
        var sourceText = trimGlossaryEditorValue(row[sourceIdx]);
        if (sourceText !== "") return sourceText;
    }

    if (preferredSource !== "DE") {
        var deIdx = findGlossaryHeaderIndex(headers, "DE");
        if (deIdx >= 0) {
            var fallbackDe = trimGlossaryEditorValue(row[deIdx]);
            if (fallbackDe !== "") return fallbackDe;
        }
    }

    for (var i = 0; i < headers.length; i++) {
        if (!isSupportedGlossaryLanguageHeader(headers[i])) continue;
        var value = trimGlossaryEditorValue(row[i]);
        if (value !== "") return value;
    }
    return "";
}

function getGlossaryEditorInfoTextFromRow(headers, row) {
    var infoHeaders = ["_INFO", "_NOTE", "_NOTES", "_COMMENT", "_COMMENTS"];
    for (var i = 0; i < infoHeaders.length; i++) {
        var idx = findGlossaryHeaderIndex(headers, infoHeaders[i]);
        if (idx < 0) continue;
        var value = trimGlossaryEditorValue(row[idx]);
        if (value !== "") return value;
    }
    return "";
}

function buildGlossaryEditorSearchText(row) {
    var parts = [];
    for (var i = 0; i < row.length; i++) {
        var value = trimGlossaryEditorValue(row[i]);
        if (value !== "") parts.push(value.toLowerCase());
    }
    return parts.join(" ");
}

function buildGlossaryEditorEntryLabel(entry) {
    var sourceLabel = entry.sourceText !== "" ? entry.sourceText : "(" + entry.sourceLang + ")";
    var compactSource = sourceLabel.replace(/\s+/g, " ");
    var compactInfo = String(entry.infoText || "").replace(/\s+/g, " ");
    var label = compactSource;
    if (entry.sourceLang && entry.sourceLang !== "DE") label += " [" + entry.sourceLang + "]";
    if (compactInfo !== "") label += " | " + compactInfo;
    return label;
}

function refreshGlossaryEditorEntry(entry, headers) {
    entry.row = cloneGlossaryEditorRow(entry.row, headers.length);
    entry.sourceLang = getGlossaryEditorSourceLangFromRow(headers, entry.row);
    entry.sourceText = getGlossaryEditorSourceTextFromRow(headers, entry.row, entry.sourceLang);
    entry.infoText = getGlossaryEditorInfoTextFromRow(headers, entry.row);
    entry.searchText = buildGlossaryEditorSearchText(entry.row);
    entry.label = buildGlossaryEditorEntryLabel(entry);
}

function buildGlossaryEditorEntries(headers, rows) {
    var entries = [];
    var nextId = 1;
    for (var i = 1; i < rows.length; i++) {
        var normalizedRow = cloneGlossaryEditorRow(rows[i], headers.length);
        var firstNonEmpty = getFirstNonEmptyGlossaryRowValue(normalizedRow);
        if (firstNonEmpty === "" || isGlossaryCommentRow(firstNonEmpty)) continue;
        var entry = { id: nextId++, row: normalizedRow };
        refreshGlossaryEditorEntry(entry, headers);
        entries.push(entry);
    }
    return { entries: entries, nextId: nextId };
}

function buildGlossaryEditorState(path) {
    var state = loadGlossaryRowsState(path);
    if (!state.ok) return state;

    var headers = buildGlossaryEditorHeaders(state.rows || []);
    var builtEntries = buildGlossaryEditorEntries(headers, state.rows || []);
    return {
        ok: true,
        path: state.path,
        source: state.source,
        primaryPath: state.primaryPath,
        separator: state.separator || ";",
        encoding: state.encoding || "UTF-8",
        headers: headers,
        staticRows: getGlossaryEditorStaticRows(state.rows || [], headers.length),
        entries: builtEntries.entries,
        nextId: builtEntries.nextId
    };
}

function buildGlossaryCSVContentFromRows(rows, separator) {
    var lines = [];
    var csvSeparator = separator || ";";
    for (var i = 0; i < rows.length; i++) {
        var lineParts = [];
        for (var j = 0; j < rows[i].length; j++) {
            lineParts.push(escapeCSVField(rows[i][j], csvSeparator));
        }
        lines.push(lineParts.join(csvSeparator));
    }
    return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

function buildGlossaryEditorCSVContent(editorState) {
    var rows = [cloneGlossaryEditorRow(editorState.headers, editorState.headers.length)];
    for (var i = 0; i < editorState.staticRows.length; i++) {
        rows.push(cloneGlossaryEditorRow(editorState.staticRows[i], editorState.headers.length));
    }
    for (var j = 0; j < editorState.entries.length; j++) {
        if (!editorState.entries[j] || !editorState.entries[j].row) continue;
        var normalizedRow = cloneGlossaryEditorRow(editorState.entries[j].row, editorState.headers.length);
        if (getFirstNonEmptyGlossaryRowValue(normalizedRow) === "") continue;
        rows.push(normalizedRow);
    }
    return buildGlossaryCSVContentFromRows(rows, editorState.separator || ";");
}

function saveGlossaryEditorState(editorState) {
    var normalizedPath = normalizeExplicitFilePath(editorState.path);
    if (normalizedPath === "") return false;

    var lockHandle = acquireGlossaryLock(normalizedPath, CSV_LOCK_TIMEOUT_MS);
    if (!lockHandle) {
        alert(t("glossary_busy_warning"));
        return false;
    }

    var success = false;
    try {
        success = writeGlossaryContentAtomically(normalizedPath, buildGlossaryEditorCSVContent(editorState));
    } finally {
        releaseGlossaryLock(lockHandle);
    }

    if (!success) alert(t("glossary_write_warning"));
    return success;
}

function promptForNewGlossaryEntryName(sourceLanguageCode) {
    var sourceLang = normalizeGlossaryLanguageCode(sourceLanguageCode || "DE");
    if (sourceLang === "") sourceLang = "DE";

    var dlg = new Window("dialog", t("glossary_editor_new_title"), undefined, { resizeable: true });
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.margins = 16;
    dlg.spacing = 10;
    dlg.minimumSize = [420, 180];
    dlg.preferredSize = [520, 220];

    dlg.add("statictext", undefined, t("glossary_editor_new_name_help"), { multiline: true });
    var langLabel = dlg.add("statictext", undefined, t("glossary_editor_source_language") + " " + sourceLang + " (" + getLocalizedLanguageName(sourceLang) + ")");
    langLabel.preferredSize.width = 420;

    dlg.add("statictext", undefined, t("glossary_editor_new_name"));
    var nameInput = dlg.add("edittext", undefined, "");
    nameInput.characters = 42;
    nameInput.active = true;

    var buttonRow = dlg.add("group");
    buttonRow.alignment = "right";
    var btnCancel = buttonRow.add("button", undefined, t("cancel"), { name: "cancel" });
    var btnCreate = buttonRow.add("button", undefined, t("glossary_editor_new_confirm"), { name: "ok" });

    var result = null;
    btnCreate.onClick = function() {
        var entryName = trimGlossaryEditorValue(nameInput.text);
        if (entryName === "") {
            alert(t("glossary_editor_new_required"));
            return;
        }
        result = entryName;
        dlg.close(1);
    };
    btnCancel.onClick = function() {
        dlg.close(0);
    };
    dlg.onShow = function() {
        positionDialogCenteredOnMainWindow(dlg, 520, 220);
    };
    dlg.onResizing = dlg.onResize = function() {
        this.layout.resize();
    };

    if (dlg.show() !== 1) return null;
    return result;
}

function openGlossaryEditorDialog(currentPath) {
    var resolvedPath = resolveCSVPath(currentPath);
    if (!resolvedPath || resolvedPath === "") {
        var chosenPath = promptForGlossaryPath(currentPath || "", true);
        if (!chosenPath || chosenPath === "") {
            alert(t("glossary_editor_no_path"));
            return { saved: false, path: currentPath || "" };
        }
        resolvedPath = resolveCSVPath(chosenPath) || chosenPath;
    }

    var result = { saved: false, path: resolvedPath };

    while (true) {
        var editorState = buildGlossaryEditorState(resolvedPath);
        if (!editorState.ok) {
            alert(t("glossary_editor_load_failed"));
            return result;
        }

        var languageHeaders = [];
        var extraHeaders = [];
        for (var headerIdx = 0; headerIdx < editorState.headers.length; headerIdx++) {
            var headerKey = normalizeGlossaryHeaderKey(editorState.headers[headerIdx]);
            if (isSupportedGlossaryLanguageHeader(headerKey)) languageHeaders.push(editorState.headers[headerIdx]);
            else if (headerKey !== "_SOURCE" && headerKey !== "_INFO" && headerKey !== "_FLAGS" && headerKey !== "_ALIASES") extraHeaders.push(editorState.headers[headerIdx]);
        }

        var sourceLanguageOptions = [];
        var sourceLanguageLabels = [];
        var sourceLanguageSeen = {};
        for (var langIdx = 0; langIdx < languageHeaders.length; langIdx++) {
            var langCode = normalizeGlossaryLanguageCode(languageHeaders[langIdx]);
            if (langCode === "" || sourceLanguageSeen[langCode]) continue;
            sourceLanguageSeen[langCode] = true;
            sourceLanguageOptions.push(langCode);
            sourceLanguageLabels.push(langCode + " (" + getLocalizedLanguageName(langCode) + ")");
        }
        if (sourceLanguageOptions.length === 0) {
            sourceLanguageOptions.push("DE");
            sourceLanguageLabels.push("DE (" + getLocalizedLanguageName("DE") + ")");
        }

        var glossaryDialogWidth = 1100;
        var glossaryDialogHeight = 760;
        var glossaryMetaWidth = 460;
        var glossaryFieldWidth = 140;

        var dlg = new Window("dialog", t("glossary_editor_title"), undefined, { resizeable: true });
        dlg.orientation = "column";
        dlg.alignChildren = ["fill", "top"];
        dlg.spacing = 8;
        dlg.minimumSize = [960, 750];
        dlg.preferredSize = [glossaryDialogWidth, glossaryDialogHeight];

        var introText = dlg.add("statictext", undefined, t("glossary_editor_intro"), { multiline: true });
        introText.preferredSize.width = 700;

        var pathGroup = dlg.add("group");
        pathGroup.alignment = "fill";
        pathGroup.alignChildren = ["left", "center"];
        pathGroup.add("statictext", undefined, t("glossary_editor_path"));
        var pathInput = pathGroup.add("edittext", undefined, editorState.path, { readonly: true });
        pathInput.alignment = ["fill", "center"];
        pathInput.characters = 52;

        var contentGroup = dlg.add("group");
        contentGroup.orientation = "row";
        contentGroup.alignChildren = ["fill", "fill"];
        contentGroup.alignment = "fill";
        contentGroup.spacing = 10;

        var listPanel = contentGroup.add("panel", undefined, t("glossary_editor_entries"));
        listPanel.orientation = "column";
        listPanel.alignChildren = ["fill", "top"];
        listPanel.alignment = ["left", "top"];
        listPanel.margins = 12;
        listPanel.spacing = 6;
        listPanel.preferredSize.width = 280;

        var searchGroup = listPanel.add("group");
        searchGroup.alignment = "fill";
        searchGroup.alignChildren = ["left", "center"];
        searchGroup.add("statictext", undefined, t("glossary_editor_search"));
        var searchInput = searchGroup.add("edittext", undefined, "");
        searchInput.alignment = ["fill", "center"];
        searchInput.characters = 12;

        var entryList = listPanel.add("listbox", undefined, [], { multiselect: false });
        entryList.alignment = "fill";
        entryList.preferredSize = [250, 320];

        var listInfoText = listPanel.add("statictext", undefined, "", { multiline: true });
        listInfoText.preferredSize.width = 250;

        var listButtonGroup = listPanel.add("group");
        listButtonGroup.orientation = "column";
        listButtonGroup.alignment = "fill";
        listButtonGroup.alignChildren = ["fill", "center"];
        listButtonGroup.spacing = 8;
        var btnNewEntry = listButtonGroup.add("button", undefined, t("glossary_editor_new"));
        btnNewEntry.preferredSize = [90, 28];
        btnNewEntry.alignment = "fill";
        var btnDeleteEntry = listButtonGroup.add("button", undefined, t("glossary_editor_delete"));
        btnDeleteEntry.preferredSize = [90, 28];
        btnDeleteEntry.alignment = "fill";
        var btnReloadEntries = listButtonGroup.add("button", undefined, t("glossary_editor_reload"));
        btnReloadEntries.preferredSize = [110, 28];
        btnReloadEntries.alignment = "fill";

        var detailPanel = contentGroup.add("panel", undefined, t("glossary_editor_details"));
        detailPanel.orientation = "column";
        detailPanel.alignChildren = ["fill", "top"];
        detailPanel.alignment = "fill";
        detailPanel.margins = 12;
        detailPanel.spacing = 8;

        var metaPanel = detailPanel.add("group");
        metaPanel.orientation = "column";
        metaPanel.alignChildren = ["fill", "top"];
        metaPanel.spacing = 8;

        var metaTopRow = metaPanel.add("group");
        metaTopRow.orientation = "row";
        metaTopRow.alignment = "fill";
        metaTopRow.alignChildren = ["fill", "top"];
        metaTopRow.spacing = 12;

        var sourceFieldGroup = metaTopRow.add("group");
        sourceFieldGroup.orientation = "column";
        sourceFieldGroup.alignChildren = ["fill", "top"];
        sourceFieldGroup.alignment = ["left", "top"];
        sourceFieldGroup.spacing = 4;
        sourceFieldGroup.add("statictext", undefined, t("glossary_editor_source_language"));
        var sourceLanguageDropdown = sourceFieldGroup.add("dropdownlist", undefined, sourceLanguageLabels);
        sourceLanguageDropdown.preferredSize.width = 220;
        var sourceLanguageHelpText = sourceFieldGroup.add("statictext", undefined, t("glossary_editor_source_language_help"), { multiline: true });
        sourceLanguageHelpText.preferredSize.width = 220;

        var flagsFieldGroup = metaTopRow.add("group");
        flagsFieldGroup.orientation = "column";
        flagsFieldGroup.alignChildren = ["fill", "top"];
        flagsFieldGroup.alignment = ["left", "top"];
        flagsFieldGroup.spacing = 4;
        flagsFieldGroup.add("statictext", undefined, t("glossary_editor_flags"));
        var flagsDropdown = flagsFieldGroup.add("dropdownlist", undefined, []);
        flagsDropdown.preferredSize.width = 180;
        var flagsHelpText = flagsFieldGroup.add("statictext", undefined, t("glossary_editor_flags_help"), { multiline: true });
        flagsHelpText.preferredSize.width = 180;

        var aliasesFieldGroup = metaTopRow.add("group");
        aliasesFieldGroup.orientation = "column";
        aliasesFieldGroup.alignChildren = ["fill", "top"];
        aliasesFieldGroup.alignment = "fill";
        aliasesFieldGroup.spacing = 4;
        aliasesFieldGroup.add("statictext", undefined, t("glossary_editor_aliases"));
        var aliasesInput = aliasesFieldGroup.add("edittext", undefined, "");
        aliasesInput.alignment = "fill";
        aliasesInput.characters = 22;
        var aliasesHelpText = aliasesFieldGroup.add("statictext", undefined, t("glossary_editor_aliases_help"), { multiline: true });
        aliasesHelpText.preferredSize.width = 260;

        metaPanel.add("statictext", undefined, t("glossary_editor_info"));
        var infoInput = metaPanel.add("edittext", undefined, "", { multiline: true, scrolling: true });
        infoInput.alignment = "fill";
        infoInput.preferredSize = [glossaryMetaWidth, 30];
        var infoHelpText = metaPanel.add("statictext", undefined, t("glossary_editor_info_help"), { multiline: true });
        infoHelpText.preferredSize.width = glossaryMetaWidth;

        var languagesPanel = detailPanel.add("panel", undefined, t("glossary_editor_languages"));
        languagesPanel.orientation = "column";
        languagesPanel.alignChildren = ["fill", "fill"];
        languagesPanel.margins = 12;
        languagesPanel.spacing = 8;
        languagesPanel.alignment = "fill";

        var languageTabs = languagesPanel.add("tabbedpanel");
        languageTabs.alignment = "fill";
        languageTabs.preferredSize = [460, 170];

        var detailInputsByKey = {};
        detailInputsByKey._ALIASES = aliasesInput;
        detailInputsByKey._INFO = infoInput;

        function setFlagsDropdownValue(rawValue) {
            var normalizedRaw = trimGlossaryEditorValue(rawValue);
            var optionSpecs = [
                { value: "", label: t("glossary_editor_flag_none") },
                { value: "DNT", label: t("glossary_editor_flag_dnt") }
            ];
            var hasExactOption = false;
            for (var optionIdx = 0; optionIdx < optionSpecs.length; optionIdx++) {
                if (optionSpecs[optionIdx].value === normalizedRaw) {
                    hasExactOption = true;
                    break;
                }
            }
            if (normalizedRaw !== "" && !hasExactOption) optionSpecs.push({ value: normalizedRaw, label: normalizedRaw });

            flagsDropdown.removeAll();
            var selectedIndex = 0;
            for (var specIdx = 0; specIdx < optionSpecs.length; specIdx++) {
                var optionItem = flagsDropdown.add("item", optionSpecs[specIdx].label);
                optionItem.flagValue = optionSpecs[specIdx].value;
                if (optionSpecs[specIdx].value === normalizedRaw) selectedIndex = specIdx;
            }
            flagsDropdown.selection = selectedIndex;
        }

        function getFlagsDropdownValue() {
            if (!flagsDropdown.selection) return "";
            return trimGlossaryEditorValue(flagsDropdown.selection.flagValue || "");
        }

        function createGlossaryEditorField(parent, labelText, multiline, preferredHeight) {
            var fieldGroup = parent.add("group");
            fieldGroup.orientation = "column";
            fieldGroup.alignChildren = ["fill", "top"];
            fieldGroup.alignment = "fill";
            var label = fieldGroup.add("statictext", undefined, labelText);
            var options = multiline ? { multiline: true, scrolling: true } : undefined;
            var input = fieldGroup.add("edittext", undefined, "", options);
            input.alignment = "fill";
            if (multiline) input.preferredSize = [glossaryFieldWidth, preferredHeight || 42];
            else input.characters = 22;
            return { group: fieldGroup, label: label, input: input };
        }

        var languageChunkSize = 9;
        for (var chunkStart = 0, tabIndex = 1; chunkStart < languageHeaders.length; chunkStart += languageChunkSize, tabIndex++) {
            var chunkHeaders = languageHeaders.slice(chunkStart, chunkStart + languageChunkSize);
            var tab = languageTabs.add("tab", undefined, t("glossary_editor_tab_languages", { index: tabIndex }));
            tab.orientation = "column";
            tab.alignChildren = ["fill", "top"];
            tab.spacing = 8;

            for (var chunkRow = 0; chunkRow < chunkHeaders.length; chunkRow += 3) {
                var chunkRowGroup = tab.add("group");
                chunkRowGroup.orientation = "row";
                chunkRowGroup.alignChildren = ["fill", "top"];
                chunkRowGroup.alignment = "fill";
                chunkRowGroup.spacing = 10;

                for (var chunkCol = 0; chunkCol < 3; chunkCol++) {
                    var headerPos = chunkRow + chunkCol;
                    if (headerPos >= chunkHeaders.length) {
                        var spacerGroup = chunkRowGroup.add("group");
                        spacerGroup.alignment = "fill";
                        continue;
                    }
                    var headerName = chunkHeaders[headerPos];
                    var headerKey = normalizeGlossaryHeaderKey(headerName);
                    var field = createGlossaryEditorField(
                        chunkRowGroup,
                        headerName + " (" + getLocalizedLanguageName(headerName) + ")",
                        false,
                        22
                    );
                    detailInputsByKey[headerKey] = field.input;
                }
            }
        }
        if (languageTabs.children.length > 0) languageTabs.selection = 0;

        var extraPanel = detailPanel.add("panel", undefined, t("glossary_editor_more_fields"));
        extraPanel.orientation = "column";
        extraPanel.alignChildren = ["fill", "top"];
        extraPanel.margins = 12;
        extraPanel.spacing = 8;
        extraPanel.alignment = "fill";

        for (var extraIdx = 0; extraIdx < extraHeaders.length; extraIdx++) {
            var extraHeader = extraHeaders[extraIdx];
            var extraKey = normalizeGlossaryHeaderKey(extraHeader);
            var extraField = createGlossaryEditorField(
                extraPanel,
                extraHeader,
                /^_(INFO|NOTE|NOTES|COMMENT|COMMENTS)$/i.test(extraKey),
                54
            );
            detailInputsByKey[extraKey] = extraField.input;
        }

        if (extraHeaders.length === 0) {
            extraPanel.visible = false;
            extraPanel.maximumSize = [0, 0];
            extraPanel.minimumSize = [0, 0];
            extraPanel.preferredSize = [0, 0];
        }

        var footerGroup = dlg.add("group");
        footerGroup.alignment = "fill";
        footerGroup.alignChildren = ["fill", "center"];
        footerGroup.spacing = 8;
        footerGroup.minimumSize.height = 40;
        footerGroup.maximumSize.height = 40;

        var statusText = footerGroup.add("statictext", undefined, "", { multiline: true });
        statusText.alignment = "fill";
        statusText.preferredSize.width = 420;

        var btnClose = footerGroup.add("button", undefined, t("glossary_editor_close"), { name: "cancel" });
        btnClose.preferredSize = [120, 28];
        var btnSave = footerGroup.add("button", undefined, t("glossary_editor_save"), { name: "ok" });
        btnSave.preferredSize = [140, 30];

        var filteredEntryIds = [];
        var isSyncingDetailUI = false;
        var pendingDetailChanges = false;
        var editorDirty = false;
        var allowDialogClose = false;
        var dialogAction = "close";
        var activeEntryId = 0;
        var glossaryDialogHasShown = false;

        function findEntryById(entryId) {
            for (var i = 0; i < editorState.entries.length; i++) {
                if (editorState.entries[i].id === entryId) return editorState.entries[i];
            }
            return null;
        }

        function getSelectedEntry() {
            if (!entryList.selection || !filteredEntryIds[entryList.selection.index]) return null;
            return findEntryById(filteredEntryIds[entryList.selection.index]);
        }

        function getActiveEntry() {
            return activeEntryId ? findEntryById(activeEntryId) : null;
        }

        function hasUnsavedGlossaryChanges() {
            return editorDirty || pendingDetailChanges;
        }

        function getSelectedSourceLanguageCode() {
            var selectedIndex = (sourceLanguageDropdown.selection && sourceLanguageDropdown.selection.index >= 0) ? sourceLanguageDropdown.selection.index : 0;
            return sourceLanguageOptions[selectedIndex] || "DE";
        }

        function refreshStatusText() {
            var visibleCount = filteredEntryIds.length;
            var totalCount = editorState.entries.length;
            statusText.text = t(
                hasUnsavedGlossaryChanges() ? "glossary_editor_status_dirty" : "glossary_editor_status",
                { visible: visibleCount, total: totalCount }
            );
            if (totalCount === 0) listInfoText.text = t("glossary_editor_empty_list");
            else if (visibleCount === 0) listInfoText.text = t("glossary_editor_no_matches");
            else listInfoText.text = "";
        }

        function applyGlossaryDialogResponsiveLayout(forcedWidth, forcedHeight) {
            var dialogHeight = forcedHeight || glossaryDialogHeight;
            var dialogWidth = forcedWidth || glossaryDialogWidth;
            if ((!forcedWidth || !forcedHeight) && glossaryDialogHasShown) {
                try {
                    var bounds = dlg.bounds;
                    dialogWidth = bounds[2] - bounds[0];
                    dialogHeight = bounds[3] - bounds[1];
                } catch (boundsErr) {}
            }

            var contentHeight = Math.max(320, dialogHeight - 230);
            var listPanelHeight = Math.max(420, contentHeight - 85);
            var listHeight = Math.max(210, listPanelHeight - 180);
            var tabsHeight = Math.max(220, contentHeight - 220);
            var detailWidth = Math.max(560, dialogWidth - 370);
            var metaWidth = Math.max(520, detailWidth - 40);
            var sourceFieldWidth = Math.max(180, Math.min(240, Math.floor((detailWidth - 40) * 0.24)));
            var flagsFieldWidth = Math.max(160, Math.min(220, Math.floor((detailWidth - 40) * 0.20)));
            var aliasesFieldWidth = Math.max(220, detailWidth - sourceFieldWidth - flagsFieldWidth - 40);
            var fieldWidth = Math.max(140, Math.floor((detailWidth - 70) / 3));

            try {
                contentGroup.minimumSize.height = contentHeight;
                contentGroup.maximumSize.height = contentHeight;
                contentGroup.preferredSize.height = contentHeight;
            } catch (contentSizeErr) {}

            try {
                listPanel.minimumSize.width = 280;
                listPanel.maximumSize.width = 320;
                listPanel.minimumSize.height = listPanelHeight;
                listPanel.maximumSize.height = listPanelHeight;
                listPanel.preferredSize.height = listPanelHeight;
            } catch (listPanelWidthErr) {}

            try {
                detailPanel.minimumSize.height = contentHeight;
                detailPanel.maximumSize.height = contentHeight;
            } catch (detailPanelHeightErr) {}

            try { entryList.preferredSize = [250, listHeight]; } catch (entryListSizeErr) {}
            try { listInfoText.preferredSize.width = 250; } catch (listInfoSizeErr) {}
            try { detailPanel.minimumSize.width = detailWidth; } catch (detailPanelWidthErr) {}
            try {
                sourceFieldGroup.minimumSize.width = sourceFieldWidth;
                sourceFieldGroup.maximumSize.width = sourceFieldWidth;
                sourceLanguageDropdown.preferredSize.width = sourceFieldWidth;
                sourceLanguageHelpText.preferredSize.width = sourceFieldWidth;
            } catch (sourceHelpErr) {}
            try {
                flagsFieldGroup.minimumSize.width = flagsFieldWidth;
                flagsFieldGroup.maximumSize.width = flagsFieldWidth;
                flagsDropdown.preferredSize.width = flagsFieldWidth;
                flagsHelpText.preferredSize.width = flagsFieldWidth;
            } catch (flagsHelpErr) {}
            try {
                aliasesFieldGroup.minimumSize.width = aliasesFieldWidth;
                aliasesInput.preferredSize.width = aliasesFieldWidth;
                aliasesHelpText.preferredSize.width = aliasesFieldWidth;
            } catch (aliasesHelpErr) {}
            try { infoInput.preferredSize = [metaWidth, 30]; } catch (infoSizeErr) {}
            try { infoHelpText.preferredSize.width = metaWidth; } catch (infoHelpErr) {}
            try {
                languagesPanel.minimumSize.height = tabsHeight + 34;
                languagesPanel.maximumSize.height = tabsHeight + 34;
            } catch (languagesPanelHeightErr) {}
            try { languageTabs.preferredSize = [Math.max(360, detailWidth - 30), tabsHeight]; } catch (tabsSizeErr) {}

            glossaryMetaWidth = metaWidth;
            glossaryFieldWidth = fieldWidth;
        }

        function setDetailControlsEnabled(isEnabled) {
            metaPanel.enabled = !!isEnabled;
            languagesPanel.enabled = !!isEnabled;
            extraPanel.enabled = !!isEnabled;
            btnDeleteEntry.enabled = !!isEnabled;
        }

        function selectSourceLanguageDropdown(languageCode) {
            var normalized = normalizeGlossaryLanguageCode(languageCode);
            var selectionIndex = 0;
            for (var i = 0; i < sourceLanguageOptions.length; i++) {
                if (sourceLanguageOptions[i] === normalized) {
                    selectionIndex = i;
                    break;
                }
            }
            sourceLanguageDropdown.selection = selectionIndex;
        }

        function populateDetailFields(entry) {
            isSyncingDetailUI = true;
            if (!entry) {
                activeEntryId = 0;
                selectSourceLanguageDropdown("DE");
                setFlagsDropdownValue("");
                for (var i = 0; i < editorState.headers.length; i++) {
                    var clearKey = normalizeGlossaryHeaderKey(editorState.headers[i]);
                    if (clearKey === "_SOURCE") continue;
                    if (detailInputsByKey[clearKey]) detailInputsByKey[clearKey].text = "";
                }
                pendingDetailChanges = false;
                isSyncingDetailUI = false;
                setDetailControlsEnabled(false);
                refreshStatusText();
                return;
            }

            activeEntryId = entry.id;
            setDetailControlsEnabled(true);
            for (var headerIndex = 0; headerIndex < editorState.headers.length; headerIndex++) {
                var headerKey = normalizeGlossaryHeaderKey(editorState.headers[headerIndex]);
                var value = entry.row[headerIndex] || "";
                if (headerKey === "_SOURCE") {
                    selectSourceLanguageDropdown(value);
                } else if (headerKey === "_FLAGS") {
                    setFlagsDropdownValue(value);
                } else if (detailInputsByKey[headerKey]) {
                    detailInputsByKey[headerKey].text = value;
                }
            }
            pendingDetailChanges = false;
            isSyncingDetailUI = false;
            refreshStatusText();
        }

        function applyDetailChangesToSelection(markDirty) {
            if (!pendingDetailChanges) return;
            var selectedEntry = getActiveEntry();
            if (!selectedEntry) {
                pendingDetailChanges = false;
                refreshStatusText();
                return;
            }

            var beforeSnapshot = selectedEntry.row.join("\u0001");
            for (var headerIndex = 0; headerIndex < editorState.headers.length; headerIndex++) {
                var headerKey = normalizeGlossaryHeaderKey(editorState.headers[headerIndex]);
                if (headerKey === "_SOURCE") {
                    selectedEntry.row[headerIndex] = getSelectedSourceLanguageCode();
                } else if (headerKey === "_FLAGS") {
                    selectedEntry.row[headerIndex] = getFlagsDropdownValue();
                } else if (detailInputsByKey[headerKey]) {
                    selectedEntry.row[headerIndex] = trimGlossaryEditorValue(detailInputsByKey[headerKey].text);
                }
            }
            refreshGlossaryEditorEntry(selectedEntry, editorState.headers);
            pendingDetailChanges = false;
            if (markDirty && beforeSnapshot !== selectedEntry.row.join("\u0001")) editorDirty = true;
            refreshStatusText();
        }

        function rebuildEntryList(preferredEntryId) {
            var filterText = trimGlossaryEditorValue(searchInput.text).toLowerCase();
            filteredEntryIds = [];
            entryList.removeAll();

            for (var i = 0; i < editorState.entries.length; i++) {
                var entry = editorState.entries[i];
                if (filterText !== "" && entry.searchText.indexOf(filterText) === -1) continue;
                filteredEntryIds.push(entry.id);
                entryList.add("item", entry.label);
            }

            var selectionIndex = -1;
            if (preferredEntryId) {
                for (var idx = 0; idx < filteredEntryIds.length; idx++) {
                    if (filteredEntryIds[idx] === preferredEntryId) {
                        selectionIndex = idx;
                        break;
                    }
                }
            }
            if (selectionIndex < 0 && filteredEntryIds.length > 0) selectionIndex = 0;

            isSyncingDetailUI = true;
            if (selectionIndex >= 0) entryList.selection = selectionIndex;
            else entryList.selection = null;
            isSyncingDetailUI = false;

            populateDetailFields(getSelectedEntry());
            refreshStatusText();
        }

        function markDetailChangesPending() {
            if (isSyncingDetailUI) return;
            pendingDetailChanges = true;
            refreshStatusText();
        }

        sourceLanguageDropdown.onChange = markDetailChangesPending;
        flagsDropdown.onChange = markDetailChangesPending;
        aliasesInput.onChanging = markDetailChangesPending;
        infoInput.onChanging = markDetailChangesPending;
        for (var detailKey in detailInputsByKey) {
            if (!detailInputsByKey.hasOwnProperty(detailKey)) continue;
            if (detailInputsByKey[detailKey] === aliasesInput || detailInputsByKey[detailKey] === infoInput) continue;
            detailInputsByKey[detailKey].onChanging = markDetailChangesPending;
        }

        searchInput.onChanging = function() {
            var selectedEntry = getActiveEntry();
            applyDetailChangesToSelection(true);
            rebuildEntryList(selectedEntry ? selectedEntry.id : 0);
        };

        entryList.onChange = function() {
            if (isSyncingDetailUI) return;
            var nextEntry = getSelectedEntry();
            applyDetailChangesToSelection(true);
            populateDetailFields(nextEntry);
        };

        btnNewEntry.onClick = function() {
            applyDetailChangesToSelection(true);
            var newEntryName = promptForNewGlossaryEntryName(getSelectedSourceLanguageCode());
            if (!newEntryName) return;
            var newRow = createBlankGlossaryEditorRow(editorState.headers.length);
            var sourceIdx = findGlossaryHeaderIndex(editorState.headers, "_SOURCE");
            var selectedSourceLang = getSelectedSourceLanguageCode();
            if (sourceIdx >= 0) newRow[sourceIdx] = selectedSourceLang;
            var sourceLangIdx = findGlossaryHeaderIndex(editorState.headers, selectedSourceLang);
            if (sourceLangIdx >= 0) newRow[sourceLangIdx] = newEntryName;
            var newEntry = { id: editorState.nextId++, row: newRow };
            refreshGlossaryEditorEntry(newEntry, editorState.headers);
            editorState.entries.push(newEntry);
            editorDirty = true;
            if (trimGlossaryEditorValue(searchInput.text) !== "") searchInput.text = "";
            rebuildEntryList(newEntry.id);
        };

        btnDeleteEntry.onClick = function() {
            var selectedEntry = getActiveEntry();
            if (!selectedEntry) return;
            if (!confirm(t("glossary_editor_delete_confirm"))) return;

            applyDetailChangesToSelection(true);

            var selectedIndex = entryList.selection ? entryList.selection.index : -1;
            var preferredEntryId = 0;
            if (selectedIndex >= 0) {
                if (selectedIndex + 1 < filteredEntryIds.length) preferredEntryId = filteredEntryIds[selectedIndex + 1];
                else if (selectedIndex - 1 >= 0) preferredEntryId = filteredEntryIds[selectedIndex - 1];
            }

            for (var i = 0; i < editorState.entries.length; i++) {
                if (editorState.entries[i].id !== selectedEntry.id) continue;
                editorState.entries.splice(i, 1);
                break;
            }
            editorDirty = true;
            rebuildEntryList(preferredEntryId);
        };

        btnReloadEntries.onClick = function() {
            if (hasUnsavedGlossaryChanges() && !confirm(t("glossary_editor_reload_confirm"))) return;
            dialogAction = "reload";
            allowDialogClose = true;
            dlg.close(2);
        };

        btnSave.onClick = function() {
            applyDetailChangesToSelection(true);
            if (!saveGlossaryEditorState(editorState)) return;
            alert(t("glossary_editor_saved"));
            editorDirty = false;
            pendingDetailChanges = false;
            result.saved = true;
            dialogAction = "save";
            allowDialogClose = true;
            dlg.close(1);
        };

        function handleEditorClose() {
            if (pendingDetailChanges) applyDetailChangesToSelection(true);
            if (hasUnsavedGlossaryChanges() && !confirm(t("glossary_editor_discard_confirm"))) return false;
            dialogAction = "close";
            allowDialogClose = true;
            dlg.close(0);
            return true;
        }

        btnClose.onClick = handleEditorClose;
        dlg.onClose = function() {
            if (allowDialogClose) return true;
            if (pendingDetailChanges) applyDetailChangesToSelection(true);
            if (hasUnsavedGlossaryChanges() && !confirm(t("glossary_editor_discard_confirm"))) return false;
            return true;
        };
        dlg.onShow = function() {
            try { dlg.size = [glossaryDialogWidth, glossaryDialogHeight]; } catch (sizeErr) {}
            applyGlossaryDialogResponsiveLayout(glossaryDialogWidth, glossaryDialogHeight);
            try { this.layout.layout(true); } catch (layoutErr) {}
            try { this.layout.resize(); } catch (resizeErr) {}
            positionDialogCenteredOnMainWindow(dlg, glossaryDialogWidth, glossaryDialogHeight);
            glossaryDialogHasShown = true;
        };
        dlg.onResizing = dlg.onResize = function() {
            glossaryDialogHasShown = true;
            applyGlossaryDialogResponsiveLayout();
            this.layout.resize();
        };

        rebuildEntryList(editorState.entries.length > 0 ? editorState.entries[0].id : 0);

        try { dlg.size = [glossaryDialogWidth, glossaryDialogHeight]; } catch (initialSizeErr) {}
        applyGlossaryDialogResponsiveLayout(glossaryDialogWidth, glossaryDialogHeight);
        var dialogResult = dlg.show();
        if (dialogAction === "reload" || dialogResult === 2) continue;
        return result;
    }
}

function guessCSVSeparator(content) {
    var firstRow = "";
    var inQuotes = false;
    for (var i = 0; i < content.length; i++) {
        var ch = content.charAt(i);
        if (ch === '"') {
            if (inQuotes && i + 1 < content.length && content.charAt(i + 1) === '"') {
                firstRow += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (!inQuotes && (ch === "\r" || ch === "\n")) break;
        firstRow += ch;
    }

    var commaCount = 0;
    var semicolonCount = 0;
    var tabCount = 0;
    inQuotes = false;
    for (var j = 0; j < firstRow.length; j++) {
        var rowChar = firstRow.charAt(j);
        if (rowChar === '"') {
            if (inQuotes && j + 1 < firstRow.length && firstRow.charAt(j + 1) === '"') {
                j++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (!inQuotes) {
            if (rowChar === ';') semicolonCount++;
            else if (rowChar === ',') commaCount++;
            else if (rowChar === '\t') tabCount++;
        }
    }
    if (tabCount > semicolonCount && tabCount > commaCount) return '\t';
    return semicolonCount > commaCount ? ';' : ',';
}

function parseCSVRows(content, separator) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;

    for (var i = 0; i < content.length; i++) {
        var ch = content.charAt(i);
        if (ch === '"') {
            if (inQuotes && i + 1 < content.length && content.charAt(i + 1) === '"') {
                field += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (!inQuotes && ch === separator) {
            row.push(field);
            field = "";
        } else if (!inQuotes && (ch === "\r" || ch === "\n")) {
            row.push(field);
            if (row.length > 1 || row[0] !== "") rows.push(row);
            row = [];
            field = "";
            if (ch === "\r" && i + 1 < content.length && content.charAt(i + 1) === "\n") i++;
        } else {
            field += ch;
        }
    }

    if (field !== "" || row.length > 0) {
        row.push(field);
        if (row.length > 1 || row[0] !== "") rows.push(row);
    }
    return rows;
}

function sanitizeCSVContent(content) {
    if (content === null || content === undefined) return "";
    return String(content)
        .replace(/^\uFEFF/, '')
        .replace(/\u0000/g, '');
}

function tryReadCSVContent(path, encoding) {
    var f = new File(path);
    if (!f.exists) return null;
    try {
        if (encoding && encoding !== "") f.encoding = encoding;
        f.open('r');
        var content = f.read();
        f.close();
        return sanitizeCSVContent(content);
    } catch (e) {
        try { if (f.opened) f.close(); } catch (closeErr) {}
        return null;
    }
}

function countSuspiciousCSVDecodeChars(content) {
    if (!content) return 0;
    // Typical mojibake artifacts when legacy CSVs are read with the wrong code page.
    // We keep the list intentionally small so legitimate accented text is not penalized.
    return (String(content).match(/[ƒ‡ˆŠ‹ŒŽ˜™š›žŸ]/g) || []).length;
}

function getCSVDecodeScore(content, rows) {
    if (!content || !rows || rows.length < 2) return 999999;

    var score = 0;
    var header = rows[0] || [];
    if (header.length < 2) score += 10000;

    var header0 = "";
    try { header0 = sanitizeCSVContent(header[0]).replace(/^\s+|\s+$/g, '').toUpperCase(); } catch (e) {}
    if (header0 !== "DE") score += 5000;

    var replacementChars = (String(content).match(/\uFFFD/g) || []).length;
    score += replacementChars * 100;

    var controlChars = (String(content).match(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
    score += controlChars * 10;

    var suspiciousDecodeChars = countSuspiciousCSVDecodeChars(content);
    score += suspiciousDecodeChars * 25;

    return score;
}

function loadCSVGlossary(path) {
    var state = loadGlossaryRowsState(path);
    if (!state.ok) {
        if (state.path && !state.missing) {
            reportGlossaryWarningOnce(
                "glossary_read_failed",
                "glossary_read_warning",
                "Glossar-Datei konnte nicht sicher gelesen werden: " + state.path
            );
        }
        return null;
    }

    if (state.source === "backup") {
        var corruptSnapshot = snapshotCorruptGlossaryFile(state.primaryPath || path);
        reportGlossaryWarningOnce(
            "glossary_read_backup",
            "glossary_read_warning",
            "Glossar-Hauptdatei war nicht lesbar. Sicherung wird verwendet." +
                (corruptSnapshot ? " Defekte Datei gesichert unter: " + corruptSnapshot.fsName : "")
        );
    }

    var glossary = {};
    try {
        var rows = state.rows;
        if (!rows) return null;
        if (rows.length < 2) return null;

        var headers = rows[0];
        var columnKinds = [];
        for (var h = 0; h < headers.length; h++) {
            headers[h] = sanitizeCSVContent(headers[h]).replace(/^\s+|\s+$/g, '').toUpperCase();
            if (isSupportedGlossaryLanguageHeader(headers[h])) columnKinds[h] = "lang";
            else if (isGlossaryMetaHeader(headers[h])) columnKinds[h] = "meta";
            else columnKinds[h] = "ignore";
        }

        for (var i = 1; i < rows.length; i++) {
            var cols = rows[i];
            if (!cols || cols.length === 0) continue;
            var firstNonEmpty = "";
            for (var firstIdx = 0; firstIdx < cols.length; firstIdx++) {
                firstNonEmpty = sanitizeCSVContent(cols[firstIdx]).replace(/^\s+|\s+$/g, '');
                if (firstNonEmpty !== "") break;
            }
            if (firstNonEmpty === "") continue;
            if (isGlossaryCommentRow(firstNonEmpty)) continue;

            var entry = {};
            var meta = {};
            for (var j = 0; j < cols.length; j++) {
                if (j >= headers.length) continue;
                var val = sanitizeCSVContent(cols[j]).replace(/^\s+|\s+$/g, '');
                if (val === "") continue;
                if (columnKinds[j] === "lang") entry[headers[j]] = val;
                else if (columnKinds[j] === "meta") meta[headers[j]] = val;
            }

            var hasEntryData = false;
            for (var entryKey in entry) {
                if (entry.hasOwnProperty(entryKey)) { hasEntryData = true; break; }
            }
            for (var metaKey in meta) {
                if (meta.hasOwnProperty(metaKey)) { hasEntryData = true; break; }
            }
            if (!hasEntryData) continue;

            if (meta.hasOwnProperty("_FLAGS")) entry.__flags = parseGlossaryFlags(meta._FLAGS);
            if (meta.hasOwnProperty("_ALIASES")) entry.__aliases = parseGlossaryAliases(meta._ALIASES);
            entry.__sourceLang = "DE";
            if (meta.hasOwnProperty("_SOURCE")) {
                var sourceCandidate = normalizeGlossaryLanguageCode(meta._SOURCE);
                if (isSupportedGlossaryLanguageHeader(sourceCandidate)) entry.__sourceLang = sourceCandidate;
            }
            if (hasOwnMappings(meta)) entry.__meta = meta;

            var sourceText = "";
            if (entry.hasOwnProperty(entry.__sourceLang)) {
                sourceText = String(entry[entry.__sourceLang] || "").replace(/^\s+|\s+$/g, "");
            }
            if (sourceText === "" && entry.__sourceLang !== "DE" && entry.hasOwnProperty("DE")) {
                sourceText = String(entry.DE || "").replace(/^\s+|\s+$/g, "");
            }
            if (sourceText === "") {
                for (var headerIdx = 0; headerIdx < headers.length; headerIdx++) {
                    if (columnKinds[headerIdx] !== "lang") continue;
                    if (entry.hasOwnProperty(headers[headerIdx])) {
                        sourceText = String(entry[headers[headerIdx]] || "").replace(/^\s+|\s+$/g, "");
                        if (sourceText !== "") break;
                    }
                }
            }
            if (sourceText === "") continue;
            entry.__sourceText = sourceText;

            glossary[sourceText] = entry;

            if (entry.__aliases && entry.__aliases.length > 0) {
                for (var aliasIdx = 0; aliasIdx < entry.__aliases.length; aliasIdx++) {
                    var alias = entry.__aliases[aliasIdx];
                    if (alias && alias !== "" && !glossary.hasOwnProperty(alias)) glossary[alias] = entry;
                }
            }
        }
        return glossary;
    } catch(e) { return null; }
}

function getGlossaryOverrideForTarget(entry, targetUpper, shortTarget) {
    if (!entry) return null;
    var rawValue = null;
    var sourceLang = entry.__sourceLang ? normalizeGlossaryLanguageCode(entry.__sourceLang) : "DE";

    if ((!entry.__flags || !entry.__flags.DNT) && (isMatchingGlossaryLanguageCode(sourceLang, targetUpper) || isMatchingGlossaryLanguageCode(sourceLang, shortTarget))) {
        return null;
    }

    if (entry.hasOwnProperty(targetUpper)) rawValue = entry[targetUpper];
    else if (entry.hasOwnProperty(shortTarget)) rawValue = entry[shortTarget];
    else if (entry.__flags && entry.__flags.DNT) return "###DNT###";

    if (rawValue === null || rawValue === undefined) return null;

    var trimmed = String(rawValue).replace(/^\s+|\s+$/g, "");
    if (trimmed === "") return null;
    if (trimmed === "###DNT###" || trimmed.toUpperCase() === "DNT") return "###DNT###";
    return String(rawValue);
}

function buildGlossaryRuntime(parsedGlossary, selectedLang) {
    var runtime = { map: {}, regex: null };
    if (!parsedGlossary || !selectedLang) return runtime;

    var terms = [];
    var targetUpper = String(selectedLang).toUpperCase();
    var shortTarget = targetUpper.substring(0, 2);

    for (var key in parsedGlossary) {
        if (!parsedGlossary.hasOwnProperty(key)) continue;
        var glossaryOverride = getGlossaryOverrideForTarget(parsedGlossary[key], targetUpper, shortTarget);
        if (glossaryOverride !== null) {
            terms.push(key);
            runtime.map[key.toLowerCase()] = glossaryOverride;
        }
    }

    if (terms.length > 0) {
        terms.sort(function(a, b) { return b.length - a.length; });
        for (var termIndex = 0; termIndex < terms.length; termIndex++) {
            terms[termIndex] = terms[termIndex].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }
        runtime.regex = new RegExp("(^|[^\\wäöüÄÖÜßéèêáàâíìîóòôúùûñ])(" + terms.join("|") + ")(?=[^\\wäöüÄÖÜßéèêáàâíìîóòôúùûñ]|$)", "gi");
    }

    return runtime;
}

function glossaryAffectsText(text, glossaryRuntime) {
    if (!text || !glossaryRuntime || !glossaryRuntime.regex) return false;
    var probe = normalizeGlossaryLookupText(text);
    if (probe === "") return false;
    glossaryRuntime.regex.lastIndex = 0;
    return glossaryRuntime.regex.test(probe);
}

function applyGlossaryRuntimeToChunk(chunk, glossaryRuntime) {
    if (!chunk || !glossaryRuntime || !glossaryRuntime.regex) return chunk;

    return chunk.replace(glossaryRuntime.regex, function(match, prefix, term, offset, string) {
        if (offset >= 7 && (string.substring(offset - 7, offset) === "###TBL_" || string.substring(offset - 7, offset) === "###IMG_")) return match;

        var lowerMatch = term.toLowerCase();
        var mappedVal = glossaryRuntime.map[lowerMatch];
        var replacement = term;
        if (mappedVal === "###DNT###") replacement = '<nt>' + term + '</nt>';
        else if (mappedVal && mappedVal !== "") replacement = '<nt>' + escapeDeepLXMLText(mappedVal) + '</nt>';
        return prefix + replacement;
    });
}

function getTechnicalTokenRegex() {
    return /\b([A-Z]+[0-9]+[A-Z0-9]*(?:[\*xX\/-][0-9]+[A-Z0-9]*)*|[0-9]+[A-Z]+[A-Z0-9]*(?:[\*xX\/-][0-9]+[A-Z0-9]*)*|[0-9]{4,})\b/g;
}

function protectChunkNonTranslatables(chunk) {
    if (!chunk || chunk === "") return chunk;

    var regexArt = getTechnicalTokenRegex();
    chunk = chunk.replace(regexArt, function(match, p1, offset, string) {
        var before = string.substring(0, offset);
        var openTags = (before.match(/<nt>/g) || []).length;
        var closeTags = (before.match(/<\/nt>/g) || []).length;
        if (openTags > closeTags) return match;

        if (offset >= 7 && (string.substring(offset - 7, offset) === "###TBL_" || string.substring(offset - 7, offset) === "###IMG_")) return match;
        return '<nt>' + match + '</nt>';
    });

    chunk = chunk.replace(/###(TBL_\d+|IMG_\d+)###/g, '<nt>###$1###</nt>');
    return chunk;
}

function buildPlainTranslationXML(text, glossaryRuntime) {
    var chunk = escapeDeepLXMLText(text);
    chunk = applyGlossaryRuntimeToChunk(chunk, glossaryRuntime);
    chunk = protectChunkNonTranslatables(chunk);
    return "<root>" + chunk + "</root>";
}

function normalizeGlossaryLookupText(text) {
    if (text === null || text === undefined) return "";
    return String(text)
        .replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/^\s+|\s+$/g, "");
}

function getExactGlossaryOverrideForText(parsedGlossary, text, selectedLang) {
    if (!parsedGlossary) return null;

    var lookup = normalizeGlossaryLookupText(text);
    if (lookup === "") return null;

    var targetUpper = String(selectedLang).toUpperCase();
    var shortTarget = targetUpper.substring(0, 2);

    if (parsedGlossary.hasOwnProperty(lookup)) {
        return getGlossaryOverrideForTarget(parsedGlossary[lookup], targetUpper, shortTarget);
    }

    var lowerLookup = lookup.toLowerCase();
    for (var key in parsedGlossary) {
        if (!parsedGlossary.hasOwnProperty(key)) continue;
        if (normalizeGlossaryLookupText(key).toLowerCase() !== lowerLookup) continue;
        return getGlossaryOverrideForTarget(parsedGlossary[key], targetUpper, shortTarget);
    }

    return null;
}

function buildStyledPlainTextXML(textObj, replacementText) {
    var fFamily = "Arial";
    var fStyle = "Regular";
    var pSize = "12";
    var pStyleNameRaw = "";
    var ldingStr = "AUTO";
    var fColor = "";
    var cStyleRaw = "";
    var pAlign = "";
    var lInd = "0";
    var fInd = "0";
    var bList = "";

    try {
        var ranges = textObj.textStyleRanges;
        if (ranges && ranges.length > 0) {
            var firstRange = ranges[0];
            try { fFamily = String(firstRange.appliedFont.fontFamily); } catch (e1) {}
            try { fStyle = String(firstRange.fontStyle); } catch (e2) {}
            try { pSize = String(firstRange.pointSize); } catch (e3) {}
            try { pStyleNameRaw = String(firstRange.appliedParagraphStyle.name); } catch (e4) {}
            try { if (firstRange.leading !== Leading.AUTO) ldingStr = String(firstRange.leading); } catch (e5) {}
            try { fColor = String(firstRange.fillColor.name); } catch (e6) {}
            try { cStyleRaw = String(firstRange.appliedCharacterStyle.name); } catch (e7) {}
            try { pAlign = String(firstRange.justification); } catch (e8) {}
            try { lInd = String(firstRange.leftIndent); } catch (e9) {}
            try { fInd = String(firstRange.firstLineIndent); } catch (e10) {}
            try { bList = String(firstRange.bulletsAndNumberingListType); } catch (e11) {}
        }
    } catch (e) {}

    var chunk = escapeDeepLXMLText(replacementText);
    return '<root><t f="' + escapeXMLAttr(fFamily) + '" s="' + escapeXMLAttr(fStyle) + '" z="' + escapeXMLAttr(pSize) + '" p="' + escapeXMLAttr(pStyleNameRaw) + '" l="' + escapeXMLAttr(ldingStr) + '" c="' + escapeXMLAttr(fColor) + '" k="' + escapeXMLAttr(cStyleRaw) + '" a="' + escapeXMLAttr(pAlign) + '" li="' + escapeXMLAttr(lInd) + '" fi="' + escapeXMLAttr(fInd) + '" b="' + escapeXMLAttr(bList) + '">' + chunk + '</t></root>';
}

function getInDesignLanguageCandidates(deepLCode) {
    var map = {
        "EN-US": ["Englisch: USA", "English: USA", "English: US"],
        "EN-GB": ["Englisch: Großbritannien", "English: UK", "English: Great Britain"],
        "EN": ["Englisch: Großbritannien", "English: UK", "English: Great Britain"],
        "FR": ["Französisch", "French"],
        "IT": ["Italienisch", "Italian"],
        "ES": ["Spanisch", "Spanish"],
        "CS": ["Tschechisch", "Czech"],
        "HU": ["Ungarisch", "Hungarian"],
        "NL": ["Niederländisch", "Dutch"],
        "PL": ["Polnisch", "Polish"],
        "PT": ["Portugiesisch", "Portuguese"],
        "PT-PT": ["Portugiesisch", "Portuguese"],
        "RO": ["Rumänisch", "Romanian"],
        "RU": ["Russisch", "Russian"],
        "SK": ["Slowakisch", "Slovak"],
        "SL": ["Slowenisch", "Slovenian"],
        "SV": ["Schwedisch", "Swedish"],
        "DA": ["Dänisch", "Danish"],
        "FI": ["Finnisch", "Finnish"],
        "EL": ["Griechisch", "Greek"],
        "BG": ["Bulgarisch", "Bulgarian"],
        "ET": ["Estnisch", "Estonian"],
        "LT": ["Litauisch", "Lithuanian"],
        "LV": ["Lettisch", "Latvian"]
    };
    return map[String(deepLCode || "").toUpperCase()] || [];
}

function getInDesignLanguageName(deepLCode) {
    var candidates = getInDesignLanguageCandidates(deepLCode);
    return candidates.length > 0 ? candidates[0] : "";
}

function normalizeLanguageLookupKey(name) {
    return String(name || "").toLowerCase().replace(/[^a-z]/g, "");
}

function resolveInDesignLanguageObject(doc, deepLCode) {
    var candidates = getInDesignLanguageCandidates(deepLCode);
    if (candidates.length === 0) return null;

    var collections = [];
    try { collections.push(doc.languagesWithVendors); } catch (e) {}
    try { collections.push(app.languagesWithVendors); } catch (e2) {}

    for (var c = 0; c < collections.length; c++) {
        var coll = collections[c];
        if (!coll) continue;
        for (var i = 0; i < candidates.length; i++) {
            try {
                var exact = coll.itemByName(candidates[i]);
                if (exact && exact.isValid) return exact;
            } catch (exactErr) {}
        }
        var wanted = {};
        for (var j = 0; j < candidates.length; j++) wanted[normalizeLanguageLookupKey(candidates[j])] = true;
        try {
            for (var k = 0; k < coll.length; k++) {
                var lang = coll[k];
                if (!lang || !lang.isValid) continue;
                var langName = "";
                try { langName = String(lang.name); } catch (nameErr) { langName = ""; }
                if (wanted[normalizeLanguageLookupKey(langName)]) return lang;
            }
        } catch (scanErr) {}
    }
    return null;
}

function getCurrentArticleVersionLabel() {
    var d = new Date();
    var year = d.getFullYear() % 100;
    var month = d.getMonth() + 1;
    var version = "v" + ("0" + year).slice(-2) + ("0" + month).slice(-2);
    return "Artikelnummer_" + version;
}

csvPath = ensureGlossaryPathConfigured(csvPath, csvPathSettingRaw);

function updateLanguageMasterVersionLabels(doc) {
    var versionLabel = getCurrentArticleVersionLabel();
    var masterSpreads = doc.masterSpreads;
    for (var m = 0; m < masterSpreads.length; m++) {
        var masterName = masterSpreads[m].name;
        if (!getMasterLang(masterName)) continue;
        var pages = masterSpreads[m].pages;
        for (var p = 0; p < pages.length; p++) {
            var allItems = pages[p].allPageItems;
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                if (item.constructor.name !== "TextFrame") continue;
                try {
                    var story = item.parentStory;
                    if (!story || !story.isValid) continue;
                    var text = story.contents;
                    var newText = text;
                    if (/Artikelnummer(_| )?v?\d{4}/i.test(newText)) {
                        newText = newText.replace(/Artikelnummer(_| )?v?\d{4}/ig, versionLabel);
                    }
                    if (/%VERSION%/i.test(newText)) {
                        newText = newText.replace(/%VERSION%/gi, versionLabel);
                    }
                    if (newText !== text) {
                        story.contents = newText;
                    }
                } catch (e) {}
            }
        }
        // Aktualisiere auch Seiten, die diese Masterseiten verwenden,
        // falls Elemente überschrieben wurden.
        for (var p2 = 0; p2 < doc.pages.length; p2++) {
            if (!doc.pages[p2].appliedMaster || doc.pages[p2].appliedMaster.name !== masterName) continue;
            var pageItems = doc.pages[p2].allPageItems;
            for (var j = 0; j < pageItems.length; j++) {
                var pageItem = pageItems[j];
                if (pageItem.constructor.name !== "TextFrame") continue;
                try {
                    var pageStory = null;
                    try { pageStory = pageItem.parentStory; } catch (e) { pageStory = null; }
                    if ((!pageStory || !pageStory.isValid) && pageItem.texts && pageItem.texts.length > 0) {
                        pageStory = pageItem.texts[0];
                    }
                    if (!pageStory || !pageStory.isValid) continue;
                    var pageText = pageStory.contents;
                    var newPageText = updateVersionStrings(pageText, versionLabel);
                    if (newPageText !== pageText) {
                        pageStory.contents = newPageText;
                    }
                } catch (e) {}
            }
        }
    }
}

// --- 1. BENUTZEROBERFLÄCHE (UI) ---
var myWindow = new Window("palette", SCRIPT_NAME + " v" + SCRIPT_VERSION, undefined, { resizeable: true });
myWindow.orientation = "column";
myWindow.alignChildren = ["fill", "top"];
myWindow.spacing = 10;
myWindow.margins = 14;
myWindow.minimumSize = [740, 420];
myWindow.preferredSize = [860, 500];

var headerGroup = myWindow.add("group");
headerGroup.orientation = "row";
headerGroup.alignment = "fill";
headerGroup.alignChildren = ["fill", "center"];
headerGroup.spacing = 10;

var mainTitle = headerGroup.add("statictext", undefined, t("main_title"));
mainTitle.alignment = ["left", "center"];
mainTitle.graphics.font = ScriptUI.newFont(mainTitle.graphics.font.family, "BOLD", 16);

var headerSpacer = headerGroup.add("statictext", undefined, "");
headerSpacer.alignment = ["fill", "center"];
headerSpacer.minimumSize.width = 0;

var btnSettings = headerGroup.add("button", undefined, t("settings_button"));
btnSettings.helpTip = t("settings_help");
btnSettings.alignment = ["right", "center"];
btnSettings.preferredSize = [150, 30];

var summaryRow = myWindow.add("group");
summaryRow.orientation = "row";
summaryRow.alignment = "fill";
summaryRow.alignChildren = ["fill", "fill"];
summaryRow.spacing = 10;

var statusPanel = summaryRow.add("panel", undefined, t("status_title"));
statusPanel.orientation = "column";
statusPanel.alignChildren = ["fill", "top"];
statusPanel.alignment = ["fill", "fill"];
statusPanel.margins = 12;
statusPanel.preferredSize.width = 450;
var statusSummaryText = statusPanel.add("statictext", undefined, " ", { multiline: true });
statusSummaryText.preferredSize = [400, 74];
statusSummaryText.minimumSize = [400, 74];

var validationPanel = summaryRow.add("panel", undefined, t("validation_title"));
validationPanel.orientation = "column";
validationPanel.alignChildren = ["fill", "top"];
validationPanel.alignment = ["fill", "fill"];
validationPanel.margins = 12;
validationPanel.preferredSize.width = 330;
var validationText = validationPanel.add("statictext", undefined, " ", { multiline: true });
validationText.preferredSize = [290, 68];
validationText.minimumSize = [290, 68];

var modePanel = myWindow.add("panel", undefined, t("mode_title"));
modePanel.orientation = "column";
modePanel.alignChildren = ["fill", "top"];
modePanel.margins = 12;
var modeOptionsRow = modePanel.add("group");
modeOptionsRow.orientation = "column";
modeOptionsRow.alignment = "fill";
modeOptionsRow.alignChildren = ["fill", "center"];
modeOptionsRow.spacing = 8;

var radioSelection = modeOptionsRow.add("radiobutton", undefined, t("selection_mode"));
var radioPages = modeOptionsRow.add("radiobutton", undefined, t("pages_mode"));
var radioBDA = modeOptionsRow.add("radiobutton", undefined, t("auto_mode"));
radioSelection.alignment = ["fill", "center"];
radioPages.alignment = ["fill", "center"];
radioBDA.alignment = ["fill", "center"];

var contentPanel = myWindow.add("panel", undefined, "");
contentPanel.orientation = "column";
contentPanel.alignChildren = ["fill", "top"];
contentPanel.margins = 15;
contentPanel.spacing = 10;
contentPanel.minimumSize = [640, 160];

var selectionModeGroup = contentPanel.add("group");
selectionModeGroup.orientation = "column";
selectionModeGroup.alignChildren = ["fill", "top"];
selectionModeGroup.alignment = "fill";
var selectionHintText = selectionModeGroup.add("statictext", undefined, t("selection_hint"), { multiline: true });
selectionHintText.preferredSize.width = 500;
var selectionStateText = selectionModeGroup.add("statictext", undefined, "", { multiline: true });
selectionStateText.preferredSize.width = 500;

var pagesModeGroup = contentPanel.add("group");
pagesModeGroup.orientation = "column";
pagesModeGroup.alignChildren = ["fill", "top"];
pagesModeGroup.alignment = "fill";
var pagesRow = pagesModeGroup.add("group");
pagesRow.alignment = "fill";
pagesRow.alignChildren = ["left", "center"];
var pagesLabelText = pagesRow.add("statictext", undefined, t("pages_label"));
var editPages = pagesRow.add("edittext", undefined, "");
editPages.characters = 14;
editPages.helpTip = t("pages_help");
var pagesHint = pagesModeGroup.add("statictext", undefined, t("pages_help"));
pagesHint.preferredSize.width = 500;
var pagesStateText = pagesModeGroup.add("statictext", undefined, "", { multiline: true });
pagesStateText.preferredSize.width = 500;

var manualTargetGroup = contentPanel.add("group");
manualTargetGroup.orientation = "column";
manualTargetGroup.alignChildren = ["fill", "top"];
manualTargetGroup.alignment = "fill";
var targetLanguageLabel = manualTargetGroup.add("statictext", undefined, t("target_language_short"));
var langList = buildManualLanguageList();
var manualLanguageSelectRow = manualTargetGroup.add("group");
manualLanguageSelectRow.orientation = "row";
manualLanguageSelectRow.alignChildren = ["fill", "center"];
manualLanguageSelectRow.alignment = "fill";
manualLanguageSelectRow.spacing = 8;
var dropdownLang = manualLanguageSelectRow.add("dropdownlist", undefined, langList);
dropdownLang.alignment = ["fill", "center"];
dropdownLang.selection = 1;
var btnManualMoreLanguages = manualLanguageSelectRow.add("button", undefined, t("legacy_more_languages"));
btnManualMoreLanguages.alignment = ["right", "center"];
btnManualMoreLanguages.preferredSize.width = 210;
var languageStateText = manualTargetGroup.add("statictext", undefined, "", { multiline: true });
languageStateText.preferredSize.width = 500;

var autoModeGroup = contentPanel.add("group");
autoModeGroup.orientation = "column";
autoModeGroup.alignChildren = ["fill", "top"];
autoModeGroup.alignment = "fill";
var autoSourceHelpText = autoModeGroup.add("statictext", undefined, t("auto_source_help"), { multiline: true });
autoSourceHelpText.preferredSize.width = 500;
var grpBDASource = autoModeGroup.add("group");
grpBDASource.alignment = "fill";
grpBDASource.alignChildren = ["left", "center"];
var originalPagesLabel = grpBDASource.add("statictext", undefined, t("original_pages"));
var bdaSourceInput = grpBDASource.add("edittext", undefined, "AUTO");
bdaSourceInput.characters = 10;
bdaSourceInput.helpTip = t("auto_source_help");
var bdaSourceStateText = autoModeGroup.add("statictext", undefined, "", { multiline: true });
bdaSourceStateText.preferredSize.width = 500;
var checkTOC = autoModeGroup.add("checkbox", undefined, t("toc_checkbox"));
checkTOC.value = true;
var checkAutoBDAHyperlinks = autoModeGroup.add("checkbox", undefined, t("auto_hyperlink_checkbox"));
checkAutoBDAHyperlinks.value = autoBDAHyperlinksSetting;
checkAutoBDAHyperlinks.helpTip = t("auto_hyperlink_help");
var cbOnlyTextUpdate = autoModeGroup.add("checkbox", undefined, t("only_text_update"));
cbOnlyTextUpdate.value = false;
cbOnlyTextUpdate.enabled = false;

function updateBDAHyperlinkControls(enabled) {
    checkAutoBDAHyperlinks.enabled = !!enabled;
}

var groupButtons = myWindow.add("group");
groupButtons.alignment = "fill";
groupButtons.alignChildren = ["left", "center"];
groupButtons.spacing = 8;
var btnTranslate = groupButtons.add("button", undefined, t("translate_start"));
btnTranslate.preferredSize = [180, 32];
var btnPrintPDF = groupButtons.add("button", undefined, t("export_pdf_print_btn"));
btnPrintPDF.preferredSize = [120, 32];
var btnWebPDF = groupButtons.add("button", undefined, t("export_pdf_web_btn"));
btnWebPDF.preferredSize = [120, 32];
var buttonSpacer = groupButtons.add("statictext", undefined, "");
buttonSpacer.alignment = "fill";
var rightButtonGroup = groupButtons.add("group");
rightButtonGroup.alignment = ["right", "center"];
rightButtonGroup.alignChildren = ["left", "center"];
rightButtonGroup.spacing = 8;
var btnLinkReferences = rightButtonGroup.add("button", undefined, t("hyperlink_settings_button"));
btnLinkReferences.helpTip = t("hyperlink_settings_help");
btnLinkReferences.preferredSize = [130, 28];
var btnSpellCheck = rightButtonGroup.add("button", undefined, t("spellcheck_button"));
btnSpellCheck.helpTip = t("spellcheck_help");
btnSpellCheck.preferredSize = [130, 28];
var btnCancel = rightButtonGroup.add("button", undefined, t("close_button"));
btnCancel.preferredSize = [120, 28];

function setMainGroupVisible(group, isVisible) {
    group.visible = !!isVisible;
    if (isVisible) {
        group.maximumSize = [10000, 10000];
        group.minimumSize = [0, 0];
        group.preferredSize = [-1, -1];
    } else {
        group.maximumSize = [0, 0];
        group.minimumSize = [0, 0];
        group.preferredSize = [0, 0];
    }
}

function getStatusPathLabel(pathValue) {
    var normalized = String(pathValue || "").replace(/^\s+|\s+$/g, "");
    if (normalized === "") return t("status_not_set");
    try {
        var fileObj = new File(normalized);
        if (fileObj && fileObj.name) return fileObj.name;
    } catch (e) {}
    return normalized.replace(/^.*[\/\\]/, "");
}

function getProviderStatusSummaryText() {
    var providerId = getActiveTranslationProvider();
    var display = getTranslationProviderDisplayName(providerId);
    var validationMessage = getProviderValidationMessage(providerId);
    return validationMessage === "" ? display : (display + " (" + t("status_settings_required") + ")");
}

function refreshManualLanguageDropdownUI() {
    if (!dropdownLang) return;
    var selectedCode = extractLanguageCodeFromOption(dropdownLang.selection ? dropdownLang.selection.text : "");
    var languageItems = buildManualLanguageListForMode(manualLanguageDropdownExpanded);
    dropdownLang.removeAll();
    for (var i = 0; i < languageItems.length; i++) dropdownLang.add("item", languageItems[i]);

    var selectedIndex = -1;
    if (selectedCode !== "") {
        for (var itemIndex = 0; itemIndex < dropdownLang.items.length; itemIndex++) {
            if (extractLanguageCodeFromOption(dropdownLang.items[itemIndex].text) === selectedCode) {
                selectedIndex = itemIndex;
                break;
            }
        }
    }
    if (selectedIndex < 0) selectedIndex = 1;
    if (selectedIndex >= 0 && selectedIndex < dropdownLang.items.length) dropdownLang.selection = selectedIndex;
    normalizeLanguageDropdownSelection();
}

function refreshManualLanguageExpandButtonUI() {
    if (!btnManualMoreLanguages) return;
    btnManualMoreLanguages.text = manualLanguageDropdownExpanded ? t("manual_all_languages_active") : t("legacy_more_languages");
    btnManualMoreLanguages.enabled = !manualLanguageDropdownExpanded;
}

function refreshMainWindowUIText() {
    if (!myWindow) return;
    mainTitle.text = t("main_title");
    btnSettings.text = t("settings_button");
    btnSettings.helpTip = t("settings_help");
    statusPanel.text = t("status_title");
    validationPanel.text = t("validation_title");
    modePanel.text = t("mode_title");
    radioSelection.text = t("selection_mode");
    radioPages.text = t("pages_mode");
    radioBDA.text = t("auto_mode");
    selectionHintText.text = t("selection_hint");
    pagesLabelText.text = t("pages_label");
    editPages.helpTip = t("pages_help");
    pagesHint.text = t("pages_help");
    targetLanguageLabel.text = t("target_language_short");
    refreshManualLanguageDropdownUI();
    refreshManualLanguageExpandButtonUI();
    autoSourceHelpText.text = t("auto_source_help");
    originalPagesLabel.text = t("original_pages");
    bdaSourceInput.helpTip = t("auto_source_help");
    checkTOC.text = t("toc_checkbox");
    checkAutoBDAHyperlinks.text = t("auto_hyperlink_checkbox");
    checkAutoBDAHyperlinks.helpTip = t("auto_hyperlink_help");
    cbOnlyTextUpdate.text = t("only_text_update");
    btnTranslate.text = t("translate_start");
    btnLinkReferences.text = t("hyperlink_settings_button");
    btnLinkReferences.helpTip = t("hyperlink_settings_help");
    btnSpellCheck.text = t("spellcheck_button");
    btnSpellCheck.helpTip = t("spellcheck_help");
    btnCancel.text = t("close_button");
    setActiveMainMode(radioBDA.value ? "BDA" : (radioPages.value ? "PAGES" : "SELECTION"));
    refreshMainStatusUI();
    refreshMainValidationUI();
    try { myWindow.layout.layout(true); } catch (layoutErr) {}
}

function getActiveDocumentSafe() {
    try {
        return app.activeDocument;
    } catch (e) {
        return null;
    }
}

function hasDocumentSelectionSafe() {
    try {
        return !!(app.selection && app.selection.length > 0);
    } catch (e) {
        return false;
    }
}

function getDocumentSelectionCountSafe() {
    try {
        return app.selection ? app.selection.length : 0;
    } catch (e) {
        return 0;
    }
}

function getSelectedLanguageCodeSafe() {
    normalizeLanguageDropdownSelection();
    return extractLanguageCodeFromOption(dropdownLang && dropdownLang.selection ? dropdownLang.selection.text : "");
}

function getMainWindowSelectionSignature() {
    var parts = [];
    try {
        var selectionItems = app.selection || [];
        parts.push(String(selectionItems.length));
        for (var i = 0; i < selectionItems.length && i < 6; i++) {
            var item = selectionItems[i];
            var itemSig = "";
            try { itemSig = (item && item.isValid && item.id !== undefined) ? String(item.id) : ""; } catch (e) { itemSig = ""; }
            if (itemSig === "") {
                try { itemSig = item && item.constructor ? String(item.constructor.name) : "item"; } catch (e2) { itemSig = "item"; }
            }
            parts.push(itemSig);
        }
    } catch (e3) {
        parts.push("selection-error");
    }
    return parts.join(",");
}

function getMainWindowLiveSignature() {
    var docSig = "no-doc";
    try {
        var doc = app.activeDocument;
        if (doc && doc.isValid) {
            try { docSig = "doc:" + String(doc.id); } catch (e) { docSig = "doc:" + String(doc.name || "active"); }
        }
    } catch (e2) {}
    return [
        docSig,
        getMainWindowSelectionSignature(),
        radioSelection && radioSelection.value ? "mode:selection" : (radioPages && radioPages.value ? "mode:pages" : "mode:bda")
    ].join("|");
}

function refreshMainWindowLiveState(forceRefresh) {
    if (!myWindow || !myWindow.visible) return;
    var liveSignature = getMainWindowLiveSignature();
    if (!forceRefresh && liveSignature === mainWindowLiveSignature) return;
    mainWindowLiveSignature = liveSignature;
    refreshMainStatusUI();
    refreshMainValidationUI();
}

function handleMainWindowIdle() {
    try {
        refreshMainWindowLiveState(false);
    } catch (e) {}
}

function stopMainWindowLiveRefresh() {
    try {
        if (mainWindowIdleTask && mainWindowIdleTask.isValid) {
            try { mainWindowIdleTask.removeEventListener("onIdle", handleMainWindowIdle); } catch (listenerErr) {}
            try { mainWindowIdleTask.remove(); } catch (removeErr) {}
        }
    } catch (e) {}
    mainWindowIdleTask = null;
    mainWindowLiveSignature = "";
}

function ensureMainWindowLiveRefresh() {
    try {
        if (mainWindowIdleTask && mainWindowIdleTask.isValid) return;
    } catch (e) {
        mainWindowIdleTask = null;
    }
    try {
        var idleTasks = app.idleTasks;
        for (var i = idleTasks.length - 1; i >= 0; i--) {
            var idleTask = idleTasks[i];
            if (!idleTask || !idleTask.isValid) continue;
            if (String(idleTask.name || "") !== "SuperTranslatorPRO_MainWindowLiveRefresh") continue;
            try { idleTask.remove(); } catch (cleanupErr) {}
        }
    } catch (e2) {}
    try {
        mainWindowIdleTask = app.idleTasks.add({ name: "SuperTranslatorPRO_MainWindowLiveRefresh", sleep: 125 });
        mainWindowIdleTask.addEventListener("onIdle", handleMainWindowIdle);
    } catch (e3) {
        mainWindowIdleTask = null;
    }
}

function refreshMainStatusUI() {
    var autoLinksEnabled = checkAutoBDAHyperlinks ? !!checkAutoBDAHyperlinks.value : !!autoBDAHyperlinksSetting;
    statusSummaryText.text =
        t("status_provider") + " " + getProviderStatusSummaryText() + "   |   " + t("status_glossary") + " " + getStatusPathLabel(csvPath) + "\n" +
        t("status_memory") + " " + getStatusPathLabel(tmPath) + "\n" +
        t("status_links") + " " + (autoLinksEnabled ? t("status_on") : t("status_off")) + "   |   " + t("status_symbols") + " " + normalizeRefSymbols(refSymbolsSetting);
    try { myWindow.layout.layout(true); } catch (layoutErr) {}
}

function getBoundsCoordinate(boundsObj, propertyName, fallbackIndex, fallbackValue) {
    if (!boundsObj) return fallbackValue;
    try {
        if (typeof boundsObj[propertyName] !== "undefined") return boundsObj[propertyName];
    } catch (e) {}
    try {
        if (typeof boundsObj[fallbackIndex] !== "undefined") return boundsObj[fallbackIndex];
    } catch (e2) {}
    return fallbackValue;
}

function positionDialogRightOfMainWindow(dialog, dialogWidth, dialogHeight) {
    if (!dialog || !myWindow) return;
    try {
        var anchorBounds = myWindow.bounds;
        var left = getBoundsCoordinate(anchorBounds, "right", 2, 0) + 12;
        var top = getBoundsCoordinate(anchorBounds, "top", 1, 0);

        try {
            if ($.screens && $.screens.length > 0) {
                var screenBounds = $.screens[0].visibleBounds || $.screens[0].bounds;
                var screenLeft = getBoundsCoordinate(screenBounds, "left", 0, 0);
                var screenTop = getBoundsCoordinate(screenBounds, "top", 1, 0);
                var screenRight = getBoundsCoordinate(screenBounds, "right", 2, left + dialogWidth);
                var screenBottom = getBoundsCoordinate(screenBounds, "bottom", 3, top + dialogHeight);
                if (left + dialogWidth > screenRight) {
                    left = Math.max(screenLeft + 20, getBoundsCoordinate(anchorBounds, "left", 0, 0) - dialogWidth - 12);
                }
                if (top + dialogHeight > screenBottom) {
                    top = Math.max(screenTop + 20, screenBottom - dialogHeight - 20);
                }
            }
        } catch (screenErr) {}

        dialog.location = [left, top];
    } catch (e3) {}
}

function positionDialogCenteredOnMainWindow(dialog, dialogWidth, dialogHeight) {
    if (!dialog || !myWindow) return;
    try {
        var anchorBounds = myWindow.bounds;
        var anchorLeft = getBoundsCoordinate(anchorBounds, "left", 0, 0);
        var anchorTop = getBoundsCoordinate(anchorBounds, "top", 1, 0);
        var anchorRight = getBoundsCoordinate(anchorBounds, "right", 2, anchorLeft + dialogWidth);
        var anchorBottom = getBoundsCoordinate(anchorBounds, "bottom", 3, anchorTop + dialogHeight);

        var anchorWidth = anchorRight - anchorLeft;
        var anchorHeight = anchorBottom - anchorTop;
        var left = anchorLeft + Math.round((anchorWidth - dialogWidth) / 2);
        var top = anchorTop + Math.round((anchorHeight - dialogHeight) / 2);

        try {
            if ($.screens && $.screens.length > 0) {
                var screenBounds = $.screens[0].visibleBounds || $.screens[0].bounds;
                var screenLeft = getBoundsCoordinate(screenBounds, "left", 0, 0);
                var screenTop = getBoundsCoordinate(screenBounds, "top", 1, 0);
                var screenRight = getBoundsCoordinate(screenBounds, "right", 2, left + dialogWidth);
                var screenBottom = getBoundsCoordinate(screenBounds, "bottom", 3, top + dialogHeight);
                if (left < screenLeft + 20) left = screenLeft + 20;
                if (top < screenTop + 20) top = screenTop + 20;
                if (left + dialogWidth > screenRight) left = Math.max(screenLeft + 20, screenRight - dialogWidth - 20);
                if (top + dialogHeight > screenBottom) top = Math.max(screenTop + 20, screenBottom - dialogHeight - 20);
            }
        } catch (screenErr) {}

        dialog.location = [left, top];
    } catch (e4) {}
}

function refreshMainInlineHints() {
    var doc = getActiveDocumentSafe();
    var hasDoc = !!(doc && doc.isValid);
    var selectedLangText = dropdownLang && dropdownLang.selection ? dropdownLang.selection.text : "";
    var selectedLangCode = getSelectedLanguageCodeSafe();
    var selectionCount = getDocumentSelectionCountSafe();
    var trimmedPages = String(editPages.text || "").replace(/^\s+|\s+$/g, "");
    var trimmedBDAPages = String(bdaSourceInput.text || "").replace(/^\s+|\s+$/g, "");

    selectionStateText.text = "";
    pagesStateText.text = "";
    languageStateText.text = "";
    bdaSourceStateText.text = "";

    if (!hasDoc) {
        selectionStateText.text = t("no_document_open");
        pagesStateText.text = t("no_document_open");
        languageStateText.text = t("no_document_open");
        bdaSourceStateText.text = t("no_document_open");
        return;
    }

    if (radioSelection.value) {
        selectionStateText.text = selectionCount > 0 ? t("selection_state_ready") : t("validation_select_something");
    }

    if (radioPages.value) {
        pagesStateText.text = trimmedPages !== "" ? t("pages_state_ready", { pages: trimmedPages }) : t("validation_enter_pages");
    }

    if (!radioBDA.value) {
        languageStateText.text = (!selectedLangText || isLanguageSeparatorText(selectedLangText) || selectedLangCode === "")
            ? t("validation_invalid_lang")
            : t("language_state_ready", { lang: selectedLangCode });
    }

    if (radioBDA.value) {
        bdaSourceStateText.text = trimmedBDAPages !== "" ? t("bda_state_ready", { pages: trimmedBDAPages }) : t("validation_enter_pages_or_auto");
    }
}

function getMainValidationIssues() {
    var issues = [];
    normalizeLanguageDropdownSelection();

    var doc = getActiveDocumentSafe();
    if (!doc || !doc.isValid) {
        issues.push(t("no_document_open"));
    } else {
        if (radioSelection.value && !hasDocumentSelectionSafe()) issues.push(t("validation_select_something"));
        if (radioPages.value && String(editPages.text || "").replace(/\s/g, "") === "") issues.push(t("validation_enter_pages"));
        if (radioBDA.value && String(bdaSourceInput.text || "").replace(/\s/g, "") === "") issues.push(t("validation_enter_pages_or_auto"));
    }

    if (!radioBDA.value) {
        var selectedLangText = dropdownLang.selection ? dropdownLang.selection.text : "";
        if (!dropdownLang.selection || isLanguageSeparatorText(selectedLangText) || getSelectedLanguageCodeSafe() === "") {
            issues.push(t("validation_invalid_lang"));
        }
    }

    var providerValidationMessage = getProviderValidationMessage(getActiveTranslationProvider());
    if (providerValidationMessage !== "") issues.push(providerValidationMessage || t("validation_enter_api_key"));

    return issues;
}

function refreshMainValidationUI() {
    var issues = getMainValidationIssues();
    var doc = getActiveDocumentSafe();
    var hasDoc = !!(doc && doc.isValid);

    btnSpellCheck.enabled = hasDoc;
    btnLinkReferences.enabled = hasDoc;
    btnTranslate.enabled = (issues.length === 0);

    if (issues.length === 0) {
        validationText.text = t("validation_ready");
    } else {
        validationText.text = t("validation_needs_attention") + "\n- " + issues.join("\n- ");
    }

    refreshMainInlineHints();
    try { myWindow.layout.layout(true); } catch (layoutErr) {}
}

function isLanguageSeparatorText(itemText) {
    return String(itemText || "").indexOf("---") === 0;
}

function normalizeLanguageDropdownSelection() {
    if (!dropdownLang || !dropdownLang.selection) return;
    if (!isLanguageSeparatorText(dropdownLang.selection.text)) return;

    var candidateIndex = dropdownLang.selection.index + 1;
    while (candidateIndex < dropdownLang.items.length && isLanguageSeparatorText(dropdownLang.items[candidateIndex].text)) candidateIndex++;

    if (candidateIndex >= dropdownLang.items.length) {
        candidateIndex = dropdownLang.selection.index - 1;
        while (candidateIndex >= 0 && isLanguageSeparatorText(dropdownLang.items[candidateIndex].text)) candidateIndex--;
    }

    if (candidateIndex >= 0 && candidateIndex < dropdownLang.items.length) dropdownLang.selection = candidateIndex;
}

function setActiveMainMode(mode) {
    var normalizedMode = (mode === "BDA" || mode === "PAGES") ? mode : "SELECTION";
    radioSelection.value = (normalizedMode === "SELECTION");
    radioPages.value = (normalizedMode === "PAGES");
    radioBDA.value = (normalizedMode === "BDA");

    setMainGroupVisible(selectionModeGroup, normalizedMode === "SELECTION");
    setMainGroupVisible(pagesModeGroup, normalizedMode === "PAGES");
    setMainGroupVisible(manualTargetGroup, normalizedMode !== "BDA");
    setMainGroupVisible(autoModeGroup, normalizedMode === "BDA");

    dropdownLang.enabled = normalizedMode !== "BDA";
    bdaSourceInput.enabled = normalizedMode === "BDA";
    checkTOC.enabled = normalizedMode === "BDA";
    cbOnlyTextUpdate.enabled = normalizedMode === "BDA";
    if (normalizedMode !== "BDA") cbOnlyTextUpdate.value = false;
    updateBDAHyperlinkControls(normalizedMode === "BDA");

    if (normalizedMode === "SELECTION") contentPanel.text = t("selection_settings");
    else if (normalizedMode === "PAGES") contentPanel.text = t("pages_settings");
    else contentPanel.text = t("auto_settings");

    try { myWindow.layout.layout(true); } catch (layoutErr) {}
    refreshMainValidationUI();
}

radioSelection.onClick = function() {
    setActiveMainMode("SELECTION");
};

radioPages.onClick = function() {
    setActiveMainMode("PAGES");
};

radioBDA.onClick = function() {
    setActiveMainMode("BDA");
};

dropdownLang.onChange = function() {
    normalizeLanguageDropdownSelection();
    refreshMainValidationUI();
};

btnManualMoreLanguages.onClick = function() {
    if (manualLanguageDropdownExpanded) return;
    manualLanguageDropdownExpanded = true;
    refreshManualLanguageDropdownUI();
    refreshManualLanguageExpandButtonUI();
    refreshMainValidationUI();
};

editPages.onActivate = function() {
    setActiveMainMode("PAGES");
};
editPages.onChanging = refreshMainValidationUI;

bdaSourceInput.onActivate = function() {
    setActiveMainMode("BDA");
};
bdaSourceInput.onChanging = refreshMainValidationUI;

checkAutoBDAHyperlinks.onClick = function() {
    updateBDAHyperlinkControls(radioBDA.value);
    refreshMainStatusUI();
    refreshMainValidationUI();
};

setActiveMainMode("SELECTION");
normalizeLanguageDropdownSelection();
refreshMainStatusUI();
refreshMainValidationUI();

myWindow.onResizing = myWindow.onResize = function() {
    this.layout.resize();
};
myWindow.onShow = myWindow.onActivate = function() {
    ensureMainWindowLiveRefresh();
    refreshMainWindowLiveState(true);
};
myWindow.onClose = function() {
    stopMainWindowLiveRefresh();
    return true;
};

btnSpellCheck.onClick = function() {
    var doc = null;
    try { doc = app.activeDocument; } catch (e) { alert(t("no_document_open")); return; }
    try {
        runMasterSpellingCheck(doc);
    } catch (e) {
        alert(t("spellcheck_error", { message: e.message }));
    }
};

function showHyperlinkDialog(doc) {
    var dlg = new Window("dialog", t("hyperlink_dialog_title"), undefined, { resizeable: true });
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.spacing = 10;
    dlg.minimumSize = [540, 500];
    dlg.preferredSize = [580, 520];

    var introText = dlg.add("statictext", undefined, t("hyperlink_dialog_hint"), { multiline: true });
    introText.preferredSize.width = 520;

    dlg.add("statictext", undefined, t("reference_symbols"));
    var refSymbolsInput = dlg.add("edittext", undefined, refSymbolsSetting);
    refSymbolsInput.alignment = "fill";
    refSymbolsInput.characters = 20;

    var coverMappings = collectCoverHyperlinkPageMappings(doc);
    var hyperlinkMappingsDraft = normalizeHyperlinkPageMappings(hyperlinkPageMappings);

    var detectedPanel = dlg.add("panel", undefined, t("hyperlink_detected_title"));
    detectedPanel.orientation = "column";
    detectedPanel.alignChildren = ["fill", "top"];
    detectedPanel.margins = 12;
    var detectedView = detectedPanel.add("edittext", undefined, hasOwnMappings(coverMappings) ? formatHyperlinkPageMappings(coverMappings) : t("hyperlink_detected_none"), { multiline: true, readonly: true, scrolling: true });
    detectedView.preferredSize = [520, 90];

    var hyperlinkPanel = dlg.add("panel", undefined, t("hyperlink_group_title"));
    hyperlinkPanel.orientation = "column";
    hyperlinkPanel.alignChildren = ["fill", "top"];
    hyperlinkPanel.margins = 12;
    hyperlinkPanel.spacing = 8;

    var hyperlinkLangGroup = hyperlinkPanel.add("group");
    hyperlinkLangGroup.alignment = "fill";
    hyperlinkLangGroup.alignChildren = ["left", "center"];
    hyperlinkLangGroup.add("statictext", undefined, t("hyperlink_language"));
    var hyperlinkLangDropdown = hyperlinkLangGroup.add("dropdownlist", undefined, buildHyperlinkLanguageList());
    hyperlinkLangDropdown.selection = 0;
    hyperlinkLangDropdown.preferredSize.width = 180;

    var hyperlinkPageGroup = hyperlinkPanel.add("group");
    hyperlinkPageGroup.alignment = "fill";
    hyperlinkPageGroup.alignChildren = ["left", "center"];
    hyperlinkPageGroup.add("statictext", undefined, t("hyperlink_target_page"));
    var hyperlinkPageInput = hyperlinkPageGroup.add("edittext", undefined, "");
    hyperlinkPageInput.preferredSize.width = 120;
    hyperlinkPageInput.characters = 10;

    var hyperlinkButtonGroup = hyperlinkPanel.add("group");
    hyperlinkButtonGroup.alignment = "fill";
    hyperlinkButtonGroup.spacing = 8;
    var btnSaveHyperlinkMapping = hyperlinkButtonGroup.add("button", undefined, t("hyperlink_save_mapping"));
    btnSaveHyperlinkMapping.preferredSize = [150, 28];
    var btnRemoveHyperlinkMapping = hyperlinkButtonGroup.add("button", undefined, t("hyperlink_remove_mapping"));
    btnRemoveHyperlinkMapping.preferredSize = [150, 28];
    var btnReloadFromCover = hyperlinkButtonGroup.add("button", undefined, t("hyperlink_reload_from_cover"));
    btnReloadFromCover.preferredSize = [170, 28];

    hyperlinkPanel.add("statictext", undefined, t("hyperlink_saved_mappings"));
    var hyperlinkMappingsView = hyperlinkPanel.add("listbox", undefined, [], { multiselect: false });
    hyperlinkMappingsView.preferredSize = [520, 150];
    var hyperlinkMappingsMeta = [];

    function getEffectiveHyperlinkMappings() {
        return mergeHyperlinkPageMappings(coverMappings, hyperlinkMappingsDraft);
    }

    function buildHyperlinkMappingsMeta() {
        var effectiveMappings = getEffectiveHyperlinkMappings();
        var entries = getHyperlinkLanguageEntries();
        var meta = [];
        var seen = {};
        for (var i = 0; i < entries.length; i++) {
            var code = entries[i].code;
            if (!effectiveMappings.hasOwnProperty(code)) continue;
            var sourceLabel = coverMappings.hasOwnProperty(code)
                ? (hyperlinkMappingsDraft.hasOwnProperty(code) ? t("hyperlink_source_override") : t("hyperlink_source_cover"))
                : t("hyperlink_source_manual");
            meta.push({ code: code, page: effectiveMappings[code], source: sourceLabel });
            seen[code] = true;
        }
        for (var key in effectiveMappings) {
            if (!effectiveMappings.hasOwnProperty(key) || seen[key]) continue;
            meta.push({ code: key, page: effectiveMappings[key], source: hyperlinkMappingsDraft.hasOwnProperty(key) ? t("hyperlink_source_manual") : t("hyperlink_source_cover") });
        }
        return meta;
    }

    function applyHyperlinkDraftValue(selectedCode, pageValue) {
        if (!selectedCode) return;
        var normalizedPageValue = String(pageValue || "").replace(/^\s+|\s+$/g, "");
        if (normalizedPageValue === "") {
            if (hyperlinkMappingsDraft.hasOwnProperty(selectedCode)) delete hyperlinkMappingsDraft[selectedCode];
            return;
        }
        if (coverMappings.hasOwnProperty(selectedCode) && coverMappings[selectedCode] === normalizedPageValue) {
            if (hyperlinkMappingsDraft.hasOwnProperty(selectedCode)) delete hyperlinkMappingsDraft[selectedCode];
            return;
        }
        hyperlinkMappingsDraft[selectedCode] = normalizedPageValue;
    }

    var refreshHyperlinkMappingsView = function() {
        hyperlinkMappingsMeta = buildHyperlinkMappingsMeta();
        hyperlinkMappingsView.removeAll();
        for (var i = 0; i < hyperlinkMappingsMeta.length; i++) {
            hyperlinkMappingsView.add("item", hyperlinkMappingsMeta[i].code + " -> " + hyperlinkMappingsMeta[i].page + " [" + hyperlinkMappingsMeta[i].source + "]");
        }
    };

    var syncHyperlinkMappingInputs = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        if (hyperlinkMappingsView.selection && hyperlinkMappingsMeta[hyperlinkMappingsView.selection.index]) {
            selectedCode = hyperlinkMappingsMeta[hyperlinkMappingsView.selection.index].code;
            for (var i = 0; i < hyperlinkLangDropdown.items.length; i++) {
                if (extractLanguageCodeFromOption(hyperlinkLangDropdown.items[i].text) === selectedCode) {
                    hyperlinkLangDropdown.selection = i;
                    break;
                }
            }
        }
        var effectiveMappings = getEffectiveHyperlinkMappings();
        hyperlinkPageInput.text = (selectedCode && effectiveMappings.hasOwnProperty(selectedCode)) ? effectiveMappings[selectedCode] : "";
    };

    hyperlinkLangDropdown.onChange = function() {
        hyperlinkMappingsView.selection = null;
        syncHyperlinkMappingInputs();
    };
    hyperlinkMappingsView.onChange = syncHyperlinkMappingInputs;

    btnSaveHyperlinkMapping.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        var pageValue = String(hyperlinkPageInput.text || "").replace(/^\s+|\s+$/g, "");
        if (!selectedCode) return;
        if (pageValue === "") {
            alert(t("hyperlink_page_required", { language: selectedCode }));
            return;
        }
        applyHyperlinkDraftValue(selectedCode, pageValue);
        refreshHyperlinkMappingsView();
        syncHyperlinkMappingInputs();
    };

    btnRemoveHyperlinkMapping.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        if (!selectedCode) return;
        if (hyperlinkMappingsDraft.hasOwnProperty(selectedCode)) delete hyperlinkMappingsDraft[selectedCode];
        hyperlinkMappingsView.selection = null;
        syncHyperlinkMappingInputs();
        refreshHyperlinkMappingsView();
    };

    btnReloadFromCover.onClick = function() {
        coverMappings = collectCoverHyperlinkPageMappings(doc);
        detectedView.text = hasOwnMappings(coverMappings) ? formatHyperlinkPageMappings(coverMappings) : t("hyperlink_detected_none");
        hyperlinkMappingsView.selection = null;
        refreshHyperlinkMappingsView();
        syncHyperlinkMappingInputs();
    };

    refreshHyperlinkMappingsView();
    syncHyperlinkMappingInputs();

    var buttonRow = dlg.add("group");
    buttonRow.alignment = "fill";
    buttonRow.spacing = 10;
    var buttonSpacer = buttonRow.add("statictext", undefined, "");
    buttonSpacer.alignment = "fill";
    var btnRun = buttonRow.add("button", undefined, t("hyperlink_execute"), { name: "ok" });
    btnRun.preferredSize = [150, 30];
    var btnClose = buttonRow.add("button", undefined, t("cancel"), { name: "cancel" });
    btnClose.preferredSize = [120, 28];

    btnRun.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        var pageValue = String(hyperlinkPageInput.text || "").replace(/^\s+|\s+$/g, "");
        applyHyperlinkDraftValue(selectedCode, pageValue);
        saveHyperlinkSettings(refSymbolsInput.text, hyperlinkMappingsDraft);
        dlg.close(1);
    };

    btnClose.onClick = function() { dlg.close(0); };
    dlg.onResizing = dlg.onResize = function() {
        this.layout.resize();
    };
    if (dlg.show() !== 1) return null;
    return {
        symbols: refSymbolsSetting,
        pageMappings: normalizeHyperlinkPageMappings(hyperlinkMappingsDraft)
    };
}

btnLinkReferences.onClick = function() {
    var doc = null;
    try { doc = app.activeDocument; } catch (e) { alert(t("no_document_open")); return; }
    var hyperlinkConfig = showHyperlinkDialog(doc);
    if (!hyperlinkConfig) return;
    refreshMainStatusUI();
    refreshMainValidationUI();
    try {
        app.doScript(
            function() {
                var result = linkPackageReferences(doc, hyperlinkConfig.symbols, hyperlinkConfig.pageMappings);
                alert(t("link_summary", {
                    symbols: result.symbols,
                    mappingSummary: result.mappingSummary,
                    links: result.links,
                    urlLinks: result.urlLinks,
                    skipped: result.skipped
                }));
            },
            ScriptLanguage.JAVASCRIPT,
            undefined,
            UndoModes.ENTIRE_SCRIPT,
            t("hyperlink_settings_button")
        );
    } catch (e2) {
        alert(t("link_error", { message: e2.message || e2 }));
    }
};

// --- EINSTELLUNGEN FENSTER ---
btnSettings.onClick = function() {
    var setWin = new Window("dialog", t("settings_title"), undefined, { resizeable: true });
    setWin.orientation = "column";
    setWin.alignChildren = ["fill", "top"];
    setWin.spacing = 10;
    setWin.minimumSize = [760, 360];
    setWin.preferredSize = [760, 500];
    
    var topGrp = setWin.add("group");
    topGrp.alignment = "fill";
    topGrp.alignChildren = ["right", "center"];
    topGrp.spacing = 8;
    var btnLog = topGrp.add("button", undefined, t("log_file"));
    btnLog.preferredSize = [110, 28];
    var btnDebugLog = topGrp.add("button", undefined, t("debug_log_file"));
    btnDebugLog.preferredSize = [110, 28];
    var btnInfo = topGrp.add("button", undefined, t("info"));
    btnInfo.preferredSize = [90, 28];

    var overviewPanel = setWin.add("panel", undefined, t("settings_overview_title"));
    overviewPanel.orientation = "column";
    overviewPanel.alignChildren = ["fill", "top"];
    overviewPanel.margins = 12;
    var settingsOverviewText = overviewPanel.add("statictext", undefined, "", { multiline: true });
    settingsOverviewText.preferredSize = [700, 58];

    var tabs = setWin.add("tabbedpanel");
    tabs.alignment = ["fill", "fill"];
    tabs.alignChildren = ["fill", "fill"];
    tabs.minimumSize = [700, 360];
    tabs.preferredSize = [700, 380];

    var dataTab = tabs.add("tab", undefined, t("settings_tab_data"));
    dataTab.orientation = "column";
    dataTab.alignChildren = ["fill", "top"];

    var autoTab = tabs.add("tab", undefined, t("settings_tab_auto"));
    autoTab.orientation = "column";
    autoTab.alignChildren = ["fill", "top"];

    var exportTab = tabs.add("tab", undefined, t("settings_tab_export"));
    exportTab.orientation = "column";
    exportTab.alignChildren = ["fill", "top"];

    var providerTab = tabs.add("tab", undefined, t("settings_tab_provider"));
    providerTab.orientation = "column";
    providerTab.alignChildren = ["fill", "top"];

    var typographyTab = tabs.add("tab", undefined, t("settings_tab_typography"));
    typographyTab.orientation = "column";
    typographyTab.alignChildren = ["fill", "top"];

    var typographyScrollWrap = typographyTab.add("group");
    typographyScrollWrap.orientation = "row";
    typographyScrollWrap.alignment = ["fill", "fill"];
    typographyScrollWrap.alignChildren = ["fill", "fill"];
    typographyScrollWrap.spacing = 8;
    typographyScrollWrap.minimumSize = [0, 240];
    typographyScrollWrap.preferredSize = [680, 300];
    typographyScrollWrap.maximumSize = [10000, 300];

    var typographyViewport = typographyScrollWrap.add("group");
    typographyViewport.orientation = "stack";
    typographyViewport.alignment = ["fill", "fill"];
    typographyViewport.alignChildren = ["fill", "top"];
    typographyViewport.minimumSize = [0, 240];
    typographyViewport.preferredSize = [662, 300];
    typographyViewport.maximumSize = [10000, 300];

    var typographyScrollbar = typographyScrollWrap.add("scrollbar", undefined, 0, 0, 100);
    typographyScrollbar.alignment = ["right", "fill"];
    typographyScrollbar.preferredSize.width = 18;
    typographyScrollbar.visible = false;

    var typographyContent = typographyViewport.add("group");
    typographyContent.orientation = "column";
    typographyContent.alignChildren = ["fill", "top"];
    typographyContent.alignment = ["fill", "top"];
    typographyContent.spacing = 10;

    var typographyScrollBaseLocation = null;

    function setTypographyScrollOffset(offsetValue) {
        if (!typographyScrollBaseLocation) typographyScrollBaseLocation = [typographyContent.location[0], typographyContent.location[1]];
        var maxOffset = typographyScrollbar.maxvalue || 0;
        var offset = Math.max(0, Math.min(offsetValue, maxOffset));
        typographyScrollbar.value = offset;
        typographyContent.location = [typographyScrollBaseLocation[0], typographyScrollBaseLocation[1] - offset];
    }

    function refreshTypographyScrollUI() {
        var currentScrollValue = typographyScrollbar.value || 0;
        try { typographyContent.location = [0, 0]; } catch (resetTypographyLocationErr) {}
        try { typographyContent.layout.layout(true); } catch (typographyContentLayoutErr) {}
        try { typographyScrollWrap.layout.layout(true); } catch (typographyScrollWrapLayoutErr) {}
        typographyScrollBaseLocation = [typographyContent.location[0], typographyContent.location[1]];

        var contentHeight = 0;
        var viewportHeight = 0;
        try { contentHeight = typographyContent.bounds[3] - typographyContent.bounds[1]; } catch (contentBoundsErr) { contentHeight = 0; }
        try { viewportHeight = typographyViewport.bounds[3] - typographyViewport.bounds[1]; } catch (viewportBoundsErr) { viewportHeight = 0; }

        var maxOffset = Math.max(0, contentHeight - viewportHeight + 12);
        typographyScrollbar.visible = maxOffset > 0;
        typographyScrollbar.enabled = maxOffset > 0;
        typographyScrollbar.maximumSize = maxOffset > 0 ? [18, 10000] : [0, 0];
        typographyScrollbar.minimumSize = maxOffset > 0 ? [18, 0] : [0, 0];
        typographyScrollbar.preferredSize.width = maxOffset > 0 ? 18 : 0;
        typographyScrollbar.maxvalue = maxOffset;
        typographyScrollbar.minvalue = 0;
        typographyScrollbar.stepdelta = 24;
        typographyScrollbar.jumpdelta = Math.max(80, Math.floor(viewportHeight * 0.8));
        setTypographyScrollOffset(typographyScrollbar.visible ? currentScrollValue : 0);
    }

    function measureControlHeight(control) {
        if (!control || control.visible === false) return 0;
        try {
            var bounds = control.bounds;
            var height = bounds[3] - bounds[1];
            if (height > 0) return height;
        } catch (e) {}
        try {
            if (control.preferredSize && control.preferredSize.height && control.preferredSize.height > 0) return control.preferredSize.height;
        } catch (e2) {}
        try {
            if (control.size && control.size.height && control.size.height > 0) return control.size.height;
        } catch (e3) {}
        return 0;
    }

    function measureVisibleChildrenHeight(container) {
        if (!container || !container.children) return 0;
        var spacing = 0;
        try { spacing = container.spacing || 0; } catch (spacingErr) { spacing = 0; }
        var total = 0;
        var visibleCount = 0;
        for (var i = 0; i < container.children.length; i++) {
            var child = container.children[i];
            if (!child || child.visible === false) continue;
            var height = measureControlHeight(child);
            if (height <= 0) continue;
            total += height;
            visibleCount++;
        }
        if (visibleCount > 1) total += spacing * (visibleCount - 1);
        return total;
    }

    function getSettingsScreenMaxHeight(defaultHeight) {
        var fallback = defaultHeight || 720;
        try {
            if ($.screens && $.screens.length > 0) {
                var screenBounds = $.screens[0].visibleBounds || $.screens[0].bounds;
                var screenTop = getBoundsCoordinate(screenBounds, "top", 1, 0);
                var screenBottom = getBoundsCoordinate(screenBounds, "bottom", 3, fallback);
                return Math.max(360, (screenBottom - screenTop) - 40);
            }
        } catch (screenErr) {}
        return fallback;
    }

    function applySettingsDialogGeometry(allowWindowResize) {
        try { setWin.layout.layout(true); } catch (layoutErr) {}
        try { refreshTypographyScrollUI(); } catch (typographyGeometryScrollErr) {}

        var activeTab = tabs.selection || dataTab;
        var tabsHeight = measureControlHeight(tabs);
        var activeTabHeight = measureControlHeight(activeTab);
        var activeContentHeight = measureVisibleChildrenHeight(activeTab);
        var outerChromeHeight = Math.max(140, measureControlHeight(topGrp) + measureControlHeight(overviewPanel) + measureControlHeight(g) + 54);
        var tabsChromeHeight = Math.max(40, tabsHeight - activeTabHeight);
        var desiredTabsHeight = Math.max(160, activeContentHeight + tabsChromeHeight + 18);
        var maxWindowHeight = getSettingsScreenMaxHeight(720);
        var desiredWindowHeight = Math.min(maxWindowHeight, outerChromeHeight + desiredTabsHeight);
        var minWindowHeight = Math.min(maxWindowHeight, outerChromeHeight + 170);

        tabs.minimumSize = [700, Math.max(160, desiredTabsHeight)];
        tabs.preferredSize = [700, Math.max(160, desiredTabsHeight)];
        if (allowWindowResize !== false) {
            setWin.minimumSize = [760, minWindowHeight];
            setWin.preferredSize = [760, desiredWindowHeight];
            try {
                var currentHeight = 0;
                try { currentHeight = setWin.bounds[3] - setWin.bounds[1]; } catch (boundsErr) { currentHeight = 0; }
                if (Math.abs(currentHeight - desiredWindowHeight) > 6) {
                    setWin.size = [760, desiredWindowHeight];
                }
            } catch (sizeErr) {}
        }
        try { setWin.layout.layout(true); } catch (layoutErr2) {}
        try { refreshTypographyScrollUI(); } catch (typographyGeometryScrollErr2) {}
    }

    typographyScrollbar.onChanging = function() {
        setTypographyScrollOffset(this.value);
    };
    typographyScrollbar.onChange = function() {
        setTypographyScrollOffset(this.value);
    };

    var uiTab = tabs.add("tab", undefined, t("settings_tab_ui"));
    uiTab.orientation = "column";
    uiTab.alignChildren = ["fill", "top"];

    function createSettingsField(parent, labelText, value, chars) {
        var fieldGroup = parent.add("group");
        fieldGroup.orientation = "column";
        fieldGroup.alignChildren = ["fill", "top"];
        fieldGroup.alignment = "fill";
        var label = fieldGroup.add("statictext", undefined, labelText);
        var input = fieldGroup.add("edittext", undefined, value);
        input.characters = chars;
        input.alignment = ["fill", "top"];
        return { group: fieldGroup, label: label, input: input };
    }

    function createProviderFieldsGroup(parent, fields) {
        var group = parent.add("group");
        group.orientation = "column";
        group.alignChildren = ["fill", "top"];
        group.alignment = "fill";
        var inputs = {};
        for (var i = 0; i < fields.length; i++) {
            var field = createSettingsField(group, fields[i].label, fields[i].value, fields[i].chars);
            inputs[fields[i].name] = field.input;
        }
        return { group: group, inputs: inputs };
    }

    function setSettingsGroupVisible(group, isVisible) {
        group.visible = !!isVisible;
        if (isVisible) {
            group.maximumSize = [10000, 10000];
            group.minimumSize = [0, 0];
            group.preferredSize = [-1, -1];
        } else {
            group.maximumSize = [0, 0];
            group.minimumSize = [0, 0];
            group.preferredSize = [0, 0];
        }
    }

    function createPathInputRow(parent, labelText, value, browseHandler) {
        parent.add("statictext", undefined, labelText);
        var row = parent.add("group");
        row.alignment = "fill";
        row.alignChildren = ["fill", "center"];
        var input = row.add("edittext", undefined, value);
        input.alignment = ["fill", "center"];
        input.characters = 40;
        var button = row.add("button", undefined, t("browse"));
        button.preferredSize = [160, 28];
        button.onClick = browseHandler;
        return input;
    }

    function createDialogHint(parent, hintText) {
        var hint = parent.add("statictext", undefined, hintText, { multiline: true });
        hint.preferredSize.width = 660;
        return hint;
    }

    function createSettingsSection(parent, title) {
        var panel = parent.add("panel", undefined, title);
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.alignment = "fill";
        panel.margins = 12;
        panel.spacing = 8;
        return panel;
    }

    createDialogHint(providerTab, t("settings_tab_provider_hint"));
    var providerSetupSection = createSettingsSection(providerTab, t("settings_section_provider_setup"));
    providerSetupSection.add("statictext", undefined, t("translation_provider"));
    var providerIds = ["deepl", "openai", "gemini", "claude", "local"];
    var providerLabels = [t("provider_deepl"), t("provider_openai"), t("provider_gemini"), t("provider_claude"), t("provider_local")];
    var providerDrop = providerSetupSection.add("dropdownlist", undefined, providerLabels);
    providerDrop.alignment = "fill";
    var providerHintText = providerSetupSection.add("statictext", undefined, "", { multiline: true });
    providerHintText.preferredSize.width = 640;
    var activeProviderId = getActiveTranslationProvider();
    var activeProviderIndex = 0;
    for (var providerIndex = 0; providerIndex < providerIds.length; providerIndex++) {
        if (providerIds[providerIndex] === activeProviderId) {
            activeProviderIndex = providerIndex;
            break;
        }
    }
    providerDrop.selection = activeProviderIndex;

    var providerCredentialsSection = createSettingsSection(providerTab, t("settings_section_provider_credentials"));
    var providerSettingsGroup = providerCredentialsSection.add("group");
    providerSettingsGroup.orientation = "column";
    providerSettingsGroup.alignChildren = ["fill", "top"];
    providerSettingsGroup.alignment = "fill";

    var deepLField = createSettingsField(providerSettingsGroup, t("deepl_api_key"), apiKey, 40);

    var providerSpecificGroup = providerSettingsGroup.add("group");
    providerSpecificGroup.orientation = "column";
    providerSpecificGroup.alignChildren = ["fill", "top"];
    providerSpecificGroup.alignment = "fill";

    var openAIProviderFields = createProviderFieldsGroup(providerSpecificGroup, [
        { name: "openAIKey", label: t("openai_api_key"), value: openAIKey, chars: 40 },
        { name: "openAIModel", label: t("openai_model"), value: openAIModel, chars: 30 }
    ]);
    var geminiProviderFields = createProviderFieldsGroup(providerSpecificGroup, [
        { name: "geminiKey", label: t("gemini_api_key"), value: geminiKey, chars: 40 },
        { name: "geminiModel", label: t("gemini_model"), value: geminiModel, chars: 30 }
    ]);
    var claudeProviderFields = createProviderFieldsGroup(providerSpecificGroup, [
        { name: "claudeKey", label: t("claude_api_key"), value: claudeKey, chars: 40 },
        { name: "claudeModel", label: t("claude_model"), value: claudeModel, chars: 30 }
    ]);
    var localProviderFields = createProviderFieldsGroup(providerSpecificGroup, [
        { name: "localLLMBaseURL", label: t("local_llm_base_url"), value: localLLMBaseURL, chars: 40 },
        { name: "localLLMApiKey", label: t("local_llm_api_key"), value: localLLMApiKey, chars: 40 },
        { name: "localLLMModel", label: t("local_llm_model"), value: localLLMModel, chars: 30 }
    ]);

    var keyInput = deepLField.input;
    var openAIKeyInput = openAIProviderFields.inputs.openAIKey;
    var openAIModelInput = openAIProviderFields.inputs.openAIModel;
    var geminiKeyInput = geminiProviderFields.inputs.geminiKey;
    var geminiModelInput = geminiProviderFields.inputs.geminiModel;
    var claudeKeyInput = claudeProviderFields.inputs.claudeKey;
    var claudeModelInput = claudeProviderFields.inputs.claudeModel;
    var localLLMBaseURLInput = localProviderFields.inputs.localLLMBaseURL;
    var localLLMApiKeyInput = localProviderFields.inputs.localLLMApiKey;
    var localLLMModelInput = localProviderFields.inputs.localLLMModel;
    var providerValidationText = providerCredentialsSection.add("statictext", undefined, "", { multiline: true });
    providerValidationText.preferredSize.width = 640;

    function getDraftProviderValidationMessage() {
        var selectedProviderIndex = (providerDrop.selection && providerDrop.selection.index >= 0) ? providerDrop.selection.index : 0;
        var selectedProviderId = providerIds[selectedProviderIndex] || "deepl";
        if (selectedProviderId === "openai") return String(openAIKeyInput.text || "").replace(/^\s+|\s+$/g, "") === "" ? t("validation_enter_openai_key") : "";
        if (selectedProviderId === "gemini") return String(geminiKeyInput.text || "").replace(/^\s+|\s+$/g, "") === "" ? t("validation_enter_gemini_key") : "";
        if (selectedProviderId === "claude") return String(claudeKeyInput.text || "").replace(/^\s+|\s+$/g, "") === "" ? t("validation_enter_claude_key") : "";
        if (selectedProviderId === "local") {
            if (normalizeLocalLLMBaseURL(localLLMBaseURLInput.text) === "") return t("validation_enter_local_llm_base_url");
            if (normalizeLocalLLMModel(localLLMModelInput.text) === "") return t("validation_enter_local_llm_model");
            return "";
        }
        return String(keyInput.text || "").replace(/^\s+|\s+$/g, "") === "" ? t("validation_enter_deepl_key") : "";
    }

    function refreshProviderValidationUI() {
        var validationMessage = getDraftProviderValidationMessage();
        providerValidationText.text = validationMessage === "" ? t("settings_provider_validation_ready") : validationMessage;
    }

    function refreshProviderSettingsUI() {
        var selectedProviderIndex = (providerDrop.selection && providerDrop.selection.index >= 0) ? providerDrop.selection.index : 0;
        var selectedProviderId = providerIds[selectedProviderIndex] || "deepl";
        deepLField.label.text = (selectedProviderId === "deepl") ? t("deepl_api_key") : t("deepl_fallback_api_key");
        providerHintText.text = (selectedProviderId === "deepl")
            ? t("settings_provider_deepl_hint")
            : (selectedProviderId === "local" ? t("settings_provider_local_hint") : t("settings_provider_llm_hint"));
        setSettingsGroupVisible(providerSpecificGroup, selectedProviderId !== "deepl");
        setSettingsGroupVisible(openAIProviderFields.group, selectedProviderId === "openai");
        setSettingsGroupVisible(geminiProviderFields.group, selectedProviderId === "gemini");
        setSettingsGroupVisible(claudeProviderFields.group, selectedProviderId === "claude");
        setSettingsGroupVisible(localProviderFields.group, selectedProviderId === "local");
        try { providerSettingsGroup.layout.layout(true); } catch (layoutErr) {}
        try { setWin.layout.layout(true); } catch (winLayoutErr) {}
    }

    providerDrop.onChange = function() {
        refreshProviderSettingsUI();
        refreshProviderValidationUI();
    };
    keyInput.onChanging = refreshProviderValidationUI;
    openAIKeyInput.onChanging = refreshProviderValidationUI;
    openAIModelInput.onChanging = refreshProviderValidationUI;
    geminiKeyInput.onChanging = refreshProviderValidationUI;
    geminiModelInput.onChanging = refreshProviderValidationUI;
    claudeKeyInput.onChanging = refreshProviderValidationUI;
    claudeModelInput.onChanging = refreshProviderValidationUI;
    localLLMBaseURLInput.onChanging = refreshProviderValidationUI;
    localLLMApiKeyInput.onChanging = refreshProviderValidationUI;
    localLLMModelInput.onChanging = refreshProviderValidationUI;
    refreshProviderSettingsUI();
    refreshProviderValidationUI();

    tabs.selection = dataTab;

    createDialogHint(typographyContent, t("settings_tab_typography_hint"));
    var typographyCopyfitSection = createSettingsSection(typographyContent, t("settings_section_typography_copyfit"));
    var typographyFontFallbackSection = createSettingsSection(typographyContent, t("settings_section_typography_font_fallback"));

    var uiSection = createSettingsSection(uiTab, t("settings_tab_ui"));
    var uiLanguageRow = uiSection.add("group");
    uiLanguageRow.alignment = "left";
    uiLanguageRow.alignChildren = ["left", "center"];
    uiLanguageRow.add("statictext", undefined, t("settings_ui_language"));
    var uiLanguageDrop = uiLanguageRow.add("dropdownlist", undefined, buildUILanguageSettingOptions());
    uiLanguageDrop.preferredSize.width = 180;
    uiLanguageDrop.selection = getUILanguageSettingSelectionIndex(UI_LANGUAGE_SETTING);

    createDialogHint(dataTab, t("settings_tab_data_hint"));
    var dataResourcesSection = createSettingsSection(dataTab, t("settings_section_resources"));
    var csvInput = createPathInputRow(dataResourcesSection, t("glossary_path"), csvPath, function() {
        var chosenGlossaryPath = promptForGlossaryPath(csvInput.text, true);
        if (chosenGlossaryPath && chosenGlossaryPath !== "") {
            csvInput.text = chosenGlossaryPath;
            try { refreshSettingsOverview(); } catch (overviewErr1) {}
        }
    });

    var glossaryEditorRow = dataResourcesSection.add("group");
    glossaryEditorRow.alignment = ["left", "center"];
    var btnGlossaryEditor = glossaryEditorRow.add("button", undefined, t("glossary_editor_button"));
    btnGlossaryEditor.preferredSize = [220, 28];
    btnGlossaryEditor.helpTip = t("glossary_editor_help");
    btnGlossaryEditor.onClick = function() {
        var editorResult = openGlossaryEditorDialog(csvInput.text);
        if (editorResult && editorResult.path && editorResult.path !== "") {
            csvInput.text = editorResult.path;
            try { refreshSettingsOverview(); } catch (overviewErrGlossaryEditor) {}
        }
    };

    var tmInput = createPathInputRow(dataResourcesSection, t("memory_path"), tmPath, function() {
        var f = File.openDialog(t("memory_select"), "*.json");
        if (f) {
            tmInput.text = f.fsName;
            try { refreshSettingsOverview(); } catch (overviewErr2) {}
        } else {
            var saveF = File.saveDialog(t("memory_save_new"), "*.json");
            if (saveF) {
                tmInput.text = saveF.fsName;
                try { refreshSettingsOverview(); } catch (overviewErr3) {}
            }
        }
    });

    var dataTranslationSection = createSettingsSection(dataTab, t("settings_section_translation"));
    dataTranslationSection.add("statictext", undefined, t("formality"));
    var formDrop = dataTranslationSection.add("dropdownlist", undefined, buildFormalityOptions());
    formDrop.alignment = "fill";
    if (formalitySetting === "more") formDrop.selection = 1; else if (formalitySetting === "less") formDrop.selection = 2; else formDrop.selection = 0;
    
    dataTranslationSection.add("statictext", undefined, t("ignored_styles"));
    var dntInput = dataTranslationSection.add("edittext", undefined, dntStyles);
    dntInput.characters = 40;
    dntInput.alignment = "fill";

    function createCompactTypographyRow(parent, leftConfig, rightConfig) {
        var row = parent.add("group");
        row.orientation = "row";
        row.alignment = "fill";
        row.alignChildren = ["fill", "top"];
        row.spacing = 14;

        var leftField = createSettingsField(row, leftConfig.label, leftConfig.value, leftConfig.chars || 8);
        leftField.label.helpTip = leftConfig.help || "";
        leftField.input.helpTip = leftConfig.help || "";

        var rightField = null;
        if (rightConfig) {
            rightField = createSettingsField(row, rightConfig.label, rightConfig.value, rightConfig.chars || 8);
            rightField.label.helpTip = rightConfig.help || "";
            rightField.input.helpTip = rightConfig.help || "";
        }

        return { left: leftField, right: rightField };
    }

    var copyfitEnabledCheckbox = typographyCopyfitSection.add("checkbox", undefined, t("copyfit_enabled"));
    copyfitEnabledCheckbox.value = !!smartCopyfitEnabled;
    copyfitEnabledCheckbox.helpTip = t("copyfit_enabled_help");

    var copyfitCompactHint = typographyCopyfitSection.add("statictext", undefined, t("copyfit_enabled_help"), { multiline: true });
    copyfitCompactHint.preferredSize.width = 640;

    var copyfitGrid = typographyCopyfitSection.add("group");
    copyfitGrid.orientation = "column";
    copyfitGrid.alignment = "fill";
    copyfitGrid.alignChildren = ["fill", "top"];
    copyfitGrid.spacing = 10;

    var copyfitLimitsRow = createCompactTypographyRow(copyfitGrid,
        { label: t("copyfit_max_tracking"), value: String(smartCopyfitMaxTracking), chars: 8, help: t("copyfit_tracking_help") },
        { label: t("copyfit_min_scale"), value: String(smartCopyfitMinScale), chars: 8, help: t("copyfit_scale_help") }
    );
    var copyfitTrackingField = copyfitLimitsRow.left;
    var copyfitScaleField = copyfitLimitsRow.right;

    var copyfitStepsRow = createCompactTypographyRow(copyfitGrid,
        { label: t("copyfit_tracking_step"), value: String(smartCopyfitTrackingStep), chars: 8, help: t("copyfit_tracking_step_help") },
        { label: t("copyfit_scale_step"), value: String(smartCopyfitScaleStep), chars: 8, help: t("copyfit_scale_step_help") }
    );
    var copyfitTrackingStepField = copyfitStepsRow.left;
    var copyfitScaleStepField = copyfitStepsRow.right;

    var copyfitHint = typographyCopyfitSection.add("statictext", undefined, t("copyfit_settings_help"), { multiline: true });
    copyfitHint.preferredSize.width = 640;

    var fontFallbackEnabledCheckbox = typographyFontFallbackSection.add("checkbox", undefined, t("font_fallback_enabled"));
    fontFallbackEnabledCheckbox.value = !!fontFallbackEnabled;
    fontFallbackEnabledCheckbox.helpTip = t("font_fallback_enabled_help");

    var fontFallbackHint = typographyFontFallbackSection.add("statictext", undefined, t("font_fallback_enabled_help"), { multiline: true });
    fontFallbackHint.preferredSize.width = 640;

    typographyFontFallbackSection.add("statictext", undefined, t("font_fallback_rules"));
    var fontFallbackRulesInput = typographyFontFallbackSection.add("edittext", undefined, fontFallbackRulesSetting, { multiline: true, scrolling: true });
    fontFallbackRulesInput.alignment = ["fill", "top"];
    fontFallbackRulesInput.preferredSize = [640, 120];
    fontFallbackRulesInput.helpTip = t("font_fallback_rules_help");

    var fontFallbackRulesHelpText = typographyFontFallbackSection.add("statictext", undefined, t("font_fallback_rules_help"), { multiline: true });
    fontFallbackRulesHelpText.preferredSize.width = 640;

    function refreshTypographySettingsUI() {
        var copyfitEnabled = !!copyfitEnabledCheckbox.value;
        copyfitTrackingField.input.enabled = copyfitEnabled;
        copyfitScaleField.input.enabled = copyfitEnabled;
        copyfitTrackingStepField.input.enabled = copyfitEnabled;
        copyfitScaleStepField.input.enabled = copyfitEnabled;
        fontFallbackRulesInput.enabled = !!fontFallbackEnabledCheckbox.value;
        try { refreshTypographyScrollUI(); } catch (typographyScrollErr) {}
    }

    createDialogHint(autoTab, t("settings_tab_auto_hint"));
    var autoSection = createSettingsSection(autoTab, t("settings_section_auto_options"));
    autoSection.add("statictext", undefined, t("auto_hyperlink_symbols"));
    var autoHyperlinkSymbolsInput = autoSection.add("edittext", undefined, refSymbolsSetting);
    autoHyperlinkSymbolsInput.characters = 20;
    autoHyperlinkSymbolsInput.alignment = "fill";
    autoHyperlinkSymbolsInput.helpTip = t("reference_symbols");
    autoSection.add("statictext", undefined, t("back_page_tracker_label"));
    var backPageTrackerInput = autoSection.add("edittext", undefined, backPageTrackerSetting);
    backPageTrackerInput.characters = 40;
    backPageTrackerInput.alignment = "fill";
    backPageTrackerInput.helpTip = t("back_page_tracker_help");
    var debugTableRestoreCheckbox = autoSection.add("checkbox", undefined, t("debug_tables_images"));
    debugTableRestoreCheckbox.value = tableRestoreDebugEnabled;
    debugTableRestoreCheckbox.helpTip = t("debug_tables_images_help");

    createDialogHint(exportTab, t("settings_tab_export_hint"));
    var exportSection = createSettingsSection(exportTab, t("settings_tab_export"));
    
    var pdfPresetNames = [];
    try {
        var presets = app.pdfExportPresets;
        for (var i = 0; i < presets.length; i++) {
            pdfPresetNames.push(presets[i].name);
        }
    } catch (e) {}
    if (pdfPresetNames.length === 0) pdfPresetNames.push("");

    exportSection.add("statictext", undefined, t("export_pdf_print_preset"));
    var pdfExportPrintPresetInput = exportSection.add("dropdownlist", undefined, pdfPresetNames);
    pdfExportPrintPresetInput.preferredSize.width = 300;
    pdfExportPrintPresetInput.alignment = "left";
    for (var i = 0; i < pdfPresetNames.length; i++) {
        if (pdfPresetNames[i] === pdfExportPrintPresetSetting) {
            pdfExportPrintPresetInput.selection = i; break;
        }
    }
    
    exportSection.add("statictext", undefined, ""); // spacer
    
    exportSection.add("statictext", undefined, t("export_pdf_web_preset"));
    var pdfExportWebPresetInput = exportSection.add("dropdownlist", undefined, pdfPresetNames);
    pdfExportWebPresetInput.preferredSize.width = 300;
    pdfExportWebPresetInput.alignment = "left";
    for (var j = 0; j < pdfPresetNames.length; j++) {
        if (pdfPresetNames[j] === pdfExportWebPresetSetting) {
            pdfExportWebPresetInput.selection = j; break;
        }
    }
    
    var pdfExportWebSpreadsCheckbox = exportSection.add("checkbox", undefined, t("export_pdf_web_spreads"));
    pdfExportWebSpreadsCheckbox.value = pdfExportWebSpreadsSetting;
    
    var pdfExportWebHyperlinksCheckbox = exportSection.add("checkbox", undefined, t("export_pdf_hyperlinks"));
    pdfExportWebHyperlinksCheckbox.value = pdfExportWebHyperlinksSetting;

    function refreshSettingsOverview() {
        var selectedProviderIndex = (providerDrop.selection && providerDrop.selection.index >= 0) ? providerDrop.selection.index : 0;
        var selectedProviderId = providerIds[selectedProviderIndex] || "deepl";
        var draftCopyfitEnabled = !!copyfitEnabledCheckbox.value;
        var draftCopyfitTracking = normalizeCopyfitMaxTrackingSetting(copyfitTrackingField.input.text);
        var draftCopyfitScale = normalizeCopyfitMinScaleSetting(copyfitScaleField.input.text);
        var draftCopyfitTrackingStep = normalizeCopyfitTrackingStepSetting(copyfitTrackingStepField.input.text);
        var draftCopyfitScaleStep = normalizeCopyfitScaleStepSetting(copyfitScaleStepField.input.text);
        var draftFontFallbackEnabled = !!fontFallbackEnabledCheckbox.value;
        var draftFontFallbackRules = normalizeFontFallbackRulesSetting(fontFallbackRulesInput.text);
        settingsOverviewText.text =
            t("status_provider") + " " + getTranslationProviderDisplayName(selectedProviderId) +
            "   |   " + t("status_glossary") + " " + getStatusPathLabel(csvInput.text) + "\n" +
            t("status_memory") + " " + getStatusPathLabel(tmInput.text) +
            "   |   " + t("status_symbols") + " " + normalizeRefSymbols(autoHyperlinkSymbolsInput.text) + "\n" +
            t("settings_copyfit_summary", {
                enabled: draftCopyfitEnabled ? t("settings_copyfit_enabled_on") : t("settings_copyfit_enabled_off"),
                tracking: draftCopyfitTracking,
                trackingStep: draftCopyfitTrackingStep,
                scale: draftCopyfitScale,
                scaleStep: draftCopyfitScaleStep
            }) + "   |   " +
            t("settings_font_fallback_summary", {
                enabled: draftFontFallbackEnabled ? t("settings_copyfit_enabled_on") : t("settings_copyfit_enabled_off"),
                count: countConfiguredFontFallbackRules(draftFontFallbackRules)
            }) + "\n" +
            t("settings_ui_language") + " " + buildUILanguageSettingOptions()[(uiLanguageDrop.selection && uiLanguageDrop.selection.index >= 0) ? uiLanguageDrop.selection.index : 0];
    }

    providerDrop.onChange = function() {
        refreshProviderSettingsUI();
        refreshProviderValidationUI();
        refreshSettingsOverview();
        try { refreshTypographyScrollUI(); } catch (providerGeometryErr) {}
    };
    csvInput.onChanging = refreshSettingsOverview;
    tmInput.onChanging = refreshSettingsOverview;
    autoHyperlinkSymbolsInput.onChanging = refreshSettingsOverview;
    copyfitEnabledCheckbox.onClick = function() {
        refreshTypographySettingsUI();
        refreshSettingsOverview();
    };
    copyfitTrackingField.input.onChanging = refreshSettingsOverview;
    copyfitScaleField.input.onChanging = refreshSettingsOverview;
    copyfitTrackingStepField.input.onChanging = refreshSettingsOverview;
    copyfitScaleStepField.input.onChanging = refreshSettingsOverview;
    fontFallbackEnabledCheckbox.onClick = function() {
        refreshTypographySettingsUI();
        refreshSettingsOverview();
    };
    fontFallbackRulesInput.onChanging = refreshSettingsOverview;
    uiLanguageDrop.onChange = refreshSettingsOverview;
    refreshTypographySettingsUI();
    refreshSettingsOverview();
    refreshTypographyScrollUI();

    var g = setWin.add("group");
    g.orientation = "stack";
    g.alignment = "fill";
    g.alignChildren = ["fill", "center"];
    g.margins.top = 8;

    var footerLeftWrap = g.add("group");
    footerLeftWrap.orientation = "row";
    footerLeftWrap.alignment = ["left", "center"];
    footerLeftWrap.alignChildren = ["left", "center"];
    footerLeftWrap.spacing = 10;
    footerLeftWrap.minimumSize.width = 310;

    var btnClearTM = footerLeftWrap.add("button", undefined, t("clear_memory"));
    btnClearTM.preferredSize = [140, 28];
    var btnFeedbackReport = footerLeftWrap.add("button", undefined, t("feedback_report"));
    btnFeedbackReport.preferredSize = [150, 28];

    var footerRightWrap = g.add("group");
    footerRightWrap.orientation = "row";
    footerRightWrap.alignment = ["right", "center"];
    footerRightWrap.alignChildren = ["right", "center"];
    footerRightWrap.spacing = 10;
    footerRightWrap.minimumSize.width = 260;

    var btnSave = footerRightWrap.add("button", undefined, t("save"), { name: "ok" });
    btnSave.preferredSize = [130, 30];
    var btnCancelSet = footerRightWrap.add("button", undefined, t("cancel"), { name: "cancel" });
    btnCancelSet.preferredSize = [120, 28];
    
    btnSave.onClick = function() {
        var selectedProviderIndex = (providerDrop.selection && providerDrop.selection.index >= 0) ? providerDrop.selection.index : 0;
        var selectedUILanguageIndex = (uiLanguageDrop.selection && uiLanguageDrop.selection.index >= 0) ? uiLanguageDrop.selection.index : 0;
        var selectedUILanguage = getUILanguageSettingBySelectionIndex(selectedUILanguageIndex);
        translationProviderSetting = normalizeTranslationProvider(providerIds[selectedProviderIndex] || "deepl");
        apiKey = String(keyInput.text || "").replace(/^\s+|\s+$/g, "");
        openAIKey = String(openAIKeyInput.text || "").replace(/^\s+|\s+$/g, "");
        openAIModel = normalizeOpenAIModel(openAIModelInput.text);
        geminiKey = String(geminiKeyInput.text || "").replace(/^\s+|\s+$/g, "");
        geminiModel = normalizeGeminiModel(geminiModelInput.text);
        claudeKey = String(claudeKeyInput.text || "").replace(/^\s+|\s+$/g, "");
        claudeModel = normalizeClaudeModel(claudeModelInput.text);
        localLLMBaseURL = normalizeLocalLLMBaseURL(localLLMBaseURLInput.text);
        localLLMApiKey = String(localLLMApiKeyInput.text || "").replace(/^\s+|\s+$/g, "");
        localLLMModel = normalizeLocalLLMModel(localLLMModelInput.text);
        csvPath = csvInput.text;
        csvPathSettingRaw = csvPath;
        tmPath = tmInput.text;
        refSymbolsSetting = normalizeRefSymbols(autoHyperlinkSymbolsInput.text);
        backPageTrackerSetting = normalizeBackPageTrackerSetting(backPageTrackerInput.text);
        smartCopyfitEnabled = !!copyfitEnabledCheckbox.value;
        smartCopyfitMaxTracking = normalizeCopyfitMaxTrackingSetting(copyfitTrackingField.input.text);
        smartCopyfitMinScale = normalizeCopyfitMinScaleSetting(copyfitScaleField.input.text);
        smartCopyfitTrackingStep = normalizeCopyfitTrackingStepSetting(copyfitTrackingStepField.input.text);
        smartCopyfitScaleStep = normalizeCopyfitScaleStepSetting(copyfitScaleStepField.input.text);
        fontFallbackEnabled = !!fontFallbackEnabledCheckbox.value;
        fontFallbackRulesSetting = normalizeFontFallbackRulesSetting(fontFallbackRulesInput.text);
        pdfExportPrintPresetSetting = pdfExportPrintPresetInput.selection ? pdfExportPrintPresetInput.selection.text : "";
        pdfExportWebPresetSetting = pdfExportWebPresetInput.selection ? pdfExportWebPresetInput.selection.text : "";
        pdfExportWebSpreadsSetting = !!pdfExportWebSpreadsCheckbox.value;
        pdfExportWebHyperlinksSetting = !!pdfExportWebHyperlinksCheckbox.value;
        resetFontFallbackCaches();
        app.insertLabel(DEEPL_KEY_LABEL, apiKey); 
        app.insertLabel(OPENAI_KEY_LABEL, openAIKey);
        app.insertLabel(OPENAI_MODEL_LABEL, openAIModel);
        app.insertLabel(GEMINI_KEY_LABEL, geminiKey);
        app.insertLabel(GEMINI_MODEL_LABEL, geminiModel);
        app.insertLabel(CLAUDE_KEY_LABEL, claudeKey);
        app.insertLabel(CLAUDE_MODEL_LABEL, claudeModel);
        app.insertLabel(LOCAL_LLM_BASE_URL_LABEL, localLLMBaseURL);
        app.insertLabel(LOCAL_LLM_API_KEY_LABEL, localLLMApiKey);
        app.insertLabel(LOCAL_LLM_MODEL_LABEL, localLLMModel);
        app.insertLabel(TRANSLATION_PROVIDER_LABEL, translationProviderSetting);
        app.insertLabel(CSV_PATH_LABEL, csvPath); 
        app.insertLabel(TM_PATH_LABEL, tmPath); 
        app.insertLabel(REF_SYMBOLS_LABEL, refSymbolsSetting);
        app.insertLabel(BACK_PAGE_TRACKER_LABEL, backPageTrackerSetting);
        app.insertLabel(COPYFIT_ENABLED_LABEL, smartCopyfitEnabled ? "1" : "0");
        app.insertLabel(COPYFIT_MAX_TRACKING_LABEL, String(smartCopyfitMaxTracking));
        app.insertLabel(COPYFIT_MIN_SCALE_LABEL, String(smartCopyfitMinScale));
        app.insertLabel(COPYFIT_TRACKING_STEP_LABEL, String(smartCopyfitTrackingStep));
        app.insertLabel(COPYFIT_SCALE_STEP_LABEL, String(smartCopyfitScaleStep));
        app.insertLabel(FONT_FALLBACK_ENABLED_LABEL, fontFallbackEnabled ? "1" : "0");
        app.insertLabel(FONT_FALLBACK_RULES_LABEL, encodeFontFallbackRulesSettingForLabel(fontFallbackRulesSetting));
        app.insertLabel(PDF_EXPORT_PRINT_PRESET_LABEL, pdfExportPrintPresetSetting);
        app.insertLabel(PDF_EXPORT_WEB_PRESET_LABEL, pdfExportWebPresetSetting);
        app.insertLabel(PDF_EXPORT_WEB_SPREADS_LABEL, pdfExportWebSpreadsSetting ? "1" : "0");
        app.insertLabel(PDF_EXPORT_WEB_HYPERLINKS_LABEL, pdfExportWebHyperlinksSetting ? "1" : "0");
        app.insertLabel(UI_LANGUAGE_LABEL, normalizeUILanguageSetting(selectedUILanguage));
        tableRestoreDebugEnabled = !!debugTableRestoreCheckbox.value;
        app.insertLabel(DEBUG_TABLE_RESTORE_LABEL, tableRestoreDebugEnabled ? "1" : "0");
        
        var selForm = "default";
        if (formDrop.selection.index === 1) selForm = "more"; else if (formDrop.selection.index === 2) selForm = "less";
        app.insertLabel(FORMALITY_LABEL, selForm); formalitySetting = selForm;
        app.insertLabel(DNT_LABEL, dntInput.text); dntStyles = dntInput.text;
        applyUILanguageSetting(selectedUILanguage);
        refreshMainWindowUIText();
        refreshMainStatusUI();
        refreshMainValidationUI();
        
        alert(t("settings_saved"));
        setWin.close();
    };
    btnClearTM.onClick = function() {
        if(confirm(t("clear_memory_confirm"))) {
            if (clearTM()) alert(t("clear_memory_done"));
        }
    }
    btnFeedbackReport.onClick = function() {
        createFeedbackReport();
    }
    btnLog.onClick = function() {
        var f = new File(logPath);
        if (f.exists) { f.execute(); } else { alert(t("no_log_file")); }
    };
    btnDebugLog.onClick = function() {
        var f = new File(debugLogPath);
        if (f.exists) { f.execute(); } else { alert(t("no_debug_log_file")); }
    };
    btnInfo.onClick = function() {
        alert(buildAboutText(), t("about_title"));
    };
    btnCancelSet.onClick = function() { setWin.close(); };
    setWin.onShow = function() {
        try { applySettingsDialogGeometry(true); } catch (showGeometryErr) {}
        var bounds = null;
        var width = 760;
        var height = 500;
        try {
            bounds = setWin.bounds;
            width = bounds[2] - bounds[0];
            height = bounds[3] - bounds[1];
        } catch (boundsErr) {}
        positionDialogCenteredOnMainWindow(setWin, width, height);
        try { refreshTypographyScrollUI(); } catch (showScrollErr) {}
    };
    setWin.onResizing = setWin.onResize = function() {
        this.layout.resize();
        try { refreshTypographyScrollUI(); } catch (resizeScrollErr) {}
    };
    tabs.onChange = function() {
        try { refreshTypographyScrollUI(); } catch (tabScrollErr) {}
    };
    try { applySettingsDialogGeometry(true); } catch (initialGeometryErr) {}
    setWin.show();
};

btnCancel.onClick = function() {
    stopMainWindowLiveRefresh();
    myWindow.close();
}

function isGermanMasterName(name) {
    return getMasterLang(name) === "de";
}

function normalizeLanguageBadgeText(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(/[\u2010-\u2015]/g, "-").replace(/^\s+|\s+$/g, "").replace(/[\r\n\t ]+/g, "").replace(/[^A-Za-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function extractSupportedLanguageCode(text) {
    var normalized = normalizeLanguageBadgeText(text);
    return isSupportedLegacyLanguageCode(normalized) ? normalized : "";
}

function findSupportedTranslationLanguageCodeMatch(text, includeGerman) {
    var raw = String(text || "").replace(/[\u2010-\u2015]/g, "-");
    if (raw === "") return null;
    var probe = raw.toUpperCase();
    var supportedCodes = includeGerman ? SUPPORTED_TRANSLATION_LANGUAGE_CODES_WITH_GERMAN : SUPPORTED_TRANSLATION_LANGUAGE_CODES;
    for (var i = 0; i < supportedCodes.length; i++) {
        var code = supportedCodes[i];
        var searchIndex = probe.indexOf(code);
        while (searchIndex !== -1) {
            var beforeChar = searchIndex > 0 ? probe.charAt(searchIndex - 1) : "";
            var afterIndex = searchIndex + code.length;
            var afterChar = afterIndex < probe.length ? probe.charAt(afterIndex) : "";
            var beforeOk = searchIndex === 0 || !/[A-Z0-9]/.test(beforeChar);
            var afterOk = afterIndex >= probe.length || !/[A-Z0-9]/.test(afterChar);
            if (beforeOk && afterOk) return { code: code, index: searchIndex, end: afterIndex };
            searchIndex = probe.indexOf(code, searchIndex + 1);
        }
    }
    return null;
}

function isSupportedLegacyLanguageCode(code) {
    var upper = normalizeTranslationLanguageCode(code);
    if (upper === "DE") return true;
    return !!getTranslationLanguageOption(upper);
}

function isBlackLikeSwatch(swatch) {
    if (!swatch || !swatch.isValid) return false;
    try {
        var swatchName = String(swatch.name).toLowerCase();
        if (swatchName === "black" || swatchName === "schwarz") return true;
    } catch (e) {}
    try {
        var values = swatch.colorValue;
        if (values && values.length >= 4 && Number(values[0]) <= 10 && Number(values[1]) <= 10 && Number(values[2]) <= 10 && Number(values[3]) >= 90) {
            return true;
        }
    } catch (e2) {}
    return false;
}

function hasBlackBadgeBackground(item) {
    if (!item || !item.isValid) return false;
    try {
        if (item.fillColor && isBlackLikeSwatch(item.fillColor)) return true;
    } catch (e) {}
    try {
        var parent = item.parent;
        if (parent && parent.isValid && parent.constructor && parent.constructor.name === "Group" && parent.allPageItems) {
            var siblings = parent.allPageItems;
            for (var i = 0; i < siblings.length; i++) {
                var sibling = siblings[i];
                if (!sibling || !sibling.isValid || sibling === item) continue;
                try {
                    if (sibling.fillColor && isBlackLikeSwatch(sibling.fillColor)) return true;
                } catch (e2) {}
            }
        }
    } catch (e3) {}
    return false;
}

function getTextFramesFromContainer(container) {
    var frames = [];
    if (!container) return frames;
    var items = [];
    try { items = container.allPageItems; } catch (e) { items = []; }
    for (var i = 0; i < items.length; i++) {
        if (items[i] && items[i].isValid && items[i].constructor.name === "TextFrame") frames.push(items[i]);
    }
    return frames;
}

function collectMasterLanguageBadges(masterSpread, preferredCode) {
    var matches = [];
    if (!masterSpread || !masterSpread.isValid) return matches;
    var preferred = preferredCode ? String(preferredCode).toLowerCase() : "";
    for (var p = 0; p < masterSpread.pages.length; p++) {
        var page = masterSpread.pages[p];
        var frames = getTextFramesFromContainer(page);
        for (var f = 0; f < frames.length; f++) {
            var tf = frames[f];
            var textObj = null;
            try { if (tf.texts && tf.texts.length > 0) textObj = tf.texts[0]; } catch (e2) { textObj = null; }
            if (!textObj || !textObj.isValid) {
                var story = getTextFrameStory(tf);
                if (!story) continue;
                textObj = story;
            }
            var code = extractSupportedLanguageCode(textObj.contents);
            if (!code) continue;
            if (preferred !== "" && code !== preferred) continue;

            var score = 0;
            try { if (hasBlackBadgeBackground(tf)) score += 40; } catch (e3) {}
            try {
                var bounds = tf.geometricBounds;
                var pageBounds = page.bounds;
                var frameCenterX = (bounds[1] + bounds[3]) / 2;
                var frameCenterY = (bounds[0] + bounds[2]) / 2;
                var pageCenterX = (pageBounds[1] + pageBounds[3]) / 2;
                var pageCenterY = (pageBounds[0] + pageBounds[2]) / 2;
                if (frameCenterX >= pageCenterX) score += 20;
                if (frameCenterY <= pageCenterY) score += 20;
                if ((bounds[3] - bounds[1]) <= 120) score += 10;
                if ((bounds[2] - bounds[0]) <= 60) score += 10;
            } catch (e4) {}
            if (code === "de") score += 5;
            matches.push({ code: code, textObj: textObj, frame: tf, page: page, score: score });
        }
    }
    return matches;
}

function findMasterLanguageBadge(masterSpread, preferredCode) {
    var matches = collectMasterLanguageBadges(masterSpread, preferredCode);
    var best = null;
    for (var i = 0; i < matches.length; i++) {
        if (!best || matches[i].score > best.score) best = matches[i];
    }
    return best;
}

function buildLegacyMasterBaseName(langCode) {
    return String(langCode).toLowerCase() + "-Musterseite";
}

function makeAlphabeticIndex(index) {
    var n = index + 1;
    var result = "";
    while (n > 0) {
        var remainder = (n - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        n = Math.floor((n - 1) / 26);
    }
    return result;
}

function setMasterSpreadLanguageNaming(masterSpread, prefixLetter, langCode) {
    if (!masterSpread || !masterSpread.isValid) return "";
    var baseName = buildLegacyMasterBaseName(langCode);
    try {
        masterSpread.baseName = baseName;
    } catch (e) {
        try { masterSpread.properties = { baseName: baseName }; } catch (e2) {}
    }
    try {
        masterSpread.namePrefix = prefixLetter;
    } catch (e3) {
        try { masterSpread.properties = { namePrefix: prefixLetter }; } catch (e4) {}
    }
    return String(masterSpread.name);
}

function replaceMasterLanguageBadgeText(masterSpread, langCode) {
    var badges = collectMasterLanguageBadges(masterSpread, "de");
    if (badges.length === 0) badges = collectMasterLanguageBadges(masterSpread, null);
    if (badges.length === 0) return false;
    var changed = 0;
    var handledIds = {};
    for (var i = 0; i < badges.length; i++) {
        var badge = badges[i];
        if (!badge || !badge.textObj || !badge.textObj.isValid) continue;
        var textId = null;
        try { textId = badge.textObj.id; } catch (eId) { textId = null; }
        if (textId !== null && handledIds[textId]) continue;
        try {
            badge.textObj.contents = String(langCode).toLowerCase();
            changed++;
            if (textId !== null) handledIds[textId] = true;
        } catch (e) {}
    }
    return changed > 0;
}

function findGermanLegacyMasterSpread(doc) {
    for (var i = 0; i < doc.masterSpreads.length; i++) {
        if (isGermanMasterName(doc.masterSpreads[i].name)) return doc.masterSpreads[i];
    }
    for (var j = 0; j < doc.masterSpreads.length; j++) {
        var badge = findMasterLanguageBadge(doc.masterSpreads[j], "de");
        if (badge && badge.code === "de") return doc.masterSpreads[j];
    }
    return null;
}

function promptLegacyTargetLanguageSelection(preselectedCodes, doc, includeExtendedLanguages, preservedSelection) {
    var showExtendedLanguages = !!includeExtendedLanguages;
    var languageOptions = getLegacyDialogLanguageOptions(showExtendedLanguages);
    var dlg = new Window("dialog", t("legacy_missing_title"));
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];

    var infoText = t("legacy_missing_info");
    if (showExtendedLanguages) infoText += "\n\n" + t("legacy_all_languages_hint");
    var info = dlg.add("statictext", undefined, infoText, { multiline: true });
    info.preferredSize.width = showExtendedLanguages ? 840 : 360;

    var listGroup = dlg.add("group");
    listGroup.orientation = "column";
    listGroup.alignChildren = ["left", "top"];

    var defaultMap = { en: true, fr: true, it: true, es: true, cs: true, hu: true };
    var selectedMap = {};
    var orderMap = buildLegacyLanguageOrderMap(doc, languageOptions);
    if (preservedSelection && preservedSelection.entries && preservedSelection.entries.length > 0) {
        for (var entryIndex = 0; entryIndex < preservedSelection.entries.length; entryIndex++) {
            var preservedEntry = preservedSelection.entries[entryIndex];
            var preservedCode = String(preservedEntry.code || "").toLowerCase();
            if (preservedCode === "") continue;
            selectedMap[preservedCode] = !!preservedEntry.enabled;
            orderMap[preservedCode] = normalizeLegacyOrderValue(preservedEntry.order, orderMap[preservedCode] || (entryIndex + 1));
        }
    } else if (preselectedCodes && preselectedCodes.length > 0) {
        for (var pre = 0; pre < preselectedCodes.length; pre++) {
            var preCode = String(preselectedCodes[pre] || "").toLowerCase();
            if (preCode !== "") selectedMap[preCode] = true;
        }
    } else {
        for (var fallbackCode in defaultMap) {
            if (defaultMap.hasOwnProperty(fallbackCode)) selectedMap[fallbackCode] = true;
        }
    }
    if (!showExtendedLanguages) {
        var headerRow = listGroup.add("group");
        headerRow.orientation = "row";
        headerRow.alignChildren = ["left", "center"];
        var languageHeader = headerRow.add("statictext", undefined, t("legacy_language_label"));
        languageHeader.preferredSize.width = 220;
        var orderHeader = headerRow.add("statictext", undefined, t("legacy_order_label"));
        orderHeader.preferredSize.width = 90;
    }

    var gridRow = listGroup.add("group");
    gridRow.orientation = "row";
    gridRow.alignChildren = ["left", "top"];
    var columnCount = 1;
    if (showExtendedLanguages) {
        if (languageOptions.length > 100) columnCount = 5;
        else if (languageOptions.length > 72) columnCount = 4;
        else columnCount = 3;
    }
    var rowsPerColumn = Math.ceil(languageOptions.length / columnCount);
    var columnGroups = [];
    for (var col = 0; col < columnCount; col++) {
        var columnGroup = gridRow.add("group");
        columnGroup.orientation = "column";
        columnGroup.alignChildren = ["left", "top"];
        columnGroup.spacing = 2;
        columnGroups.push(columnGroup);
    }

    var rows = [];
    for (var i = 0; i < languageOptions.length; i++) {
        var opt = languageOptions[i];
        var targetColumnIndex = Math.min(columnCount - 1, Math.floor(i / rowsPerColumn));
        var row = columnGroups[targetColumnIndex].add("group");
        row.orientation = "row";
        row.alignChildren = ["left", "center"];
        row.spacing = 6;
        var cb = row.add("checkbox", undefined, opt.code + " (" + getLocalizedLanguageName(opt.code) + ")");
        cb.preferredSize.width = showExtendedLanguages ? (columnCount >= 5 ? 160 : 175) : 220;
        cb.value = !!selectedMap[opt.code.toLowerCase()];
        var orderInput = row.add("edittext", undefined, String(orderMap[opt.code.toLowerCase()] || (i + 1)));
        orderInput.characters = showExtendedLanguages ? 3 : 4;
        orderInput.justify = "center";
        orderInput.enabled = cb.value;
        cb._orderField = orderInput;
        cb.onClick = function() {
            if (this._orderField) this._orderField.enabled = !!this.value;
        };
        rows.push({ code: opt.code.toLowerCase(), box: cb, orderField: orderInput });
    }

    function collectSelectionEntries() {
        var entries = [];
        for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            var rowInfo = rows[rowIndex];
            entries.push({
                code: rowInfo.code,
                enabled: !!rowInfo.box.value,
                order: normalizeLegacyOrderValue(rowInfo.orderField.text, orderMap[rowInfo.code] || (rowIndex + 1))
            });
        }
        return buildLegacyLanguageSelectionResult(entries, orderMap);
    }

    var buttonRow = dlg.add("group");
    buttonRow.alignment = "right";
    var btnMore = null;
    var btnOk = buttonRow.add("button", undefined, t("legacy_create"));
    if (!showExtendedLanguages) btnMore = buttonRow.add("button", undefined, t("legacy_more_languages"));
    var btnCancel = buttonRow.add("button", undefined, t("cancel"));

    var action = "cancel";
    var capturedSelection = null;
    if (btnMore) {
        btnMore.onClick = function() {
            action = "expand";
            capturedSelection = collectSelectionEntries();
            dlg.close();
        };
    }
    btnOk.onClick = function() {
        action = "ok";
        capturedSelection = collectSelectionEntries();
        dlg.close();
    };
    btnCancel.onClick = function() { action = "cancel"; dlg.close(); };

    dlg.show();
    if (action === "expand") return promptLegacyTargetLanguageSelection(preselectedCodes, doc, true, capturedSelection);
    if (action !== "ok") return null;
    return capturedSelection || collectSelectionEntries();
}

function collectLegacyBDALanguageTasks(doc, preferredCodes) {
    var tasksByCode = {};
    for (var m = 0; m < doc.masterSpreads.length; m++) {
        var master = doc.masterSpreads[m];
        var code = getMasterLang(master.name);
        if (!code || code === "de" || tasksByCode[code]) continue;
        tasksByCode[code] = { code: code, deepLCode: getDeepLLangCode(code), master: master };
    }

    var orderedCodes = [];
    var hasPreferredCodes = !!(preferredCodes && preferredCodes.length > 0);
    if (hasPreferredCodes) {
        for (var i = 0; i < preferredCodes.length; i++) orderedCodes.push(String(preferredCodes[i]).toLowerCase());
    } else {
        for (var j = 0; j < LEGACY_BDA_LANGUAGE_OPTIONS.length; j++) orderedCodes.push(LEGACY_BDA_LANGUAGE_OPTIONS[j].code.toLowerCase());
    }

    var tasks = [];
    var seen = {};
    for (var k = 0; k < orderedCodes.length; k++) {
        var codeKey = orderedCodes[k];
        if (tasksByCode[codeKey]) {
            tasks.push(tasksByCode[codeKey]);
            seen[codeKey] = true;
        }
    }
    if (!hasPreferredCodes) {
        for (var extraCode in tasksByCode) {
            if (tasksByCode.hasOwnProperty(extraCode) && !seen[extraCode]) tasks.push(tasksByCode[extraCode]);
        }
    }
    return tasks;
}

function collectLegacyMasterCodesInDocumentOrder(doc) {
    var codes = [];
    var seen = {};
    try {
        for (var i = 0; i < doc.masterSpreads.length; i++) {
            var code = getMasterLang(doc.masterSpreads[i].name);
            if (!code || code === "de" || seen[code] || !isSupportedLegacyLanguageCode(code)) continue;
            seen[code] = true;
            codes.push(code);
        }
    } catch (e) {}
    return codes;
}

function buildLegacyLanguageOrderMap(doc, languageOptions) {
    var orderMap = {};
    var nextOrder = 1;
    var existingCodes = collectLegacyMasterCodesInDocumentOrder(doc);
    for (var i = 0; i < existingCodes.length; i++) {
        orderMap[existingCodes[i]] = nextOrder++;
    }
    var options = (languageOptions && languageOptions.length) ? languageOptions : LEGACY_BDA_LANGUAGE_OPTIONS;
    for (var j = 0; j < options.length; j++) {
        var code = String(options[j].code || "").toLowerCase();
        if (!orderMap[code]) orderMap[code] = nextOrder++;
    }
    return orderMap;
}

function normalizeLegacyOrderValue(rawValue, fallbackValue) {
    var parsed = parseInt(String(rawValue || "").replace(/^\s+|\s+$/g, ""), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
    return fallbackValue;
}

function buildLegacyLanguageSelectionResult(entries, fallbackOrderMap) {
    var sorted = [];
    for (var i = 0; i < entries.length; i++) sorted.push(entries[i]);
    sorted.sort(function(a, b) {
        if (a.order !== b.order) return a.order - b.order;
        var aFallback = fallbackOrderMap[a.code] || 9999;
        var bFallback = fallbackOrderMap[b.code] || 9999;
        if (aFallback !== bFallback) return aFallback - bFallback;
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
    });

    var selectedCodes = [];
    var orderedCodes = [];
    for (var j = 0; j < sorted.length; j++) {
        orderedCodes.push(sorted[j].code);
        if (sorted[j].enabled) selectedCodes.push(sorted[j].code);
    }
    return { entries: sorted, selectedCodes: selectedCodes, orderedCodes: orderedCodes };
}

function getMasterSpreadPrefix(masterSpread) {
    if (!masterSpread || !masterSpread.isValid) return "";
    try {
        if (masterSpread.namePrefix) return String(masterSpread.namePrefix);
    } catch (e) {}
    try {
        return getMasterPrefix(String(masterSpread.name || ""));
    } catch (e2) {}
    return "";
}

function parseAlphabeticIndex(prefixText) {
    var clean = String(prefixText || "").toUpperCase().replace(/[^A-Z]/g, "");
    if (clean === "") return -1;
    var value = 0;
    for (var i = 0; i < clean.length; i++) {
        value = (value * 26) + (clean.charCodeAt(i) - 64);
    }
    return value - 1;
}

function getLegacyMasterCreationState(germanMaster, langTasks) {
    var spreads = [germanMaster];
    for (var i = 0; i < langTasks.length; i++) {
        if (langTasks[i] && langTasks[i].master) spreads.push(langTasks[i].master);
    }

    var anchor = germanMaster;
    var maxIndex = parseAlphabeticIndex(getMasterSpreadPrefix(germanMaster));
    if (maxIndex < 0) maxIndex = 1;

    for (var j = 0; j < spreads.length; j++) {
        var spread = spreads[j];
        if (!spread || !spread.isValid) continue;
        var prefixIndex = parseAlphabeticIndex(getMasterSpreadPrefix(spread));
        if (prefixIndex > maxIndex) {
            maxIndex = prefixIndex;
            anchor = spread;
        }
    }

    return { anchor: anchor, nextPrefixIndex: maxIndex + 1 };
}

function reorderLegacyTargetMasters(doc, germanMaster, orderedCodes) {
    if (!doc || !doc.isValid || !germanMaster || !germanMaster.isValid) return;

    var mastersByCode = {};
    for (var i = 0; i < doc.masterSpreads.length; i++) {
        var master = doc.masterSpreads[i];
        var code = getMasterLang(master.name);
        if (!code || code === "de" || mastersByCode[code]) continue;
        mastersByCode[code] = master;
    }

    var anchor = germanMaster;
    for (var j = 0; j < orderedCodes.length; j++) {
        var orderCode = String(orderedCodes[j] || "").toLowerCase();
        if (orderCode === "" || orderCode === "de") continue;
        var targetMaster = mastersByCode[orderCode];
        if (!targetMaster || !targetMaster.isValid) continue;
        try { targetMaster.move(LocationOptions.AFTER, anchor); } catch (moveErr) {}
        anchor = targetMaster;
    }
}

function createLegacyTargetMasters(doc, germanMaster, selectedCodes, anchorMaster, startPrefixIndex) {
    var created = [];
    var anchor = (anchorMaster && anchorMaster.isValid) ? anchorMaster : germanMaster;
    var prefixIndex = (startPrefixIndex !== undefined && startPrefixIndex !== null) ? startPrefixIndex : 2;
    for (var i = 0; i < selectedCodes.length; i++) {
        var code = String(selectedCodes[i]).toLowerCase();
        if (code === "de") continue;

        var duplicated = null;
        try { duplicated = germanMaster.duplicate(LocationOptions.AFTER, anchor); } catch (dupErr) { duplicated = null; }
        if (!duplicated || !duplicated.isValid) {
            try { duplicated = germanMaster.duplicate(); } catch (dupErr2) { duplicated = null; }
        }
        if (!duplicated || !duplicated.isValid) throw new Error((UI_IS_GERMAN ? "Musterseite für " : "Master page for ") + code.toUpperCase() + (UI_IS_GERMAN ? " konnte nicht dupliziert werden." : " could not be duplicated."));

        try { duplicated.move(LocationOptions.AFTER, anchor); } catch (moveErr) {}
        var masterThreadPairs = [];
        var masterPageCount = Math.min(germanMaster.pages.length, duplicated.pages.length);
        for (var mp = 0; mp < masterPageCount; mp++) {
            masterThreadPairs.push({ sourceItem: germanMaster.pages[mp], targetItem: duplicated.pages[mp] });
        }
        restoreTextFrameThreadingFromPairs(masterThreadPairs);
        setMasterSpreadLanguageNaming(duplicated, makeAlphabeticIndex(prefixIndex), code);
        if (!replaceMasterLanguageBadgeText(duplicated, code)) {
            try { if (duplicated.isValid) duplicated.remove(); } catch (cleanupErr) {}
            throw new Error((UI_IS_GERMAN ? "Sprachkästchen auf der neuen Musterseite für " : "Language badge on the new master page for ") + code.toUpperCase() + (UI_IS_GERMAN ? " konnte nicht aktualisiert werden." : " could not be updated."));
        }
        created.push(duplicated);
        anchor = duplicated;
        prefixIndex++;
    }
    return created;
}

function prepareLegacyMasterSpreads(doc, allowCreation) {
    updateProgress(4, t("bda_check_masters"), 4, t("bda_analyze_doc"));

    var germanMaster = findGermanLegacyMasterSpread(doc);
    if (!germanMaster) {
        throw new Error(t("legacy_no_german_master"));
    }

    setMasterSpreadLanguageNaming(germanMaster, "B", "de");
    replaceMasterLanguageBadgeText(germanMaster, "de");

    var langTasks = collectLegacyBDALanguageTasks(doc);
    if (allowCreation) {
        var detectedCodes = [];
        var detectedMap = {};
        for (var i = 0; i < langTasks.length; i++) {
            var detectedCode = String(langTasks[i].code || "").toLowerCase();
            if (detectedCode !== "" && !detectedMap[detectedCode]) {
                detectedMap[detectedCode] = true;
                detectedCodes.push(detectedCode);
            }
        }

        var selection = promptLegacyTargetLanguageSelection(detectedCodes, doc);
        if (selection === null) throw new Error(t("legacy_creation_cancelled"));
        if (!selection.selectedCodes || selection.selectedCodes.length === 0) throw new Error(t("legacy_no_languages_selected"));

        var missingCodes = [];
        for (var j = 0; j < selection.selectedCodes.length; j++) {
            var selectedCode = String(selection.selectedCodes[j] || "").toLowerCase();
            if (selectedCode !== "" && !detectedMap[selectedCode]) missingCodes.push(selectedCode);
        }

        if (missingCodes.length > 0) {
            updateProgress(7, t("bda_create_missing"), 7, t("bda_create_legacy"));
            var creationState = getLegacyMasterCreationState(germanMaster, langTasks);
            createLegacyTargetMasters(doc, germanMaster, missingCodes, creationState.anchor, creationState.nextPrefixIndex);
        }
        reorderLegacyTargetMasters(doc, germanMaster, selection.orderedCodes || []);
        langTasks = collectLegacyBDALanguageTasks(doc, selection.selectedCodes);
    }

    return { germanMaster: germanMaster, langTasks: langTasks };
}

function shouldCheckGermanText(text) {
    if (text === null || text === undefined) return false;
    var normalized = String(text).replace(/[\r\n\t]/g, " ").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
    if (normalized.length < 3) return false;
    if (normalized.match(/^#+(?:TBL|IMG)_\d+#+$/)) return false;
    var lettersOnly = normalized.replace(/[^A-Za-zÀ-ÖØ-öø-ÿĀ-žА-Яа-яЁёΆ-ώ]/g, "");
    return lettersOnly.length >= 3;
}

function addGermanSpellTarget(targets, textObj, story, locationLabel, page, frame, langCode) {
    if (!textObj || !textObj.isValid) return;
    if (!story || !story.isValid) return;
    var storyText = "";
    try { storyText = textObj.contents; } catch (e) { storyText = ""; }
    if (!shouldCheckGermanText(storyText)) return;

    targets.push({ textObj: textObj, story: story, text: storyText, location: locationLabel, page: page || null, frame: frame || null, langCode: String(langCode || "").toUpperCase() });
}

function collectGermanSpellTargets(doc, sourceLangCode) {
    var targets = [];
    var normalizedSourceLang = String(sourceLangCode || "").toUpperCase();
    if (normalizedSourceLang === "") return targets;

    for (var pageIndex = 0; pageIndex < doc.pages.length; pageIndex++) {
        var page = doc.pages[pageIndex];
        if (getPageLanguageCode(page) !== normalizedSourceLang) continue;
        var masterName = "";
        try { masterName = (page.appliedMaster && page.appliedMaster.isValid) ? String(page.appliedMaster.name) : "ohne Musterseite"; } catch (eMaster) { masterName = "ohne Musterseite"; }

        var pageItems = [];
        try { pageItems = page.allPageItems; } catch (e) { pageItems = []; }
        for (var pf = 0; pf < pageItems.length; pf++) {
            if (!pageItems[pf] || !pageItems[pf].isValid) continue;
            if (pageItems[pf].constructor.name !== "TextFrame") continue;
            var pageStory = getTextFrameStory(pageItems[pf]);
            var textObj = null;
            try { if (pageItems[pf].texts && pageItems[pf].texts.length > 0) textObj = pageItems[pf].texts[0]; } catch (e2) { textObj = null; }
            addGermanSpellTarget(targets, textObj, pageStory, "Dokumentseite " + (page.name || (pageIndex + 1)) + " / Musterseite " + masterName, page, pageItems[pf], normalizedSourceLang);
        }
    }

    return targets;
}

function getGermanSpellLanguage(doc) {
    var exactNames = [
        "Deutsch",
        "Deutsch: Rechtschreibreform 2006",
        "German",
        "German: 2006 Reform"
    ];
    var collections = [];
    try { collections.push(doc.languagesWithVendors); } catch (e) {}
    try { collections.push(app.languagesWithVendors); } catch (e2) {}

    for (var c = 0; c < collections.length; c++) {
        var coll = collections[c];
        if (!coll) continue;
        for (var i = 0; i < exactNames.length; i++) {
            try {
                var candidate = coll.itemByName(exactNames[i]);
                if (candidate && candidate.isValid) return candidate;
            } catch (e3) {}
        }
        try {
            for (var j = 0; j < coll.length; j++) {
                var lang = coll[j];
                if (!lang || !lang.isValid) continue;
                var langName = "";
                try { langName = String(lang.name); } catch (e4) { langName = ""; }
                if (langName.match(/deutsch|german/i)) return lang;
            }
        } catch (e5) {}
    }
    return null;
}

function applyGermanLanguageToTextTarget(item, germanLanguage) {
    if (!item || !item.textObj || !item.textObj.isValid || !germanLanguage || !germanLanguage.isValid) return false;
    try {
        item.textObj.appliedLanguage = germanLanguage;
        try { item.textObj.textStyleRanges.everyItem().appliedLanguage = germanLanguage; } catch (e1) {}
        return true;
    } catch (e) {
        try {
            item.textObj.texts[0].appliedLanguage = germanLanguage;
            try { item.textObj.textStyleRanges.everyItem().appliedLanguage = germanLanguage; } catch (e2) {}
            return true;
        } catch (e3) {
            return false;
        }
    }
}

function getTextObjectStoryRange(textObj) {
    if (!textObj || !textObj.isValid) return null;
    try {
        var startIndex = textObj.insertionPoints[0].index;
        var endIndex = textObj.insertionPoints[textObj.insertionPoints.length - 1].index;
        return { start: startIndex, end: endIndex };
    } catch (e) {
        return null;
    }
}

function buildSpellingFindingsForTarget(item, errors) {
    var findings = [];
    if (!item || !item.textObj || !item.textObj.isValid || !errors || errors.length === 0) return findings;
    var textRange = getTextObjectStoryRange(item.textObj);
    if (!textRange) return findings;

    for (var i = 0; i < errors.length; i++) {
        try {
            var errorText = errors[i];
            if (!errorText || !errorText.isValid) continue;
            var errStart = errorText.insertionPoints[0].index;
            if (errStart < textRange.start || errStart >= textRange.end) continue;
            var finding = buildInDesignSpellingFinding(item, errorText);
            if (!finding.issueText || finding.issueText === "") continue;
            findings.push(finding);
        } catch (e) {}
    }
    return findings;
}

function buildInDesignSpellingFinding(item, errorText) {
    var originalText = "";
    var issueText = "";
    var offset = 0;
    var length = 0;

    try { originalText = String(item.story.contents); } catch (e) { originalText = ""; }
    try { issueText = String(errorText.contents); } catch (e2) { issueText = ""; }
    try { offset = errorText.insertionPoints[0].index; } catch (e3) { offset = 0; }
    length = issueText.length;

    return {
        textObj: item.textObj,
        story: item.story,
        errorText: errorText,
        page: item.page,
        frame: item.frame,
        location: item.location,
        originalText: originalText,
        issueText: issueText,
        replacement: issueText,
        message: "InDesign-Rechtschreibprüfung",
        offset: offset,
        length: length
    };
}

function runLanguageToolGermanFrameCheck(text, langCode) {
    var endpoint = "https://api.languagetool.org/v2/check";
    var languageToolCode = getLanguageToolCodeForLanguage(langCode);
    if (languageToolCode === "") {
        return { ok: false, error: t("languagetool_lang_not_supported", { lang: getLocalizedLanguageName(langCode) }) };
    }
    var requestId = new Date().getTime() + "_" + Math.floor(Math.random() * 100000);
    var payloadFile = new File(Folder.temp + "/lt_payload_" + requestId + ".txt");
    var outFile = new File(Folder.temp + "/lt_out_" + requestId + ".json");
    var motherTongue = languageToolCode.substring(0, 2).toLowerCase();
    var payload = "language=" + encodeURIComponent(languageToolCode) + "&motherTongue=" + encodeURIComponent(motherTongue) + "&level=picky&text=" + encodeURIComponent(String(text).replace(/\r/g, "\n"));

    payloadFile.encoding = "UTF-8";
    if (!payloadFile.open("w")) {
        return { ok: false, error: t("languagetool_temp_file_error") };
    }
    payloadFile.write(payload);
    payloadFile.close();

    var resultStr = "";
    try {
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -d @'" + payloadFile.fsName + "'";
            resultStr = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -d @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultStr = outFile.read();
                outFile.close();
            }
        }
    } catch (e) {
        return { ok: false, error: e.message || t("languagetool_call_failed") };
    } finally {
        try { if (payloadFile.exists) payloadFile.remove(); } catch (e2) {}
        try { if (outFile.exists) outFile.remove(); } catch (e3) {}
    }

    if (!resultStr || resultStr === "") {
        return { ok: false, error: t("languagetool_no_response") };
    }

    try {
        return { ok: true, data: eval("(" + resultStr + ")") };
    } catch (e4) {
        return { ok: false, error: t("languagetool_parse_error") };
    }
}

function buildLanguageToolCorrectedText(originalText, matches) {
    var edits = buildLanguageToolEdits(originalText, matches);
    if (edits.length === 0) return originalText;
    var corrected = String(originalText);
    for (var e = edits.length - 1; e >= 0; e--) {
        var edit = edits[e];
        corrected = corrected.substring(0, edit.offset) + edit.replacement + corrected.substring(edit.offset + edit.length);
    }
    return corrected;
}

function buildGermanContextParts(originalText, offset, length) {
    var start = Math.max(0, offset - 45);
    var end = Math.min(originalText.length, offset + length + 45);
    return {
        before: makeGermanTextVisible(originalText.substring(start, offset)),
        issue: makeGermanTextVisible(originalText.substring(offset, offset + length)),
        after: makeGermanTextVisible(originalText.substring(offset + length, end))
    };
}

function normalizeSpellcheckComparableText(text) {
    return String(text || "").replace(/\s+$/g, "").replace(/^\s+/g, "");
}

function normalizeSpellcheckLetterText(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9à-öø-ÿā-žа-яёά-ώ]/g, "");
}

function getLanguageToolIssueType(matchObj) {
    try {
        if (matchObj && matchObj.rule && matchObj.rule.issueType) return String(matchObj.rule.issueType).toLowerCase();
    } catch (e) {}
    return "";
}

function getLanguageToolRuleFingerprint(matchObj) {
    var parts = [];
    try { if (matchObj && matchObj.rule && matchObj.rule.id) parts.push(String(matchObj.rule.id)); } catch (e) {}
    try { if (matchObj && matchObj.rule && matchObj.rule.category && matchObj.rule.category.id) parts.push(String(matchObj.rule.category.id)); } catch (e2) {}
    try { if (matchObj && matchObj.rule && matchObj.rule.category && matchObj.rule.category.name) parts.push(String(matchObj.rule.category.name)); } catch (e3) {}
    try { if (matchObj && matchObj.message) parts.push(String(matchObj.message)); } catch (e4) {}
    return parts.join(" ").toLowerCase();
}

function shouldIgnoreLanguageToolEdit(matchObj, issueText, replacementText) {
    var issueRaw = String(issueText || "");
    var replacementRaw = String(replacementText || "");
    if (issueRaw === "" || replacementRaw === "") return true;
    if (issueRaw === replacementRaw) return true;
    if (normalizeSpellcheckComparableText(issueRaw) === normalizeSpellcheckComparableText(replacementRaw) && issueRaw.replace(/\s/g, "") === replacementRaw.replace(/\s/g, "")) {
        return true;
    }
    if (normalizeSpellcheckLetterText(issueRaw) === normalizeSpellcheckLetterText(replacementRaw)) {
        return true;
    }

    var issueType = getLanguageToolIssueType(matchObj);
    var fingerprint = getLanguageToolRuleFingerprint(matchObj);
    if (issueType !== "" && issueType !== "misspelling") return true;
    if (fingerprint.match(/whitespace|typograph|duplication|double.?space|ellipsis|dash|quotation|quotes|style|grammar|register|locale|punctuat/)) {
        return true;
    }
    return false;
}

function buildLanguageToolEdits(originalText, matches) {
    var rawEdits = [];
    if (!matches || matches.length === 0) return rawEdits;

    for (var i = 0; i < matches.length; i++) {
        var matchObj = matches[i];
        if (!matchObj || !matchObj.replacements || matchObj.replacements.length === 0) continue;
        if (matchObj.offset === undefined || matchObj.length === undefined) continue;

        var issueText = originalText.substring(matchObj.offset, matchObj.offset + matchObj.length);
        var replacementText = String(matchObj.replacements[0].value || "");
        if (shouldIgnoreLanguageToolEdit(matchObj, issueText, replacementText)) continue;
        rawEdits.push({
            offset: matchObj.offset,
            length: matchObj.length,
            replacement: replacementText,
            issueText: issueText,
            message: matchObj.message || t("languagetool_hint"),
            contextParts: buildGermanContextParts(originalText, matchObj.offset, matchObj.length)
        });
    }

    rawEdits.sort(function(a, b) { return a.offset - b.offset; });
    var filteredEdits = [];
    var lastEnd = -1;
    for (var r = 0; r < rawEdits.length; r++) {
        var edit = rawEdits[r];
        if (edit.offset < lastEnd) continue;
        filteredEdits.push(edit);
        lastEnd = edit.offset + edit.length;
    }

    return filteredEdits;
}

function buildGermanFrameCorrection(item, matches) {
    var originalText = item.text || "";
    var edits = buildLanguageToolEdits(originalText, matches);
    if (edits.length === 0) return null;

    return {
        langCode: item.langCode || "",
        textObj: item.textObj,
        story: item.story,
        page: item.page,
        frame: item.frame,
        location: item.location,
        originalText: originalText,
        message: t("languagetool_correction"),
        issueCount: edits.length,
        edits: edits
    };
}

function refreshGermanFrameCorrection(correction) {
    if (!correction || !correction.textObj || !correction.textObj.isValid) return null;
    var currentText = "";
    try { currentText = String(correction.textObj.contents); } catch (e) { currentText = ""; }
    if (currentText === "") return null;

    try {
        var response = runLanguageToolGermanFrameCheck(currentText, correction.langCode || "");
        if (!response.ok || !response.data) return null;
        return buildGermanFrameCorrection({
            langCode: correction.langCode || "",
            textObj: correction.textObj,
            story: correction.story,
            page: correction.page,
            frame: correction.frame,
            location: correction.location,
            text: currentText
        }, response.data.matches || []);
    } catch (e) {
        return null;
    }
}

function getGermanHighlightSwatch(doc) {
    if (!doc) return null;
    try {
        var existing = doc.colors.itemByName("STP_Temp_Magenta");
        if (existing && existing.isValid) return existing;
    } catch (e) {}
    try {
        return doc.colors.add({
            name: "STP_Temp_Magenta",
            model: ColorModel.PROCESS,
            space: ColorSpace.CMYK,
            colorValue: [0, 100, 0, 0]
        });
    } catch (e2) {
        try {
            var fallback = doc.swatches.itemByName("Magenta");
            if (fallback && fallback.isValid) return fallback;
        } catch (e3) {}
    }
    return null;
}

function clearGermanIssueHighlight() {
    if (!germanHighlightState || !germanHighlightState.story || !germanHighlightState.story.isValid) {
        germanHighlightState = null;
        return;
    }
    try {
        for (var i = 0; i < germanHighlightState.entries.length; i++) {
            var entry = germanHighlightState.entries[i];
            try {
                var ch = germanHighlightState.story.characters.item(entry.index);
                if (ch && ch.isValid) ch.fillColor = entry.fillColor;
            } catch (e) {}
        }
    } catch (e2) {}
    germanHighlightState = null;
}

function getGermanEditTextRange(correction, edit) {
    if (!correction || !edit || !correction.textObj || !correction.textObj.isValid || !correction.story || !correction.story.isValid) return null;
    var textRange = getTextObjectStoryRange(correction.textObj);
    if (!textRange) return null;
    var startIndex = textRange.start + edit.offset;
    if (startIndex < textRange.start) startIndex = textRange.start;
    var endIndex = startIndex + Math.max(1, edit.length) - 1;
    if (endIndex >= textRange.end) endIndex = textRange.end - 1;
    try {
        return correction.story.characters.itemByRange(startIndex, endIndex);
    } catch (e) {
        return null;
    }
}

function getGermanTargetPage(finding) {
    if (!finding) return null;
    var targetPage = finding.page;
    if ((!targetPage || !targetPage.isValid) && finding.frame) {
        try { targetPage = finding.frame.parentPage; } catch (e) { targetPage = null; }
    }
    return targetPage;
}

function getGermanPageKey(page) {
    if (!page || !page.isValid) return "";
    try {
        if (page.id !== undefined && page.id !== null) return String(page.id);
    } catch (e) {}
    try {
        return String(page.documentOffset) + ":" + String(page.name);
    } catch (e2) {}
    return "";
}

function activateGermanPage(targetPage) {
    var win = getGermanLayoutWindow();
    if (!win || !targetPage || !targetPage.isValid) return false;

    var targetKey = getGermanPageKey(targetPage);
    var currentKey = "";
    try { currentKey = getGermanPageKey(win.activePage); } catch (e) { currentKey = ""; }
    if (targetKey !== "" && currentKey === targetKey) {
        germanFocusState.activePageKey = targetKey;
        return false;
    }

    try { win.activeSpread = targetPage.parent; } catch (e1) {}
    try { win.activePage = targetPage; } catch (e2) {}
    germanFocusState.activePageKey = targetKey;
    return true;
}

function highlightGermanIssue(correction, edit) {
    clearGermanIssueHighlight();
    if (!correction || !edit || !correction.story || !correction.story.isValid) return;
    var targetPage = getGermanTargetPage(correction);
    var pageChanged = activateGermanPage(targetPage);
    var targetKey = getGermanPageKey(targetPage);
    var needsFit = pageChanged || (targetKey !== "" && germanFocusState.fittedPageKey !== targetKey);

    var range = getGermanEditTextRange(correction, edit);
    if (!range || !range.isValid) return;

    try {
        var doc = app.activeDocument;
        var magenta = getGermanHighlightSwatch(doc);
        if (!magenta || !magenta.isValid) {
            app.select(range);
            return;
        }

        var textRange = getTextObjectStoryRange(correction.textObj);
        if (!textRange) return;
        var startIndex = textRange.start + edit.offset;
        var endIndex = startIndex + Math.max(1, edit.length) - 1;
        if (endIndex >= textRange.end) endIndex = textRange.end - 1;

        var entries = [];
        for (var idx = startIndex; idx <= endIndex; idx++) {
            try {
                var ch = correction.story.characters.item(idx);
                if (!ch || !ch.isValid) continue;
                entries.push({ index: idx, fillColor: ch.fillColor });
                ch.fillColor = magenta;
            } catch (e2) {}
        }
        germanHighlightState = { story: correction.story, entries: entries };
        app.select(range);
        if (needsFit) {
            try { $.sleep(25); } catch (e4) {}
            fitGermanPageInWindow(targetPage, true);
        }
    } catch (e3) {}
}

function applyGermanSingleEdit(correction, editIndex) {
    if (!correction || !correction.edits || editIndex < 0 || editIndex >= correction.edits.length) return false;
    var edit = correction.edits[editIndex];
    var range = getGermanEditTextRange(correction, edit);
    if (!range || !range.isValid) return false;
    clearGermanIssueHighlight();
    try {
        range.contents = edit.replacement;
        return true;
    } catch (e) {
        return false;
    }
}

function openGermanFrameCorrectionDialog(corrections) {
    if (!corrections || corrections.length === 0) return { replaced: 0, skipped: 0, stopped: false };

    var replacedCount = 0;
    var skippedCount = 0;
    var stopped = false;
    germanFocusState = { activePageKey: null, fittedPageKey: null };

    for (var i = 0; i < corrections.length; i++) {
        var correction = corrections[i];
        while (correction && correction.edits && correction.edits.length > 0) {
            if (!correction.textObj || !correction.textObj.isValid) {
                skippedCount++;
                break;
            }

            var dlg = new Window("dialog", t("german_frame_dialog_title", { current: (i + 1), total: corrections.length }), undefined, { resizeable: true });
            dlg.orientation = "column";
            dlg.alignChildren = ["fill", "top"];
            dlg.spacing = 10;
            dlg.minimumSize = [560, 440];
            dlg.preferredSize = [620, 500];

            var headerPanel = dlg.add("panel", undefined, correction.location);
            headerPanel.orientation = "column";
            headerPanel.alignChildren = ["fill", "top"];
            headerPanel.margins = 12;
            headerPanel.spacing = 6;
            var summaryText = headerPanel.add("statictext", undefined, t("german_frame_hint_count", { count: correction.issueCount }));
            summaryText.preferredSize.width = 560;
            var actionHint = headerPanel.add("statictext", undefined, t("german_frame_action_hint"), { multiline: true });
            actionHint.preferredSize.width = 560;

            var listPanel = dlg.add("panel", undefined, t("german_findings"));
            listPanel.orientation = "column";
            listPanel.alignChildren = ["fill", "top"];
            listPanel.margins = 12;
            var issueList = listPanel.add("listbox", undefined, [], { multiselect: false });
            issueList.preferredSize = [560, 130];
            for (var issueIndex = 0; issueIndex < correction.edits.length; issueIndex++) {
                var issue = correction.edits[issueIndex];
                issueList.add("item", (issueIndex + 1) + ". " + makeGermanTextVisible(issue.issueText) + " -> " + makeGermanTextVisible(issue.replacement));
            }

            var detailPanel = dlg.add("panel", undefined, t("german_current_hit"));
            detailPanel.orientation = "column";
            detailPanel.alignChildren = ["fill", "top"];
            detailPanel.margins = 12;
            detailPanel.spacing = 8;

            detailPanel.add("statictext", undefined, t("german_find_label"));
            var issueBox = detailPanel.add("edittext", undefined, "", { readonly: true });
            issueBox.preferredSize.width = 560;

            detailPanel.add("statictext", undefined, t("german_replace_label"));
            var replacementBox = detailPanel.add("edittext", undefined, "", { readonly: true });
            replacementBox.preferredSize.width = 560;

            detailPanel.add("statictext", undefined, t("german_hint"));
            var messageBox = detailPanel.add("edittext", undefined, "", { multiline: true, readonly: true });
            messageBox.preferredSize = [560, 52];

            detailPanel.add("statictext", undefined, t("german_context"));
            var contextBox = detailPanel.add("edittext", undefined, "", { multiline: true, readonly: true, scrolling: true });
            contextBox.preferredSize = [560, 90];

            var selectedEditIndex = 0;
            function updateIssuePreview() {
                if (!issueList.selection) return;
                selectedEditIndex = issueList.selection.index;
                var selectedIssue = correction.edits[selectedEditIndex];
                issueBox.text = makeGermanTextVisible(selectedIssue.issueText);
                replacementBox.text = makeGermanTextVisible(selectedIssue.replacement);
                messageBox.text = selectedIssue.message;
                contextBox.text = selectedIssue.contextParts.before + "[" + selectedIssue.contextParts.issue + "]" + selectedIssue.contextParts.after;
                highlightGermanIssue(correction, selectedIssue);
            }
            if (issueList.items.length > 0) {
                issueList.selection = 0;
                updateIssuePreview();
            }
            issueList.onChange = updateIssuePreview;

            var btnGroup = dlg.add("group");
            btnGroup.alignment = "fill";
            btnGroup.spacing = 10;
            var btnSkip = btnGroup.add("button", undefined, t("german_keep"), { name: "cancel" });
            btnSkip.preferredSize = [120, 28];
            var btnSpacer = btnGroup.add("statictext", undefined, "");
            btnSpacer.alignment = "fill";
            var btnReplace = btnGroup.add("button", undefined, t("german_apply"), { name: "ok" });
            btnReplace.preferredSize = [140, 30];
            var btnStop = btnGroup.add("button", undefined, t("german_finish"));
            btnStop.preferredSize = [120, 28];

            var action = "skip";
            btnSkip.onClick = function() {
                action = "skip";
                clearGermanIssueHighlight();
                dlg.close();
            };
            btnReplace.onClick = function() {
                action = "replace";
                clearGermanIssueHighlight();
                dlg.close();
            };
            btnStop.onClick = function() {
                action = "stop";
                clearGermanIssueHighlight();
                dlg.close();
            };
            dlg.onClose = function() {
                try {
                    germanSpellDialogLocation = [
                        getBoundsCoordinate(this.bounds, "left", 0, 0),
                        getBoundsCoordinate(this.bounds, "top", 1, 0)
                    ];
                } catch (locationErr) {}
                clearGermanIssueHighlight();
                return true;
            };
            dlg.onShow = function() {
                if (germanSpellDialogLocation && germanSpellDialogLocation.length === 2) {
                    try {
                        dlg.location = [germanSpellDialogLocation[0], germanSpellDialogLocation[1]];
                        return;
                    } catch (storedLocationErr) {}
                }
                positionDialogRightOfMainWindow(dlg, 620, 500);
            };
            dlg.onResizing = dlg.onResize = function() {
                this.layout.resize();
            };

            dlg.show();

            if (action === "stop") {
                stopped = true;
                break;
            }
            if (action === "skip") {
                correction.edits.splice(selectedEditIndex, 1);
                correction.issueCount = correction.edits.length;
                skippedCount++;
                continue;
            }

            if (applyGermanSingleEdit(correction, selectedEditIndex)) {
                replacedCount++;
                correction = refreshGermanFrameCorrection(correction);
            } else {
                alert(t("german_replace_failed", { location: correction.location }));
                skippedCount++;
                correction.edits.splice(selectedEditIndex, 1);
                correction.issueCount = correction.edits.length;
            }
        }
        if (stopped) break;
    }

    clearGermanIssueHighlight();
    germanFocusState = { activePageKey: null, fittedPageKey: null };
    return { replaced: replacedCount, skipped: skippedCount, stopped: stopped };
}

function makeGermanTextVisible(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(/ /g, "·").replace(/\t/g, "→").replace(/\r/g, "¶").replace(/\n/g, "¶");
}

function buildLanguageToolFindingSummary(finding) {
    return finding.location + ': "' + makeGermanTextVisible(finding.issueText) + '" -> ' + makeGermanTextVisible(finding.replacement) + " (" + finding.message + ")";
}

function refreshGermanFinding(finding) {
    if (!finding || !finding.story || !finding.story.isValid) return;
    var currentText = "";
    try { currentText = String(finding.story.contents); } catch (e) { currentText = ""; }
    finding.originalText = currentText;
    if (finding.errorText && finding.errorText.isValid) {
        try { finding.issueText = String(finding.errorText.contents); } catch (e2) {}
        try { finding.offset = finding.errorText.insertionPoints[0].index; } catch (e3) {}
        finding.length = finding.issueText ? finding.issueText.length : 0;
    }
}

function buildGermanFindingContext(finding) {
    refreshGermanFinding(finding);
    var start = Math.max(0, finding.offset - 50);
    var end = Math.min(finding.originalText.length, finding.offset + finding.length + 50);
    return finding.originalText.substring(start, end);
}

function getGermanLayoutWindow() {
    try {
        if (app.activeWindow && app.activeWindow.activePage !== undefined) return app.activeWindow;
    } catch (e) {}
    try {
        if (app.layoutWindows && app.layoutWindows.length > 0) return app.layoutWindows[0];
    } catch (e2) {}
    return null;
}

function fitGermanPageInWindow(targetPage, forceFit) {
    var win = getGermanLayoutWindow();
    if (!win) return;
    var targetKey = getGermanPageKey(targetPage);
    if (!forceFit && targetKey !== "" && germanFocusState.fittedPageKey === targetKey) return;

    try {
        if (targetPage && targetPage.isValid) {
            try { win.activeSpread = targetPage.parent; } catch (e1) {}
            try { win.activePage = targetPage; } catch (e2) {}
        }
        try { $.sleep(forceFit ? 25 : 15); } catch (e3) {}
        try {
            win.zoom(ZoomOptions.FIT_PAGE);
            germanFocusState.fittedPageKey = targetKey;
            return;
        } catch (e4) {}
        try {
            win.zoom(ZoomOptions.fitPage);
            germanFocusState.fittedPageKey = targetKey;
            return;
        } catch (e5) {}
    } catch (e6) {}
}

function focusGermanFinding(finding) {
    if (!finding) return;
    var targetPage = getGermanTargetPage(finding);
    var pageChanged = activateGermanPage(targetPage);
    var targetKey = getGermanPageKey(targetPage);
    var needsFit = pageChanged || (targetKey !== "" && germanFocusState.fittedPageKey !== targetKey);

    try {
        if (finding.errorText && finding.errorText.isValid) {
            app.select(finding.errorText);
            if (needsFit) {
                try { $.sleep(25); } catch (e3a) {}
                fitGermanPageInWindow(targetPage, true);
            }
            return;
        }
    } catch (e3) {}

    try {
        if (finding.frame && finding.frame.isValid) app.select(finding.frame);
    } catch (e4) {}
    if (needsFit) {
        try { $.sleep(25); } catch (e5) {}
        fitGermanPageInWindow(targetPage, true);
    }
}

function replaceGermanFinding(finding, replacementText) {
    if (!finding || !finding.story || !finding.story.isValid) return false;

    try {
        if (!finding.errorText || !finding.errorText.isValid) return false;
        finding.errorText.contents = replacementText;
        finding.replacement = replacementText;
        refreshGermanFinding(finding);
        return true;
    } catch (e) {
        return false;
    }
}

function openGermanCorrectionDialog(findings) {
    if (!findings || findings.length === 0) return { replaced: 0, skipped: 0, stopped: false };

    var replacedCount = 0;
    var skippedCount = 0;
    var stopped = false;

    for (var i = 0; i < findings.length; i++) {
        var finding = findings[i];
        if (!finding.story || !finding.story.isValid) {
            skippedCount++;
            continue;
        }
        focusGermanFinding(finding);
        refreshGermanFinding(finding);

        var dlg = new Window("dialog", t("german_dialog_title", { current: (i + 1), total: findings.length }));
        dlg.orientation = "column";
        dlg.alignChildren = "fill";

        dlg.add("statictext", undefined, finding.location);
        var msgText = dlg.add("statictext", undefined, finding.message);
        msgText.preferredSize.width = 420;
        var matchText = dlg.add("statictext", undefined, t("german_match", { text: makeGermanTextVisible(finding.issueText) }));
        matchText.preferredSize.width = 420;

        dlg.add("statictext", undefined, t("german_context"));
        var ctxInput = dlg.add("edittext", undefined, buildGermanFindingContext(finding), { multiline: true, readonly: true });
        ctxInput.preferredSize = [420, 90];

        dlg.add("statictext", undefined, t("german_find_label"));
        var findInput = dlg.add("edittext", undefined, finding.issueText);
        findInput.preferredSize.width = 420;

        dlg.add("statictext", undefined, t("german_replace_label"));
        var replaceInput = dlg.add("edittext", undefined, finding.replacement);
        replaceInput.preferredSize.width = 420;

        var btnGroup = dlg.add("group");
        btnGroup.alignment = "right";
        var btnSkip = btnGroup.add("button", undefined, t("german_skip"));
        var btnReplace = btnGroup.add("button", undefined, t("german_replace"));
        var btnStop = btnGroup.add("button", undefined, t("german_finish"));

        var action = "skip";
        btnSkip.onClick = function() {
            action = "skip";
            dlg.close();
        };
        btnReplace.onClick = function() {
            action = "replace";
            dlg.close();
        };
        btnStop.onClick = function() {
            action = "stop";
            dlg.close();
        };

        dlg.show();

        if (action === "stop") {
            stopped = true;
            break;
        }
        if (action === "skip") {
            skippedCount++;
            continue;
        }

        var replacementText = replaceInput.text;
        if (replaceGermanFinding(finding, replacementText)) {
            replacedCount++;
        } else {
            alert(t("german_auto_replace_failed", { summary: buildLanguageToolFindingSummary(finding) }));
            skippedCount++;
        }
    }

    return { replaced: replacedCount, skipped: skippedCount, stopped: stopped };
}

function runMasterSpellingCheck(doc) {
    var sourceLangCode = detectSourceLanguageCode(doc);
    if (sourceLangCode === "") {
        alert(t("source_lang_not_detected"));
        return;
    }
    var sourceLangLabel = getLocalizedLanguageName(sourceLangCode);
    var targets = collectGermanSpellTargets(doc, sourceLangCode);
    if (targets.length === 0) {
        alert(t("german_no_targets"));
        return;
    }

    var progressWin = new Window("palette", t("german_progress_title"));
    progressWin.orientation = "column";
    progressWin.alignChildren = "fill";
    var progressTextLocal = progressWin.add("statictext", undefined, t("german_prepare_check"));
    progressTextLocal.preferredSize.width = 380;
    var progressBarLocal = progressWin.add("progressbar", undefined, 0, targets.length);
    progressWin.show();

    var corrections = [];
    var skippedTexts = 0;
    var firstCheckError = "";

    for (var i = 0; i < targets.length; i++) {
        var item = targets[i];
        progressBarLocal.value = i + 1;
        progressTextLocal.text = t("german_check_progress", { lang: sourceLangLabel, current: (i + 1), total: targets.length });
        progressWin.update();
        try {
            var response = runLanguageToolGermanFrameCheck(item.text, sourceLangCode);
            if (!response.ok || !response.data) {
                skippedTexts++;
                if (!firstCheckError && response && response.error) firstCheckError = String(response.error);
                continue;
            }
            var matches = response.data.matches || [];
            var correction = buildGermanFrameCorrection(item, matches);
            if (correction) corrections.push(correction);
        } catch (e) {
            skippedTexts++;
            if (!firstCheckError) firstCheckError = (e && e.message) ? String(e.message) : String(e);
        }
    }

    progressWin.close();

    if (corrections.length === 0) {
        if (skippedTexts === targets.length && firstCheckError !== "") {
            alert(t("german_check_failed_all_skipped", { count: skippedTexts, reason: firstCheckError }));
            return;
        }
        var okMessage = t("german_check_ok", { lang: sourceLangLabel });
        if (skippedTexts > 0) {
            okMessage += firstCheckError !== ""
                ? t("german_check_notice_skipped_with_reason", { count: skippedTexts, reason: firstCheckError })
                : t("german_check_notice_skipped", { count: skippedTexts });
        }
        alert(okMessage);
        return;
    }

    var correctionResult = openGermanFrameCorrectionDialog(corrections);
    var finalMessage = t("german_dialog_done", { replaced: correctionResult.replaced, skipped: correctionResult.skipped });
    if (correctionResult.stopped) finalMessage += t("german_dialog_done_stopped");
    alert(finalMessage);
}

// --- 2. FORTSCHRITTS-FENSTER LOGIK ---
function createProgressWindow() {
    cancelFlag = false;
    startTime = new Date().getTime();
    globalStats = { apiChars: 0, savedChars: 0, fittedFrames: 0 }; 
    
    progressWin = new Window("palette", t("progress_title"), undefined, { resizeable: true });
    progressWin.orientation = "column";
    progressWin.alignChildren = ["fill", "top"];
    progressWin.spacing = 12;
    progressWin.margins = 16;
    progressWin.minimumSize = [520, 320];
    progressWin.preferredSize = [560, 340];
    
    var currentPanel = progressWin.add("panel", undefined, t("progress_current_step"));
    currentPanel.orientation = "column";
    currentPanel.alignChildren = ["fill", "top"];
    currentPanel.margins = 12;
    currentPanel.spacing = 8;
    progressStatusBanner = currentPanel.add("panel");
    progressStatusBanner.alignment = "fill";
    progressStatusBanner.margins = [12, 8, 12, 8];
    progressStatusBanner.minimumSize.height = 0;
    progressStatusBanner.maximumSize.height = 0;
    progressStatusBanner.visible = false;
    progressStatusBannerText = progressStatusBanner.add("statictext", undefined, "", { multiline: false });
    progressStatusBannerText.alignment = ["fill", "center"];
    progressStatusBannerText.justify = "center";
    progressText = currentPanel.add("statictext", undefined, t("progress_preparing"), { multiline: true });
    progressText.preferredSize = [480, 42];
    progressText.minimumSize.height = 42;
    progressBar = currentPanel.add("progressbar", undefined, 0, 100);
    progressBar.preferredSize = [480, 18];
    
    var overallPanel = progressWin.add("panel", undefined, t("progress_overall"));
    overallPanel.orientation = "column";
    overallPanel.alignChildren = ["fill", "top"];
    overallPanel.margins = 12;
    overallPanel.spacing = 8;
    overallText = overallPanel.add("statictext", undefined, t("progress_complete_pct", { pct: 0 }), { multiline: true });
    overallText.preferredSize = [480, 42];
    overallText.minimumSize.height = 42;
    overallBar = overallPanel.add("progressbar", undefined, 0, 100);
    overallBar.preferredSize = [480, 18];
    
    etaText = progressWin.add("statictext", undefined, t("progress_eta_calc"), { multiline: true });
    etaText.preferredSize = [480, 44];
    etaText.minimumSize.height = 44;
    etaText.justify = "left";
    
    var footerRow = progressWin.add("group");
    footerRow.alignment = "fill";
    var footerSpacer = footerRow.add("statictext", undefined, "");
    footerSpacer.alignment = "fill";
    btnStopProgress = footerRow.add("button", undefined, t("progress_cancel"));
    btnStopProgress.preferredSize = [140, 30];
    btnStopProgress.onClick = function() {
        if (btnStopProgress.text === t("progress_close")) progressWin.close(); 
        else {
            cancelFlag = true;
            setProgressStatusBanner("", false);
            progressText.text = t("progress_cancel_requested");
            overallText.text = t("progress_cancelling");
            progressWin.update();
        }
    };
    
    progressWin.onResizing = progressWin.onResize = function() {
        this.layout.resize();
    };
    
    progressWin.show();
    progressWin.update();
}

function setProgressStatusBanner(message, isVisible) {
    if (!progressStatusBanner || !progressStatusBannerText) return;

    progressStatusBanner.visible = !!isVisible;
    progressStatusBanner.minimumSize.height = isVisible ? 40 : 0;
    progressStatusBanner.maximumSize.height = isVisible ? 40 : 0;
    progressStatusBannerText.text = isVisible ? String(message || "") : "";

    if (isVisible) {
        try {
            progressStatusBanner.graphics.backgroundColor = progressStatusBanner.graphics.newBrush(
                progressStatusBanner.graphics.BrushType.SOLID_COLOR,
                [0.20, 0.55, 0.29, 1]
            );
        } catch (bgErr) {}
        try {
            progressStatusBannerText.graphics.foregroundColor = progressStatusBannerText.graphics.newPen(
                progressStatusBannerText.graphics.PenType.SOLID_COLOR,
                [1, 1, 1, 1],
                1
            );
        } catch (fgErr) {}
    }

    try { progressWin.layout.layout(true); } catch (layoutErr) {}
}

function updateProgress(taskPct, taskMsg, overallPct, overallMsg) {
    if (progressWin) {
        if (taskPct !== null && taskPct < 100) setProgressStatusBanner("", false);
        if (taskPct !== null) progressBar.value = taskPct;
        if (taskMsg !== null) progressText.text = taskMsg;
        
        if (overallPct !== null) {
            overallBar.value = overallPct;
            overallText.text = overallMsg ? overallMsg : t("progress_complete_pct", { pct: Math.round(overallPct) });
            
            if (overallPct > 0 && overallPct < 100) {
                var elapsed = new Date().getTime() - startTime;
                var totalEst = elapsed / (overallPct / 100);
                var remaining = totalEst - elapsed;
                
                var secs = Math.round(remaining / 1000);
                var mins = Math.floor(secs / 60);
                secs = secs % 60;
                
                var secStr = (secs < 10) ? "0" + secs : secs;
                etaText.text = t("progress_eta", { mins: mins, secs: secStr });
            } else if (overallPct >= 100) {
                etaText.text = t("progress_done");
            }
        }
        progressWin.update(); 
    }
}

function showSuccessScreen(finalMessage) {
    if (progressWin) {
        progressBar.value = 100;
        overallBar.value = 100;
        setProgressStatusBanner(t("progress_success_badge"), true);
        progressText.text = t("progress_success");
        overallText.text = finalMessage;
        
        var elapsedTotal = new Date().getTime() - startTime;
        var totalSecs = Math.round(elapsedTotal / 1000);
        var totalMins = Math.floor(totalSecs / 60);
        
        etaText.text = t("progress_duration", {
            mins: totalMins,
            secs: (totalSecs % 60),
            saved: globalStats.savedChars,
            frames: globalStats.fittedFrames
        });
        
        btnStopProgress.text = t("progress_close");
        progressWin.update();
    }
}

function closeProgressWindow() {
    if (progressWin) progressWin.close();
}


// --- 3. KLICK-LOGIK & START ---
function quickExportPDF(isWeb) {
    var doc = getActiveDocumentSafe();
    if (!doc || !doc.isValid) { alert(t("no_document_open")); return; }

    var presetName = isWeb ? pdfExportWebPresetSetting : pdfExportPrintPresetSetting;
    if (!presetName) {
        alert(t("validation_needs_attention") + "\n- " + (isWeb ? t("export_pdf_web_preset") : t("export_pdf_print_preset")));
        return;
    }

    var preset = app.pdfExportPresets.itemByName(presetName);
    if (!preset || !preset.isValid) {
        alert(t("validation_needs_attention") + "\n- Vorgabe '" + presetName + "' nicht gefunden.");
        return;
    }

    var defaultName = doc.name.replace(/\.indd$/i, "") + (isWeb ? "_Web.pdf" : "_Print.pdf");
    var defaultFile;
    try {
        defaultFile = new File(doc.filePath + "/" + defaultName);
    } catch (e) {
        defaultFile = new File(Folder.desktop + "/" + defaultName);
    }
    
    var file = defaultFile.saveDlg("PDF speichern", "*.pdf");
    if (!file) return;

    var originalPrefs = null;
    try {
        // Sichern der aktuellen Präferenzen
        originalPrefs = app.pdfExportPreferences.properties;
        // Vorgabe in die Präferenzen laden
        app.pdfExportPreferences.properties = preset.properties;
        
        // Einstellungen für Web überschreiben
        if (isWeb) {
            app.pdfExportPreferences.includeHyperlinks = pdfExportWebHyperlinksSetting;
            app.pdfExportPreferences.exportReaderSpreads = pdfExportWebSpreadsSetting;
        }
    } catch (e) {
        alert("Hinweis: Einstellungen konnten nicht vollständig vorbereitet werden:\n" + e.message);
    }

    try {
        // Wir lassen das 'preset'-Argument weg, damit unsere modifizierten Präferenzen greifen.
        doc.asynchronousExportFile(ExportFormat.PDF_TYPE, file, false);
    } catch (e) {
        alert("Fehler beim Export:\n" + e.message);
    } finally {
        if (originalPrefs !== null) {
            try { app.pdfExportPreferences.properties = originalPrefs; } catch (e) {}
        }
    }
}

btnPrintPDF.onClick = function() { quickExportPDF(false); };
btnWebPDF.onClick = function() { quickExportPDF(true); };

btnTranslate.onClick = function() {
    refreshMainValidationUI();
    var validationIssues = getMainValidationIssues();
    if (validationIssues.length > 0) {
        alert(validationIssues[0]);
        return;
    }

    var doc = getActiveDocumentSafe();
    if (!doc || !doc.isValid) {
        alert(t("no_document_open"));
        return;
    }

    var config = {
        mode: radioBDA.value ? "BDA" : (radioPages.value ? "PAGES" : "SELECTION"),
        sourcePages: editPages.text,
        bdaSourcePages: bdaSourceInput.text,
        updateTOC: checkTOC.value,
        lang: getSelectedLanguageCodeSafe(),
        onlyTextUpdate: cbOnlyTextUpdate ? cbOnlyTextUpdate.value : false,
        autoReferenceLinks: checkAutoBDAHyperlinks ? checkAutoBDAHyperlinks.value : false,
        autoReferenceSymbols: refSymbolsSetting,
        backPageTracker: backPageTrackerSetting
    };

    if (config.mode !== "BDA" && config.lang === "") {
        alert(t("validation_invalid_lang"));
        return;
    }

    if (config.mode === "SELECTION" && app.selection.length === 0) { alert(t("validation_select_something")); return; }
    if (config.mode === "PAGES" && config.sourcePages.replace(/\s/g, "") === "") { alert(t("validation_enter_pages")); return; }
    if (config.mode === "BDA" && config.bdaSourcePages.replace(/\s/g, "") === "") { alert(t("validation_enter_pages_or_auto")); return; }
    
    // Prüfen, ob API-Key des aktiven Providers hinterlegt ist
    var providerValidationMessage = getProviderValidationMessage(getActiveTranslationProvider());
    if (providerValidationMessage !== "") {
        alert(providerValidationMessage || t("validation_enter_api_key"));
        return;
    }

    if (config.lang === "EN") config.lang = "EN-GB"; 
    if (config.lang === "PT") config.lang = "PT-PT";

    if (config.mode === "BDA") {
        autoBDAHyperlinksSetting = !!config.autoReferenceLinks;
        app.insertLabel(AUTO_HYPERLINKS_LABEL, autoBDAHyperlinksSetting ? "1" : "0");
        backPageTrackerSetting = normalizeBackPageTrackerSetting(config.backPageTracker);
        app.insertLabel(BACK_PAGE_TRACKER_LABEL, backPageTrackerSetting);
        if (config.autoReferenceLinks) {
            refSymbolsSetting = normalizeRefSymbols(config.autoReferenceSymbols);
            app.insertLabel(REF_SYMBOLS_LABEL, refSymbolsSetting);
        }
    }

    createProgressWindow();

    writeLog("=== NEUER VORGANG GESTARTET ===");
    writeLog("Dokument: " + doc.name + " | Modus: " + config.mode + " | Zielsprache: " + config.lang + " | Provider: " + getTranslationProviderDisplayName(getActiveTranslationProvider()));
    beginDebugSession(doc, config);

    app.doScript(
        function() { 
            try {
                var resultMsg = runMainProcess(doc, config); 
                writeLog("Erfolgreich beendet. (API genutzt: " + globalStats.apiChars + " Z., API gespart: " + globalStats.savedChars + " Z., Copyfit gelöst: " + globalStats.fittedFrames + " Rahmen)");
                showSuccessScreen(resultMsg ? resultMsg : t("all_translations_done"));
            } catch(e) {
                closeProgressWindow();
                if (e.message === "CANCELLED") {
                    writeLog("Vorgang durch Benutzer abgebrochen.", "WARNUNG");
                    alert(t("process_cancelled"));
                } else {
                    writeLog("FEHLER: " + e.message, "ERROR");
                    alert(t("process_error", { message: e.message }));
                }
            }
        }, 
        ScriptLanguage.JAVASCRIPT, 
        undefined, 
        UndoModes.ENTIRE_SCRIPT, 
        t("undo_translation", { mode: config.mode })
    );
}

// --- 4. HAUPTSTEUERUNG ---
function runMainProcess(doc, config) {
    var preparedLegacy = null;
    if (config.mode === "BDA") {
        preparedLegacy = prepareLegacyMasterSpreads(doc, !config.onlyTextUpdate);
    }
    if (config.mode === "BDA" && config.onlyTextUpdate) {
        updateLanguageMasterVersionLabels(doc);
        syncMasterTextChanges(doc);
        var updateMsg = syncBDATextChanges(doc, config);
        runAutomaticHyperlinksForBDA(doc, config);
        return updateMsg;
    }
    updateLanguageMasterVersionLabels(doc);
    syncMasterTextChanges(doc);
    if (config.mode === "BDA") {
        return runBDAMode(doc, config, preparedLegacy);
    } else {
        updateProgress(5, t("read_textframes"), 5, t("preparation"));
        var targetTextObjArray = [];
        if (config.mode === "SELECTION") {
            for (var i = 0; i < app.selection.length; i++) {
                if (cancelFlag) throw new Error("CANCELLED");
                var mySel = app.selection[i];
                if (mySel.constructor.name === "TextFrame") targetTextObjArray.push(mySel.parentStory); 
                else if (mySel.constructor.name === "Cell") targetTextObjArray.push(mySel.texts[0]);
                else if (mySel.constructor.name === "Group") {
                    for (var g=0; g<mySel.allPageItems.length; g++) {
                        if (mySel.allPageItems[g].constructor.name === "TextFrame") targetTextObjArray.push(mySel.allPageItems[g].parentStory);
                    }
                } else if (mySel.hasOwnProperty("baseline")) targetTextObjArray.push(mySel);
            }
        }
        executeTranslation(doc, targetTextObjArray, (config.mode === "PAGES"), config.sourcePages, config.lang, 10, 90);
        return t("result_selection_pages", { lang: config.lang });
    }
}

// --- 5. BDA AUTOMATIK LOGIK ---
function normalizeBackPageSearchTerm(term) {
    return String(term || "").toLowerCase().replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
}

function parseBackPageTrackerTerms(settingValue) {
    var raw = normalizeBackPageTrackerSetting(settingValue);
    var parts = raw.split(/[\r\n|;,]+/);
    var terms = [];
    var seen = {};
    for (var i = 0; i < parts.length; i++) {
        var term = String(parts[i] || "").replace(/^\s+|\s+$/g, "");
        if (term === "") continue;
        var normalized = normalizeBackPageSearchTerm(term);
        if (normalized === "" || seen[normalized]) continue;
        seen[normalized] = true;
        terms.push(term);
    }
    if (terms.length === 0) terms.push("©");
    return terms;
}

function getPageSearchableText(page) {
    if (!page || !page.isValid) return "";
    var textFrames = getTextFramesFromContainer(page);
    var fragments = [];
    var seenStories = {};
    for (var i = 0; i < textFrames.length; i++) {
        var story = getTextFrameStory(textFrames[i]);
        if (!story || !story.isValid) continue;
        var storyId = null;
        try { storyId = story.id; } catch (eId) { storyId = null; }
        if (storyId !== null && seenStories[storyId]) continue;
        if (storyId !== null) seenStories[storyId] = true;
        try {
            var contents = String(story.contents || "");
            if (contents !== "") fragments.push(contents);
        } catch (e) {}
    }
    return normalizeBackPageSearchTerm(fragments.join(" "));
}

function collectBackPageCandidates(doc) {
    var candidates = [];
    if (!doc || !doc.isValid) return candidates;
    for (var i = 0; i < doc.pages.length; i++) {
        var page = doc.pages[i];
        candidates.push({ page: page, index: i, text: getPageSearchableText(page) });
    }
    return candidates;
}

function isBackMasterName(name) {
    return !!(name && String(name).match(/back/i));
}

function setBackMasterSpreadNaming(masterSpread) {
    if (!masterSpread || !masterSpread.isValid) return "";
    try {
        masterSpread.baseName = "Back-Musterseite";
    } catch (e) {
        try { masterSpread.properties = { baseName: "Back-Musterseite" }; } catch (e2) {}
    }
    return String(masterSpread.name || "");
}

function getMasterSpreadSearchableText(masterSpread) {
    if (!masterSpread || !masterSpread.isValid) return "";
    var fragments = [];
    var seenStories = {};
    for (var p = 0; p < masterSpread.pages.length; p++) {
        var frames = getTextFramesFromContainer(masterSpread.pages[p]);
        for (var f = 0; f < frames.length; f++) {
            var story = getTextFrameStory(frames[f]);
            if (!story || !story.isValid) continue;
            var storyId = null;
            try { storyId = story.id; } catch (eId) { storyId = null; }
            if (storyId !== null && seenStories[storyId]) continue;
            if (storyId !== null) seenStories[storyId] = true;
            try {
                var contents = String(story.contents || "");
                if (contents !== "") fragments.push(contents);
            } catch (e) {}
        }
    }
    return normalizeBackPageSearchTerm(fragments.join(" "));
}

function collectBackMasterCandidates(doc) {
    var candidates = [];
    if (!doc || !doc.isValid) return candidates;
    for (var i = 0; i < doc.masterSpreads.length; i++) {
        var master = doc.masterSpreads[i];
        candidates.push({ master: master, index: i, text: getMasterSpreadSearchableText(master) });
    }
    return candidates;
}

function findBackMasterByTracker(doc, trackerSetting) {
    var candidates = collectBackMasterCandidates(doc);
    if (candidates.length === 0) return null;

    var terms = ensureAutomaticBackPageFallbackTerms(parseBackPageTrackerTerms(trackerSetting), candidates);
    var filtered = candidates.slice(0);
    var matchedAny = false;

    for (var i = 0; i < terms.length; i++) {
        var normalizedTerm = normalizeBackPageSearchTerm(terms[i]);
        if (normalizedTerm === "") continue;
        var matches = [];
        for (var j = 0; j < filtered.length; j++) {
            if (filtered[j].text.indexOf(normalizedTerm) !== -1) matches.push(filtered[j]);
        }
        if (matches.length === 1) return matches[0].master;
        if (matches.length > 0) {
            filtered = matches;
            matchedAny = true;
        }
    }

    if (matchedAny && filtered.length > 0) return filtered[filtered.length - 1].master;

    var best = null;
    for (var c = 0; c < candidates.length; c++) {
        var score = 0;
        for (var tIndex = 0; tIndex < terms.length; tIndex++) {
            var scoreTerm = normalizeBackPageSearchTerm(terms[tIndex]);
            if (scoreTerm !== "" && candidates[c].text.indexOf(scoreTerm) !== -1) score++;
        }
        if (score > 0 && (!best || score > best.score || (score === best.score && candidates[c].index > best.index))) {
            best = { master: candidates[c].master, score: score, index: candidates[c].index };
        }
    }
    return best ? best.master : null;
}

function findNamedBackMasterSpread(doc) {
    if (!doc || !doc.isValid) return null;
    for (var i = doc.masterSpreads.length - 1; i >= 0; i--) {
        if (isBackMasterName(doc.masterSpreads[i].name)) return doc.masterSpreads[i];
    }
    return null;
}

function getPagesUsingMasterSpread(doc, masterSpread) {
    var pages = [];
    if (!doc || !doc.isValid || !masterSpread || !masterSpread.isValid) return pages;
    var masterId = null;
    try { masterId = masterSpread.id; } catch (eId) { masterId = null; }
    for (var i = 0; i < doc.pages.length; i++) {
        try {
            var applied = doc.pages[i].appliedMaster;
            if (!applied || !applied.isValid) continue;
            if (masterId !== null) {
                var appliedId = null;
                try { appliedId = applied.id; } catch (eAppliedId) { appliedId = null; }
                if (appliedId === masterId) pages.push(doc.pages[i]);
            } else if (String(applied.name || "") === String(masterSpread.name || "")) {
                pages.push(doc.pages[i]);
            }
        } catch (e) {}
    }
    return pages;
}

function getAppliedMasterSpread(page) {
    if (!page || !page.isValid) return null;
    try {
        if (page.appliedMaster && page.appliedMaster.isValid) return page.appliedMaster;
    } catch (e) {}
    return null;
}

function createBackMasterSpread(doc, sourceMaster) {
    var master = null;
    if (sourceMaster && sourceMaster.isValid) {
        try { master = sourceMaster.duplicate(LocationOptions.AFTER, sourceMaster); } catch (dupErr) { master = null; }
        if (!master || !master.isValid) {
            try { master = sourceMaster.duplicate(); } catch (dupErr2) { master = null; }
        }
    }
    if ((!master || !master.isValid) && doc && doc.isValid) {
        try { master = doc.masterSpreads.add(); } catch (addErr) { master = null; }
    }
    if (master && master.isValid) setBackMasterSpreadNaming(master);
    return master;
}

function ensureBackMasterForPage(doc, backPage, preferredMaster) {
    if (!doc || !doc.isValid || !backPage || !backPage.isValid) return null;

    var currentMaster = getAppliedMasterSpread(backPage);
    if (currentMaster && currentMaster.isValid && isBackMasterName(currentMaster.name)) {
        setBackMasterSpreadNaming(currentMaster);
        return currentMaster;
    }

    var existingBackMaster = findNamedBackMasterSpread(doc);
    if (existingBackMaster && existingBackMaster.isValid) {
        setBackMasterSpreadNaming(existingBackMaster);
        try { backPage.appliedMaster = existingBackMaster; } catch (assignExistingErr) {}
        return existingBackMaster;
    }

    var candidateMaster = currentMaster && currentMaster.isValid ? currentMaster : preferredMaster;
    if (candidateMaster && candidateMaster.isValid) {
        var usingPages = getPagesUsingMasterSpread(doc, candidateMaster);
        var canRenameExisting = false;
        if (usingPages.length === 0) {
            canRenameExisting = true;
        } else if (usingPages.length === 1) {
            try { canRenameExisting = (usingPages[0].id === backPage.id); } catch (eSingle) { canRenameExisting = (usingPages[0] === backPage); }
        }

        if (canRenameExisting) {
            setBackMasterSpreadNaming(candidateMaster);
            try { backPage.appliedMaster = candidateMaster; } catch (assignCandidateErr) {}
            return candidateMaster;
        }
    }

    var newBackMaster = createBackMasterSpread(doc, candidateMaster);
    if (newBackMaster && newBackMaster.isValid) {
        try { backPage.appliedMaster = newBackMaster; } catch (assignNewErr) {}
        return newBackMaster;
    }
    return currentMaster;
}

function ensureAutomaticBackPageFallbackTerms(terms, candidates) {
    var result = [];
    var seen = {};
    for (var i = 0; i < terms.length; i++) {
        var normalized = normalizeBackPageSearchTerm(terms[i]);
        if (normalized === "" || seen[normalized]) continue;
        seen[normalized] = true;
        result.push(terms[i]);
    }
    if (result.length === 0) result.push("©");

    var firstNormalized = normalizeBackPageSearchTerm(result[0]);
    if (firstNormalized === normalizeBackPageSearchTerm("©")) {
        var copyrightMatches = 0;
        for (var j = 0; j < candidates.length; j++) {
            if (candidates[j].text.indexOf(firstNormalized) !== -1) copyrightMatches++;
        }
        var companyTerm = "Steinbach International GmbH";
        var companyNormalized = normalizeBackPageSearchTerm(companyTerm);
        if (copyrightMatches >= 2 && !seen[companyNormalized]) result.push(companyTerm);
    }
    return result;
}

function findBackPageByTracker(doc, trackerSetting) {
    var candidates = collectBackPageCandidates(doc);
    if (candidates.length === 0) return null;

    var terms = ensureAutomaticBackPageFallbackTerms(parseBackPageTrackerTerms(trackerSetting), candidates);
    var filtered = candidates.slice(0);
    var matchedAny = false;

    for (var i = 0; i < terms.length; i++) {
        var normalizedTerm = normalizeBackPageSearchTerm(terms[i]);
        if (normalizedTerm === "") continue;
        var matches = [];
        for (var j = 0; j < filtered.length; j++) {
            if (filtered[j].text.indexOf(normalizedTerm) !== -1) matches.push(filtered[j]);
        }
        if (matches.length === 1) return matches[0].page;
        if (matches.length > 0) {
            filtered = matches;
            matchedAny = true;
        }
    }

    if (matchedAny && filtered.length > 0) return filtered[filtered.length - 1].page;

    var best = null;
    for (var c = 0; c < candidates.length; c++) {
        var score = 0;
        for (var tIndex = 0; tIndex < terms.length; tIndex++) {
            var scoreTerm = normalizeBackPageSearchTerm(terms[tIndex]);
            if (scoreTerm !== "" && candidates[c].text.indexOf(scoreTerm) !== -1) score++;
        }
        if (score > 0 && (!best || score > best.score || (score === best.score && candidates[c].index > best.index))) {
            best = { page: candidates[c].page, score: score, index: candidates[c].index };
        }
    }
    return best ? best.page : null;
}

function findOriginalBackPage(doc, trackerSetting) {
    if (!doc || !doc.isValid) return null;
    for (var p = doc.pages.length - 1; p >= 0; p--) {
        try {
            if (doc.pages[p].appliedMaster && doc.pages[p].appliedMaster.name.match(/back/i)) return doc.pages[p];
        } catch (e) {}
    }
    return findBackPageByTracker(doc, trackerSetting);
}

function findOriginalBackPageInfo(doc, trackerSetting) {
    if (!doc || !doc.isValid) return { page: null, master: null };

    var namedBackMaster = findNamedBackMasterSpread(doc);
    var namedBackMasterPages = getPagesUsingMasterSpread(doc, namedBackMaster);
    if (namedBackMasterPages.length > 0) {
        return { page: namedBackMasterPages[namedBackMasterPages.length - 1], master: namedBackMaster };
    }

    var namedPage = findOriginalBackPage(doc, trackerSetting);
    if (namedPage && namedPage.isValid) {
        return { page: namedPage, master: getAppliedMasterSpread(namedPage) || namedBackMaster };
    }

    var trackedMaster = findBackMasterByTracker(doc, trackerSetting);
    var trackedMasterPages = getPagesUsingMasterSpread(doc, trackedMaster);
    if (trackedMasterPages.length > 0) {
        return { page: trackedMasterPages[trackedMasterPages.length - 1], master: trackedMaster };
    }

    return { page: null, master: trackedMaster || namedBackMaster || null };
}

function runBDAMode(doc, config, preparedLegacy) {
    updateProgress(5, t("bda_search_templates"), 5, t("bda_analyze_doc"));
    var langTasks = (preparedLegacy && preparedLegacy.langTasks) ? preparedLegacy.langTasks : collectLegacyBDALanguageTasks(doc);

    if (!config.onlyTextUpdate) updateLanguageMasterVersionLabels(doc);
    if (langTasks.length === 0) { throw new Error(t("bda_no_templates")); }

    var backPageInfo = findOriginalBackPageInfo(doc, config.backPageTracker || backPageTrackerSetting);
    var originalBackPage = backPageInfo.page;
    if (originalBackPage && originalBackPage.isValid) {
        ensureBackMasterForPage(doc, originalBackPage, backPageInfo.master);
    } else {
        alert(t("back_page_not_found_notice"));
    }

    var originalPages = getBDAOriginalPages(doc, config);
    if (originalBackPage && originalBackPage.isValid) {
        var filteredOriginalPages = [];
        var backPageId = null;
        try { backPageId = originalBackPage.id; } catch (eBackId) { backPageId = null; }
        for (var op = 0; op < originalPages.length; op++) {
            var samePage = false;
            try {
                if (backPageId !== null && originalPages[op] && originalPages[op].isValid && originalPages[op].id === backPageId) samePage = true;
            } catch (eSameId) {}
            if (!samePage && originalPages[op] === originalBackPage) samePage = true;
            if (!samePage) filteredOriginalPages.push(originalPages[op]);
        }
        originalPages = filteredOriginalPages;
    }

    if (originalPages.length === 0) { throw new Error(t("bda_no_original_pages")); }

    var resultMsg = t("bda_finished", { count: langTasks.length });

    if (config.updateTOC) {
        updateProgress(8, t("bda_update_cover"), 8, t("bda_adjust_toc"));
        updateTOCForLanguage(doc, "de", originalPages[0].name);
    }

    var createdBackups = [];

    for (var i = 0; i < langTasks.length; i++) {
        if (cancelFlag) throw new Error("CANCELLED");
        
        var task = langTasks[i];
        
        var overallStartPct = 10 + (i / langTasks.length) * 85;
        var overallEndPct = 10 + ((i + 1) / langTasks.length) * 85;
        
        updateProgress(10, t("bda_create_doc_lang", { lang: task.code.toUpperCase() }), overallStartPct, t("bda_language_progress", { current: (i + 1), total: langTasks.length, lang: task.code.toUpperCase() }));
        
        var newPagesForThisLang = [];
        for (var p = 0; p < originalPages.length; p++) {
            var newPage = originalPages[p].duplicate(LocationOptions.AT_END);
            try { newPage.appliedMaster = task.master; } catch(e) {}
            newPagesForThisLang.push(newPage);
        }

        var pageThreadPairs = [];
        for (var npPair = 0; npPair < Math.min(originalPages.length, newPagesForThisLang.length); npPair++) {
            pageThreadPairs.push({ sourceItem: originalPages[npPair], targetItem: newPagesForThisLang[npPair] });
        }
        restoreTextFrameThreadingFromPairs(pageThreadPairs);
        
        var startPageStr = newPagesForThisLang[0].name; 
        var targetTextObjArray = collectUniqueTextStoriesFromItems(newPagesForThisLang);

        try {
            executeTranslation(doc, targetTextObjArray, false, "", task.deepLCode, overallStartPct, overallEndPct);
        } catch (langError) {
            for (var rp = newPagesForThisLang.length - 1; rp >= 0; rp--) {
                try { if (newPagesForThisLang[rp] && newPagesForThisLang[rp].isValid) newPagesForThisLang[rp].remove(); } catch (cleanupErr) {}
            }
            throw langError;
        }
        
        if (config.updateTOC) {
            updateTOCForLanguage(doc, task.code, startPageStr);
        }

        try {
            if (doc.saved) {
                updateProgress(95, t("bda_save_backup"), overallEndPct, t("bda_save_progress"));
                var docFolder = doc.filePath.fsName;
                var docName = doc.name.replace(/\.indd$/i, "");
                var backupFile = new File(docFolder + "/" + docName + "_TempBackup_" + task.code.toUpperCase() + ".indd");
                doc.saveACopy(backupFile);
                createdBackups.push(backupFile);
            }
        } catch(e) {} 
    }

    updateProgress(98, t("bda_move_back_page"), 98, t("bda_cleanup_pages"));
    var backPageMoved = false;
    if (originalBackPage && originalBackPage.isValid) {
        try {
            originalBackPage.move(LocationOptions.AT_END);
            backPageMoved = true;
        } catch (moveBackErr) {}
    }
    if (!backPageMoved) {
        for (var p = doc.pages.length - 1; p >= 0; p--) {
            if (doc.pages[p].appliedMaster && doc.pages[p].appliedMaster.name.match(/back/i)) {
                doc.pages[p].move(LocationOptions.AT_END);
                backPageMoved = true;
                break;
            }
        }
    }
    
    updateProgress(99, t("bda_cleanup_backups"), 99, t("bda_almost_done"));
    for (var b = 0; b < createdBackups.length; b++) {
        if (createdBackups[b].exists) {
            try { createdBackups[b].remove(); } catch(e) {}
        }
    }

    try {
        var originalPages = getBDAOriginalPages(doc, config);
        if (originalPages && originalPages.length > 0) {
            saveBDASnapshot(doc, buildBDASnapshotPayload(originalPages));
        }
        var snapshotPages = getBDAOriginalPages(doc, config);
        if (snapshotPages && snapshotPages.length > 0) {
            saveBDASnapshot(doc, buildBDASnapshotPayload(snapshotPages));
        }
    } catch (e) {}

    runAutomaticHyperlinksForBDA(doc, config);

    return resultMsg;
}

function getCurrentArticleVersionLabel() {
    var d = new Date();
    var year = d.getFullYear() % 100;
    var month = d.getMonth() + 1;
    var versionId = "v" + ("0" + year).slice(-2) + ("0" + month).slice(-2);
    return "Artikelnummer_" + versionId;
}

function getCurrentVersionToken() {
    var d = new Date();
    var year = d.getFullYear() % 100;
    var month = d.getMonth() + 1;
    return "v" + ("0" + year).slice(-2) + ("0" + month).slice(-2);
}

function updateVersionStrings(text, versionLabel) {
    if (!text) return text;
    var versionToken = versionLabel.split("_").pop();
    text = text.replace(/Artikelnummer(_| )?v?\d{4}/ig, versionLabel);
    text = text.replace(/_?V\d{4}\b/ig, function(match) {
        var out = versionToken;
        if (match.charAt(match[0] === '_' ? 1 : 0) === 'V') out = versionToken.toUpperCase();
        return match.charAt(0) === '_' ? '_' + out : out;
    });
    return text;
}

function updateLanguageMasterVersionLabels(doc) {
    var versionLabel = getCurrentArticleVersionLabel();
    var masterSpreads = doc.masterSpreads;
    for (var m = 0; m < masterSpreads.length; m++) {
        var masterName = masterSpreads[m].name;
        if (!getMasterLang(masterName)) continue;
        var pages = masterSpreads[m].pages;
        for (var p = 0; p < pages.length; p++) {
            var allItems = pages[p].allPageItems;
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                if (item.constructor.name !== "TextFrame") continue;
                try {
                    var story = null;
                    try { story = item.parentStory; } catch (e) { story = null; }
                    if ((!story || !story.isValid) && item.texts && item.texts.length > 0) {
                        story = item.texts[0];
                    }
                    if (!story || !story.isValid) continue;
                    var text = story.contents;
                    var newText = updateVersionStrings(text, versionLabel);
                    if (newText !== text) {
                        story.contents = newText;
                    }
                } catch (e) {}
            }
        }
        // Aktualisiere auch Seiten, die diese Masterseiten verwenden,
        // falls Elemente überschrieben wurden.
        for (var p2 = 0; p2 < doc.pages.length; p2++) {
            if (!doc.pages[p2].appliedMaster || doc.pages[p2].appliedMaster.name !== masterName) continue;
            var pageItems = doc.pages[p2].allPageItems;
            for (var j = 0; j < pageItems.length; j++) {
                var pageItem = pageItems[j];
                if (pageItem.constructor.name !== "TextFrame") continue;
                try {
                    var pageStory = null;
                    try { pageStory = pageItem.parentStory; } catch (e) { pageStory = null; }
                    if ((!pageStory || !pageStory.isValid) && pageItem.texts && pageItem.texts.length > 0) {
                        pageStory = pageItem.texts[0];
                    }
                    if (!pageStory || !pageStory.isValid) continue;
                    var pageText = pageStory.contents;
                    var newPageText = updateVersionStrings(pageText, versionLabel);
                    if (newPageText !== pageText) {
                        pageStory.contents = newPageText;
                    }
                } catch (e) {}
            }
        }
    }
}

function getMasterSnapshotFile() {
    return new File(Folder.userData + "/SuperTranslatorPRO_MasterSnapshot.json");
}

function getDocSnapshotKey(doc) {
    try {
        if (doc.fullName && doc.fullName !== "") return doc.fullName.fsName;
    } catch (e) {}
    return "UNSAVED_" + doc.name;
}

function getGlossaryVersionToken(path) {
    path = resolveCSVPath(path);
    if (!path || path === "") return "";
    waitForGlossaryLockRelease(path, CSV_LOCK_TIMEOUT_MS);
    try {
        var f = new File(path);
        if (!f.exists) {
            var backupFile = getGlossaryBackupFileForPath(path);
            if (!backupFile || !backupFile.exists) return "";
            return backupFile.fsName + "|" + String(backupFile.modified) + "|backup";
        }
        return f.fsName + "|" + String(f.modified);
    } catch (e) {
        return String(path);
    }
}

function loadMasterSnapshot(doc) {
    var file = getMasterSnapshotFile();
    if (!file.exists) return null;
    try {
        file.encoding = "UTF-8";
        file.open("r");
        var content = file.read();
        file.close();
        if (!content || content === "") return null;
        var data = eval("(" + content + ")");
        var key = getDocSnapshotKey(doc);
        if (data[key]) return data[key];
        if (doc.fullName && doc.fullName !== "") {
            var alt = "UNSAVED_" + doc.name;
            if (data[alt]) return data[alt];
        }
        return null;
    } catch (e) {
        return null;
    }
}

function saveMasterSnapshot(doc, snapshot) {
    var file = getMasterSnapshotFile();
    var data = {};
    if (file.exists) {
        try {
            file.encoding = "UTF-8";
            file.open("r");
            var content = file.read();
            file.close();
            if (content && content !== "") data = eval("(" + content + ")");
        } catch (e) {
            data = {};
        }
    }
    data[getDocSnapshotKey(doc)] = snapshot;
    try {
        file.encoding = "UTF-8";
        file.open("w");
        file.write(serializeJSON(data));
        file.close();
    } catch (e) {}
}

function getBDASnapshotFile() {
    return new File(Folder.userData + "/SuperTranslatorPRO_BDAChangeSnapshot.json");
}

function loadBDASnapshot(doc) {
    var file = getBDASnapshotFile();
    if (!file.exists) return null;
    try {
        file.encoding = "UTF-8";
        file.open("r");
        var content = file.read();
        file.close();
        if (!content || content === "") return null;
        var data = eval("(" + content + ")");
        var key = getDocSnapshotKey(doc);
        if (data[key]) return data[key];
        if (doc.fullName && doc.fullName !== "") {
            var alt = "UNSAVED_" + doc.name;
            if (data[alt]) return data[alt];
        }
        return null;
    } catch (e) {
        return null;
    }
}

function saveBDASnapshot(doc, snapshot) {
    var file = getBDASnapshotFile();
    var data = {};
    if (file.exists) {
        try {
            file.encoding = "UTF-8";
            file.open("r");
            var content = file.read();
            file.close();
            if (content && content !== "") data = eval("(" + content + ")");
        } catch (e) {
            data = {};
        }
    }
    data[getDocSnapshotKey(doc)] = snapshot;
    try {
        file.encoding = "UTF-8";
        file.open("w");
        file.write(serializeJSON(data));
        file.close();
    } catch (e) {}
}

function getBDAOriginalPages(doc, config) {
    if (config.bdaSourcePages && config.bdaSourcePages.toUpperCase() !== "AUTO") {
        return getPagesFromString(doc, config.bdaSourcePages);
    }
    var pages = [];
    for (var i = 0; i < doc.pages.length; i++) {
        try {
            var applied = doc.pages[i].appliedMaster;
            if (applied && applied.name.match(/[-_]de(?:[-_]|$)/i)) {
                pages.push(doc.pages[i]);
            }
        } catch (e) {}
    }
    return pages;
}

function getItemSignature(item) {
    if (!item || !item.isValid) return "";
    var sig = item.constructor.name;
    try {
        if (sig === "TextFrame") {
            var story = null;
            try { story = item.parentStory; } catch (e) { story = null; }
            if ((!story || !story.isValid) && item.texts && item.texts.length > 0) story = item.texts[0];
            if (story && story.isValid) sig += ":" + story.contents;
        } else if (sig === "Rectangle" || sig === "Polygon" || sig === "Oval") {
            if (item.allGraphics && item.allGraphics.length > 0) {
                try {
                    var link = item.allGraphics[0].itemLink;
                    if (link && link.isValid) sig += ":" + link.filePath;
                } catch (e) {}
            }
        } else if (sig === "Group") {
            try {
                var children = item.allPageItems.everyItem().getElements();
                for (var c = 0; c < children.length; c++) {
                    sig += "|" + getItemSignature(children[c]);
                }
            } catch (e) {}
        }
    } catch (e) {}
    return sig;
}

function normalizeBounds(bounds) {
    if (!bounds || bounds.length !== 4) return null;
    return [parseFloat(bounds[0]), parseFloat(bounds[1]), parseFloat(bounds[2]), parseFloat(bounds[3])];
}

function getItemDescriptor(item) {
    var desc = { type: null, bounds: null, textLen: 0, graphicPath: null };
    if (!item || !item.isValid) return desc;
    desc.type = item.constructor.name;
    try {
        desc.bounds = normalizeBounds(item.geometricBounds);
    } catch (e) { desc.bounds = null; }
    try {
        if (desc.type === "TextFrame") {
            var story = getTextFrameStory(item);
            if (story) desc.textLen = story.contents.length;
        } else if (item.allGraphics && item.allGraphics.length > 0) {
            try {
                var link = item.allGraphics[0].itemLink;
                if (link && link.isValid) desc.graphicPath = link.filePath;
            } catch (e) {}
        }
    } catch (e) {}
    return desc;
}

function boundsDistance(a, b) {
    if (!a || !b) return Number.MAX_VALUE;
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3]);
}

function findBestMatchingTargetItem(sourceItem, targetItems, fallbackIndex) {
    if (!sourceItem || !targetItems || targetItems.length === 0) return null;
    var sourceDesc = getItemDescriptor(sourceItem);
    var bestMatch = null;
    var bestScore = Number.MAX_VALUE;
    for (var i = 0; i < targetItems.length; i++) {
        var targetItem = targetItems[i];
        if (!targetItem || !targetItem.isValid) continue;
        var targetDesc = getItemDescriptor(targetItem);
        if (targetDesc.type !== sourceDesc.type) continue;
        var score = 0;
        if (sourceDesc.graphicPath && targetDesc.graphicPath) {
            if (sourceDesc.graphicPath === targetDesc.graphicPath) score -= 1000;
            else score += 1000;
        }
        if (sourceDesc.bounds && targetDesc.bounds) {
            score += boundsDistance(sourceDesc.bounds, targetDesc.bounds);
        } else {
            score += 500;
        }
        if (sourceDesc.type === "TextFrame") {
            score += Math.abs(sourceDesc.textLen - targetDesc.textLen);
        }
        if (score < bestScore) {
            bestScore = score;
            bestMatch = targetItem;
        }
    }
    if (bestMatch) return bestMatch;
    if (fallbackIndex !== undefined && fallbackIndex !== null && fallbackIndex < targetItems.length) {
        return targetItems[fallbackIndex];
    }
    return null;
}

function buildBDAChangeSnapshot(pages) {
    var snapshot = [];
    for (var p = 0; p < pages.length; p++) {
        var pageData = [];
        try {
            var items = pages[p].pageItems.everyItem().getElements();
            for (var i = 0; i < items.length; i++) {
                pageData.push(getItemSignature(items[i]));
            }
        } catch (e) {}
        snapshot.push(pageData);
    }
    return snapshot;
}

function buildBDASnapshotPayload(pages) {
    return {
        pages: buildBDAChangeSnapshot(pages),
        glossaryVersion: getGlossaryVersionToken(csvPath)
    };
}

function getBDASnapshotPages(snapshot) {
    if (!snapshot) return null;
    if (snapshot instanceof Array) return snapshot;
    return snapshot.pages || [];
}

function getBDASnapshotGlossaryVersion(snapshot) {
    if (!snapshot || snapshot instanceof Array) return "";
    return snapshot.glossaryVersion || "";
}

function getBDATargetPagesByLang(doc) {
    var pagesByLang = {};
    for (var i = 0; i < doc.pages.length; i++) {
        try {
            var applied = doc.pages[i].appliedMaster;
            if (!applied) continue;
            var code = getMasterLang(applied.name);
            if (!code) continue;
            if (code === "de") continue;
            if (!pagesByLang[code]) pagesByLang[code] = [];
            pagesByLang[code].push(doc.pages[i]);
        } catch (e) {}
    }
    return pagesByLang;
}

function replacePageFrameText(page, frameIndex, contents) {
    try {
        var frames = page.textFrames.everyItem().getElements();
        if (frameIndex >= frames.length) return false;
        var tf = frames[frameIndex];
        var story = null;
        try { story = tf.parentStory; } catch (e) { story = null; }
        if ((!story || !story.isValid) && tf.texts && tf.texts.length > 0) story = tf.texts[0];
        if (!story || !story.isValid) return false;
        story.contents = contents;
        if (story.characters && story.characters.length > 0) normalizePostTranslationSpacing(story);
        return true;
    } catch (e) { return false; }
}

function getTextFrameStory(tf) {
    if (!tf || !tf.isValid) return null;
    var story = null;
    try { story = tf.parentStory; } catch (e) { story = null; }
    if ((!story || !story.isValid) && tf.texts && tf.texts.length > 0) story = tf.texts[0];
    if (!story || !story.isValid) return null;
    return story;
}

function getThreadableTextFrames(item) {
    if (!item || !item.isValid) return [];
    try {
        if (item.constructor && item.constructor.name === "TextFrame") return [item];
    } catch (e) {}
    return getTextFramesFromContainer(item);
}

function clearTextFrameThreadLink(textFrame) {
    if (!textFrame || !textFrame.isValid) return false;
    try {
        textFrame.nextTextFrame = NothingEnum.nothing;
        return true;
    } catch (e) {}
    try {
        textFrame.nextTextFrame = null;
        return true;
    } catch (e2) {}
    return false;
}

function restoreTextFrameThreadingFromPairs(pairs) {
    if (!pairs || pairs.length === 0) return 0;

    var frameMap = {};
    var targetSeen = {};
    var targetFramesToClear = [];

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        if (!pair || !pair.sourceItem || !pair.targetItem) continue;

        var sourceFrames = getThreadableTextFrames(pair.sourceItem);
        var targetFrames = getThreadableTextFrames(pair.targetItem);
        var frameCount = Math.min(sourceFrames.length, targetFrames.length);

        for (var f = 0; f < frameCount; f++) {
            var sourceFrame = sourceFrames[f];
            var targetFrame = targetFrames[f];
            if (!sourceFrame || !sourceFrame.isValid || !targetFrame || !targetFrame.isValid) continue;

            var sourceId = null;
            var targetId = null;
            try { sourceId = sourceFrame.id; } catch (eId) { sourceId = null; }
            try { targetId = targetFrame.id; } catch (eId2) { targetId = null; }
            if (sourceId === null || sourceId === undefined) continue;

            frameMap[String(sourceId)] = {
                sourceFrame: sourceFrame,
                targetFrame: targetFrame
            };

            if (targetId !== null && targetId !== undefined && !targetSeen[String(targetId)]) {
                targetSeen[String(targetId)] = true;
                targetFramesToClear.push(targetFrame);
            }
        }
    }

    for (var c = 0; c < targetFramesToClear.length; c++) {
        clearTextFrameThreadLink(targetFramesToClear[c]);
    }

    var restored = 0;
    var recomposeStories = {};
    for (var sourceKey in frameMap) {
        if (!frameMap.hasOwnProperty(sourceKey)) continue;

        var mappedEntry = frameMap[sourceKey];
        var nextSourceFrame = null;
        try { nextSourceFrame = mappedEntry.sourceFrame.nextTextFrame; } catch (eNext) { nextSourceFrame = null; }
        if (!nextSourceFrame || !nextSourceFrame.isValid) continue;

        var nextSourceId = null;
        try { nextSourceId = nextSourceFrame.id; } catch (eNextId) { nextSourceId = null; }
        if (nextSourceId === null || nextSourceId === undefined) continue;

        var nextMappedEntry = frameMap[String(nextSourceId)];
        if (!nextMappedEntry || !nextMappedEntry.targetFrame || !nextMappedEntry.targetFrame.isValid) continue;

        try {
            mappedEntry.targetFrame.nextTextFrame = nextMappedEntry.targetFrame;
            restored++;

            var targetStory = getTextFrameStory(mappedEntry.targetFrame);
            if (targetStory) {
                var storyId = null;
                try { storyId = targetStory.id; } catch (eStoryId) { storyId = null; }
                if (storyId !== null && storyId !== undefined) recomposeStories[String(storyId)] = targetStory;
            }
        } catch (eLink) {}
    }

    for (var storyKey in recomposeStories) {
        if (!recomposeStories.hasOwnProperty(storyKey)) continue;
        try {
            if (recomposeStories[storyKey] && recomposeStories[storyKey].isValid && recomposeStories[storyKey].recompose) {
                recomposeStories[storyKey].recompose();
            }
        } catch (eRecompose) {}
    }

    return restored;
}

function collectUniqueTextStoriesFromItems(items) {
    var targets = [];
    var seenStoryIds = {};
    if (!items || items.length === 0) return targets;

    for (var i = 0; i < items.length; i++) {
        var frames = getThreadableTextFrames(items[i]);
        for (var f = 0; f < frames.length; f++) {
            var story = getTextFrameStory(frames[f]);
            if (!story) continue;

            var storyId = null;
            try { storyId = story.id; } catch (eId) { storyId = null; }
            if (storyId !== null && storyId !== undefined) {
                if (seenStoryIds[String(storyId)]) continue;
                seenStoryIds[String(storyId)] = true;
            }
            targets.push(story);
        }
    }

    return targets;
}

function findAndReplaceTextInStory(story, findString, replaceString) {
    if (!story || !findString || findString === "" || replaceString === undefined || replaceString === null) return false;
    try {
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
        app.findTextPreferences.findWhat = findString;
        var found = story.findText();
        if (!found || found.length === 0) return false;
        for (var i = 0; i < found.length; i++) {
            try { found[i].contents = replaceString; } catch (e) {}
        }
        return true;
    } catch (e) {
        return false;
    } finally {
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
    }
}

function normalizeInDesignText(text) {
    if (text === null || text === undefined) return text;
    return String(text).replace(/\r\n/g, '\r').replace(/\n/g, '\r');
}

function replacePageFrameSegmentText(page, frameIndex, oldText, newText) {
    if (!page || !oldText || oldText === "" || newText === undefined || newText === null) return false;
    var searchText = normalizeInDesignText(oldText);
    var replaceText = normalizeInDesignText(newText);
    try {
        var frames = page.textFrames.everyItem().getElements();
        if (frameIndex >= frames.length) return false;
        var targetFrame = frames[frameIndex];
        if (!targetFrame.isValid) return false;
        var frameScope = null;
        try { if (targetFrame.texts && targetFrame.texts.length > 0) frameScope = targetFrame.texts[0]; } catch (e) {}
        if (!frameScope) frameScope = getTextFrameStory(targetFrame);
        if (!frameScope) return false;

        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
        app.findTextPreferences.findWhat = searchText;
        app.changeTextPreferences.changeTo = replaceText;
        var changedRanges = frameScope.changeText();
        if (changedRanges && changedRanges.length > 0) {
            return true;
        }

        for (var i = 0; i < frames.length; i++) {
            var fallbackScope = null;
            try { if (frames[i].texts && frames[i].texts.length > 0) fallbackScope = frames[i].texts[0]; } catch (e) {}
            if (!fallbackScope) fallbackScope = getTextFrameStory(frames[i]);
            if (!fallbackScope) continue;
            app.findTextPreferences.findWhat = searchText;
            app.changeTextPreferences.changeTo = replaceText;
            changedRanges = fallbackScope.changeText();
            if (changedRanges && changedRanges.length > 0) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    } finally {
        try { app.findTextPreferences = NothingEnum.nothing; } catch (e) {}
        try { app.changeTextPreferences = NothingEnum.nothing; } catch (e) {}
    }
}

function getChangedTextSegment(oldText, newText) {
    if (oldText === newText) return null;
    var prefix = 0; var minLen = Math.min(oldText.length, newText.length);
    while (prefix < minLen && oldText.charAt(prefix) === newText.charAt(prefix)) prefix++;
    var oldRest = oldText.substring(prefix);
    var newRest = newText.substring(prefix);
    var suffix = 0; var minRest = Math.min(oldRest.length, newRest.length);
    while (suffix < minRest && oldRest.charAt(oldRest.length - 1 - suffix) === newRest.charAt(newRest.length - 1 - suffix)) suffix++;
    var oldSegment = oldRest.substring(0, oldRest.length - suffix);
    var newSegment = newRest.substring(0, newRest.length - suffix);
    if (oldSegment === "" && newSegment === "") return null;
    if (oldSegment === "") {
        oldSegment = oldRest;
        newSegment = newRest;
    }
    return { oldSegment: oldSegment, newSegment: newSegment };
}

function syncBDATextChanges(doc, config) {
    var sourcePages = getBDAOriginalPages(doc, config);
    if (!sourcePages || sourcePages.length === 0) {
        throw new Error(t("sync_no_source_pages"));
    }
    var prevSnapshotData = loadBDASnapshot(doc);
    var prevSnapshot = getBDASnapshotPages(prevSnapshotData);
    var currentSnapshot = buildBDASnapshotPayload(sourcePages);
    var currentSnapshotPages = currentSnapshot.pages;
    var forceGlossaryRefresh = false;
    if (prevSnapshotData) {
        forceGlossaryRefresh = (getBDASnapshotGlossaryVersion(prevSnapshotData) !== currentSnapshot.glossaryVersion);
    }
    if (!prevSnapshotData) {
        saveBDASnapshot(doc, currentSnapshot);
        return t("sync_state_saved");
    }

    var targetsByLang = getBDATargetPagesByLang(doc);
    var langCodes = [];
    for (var key in targetsByLang) {
        if (targetsByLang.hasOwnProperty(key)) {
            langCodes.push(key);
        }
    }
    if (langCodes.length === 0) {
        throw new Error(t("sync_no_target_pages"));
    }

    var changeBlocks = [];
    for (var p = 0; p < currentSnapshotPages.length; p++) {
        var currentItems = currentSnapshotPages[p] || [];
        var previousItems = prevSnapshot[p] || [];
        var maxItems = Math.max(currentItems.length, previousItems.length);
        for (var i = 0; i < maxItems; i++) {
            var currentSig = currentItems[i] || "";
            var previousSig = previousItems[i] || "";
            if (forceGlossaryRefresh || currentSig !== previousSig) {
                changeBlocks.push({ pageIndex: p, itemIndex: i });
            }
        }
    }

    if (changeBlocks.length === 0) {
        saveBDASnapshot(doc, currentSnapshot);
        return t("sync_no_changes");
    }

    var anyUpdated = false;

    for (var li = 0; li < langCodes.length; li++) {
        if (cancelFlag) throw new Error("CANCELLED");
        var langCode = langCodes[li];
        var targetPages = targetsByLang[langCode];
        targetPages.sort(function(a,b){ return a.documentOffset - b.documentOffset; });
        var deepLLang = getDeepLLangCode(langCode);
        var pendingReplacements = [];
        var reservedTargetItemIds = {};

        for (var bi = 0; bi < changeBlocks.length; bi++) {
            if (cancelFlag) throw new Error("CANCELLED");
            var block = changeBlocks[bi];
            var sourcePage = sourcePages[block.pageIndex];
            var targetPage = targetPages[block.pageIndex];
            if (!sourcePage || !targetPage) continue;

            var sourceItems = sourcePage.pageItems.everyItem().getElements();
            var targetItems = targetPage.pageItems.everyItem().getElements();
            if (block.itemIndex >= sourceItems.length) continue;

            var sourceItem = sourceItems[block.itemIndex];
            if (!sourceItem) continue;

            var candidateItems = [];
            for (var ti = 0; ti < targetItems.length; ti++) {
                var candidate = targetItems[ti];
                var candidateId = null;
                try { candidateId = candidate.id; } catch (eId) { candidateId = null; }
                if (candidateId !== null && reservedTargetItemIds[candidateId]) continue;
                candidateItems.push(candidate);
            }

            var oldTargetItem = findBestMatchingTargetItem(sourceItem, candidateItems, null);
            if (!oldTargetItem) continue;

            try {
                var duplicated = sourceItem.duplicate(targetPage);
                if (duplicated && duplicated.isValid) {
                    anyUpdated = true;
                    var oldTargetId = null;
                    var duplicatedId = null;
                    try { oldTargetId = oldTargetItem.id; } catch (eId2) { oldTargetId = null; }
                    try { duplicatedId = duplicated.id; } catch (eId3) { duplicatedId = null; }
                    if (oldTargetId !== null) reservedTargetItemIds[oldTargetId] = true;
                    if (duplicatedId !== null) reservedTargetItemIds[duplicatedId] = true;

                    try {
                        if (oldTargetItem.itemLayer && oldTargetItem.itemLayer.isValid) duplicated.itemLayer = oldTargetItem.itemLayer;
                    } catch (eLayer) {}
                    try {
                        if (duplicated.hasOwnProperty("geometricBounds") && oldTargetItem.hasOwnProperty("geometricBounds")) {
                            duplicated.geometricBounds = oldTargetItem.geometricBounds;
                        }
                    } catch (eBounds) {}

                    pendingReplacements.push({ sourceItem: sourceItem, oldItem: oldTargetItem, newItem: duplicated });
                }
            } catch (e) {}
        }

        if (pendingReplacements.length > 0) {
            var overallStartPct = 10 + (li / langCodes.length) * 85;
            var overallEndPct = 10 + ((li + 1) / langCodes.length) * 85;
            try {
                restoreTextFrameThreadingFromPairs(pendingReplacements);
                var replacementItems = [];
                for (var ri = 0; ri < pendingReplacements.length; ri++) {
                    if (pendingReplacements[ri] && pendingReplacements[ri].newItem) replacementItems.push(pendingReplacements[ri].newItem);
                }
                var targetTextObjArray = collectUniqueTextStoriesFromItems(replacementItems);
                if (targetTextObjArray.length > 0) {
                    updateProgress(10, t("sync_translate_changed", { lang: langCode.toUpperCase() }), overallStartPct, t("bda_language_progress", { current: (li + 1), total: langCodes.length, lang: langCode.toUpperCase() }));
                    executeTranslation(doc, targetTextObjArray, false, "", deepLLang, overallStartPct, overallEndPct);
                }

                for (var pr = 0; pr < pendingReplacements.length; pr++) {
                    var replacement = pendingReplacements[pr];
                    try {
                        if (replacement.newItem && replacement.newItem.isValid && replacement.oldItem && replacement.oldItem.isValid) {
                            replacement.newItem.move(LocationOptions.BEFORE, replacement.oldItem);
                        }
                    } catch (moveErr) {}
                    try { if (replacement.oldItem && replacement.oldItem.isValid) replacement.oldItem.remove(); } catch (removeErr) {}
                }
            } catch (syncError) {
                for (var cleanupIndex = pendingReplacements.length - 1; cleanupIndex >= 0; cleanupIndex--) {
                    var pending = pendingReplacements[cleanupIndex];
                    try { if (pending.newItem && pending.newItem.isValid) pending.newItem.remove(); } catch (cleanupErr) {}
                }
                throw syncError;
            }
        }
    }

    saveBDASnapshot(doc, currentSnapshot);
    return anyUpdated ? t("sync_updated", { count: changeBlocks.length }) : t("sync_no_changes");
}

function createFeedbackReport() {
    var folder = Folder.desktop;
    if (!folder || !folder.exists) folder = Folder.temp;
    var fileName = "SuperTranslatorPRO_FeedbackReport_" + (new Date().getTime()) + ".txt";
    var reportFile = new File(folder.fsName + "/" + fileName);
    try {
        reportFile.encoding = "UTF-8";
        if (reportFile.open("w")) {
            reportFile.writeln(SCRIPT_NAME + " Feedback Report");
            reportFile.writeln("Version: " + SCRIPT_VERSION);
            reportFile.writeln("Datum: " + new Date());
            reportFile.writeln("OS: " + ($.os || "unbekannt"));
            try { reportFile.writeln("InDesign-Version: " + app.version); } catch (e) { reportFile.writeln("InDesign-Version: unbekannt"); }
            try { reportFile.writeln("Dokument: " + (app.activeDocument ? app.activeDocument.name : "Kein Dokument offen")); } catch (e) { reportFile.writeln("Dokument: unbekannt"); }
            reportFile.writeln("Übersetzungsanbieter: " + getTranslationProviderDisplayName(getActiveTranslationProvider()));
            reportFile.writeln("DeepL-Key gesetzt: " + ((apiKey && apiKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("OpenAI-Key gesetzt: " + ((openAIKey && openAIKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("OpenAI-Modell: " + (openAIModel || "(leer)"));
            reportFile.writeln("Gemini-Key gesetzt: " + ((geminiKey && geminiKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("Gemini-Modell: " + (geminiModel || "(leer)"));
            reportFile.writeln("Claude-Key gesetzt: " + ((claudeKey && claudeKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("Claude-Modell: " + (claudeModel || "(leer)"));
            reportFile.writeln("Lokale Base URL: " + (localLLMBaseURL || "(leer)"));
            reportFile.writeln("Lokaler API-Key gesetzt: " + ((localLLMApiKey && localLLMApiKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("Lokales Modell: " + (localLLMModel || "(leer)"));
            reportFile.writeln("CSV-Pfad: " + (csvPath || "(leer)"));
            reportFile.writeln("TM-Pfad: " + (tmPath || "(leer)"));
            reportFile.writeln("Referenz-Symbole: " + (refSymbolsSetting || "[]"));
            reportFile.writeln("Formality: " + (formalitySetting || "default"));
            reportFile.writeln("DNT Styles: " + (dntStyles || "(leer)"));
            reportFile.writeln("Copyfit aktiv: " + (smartCopyfitEnabled ? "Ja" : "Nein"));
            reportFile.writeln("Copyfit Tracking bis: " + smartCopyfitMaxTracking);
            reportFile.writeln("Copyfit Scale bis: " + smartCopyfitMinScale + "%");
            reportFile.writeln("Copyfit Tracking-Schrittweite: " + smartCopyfitTrackingStep);
            reportFile.writeln("Copyfit Scale-Schrittweite: " + smartCopyfitScaleStep + "%");
            reportFile.writeln("Debug Tabellen/Bilder: " + (tableRestoreDebugEnabled ? "Ja" : "Nein"));
            reportFile.writeln("Debug-Log Pfad: " + debugLogPath);
            reportFile.writeln("\n--- Bitte hier beschreiben: \n");
            reportFile.close();
            alert(t("feedback_created", { path: reportFile.fsName }));
            try { reportFile.execute(); } catch (e) {}
        }
    } catch (e) {
        alert(t("feedback_failed", { message: e.message }));
    }
}

function serializeJSON(obj) {
    if (obj === null) return "null";
    if (typeof obj === "string") return '"' + obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"';
    if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
    if (obj instanceof Array) {
        var items = [];
        for (var i = 0; i < obj.length; i++) items.push(serializeJSON(obj[i]));
        return "[" + items.join(",") + "]";
    }
    var pairs = [];
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        pairs.push(serializeJSON(key) + ":" + serializeJSON(obj[key]));
    }
    return "{" + pairs.join(",") + "}";
}

function getMasterLang(masterName) {
    var normalized = String(masterName || "").replace(/^\s+|\s+$/g, "");
    var directCode = normalizeTranslationLanguageCode(normalized);
    if (isSupportedLegacyLanguageCode(directCode)) return directCode.toLowerCase();
    var match = findSupportedTranslationLanguageCodeMatch(normalized, true);
    return match ? match.code.toLowerCase() : null;
}

function getMasterPrefix(masterName) {
    var raw = String(masterName || "");
    var match = findSupportedTranslationLanguageCodeMatch(raw, true);
    if (!match) return raw;
    var prefixEnd = match.index;
    while (prefixEnd > 0 && !/[A-Za-z0-9]/.test(raw.charAt(prefixEnd - 1))) prefixEnd--;
    return raw.substring(0, prefixEnd);
}

function buildMasterTextSnapshot(doc) {
    var snapshot = {};
    var masterSpreads = doc.masterSpreads;
    for (var m = 0; m < masterSpreads.length; m++) {
        var master = masterSpreads[m];
        var pages = master.pages;
        var pagesData = [];
        for (var p = 0; p < pages.length; p++) {
            var texts = [];
            try {
                var frames = pages[p].textFrames.everyItem().getElements();
                for (var f = 0; f < frames.length; f++) {
                    var tf = frames[f];
                    try {
                        var story = null;
                        try { story = tf.parentStory; } catch (e) { story = null; }
                        if ((!story || !story.isValid) && tf.texts && tf.texts.length > 0) story = tf.texts[0];
                        if (story && story.isValid) texts.push(story.contents);
                    } catch (e) {}
                }
            } catch (e) {}
            pagesData.push(texts);
        }
        snapshot[master.name] = pagesData;
    }
    return snapshot;
}

function getRelatedTargetMasterSpreads(doc, sourceMasterName) {
    var sourcePrefix = getMasterPrefix(sourceMasterName);
    var result = [];
    var masterSpreads = doc.masterSpreads;
    for (var m = 0; m < masterSpreads.length; m++) {
        var masterName = masterSpreads[m].name;
        if (masterName === sourceMasterName) continue;
        if (getMasterPrefix(masterName) !== sourcePrefix) continue;
        var lang = getMasterLang(masterName);
        if (!lang || lang === "de") continue;
        result.push(masterSpreads[m]);
    }
    return result;
}

function getDeepLLangCode(code) {
    return getDefaultProviderTargetLangCode(code);
}

function replaceMasterFrameText(masterSpread, pageIndex, frameIndex, contents) {
    try {
        var page = masterSpread.pages[pageIndex];
        if (!page) return false;
        var frames = page.textFrames.everyItem().getElements();
        if (frameIndex >= frames.length) return false;
        var tf = frames[frameIndex];
        var story = null;
        try { story = tf.parentStory; } catch (e) { story = null; }
        if ((!story || !story.isValid) && tf.texts && tf.texts.length > 0) story = tf.texts[0];
        if (!story || !story.isValid) return false;
        story.contents = contents;
        if (story.characters && story.characters.length > 0) normalizePostTranslationSpacing(story);
        return true;
    } catch (e) { return false; }
}

function syncMasterTextChanges(doc) {
    var prevSnapshot = loadMasterSnapshot(doc);
    var currentSnapshot = buildMasterTextSnapshot(doc);
    var parsedGlossary = loadCSVGlossary(csvPath);
    var glossaryRuntimeByLang = {};
    var glossaryVersion = getGlossaryVersionToken(csvPath);
    var forceGlossaryRefresh = false;
    if (prevSnapshot) {
        forceGlossaryRefresh = ((prevSnapshot.__glossaryVersion || "") !== glossaryVersion);
    }
    currentSnapshot.__glossaryVersion = glossaryVersion;
    if (!prevSnapshot) {
        saveMasterSnapshot(doc, currentSnapshot);
        return;
    }
    var changesByLang = {};
    for (var masterName in currentSnapshot) {
        if (!currentSnapshot.hasOwnProperty(masterName)) continue;
        if (!masterName.match(/[-_]de(?:[-_]|$)/i)) continue;
        var currentPages = currentSnapshot[masterName];
        var previousPages = prevSnapshot[masterName] || [];
        for (var p = 0; p < currentPages.length; p++) {
            var currentFrames = currentPages[p] || [];
            var previousFrames = previousPages[p] || [];
            for (var f = 0; f < currentFrames.length; f++) {
                var currentText = currentFrames[f] || "";
                var previousText = previousFrames[f] || "";
                if (forceGlossaryRefresh || currentText !== previousText) {
                    var targets = getRelatedTargetMasterSpreads(doc, masterName);
                    for (var targetIndex = 0; targetIndex < targets.length; targetIndex++) {
                        var targetMaster = targets[targetIndex];
                        var lang = getMasterLang(targetMaster.name);
                        if (!lang) continue;
                        if (!changesByLang[lang]) changesByLang[lang] = [];
                        changesByLang[lang].push({ master: targetMaster, pageIndex: p, frameIndex: f, text: currentText });
                    }
                }
            }
        }
    }
    for (var langCode in changesByLang) {
        if (!changesByLang.hasOwnProperty(langCode)) continue;
        var blocks = changesByLang[langCode];
        if (blocks.length === 0) continue;
        var deepLLang = getDeepLLangCode(langCode);
        if (!glossaryRuntimeByLang[deepLLang]) glossaryRuntimeByLang[deepLLang] = buildGlossaryRuntime(parsedGlossary, deepLLang);
        var glossaryRuntime = glossaryRuntimeByLang[deepLLang];
        var texts = [];
        for (var b = 0; b < blocks.length; b++) texts.push(buildPlainTranslationXML(blocks[b].text, glossaryRuntime));
        var translated = translateBatchWithProvider(texts, deepLLang, 10, 20);
        if (!translated) continue;
        for (var b = 0; b < blocks.length; b++) {
            if (!translated[b]) continue;
            replaceMasterFrameText(blocks[b].master, blocks[b].pageIndex, blocks[b].frameIndex, decodeDeepLXMLText(translated[b]));
        }
    }
    saveMasterSnapshot(doc, currentSnapshot);
}

// --- 5B. TOC RÖNTGEN-UPDATE LOGIK ---
function updateTOCForLanguage(doc, langCode, newStartPage) {
    try {
        var page = doc.pages[0];
        var items = collectTOCTextEntries(page);
        var markerItem = null;
        for (var i = 0; i < items.length; i++) {
            if (extractTOCLanguageCodeFromItem(items[i]) === String(langCode || "").toUpperCase()) {
                markerItem = items[i];
                break;
            }
        }

        if (markerItem === null) return;

        var targetItem = findTOCPageTargetItem(items, markerItem);

        if (targetItem !== null) {
            var targetText = getHyperlinkTextObjectFromItemEntry(targetItem);
            if (!targetText || !targetText.isValid) return;
            var oldText = getTOCItemContents(targetItem);
            var newText = oldText.replace(/\([^()]*\)/, "(" + newStartPage + ")");
            targetText.contents = newText;
            createOrUpdateTOCLanguageHyperlink(doc, targetItem, langCode, newStartPage);
        }
    } catch(e) {}
}

function runAutomaticHyperlinksForBDA(doc, config) {
    if (!config || !config.autoReferenceLinks) return null;

    var pageMappings = collectCoverHyperlinkPageMappings(doc);
    if (!hasOwnMappings(pageMappings)) return null;

    var normalizedSymbols = normalizeRefSymbols(config.autoReferenceSymbols || refSymbolsSetting);
    saveHyperlinkSettings(normalizedSymbols);

    try {
        updateProgress(99, t("link_working"), 99, t("link_working"));
    } catch (progressErr) {}

    try {
        return linkPackageReferences(doc, normalizedSymbols, pageMappings, { throwOnNoMatches: false });
    } catch (e) {
        writeLog("Auto-Hyperlinks konnten nicht erstellt werden: " + (e.message || e), "WARNUNG");
    }
    return null;
}

function restoreParkedTablesAndImages(doc, storageEnv, globalParkedTables, globalParkedImages) {
    var unresolvedTables = [];
    var unresolvedImages = [];
    var unresolvedImageIds = {};
    var restoredImageIds = {};
    var leftoverMarkerCount = 0;
    writeDebugLog("restore:start parkedTables=" + globalParkedTables.length +
        " parkedImages=" + globalParkedImages.length +
        " storagePage=" + getDebugPageLabel(storageEnv ? storageEnv.page : null));
    try {
        if (storageEnv && storageEnv.frame && storageEnv.frame.isValid) {
            writeDebugLog("restore:storage frameValid=true storageItems=" + storageEnv.frame.allPageItems.length);
        } else {
            writeDebugLog("restore:storage frameValid=false", "WARNUNG");
        }
    } catch (storageInfoErr) {}
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
    } catch (prefErr) {}

    try {
        for (var i = globalParkedTables.length - 1; i >= 0; i--) {
            var parked = globalParkedTables[i];
            var tableRestored = false;
            app.findGrepPreferences.findWhat = "###TBL_\\s*" + parked.id + "\\s*###";
            var results = doc.findGrep();
            writeDebugLog("restore:table marker=" + parked.marker +
                " sourceKey=" + (parked.sourceKey || "") +
                " matches=" + results.length);
            if (results.length > 0) {
                try {
                    parked.frame.characters.item(0).move(LocationOptions.AFTER, results[0].insertionPoints.item(0));
                    results[0].remove();
                    tableRestored = true;
                    writeDebugLog("restore:table success marker=" + parked.marker);
                } catch (e1) {}
            }
            if (!tableRestored) {
                unresolvedTables.push(parked);
                writeLog("Tabellen-Platzhalter konnte nicht sicher wiederhergestellt werden (" + parked.marker + "). Die Tabelle bleibt im Layer TEMP_TRANS_IMAGES.", "WARNUNG");
                writeDebugLog("restore:table unresolved marker=" + parked.marker, "WARNUNG");
            } else {
                try { if (parked.frame && parked.frame.isValid) parked.frame.remove(); } catch (e3) {}
            }
        }

        try { if (storageEnv.frame && storageEnv.frame.isValid) storageEnv.frame.itemLayer.visible = true; } catch (e4) {}

        var restorePasses = 0;
        var restoreLimit = Math.max(10000, (globalParkedImages && globalParkedImages.length ? globalParkedImages.length * 4 : 0));
        while (restorePasses < restoreLimit) {
            app.findGrepPreferences.findWhat = "###IMG_\\s*\\d+\\s*###";
            var allFoundImages = doc.findGrep();
            if (!allFoundImages || allFoundImages.length === 0) break;
            writeDebugLog("restore:image pass=" + restorePasses + " placeholders=" + allFoundImages.length);

            var restoredOne = false;
            for (var f = allFoundImages.length - 1; f >= 0; f--) {
                var placeholderRange = allFoundImages[f];
                if (!placeholderRange || !placeholderRange.isValid) continue;

                var match = placeholderRange.contents.match(/IMG_\s*(\d+)/);
                if (!match) continue;

                var imgID = match[1];
                var targetImageInStorage = null;
                var storageItems = storageEnv.frame.allPageItems;
                for (var j = storageItems.length - 1; j >= 0; j--) {
                    if (storageItems[j].label === "TMP_IMG_" + imgID) {
                        targetImageInStorage = storageItems[j];
                        break;
                    }
                }
                writeDebugLog("restore:image marker=###IMG_" + imgID + "### storageFound=" + (targetImageInStorage !== null));
                if (targetImageInStorage === null) {
                    if (!unresolvedImageIds[imgID]) {
                        unresolvedImageIds[imgID] = true;
                        writeLog("Geparktes Bild/Objekt wurde im Temp-Speicher nicht gefunden (###IMG_" + imgID + "###).", "WARNUNG");
                    }
                    continue;
                }

                try {
                    var targetChar = targetImageInStorage.parent;
                    while (targetChar && targetChar.constructor.name !== "Character" && targetChar.constructor.name !== "Story" && targetChar.constructor.name !== "Application") targetChar = targetChar.parent;
                    if (targetChar && targetChar.constructor.name === "Character") {
                        targetChar.move(LocationOptions.AFTER, placeholderRange.insertionPoints.item(0));
                        placeholderRange.remove();
                        restoredImageIds[imgID] = true;
                        restoredOne = true;
                        writeDebugLog("restore:image success marker=###IMG_" + imgID + "### via=character");
                        break;
                    } else if (targetImageInStorage.parent && targetImageInStorage.parent.isValid) {
                        targetImageInStorage.parent.move(LocationOptions.AFTER, placeholderRange.insertionPoints.item(0));
                        placeholderRange.remove();
                        restoredImageIds[imgID] = true;
                        restoredOne = true;
                        writeDebugLog("restore:image success marker=###IMG_" + imgID + "### via=parent");
                        break;
                    }
                } catch (e5) {
                    if (!unresolvedImageIds[imgID]) {
                        unresolvedImageIds[imgID] = true;
                        writeLog("Bild/Objekt konnte nicht wiederhergestellt werden (###IMG_" + imgID + "###).", "WARNUNG");
                    }
                    writeDebugLog("restore:image failed marker=###IMG_" + imgID + "### error=" + (e5.message || e5), "WARNUNG");
                }
            }

            if (!restoredOne) {
                writeDebugLog("restore:image stalled pass=" + restorePasses + " no placeholder could be restored.", "WARNUNG");
                break;
            }
            restorePasses++;
        }

        if (globalParkedImages && globalParkedImages.length > 0) {
            for (var p = 0; p < globalParkedImages.length; p++) {
                var parkedImage = globalParkedImages[p];
                if (!parkedImage) continue;
                if (!restoredImageIds[parkedImage.id]) {
                    unresolvedImages.push(parkedImage);
                    if (!unresolvedImageIds[parkedImage.id]) {
                        unresolvedImageIds[parkedImage.id] = true;
                        writeLog("Bild/Objekt konnte nicht vollstaendig wiederhergestellt werden (" + parkedImage.marker + "). Es bleibt im Layer TEMP_TRANS_IMAGES.", "WARNUNG");
                    }
                }
            }
        }

        app.findGrepPreferences.findWhat = "###(?:IMG|TBL)_\\s*\\d+\\s*###";
        var leftoverMarkers = doc.findGrep();
        leftoverMarkerCount = leftoverMarkers ? leftoverMarkers.length : 0;
        if (leftoverMarkerCount > 0) {
            var markerSamples = [];
            for (var lm = 0; lm < leftoverMarkers.length && lm < 10; lm++) {
                var markerInfo = leftoverMarkers[lm].contents;
                try { markerInfo += " {" + getDebugMarkerLocation(leftoverMarkers[lm]) + "}"; } catch (markerInfoErr) {}
                markerSamples.push(markerInfo);
            }
            writeLog("Nach dem Restore verbleiben " + leftoverMarkerCount + " Platzhalter im Dokument" + (markerSamples.length ? ": " + markerSamples.join(", ") : "") + ".", "WARNUNG");
            writeDebugLog("restore:leftoverMarkers count=" + leftoverMarkerCount + (markerSamples.length ? " samples=" + markerSamples.join(", ") : ""), "WARNUNG");
        }
    } catch (restoreErr) {
        writeLog("Fehler beim Wiederherstellen von Tabellen/Bildern: " + (restoreErr.message || restoreErr), "WARNUNG");
        writeDebugLog("restore:error " + (restoreErr.message || restoreErr), "WARNUNG");
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (e6) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (e7) {}
        writeDebugLog("restore:end unresolvedTables=" + unresolvedTables.length +
            " unresolvedImages=" + unresolvedImages.length +
            " leftoverMarkers=" + leftoverMarkerCount);
        if (unresolvedTables.length === 0 && unresolvedImages.length === 0 && leftoverMarkerCount === 0) {
            try { if (storageEnv.frame && storageEnv.frame.isValid) storageEnv.frame.remove(); } catch (e8) {}
            try { doc.layers.itemByName("TEMP_TRANS_IMAGES").visible = false; } catch (e9) {}
        } else {
            try { if (storageEnv.frame && storageEnv.frame.isValid) storageEnv.frame.itemLayer.visible = true; } catch (e10) {}
            writeLog("TEMP_TRANS_IMAGES wurde beibehalten, da " + unresolvedTables.length + " Tabellen, " + unresolvedImages.length + " Bilder/Objekte und " + leftoverMarkerCount + " Platzhalter offen sind.", "WARNUNG");
        }
    }
}

function getSmartCopyfitTargetFrame(textFrame) {
    var targetFrame = textFrame;
    if (!targetFrame || !targetFrame.isValid) return null;
    try {
        var story = targetFrame.parentStory;
        if (story && story.isValid && story.textContainers && story.textContainers.length > 0) {
            for (var i = story.textContainers.length - 1; i >= 0; i--) {
                var container = story.textContainers[i];
                if (container && container.isValid && container.constructor && container.constructor.name === "TextFrame") {
                    targetFrame = container;
                    break;
                }
            }
        }
    } catch (e) {}
    return targetFrame;
}

function recomposeSmartCopyfitFrame(textFrame) {
    if (!textFrame || !textFrame.isValid) return;
    try {
        var story = textFrame.parentStory;
        if (story && story.isValid && story.recompose) {
            story.recompose();
            return;
        }
    } catch (e) {}
    try {
        if (textFrame.recompose) textFrame.recompose();
    } catch (e2) {}
}

function getSmartCopyfitRanges(textFrame) {
    if (!textFrame || !textFrame.isValid) return [];
    var textObj = null;
    try {
        if (textFrame.parentStory && textFrame.parentStory.isValid) textObj = textFrame.parentStory;
    } catch (e) { textObj = null; }
    if (!textObj) {
        try {
            if (textFrame.texts && textFrame.texts.length > 0 && textFrame.texts[0] && textFrame.texts[0].isValid) textObj = textFrame.texts[0];
        } catch (e2) { textObj = null; }
    }
    if (!textObj) return [];
    try { return textObj.textStyleRanges.everyItem().getElements(); } catch (e3) {}
    try { return textObj.textStyleRanges; } catch (e4) {}
    return [];
}

function applySmartCopyfit(textFrame) {
    var targetFrame = getSmartCopyfitTargetFrame(textFrame);
    var result = {
        attempted: false,
        changed: false,
        resolved: false,
        trackingSteps: 0,
        scaleSteps: 0,
        frameGrowthSteps: 0,
        frameId: null
    };
    if (!targetFrame || !targetFrame.isValid) return result;

    try { result.frameId = targetFrame.id; } catch (e0) {}

    if (!smartCopyfitEnabled) {
        writeDebugLog("copyfit:frame=" + (result.frameId !== null ? result.frameId : "?") + " disabled=1");
        return result;
    }

    var hasOverflow = false;
    try { hasOverflow = !!targetFrame.overflows; } catch (e1) { hasOverflow = false; }
    if (!hasOverflow) {
        result.resolved = true;
        return result;
    }

    result.attempted = true;

    var trackingStep = normalizeCopyfitTrackingStepSetting(smartCopyfitTrackingStep);
    var minTracking = normalizeCopyfitMaxTrackingSetting(smartCopyfitMaxTracking);
    var scaleStep = normalizeCopyfitScaleStepSetting(smartCopyfitScaleStep);
    var minScale = normalizeCopyfitMinScaleSetting(smartCopyfitMinScale);
    var frameGrowthStep = 5;
    var maxFrameGrowthSteps = 20;

    var refreshOverflow = function() {
        recomposeSmartCopyfitFrame(targetFrame);
        try { return !!targetFrame.overflows; } catch (overflowErr) { return false; }
    };

    var applyTrackingStep = function() {
        var changed = false;
        var ranges = getSmartCopyfitRanges(targetFrame);
        for (var i = 0; i < ranges.length; i++) {
            var currentTracking = 0;
            try { currentTracking = parseFloat(ranges[i].tracking); } catch (e2) { currentTracking = 0; }
            if (isNaN(currentTracking)) currentTracking = 0;
            if (currentTracking <= minTracking) continue;

            var nextTracking = currentTracking - trackingStep;
            if (nextTracking < minTracking) nextTracking = minTracking;
            if (nextTracking === currentTracking) continue;

            try {
                ranges[i].tracking = nextTracking;
                changed = true;
            } catch (trackingErr) {}
        }
        return changed;
    };

    var applyScaleStep = function() {
        var changed = false;
        var ranges = getSmartCopyfitRanges(targetFrame);
        for (var i = 0; i < ranges.length; i++) {
            var currentScale = 100;
            try { currentScale = parseFloat(ranges[i].horizontalScale); } catch (e3) { currentScale = 100; }
            if (isNaN(currentScale) || currentScale <= 0) currentScale = 100;
            if (currentScale <= minScale) continue;

            var nextScale = currentScale - scaleStep;
            if (nextScale < minScale) nextScale = minScale;
            if (nextScale === currentScale) continue;

            try {
                ranges[i].horizontalScale = nextScale;
                changed = true;
            } catch (scaleErr) {}
        }
        return changed;
    };

    var overflowStillExists = refreshOverflow();

    while (overflowStillExists) {
        var trackingChanged = applyTrackingStep();
        if (!trackingChanged) break;
        result.changed = true;
        result.trackingSteps++;
        overflowStillExists = refreshOverflow();
    }

    while (overflowStillExists) {
        var scaleChanged = applyScaleStep();
        if (!scaleChanged) break;
        result.changed = true;
        result.scaleSteps++;
        overflowStillExists = refreshOverflow();
    }

    var bounds = null;
    try { bounds = targetFrame.geometricBounds; } catch (e4) { bounds = null; }
    while (overflowStillExists && bounds && result.frameGrowthSteps < maxFrameGrowthSteps) {
        bounds[2] += frameGrowthStep;
        try {
            targetFrame.geometricBounds = bounds;
            result.changed = true;
            result.frameGrowthSteps++;
        } catch (frameErr) {
            break;
        }
        overflowStillExists = refreshOverflow();
    }

    result.resolved = !overflowStillExists;

    writeDebugLog(
        "copyfit:frame=" + (result.frameId !== null ? result.frameId : "?") +
        " overflowStart=1" +
        " enabled=1" +
        " trackingLimit=" + minTracking +
        " trackingStep=" + trackingStep +
        " scaleLimit=" + minScale +
        " scaleStep=" + scaleStep +
        " trackingSteps=" + result.trackingSteps +
        " scaleSteps=" + result.scaleSteps +
        " growthSteps=" + result.frameGrowthSteps +
        " resolved=" + result.resolved
    );

    if (!result.resolved) {
        writeLog("Textübersatz konnte nicht vollständig behoben werden (Rahmen " + (result.frameId !== null ? result.frameId : "?") + ").", "WARNUNG");
    }

    return result;
}

// --- 6. KERN-ÜBERSETZUNGS-LOGIK MIT TM, WÖRTERBUCH & SMART COPYFIT ---
function executeTranslation(doc, textTargetsRaw, pagesMode, pagesString, selectedLang, overStartPct, overEndPct) {
    var storageEnv = setupTempImageStorage(doc);
    var textTargets = [];
    var storyIds = {};
    var inDesignLangCode = String(selectedLang || "").toUpperCase(); 

    var tm = loadTM();
    if (!tm[selectedLang]) tm[selectedLang] = {};
    
    var glossaryRuntime = null;
    var glossaryMap = {};
    var glossaryRegex = null;
    var parsedGlossary = loadCSVGlossary(csvPath);

    if (parsedGlossary) {
        glossaryRuntime = buildGlossaryRuntime(parsedGlossary, selectedLang);
        glossaryMap = glossaryRuntime.map;
        glossaryRegex = glossaryRuntime.regex;
    }

    var addTarget = function(st) {
        try { if (!st || !st.isValid) return; } catch(e) { return; }
        var stId = null; try { stId = st.id; } catch(e) {}
        if (stId !== null && stId !== undefined) {
            if (!storyIds[stId]) { storyIds[stId] = true; textTargets.push(st); }
        } else { textTargets.push(st); }
    };

    if (pagesMode) {
        var pagesToProcess = getPagesFromString(doc, pagesString);
        for(var p=0; p<pagesToProcess.length; p++) {
            var pItems = pagesToProcess[p].allPageItems;
            for(var tf=0; tf<pItems.length; tf++) {
                if (pItems[tf].constructor.name === "TextFrame") {
                    var st; try { st = pItems[tf].parentStory; } catch(e) { st = pItems[tf].texts[0]; }
                    addTarget(st);
                }
            }
        }
    } else {
        for (var s = 0; s < textTargetsRaw.length; s++) addTarget(textTargetsRaw[s]);
    }

    writeDebugLog("executeTranslation:start lang=" + selectedLang +
        " pagesMode=" + pagesMode +
        " rawTargets=" + textTargetsRaw.length +
        " dedupedTargets=" + textTargets.length +
        " pageSpec=" + (pagesMode ? pagesString : "(selection)"));
    for (var targetDebugIndex = 0; targetDebugIndex < textTargets.length && targetDebugIndex < 20; targetDebugIndex++) {
        writeDebugLog("executeTranslation:target[" + targetDebugIndex + "] " + getDebugTextTargetLabel(textTargets[targetDebugIndex]));
    }
    if (textTargets.length > 20) writeDebugLog("executeTranslation:weitere Ziele=" + (textTargets.length - 20));

    var globalParkedTables = []; var globalParkedImages = []; var tableCounter = 0; var imageCounter = 0;

    try {
        for (var i = 0; i < textTargets.length; i++) {
            if (cancelFlag) throw new Error("CANCELLED");
            var currentText = textTargets[i];
            if (!currentText.isValid || currentText.characters.length === 0) continue;
            
            if (currentText.tables && currentText.tables.length > 0) {
                var tables = currentText.tables.everyItem().getElements();
                for (var tableReverseIndex = tables.length - 1; tableReverseIndex >= 0; tableReverseIndex--) {
                    var tbl = tables[tableReverseIndex]; var tblId = ++tableCounter; 
                    var marker = "###TBL_" + tblId + "###";
                    var tmpFrame = storageEnv.page.textFrames.add({itemLayer: storageEnv.layer, geometricBounds: [0,-100, 50, -50]});
                    var sourceKey = getTextObjectRangeKey(currentText);
                    writeDebugLog("table_park:start marker=" + marker +
                        " sourceKey=" + sourceKey +
                        " | " + getTableDebugSummary(tbl) +
                        " | " + getDebugTextTargetLabel(currentText));
                    
                    var p = tbl.storyOffset.parent; var idx = tbl.storyOffset.index;
                    p.characters.item(idx).move(LocationOptions.AFTER, tmpFrame.insertionPoints.item(0));
                    globalParkedTables.push({ id: tblId, marker: marker, frame: tmpFrame, sourceKey: sourceKey });
                    p.insertionPoints.item(idx).contents = marker;
                    
                    var pastedTbl = tmpFrame.tables[0];
                    if (pastedTbl) {
                        var cells = pastedTbl.cells.everyItem().getElements();
                        for (var c = 0; c < cells.length; c++) addTarget(cells[c].texts[0]);
                        writeDebugLog("table_park:done marker=" + marker + " nestedCellTargets=" + cells.length);
                    } else {
                        writeDebugLog("table_park:warning marker=" + marker + " pastedTbl fehlt nach dem Parken.", "WARNUNG");
                    }
                }
            }

            try {
                app.findTextPreferences = NothingEnum.nothing; app.changeTextPreferences = NothingEnum.nothing;
                app.findTextPreferences.findWhat = "^a"; 
                var foundAnchors = currentText.findText();
                for (var a = foundAnchors.length - 1; a >= 0; a--) {
                    var anchorChar = foundAnchors[a].characters[0]; var imgID = ++imageCounter; 
                    var marker = "###IMG_" + imgID + "###";
                    var imgLabel = "TMP_IMG_" + imgID;
                    var anchoredItem = null;
                    try {
                        if (anchorChar.pageItems.length > 0) anchoredItem = anchorChar.pageItems[0];
                        else if (anchorChar.allPageItems.length > 0) anchoredItem = anchorChar.allPageItems[0];
                    } catch (anchorLookupErr) { anchoredItem = null; }
                    if (!anchoredItem || !anchoredItem.isValid) {
                        writeLog("Verankertes Objekt konnte nicht sicher geparkt werden (" + marker + ").", "WARNUNG");
                        writeDebugLog("image_park:missing marker=" + marker + " | " + getDebugTextTargetLabel(currentText), "WARNUNG");
                        continue;
                    }
                    try {
                        anchoredItem.label = imgLabel;
                    } catch (anchorLabelErr) {
                        writeLog("Verankertes Objekt konnte nicht gelabelt werden (" + marker + ").", "WARNUNG");
                        writeDebugLog("image_park:label_failed marker=" + marker + " error=" + (anchorLabelErr.message || anchorLabelErr), "WARNUNG");
                        continue;
                    }
                    writeDebugLog("image_park:start marker=" + marker +
                        " label=" + imgLabel +
                        " type=" + anchoredItem.constructor.name +
                        " | " + getDebugTextTargetLabel(currentText));
                    
                    var p = anchorChar.parent; var idx = anchorChar.index;
                    anchorChar.move(LocationOptions.AFTER, storageEnv.frame.insertionPoints.item(-1));
                    p.insertionPoints.item(idx).contents = marker;
                    globalParkedImages.push({ id: imgID, marker: marker, label: imgLabel, sourceKey: getTextObjectRangeKey(currentText) });

                    try {
                        var sItems = storageEnv.frame.allPageItems; var movedItem = null;
                        for(var j = sItems.length - 1; j >= 0; j--){ if(sItems[j].label === imgLabel) { movedItem = sItems[j]; break; } }
                        if (movedItem) {
                            var safeAddNestedTarget = function(tfItem) { var nStory; try { nStory = tfItem.parentStory; } catch(e) { nStory = tfItem.texts[0]; } addTarget(nStory); };
                            if (movedItem.constructor.name === "TextFrame") safeAddNestedTarget(movedItem);
                            if (movedItem.hasOwnProperty("allPageItems")) {
                                var nestedItems = movedItem.allPageItems;
                                for (var ni = 0; ni < nestedItems.length; ni++) { if (nestedItems[ni].constructor.name === "TextFrame") safeAddNestedTarget(nestedItems[ni]); }
                            }
                        }
                    } catch(e) {}
                    writeDebugLog("image_park:done marker=" + marker + " label=" + imgLabel);
                }
            } catch (e) {}
        }

        writeDebugLog("parking:summary tables=" + globalParkedTables.length + " images=" + globalParkedImages.length + " targetsNow=" + textTargets.length);
    
    var buildXMLWithGlossary = function(textObj) {
        var xmlString = "<root>"; var ranges = textObj.textStyleRanges;
        for (var r = 0; r < ranges.length; r++) {
            var chunk = ranges[r].contents;
            var fFamily = "Arial"; try { fFamily = String(ranges[r].appliedFont.fontFamily); } catch(e) {}
            var fStyle = "Regular"; try { fStyle = String(ranges[r].fontStyle); } catch(e) {}
            var pSize = "12"; try { pSize = String(ranges[r].pointSize); } catch(e) {}
            var pStyleNameRaw = ""; try { pStyleNameRaw = String(ranges[r].appliedParagraphStyle.name); } catch(e) {}
            var ldingStr = "AUTO"; try { if (ranges[r].leading !== Leading.AUTO) ldingStr = String(ranges[r].leading); } catch(e) {}
            var fColor = ""; try { fColor = String(ranges[r].fillColor.name); } catch(e) {}
            var cStyleRaw = ""; try { cStyleRaw = String(ranges[r].appliedCharacterStyle.name); } catch(e) {}
            var pAlign = ""; try { pAlign = String(ranges[r].justification); } catch(e) {}
            var lInd = "0"; try { lInd = String(ranges[r].leftIndent); } catch(e) {}
            var fInd = "0"; try { fInd = String(ranges[r].firstLineIndent); } catch(e) {}
            var bList = ""; try { bList = String(ranges[r].bulletsAndNumberingListType); } catch(e) {}
            
            chunk = chunk.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
            chunk = chunk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            var dntArr = dntStyles.split(",");
            var isDNT = false;
            for (var d=0; d<dntArr.length; d++) {
                var trimDNT = dntArr[d].replace(/^\s+|\s+$/g, '');
                if (trimDNT !== "" && (trimDNT === pStyleNameRaw || trimDNT === cStyleRaw)) { isDNT = true; break; }
            }
            
            if (isDNT) {
                chunk = '<nt>' + chunk + '</nt>';
            } else {
                if (glossaryRegex) chunk = applyGlossaryRuntimeToChunk(chunk, { map: glossaryMap, regex: glossaryRegex });
                chunk = protectChunkNonTranslatables(chunk);
            }

            chunk = chunk.replace(/\r/g, '<pbr/>').replace(/\n/g, '<lbr/>').replace(/\t/g, '<tab/>');
            if (chunk !== "") {
                xmlString += '<t f="' + escapeXMLAttr(fFamily) + '" s="' + escapeXMLAttr(fStyle) + '" z="' + escapeXMLAttr(pSize) + '" p="' + escapeXMLAttr(pStyleNameRaw) + '" l="' + escapeXMLAttr(ldingStr) + '" c="' + escapeXMLAttr(fColor) + '" k="' + escapeXMLAttr(cStyleRaw) + '" a="' + escapeXMLAttr(pAlign) + '" li="' + escapeXMLAttr(lInd) + '" fi="' + escapeXMLAttr(fInd) + '" b="' + escapeXMLAttr(bList) + '">' + chunk + '</t>';
            }
        }
        return xmlString + "</root>";
    };

        var translationQueue = [];
        var finalTranslations = new Array(textTargets.length);
        var tmHitCount = 0;
        var exactGlossaryHitCount = 0;
        var emptyCount = 0;

        for (var i = 0; i < textTargets.length; i++) {
            if (!textTargets[i].isValid || textTargets[i].characters.length === 0) { finalTranslations[i] = ""; emptyCount++; continue; }

            var sourceContents = "";
            try { sourceContents = String(textTargets[i].contents); } catch (e0) { sourceContents = ""; }
            var glossaryMatchInText = glossaryAffectsText(sourceContents, glossaryRuntime);
            var exactGlossaryOverride = getExactGlossaryOverrideForText(parsedGlossary, sourceContents, selectedLang);
            if (exactGlossaryOverride !== null) {
                var exactReplacement = (exactGlossaryOverride === "###DNT###") ? sourceContents : exactGlossaryOverride;
                finalTranslations[i] = buildStyledPlainTextXML(textTargets[i], exactReplacement);
                globalStats.savedChars += normalizeGlossaryLookupText(sourceContents).replace(/[\s\d.,:;"'!?\-+*\/=()[\]{}&%$§<>|\\~`]/g, '').length;
                exactGlossaryHitCount++;
                continue;
            }
            
            var xml = buildXMLWithGlossary(textTargets[i]);
            var textOnlyLength = xml.replace(/<[^>]+>/g, '').replace(/###(?:IMG|TBL)_\d+###/g, '').replace(/[\s\d.,:;"'!?\-+*\/=()[\]{}&%$§<>|\\~`]/g, '').length; 
            
            if (xml === "<root></root>" || xml === "" || textOnlyLength === 0) { 
                finalTranslations[i] = ""; 
                emptyCount++;
            } else if (!glossaryMatchInText && tm[selectedLang][xml]) {
                finalTranslations[i] = normalizeStructuredXMLCandidate(tm[selectedLang][xml], xml);
                globalStats.savedChars += textOnlyLength;
                tmHitCount++;
            } else {
                translationQueue.push({ index: i, xml: xml, len: textOnlyLength });
                finalTranslations[i] = null;
            }
        }
        writeDebugLog("translation:summary exactGlossaryHits=" + exactGlossaryHitCount +
            " tmHits=" + tmHitCount +
            " provider=" + getActiveTranslationProvider() +
            " translationQueue=" + translationQueue.length +
            " emptyTargets=" + emptyCount);
        
        if (translationQueue.length > 0) {
            var justXMLs = [];
            for(var q=0; q < translationQueue.length; q++) justXMLs.push(translationQueue[q].xml);
            
            var translatedBatch = translateBatchWithProvider(justXMLs, selectedLang, overStartPct, overEndPct);
            if (!translatedBatch || translatedBatch.length !== translationQueue.length) {
                throw new Error(t(getProviderStringKey(getActiveTranslationProvider(), "incomplete")));
            }

            var tmUpdated = false;
            var tmDelta = {};
            tmDelta[selectedLang] = {};
            for(var q=0; q < translationQueue.length; q++) {
                var trXML = translatedBatch[q];
                if (trXML) { 
                    trXML = normalizeStructuredXMLCandidate(trXML, translationQueue[q].xml);
                    finalTranslations[translationQueue[q].index] = trXML;
                    tm[selectedLang][translationQueue[q].xml] = trXML;
                    tmDelta[selectedLang][translationQueue[q].xml] = trXML;
                    tmUpdated = true;
                    globalStats.apiChars += translationQueue[q].len;
                }
            }
            if (tmUpdated) saveTMDelta(tmDelta); 
        }
        
        var formatPct = overStartPct + ((overEndPct - overStartPct) * 0.9);
        updateProgress(90, t("applying_formatting"), formatPct, null);
        for (var i = 0; i < textTargets.length; i++) {
            if (cancelFlag) throw new Error("CANCELLED");
            if (finalTranslations[i]) applyXMLtoInDesign(textTargets[i], finalTranslations[i], inDesignLangCode);
        }

        updateProgress(95, t("restoring_tables_images"), overEndPct, null);
    } finally {
        restoreParkedTablesAndImages(doc, storageEnv, globalParkedTables, globalParkedImages);
    }

    updateProgress(98, t("checking_overflow"), overEndPct, null);
    var checkedCopyfitKeys = {};
    for (var i = 0; i < textTargets.length; i++) {
        var st = textTargets[i];
        if (!st || !st.isValid) continue;
        var tFrames = [];
        try {
            if (st.constructor.name === "Story") tFrames = st.textContainers;
            else if (st.parentTextFrames) tFrames = st.parentTextFrames;
        } catch(e) {}
        
        for (var j = 0; j < tFrames.length; j++) {
            var tf = tFrames[j];
            if (tf && tf.isValid && tf.constructor.name === "TextFrame") {
                var copyfitFrame = getSmartCopyfitTargetFrame(tf);
                if (!copyfitFrame || !copyfitFrame.isValid) copyfitFrame = tf;

                var copyfitKey = "";
                try {
                    if (copyfitFrame.parentStory && copyfitFrame.parentStory.isValid) copyfitKey = "story:" + copyfitFrame.parentStory.id;
                } catch (e2) { copyfitKey = ""; }
                if (copyfitKey === "") {
                    try { copyfitKey = "frame:" + copyfitFrame.id; } catch (e3) { copyfitKey = "frame:" + i + ":" + j; }
                }

                if (!checkedCopyfitKeys[copyfitKey]) {
                    checkedCopyfitKeys[copyfitKey] = true;
                    var copyfitResult = applySmartCopyfit(copyfitFrame);
                    if (copyfitResult.attempted && copyfitResult.resolved) globalStats.fittedFrames++;
                }
            }
        }
    }
}

// === HILFSFUNKTIONEN FÜR DEEPL & CO ===
function extractDeepLFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.message) msg = parsedObj.message;
        else if (parsedObj && parsedObj.detail) msg = parsedObj.detail;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("deepl_unknown_response");
    return msg;
}

function isDeepLPayloadTooLargeMessage(message) {
    var normalized = String(message || "").toLowerCase();
    if (normalized === "") return false;
    return normalized.indexOf("payload too large") !== -1 ||
           normalized.indexOf("request entity too large") !== -1 ||
           normalized.indexOf("content too large") !== -1 ||
           normalized.indexOf("request body too large") !== -1 ||
           normalized.indexOf("413") !== -1;
}

function buildDeepLBatchPayload(textsArray, startIndex, targetLangCode, includeXMLHandling, maxPayloadLen, maxBatchSize) {
    var payloadStr = "target_lang=" + targetLangCode;
    if (includeXMLHandling) payloadStr += "&tag_handling=xml&ignore_tags=tab,nt&splitting_tags=pbr,lbr";
    if (formalitySetting === "more" || formalitySetting === "less") {
        payloadStr += "&formality=" + formalitySetting;
    }

    var endBatch = startIndex;
    var currentPayloadLen = payloadStr.length;
    var payloadLimit = (maxPayloadLen && maxPayloadLen > 0) ? maxPayloadLen : 45000;
    var batchLimit = (maxBatchSize && maxBatchSize > 0) ? maxBatchSize : 10;

    for (var j = startIndex; j < textsArray.length && (j - startIndex) < batchLimit; j++) {
        var safeText = textsArray[j];
        if (safeText === null || safeText === undefined) safeText = "";
        var addedStr = "&text=" + encodeURIComponent(String(safeText));
        if (j > startIndex && (currentPayloadLen + addedStr.length > payloadLimit)) break;
        currentPayloadLen += addedStr.length;
        endBatch = j + 1;
        payloadStr += addedStr;
    }

    return {
        payloadStr: payloadStr,
        endBatch: endBatch,
        payloadLen: currentPayloadLen
    };
}

function getDeepLSinglePayloadLength(text, targetLangCode, includeXMLHandling) {
    var batch = buildDeepLBatchPayload([text], 0, targetLangCode, includeXMLHandling, 2147483647, 1);
    return batch.payloadLen;
}

function getStructuredXMLRunDescriptors(xml) {
    var runs = [];
    var raw = normalizeTranslatedXML(xml);
    var body = String(raw || "").replace(/^\s*<root>/i, "").replace(/<\/root>\s*$/i, "");
    var regex = /(<t\b[^>]*>)([\s\S]*?)(<\/t>)/gi;
    var match = null;
    while ((match = regex.exec(body)) !== null) {
        runs.push({
            openTag: match[1],
            innerXML: String(match[2] || ""),
            closeTag: match[3]
        });
    }
    return runs;
}

function buildStructuredXMLFromRuns(runDescriptors) {
    var body = "";
    for (var i = 0; i < runDescriptors.length; i++) {
        body += runDescriptors[i].openTag + runDescriptors[i].innerXML + runDescriptors[i].closeTag;
    }
    return "<root>" + body + "</root>";
}

function isEscapedEntityOpenAt(text, boundaryIndex) {
    var inside = false;
    var raw = String(text || "");
    for (var i = 0; i < boundaryIndex && i < raw.length; i++) {
        var ch = raw.charAt(i);
        if (ch === "&") inside = true;
        else if (ch === ";" && inside) inside = false;
    }
    return inside;
}

function isStructuredRunPieceWithinDeepLLimit(openTag, innerXML, closeTag, targetLangCode, payloadLimit) {
    var xml = "<root>" + openTag + String(innerXML || "") + closeTag + "</root>";
    return getDeepLSinglePayloadLength(xml, targetLangCode, true) <= payloadLimit;
}

function findForcedEscapedTextSplitIndex(text, openTag, closeTag, targetLangCode, payloadLimit) {
    var raw = String(text || "");
    var low = 1;
    var high = raw.length;
    var best = 0;

    while (low <= high) {
        var mid = Math.floor((low + high) / 2);
        if (isStructuredRunPieceWithinDeepLLimit(openTag, raw.substring(0, mid), closeTag, targetLangCode, payloadLimit)) {
            best = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    if (best <= 0) return 0;

    var boundary = best;
    while (boundary > 0 && isEscapedEntityOpenAt(raw, boundary)) boundary--;
    if (boundary <= 0) boundary = best;

    var preferredBoundary = boundary;
    var minScan = Math.max(1, boundary - 80);
    for (var i = boundary; i >= minScan; i--) {
        if (isEscapedEntityOpenAt(raw, i)) continue;
        if (/[\s,.;:!?)]/.test(raw.charAt(i - 1))) {
            preferredBoundary = i;
            break;
        }
    }

    return preferredBoundary;
}

function splitEscapedTextForDeepL(text, openTag, closeTag, targetLangCode, payloadLimit) {
    var parts = [];
    var remaining = String(text || "");

    while (remaining !== "") {
        if (isStructuredRunPieceWithinDeepLLimit(openTag, remaining, closeTag, targetLangCode, payloadLimit)) {
            parts.push(remaining);
            break;
        }

        var tokens = remaining.split(/(\s+)/);
        var current = "";
        var consumed = 0;
        for (var i = 0; i < tokens.length; i++) {
            var token = String(tokens[i] || "");
            if (token === "") continue;
            var candidate = current + token;
            if (!isStructuredRunPieceWithinDeepLLimit(openTag, candidate, closeTag, targetLangCode, payloadLimit)) break;
            current = candidate;
            consumed += token.length;
        }

        if (consumed <= 0) {
            consumed = findForcedEscapedTextSplitIndex(remaining, openTag, closeTag, targetLangCode, payloadLimit);
        }

        if (consumed <= 0 || consumed >= remaining.length) {
            throw new Error("DeepL-Fehler: Ein einzelner Textabschnitt ist selbst nach dem Aufteilen zu gross.");
        }

        parts.push(remaining.substring(0, consumed));
        remaining = remaining.substring(consumed);
    }

    return parts;
}

function tokenizeStructuredRunInnerXML(innerXML) {
    var tokens = [];
    var raw = String(innerXML || "");
    var regex = /<nt>[\s\S]*?<\/nt>|<(?:pbr|lbr|tab)\s*\/>/gi;
    var lastIndex = 0;
    var match = null;

    while ((match = regex.exec(raw)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({ type: "text", value: raw.substring(lastIndex, match.index) });
        }
        tokens.push({
            type: /^<nt>/i.test(match[0]) ? "nt" : "tag",
            value: match[0]
        });
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < raw.length) tokens.push({ type: "text", value: raw.substring(lastIndex) });
    return tokens;
}

function splitStructuredRunInnerForDeepL(openTag, innerXML, closeTag, targetLangCode, payloadLimit) {
    if (isStructuredRunPieceWithinDeepLLimit(openTag, innerXML, closeTag, targetLangCode, payloadLimit)) {
        return [String(innerXML || "")];
    }

    var tokens = tokenizeStructuredRunInnerXML(innerXML);
    if (tokens.length === 0) return [String(innerXML || "")];

    var parts = [];
    var current = "";

    var appendAtomicToken = function(tokenValue, allowTextSplit) {
        var value = String(tokenValue || "");
        if (value === "") return;

        if (allowTextSplit) {
            var textParts = splitEscapedTextForDeepL(value, openTag, closeTag, targetLangCode, payloadLimit);
            for (var tp = 0; tp < textParts.length; tp++) appendAtomicToken(textParts[tp], false);
            return;
        }

        if (current !== "" && isStructuredRunPieceWithinDeepLLimit(openTag, current + value, closeTag, targetLangCode, payloadLimit)) {
            current += value;
            return;
        }

        if (current !== "") {
            parts.push(current);
            current = "";
        }

        if (!isStructuredRunPieceWithinDeepLLimit(openTag, value, closeTag, targetLangCode, payloadLimit)) {
            throw new Error("DeepL-Fehler: Ein geschuetzter XML-Abschnitt ist fuer einen Einzelaufruf zu gross.");
        }

        current = value;
    };

    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].type === "text") appendAtomicToken(tokens[i].value, true);
        else appendAtomicToken(tokens[i].value, false);
    }

    if (current !== "") parts.push(current);
    return parts;
}

function buildStructuredXMLSegmentsForDeepL(sourceXML, targetLangCode, payloadLimit) {
    var runs = getStructuredXMLRunDescriptors(sourceXML);
    if (runs.length === 0) {
        throw new Error("DeepL-Fehler: Der XML-Block konnte nicht in Formatlaeufe zerlegt werden.");
    }

    var units = [];
    for (var r = 0; r < runs.length; r++) {
        var innerParts = splitStructuredRunInnerForDeepL(runs[r].openTag, runs[r].innerXML, runs[r].closeTag, targetLangCode, payloadLimit);
        for (var p = 0; p < innerParts.length; p++) {
            units.push({
                runIndex: r,
                openTag: runs[r].openTag,
                innerXML: innerParts[p],
                closeTag: runs[r].closeTag
            });
        }
    }

    var segments = [];
    var currentUnits = [];

    for (var u = 0; u < units.length; u++) {
        var probeUnits = currentUnits.concat([units[u]]);
        var probeXML = buildStructuredXMLFromRuns(probeUnits);
        if (currentUnits.length > 0 && getDeepLSinglePayloadLength(probeXML, targetLangCode, true) > payloadLimit) {
            segments.push({
                sourceUnits: currentUnits,
                xml: buildStructuredXMLFromRuns(currentUnits)
            });
            currentUnits = [];
        }

        currentUnits.push(units[u]);
        if (getDeepLSinglePayloadLength(buildStructuredXMLFromRuns(currentUnits), targetLangCode, true) > payloadLimit) {
            throw new Error("DeepL-Fehler: Ein XML-Teilsegment ueberschreitet weiterhin die zulassige Request-Groesse.");
        }
    }

    if (currentUnits.length > 0) {
        segments.push({
            sourceUnits: currentUnits,
            xml: buildStructuredXMLFromRuns(currentUnits)
        });
    }

    if (segments.length <= 1 && units.length <= 1) {
        throw new Error("DeepL-Fehler: Der uebergrosse XML-Block konnte nicht sinnvoll aufgeteilt werden.");
    }

    writeDebugLog("deepl:segment_block runs=" + runs.length + " units=" + units.length + " segments=" + segments.length + " payloadLimit=" + payloadLimit);

    return {
        runs: runs,
        segments: segments
    };
}

function translateOversizedStructuredXMLBlockDeepL(sourceXML, targetLangCode, overStartPct, overEndPct, payloadLimit) {
    var safePayloadLimit = (payloadLimit && payloadLimit > 0) ? payloadLimit : 45000;
    var segmented = buildStructuredXMLSegmentsForDeepL(sourceXML, targetLangCode, safePayloadLimit);
    var segmentXMLs = [];
    for (var i = 0; i < segmented.segments.length; i++) segmentXMLs.push(segmented.segments[i].xml);

    var translatedSegments = translateBatchDeepL(segmentXMLs, targetLangCode, overStartPct, overEndPct);
    if (!translatedSegments || translatedSegments.length !== segmented.segments.length) {
        throw new Error("DeepL-Fehler: Die segmentierte Uebersetzung ist unvollstaendig.");
    }

    var rebuiltRuns = [];
    for (var r = 0; r < segmented.runs.length; r++) {
        rebuiltRuns.push({
            openTag: segmented.runs[r].openTag,
            innerXML: "",
            closeTag: segmented.runs[r].closeTag
        });
    }

    for (var s = 0; s < segmented.segments.length; s++) {
        var translatedRuns = getStructuredXMLRunDescriptors(translatedSegments[s]);
        var expectedUnits = segmented.segments[s].sourceUnits;
        if (translatedRuns.length !== expectedUnits.length) {
            throw new Error("DeepL-Fehler: Ein Teilsegment kam mit unerwarteter XML-Struktur zurueck.");
        }
        for (var u = 0; u < expectedUnits.length; u++) {
            rebuiltRuns[expectedUnits[u].runIndex].innerXML += translatedRuns[u].innerXML;
        }
    }

    var rebuiltXML = normalizeStructuredXMLCandidate(buildStructuredXMLFromRuns(rebuiltRuns), sourceXML);
    if (!validateStructuredXMLTranslation(sourceXML, rebuiltXML)) {
        throw new Error("DeepL-Fehler: Die segmentierte Uebersetzung konnte nicht als gueltiges XML rekonstruiert werden.");
    }

    return rebuiltXML;
}

function compareStringArrays(arrA, arrB) {
    if (arrA.length !== arrB.length) return false;
    for (var i = 0; i < arrA.length; i++) {
        if (String(arrA[i]) !== String(arrB[i])) return false;
    }
    return true;
}

function stripMarkdownCodeFence(text) {
    var raw = String(text || "").replace(/^\s+|\s+$/g, "");
    if (/^```/.test(raw)) {
        raw = raw.replace(/^```[a-z0-9_-]*\s*/i, "").replace(/\s*```$/i, "");
    }
    return raw.replace(/^\s+|\s+$/g, "");
}

function canonicalizeTTagAttributes(xml) {
    var order = { f: 0, s: 1, z: 2, p: 3, l: 4, c: 5, k: 6, a: 7, li: 8, fi: 9, b: 10 };
    return String(xml || "").replace(/<t\b([^>]*)>/gi, function(fullMatch, attrText) {
        var attrs = [];
        var match = null;
        var regex = /([a-z]+)\s*=\s*"([^"]*)"/gi;
        while ((match = regex.exec(attrText)) !== null) {
            attrs.push({ name: String(match[1] || "").toLowerCase(), value: String(match[2] || "") });
        }
        if (attrs.length === 0) return "<t>";
        attrs.sort(function(a, b) {
            var aOrder = order.hasOwnProperty(a.name) ? order[a.name] : 100;
            var bOrder = order.hasOwnProperty(b.name) ? order[b.name] : 100;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
        });
        var parts = [];
        for (var i = 0; i < attrs.length; i++) {
            parts.push(attrs[i].name + '="' + attrs[i].value + '"');
        }
        return "<t " + parts.join(" ") + ">";
    });
}

function normalizeStructuredXMLCandidate(xml, sourceXML) {
    var raw = stripMarkdownCodeFence(xml);
    raw = raw.replace(/<\?xml[\s\S]*?\?>/gi, "");
    raw = raw.replace(/<(tab|pbr|lbr)\s*>\s*<\/\1>/gi, function(fullMatch, tagName) {
        return "<" + String(tagName || "").toLowerCase() + "/>";
    });
    raw = raw.replace(/<(tab|pbr|lbr)\s*\/\s*>/gi, function(fullMatch, tagName) {
        return "<" + String(tagName || "").toLowerCase() + "/>";
    });
    raw = raw.replace(/<(\/?)root\b[^>]*>/gi, function(fullMatch, slash) {
        return slash ? "</root>" : "<root>";
    });
    raw = raw.replace(/<(\/?)nt\b[^>]*>/gi, function(fullMatch, slash) {
        return slash ? "</nt>" : "<nt>";
    });
    raw = raw.replace(/<\/t\b[^>]*>/gi, "</t>");
    raw = canonicalizeTTagAttributes(raw);
    if (sourceXML && /<root>/i.test(String(sourceXML)) && !/<root>/i.test(raw) && /<t\b/i.test(raw)) {
        raw = "<root>" + raw + "</root>";
    }
    raw = preserveRunBoundaryWhitespace(sourceXML, raw);
    return normalizeTranslatedXML(raw);
}

function getXMLTagTokens(xml) {
    var matches = String(xml || "").match(/<[^>]+>/g);
    return matches ? matches : [];
}

function getNoTranslateSegments(xml) {
    var matches = [];
    var regex = /<nt>([\s\S]*?)<\/nt>/g;
    var match = null;
    var raw = String(xml || "");
    while ((match = regex.exec(raw)) !== null) matches.push(match[1]);
    return matches;
}

function getProtectedMarkerTokens(xml) {
    var matches = String(xml || "").match(/###(?:IMG|TBL)_\d+###/g);
    return matches ? matches : [];
}

function validateStructuredXMLTranslation(sourceXML, translatedXML) {
    var sourceNorm = normalizeStructuredXMLCandidate(sourceXML, sourceXML);
    var translatedNorm = normalizeStructuredXMLCandidate(translatedXML, sourceXML);
    if (sourceNorm === "" || translatedNorm === "") return false;
    if (!compareStringArrays(getXMLTagTokens(sourceNorm), getXMLTagTokens(translatedNorm))) return false;
    if (!compareStringArrays(getNoTranslateSegments(sourceNorm), getNoTranslateSegments(translatedNorm))) return false;
    if (!compareStringArrays(getProtectedMarkerTokens(sourceNorm), getProtectedMarkerTokens(translatedNorm))) return false;
    return true;
}

function extractOpenAIFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.error && parsedObj.error.message) msg = parsedObj.error.message;
        else if (parsedObj && parsedObj.message) msg = parsedObj.message;
        else if (parsedObj && parsedObj.status && parsedObj.status !== "completed") msg = "status=" + parsedObj.status;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("openai_unknown_response");
    return msg;
}

function extractOpenAIOutputText(parsedObj) {
    try {
        if (parsedObj && parsedObj.output_text) return String(parsedObj.output_text);
    } catch (e) {}

    var parts = [];
    var output = (parsedObj && parsedObj.output) ? parsedObj.output : [];
    for (var i = 0; i < output.length; i++) {
        var message = output[i];
        var content = (message && message.content) ? message.content : [];
        for (var j = 0; j < content.length; j++) {
            var item = content[j];
            if (!item) continue;
            if (item.type === "refusal") {
                throw new Error(t("openai_refusal", { message: (item.refusal || t("openai_unknown_response")) }));
            }
            if (item.type === "output_text" && item.text !== undefined && item.text !== null) {
                parts.push(String(item.text));
            }
        }
    }
    return parts.join("");
}

function buildStructuredBatchTranslationPrompt(textsArray, targetLangCode) {
    var prompt = "";
    prompt += "Target language code: " + targetLangCode + "\n";
    prompt += "Translate each XML fragment into the target language.\n";
    prompt += "Preserve every XML tag and every attribute exactly as provided.\n";
    prompt += "Only translate human-readable text nodes.\n";
    prompt += "Do not translate or alter text inside <nt>...</nt>.\n";
    prompt += "Do not change placeholders like ###IMG_1### or ###TBL_1###.\n";
    prompt += "Keep entities and structure such as <root>, <t>, <tab/>, <pbr/>, and <lbr/> unchanged.\n";
    if (formalitySetting === "more") prompt += "Use a formal and polite register where the target language supports it.\n";
    else if (formalitySetting === "less") prompt += "Use an informal and direct register where the target language supports it.\n";
    else prompt += "Use the most natural default register for the target language.\n";
    prompt += "Return JSON only with a translations array that has the same order and length as the input.\n\n";
    for (var i = 0; i < textsArray.length; i++) {
        prompt += "[" + (i + 1) + "]\n" + String(textsArray[i] || "") + "\n\n";
    }
    return prompt;
}

function buildOpenAITranslationPrompt(textsArray, targetLangCode) {
    return buildStructuredBatchTranslationPrompt(textsArray, targetLangCode);
}

function buildStructuredRepairPrompt(sourceXML, candidateXML, targetLangCode) {
    var prompt = "";
    prompt += "Target language code: " + targetLangCode + "\n";
    prompt += "You will receive a source XML fragment and a candidate translation.\n";
    prompt += "Repair the candidate so that it matches the exact XML/tag/attribute structure of the source.\n";
    prompt += "Keep the translated wording from the candidate where possible.\n";
    prompt += "Do not translate or alter text inside <nt>...</nt>.\n";
    prompt += "Do not change placeholders like ###IMG_1### or ###TBL_1###.\n";
    prompt += "Use exactly the same tags and attributes as the source, including <root>, <t>, <tab/>, <pbr/>, and <lbr/>.\n";
    prompt += "Return JSON only with one property named translation.\n\n";
    prompt += "[SOURCE]\n" + String(sourceXML || "") + "\n\n";
    prompt += "[CANDIDATE]\n" + String(candidateXML || "") + "\n";
    return prompt;
}

function buildOpenAIRepairPrompt(sourceXML, candidateXML, targetLangCode) {
    return buildStructuredRepairPrompt(sourceXML, candidateXML, targetLangCode);
}

function buildStructuredSingleTranslationPrompt(sourceXML, targetLangCode) {
    var prompt = "";
    prompt += "Target language code: " + targetLangCode + "\n";
    prompt += "Translate this single XML fragment into the target language.\n";
    prompt += "Preserve every XML tag and every attribute exactly as provided.\n";
    prompt += "Only translate human-readable text nodes.\n";
    prompt += "Do not translate or alter text inside <nt>...</nt>.\n";
    prompt += "Do not change placeholders like ###IMG_1### or ###TBL_1###.\n";
    prompt += "Keep entities and structure such as <root>, <t>, <tab/>, <pbr/>, and <lbr/> unchanged.\n";
    if (formalitySetting === "more") prompt += "Use a formal and polite register where the target language supports it.\n";
    else if (formalitySetting === "less") prompt += "Use an informal and direct register where the target language supports it.\n";
    else prompt += "Use the most natural default register for the target language.\n";
    prompt += "Return JSON only with one property named translation.\n\n";
    prompt += String(sourceXML || "") + "\n";
    return prompt;
}

function buildOpenAISingleTranslationPrompt(sourceXML, targetLangCode) {
    return buildStructuredSingleTranslationPrompt(sourceXML, targetLangCode);
}

function getBatchTranslationJSONSchema() {
    return {
        type: "object",
        properties: {
            translations: {
                type: "array",
                items: { type: "string" }
            }
        },
        required: ["translations"],
        additionalProperties: false
    };
}

function getSingleTranslationJSONSchema() {
    return {
        type: "object",
        properties: {
            translation: { type: "string" }
        },
        required: ["translation"],
        additionalProperties: false
    };
}

function requestOpenAIResponseObject(payloadObj) {
    var endpoint = "https://api.openai.com/v1/responses";
    var payloadFile = new File(Folder.temp + "/oai_pay_" + new Date().getTime() + ".json");
    var outFile = null;
    payloadFile.encoding = "UTF-8";
    payloadFile.open("w");
    payloadFile.write(serializeJSON(payloadObj));
    payloadFile.close();

    try {
        var resultJSON = "";
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Content-Type: application/json' -H 'Authorization: Bearer " + openAIKey + "' --data-binary @'" + payloadFile.fsName + "'";
            resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            outFile = new File(Folder.temp + "/oai_out_" + new Date().getTime() + ".json");
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Content-Type: application/json"" -H ""Authorization: Bearer ' + openAIKey + '"" --data-binary @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultJSON = outFile.read();
                outFile.close();
                try { outFile.remove(); } catch (outRemoveErr) {}
                outFile = null;
            }
        }

        var parsedObj = null;
        try {
            parsedObj = eval("(" + resultJSON + ")");
        } catch (parseError) {
            throw new Error(t("openai_parse_error"));
        }
        if (!parsedObj || parsedObj.error) {
            throw new Error(t("openai_error_prefix", { message: extractOpenAIFailureMessage(resultJSON, parsedObj) }));
        }
        return parsedObj;
    } finally {
        try { payloadFile.remove(); } catch (payloadRemoveErr) {}
        try { if (outFile && outFile.exists) outFile.remove(); } catch (outCleanupErr) {}
    }
}

function extractLocalLLMFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.error && parsedObj.error.message) msg = parsedObj.error.message;
        else if (parsedObj && parsedObj.message) msg = parsedObj.message;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("local_unknown_response");
    return msg;
}

function requestLocalLLMChatCompletionObject(payloadObj) {
    var baseURL = normalizeLocalLLMBaseURL(localLLMBaseURL);
    var endpoint = baseURL + "/chat/completions";
    var payloadFile = new File(Folder.temp + "/loc_pay_" + new Date().getTime() + ".json");
    var outFile = null;
    payloadFile.encoding = "UTF-8";
    payloadFile.open("w");
    payloadFile.write(serializeJSON(payloadObj));
    payloadFile.close();

    try {
        var resultJSON = "";
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Content-Type: application/json'";
            if (localLLMApiKey && localLLMApiKey !== "") curlCmd += " -H 'Authorization: Bearer " + localLLMApiKey + "'";
            curlCmd += " --data-binary @'" + payloadFile.fsName + "'";
            resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            outFile = new File(Folder.temp + "/loc_out_" + new Date().getTime() + ".json");
            var authHeaderPart = (localLLMApiKey && localLLMApiKey !== "") ? ' -H ""Authorization: Bearer ' + localLLMApiKey + '""' : '';
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Content-Type: application/json""' + authHeaderPart + ' --data-binary @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultJSON = outFile.read();
                outFile.close();
                try { outFile.remove(); } catch (outRemoveErr) {}
                outFile = null;
            }
        }

        var parsedObj = null;
        try {
            parsedObj = eval("(" + resultJSON + ")");
        } catch (parseError) {
            throw new Error(t("local_parse_error"));
        }
        if (!parsedObj || parsedObj.error) {
            throw new Error(t("local_error_prefix", { message: extractLocalLLMFailureMessage(resultJSON, parsedObj) }));
        }
        return parsedObj;
    } finally {
        try { payloadFile.remove(); } catch (payloadRemoveErr) {}
        try { if (outFile && outFile.exists) outFile.remove(); } catch (outCleanupErr) {}
    }
}

function parseLocalLLMStructuredOutput(parsedObj) {
    var outputText = "";
    try {
        if (parsedObj && parsedObj.choices && parsedObj.choices.length > 0 &&
            parsedObj.choices[0].message && parsedObj.choices[0].message.content !== undefined &&
            parsedObj.choices[0].message.content !== null) {
            outputText = String(parsedObj.choices[0].message.content);
        }
    } catch (e) {}
    outputText = stripMarkdownCodeFence(outputText);
    if (!outputText || outputText === "") {
        throw new Error(t("local_error_prefix", { message: extractLocalLLMFailureMessage("", parsedObj) }));
    }

    var structuredObj = null;
    try {
        structuredObj = eval("(" + outputText + ")");
    } catch (structuredParseError) {
        throw new Error(t("local_parse_error"));
    }
    return structuredObj;
}

function parseOpenAIStructuredOutput(parsedObj) {
    var outputText = stripMarkdownCodeFence(extractOpenAIOutputText(parsedObj));
    if (!outputText || outputText === "") {
        throw new Error(t("openai_error_prefix", { message: extractOpenAIFailureMessage("", parsedObj) }));
    }

    var structuredObj = null;
    try {
        structuredObj = eval("(" + outputText + ")");
    } catch (structuredParseError) {
        throw new Error(t("openai_parse_error"));
    }
    return structuredObj;
}

function extractGeminiFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.error && parsedObj.error.message) msg = parsedObj.error.message;
        else if (parsedObj && parsedObj.promptFeedback && parsedObj.promptFeedback.blockReason) msg = "blockReason=" + parsedObj.promptFeedback.blockReason;
        else if (parsedObj && parsedObj.candidates && parsedObj.candidates.length > 0 && parsedObj.candidates[0].finishReason && parsedObj.candidates[0].finishReason !== "STOP") msg = "finishReason=" + parsedObj.candidates[0].finishReason;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("gemini_unknown_response");
    return msg;
}

function extractGeminiOutputText(parsedObj) {
    try {
        if (parsedObj && parsedObj.promptFeedback && parsedObj.promptFeedback.blockReason) {
            throw new Error(t("gemini_refusal", { message: parsedObj.promptFeedback.blockReason }));
        }
    } catch (e) {
        if (e && e.message) throw e;
    }

    var parts = [];
    var candidates = (parsedObj && parsedObj.candidates) ? parsedObj.candidates : [];
    for (var i = 0; i < candidates.length; i++) {
        var content = (candidates[i] && candidates[i].content) ? candidates[i].content : null;
        var textParts = (content && content.parts) ? content.parts : [];
        for (var j = 0; j < textParts.length; j++) {
            if (textParts[j] && textParts[j].text !== undefined && textParts[j].text !== null) {
                parts.push(String(textParts[j].text));
            }
        }
    }
    return parts.join("");
}

function requestGeminiResponseObject(modelName, payloadObj) {
    var endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(modelName) + ":generateContent";
    var payloadFile = new File(Folder.temp + "/gem_pay_" + new Date().getTime() + ".json");
    var outFile = null;
    payloadFile.encoding = "UTF-8";
    payloadFile.open("w");
    payloadFile.write(serializeJSON(payloadObj));
    payloadFile.close();

    try {
        var resultJSON = "";
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Content-Type: application/json' -H 'x-goog-api-key: " + geminiKey + "' --data-binary @'" + payloadFile.fsName + "'";
            resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            outFile = new File(Folder.temp + "/gem_out_" + new Date().getTime() + ".json");
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Content-Type: application/json"" -H ""x-goog-api-key: ' + geminiKey + '"" --data-binary @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultJSON = outFile.read();
                outFile.close();
                try { outFile.remove(); } catch (outRemoveErr) {}
                outFile = null;
            }
        }

        var parsedObj = null;
        try {
            parsedObj = eval("(" + resultJSON + ")");
        } catch (parseError) {
            throw new Error(t("gemini_parse_error"));
        }
        if (!parsedObj || parsedObj.error) {
            throw new Error(t("gemini_error_prefix", { message: extractGeminiFailureMessage(resultJSON, parsedObj) }));
        }
        return parsedObj;
    } finally {
        try { payloadFile.remove(); } catch (payloadRemoveErr) {}
        try { if (outFile && outFile.exists) outFile.remove(); } catch (outCleanupErr) {}
    }
}

function parseGeminiStructuredOutput(parsedObj) {
    var outputText = stripMarkdownCodeFence(extractGeminiOutputText(parsedObj));
    if (!outputText || outputText === "") {
        throw new Error(t("gemini_error_prefix", { message: extractGeminiFailureMessage("", parsedObj) }));
    }

    var structuredObj = null;
    try {
        structuredObj = eval("(" + outputText + ")");
    } catch (structuredParseError) {
        throw new Error(t("gemini_parse_error"));
    }
    return structuredObj;
}

function extractClaudeFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.error && parsedObj.error.message) msg = parsedObj.error.message;
        else if (parsedObj && parsedObj.type && parsedObj.type !== "message") msg = "type=" + parsedObj.type;
        else if (parsedObj && parsedObj.stop_reason && parsedObj.stop_reason !== "tool_use" && parsedObj.stop_reason !== "end_turn") msg = "stop_reason=" + parsedObj.stop_reason;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("claude_unknown_response");
    return msg;
}

function extractClaudeStructuredToolInput(parsedObj, toolName) {
    var content = (parsedObj && parsedObj.content) ? parsedObj.content : [];
    var textParts = [];
    for (var i = 0; i < content.length; i++) {
        var item = content[i];
        if (!item) continue;
        if (item.type === "tool_use" && item.name === toolName) return item.input;
        if (item.type === "text" && item.text !== undefined && item.text !== null) textParts.push(String(item.text));
    }
    var refusalText = textParts.join(" ").replace(/^\s+|\s+$/g, "");
    if (refusalText !== "") throw new Error(t("claude_refusal", { message: refusalText }));
    throw new Error(t("claude_parse_error"));
}

function requestClaudeResponseObject(payloadObj) {
    var endpoint = "https://api.anthropic.com/v1/messages";
    var payloadFile = new File(Folder.temp + "/cla_pay_" + new Date().getTime() + ".json");
    var outFile = null;
    payloadFile.encoding = "UTF-8";
    payloadFile.open("w");
    payloadFile.write(serializeJSON(payloadObj));
    payloadFile.close();

    try {
        var resultJSON = "";
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Content-Type: application/json' -H 'x-api-key: " + claudeKey + "' -H 'anthropic-version: 2023-06-01' --data-binary @'" + payloadFile.fsName + "'";
            resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            outFile = new File(Folder.temp + "/cla_out_" + new Date().getTime() + ".json");
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Content-Type: application/json"" -H ""x-api-key: ' + claudeKey + '"" -H ""anthropic-version: 2023-06-01"" --data-binary @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultJSON = outFile.read();
                outFile.close();
                try { outFile.remove(); } catch (outRemoveErr) {}
                outFile = null;
            }
        }

        var parsedObj = null;
        try {
            parsedObj = eval("(" + resultJSON + ")");
        } catch (parseError) {
            throw new Error(t("claude_parse_error"));
        }
        if (!parsedObj || parsedObj.error) {
            throw new Error(t("claude_error_prefix", { message: extractClaudeFailureMessage(resultJSON, parsedObj) }));
        }
        return parsedObj;
    } finally {
        try { payloadFile.remove(); } catch (payloadRemoveErr) {}
        try { if (outFile && outFile.exists) outFile.remove(); } catch (outCleanupErr) {}
    }
}

function requestStructuredProviderObject(providerId, schemaName, schemaDef, promptText, systemInstruction) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "local") {
        var localPayloadObj = {
            model: getStructuredProviderModel(normalized),
            messages: [
                { role: "system", content: systemInstruction + " Output only valid JSON that matches the requested schema." },
                { role: "user", content: promptText }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: schemaName,
                    strict: true,
                    schema: schemaDef
                }
            },
            stream: false,
            temperature: 0
        };
        return parseLocalLLMStructuredOutput(requestLocalLLMChatCompletionObject(localPayloadObj));
    }

    if (normalized === "openai") {
        var openAIPayloadObj = {
            model: getStructuredProviderModel(normalized),
            instructions: systemInstruction,
            input: promptText,
            text: {
                format: {
                    type: "json_schema",
                    name: schemaName,
                    schema: schemaDef
                }
            }
        };
        return parseOpenAIStructuredOutput(requestOpenAIResponseObject(openAIPayloadObj));
    }

    if (normalized === "gemini") {
        var geminiPayloadObj = {
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseJsonSchema: schemaDef
            }
        };
        return parseGeminiStructuredOutput(requestGeminiResponseObject(getStructuredProviderModel(normalized), geminiPayloadObj));
    }

    if (normalized === "claude") {
        var claudePayloadObj = {
            model: getStructuredProviderModel(normalized),
            max_tokens: 12000,
            system: systemInstruction + " Always answer by calling the provided tool exactly once.",
            messages: [{ role: "user", content: promptText }],
            tools: [{
                name: schemaName,
                description: "Return the translation result for Adobe InDesign XML fragments using this schema only. Do not answer with plain text. The fields must contain translated XML strings that preserve the exact XML/tag/attribute structure.",
                input_schema: schemaDef,
                strict: true
            }],
            tool_choice: { type: "tool", name: schemaName }
        };
        return extractClaudeStructuredToolInput(requestClaudeResponseObject(claudePayloadObj), schemaName);
    }

    throw new Error("Unsupported provider: " + normalized);
}

function repairStructuredProviderInvalidTranslation(providerId, sourceXML, candidateXML, targetLangCode, blockIndex, overPct) {
    var normalized = normalizeTranslationProvider(providerId);
    var debugPrefix = getProviderDebugPrefix(normalized);
    if (overPct !== null && overPct !== undefined) {
        updateProgress(null, t(getProviderStringKey(normalized, "repair_block"), { index: blockIndex }), overPct, null);
    }
    writeDebugLog(debugPrefix + ":repair:start block=" + blockIndex +
        " source=" + String(sourceXML || "").substring(0, 500) +
        " candidate=" + String(candidateXML || "").substring(0, 500), "WARNUNG");

    var structuredObj = requestStructuredProviderObject(
        normalized,
        "translation_repair",
        getSingleTranslationJSONSchema(),
        buildStructuredRepairPrompt(sourceXML, candidateXML, targetLangCode),
        "You repair XML structure for Adobe InDesign translation fragments. Preserve the exact source XML/tag/attribute structure and output only the requested JSON object."
    );
    if (!structuredObj || typeof structuredObj.translation !== "string") {
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    var repairedXML = normalizeStructuredXMLCandidate(structuredObj.translation, sourceXML);
    if (!validateStructuredXMLTranslation(sourceXML, repairedXML)) {
        writeDebugLog(debugPrefix + ":repair:failed block=" + blockIndex +
            " repaired=" + String(repairedXML || "").substring(0, 500), "WARNUNG");
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    writeDebugLog(debugPrefix + ":repair:success block=" + blockIndex);
    return repairedXML;
}

function retrySingleBlockStructuredProviderTranslation(providerId, sourceXML, targetLangCode, blockIndex, overPct) {
    var normalized = normalizeTranslationProvider(providerId);
    var debugPrefix = getProviderDebugPrefix(normalized);
    if (overPct !== null && overPct !== undefined) {
        updateProgress(null, t(getProviderStringKey(normalized, "retry_block"), { index: blockIndex }), overPct, null);
    }
    writeDebugLog(debugPrefix + ":retry_single:start block=" + blockIndex +
        " source=" + String(sourceXML || "").substring(0, 500), "WARNUNG");

    var structuredObj = requestStructuredProviderObject(
        normalized,
        "single_translation",
        getSingleTranslationJSONSchema(),
        buildStructuredSingleTranslationPrompt(sourceXML, targetLangCode),
        "You translate a single Adobe InDesign XML fragment. Preserve the exact XML/tag/attribute structure and output only the requested JSON object."
    );
    if (!structuredObj || typeof structuredObj.translation !== "string") {
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    var translatedXML = normalizeStructuredXMLCandidate(structuredObj.translation, sourceXML);
    if (!validateStructuredXMLTranslation(sourceXML, translatedXML)) {
        writeDebugLog(debugPrefix + ":retry_single:failed block=" + blockIndex +
            " candidate=" + String(translatedXML || "").substring(0, 500), "WARNUNG");
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    writeDebugLog(debugPrefix + ":retry_single:success block=" + blockIndex);
    return translatedXML;
}

function translateSingleBlockDeepLFallbackForProvider(providerId, sourceXML, targetLangCode, blockIndex, overPct) {
    var normalized = normalizeTranslationProvider(providerId);
    var debugPrefix = getProviderDebugPrefix(normalized);
    if (!apiKey || apiKey === "") {
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }
    if (overPct !== null && overPct !== undefined) {
        updateProgress(null, t(getProviderStringKey(normalized, "fallback_deepl_block"), { index: blockIndex }), overPct, null);
    }
    writeDebugLog(debugPrefix + ":fallback_deepl:start block=" + blockIndex +
        " source=" + String(sourceXML || "").substring(0, 500), "WARNUNG");

    var translated = translateBatchDeepL([sourceXML], targetLangCode, overPct, overPct);
    if (!translated || translated.length !== 1) {
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    var translatedXML = normalizeStructuredXMLCandidate(translated[0], sourceXML);
    if (!validateStructuredXMLTranslation(sourceXML, translatedXML)) {
        writeDebugLog(debugPrefix + ":fallback_deepl:failed block=" + blockIndex +
            " candidate=" + String(translatedXML || "").substring(0, 500), "WARNUNG");
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    writeDebugLog(debugPrefix + ":fallback_deepl:success block=" + blockIndex);
    return translatedXML;
}

function repairOpenAIInvalidTranslation(sourceXML, candidateXML, targetLangCode, blockIndex, overPct) {
    return repairStructuredProviderInvalidTranslation("openai", sourceXML, candidateXML, targetLangCode, blockIndex, overPct);
}

function retrySingleBlockOpenAITranslation(sourceXML, targetLangCode, blockIndex, overPct) {
    return retrySingleBlockStructuredProviderTranslation("openai", sourceXML, targetLangCode, blockIndex, overPct);
}

function translateSingleBlockDeepLFallback(sourceXML, targetLangCode, blockIndex, overPct) {
    return translateSingleBlockDeepLFallbackForProvider("openai", sourceXML, targetLangCode, blockIndex, overPct);
}

function translateBatchWithProvider(textsArray, targetLangCode, overStartPct, overEndPct, providerId) {
    var activeProvider = normalizeTranslationProvider(providerId || getActiveTranslationProvider());
    if (activeProvider === "local") {
        return translateBatchLocalLLM(textsArray, targetLangCode, overStartPct, overEndPct);
    }
    if (activeProvider === "openai") {
        return translateBatchOpenAI(textsArray, targetLangCode, overStartPct, overEndPct);
    }
    if (activeProvider === "gemini") {
        return translateBatchGemini(textsArray, targetLangCode, overStartPct, overEndPct);
    }
    if (activeProvider === "claude") {
        return translateBatchClaude(textsArray, targetLangCode, overStartPct, overEndPct);
    }
    return translateBatchDeepL(textsArray, targetLangCode, overStartPct, overEndPct);
}

function translateBatchDeepL(textsArray, targetLangCode, overStartPct, overEndPct) {
    var endpoint = (apiKey.indexOf(":fx") !== -1) ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
    var translated = []; 
    var b = 0;
    while (b < textsArray.length) {
        if (cancelFlag) throw new Error("CANCELLED");
        
        var batchPct = (b / textsArray.length);
        var currentTaskPct = 20 + Math.round(batchPct * 60);
        
        var currentOverPct = overStartPct ? (overStartPct + (batchPct * (overEndPct - overStartPct) * 0.8)) : null;

        var maxPayloadLen = 45000;
        var maxBatchSize = 10;

        while (true) {
            var batchBuild = buildDeepLBatchPayload(textsArray, b, targetLangCode, true, maxPayloadLen, maxBatchSize);
            var payloadStr = batchBuild.payloadStr;
            var endBatch = batchBuild.endBatch;

            if ((endBatch === (b + 1)) && batchBuild.payloadLen > maxPayloadLen) {
                writeDebugLog("deepl:oversized_single_block index=" + b + " payloadLen=" + batchBuild.payloadLen + " limit=" + maxPayloadLen, "WARNUNG");
                translated.push(translateOversizedStructuredXMLBlockDeepL(textsArray[b], targetLangCode, currentOverPct, currentOverPct, maxPayloadLen));
                b = endBatch;
                break;
            }

            updateProgress(currentTaskPct, t("deepl_request_blocks", { start: (b + 1), end: endBatch, total: textsArray.length }), currentOverPct, null);
            
            var payloadFile = new File(Folder.temp + "/dl_pay_" + new Date().getTime() + ".txt");
            payloadFile.encoding = "UTF-8";
            payloadFile.open("w");
            payloadFile.write(payloadStr);
            payloadFile.close();

            try {
                var resultJSON = "";
                if (File.fs === "Macintosh") {
                    var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Authorization: DeepL-Auth-Key " + apiKey + "' -d @'" + payloadFile.fsName + "'";
                    resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
                } else {
                    var outFile = new File(Folder.temp + "/dl_out_" + new Date().getTime() + ".json");
                    var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                              'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Authorization: DeepL-Auth-Key ' + apiKey + '"" -d @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
                    app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
                    if (outFile.exists) {
                        outFile.encoding = "UTF-8"; outFile.open("r"); resultJSON = outFile.read(); outFile.close(); try { outFile.remove(); } catch(e){}
                    }
                }
                
                var parsedObj = null;
                try {
                    parsedObj = eval("(" + resultJSON + ")");
                } catch (parseError) {
                    throw new Error(t("deepl_parse_error"));
                }
                if (!parsedObj || !parsedObj.translations) {
                    throw new Error(t("deepl_error_prefix", { message: extractDeepLFailureMessage(resultJSON, parsedObj) }));
                }
                if (parsedObj.translations.length !== (endBatch - b)) {
                    throw new Error(t("deepl_incomplete"));
                }
                for (var k = 0; k < parsedObj.translations.length; k++) {
                    translated.push(normalizeStructuredXMLCandidate(parsedObj.translations[k].text, textsArray[b + k]));
                }
                b = endBatch;
                break;
            } catch (e) {
                if (e.message === "CANCELLED") throw e;

                if (isDeepLPayloadTooLargeMessage(e.message) && (endBatch - b) > 1) {
                    maxBatchSize = Math.max(1, Math.floor((endBatch - b) / 2));
                    maxPayloadLen = Math.max(12000, Math.floor(maxPayloadLen * 0.7));
                    continue;
                }

                throw new Error(e.message && e.message.indexOf("DeepL") === 0 ? e.message : t("deepl_connection_error", { message: (e.message || "Request failed.") }));
            }
            finally { try { payloadFile.remove(); } catch(e){} }
        }
    }
    return translated;
}

function getStructuredProviderBatchSize(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "local") return 6;
    if (normalized === "claude") return 6;
    if (normalized === "gemini") return 10;
    return 8;
}

function translateBatchStructuredLLM(providerId, textsArray, targetLangCode, overStartPct, overEndPct) {
    var normalized = normalizeTranslationProvider(providerId);
    var translated = [];
    var batchSize = getStructuredProviderBatchSize(normalized);
    var requestLabelKey = getProviderStringKey(normalized, "request_blocks");
    var incompleteKey = getProviderStringKey(normalized, "incomplete");
    var invalidKey = getProviderStringKey(normalized, "invalid_xml");
    var connectionKey = getProviderStringKey(normalized, "connection_error");
    var debugPrefix = getProviderDebugPrefix(normalized);

    for (var b = 0; b < textsArray.length; b += batchSize) {
        if (cancelFlag) throw new Error("CANCELLED");

        var batchPct = (b / textsArray.length);
        var currentTaskPct = 20 + Math.round(batchPct * 60);
        var currentOverPct = overStartPct ? (overStartPct + (batchPct * (overEndPct - overStartPct) * 0.8)) : null;
        var endBatch = Math.min(b + batchSize, textsArray.length);
        updateProgress(currentTaskPct, t(requestLabelKey, { start: (b + 1), end: endBatch, total: textsArray.length }), currentOverPct, null);

        var batchTexts = [];
        for (var j = b; j < endBatch; j++) batchTexts.push(String(textsArray[j] || ""));

        try {
            var structuredObj = requestStructuredProviderObject(
                normalized,
                "translation_batch",
                getBatchTranslationJSONSchema(),
                buildStructuredBatchTranslationPrompt(batchTexts, targetLangCode),
                "You are a translation engine for Adobe InDesign XML fragments. Preserve the exact XML/tag/attribute structure and output only the requested JSON object."
            );

            if (!structuredObj || !structuredObj.translations || structuredObj.translations.length !== batchTexts.length) {
                throw new Error(t(incompleteKey));
            }

            for (var k = 0; k < structuredObj.translations.length; k++) {
                var blockIndex = b + k + 1;
                var translatedXML = normalizeStructuredXMLCandidate(structuredObj.translations[k], batchTexts[k]);
                if (!validateStructuredXMLTranslation(batchTexts[k], translatedXML)) {
                    writeDebugLog(debugPrefix + ":invalid_xml block=" + blockIndex +
                        " source=" + String(batchTexts[k] || "").substring(0, 500) +
                        " candidate=" + String(translatedXML || "").substring(0, 500), "WARNUNG");
                    try {
                        translatedXML = repairStructuredProviderInvalidTranslation(normalized, batchTexts[k], translatedXML, targetLangCode, blockIndex, currentOverPct);
                    } catch (repairErr) {
                        writeDebugLog(debugPrefix + ":repair:error block=" + blockIndex + " error=" + (repairErr.message || repairErr), "WARNUNG");
                        try {
                            translatedXML = retrySingleBlockStructuredProviderTranslation(normalized, batchTexts[k], targetLangCode, blockIndex, currentOverPct);
                        } catch (retryErr) {
                            writeDebugLog(debugPrefix + ":retry_single:error block=" + blockIndex + " error=" + (retryErr.message || retryErr), "WARNUNG");
                            translatedXML = translateSingleBlockDeepLFallbackForProvider(normalized, batchTexts[k], targetLangCode, blockIndex, currentOverPct);
                        }
                    }
                }
                if (!validateStructuredXMLTranslation(batchTexts[k], translatedXML)) {
                    throw new Error(t(invalidKey, { index: blockIndex }));
                }
                translated.push(translatedXML);
            }
        } catch (e) {
            if (e.message === "CANCELLED") throw e;
            throw new Error(isProviderBrandedError(normalized, e.message) ? e.message : t(connectionKey, { message: (e.message || "Request failed.") }));
        }
    }

    return translated;
}

function translateBatchOpenAI(textsArray, targetLangCode, overStartPct, overEndPct) {
    return translateBatchStructuredLLM("openai", textsArray, targetLangCode, overStartPct, overEndPct);
}

function translateBatchLocalLLM(textsArray, targetLangCode, overStartPct, overEndPct) {
    return translateBatchStructuredLLM("local", textsArray, targetLangCode, overStartPct, overEndPct);
}

function translateBatchGemini(textsArray, targetLangCode, overStartPct, overEndPct) {
    return translateBatchStructuredLLM("gemini", textsArray, targetLangCode, overStartPct, overEndPct);
}

function translateBatchClaude(textsArray, targetLangCode, overStartPct, overEndPct) {
    return translateBatchStructuredLLM("claude", textsArray, targetLangCode, overStartPct, overEndPct);
}

function translateBatchDeepLPlain(textsArray, targetLangCode, overStartPct, overEndPct) {
    var endpoint = (apiKey.indexOf(":fx") !== -1) ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
    var translated = []; 
    var b = 0;
    while (b < textsArray.length) {
        if (cancelFlag) throw new Error("CANCELLED");
        
        var batchPct = (b / textsArray.length);
        var currentTaskPct = 20 + Math.round(batchPct * 60);
        
        var currentOverPct = overStartPct ? (overStartPct + (batchPct * (overEndPct - overStartPct) * 0.8)) : null;

        var maxPayloadLen = 45000;
        var maxBatchSize = 10;

        while (true) {
            var batchBuild = buildDeepLBatchPayload(textsArray, b, targetLangCode, false, maxPayloadLen, maxBatchSize);
            var payloadStr = batchBuild.payloadStr;
            var endBatch = batchBuild.endBatch;

            updateProgress(currentTaskPct, t("deepl_request_text_blocks", { start: (b + 1), end: endBatch, total: textsArray.length }), currentOverPct, null);
            
            var payloadFile = new File(Folder.temp + "/dl_pay_" + new Date().getTime() + ".txt");
            payloadFile.encoding = "UTF-8";
            payloadFile.open("w");
            payloadFile.write(payloadStr);
            payloadFile.close();
            try {
                var resultJSON = "";
                if (File.fs === "Macintosh") {
                    var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Authorization: DeepL-Auth-Key " + apiKey + "' -d @'" + payloadFile.fsName + "'";
                    resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
                } else {
                    throw new Error(t("deepl_windows_plain_not_implemented"));
                }
                var parsedObj = null;
                try {
                    parsedObj = eval("(" + resultJSON + ")");
                } catch (parseError) {
                    throw new Error(t("deepl_parse_error"));
                }
                if (!parsedObj || !parsedObj.translations) {
                    throw new Error(t("deepl_error_prefix", { message: extractDeepLFailureMessage(resultJSON, parsedObj) }));
                }
                if (parsedObj.translations.length !== (endBatch - b)) {
                    throw new Error(t("deepl_incomplete"));
                }
                for (var k = 0; k < parsedObj.translations.length; k++) translated.push(parsedObj.translations[k].text);
                b = endBatch;
                break;
            } catch (e) {
                if (e.message === "CANCELLED") throw e;

                if (isDeepLPayloadTooLargeMessage(e.message) && (endBatch - b) > 1) {
                    maxBatchSize = Math.max(1, Math.floor((endBatch - b) / 2));
                    maxPayloadLen = Math.max(12000, Math.floor(maxPayloadLen * 0.7));
                    continue;
                }

                throw new Error(e.message && e.message.indexOf("DeepL") === 0 ? e.message : t("deepl_connection_error", { message: (e.message || "Request failed.") }));
            }
            finally { try { payloadFile.remove(); } catch(e){} }
        }
    }
    return translated;
}

function normalizeTranslatedXML(xml) {
    if (!xml || xml === "") return xml;
    return String(xml).replace(/^\s+|\s+$/g, '')
                      .replace(/>\s+</g, '><');
}

function preserveRunBoundaryWhitespace(sourceXML, translatedXML) {
    if (!sourceXML || !translatedXML) return translatedXML;

    var sourceRuns = String(sourceXML).match(/<t\b[^>]*>[\s\S]*?<\/t>/gi);
    var sourceRunCount = sourceRuns ? sourceRuns.length : 0;
    var translatedRunIndex = 0;
    if (sourceRunCount === 0) return translatedXML;

    return String(translatedXML).replace(/<t\b([^>]*)>([\s\S]*?)<\/t>/gi, function(fullMatch, attrText, innerText) {
        if (translatedRunIndex >= sourceRunCount) return fullMatch;

        var sourceInnerMatch = /<t\b[^>]*>([\s\S]*?)<\/t>/i.exec(sourceRuns[translatedRunIndex]);
        translatedRunIndex++;
        if (!sourceInnerMatch) return fullMatch;

        var sourceInnerText = String(sourceInnerMatch[1] || "");
        var sourceCoreText = sourceInnerText.replace(/^\s+|\s+$/g, "");
        if (sourceCoreText === "") {
            return "<t" + attrText + ">" + sourceInnerText + "</t>";
        }

        var translatedInnerText = String(innerText || "");
        var translatedCoreText = translatedInnerText.replace(/^\s+|\s+$/g, "");
        if (translatedCoreText === "") return fullMatch;

        var sourceLeadingMatch = sourceInnerText.match(/^\s+/);
        var sourceTrailingMatch = sourceInnerText.match(/\s+$/);
        var adjustedInnerText = (sourceLeadingMatch ? sourceLeadingMatch[0] : "") +
            translatedCoreText +
            (sourceTrailingMatch ? sourceTrailingMatch[0] : "");

        return "<t" + attrText + ">" + adjustedInnerText + "</t>";
    });
}

function normalizeTechnicalTokenSpacingInString(text) {
    if (text === null || text === undefined || text === "") return text;
    return String(text).replace(/([a-z\u00DF-\u00F6\u00F8-\u00FF])((?:[A-Z]+[0-9]+[A-Z0-9]*|[0-9]+[A-Z]+[A-Z0-9]*)(?:[\*xX\/-][0-9]+[A-Z0-9]*)+)/g, "$1 $2");
}

function normalizeTechnicalTokenSpacing(textScope) {
    if (!textScope || !textScope.isValid) return false;
    var changed = false;
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;

        app.findGrepPreferences.findWhat = "([\\l])((?:[A-Z]+\\d+[A-Z0-9]*|\\d+[A-Z]+[A-Z0-9]*)(?:[\\*xX/\\-]\\d+[A-Z0-9]*)+)";
        app.changeGrepPreferences.changeTo = "$1 $2";
        changed = !!(textScope.changeGrep() || []).length || changed;
    } catch (e) {
        return changed;
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (e2) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (e3) {}
    }
    return changed;
}

function normalizePostTranslationSpacing(textScope, symbols) {
    var changed = false;
    changed = normalizeTechnicalTokenSpacing(textScope) || changed;
    changed = normalizeReferenceSpacing(textScope, symbols) || changed;
    return changed;
}

function normalizeReferenceSpacing(textScope, symbols) {
    if (!textScope || !textScope.isValid) return false;
    var changed = false;
    var referenceTextCharPattern = "([\\u\\l\\d])";
    var referenceMarkerPattern = buildReferenceMarkerPattern(symbols || refSymbolsSetting);
    var inlineWhitespacePattern = "[ \\t]";
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;

        app.findGrepPreferences.findWhat = referenceTextCharPattern + inlineWhitespacePattern + "*" + referenceMarkerPattern;
        app.changeGrepPreferences.changeTo = "$1 $2";
        changed = !!(textScope.changeGrep() || []).length || changed;

        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = referenceMarkerPattern + inlineWhitespacePattern + "+([\\.,;:!\\?])";
        app.changeGrepPreferences.changeTo = "$1$2";
        changed = !!(textScope.changeGrep() || []).length || changed;

        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = referenceMarkerPattern + inlineWhitespacePattern + "*" + referenceTextCharPattern;
        app.changeGrepPreferences.changeTo = "$1 $2";
        changed = !!(textScope.changeGrep() || []).length || changed;
    } catch (e) {
        return changed;
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (e2) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (e3) {}
    }
    return changed;
}

function getStoryRangeSignature(textObj) {
    if (!textObj || !textObj.isValid) return null;
    var story = null;
    try { story = textObj.parentStory; } catch (e) { story = null; }
    if ((!story || !story.isValid) && textObj.constructor && textObj.constructor.name === "Story") story = textObj;
    if (!story || !story.isValid) return null;
    try {
        var startIndex = 0;
        var endIndex = 0;
        if (textObj.constructor && textObj.constructor.name === "Story") {
            startIndex = 0;
            endIndex = story.insertionPoints.length > 0 ? story.insertionPoints[story.insertionPoints.length - 1].index : 0;
        } else {
            startIndex = textObj.insertionPoints[0].index;
            endIndex = textObj.insertionPoints[textObj.insertionPoints.length - 1].index;
        }
        return {
            storyId: story.id,
            start: startIndex,
            end: endIndex
        };
    } catch (e2) {
        return null;
    }
}

function isSameStoryRange(a, b) {
    if (!a || !b) return false;
    return a.storyId === b.storyId && a.start === b.start && a.end === b.end;
}

function sanitizeHyperlinkName(value) {
    var safe = String(value || "").replace(/[^A-Za-z0-9]+/g, "_");
    if (safe.length > 40) safe = safe.substring(0, 40);
    if (safe === "") safe = "LINK";
    return safe;
}

function resolvePageBySetting(doc, pageSetting) {
    var raw = String(pageSetting || "").replace(/^\s+|\s+$/g, "");
    if (raw === "") return null;

    try {
        var namedPage = doc.pages.itemByName(raw);
        if (namedPage && namedPage.isValid) return namedPage;
    } catch (e) {}

    if (/^\d+$/.test(raw)) {
        var pageIndex = parseInt(raw, 10) - 1;
        if (pageIndex >= 0 && pageIndex < doc.pages.length) {
            try {
                var indexedPage = doc.pages[pageIndex];
                if (indexedPage && indexedPage.isValid) return indexedPage;
            } catch (e2) {}
        }
    }

    return null;
}

function getOrCreatePageDestination(doc, targetPage, languageCode, pageSetting) {
    var destinationName = "STP_REF_PAGE_" + languageCode + "_" + sanitizeHyperlinkName(pageSetting);
    var destination = null;
    try {
        destination = doc.hyperlinkPageDestinations.itemByName(destinationName);
        if (destination && !destination.isValid) destination = null;
    } catch (e) { destination = null; }

    if (!destination || !destination.isValid) {
        destination = doc.hyperlinkPageDestinations.add(targetPage);
        try { destination.name = destinationName; } catch (nameErr) {}
    }

    try {
        if (typeof HyperlinkDestinationPageSetting !== "undefined") {
            destination.viewSetting = HyperlinkDestinationPageSetting.FIT_WINDOW;
        }
    } catch (viewErr) {}

    return destination;
}

function normalizeURLDestination(urlText) {
    var url = String(urlText || "").replace(/^\s+|\s+$/g, "");
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    return url;
}

function buildStoryRangeKey(rangeSignature) {
    if (!rangeSignature) return "";
    return String(rangeSignature.storyId) + ":" + String(rangeSignature.start) + ":" + String(rangeSignature.end);
}

function getTextObjectRangeKey(textObj) {
    return buildStoryRangeKey(getStoryRangeSignature(textObj));
}

function buildExistingHyperlinkSourceMap(doc) {
    var map = {};
    try {
        var hyperlinks = doc.hyperlinks.everyItem().getElements();
        for (var i = 0; i < hyperlinks.length; i++) {
            var hyperlink = hyperlinks[i];
            if (!hyperlink || !hyperlink.isValid || !hyperlink.source || !hyperlink.source.isValid) continue;
            if (hyperlink.source.constructor.name !== "HyperlinkTextSource") continue;
            var sourceText = null;
            try { sourceText = hyperlink.source.sourceText; } catch (e) { sourceText = null; }
            var key = getTextObjectRangeKey(sourceText);
            if (key !== "") map[key] = hyperlink;
        }
    } catch (e2) {}
    return map;
}

function isManagedReferenceHyperlink(hyperlink) {
    if (!hyperlink || !hyperlink.isValid) return false;
    var name = "";
    try { name = String(hyperlink.name || ""); } catch (e) { name = ""; }
    return name.indexOf("STP_REF_LINK_") === 0;
}

function isManagedUrlHyperlink(hyperlink) {
    if (!hyperlink || !hyperlink.isValid) return false;
    var name = "";
    try { name = String(hyperlink.name || ""); } catch (e) { name = ""; }
    return name.indexOf("STP_URL_LINK_") === 0;
}

function isManagedTOCHyperlink(hyperlink) {
    if (!hyperlink || !hyperlink.isValid) return false;
    var name = "";
    try { name = String(hyperlink.name || ""); } catch (e) { name = ""; }
    return name.indexOf("STP_TOC_LINK_") === 0;
}

function removeManagedHyperlink(hyperlink) {
    if (!hyperlink || !hyperlink.isValid) return;
    var source = null;
    try { source = hyperlink.source; } catch (e) { source = null; }
    try { hyperlink.remove(); } catch (e2) {}
    try { if (source && source.isValid) source.remove(); } catch (e3) {}
}

function getHyperlinkTextObjectFromItemEntry(itemEntry) {
    if (!itemEntry || !itemEntry.obj || !itemEntry.obj.isValid) return null;
    try {
        if (itemEntry.obj.texts && itemEntry.obj.texts.length > 0 && itemEntry.obj.texts[0].isValid) {
            return itemEntry.obj.texts[0];
        }
    } catch (e) {}
    if (itemEntry.type === "frame") return getTextFrameStory(itemEntry.obj);
    return null;
}

function createOrUpdateTOCLanguageHyperlink(doc, targetItem, langCode, pageSetting) {
    if (!doc || !doc.isValid || !targetItem) return false;
    var targetText = getHyperlinkTextObjectFromItemEntry(targetItem);
    if (!targetText || !targetText.isValid) return false;

    var targetPage = resolvePageBySetting(doc, pageSetting);
    if (!targetPage || !targetPage.isValid) return false;

    var destination = getOrCreatePageDestination(doc, targetPage, langCode, pageSetting);
    if (!destination || !destination.isValid) return false;

    var sourceKey = getTextObjectRangeKey(targetText);
    if (sourceKey === "") return false;

    var existingHyperlinksBySource = buildExistingHyperlinkSourceMap(doc);
    var existingHyperlink = existingHyperlinksBySource[sourceKey];
    if (existingHyperlink && existingHyperlink.isValid) {
        if (!isManagedTOCHyperlink(existingHyperlink)) return false;
        try {
            existingHyperlink.destination = destination;
            try { existingHyperlink.name = "STP_TOC_LINK_" + String(langCode || "").toUpperCase(); } catch (renameErr) {}
            return true;
        } catch (updateErr) {
            return false;
        }
    }

    try {
        var source = doc.hyperlinkTextSources.add(targetText);
        var hyperlink = doc.hyperlinks.add(source, destination);
        try { hyperlink.name = "STP_TOC_LINK_" + String(langCode || "").toUpperCase(); } catch (nameErr) {}
        return true;
    } catch (createErr) {
        return false;
    }
}

function buildURLDestinationCache(doc) {
    var cache = {};
    try {
        var destinations = doc.hyperlinkURLDestinations.everyItem().getElements();
        for (var i = 0; i < destinations.length; i++) {
            var destination = destinations[i];
            if (!destination || !destination.isValid) continue;
            try {
                cache[String(destination.destinationURL)] = destination;
            } catch (e) {}
        }
    } catch (e2) {}
    return cache;
}

function getOrCreateURLDestination(doc, urlText, destinationCache) {
    var normalizedUrl = normalizeURLDestination(urlText);
    if (destinationCache && destinationCache[normalizedUrl] && destinationCache[normalizedUrl].isValid) return destinationCache[normalizedUrl];

    var newDestination = doc.hyperlinkURLDestinations.add(normalizedUrl);
    try { newDestination.name = "STP_URL_DEST_" + sanitizeHyperlinkName(normalizedUrl); } catch (nameErr) {}
    if (destinationCache) destinationCache[normalizedUrl] = newDestination;
    return newDestination;
}

function collectUrlMatchesForStory(story) {
    var matches = [];
    if (!story || !story.isValid) return matches;
    var contents = "";
    try { contents = String(story.contents); } catch (e) { contents = ""; }
    if (contents === "") return matches;

    var urlRegex = /(?:https?:\/\/|www\.)?(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}(?:\/[A-Za-z0-9\-._~:\/?#@!$&'*+,=%]*)?/g;
    var match;
    while ((match = urlRegex.exec(contents)) !== null) {
        var start = match.index;
        var end = start + match[0].length - 1;
        var beforeChar = start > 0 ? contents.charAt(start - 1) : "";
        var afterChar = end + 1 < contents.length ? contents.charAt(end + 1) : "";

        if (beforeChar && /[A-Za-z0-9@]/.test(beforeChar)) continue;
        if (afterChar && /[A-Za-z0-9]/.test(afterChar)) continue;

        matches.push({ start: start, end: end, text: match[0] });
    }
    return matches;
}

function linkDocumentUrls(doc, existingHyperlinksBySource, destinationCache) {
    var linksCreated = 0;
    var skipped = 0;
    var found = 0;
    var stories = [];
    try { stories = doc.stories.everyItem().getElements(); } catch (e) { stories = []; }

    for (var i = 0; i < stories.length; i++) {
        var story = stories[i];
        var storyMatches = collectUrlMatchesForStory(story);
        for (var j = 0; j < storyMatches.length; j++) {
            var urlMatch = storyMatches[j];
            found++;
            try {
                var urlText = story.characters.itemByRange(urlMatch.start, urlMatch.end);
                if (!urlText || !urlText.isValid) {
                    skipped++;
                    continue;
                }
                var sourceKey = getTextObjectRangeKey(urlText);
                var existingHyperlink = sourceKey !== "" ? existingHyperlinksBySource[sourceKey] : null;
                if (existingHyperlink && existingHyperlink.isValid) {
                    if (isManagedUrlHyperlink(existingHyperlink)) {
                        skipped++;
                        continue;
                    }
                    skipped++;
                    continue;
                }

                var source = doc.hyperlinkTextSources.add(urlText);
                var destination = getOrCreateURLDestination(doc, urlMatch.text, destinationCache);
                var hyperlink = doc.hyperlinks.add(source, destination);
                try { hyperlink.name = "STP_URL_LINK_" + i + "_" + j; } catch (nameErr) {}
                if (sourceKey !== "") existingHyperlinksBySource[sourceKey] = hyperlink;
                linksCreated++;
            } catch (linkErr) {
                skipped++;
            }
        }
    }

    return { links: linksCreated, skipped: skipped, found: found };
}

function getReferencePageDestinationForLanguage(doc, langCode, pageMappings, destinationCache) {
    if (destinationCache.hasOwnProperty(langCode)) return destinationCache[langCode];
    var pageValue = pageMappings[langCode];
    if (!pageValue) {
        destinationCache[langCode] = null;
        return null;
    }
    var targetPage = resolvePageBySetting(doc, pageValue);
    if (!targetPage || !targetPage.isValid) throw new Error(t("link_invalid_page", { language: langCode, page: pageValue }));
    destinationCache[langCode] = getOrCreatePageDestination(doc, targetPage, langCode, pageValue);
    return destinationCache[langCode];
}

function linkPackageReferences(doc, symbols, pageMappings, options) {
    if (!doc || !doc.isValid) throw new Error(t("no_document_open"));

    var mappings = getRuntimeHyperlinkPageMappings(doc, pageMappings);
    var normalizedSymbols = normalizeRefSymbols(symbols || refSymbolsSetting);
    var throwOnNoMatches = true;
    if (options && options.hasOwnProperty("throwOnNoMatches")) throwOnNoMatches = !!options.throwOnNoMatches;
    var existingHyperlinksBySource = buildExistingHyperlinkSourceMap(doc);
    var pageDestinationCache = {};
    var urlDestinationCache = buildURLDestinationCache(doc);
    var matchedReferences = [];
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = buildReferenceMarkerPattern(normalizedSymbols);
        matchedReferences = doc.findGrep() || [];
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (prefErr1) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (prefErr2) {}
    }

    var linksCreated = 0;
    var skipped = 0;
    for (var i = 0; i < matchedReferences.length; i++) {
        var refText = matchedReferences[i];
        if (!refText || !refText.isValid) {
            skipped++;
            continue;
        }
        var sourceKey = getTextObjectRangeKey(refText);
        if (sourceKey === "") {
            skipped++;
            continue;
        }
        var existingHyperlink = existingHyperlinksBySource[sourceKey];
        var parentPage = getTextObjectParentPage(refText);
        var langCode = getPageLanguageCode(parentPage);
        if (!langCode) {
            if (existingHyperlink && existingHyperlink.isValid && isManagedReferenceHyperlink(existingHyperlink)) {
                removeManagedHyperlink(existingHyperlink);
                delete existingHyperlinksBySource[sourceKey];
            }
            skipped++;
            continue;
        }
        var pageDestination = getReferencePageDestinationForLanguage(doc, langCode, mappings, pageDestinationCache);
        if (!pageDestination || !pageDestination.isValid) {
            if (existingHyperlink && existingHyperlink.isValid && isManagedReferenceHyperlink(existingHyperlink)) {
                removeManagedHyperlink(existingHyperlink);
                delete existingHyperlinksBySource[sourceKey];
            }
            skipped++;
            continue;
        }
        if (existingHyperlink && existingHyperlink.isValid) {
            if (isManagedReferenceHyperlink(existingHyperlink)) {
                try {
                    existingHyperlink.destination = pageDestination;
                    try { existingHyperlink.name = "STP_REF_LINK_" + langCode + "_" + i; } catch (renameErr) {}
                    linksCreated++;
                    continue;
                } catch (updateErr) {
                    skipped++;
                    continue;
                }
            }
            skipped++;
            continue;
        }
        try {
            var source = doc.hyperlinkTextSources.add(refText);
            var hyperlink = doc.hyperlinks.add(source, pageDestination);
            try { hyperlink.name = "STP_REF_LINK_" + langCode + "_" + i; } catch (nameErr) {}
            existingHyperlinksBySource[sourceKey] = hyperlink;
            linksCreated++;
        } catch (linkErr) {
            skipped++;
        }
    }

    var urlResult = linkDocumentUrls(doc, existingHyperlinksBySource, urlDestinationCache);
    if (matchedReferences.length === 0 && urlResult.found === 0) {
        if (throwOnNoMatches) throw new Error(t("link_no_matches"));
        return {
            symbols: normalizedSymbols,
            links: 0,
            urlLinks: 0,
            skipped: 0,
            mappingSummary: formatHyperlinkPageMappings(mappings),
            noMatches: true
        };
    }

    return {
        symbols: normalizedSymbols,
        links: linksCreated,
        urlLinks: urlResult.links,
        skipped: skipped + urlResult.skipped,
        mappingSummary: formatHyperlinkPageMappings(mappings)
    };
}

function escapeDeepLXMLText(text) {
    if (text === null || text === undefined) return "";
    var result = String(text);
    result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    result = result.replace(/\r\n/g, '<pbr/>').replace(/\r/g, '<pbr/>').replace(/\n/g, '<lbr/>').replace(/\t/g, '<tab/>');
    return result;
}

function decodeDeepLXMLText(xml) {
    if (!xml) return "";
    xml = xml.replace(/^<root>/, '').replace(/<\/root>$/, '');
    xml = xml.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    xml = xml.replace(/<pbr\/>/gi, '\r').replace(/<lbr\/>/gi, '\n').replace(/<tab\/>/gi, '\t');
    return normalizeTechnicalTokenSpacingInString(xml);
}

function escapeXMLAttr(value) {
    if (value === null || value === undefined) return "";
    var escaped = String(value);
    escaped = escaped.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/"/g, '&quot;')
                     .replace(/'/g, '&apos;');
    return escaped;
}

function decodeXMLValue(value) {
    if (value === null || value === undefined) return "";
    return String(value).replace(/&quot;/g, '"')
                        .replace(/&apos;/g, "'")
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&');
}

function decodeXMLAttr(value) {
    return decodeXMLValue(value);
}

function buildTextObjectXML(textObj) {
    var xmlString = "<root>";
    var ranges = textObj.textStyleRanges;
    for (var r = 0; r < ranges.length; r++) {
        var chunk = ranges[r].contents;
        var fFamily = "Arial"; try { fFamily = escapeXMLAttr(ranges[r].appliedFont.fontFamily); } catch(e) {}
        var fStyle = "Regular"; try { fStyle = escapeXMLAttr(ranges[r].fontStyle); } catch(e) {}
        var pSize = 12; try { pSize = ranges[r].pointSize; } catch(e) {}
        var pStyleName = ""; try { pStyleName = escapeXMLAttr(ranges[r].appliedParagraphStyle.name); } catch(e) {}
        var ldingStr = "AUTO"; try { if (ranges[r].leading !== Leading.AUTO) ldingStr = escapeXMLAttr(ranges[r].leading.toString()); } catch(e) {}
        var fColor = ""; try { fColor = escapeXMLAttr(ranges[r].fillColor.name); } catch(e) {}
        var cStyle = ""; try { cStyle = escapeXMLAttr(ranges[r].appliedCharacterStyle.name); } catch(e) {}
        var pAli = ""; try { pAli = escapeXMLAttr(ranges[r].justification.toString()); } catch(e) {}
        var lInd = "0"; try { lInd = escapeXMLAttr(ranges[r].leftIndent.toString()); } catch(e) {}
        var fInd = "0"; try { fInd = escapeXMLAttr(ranges[r].firstLineIndent.toString()); } catch(e) {}
        var bList = ""; try { bList = escapeXMLAttr(ranges[r].bulletsAndNumberingListType.toString()); } catch(e) {}

        chunk = chunk.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
        chunk = chunk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        var dntArr = dntStyles.split(",");
        var isDNT = false;
        for (var d = 0; d < dntArr.length; d++) {
            var trimDNT = dntArr[d].replace(/^\s+|\s+$/g, '');
            if (trimDNT !== "" && (trimDNT === pStyleName || trimDNT === cStyle)) { isDNT = true; break; }
        }

        if (!isDNT) {
            var regexArt = getTechnicalTokenRegex();
            chunk = chunk.replace(regexArt, function(match, p1, offset, string) {
                var before = string.substring(0, offset);
                var openTags = (before.match(/<nt>/g) || []).length;
                var closeTags = (before.match(/<\/nt>/g) || []).length;
                if (openTags > closeTags) return match;
                if (offset >= 7 && (string.substring(offset - 7, offset) === "###TBL_" || string.substring(offset - 7, offset) === "###IMG_")) return match;
                return '<nt>' + match + '</nt>';
            });
        }

        chunk = chunk.replace(/###(TBL_\d+|IMG_\d+)###/g, '<nt>###$1###</nt>');
        chunk = chunk.replace(/\r/g, '<pbr/>').replace(/\n/g, '<lbr/>').replace(/\t/g, '<tab/>');
        if (chunk !== "") {
            xmlString += '<t f="' + fFamily + '" s="' + fStyle + '" z="' + pSize + '" p="' + pStyleName + '" l="' + ldingStr + '" c="' + fColor + '" k="' + cStyle + '" a="' + pAli + '" li="' + lInd + '" fi="' + fInd + '" b="' + bList + '">' + chunk + '</t>';
        }
    }
    return xmlString + "</root>";
}

function applyXMLtoInDesign(targetTextObj, translatedXML, inDesignLangCode) {
    if (!translatedXML || translatedXML === "") return;
    // Preserve tabs/line breaks between consecutive placeholders so inline image rows keep their original layout.
    translatedXML = normalizeTranslatedXML(translatedXML);
    var isPartial = false; var textFlow = null; var currentIdx = 0;
    var normalizeStartIndex = 0;
    try {
        if (targetTextObj.constructor.name === "Story") { isPartial = false; textFlow = targetTextObj; } 
        else if (targetTextObj.parent && targetTextObj.parent.constructor.name === "Cell") {
            textFlow = targetTextObj.parent.texts[0]; isPartial = (targetTextObj.characters.length < textFlow.characters.length);
        } else { isPartial = true; textFlow = targetTextObj.parentStory; }
    } catch(e) { isPartial = false; textFlow = targetTextObj; }

    if (isPartial) {
        try { currentIdx = targetTextObj.insertionPoints.item(0).index; } catch(e){}
        normalizeStartIndex = currentIdx;
        try { targetTextObj.remove(); } catch(e){}
    }
    else { try { textFlow.contents = ""; } catch(e){} currentIdx = 0; }

    var regex = /<t([^>]*)>([\s\S]*?)<\/t>/gi; var match;
    while ((match = regex.exec(translatedXML)) !== null) {
        var attrs = match[1]; var textContent = match[2];
        var getAttr = function(str, name) { var m = new RegExp(name + '="([^"]*)"').exec(str); return m ? m[1] : ""; };
        var fFam = decodeXMLAttr(getAttr(attrs, "f")); var fSty = decodeXMLAttr(getAttr(attrs, "s")); var fSiz = parseFloat(decodeXMLAttr(getAttr(attrs, "z")));
        var pSty = decodeXMLAttr(getAttr(attrs, "p")); var lead = decodeXMLAttr(getAttr(attrs, "l")); var fCol = decodeXMLAttr(getAttr(attrs, "c"));
        var cSty = decodeXMLAttr(getAttr(attrs, "k")); var pAli = decodeXMLAttr(getAttr(attrs, "a")); var lInd = decodeXMLAttr(getAttr(attrs, "li"));
        var fInd = decodeXMLAttr(getAttr(attrs, "fi")); var bLis = decodeXMLAttr(getAttr(attrs, "b"));
        
        textContent = decodeXMLValue(textContent).replace(/<pbr\/>/gi, '\r').replace(/<lbr\/>/gi, '\n').replace(/<tab\/>/gi, '\t').replace(/<\/?nt[^>]*>/gi, '');
        textContent = normalizeTechnicalTokenSpacingInString(textContent);
        if (textContent.length > 0) {
            var appliedRange = null; var doc = app.activeDocument;
            var fallbackInfo = resolveFontFallbackForText(inDesignLangCode, textContent);
            try {
                if (isPartial) {
                    textFlow.insertionPoints.item(currentIdx).contents = textContent;
                    var endIdx = currentIdx + textContent.length - 1;
                    if (endIdx >= currentIdx) appliedRange = textFlow.characters.itemByRange(currentIdx, endIdx);
                    currentIdx += textContent.length; 
                } else {
                    var lenBefore = textFlow.characters.length; textFlow.insertionPoints.item(-1).contents = textContent;
                    var sIdx = lenBefore; var eIdx = textFlow.characters.length - 1;
                    if (eIdx >= sIdx) appliedRange = textFlow.characters.itemByRange(sIdx, eIdx);
                }
            } catch(e) { continue; }
            
            if (appliedRange !== null) {
                try { var myPStyle = doc.paragraphStyles.itemByName(pSty); if (myPStyle && myPStyle.isValid) appliedRange.applyParagraphStyle(myPStyle, false); } catch(e) {}
                try { if (bLis !== "") appliedRange.bulletsAndNumberingListType = ListType[bLis]; } catch(e) {}
                try { appliedRange.appliedFont = fFam; } catch(e) {}
                try { appliedRange.fontStyle = fSty; } catch(e) { try { appliedRange.fontStyle = "Regular"; } catch(e2) {} }
                try { appliedRange.pointSize = fSiz; } catch(e) {}
                try { appliedRange.leading = (lead === "AUTO") ? Leading.AUTO : parseFloat(lead); } catch(e) {}
                try { if (fCol !== "") { var myColor = doc.swatches.itemByName(fCol); if (myColor.isValid) appliedRange.fillColor = myColor; } } catch(e) {}
                try { if (cSty !== "" && cSty !== "[None]" && cSty !== "[Ohne]") { var myCStyle = doc.characterStyles.itemByName(cSty); if (myCStyle.isValid) appliedRange.applyCharacterStyle(myCStyle, false); } } catch(e) {}
                applyOptionalFontFallback(appliedRange, fFam, fSty, fallbackInfo, inDesignLangCode, textContent);
                try { if (pAli !== "") appliedRange.justification = Justification[pAli]; } catch(e) {}
                try { appliedRange.leftIndent = parseFloat(lInd); } catch(e) {}
                try { appliedRange.firstLineIndent = parseFloat(fInd); } catch(e) {}
                
                try {
                    if (inDesignLangCode !== "") {
                        var langObj = resolveInDesignLanguageObject(doc, inDesignLangCode);
                        if (langObj && langObj.isValid) appliedRange.appliedLanguage = langObj;
                    }
                } catch(e) {}
            }
        }
    }

    if (textFlow && textFlow.isValid) {
        try {
            if (isPartial) {
                var normalizeEndIndex = currentIdx - 1;
                if (normalizeEndIndex >= normalizeStartIndex) {
                    var scopeStartIndex = Math.max(0, normalizeStartIndex - 1);
                    var scopeEndIndex = Math.min(textFlow.characters.length - 1, normalizeEndIndex + 1);
                    var insertedRange = textFlow.characters.itemByRange(scopeStartIndex, scopeEndIndex);
                    normalizePostTranslationSpacing(insertedRange);
                }
            } else {
                normalizePostTranslationSpacing(textFlow);
            }
        } catch (e5) {}
    }
}

function setupTempImageStorage(doc) {
    var tempLayer = doc.layers.itemByName("TEMP_TRANS_IMAGES");
    if (!tempLayer.isValid) tempLayer = doc.layers.add({name: "TEMP_TRANS_IMAGES", visible: true, locked: false});
    else { tempLayer.locked = false; tempLayer.visible = true; }
    var currentPage = doc.pages[0];
    try {
        if (app.activeWindow.activePage && isValidDocumentPage(app.activeWindow.activePage)) currentPage = app.activeWindow.activePage;
    } catch(e) {}
    writeDebugLog("storage:setup page=" + getDebugPageLabel(currentPage) + " layer=" + tempLayer.name);
    var storageFrame = currentPage.textFrames.add({itemLayer: tempLayer, geometricBounds: [0,-2000, 2000, -50], contents: ""});
    try { storageFrame.label = "TEMP_TRANS_STORAGE"; } catch (e2) {}
    return { layer: tempLayer, page: currentPage, frame: storageFrame };
}

function getPagesFromString(doc, pageStr) {
    var pages = []; var parts = pageStr.split(",");
    for(var i=0; i<parts.length; i++) {
        var part = parts[i].replace(/\s/g, "");
        if(part.indexOf("-") !== -1) {
            var range = part.split("-");
            var startPage = doc.pages.itemByName(range[0]); var endPage = doc.pages.itemByName(range[1]);
            if(startPage.isValid && endPage.isValid) {
                var startIndex = startPage.documentOffset; var endIndex = endPage.documentOffset;
                var step = (startIndex <= endIndex) ? 1 : -1;
                for(var j=startIndex; (step === 1 ? j<=endIndex : j>=endIndex); j+=step) { pages.push(doc.pages[j]); }
            }
        } else { var p = doc.pages.itemByName(part); if(p.isValid) pages.push(p); }
    }
    return pages;
}

// === START ===
myWindow.show();
