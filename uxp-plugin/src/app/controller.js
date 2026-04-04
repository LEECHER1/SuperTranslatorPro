"use strict";

const { createInitialState } = require("./state");
const { renderPanel } = require("./render");
const { normalizeAppSettings } = require("../config/settings-model");
const { createHostBridge } = require("../host/indesign-host");
const { createUpdateService } = require("../services/update-service");
const { createConfigService } = require("../services/config-service");
const { createSettingsStore } = require("../services/settings-store");

const controllers = new WeakMap();

function attachPanel(rootNode) {
    let controller = controllers.get(rootNode);
    if (!controller) {
        controller = createController(rootNode);
        controllers.set(rootNode, controller);
    }
    controller.mount();
    return controller;
}

function createController(rootNode) {
    const settingsStore = createSettingsStore("supertranslatorpro.uxp.shell");
    const configService = createConfigService("supertranslatorpro.uxp");
    const hostBridge = createHostBridge();
    const updateService = createUpdateService();
    let mounted = false;
    let hydratedSettings = false;
    let state = createInitialState(settingsStore.load(), hostBridge.getSnapshot());

    function setState(nextState) {
        state = nextState;
        render();
    }

    function patchState(patch) {
        setState(Object.assign({}, state, patch));
    }

    function mount() {
        if (mounted) {
            render();
            if (!hydratedSettings) void hydrateSettings();
            void refreshDocumentContext("");
            return;
        }
        mounted = true;
        rootNode.innerHTML = "";
        render();
        void hydrateSettings();
        void refreshDocumentContext("");
    }

    function render() {
        renderPanel(rootNode, state, dispatch);
    }

    async function dispatch(action) {
        if (!action || !action.type) return;

        if (action.type === "toggle-compact") {
            const compact = !state.compact;
            const nextState = Object.assign({}, state, { compact: compact });
            settingsStore.save({
                compact: compact,
                activeSurface: nextState.activeSurface,
                remoteConfig: nextState.remoteConfig
            });
            setState(nextState);
            return;
        }

        if (action.type === "set-surface") {
            const nextState = Object.assign({}, state, { activeSurface: action.surface || "control" });
            settingsStore.save({
                compact: nextState.compact,
                activeSurface: nextState.activeSurface,
                remoteConfig: nextState.remoteConfig
            });
            setState(nextState);
            return;
        }

        if (action.type === "refresh-host") {
            await refreshDocumentContext("Host-Status aktualisiert.");
            return;
        }

        if (action.type === "save-remote-config") {
            const remoteConfig = Object.assign({}, state.remoteConfig, action.remoteConfig || {});
            settingsStore.save({
                compact: state.compact,
                activeSurface: state.activeSurface,
                remoteConfig: remoteConfig
            });
            patchState({
                remoteConfig: remoteConfig,
                notice: "Remote-Update-Konfiguration gespeichert."
            });
            return;
        }

        if (action.type === "save-app-settings") {
            patchState({
                busyKey: "save-settings",
                notice: "Settings werden gespeichert..."
            });
            const savedSettings = await configService.saveSettings(action.settings || state.settings);
            patchState({
                busyKey: "",
                settings: savedSettings,
                settingsReady: true,
                notice: "UXP-Settings gespeichert."
            });
            return;
        }

        if (action.type === "pick-resource-file") {
            patchState({
                busyKey: "pick-" + String(action.kind || "resource"),
                notice: "Dateiauswahl wird geoeffnet..."
            });

            try {
                const nextSettings = await configService.chooseResource(state.settings, action.kind);
                patchState({
                    busyKey: "",
                    settings: nextSettings,
                    settingsReady: true,
                    notice: action.kind === "glossary"
                        ? "Glossar-Datei verbunden."
                        : "Memory-Datei verbunden."
                });
            } catch (error) {
                patchState({
                    busyKey: "",
                    notice: "Dateiauswahl fehlgeschlagen: " + (error && error.message ? error.message : "unbekannter Fehler")
                });
            }
            return;
        }

        if (action.type === "clear-resource-file") {
            const nextSettings = await configService.clearResource(state.settings, action.kind);
            patchState({
                settings: nextSettings,
                settingsReady: true,
                notice: action.kind === "glossary"
                    ? "Glossar-Verknuepfung entfernt."
                    : "Memory-Verknuepfung entfernt."
            });
            return;
        }

        if (action.type === "check-updates") {
            patchState({
                busyKey: "update-check",
                notice: "Remote-Manifest wird geprueft..."
            });
            const updateStatus = await updateService.checkForUpdates(state.remoteConfig);
            patchState({
                busyKey: "",
                updateStatus: updateStatus,
                notice: updateStatus.message
            });
            return;
        }

        if (action.type === "run-quick-action") {
            patchState({
                busyKey: action.actionId || "quick-action",
                notice: "Panel-Aktion wird vorbereitet..."
            });
            const result = await hostBridge.runQuickAction(action.actionId);
            patchState({
                busyKey: "",
                host: hostBridge.getSnapshot(),
                selectionQueue: result.selectionPayload ? result.selectionPayload.items : state.selectionQueue,
                selectionSummary: result.selectionPayload ? {
                    totalTargets: result.selectionPayload.totalTargets,
                    totalCharacters: result.selectionPayload.totalCharacters,
                    truncated: result.selectionPayload.truncated,
                    message: result.selectionPayload.message
                } : state.selectionSummary,
                notice: result.message || "Aktion vorbereitet."
            });
            return;
        }

        if (action.type === "debug-writeback-selection") {
            patchState({
                busyKey: "debug-writeback",
                notice: "Debug-Writeback wird ausgefuehrt..."
            });

            const debugRun = await hostBridge.applyDebugWritebackToSelection({ mode: "upper" });
            await refreshDocumentContext(debugRun.message);
            patchState({
                busyKey: "",
                debugRun: debugRun,
                notice: debugRun.message
            });
            return;
        }

        if (action.type === "undo-last-debug-writeback") {
            patchState({
                busyKey: "debug-undo",
                notice: "Undo fuer den letzten Debug-Test wird ausgefuehrt..."
            });

            const undoResult = await hostBridge.undoLastDocumentAction();
            await refreshDocumentContext(undoResult.message);
            patchState({
                busyKey: "",
                debugRun: Object.assign({}, state.debugRun, {
                    tone: undoResult.ok ? "ready" : "warm",
                    badge: undoResult.ok ? "Undo ok" : "Undo offen",
                    message: undoResult.message,
                    canUndo: false
                }),
                notice: undoResult.message
            });
        }
    }

    async function hydrateSettings() {
        patchState({
            busyKey: "hydrate-settings",
            notice: "UXP-Settings werden geladen..."
        });

        try {
            const loadedSettings = await configService.loadSettings();
            hydratedSettings = true;
            patchState({
                busyKey: "",
                settings: normalizeAppSettings(loadedSettings),
                settingsReady: true,
                notice: "UXP-Settings geladen."
            });
        } catch (error) {
            hydratedSettings = true;
            patchState({
                busyKey: "",
                settings: normalizeAppSettings(state.settings),
                settingsReady: true,
                notice: "Settings konnten nicht vollstaendig geladen werden. Es werden Default-Werte verwendet."
            });
        }
    }

    function refreshHostSnapshot() {
        void refreshDocumentContext("");
    }

    async function refreshDocumentContext(noticeText) {
        const snapshot = hostBridge.getSnapshot();
        const selectionPayload = hostBridge.collectSelectionQueue(12);
        patchState({
            host: snapshot,
            selectionQueue: selectionPayload.items,
            selectionSummary: {
                totalTargets: selectionPayload.totalTargets,
                totalCharacters: selectionPayload.totalCharacters,
                truncated: selectionPayload.truncated,
                message: selectionPayload.message
            },
            notice: noticeText || state.notice
        });
    }

    return {
        mount: mount,
        refreshHostSnapshot: refreshHostSnapshot
    };
}

module.exports = {
    attachPanel: attachPanel
};
