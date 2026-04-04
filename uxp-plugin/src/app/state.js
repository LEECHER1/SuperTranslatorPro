"use strict";

const { normalizeRemoteConfig, buildDefaultUpdateStatus } = require("../services/update-service");

function createInitialState(storedState, hostSnapshot) {
    const safeState = storedState || {};
    return {
        compact: !!safeState.compact,
        activeSurface: safeState.activeSurface || "control",
        remoteConfig: normalizeRemoteConfig(safeState.remoteConfig),
        updateStatus: buildDefaultUpdateStatus(),
        busyKey: "",
        notice: "UXP-Grundgeruest bereit. Als Naechstes portieren wir Settings und den manuellen Uebersetzungsfluss.",
        host: hostSnapshot
    };
}

module.exports = {
    createInitialState: createInitialState
};
