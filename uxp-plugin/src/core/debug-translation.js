"use strict";

function createDebugReplacement(text, mode) {
    const safeText = String(text === null || text === undefined ? "" : text);
    const normalizedMode = normalizeDebugMode(mode);

    if (normalizedMode === "reverse") {
        return safeText.split("").reverse().join("");
    }

    if (normalizedMode === "tagged") {
        return "[[STP UXP TEST]] " + safeText;
    }

    return safeText.toUpperCase();
}

function normalizeDebugMode(mode) {
    const normalized = String(mode || "").replace(/^\s+|\s+$/g, "").toLowerCase();
    if (normalized === "reverse" || normalized === "tagged") return normalized;
    return "upper";
}

function getDebugModeLabel(mode) {
    const normalized = normalizeDebugMode(mode);
    if (normalized === "reverse") return "Reverse";
    if (normalized === "tagged") return "Tagged";
    return "Uppercase";
}

module.exports = {
    createDebugReplacement: createDebugReplacement,
    getDebugModeLabel: getDebugModeLabel,
    normalizeDebugMode: normalizeDebugMode
};
