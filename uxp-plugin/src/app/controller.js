"use strict";

const { createInitialState } = require("./state");
const { renderPanel } = require("./render");
const { createHostBridge } = require("../host/indesign-host");
const { createUpdateService } = require("../services/update-service");
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
    const hostBridge = createHostBridge();
    const updateService = createUpdateService();
    let mounted = false;
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
            return;
        }
        mounted = true;
        rootNode.innerHTML = "";
        render();
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
            patchState({
                host: hostBridge.getSnapshot(),
                notice: "Host-Status aktualisiert."
            });
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
                notice: result.message || "Aktion vorbereitet."
            });
        }
    }

    function refreshHostSnapshot() {
        patchState({
            host: hostBridge.getSnapshot()
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
