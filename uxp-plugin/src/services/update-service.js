"use strict";

let lastKnownManifest = null;

function createUpdateService() {
    async function checkForUpdates(rawConfig) {
        const config = normalizeRemoteConfig(rawConfig);
        if (!config.manifestUrl) {
            return buildUpdateStatus({
                tone: "muted",
                badge: "Remote leer",
                message: "Noch keine Manifest-URL hinterlegt. Das Panel laeuft rein lokal.",
                sourceLabel: "Lokaler Kern",
                versionLabel: "0.1.0-shell",
                channelLabel: config.channel,
                checkedAtLabel: "Noch nicht geprueft"
            });
        }

        try {
            const response = await fetch(config.manifestUrl, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            const manifest = await response.json();
            lastKnownManifest = manifest;

            return buildUpdateStatus({
                tone: "ready",
                badge: "Remote online",
                message: manifest.message || "Remote-Manifest erfolgreich geladen.",
                sourceLabel: "Remote Manifest",
                versionLabel: String(manifest.version || "unbekannt"),
                channelLabel: String(manifest.channel || config.channel || "stable"),
                checkedAtLabel: formatTimestamp(new Date()),
                raw: manifest
            });
        } catch (error) {
            if (lastKnownManifest) {
                return buildUpdateStatus({
                    tone: "warm",
                    badge: "Cache aktiv",
                    message: "Remote aktuell nicht erreichbar. Letzter bekannter Manifest-Stand wird als Fallback angezeigt.",
                    sourceLabel: "Session Cache",
                    versionLabel: String(lastKnownManifest.version || "unbekannt"),
                    channelLabel: String(lastKnownManifest.channel || config.channel || "stable"),
                    checkedAtLabel: formatTimestamp(new Date()),
                    raw: lastKnownManifest
                });
            }

            return buildUpdateStatus({
                tone: "alert",
                badge: "Offline Fallback",
                message: "Remote-Check fehlgeschlagen: " + sanitizeError(error) + ". Das Panel bleibt auf dem lokalen Kern.",
                sourceLabel: "Lokaler Kern",
                versionLabel: "0.1.0-shell",
                channelLabel: String(config.channel || "stable"),
                checkedAtLabel: formatTimestamp(new Date())
            });
        }
    }

    return {
        checkForUpdates: checkForUpdates
    };
}

function normalizeRemoteConfig(value) {
    const raw = value || {};
    return {
        manifestUrl: normalizeUrl(raw.manifestUrl),
        bundleBaseUrl: normalizeUrl(raw.bundleBaseUrl),
        channel: normalizeChannel(raw.channel)
    };
}

function buildDefaultUpdateStatus() {
    return buildUpdateStatus({
        tone: "muted",
        badge: "Basis lokal",
        message: "Das UXP-Panel ist bereit. Remote-Update-Konfiguration kann jetzt hinterlegt und getestet werden.",
        sourceLabel: "Lokaler Kern",
        versionLabel: "0.1.0-shell",
        channelLabel: "stable",
        checkedAtLabel: "Noch nicht geprueft"
    });
}

function buildUpdateStatus(fields) {
    return {
        tone: fields.tone || "muted",
        badge: fields.badge || "Status",
        message: fields.message || "",
        sourceLabel: fields.sourceLabel || "Unbekannt",
        versionLabel: fields.versionLabel || "unbekannt",
        channelLabel: fields.channelLabel || "stable",
        checkedAtLabel: fields.checkedAtLabel || "Noch nicht geprueft",
        raw: fields.raw || null
    };
}

function normalizeChannel(value) {
    const channel = String(value || "stable").toLowerCase();
    if (channel === "beta" || channel === "internal") return channel;
    return "stable";
}

function normalizeUrl(value) {
    return String(value || "").replace(/^\s+|\s+$/g, "");
}

function sanitizeError(error) {
    return error && error.message ? String(error.message) : "unbekannter Fehler";
}

function formatTimestamp(date) {
    const stamp = date instanceof Date ? date : new Date();
    return stamp.toLocaleString("de-DE");
}

module.exports = {
    buildDefaultUpdateStatus: buildDefaultUpdateStatus,
    createUpdateService: createUpdateService,
    normalizeRemoteConfig: normalizeRemoteConfig
};
