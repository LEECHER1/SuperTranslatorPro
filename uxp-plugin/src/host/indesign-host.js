"use strict";

let indesignModule = null;

try {
    indesignModule = require("indesign");
} catch (error) {
    indesignModule = null;
}

function createHostBridge() {
    function getSnapshot() {
        const snapshot = {
            connected: false,
            appVersion: "Unbekannt",
            hasDocument: false,
            documentName: "",
            activePage: "-",
            selectionCount: 0,
            selectionLabel: "Keine Auswahl"
        };

        if (!indesignModule || !indesignModule.app) {
            return snapshot;
        }

        const app = indesignModule.app;
        snapshot.connected = true;

        try {
            snapshot.appVersion = String(app.version || "Verbunden");
        } catch (versionError) {
            snapshot.appVersion = "Verbunden";
        }

        try {
            if (app.documents && app.documents.length > 0) {
                const doc = app.activeDocument;
                snapshot.hasDocument = !!doc;
                snapshot.documentName = doc && doc.name ? String(doc.name) : "Unbenannt";
                snapshot.activePage = resolveActivePageLabel(app);
            }
        } catch (documentError) {
            snapshot.hasDocument = false;
            snapshot.documentName = "";
            snapshot.activePage = "-";
        }

        try {
            const selection = app.selection || [];
            snapshot.selectionCount = selection.length || 0;
            snapshot.selectionLabel = snapshot.selectionCount > 0
                ? snapshot.selectionCount + " Element(e) markiert"
                : "Keine Auswahl";
        } catch (selectionError) {
            snapshot.selectionCount = 0;
            snapshot.selectionLabel = "Keine Auswahl";
        }

        return snapshot;
    }

    async function runQuickAction(actionId) {
        if (actionId === "translate-selection") {
            return {
                message: "Die Auswahl-Übersetzung wird als erster produktiver UXP-Flow migriert. Das Host-Grundgeruest ist jetzt vorbereitet."
            };
        }

        if (actionId === "translate-pages") {
            return {
                message: "Der Seitenlauf folgt nach Settings, Provider und Speicher-Schicht. Das Panel ist bereits fuer diesen Workflow vorbereitet."
            };
        }

        if (actionId === "run-bda") {
            return {
                message: "Die BDA-Automatik bleibt vorerst im Legacy-Flow und wird spaeter schrittweise ueber die UXP-Host-Bruecke portiert."
            };
        }

        if (actionId === "source-check") {
            return {
                message: "Die Quellsprachen-Pruefung wird nach dem manuellen Uebersetzungsmodus als naechster intelligenter Workflow uebernommen."
            };
        }

        return {
            message: "Aktion vorbereitet."
        };
    }

    return {
        getSnapshot: getSnapshot,
        runQuickAction: runQuickAction
    };
}

function resolveActivePageLabel(app) {
    try {
        if (app.layoutWindows && app.layoutWindows.length > 0) {
            const windowRef = app.layoutWindows[0];
            if (windowRef.activePage && windowRef.activePage.name) {
                return String(windowRef.activePage.name);
            }
        }
    } catch (windowError) {}
    return "-";
}

module.exports = {
    createHostBridge: createHostBridge
};
