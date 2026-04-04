"use strict";

const { createDefaultAppSettings } = require("../config/settings-model");
const { normalizeRemoteConfig, buildDefaultUpdateStatus } = require("../services/update-service");

function createInitialState(storedState, hostSnapshot) {
    const safeState = storedState || {};
    return {
        compact: !!safeState.compact,
        activeSurface: safeState.activeSurface || "control",
        remoteConfig: normalizeRemoteConfig(safeState.remoteConfig),
        updateStatus: buildDefaultUpdateStatus(),
        settings: createDefaultAppSettings(),
        settingsReady: false,
        selectionQueue: [],
        selectionSummary: {
            totalTargets: 0,
            totalCharacters: 0,
            truncated: false,
            message: "Noch keine Auswahl gelesen."
        },
        debugRun: {
            tone: "muted",
            badge: "Noch kein Writeback",
            message: "Der erste Live-Test kann als sicherer Uppercase-Writeback ausgefuehrt werden.",
            mode: "upper",
            updatedCount: 0,
            skippedCount: 0,
            errorCount: 0,
            items: [],
            canUndo: false
        },
        busyKey: "",
        notice: "UXP-Grundgeruest bereit. Als Naechstes portieren wir Settings und den manuellen Uebersetzungsfluss.",
        host: hostSnapshot
    };
}

module.exports = {
    createInitialState: createInitialState
};
