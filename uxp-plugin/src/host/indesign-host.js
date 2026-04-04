"use strict";

const {
    createDebugReplacement,
    getDebugModeLabel,
    normalizeDebugMode
} = require("../core/debug-translation");

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

    function collectSelectionQueue(limit) {
        const maxItems = typeof limit === "number" && limit > 0 ? limit : 12;
        const queue = [];
        let totalCharacters = 0;
        let truncated = false;

        if (!indesignModule || !indesignModule.app) {
            return buildSelectionPayload(queue, 0, totalCharacters, truncated, "InDesign ist nicht verbunden.");
        }

        const targets = collectResolvedSelectionTargets(indesignModule.app);

        for (let index = 0; index < targets.length; index += 1) {
            const payloadItem = buildQueueItem(targets[index]);
            if (!payloadItem) continue;

            totalCharacters += payloadItem.characters;

            if (queue.length < maxItems) {
                queue.push(payloadItem);
            } else {
                truncated = true;
            }
        }

        if (!targets.length) {
            return buildSelectionPayload(queue, 0, totalCharacters, truncated, "Keine uebersetzbare Text-Auswahl gefunden.");
        }

        return buildSelectionPayload(
            queue,
            targets.length,
            totalCharacters,
            truncated,
            "Auswahl erkannt: " + targets.length + " Textziel(e), " + totalCharacters + " Zeichen."
        );
    }

    function getSelectionTranslationPayload(limit) {
        const maxItems = typeof limit === "number" && limit > 0 ? limit : 24;
        const items = [];
        let totalCharacters = 0;
        let truncated = false;

        if (!indesignModule || !indesignModule.app) {
            return buildSelectionPayload(items, 0, totalCharacters, truncated, "InDesign ist nicht verbunden.");
        }

        const targets = collectResolvedSelectionTargets(indesignModule.app);

        for (let index = 0; index < targets.length; index += 1) {
            const target = targets[index];
            const sourceText = readTargetContents(target);
            const compactSource = normalizePreview(sourceText);
            if (!compactSource) continue;

            totalCharacters += sourceText.length;

            if (items.length < maxItems) {
                items.push({
                    id: getTargetUniqueId(target) || buildFallbackTargetId(target),
                    type: getConstructorName(target),
                    page: resolveTargetPageLabel(target),
                    text: sourceText,
                    preview: compactSource.length > 180 ? compactSource.slice(0, 177) + "..." : compactSource,
                    characters: sourceText.length
                });
            } else {
                truncated = true;
            }
        }

        return buildSelectionPayload(
            items,
            items.length,
            totalCharacters,
            truncated,
            items.length
                ? "DeepL-Test vorbereitet: " + items.length + " Textziel(e), " + totalCharacters + " Zeichen."
                : "Keine uebersetzbare Text-Auswahl gefunden."
        );
    }

    async function applyDebugWritebackToSelection(options) {
        const debugMode = normalizeDebugMode(options && options.mode);

        if (!indesignModule || !indesignModule.app) {
            return buildDebugRunReport({
                tone: "alert",
                badge: "Nicht verbunden",
                message: "InDesign ist nicht verbunden. Debug-Writeback konnte nicht ausgefuehrt werden.",
                mode: debugMode,
                canUndo: false
            });
        }

        const app = indesignModule.app;
        const targets = collectResolvedSelectionTargets(app);

        if (!targets.length) {
            return buildDebugRunReport({
                tone: "warm",
                badge: "Keine Auswahl",
                message: "Keine uebersetzbare Auswahl fuer den Debug-Writeback gefunden.",
                mode: debugMode,
                canUndo: !!getActiveDocument(app)
            });
        }

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        const items = [];

        for (let index = 0; index < targets.length; index += 1) {
            const target = targets[index];
            const sourceText = readTargetContents(target);
            const compactSource = normalizePreview(sourceText);

            if (!compactSource) {
                skippedCount += 1;
                items.push({
                    type: getConstructorName(target),
                    page: resolveTargetPageLabel(target),
                    status: "skipped",
                    before: "(leer)",
                    after: "(leer)",
                    reason: "Leerer Inhalt"
                });
                continue;
            }

            const replacement = createDebugReplacement(sourceText, debugMode);
            if (replacement === sourceText) {
                skippedCount += 1;
                items.push({
                    type: getConstructorName(target),
                    page: resolveTargetPageLabel(target),
                    status: "skipped",
                    before: compactSource.slice(0, 120),
                    after: compactSource.slice(0, 120),
                    reason: "Keine Aenderung"
                });
                continue;
            }

            try {
                target.contents = replacement;
                updatedCount += 1;
                items.push({
                    type: getConstructorName(target),
                    page: resolveTargetPageLabel(target),
                    status: "updated",
                    before: compactSource.slice(0, 120),
                    after: normalizePreview(replacement).slice(0, 120)
                });
            } catch (error) {
                errorCount += 1;
                items.push({
                    type: getConstructorName(target),
                    page: resolveTargetPageLabel(target),
                    status: "error",
                    before: compactSource.slice(0, 120),
                    after: "",
                    reason: sanitizeError(error)
                });
            }
        }

        return buildDebugRunReport({
            tone: errorCount ? "warm" : "ready",
            badge: errorCount ? "Mit Fehlern" : "Writeback ok",
            message: "Debug-Writeback (" + getDebugModeLabel(debugMode) + ") abgeschlossen: " +
                updatedCount + " aktualisiert, " + skippedCount + " uebersprungen, " + errorCount + " Fehler.",
            mode: debugMode,
            updatedCount: updatedCount,
            skippedCount: skippedCount,
            errorCount: errorCount,
            items: items,
            canUndo: !!getActiveDocument(app)
        });
    }

    async function applyTranslationsByTargetId(payloadItems, translatedTexts, options) {
        if (!indesignModule || !indesignModule.app) {
            return buildTranslationRunReport({
                tone: "alert",
                badge: "Nicht verbunden",
                message: "InDesign ist nicht verbunden. Die Uebersetzung konnte nicht geschrieben werden.",
                canUndo: false,
                targetLanguage: options && options.targetLanguage,
                detectedSourceLanguage: options && options.detectedSourceLanguage
            });
        }

        const app = indesignModule.app;
        const sourceItems = Array.isArray(payloadItems) ? payloadItems : [];
        const translations = Array.isArray(translatedTexts) ? translatedTexts : [];
        const targetMap = buildTargetMap(collectResolvedSelectionTargets(app));
        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        const items = [];

        for (let index = 0; index < sourceItems.length; index += 1) {
            const sourceItem = sourceItems[index] || {};
            const target = targetMap[sourceItem.id];
            const replacement = String(translations[index] === undefined || translations[index] === null ? "" : translations[index]);

            if (!target || !isValidItem(target)) {
                errorCount += 1;
                items.push({
                    type: sourceItem.type || "Unknown",
                    page: sourceItem.page || "-",
                    status: "error",
                    before: normalizePreview(sourceItem.text || "").slice(0, 120),
                    after: "",
                    reason: "Zielobjekt wurde in InDesign nicht mehr gefunden."
                });
                continue;
            }

            if (!normalizePreview(replacement)) {
                skippedCount += 1;
                items.push({
                    type: sourceItem.type || getConstructorName(target),
                    page: sourceItem.page || resolveTargetPageLabel(target),
                    status: "skipped",
                    before: normalizePreview(sourceItem.text || "").slice(0, 120),
                    after: "",
                    reason: "Leere Antwort vom Provider"
                });
                continue;
            }

            if (String(sourceItem.text || "") === replacement) {
                skippedCount += 1;
                items.push({
                    type: sourceItem.type || getConstructorName(target),
                    page: sourceItem.page || resolveTargetPageLabel(target),
                    status: "skipped",
                    before: normalizePreview(sourceItem.text || "").slice(0, 120),
                    after: normalizePreview(replacement).slice(0, 120),
                    reason: "Keine Aenderung"
                });
                continue;
            }

            try {
                target.contents = replacement;
                updatedCount += 1;
                items.push({
                    type: sourceItem.type || getConstructorName(target),
                    page: sourceItem.page || resolveTargetPageLabel(target),
                    status: "updated",
                    before: normalizePreview(sourceItem.text || "").slice(0, 120),
                    after: normalizePreview(replacement).slice(0, 120)
                });
            } catch (error) {
                errorCount += 1;
                items.push({
                    type: sourceItem.type || getConstructorName(target),
                    page: sourceItem.page || resolveTargetPageLabel(target),
                    status: "error",
                    before: normalizePreview(sourceItem.text || "").slice(0, 120),
                    after: "",
                    reason: sanitizeError(error)
                });
            }
        }

        return buildTranslationRunReport({
            tone: errorCount ? "warm" : "ready",
            badge: errorCount ? "Mit Fehlern" : "DeepL ok",
            message: "DeepL-Writeback abgeschlossen: " +
                updatedCount + " aktualisiert, " + skippedCount + " uebersprungen, " + errorCount + " Fehler.",
            updatedCount: updatedCount,
            skippedCount: skippedCount,
            errorCount: errorCount,
            items: items,
            canUndo: !!getActiveDocument(app),
            targetLanguage: options && options.targetLanguage,
            detectedSourceLanguage: options && options.detectedSourceLanguage
        });
    }

    async function undoLastDocumentAction() {
        if (!indesignModule || !indesignModule.app) {
            return {
                ok: false,
                message: "InDesign ist nicht verbunden. Undo konnte nicht ausgefuehrt werden."
            };
        }

        const doc = getActiveDocument(indesignModule.app);
        if (!doc || !doc.isValid || typeof doc.undo !== "function") {
            return {
                ok: false,
                message: "Kein aktives Dokument mit Undo-Funktion verfuegbar."
            };
        }

        try {
            doc.undo();
            return {
                ok: true,
                message: "Die letzte Dokument-Aktion wurde rueckgaengig gemacht."
            };
        } catch (error) {
            return {
                ok: false,
                message: "Undo fehlgeschlagen: " + sanitizeError(error)
            };
        }
    }

    async function runQuickAction(actionId) {
        if (actionId === "translate-selection") {
            const selectionPayload = collectSelectionQueue(14);
            return {
                message: selectionPayload.message,
                selectionPayload: selectionPayload
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
        applyDebugWritebackToSelection: applyDebugWritebackToSelection,
        applyTranslationsByTargetId: applyTranslationsByTargetId,
        collectSelectionQueue: collectSelectionQueue,
        getSnapshot: getSnapshot,
        getSelectionTranslationPayload: getSelectionTranslationPayload,
        runQuickAction: runQuickAction,
        undoLastDocumentAction: undoLastDocumentAction
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

function safeSelection(app) {
    try {
        return app.selection || [];
    } catch (error) {
        return [];
    }
}

function collectResolvedSelectionTargets(app) {
    const targets = [];
    const seenIds = {};
    const selectionItems = safeSelection(app);

    for (let index = 0; index < selectionItems.length; index += 1) {
        const itemTargets = extractTextTargetsFromSelectionItem(selectionItems[index]);
        for (let targetIndex = 0; targetIndex < itemTargets.length; targetIndex += 1) {
            const target = itemTargets[targetIndex];
            const targetId = getTargetUniqueId(target);
            if (targetId && seenIds[targetId]) continue;
            if (targetId) seenIds[targetId] = true;
            targets.push(target);
        }
    }

    return targets;
}

function extractTextTargetsFromSelectionItem(item) {
    const targets = [];
    if (!item || !isValidItem(item)) return targets;

    const typeName = getConstructorName(item);

    if (typeName === "TextFrame") {
        pushIfValid(targets, resolveTextTarget(item));
        return targets;
    }

    if (typeName === "Cell") {
        pushIfValid(targets, resolveCellText(item));
        return targets;
    }

    if (typeName === "Table") {
        return extractCellTargetsFromTable(item);
    }

    if (typeName === "Group") {
        return extractTargetsFromGroup(item);
    }

    if (looksLikeTextObject(item)) {
        pushIfValid(targets, item);
    }

    return targets;
}

function extractTargetsFromGroup(group) {
    const targets = [];
    let pageItems = [];
    try {
        pageItems = group.allPageItems || [];
    } catch (error) {
        pageItems = [];
    }

    for (let index = 0; index < pageItems.length; index += 1) {
        const item = pageItems[index];
        if (!item || !isValidItem(item)) continue;
        if (getConstructorName(item) === "TextFrame") {
            pushIfValid(targets, resolveTextTarget(item));
        }
    }

    return targets;
}

function extractCellTargetsFromTable(table) {
    const targets = [];
    let cells = [];
    try {
        cells = table.cells || [];
    } catch (error) {
        cells = [];
    }

    for (let index = 0; index < cells.length; index += 1) {
        pushIfValid(targets, resolveCellText(cells[index]));
    }

    return targets;
}

function resolveTextTarget(textFrame) {
    try {
        if (textFrame.parentStory && textFrame.parentStory.isValid) return textFrame.parentStory;
    } catch (error) {}

    try {
        if (textFrame.texts && textFrame.texts.length > 0 && textFrame.texts[0] && textFrame.texts[0].isValid) {
            return textFrame.texts[0];
        }
    } catch (fallbackError) {}

    return null;
}

function resolveCellText(cell) {
    try {
        if (cell.texts && cell.texts.length > 0 && cell.texts[0] && cell.texts[0].isValid) {
            return cell.texts[0];
        }
    } catch (error) {}
    return null;
}

function buildQueueItem(target) {
    if (!target || !isValidItem(target)) return null;

    const contents = readTargetContents(target);
    const preview = normalizePreview(contents);
    if (!preview) return null;

    return {
        id: getTargetUniqueId(target) || buildFallbackTargetId(target),
        type: getConstructorName(target),
        page: resolveTargetPageLabel(target),
        preview: preview.length > 180 ? preview.slice(0, 177) + "..." : preview,
        characters: preview.length
    };
}

function buildSelectionPayload(queue, totalTargets, totalCharacters, truncated, message) {
    return {
        items: queue,
        totalTargets: totalTargets,
        totalCharacters: totalCharacters,
        truncated: truncated,
        message: message
    };
}

function buildDebugRunReport(fields) {
    return {
        tone: fields.tone || "muted",
        badge: fields.badge || "Debug",
        message: fields.message || "",
        mode: normalizeDebugMode(fields.mode),
        updatedCount: fields.updatedCount || 0,
        skippedCount: fields.skippedCount || 0,
        errorCount: fields.errorCount || 0,
        items: fields.items || [],
        canUndo: !!fields.canUndo
    };
}

function buildTranslationRunReport(fields) {
    return {
        tone: fields.tone || "muted",
        badge: fields.badge || "DeepL",
        message: fields.message || "",
        updatedCount: fields.updatedCount || 0,
        skippedCount: fields.skippedCount || 0,
        errorCount: fields.errorCount || 0,
        items: fields.items || [],
        canUndo: !!fields.canUndo,
        provider: "DeepL",
        targetLanguage: String(fields.targetLanguage || "DE"),
        detectedSourceLanguage: String(fields.detectedSourceLanguage || "")
    };
}

function readTargetContents(target) {
    try {
        if (typeof target.contents !== "undefined" && target.contents !== null) {
            return String(target.contents);
        }
    } catch (error) {}
    return "";
}

function resolveTargetPageLabel(target) {
    try {
        if (target.parentTextFrames && target.parentTextFrames.length > 0) {
            const frame = target.parentTextFrames[0];
            if (frame && frame.parentPage && frame.parentPage.name) return String(frame.parentPage.name);
        }
    } catch (error) {}

    try {
        if (target.parentPage && target.parentPage.name) return String(target.parentPage.name);
    } catch (fallbackError) {}

    return "-";
}

function getTargetUniqueId(target) {
    try {
        if (target.id !== undefined && target.id !== null) {
            return getConstructorName(target) + ":" + String(target.id);
        }
    } catch (error) {}
    return "";
}

function buildFallbackTargetId(target) {
    return getConstructorName(target) + ":" + normalizePreview(readTargetContents(target)).slice(0, 32);
}

function buildTargetMap(targets) {
    const map = {};
    const safeTargets = Array.isArray(targets) ? targets : [];

    for (let index = 0; index < safeTargets.length; index += 1) {
        const target = safeTargets[index];
        const targetId = getTargetUniqueId(target) || buildFallbackTargetId(target);
        if (!targetId) continue;
        map[targetId] = target;
    }

    return map;
}

function normalizePreview(text) {
    return String(text || "").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
}

function looksLikeTextObject(item) {
    try {
        if (Object.prototype.hasOwnProperty.call(item, "baseline")) return true;
    } catch (error) {}
    return false;
}

function getConstructorName(item) {
    try {
        if (item && item.constructor && item.constructor.name) return String(item.constructor.name);
    } catch (error) {}
    return "Unknown";
}

function isValidItem(item) {
    try {
        return !!item && item.isValid !== false;
    } catch (error) {
        return false;
    }
}

function pushIfValid(targets, item) {
    if (item && isValidItem(item)) targets.push(item);
}

function getActiveDocument(app) {
    try {
        if (app.documents && app.documents.length > 0) return app.activeDocument;
    } catch (error) {}
    return null;
}

function sanitizeError(error) {
    return error && error.message ? String(error.message) : "unbekannter Fehler";
}

module.exports = {
    createHostBridge: createHostBridge
};
