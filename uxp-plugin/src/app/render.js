"use strict";

const {
    PROVIDER_OPTIONS,
    TARGET_LANGUAGE_OPTIONS,
    UI_LANGUAGE_OPTIONS,
    buildProviderStatus,
    buildResourceStatus,
    getActiveProviderModel,
    getMaskedSecret
} = require("../config/settings-model");

function renderPanel(rootNode, state, dispatch) {
    rootNode.innerHTML = buildMarkup(state);
    bindActions(rootNode, state, dispatch);
}

function buildMarkup(state) {
    const compactClass = state.compact ? " is-compact" : "";
    return [
        '<div class="stp-shell' + compactClass + '">',
        buildHeader(state),
        buildStatusBand(state),
        buildSurfaceNav(state),
        '<div class="stp-main">',
        buildSurface(state),
        "</div>",
        buildFooter(state),
        "</div>"
    ].join("");
}

function buildHeader(state) {
    const densityLabel = state.compact ? "Full Panel" : "Mini Bar";
    return [
        '<header class="stp-header">',
        '<div class="stp-brand">',
        '<p class="stp-kicker">UXP migration shell</p>',
        '<h1 class="stp-title">SuperTranslatorPro</h1>',
        '<p class="stp-subtitle">Dockbares Panel mit Thin-Shell-Architektur, vorbereitet fuer Remote-Updates, Offline-Fallback und spaetere Feature-Paritaet.</p>',
        "</div>",
        '<div class="stp-header-actions">',
        '<span class="stp-chip stp-chip-' + escapeHtml(state.updateStatus.tone) + '">' + escapeHtml(state.updateStatus.badge) + "</span>",
        '<button class="stp-ghost-button" data-action="toggle-compact">' + escapeHtml(densityLabel) + "</button>",
        "</div>",
        "</header>"
    ].join("");
}

function buildStatusBand(state) {
    const host = state.host;
    return [
        '<section class="stp-status-band">',
        buildMetricCard("Host", host.connected ? "Verbunden" : "Nicht verbunden", host.connected ? host.appVersion : "InDesign nicht lesbar"),
        buildMetricCard("Dokument", host.documentName || "Kein Dokument", host.hasDocument ? "Seite " + host.activePage : "Bereit fuer Setup"),
        buildMetricCard("Auswahl", String(host.selectionCount), host.selectionLabel),
        buildMetricCard("Remote", state.remoteConfig.manifestUrl ? "Aktiviert" : "Noch leer", state.updateStatus.sourceLabel),
        "</section>"
    ].join("");
}

function buildMetricCard(label, value, meta) {
    return [
        '<article class="stp-metric-card">',
        '<span class="stp-metric-label">' + escapeHtml(label) + "</span>",
        '<strong class="stp-metric-value">' + escapeHtml(value) + "</strong>",
        '<span class="stp-metric-meta">' + escapeHtml(meta) + "</span>",
        "</article>"
    ].join("");
}

function buildSurfaceNav(state) {
    return [
        '<nav class="stp-surface-nav" aria-label="Panel Views">',
        buildSurfaceButton("control", "Steuerung", state.activeSurface),
        buildSurfaceButton("setup", "Setup", state.activeSurface),
        buildSurfaceButton("updates", "Updates", state.activeSurface),
        "</nav>"
    ].join("");
}

function buildSurfaceButton(id, label, activeSurface) {
    const activeClass = activeSurface === id ? " is-active" : "";
    return '<button class="stp-surface-button' + activeClass + '" data-surface="' + escapeHtml(id) + '">' + escapeHtml(label) + "</button>";
}

function buildSurface(state) {
    if (state.activeSurface === "setup") return buildSetupSurface(state);
    if (state.activeSurface === "updates") return buildUpdatesSurface(state);
    return buildControlSurface(state);
}

function buildControlSurface(state) {
    const host = state.host;
    const selectionSummary = state.selectionSummary;
    const debugRun = state.debugRun;
    const translationRun = state.translationRun;
    const settings = state.settings;
    const providerStatus = buildProviderStatus(settings);
    return [
        '<section class="stp-grid">',
        '<article class="stp-card stp-card-hero">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Arbeitsflaeche</span>',
        '<h2>Benutzbarer Live-Test</h2>',
        "</div>",
        '<p>Ich habe die Startseite jetzt auf den eigentlichen Arbeitsfluss reduziert: Auswahl lesen, DeepL-Key eingeben, Ziel waehlen und direkt ins Dokument zurueckschreiben.</p>',
        buildToneNote(providerStatus),
        '<div class="stp-button-row">',
        '<button class="stp-secondary-button" data-surface="setup">Setup oeffnen</button>',
        '<button class="stp-secondary-button" data-surface="updates">Updates</button>',
        '<button class="stp-ghost-button" data-action="toggle-compact">' + escapeHtml(state.compact ? "Full Panel" : "Mini Bar") + "</button>",
        '</div>',
        "</article>",
        '<form class="stp-card stp-form" data-form="deepl-quick-test">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">DeepL Schnelltest</span>',
        '<h2>Erste echte Uebersetzung</h2>',
        "</div>",
        '<p>Dieser Test arbeitet absichtlich direkt auf der Startseite. DeepL-Key und Zielsprache werden gespeichert, dann wird die aktuelle InDesign-Auswahl gelesen und direkt ersetzt.</p>',
        '<div class="stp-field-grid">',
        buildPasswordField("deeplKey", "DeepL API Key", settings.secrets.deeplKey, "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx"),
        buildSelectField("targetLanguage", "Zielsprache", TARGET_LANGUAGE_OPTIONS, settings.translation.targetLanguage),
        '</div>',
        buildToneNote(translationRun),
        '<div class="stp-status-stack">',
        buildMetricCard("Aktualisiert", String(translationRun.updatedCount), translationRun.detectedSourceLanguage ? "Quelle " + translationRun.detectedSourceLanguage : "Direkter Writeback"),
        buildMetricCard("Uebersprungen", String(translationRun.skippedCount), translationRun.targetLanguage ? "Ziel " + translationRun.targetLanguage : "Ziel offen"),
        buildMetricCard("Fehler", String(translationRun.errorCount), translationRun.canUndo ? "Undo verfuegbar" : "Noch kein Undo"),
        '</div>',
        buildTranslationRunItems(translationRun),
        '<div class="stp-form-actions">',
        '<button class="stp-primary-button" type="submit"' + (host.hasDocument && state.settingsReady && state.busyKey !== "deepl-translation" ? "" : ' disabled="disabled"') + '>DeepL Auswahl uebersetzen</button>',
        '<button class="stp-secondary-button" type="button" data-action="undo-last-debug-writeback"' + (translationRun.canUndo ? "" : ' disabled="disabled"') + '>Letzte Aenderung rueckgaengig</button>',
        '</div>',
        "</form>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Selection Queue</span>',
        '<h2>Auswahl pruefen</h2>',
        "</div>",
        '<div class="stp-status-stack">',
        buildMetricCard("Textziele", String(selectionSummary.totalTargets), selectionSummary.truncated ? "Vorschau gekuerzt" : "Vorschau komplett"),
        buildMetricCard("Zeichen", String(selectionSummary.totalCharacters), selectionSummary.message),
        "</div>",
        buildSelectionQueue(state.selectionQueue, selectionSummary),
        '<div class="stp-button-row">',
        '<button class="stp-primary-button" data-quick-action="translate-selection"' + (host.hasDocument ? "" : ' disabled="disabled"') + '>Auswahl vorbereiten</button>',
        '<button class="stp-secondary-button" data-action="refresh-host">Auswahl neu lesen</button>',
        "</div>",
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Debug Writeback</span>',
        '<h2>Sicherer Live-Test fuer Lesen und Schreiben</h2>',
        "</div>",
        '<p>Der erste Dokument-Test arbeitet noch ohne echten Provider. Er schreibt die aktuelle Auswahl in <strong>Uppercase</strong> zurueck, damit wir Host-Zugriff, Writeback und Undo getrennt debuggen koennen.</p>',
        buildToneNote(debugRun),
        '<div class="stp-status-stack">',
        buildMetricCard("Aktualisiert", String(debugRun.updatedCount), "Writeback erfolgreich"),
        buildMetricCard("Uebersprungen", String(debugRun.skippedCount), "Leer oder unveraendert"),
        buildMetricCard("Fehler", String(debugRun.errorCount), "Fuer die Bug-Suche wichtig"),
        '</div>',
        buildDebugRunItems(debugRun),
        '<div class="stp-button-row">',
        '<button class="stp-primary-button" data-action="debug-writeback-selection"' + (host.hasDocument ? "" : ' disabled="disabled"') + (state.busyKey === "debug-writeback" ? ' disabled="disabled"' : "") + '>Debug Writeback starten</button>',
        '<button class="stp-secondary-button" data-action="undo-last-debug-writeback"' + (debugRun.canUndo ? "" : ' disabled="disabled"') + '>Letzten Test rueckgaengig machen</button>',
        '</div>',
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Host Snapshot</span>',
        '<h2>InDesign-Zustand</h2>',
        "</div>",
        buildListBlock([
            "Host-Version: " + host.appVersion,
            "Dokument: " + (host.documentName || "Keins"),
            "Aktive Seite: " + host.activePage,
            "Auswahl: " + host.selectionLabel
        ]),
        '<div class="stp-button-row">',
        '<button class="stp-secondary-button" data-action="refresh-host">Status neu laden</button>',
        '<button class="stp-ghost-button" data-quick-action="source-check"' + (host.hasDocument ? "" : ' disabled="disabled"') + '>Quellsprache pruefen</button>',
        '</div>',
        "</article>",
        "</section>"
    ].join("");
}

function buildActionButton(actionId, label, enabled) {
    const disabledAttr = enabled ? "" : ' disabled="disabled"';
    return '<button class="stp-action-button" data-quick-action="' + escapeHtml(actionId) + '"' + disabledAttr + ">" + escapeHtml(label) + "</button>";
}

function buildSetupSurface(state) {
    if (!state.settingsReady) {
        return [
            '<section class="stp-grid">',
            '<article class="stp-card stp-card-hero">',
            '<div class="stp-card-head">',
            '<span class="stp-section-kicker">Settings</span>',
            '<h2>Konfiguration wird geladen</h2>',
            "</div>",
            '<p>Provider, Dateiquellen und Persistenzschicht werden gerade aus dem lokalen Speicher und dem Secure Store geladen.</p>',
            "</article>",
            "</section>"
        ].join("");
    }

    const settings = state.settings;
    const providerStatus = buildProviderStatus(settings);
    const resourceStatus = buildResourceStatus(settings);

    return [
        '<section class="stp-grid stp-grid-two">',
        '<article class="stp-card stp-card-hero">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Konfigurationsbasis</span>',
        '<h2>Provider, Datenquellen und Runtime-Settings</h2>',
        "</div>",
        '<p>Hier bilden wir die bestehende SuperTranslatorPro-Konfiguration fuer UXP nach: Providerwahl, API-Zugaenge, Glossar, Memory, Automatik und Copyfit. Sensible Schluessel liegen getrennt im Secure Store.</p>',
        '<div class="stp-status-stack">',
        buildToneNote(providerStatus),
        buildToneNote(resourceStatus),
        buildMetricCard("Aktiver Provider", getProviderLabel(settings.translationProvider), getActiveProviderModel(settings)),
        buildMetricCard("UI", getUiLanguageLabel(settings.uiLanguage), settings.automation.autoHyperlinks ? "Auto-Links an" : "Auto-Links aus"),
        "</div>",
        "</article>",
        '<form class="stp-card stp-settings-form" data-form="app-settings">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Setup</span>',
        '<h2>Allgemeine Einstellungen</h2>',
        "</div>",
        '<div class="stp-field-grid stp-field-grid-two">',
        buildSelectField("translationProvider", "Aktiver Provider", PROVIDER_OPTIONS, settings.translationProvider),
        buildSelectField("uiLanguage", "UI-Sprache", UI_LANGUAGE_OPTIONS, settings.uiLanguage),
        buildSelectField("targetLanguage", "Standard-Zielsprache", TARGET_LANGUAGE_OPTIONS, settings.translation.targetLanguage),
        buildTextField("refSymbols", "Referenz-Symbole", settings.automation.refSymbols, "[]"),
        buildTextField("backPageTracker", "Rueckseiten-Suche", settings.automation.backPageTracker, "©"),
        buildCheckboxField("autoHyperlinks", "Auto-Hyperlinks im BDA-Modus aktivieren", settings.automation.autoHyperlinks),
        buildCheckboxField("copyfitEnabled", "Smart Copyfit aktivieren", settings.typography.copyfitEnabled),
        buildNumberField("copyfitMaxTracking", "Copyfit Tracking bis", settings.typography.copyfitMaxTracking, -100, 0, 1),
        buildNumberField("copyfitMinScale", "Copyfit Scale bis", settings.typography.copyfitMinScale, 50, 100, 1),
        buildNumberField("copyfitTrackingStep", "Tracking-Schrittweite", settings.typography.copyfitTrackingStep, 1, 20, 1),
        buildNumberField("copyfitScaleStep", "Scale-Schrittweite", settings.typography.copyfitScaleStep, 1, 10, 1),
        buildCheckboxField("fontFallbackEnabled", "Font-Fallbacks aktivieren", settings.typography.fontFallbackEnabled),
        "</div>",
        '<label class="stp-field stp-field-full">',
        '<span>Font-Fallback-Regeln</span>',
        '<textarea name="fontFallbackRules" rows="6" placeholder="ARABIC=Adobe Arabic&#10;CYRILLIC=Arial">' + escapeHtml(settings.typography.fontFallbackRules) + "</textarea>",
        "</label>",
        '<div class="stp-form-actions">',
        '<button class="stp-primary-button" type="submit"' + (state.busyKey === "save-settings" ? ' disabled="disabled"' : "") + '>Settings speichern</button>',
        "</div>",
        "</form>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Provider</span>',
        '<h2>Zugangsdaten und Modelle</h2>',
        "</div>",
        '<p>API-Keys werden getrennt vom Rest gespeichert. In UXP nutzt die Shell dafuer `secureStorage`, waehrend nicht-sensitive Einstellungen im lokalen Key-Value-Store liegen.</p>',
        '<form class="stp-provider-stack" data-form="provider-settings">',
        buildProviderCard("deepl", settings, [
            buildPasswordField("deeplKey", "DeepL API Key", settings.secrets.deeplKey, "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx")
        ]),
        buildProviderCard("openai", settings, [
            buildPasswordField("openaiKey", "OpenAI API Key", settings.secrets.openaiKey, "sk-..."),
            buildTextField("openaiModel", "OpenAI Modell", settings.providers.openaiModel, "gpt-5.4-mini")
        ]),
        buildProviderCard("gemini", settings, [
            buildPasswordField("geminiKey", "Gemini API Key", settings.secrets.geminiKey, "AIza..."),
            buildTextField("geminiModel", "Gemini Modell", settings.providers.geminiModel, "gemini-2.5-flash")
        ]),
        buildProviderCard("claude", settings, [
            buildPasswordField("claudeKey", "Claude API Key", settings.secrets.claudeKey, "sk-ant-..."),
            buildTextField("claudeModel", "Claude Modell", settings.providers.claudeModel, "claude-sonnet-4-6")
        ]),
        buildProviderCard("local", settings, [
            buildTextField("localBaseUrl", "Local Base URL", settings.providers.localBaseUrl, "http://127.0.0.1:1234/v1"),
            buildPasswordField("localApiKey", "Local API Key", settings.secrets.localApiKey, "optional"),
            buildTextField("localModel", "Local Modell", settings.providers.localModel, "qwen / llama / mistral")
        ]),
        '<div class="stp-form-actions">',
        '<button class="stp-primary-button" type="submit"' + (state.busyKey === "save-settings" ? ' disabled="disabled"' : "") + '>Provider speichern</button>',
        "</div>",
        "</form>",
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Dateiquellen</span>',
        '<h2>Glossar und Memory</h2>',
        "</div>",
        '<div class="stp-resource-stack">',
        buildResourceCard("Glossar CSV", settings.resources.glossaryPath, settings.resources.glossaryStatus, "glossary", state.busyKey),
        buildResourceCard("Translation Memory", settings.resources.memoryPath, settings.resources.memoryStatus, "memory", state.busyKey),
        "</div>",
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Remote Basis</span>',
        '<h2>Thin-Shell + Update-Kanal</h2>',
        "</div>",
        '<p>Manifest, Host-Bruecke und Sicherheits-Fallback bleiben lokal versioniert. Die Remote-Konfiguration bleibt separat, damit spaetere Online-Module oder Feature-Flags die installierte Basis nicht aufblaehen.</p>',
        '<form class="stp-form" data-form="remote-config">',
        '<label class="stp-field">',
        '<span>Manifest URL</span>',
        '<input type="url" name="manifestUrl" value="' + escapeAttribute(state.remoteConfig.manifestUrl) + '" placeholder="https://example.com/stp/manifest.json" />',
        "</label>",
        '<label class="stp-field">',
        '<span>Bundle Base URL</span>',
        '<input type="url" name="bundleBaseUrl" value="' + escapeAttribute(state.remoteConfig.bundleBaseUrl) + '" placeholder="https://example.com/stp/" />',
        "</label>",
        '<label class="stp-field">',
        '<span>Kanal</span>',
        '<select name="channel">',
        buildOption("stable", "Stable", state.remoteConfig.channel),
        buildOption("beta", "Beta", state.remoteConfig.channel),
        buildOption("internal", "Internal", state.remoteConfig.channel),
        "</select>",
        "</label>",
        '<button class="stp-primary-button" type="submit">Remote-Konfiguration speichern</button>',
        "</form>",
        "</article>",
        "</section>"
    ].join("");
}

function buildUpdatesSurface(state) {
    return [
        '<section class="stp-grid stp-grid-two">',
        '<article class="stp-card stp-card-hero">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Update-Status</span>',
        '<h2>Remote-Check</h2>',
        "</div>",
        '<p class="stp-update-copy">' + escapeHtml(state.updateStatus.message) + "</p>",
        '<div class="stp-update-grid">',
        buildMetricCard("Quelle", state.updateStatus.sourceLabel, state.updateStatus.checkedAtLabel),
        buildMetricCard("Version", state.updateStatus.versionLabel, state.updateStatus.channelLabel),
        "</div>",
        '<button class="stp-primary-button" data-action="check-updates"' + (state.busyKey === "update-check" ? ' disabled="disabled"' : "") + '>Update-Check ausfuehren</button>',
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Fallback</span>',
        '<h2>Offline-Verhalten</h2>',
        "</div>",
        buildListBlock([
            "Remote zuerst, Cache wenn vorhanden, sonst lokaler Kern",
            "Klare Rollback-Punkte fuer produktive Nutzer",
            "Keine harte Abhaengigkeit vom Netzwerk fuer das Starten des Panels"
        ]),
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Hinweis</span>',
        '<h2>UXP-Leitplanken</h2>',
        "</div>",
        '<p>Das Panel ist fuer Remote-Updates vorbereitet, aber die genaue Grenze zwischen lokalem Kern und online gepflegter Logik wird bewusst frueh validiert. Genau deshalb ist die Update-Schicht bereits jetzt separat angelegt.</p>',
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Naechster Port</span>',
        '<h2>Was als Nächstes kommt</h2>',
        "</div>",
        buildListBlock([
            "Legacy-Settings an echte Host-Aufrufe anbinden",
            "Auswahl uebersetzen als ersten produktiven UXP-Flow portieren",
            "Glossar- und Memory-Dateien spaeter wirklich lesen und schreiben"
        ]),
        "</article>",
        "</section>"
    ].join("");
}

function buildSelectionQueue(items, summary) {
    if (!items || !items.length) {
        return [
            '<div class="stp-empty-state">',
            '<p>' + escapeHtml(summary && summary.message ? summary.message : "Noch keine Auswahl gelesen.") + "</p>",
            "</div>"
        ].join("");
    }

    const rows = items.map(function (item) {
        return [
            '<article class="stp-queue-item">',
            '<div class="stp-queue-head">',
            '<strong>' + escapeHtml(item.type) + "</strong>",
            '<span>Seite ' + escapeHtml(item.page) + " · " + escapeHtml(String(item.characters)) + " Zeichen</span>",
            "</div>",
            '<p>' + escapeHtml(item.preview) + "</p>",
            "</article>"
        ].join("");
    }).join("");

    return '<div class="stp-queue-list">' + rows + "</div>";
}

function buildDebugRunItems(debugRun) {
    const items = debugRun && debugRun.items ? debugRun.items : [];
    if (!items.length) {
        return [
            '<div class="stp-empty-state">',
            '<p>Noch kein Debug-Writeback ausgefuehrt.</p>',
            "</div>"
        ].join("");
    }

    const rows = items.slice(0, 8).map(function (item) {
        const statusClass = item.status === "error" ? " stp-debug-item-error" : (item.status === "updated" ? " stp-debug-item-ready" : "");
        return [
            '<article class="stp-debug-item' + statusClass + '">',
            '<div class="stp-debug-head">',
            '<strong>' + escapeHtml(item.type) + " · Seite " + escapeHtml(item.page) + "</strong>",
            '<span>' + escapeHtml(item.status) + "</span>",
            "</div>",
            '<p><b>Vorher:</b> ' + escapeHtml(item.before || "") + "</p>",
            '<p><b>Nachher:</b> ' + escapeHtml(item.after || item.reason || "") + "</p>",
            item.reason ? '<p><b>Hinweis:</b> ' + escapeHtml(item.reason) + "</p>" : "",
            "</article>"
        ].join("");
    }).join("");

    return '<div class="stp-debug-list">' + rows + "</div>";
}

function buildTranslationRunItems(translationRun) {
    const items = translationRun && translationRun.items ? translationRun.items : [];
    if (!items.length) {
        return [
            '<div class="stp-empty-state">',
            '<p>Noch keine DeepL-Antwort im Dokument geschrieben.</p>',
            "</div>"
        ].join("");
    }

    const rows = items.slice(0, 8).map(function (item) {
        const statusClass = item.status === "error" ? " stp-debug-item-error" : (item.status === "updated" ? " stp-debug-item-ready" : "");
        return [
            '<article class="stp-debug-item' + statusClass + '">',
            '<div class="stp-debug-head">',
            '<strong>' + escapeHtml(item.type) + " · Seite " + escapeHtml(item.page) + "</strong>",
            '<span>' + escapeHtml(item.status) + "</span>",
            "</div>",
            '<p><b>Vorher:</b> ' + escapeHtml(item.before || "") + "</p>",
            '<p><b>Nachher:</b> ' + escapeHtml(item.after || item.reason || "") + "</p>",
            item.reason ? '<p><b>Hinweis:</b> ' + escapeHtml(item.reason) + "</p>" : "",
            "</article>"
        ].join("");
    }).join("");

    return '<div class="stp-debug-list">' + rows + "</div>";
}

function buildFooter(state) {
    return [
        '<footer class="stp-footer">',
        '<div class="stp-footer-copy">',
        '<span class="stp-footer-label">Hinweis</span>',
        '<p>' + escapeHtml(state.notice) + "</p>",
        "</div>",
        '<div class="stp-footer-actions">',
        '<button class="stp-secondary-button" data-action="refresh-host">Refresh</button>',
        '<button class="stp-secondary-button" data-action="check-updates"' + (state.busyKey === "update-check" ? ' disabled="disabled"' : "") + '>Check</button>',
        "</div>",
        "</footer>"
    ].join("");
}

function bindActions(rootNode, state, dispatch) {
    const actionButtons = rootNode.querySelectorAll("[data-action]");
    actionButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            dispatch({ type: button.getAttribute("data-action") });
        });
    });

    const surfaceButtons = rootNode.querySelectorAll("[data-surface]");
    surfaceButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            dispatch({
                type: "set-surface",
                surface: button.getAttribute("data-surface")
            });
        });
    });

    const quickActions = rootNode.querySelectorAll("[data-quick-action]");
    quickActions.forEach(function (button) {
        button.addEventListener("click", function () {
            if (button.disabled) return;
            dispatch({
                type: "run-quick-action",
                actionId: button.getAttribute("data-quick-action")
            });
        });
    });

    const remoteConfigForm = rootNode.querySelector('[data-form="remote-config"]');
    if (remoteConfigForm) {
        remoteConfigForm.addEventListener("submit", function (event) {
            event.preventDefault();
            dispatch({
                type: "save-remote-config",
                remoteConfig: {
                    manifestUrl: remoteConfigForm.manifestUrl.value,
                    bundleBaseUrl: remoteConfigForm.bundleBaseUrl.value,
                    channel: remoteConfigForm.channel.value
                }
            });
        });
    }

    const appSettingsForm = rootNode.querySelector('[data-form="app-settings"]');
    if (appSettingsForm) {
        appSettingsForm.addEventListener("submit", function (event) {
            event.preventDefault();
            dispatch({
                type: "save-app-settings",
                settings: readSettingsFromForm(appSettingsForm, state.settings)
            });
        });
    }

    const providerSettingsForm = rootNode.querySelector('[data-form="provider-settings"]');
    if (providerSettingsForm) {
        providerSettingsForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const combinedSettings = mergeProviderFormIntoSettings(providerSettingsForm, state.settings);
            dispatch({
                type: "save-app-settings",
                settings: combinedSettings
            });
        });
    }

    const deeplQuickForm = rootNode.querySelector('[data-form="deepl-quick-test"]');
    if (deeplQuickForm) {
        deeplQuickForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const nextSettings = cloneSettings(state.settings);
            nextSettings.translation.targetLanguage = deeplQuickForm.targetLanguage.value;
            nextSettings.secrets.deeplKey = deeplQuickForm.deeplKey.value || nextSettings.secrets.deeplKey;
            dispatch({
                type: "run-deepl-selection-test",
                settings: nextSettings
            });
        });
    }

    const pickButtons = rootNode.querySelectorAll("[data-pick-resource]");
    pickButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            dispatch({
                type: "pick-resource-file",
                kind: button.getAttribute("data-pick-resource")
            });
        });
    });

    const clearButtons = rootNode.querySelectorAll("[data-clear-resource]");
    clearButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            dispatch({
                type: "clear-resource-file",
                kind: button.getAttribute("data-clear-resource")
            });
        });
    });
}

function readSettingsFromForm(form, currentSettings) {
    const settings = cloneSettings(currentSettings);
    settings.translationProvider = form.translationProvider.value;
    settings.uiLanguage = form.uiLanguage.value;
    settings.translation.targetLanguage = form.targetLanguage.value;
    settings.automation.refSymbols = form.refSymbols.value;
    settings.automation.backPageTracker = form.backPageTracker.value;
    settings.automation.autoHyperlinks = !!form.autoHyperlinks.checked;
    settings.typography.copyfitEnabled = !!form.copyfitEnabled.checked;
    settings.typography.copyfitMaxTracking = form.copyfitMaxTracking.value;
    settings.typography.copyfitMinScale = form.copyfitMinScale.value;
    settings.typography.copyfitTrackingStep = form.copyfitTrackingStep.value;
    settings.typography.copyfitScaleStep = form.copyfitScaleStep.value;
    settings.typography.fontFallbackEnabled = !!form.fontFallbackEnabled.checked;
    settings.typography.fontFallbackRules = form.fontFallbackRules.value;
    return settings;
}

function mergeProviderFormIntoSettings(form, currentSettings) {
    const settings = cloneSettings(currentSettings);
    settings.secrets.deeplKey = form.deeplKey.value;
    settings.secrets.openaiKey = form.openaiKey.value;
    settings.secrets.geminiKey = form.geminiKey.value;
    settings.secrets.claudeKey = form.claudeKey.value;
    settings.secrets.localApiKey = form.localApiKey.value;
    settings.providers.openaiModel = form.openaiModel.value;
    settings.providers.geminiModel = form.geminiModel.value;
    settings.providers.claudeModel = form.claudeModel.value;
    settings.providers.localBaseUrl = form.localBaseUrl.value;
    settings.providers.localModel = form.localModel.value;
    return settings;
}

function buildToneNote(status) {
    return [
        '<div class="stp-tone-note stp-tone-note-' + escapeHtml(status.tone) + '">',
        '<span class="stp-tone-badge">' + escapeHtml(status.badge) + "</span>",
        '<p>' + escapeHtml(status.message) + "</p>",
        "</div>"
    ].join("");
}

function buildListBlock(items) {
    const rows = (items || []).map(function (item) {
        return [
            '<div class="stp-list-row">',
            '<span class="stp-list-dot"></span>',
            '<span class="stp-list-copy">' + escapeHtml(item) + "</span>",
            "</div>"
        ].join("");
    }).join("");

    return '<div class="stp-list-block">' + rows + "</div>";
}

function buildSelectField(name, label, options, selectedValue) {
    const optionMarkup = (options || []).map(function (option) {
        return buildOption(option.id, option.label, selectedValue);
    }).join("");

    return [
        '<label class="stp-field">',
        '<span>' + escapeHtml(label) + "</span>",
        '<select name="' + escapeAttribute(name) + '">',
        optionMarkup,
        "</select>",
        "</label>"
    ].join("");
}

function buildTextField(name, label, value, placeholder) {
    return [
        '<label class="stp-field">',
        '<span>' + escapeHtml(label) + "</span>",
        '<input type="text" name="' + escapeAttribute(name) + '" value="' + escapeAttribute(value) + '" placeholder="' + escapeAttribute(placeholder || "") + '" />',
        "</label>"
    ].join("");
}

function buildPasswordField(name, label, value, placeholder) {
    return [
        '<label class="stp-field">',
        '<span>' + escapeHtml(label) + ' <em class="stp-field-hint">' + escapeHtml(getMaskedSecret(value)) + "</em></span>",
        '<input type="password" name="' + escapeAttribute(name) + '" value="' + escapeAttribute(value) + '" placeholder="' + escapeAttribute(placeholder || "") + '" />',
        "</label>"
    ].join("");
}

function buildNumberField(name, label, value, min, max, step) {
    return [
        '<label class="stp-field">',
        '<span>' + escapeHtml(label) + "</span>",
        '<input type="number" name="' + escapeAttribute(name) + '" value="' + escapeAttribute(value) + '" min="' + escapeAttribute(min) + '" max="' + escapeAttribute(max) + '" step="' + escapeAttribute(step) + '" />',
        "</label>"
    ].join("");
}

function buildCheckboxField(name, label, checked) {
    return [
        '<label class="stp-field stp-checkbox-field">',
        '<input type="checkbox" name="' + escapeAttribute(name) + '"' + (checked ? ' checked="checked"' : "") + " />",
        '<span>' + escapeHtml(label) + "</span>",
        "</label>"
    ].join("");
}

function buildProviderCard(providerId, settings, fieldsMarkup) {
    const isActive = settings.translationProvider === providerId;
    const provider = getProviderOption(providerId);
    return [
        '<section class="stp-provider-card' + (isActive ? " is-active" : "") + '">',
        '<div class="stp-provider-head">',
        '<div>',
        '<h3>' + escapeHtml(provider.label) + "</h3>",
        '<p>' + escapeHtml(provider.description) + "</p>",
        "</div>",
        '<span class="stp-provider-tag">' + (isActive ? "Aktiv" : "Optional") + "</span>",
        "</div>",
        '<div class="stp-field-grid">',
        fieldsMarkup.join(""),
        "</div>",
        "</section>"
    ].join("");
}

function buildResourceCard(label, path, status, resourceKey, busyKey) {
    const tone = status === "ready" ? "ready" : (status === "missing" || status === "error" ? "warm" : "muted");
    const stateLabel = status === "ready"
        ? "Verbunden"
        : (status === "missing" ? "Pfad erneut bestaetigen" : (status === "error" ? "Fehler" : "Noch nicht gesetzt"));

    return [
        '<section class="stp-resource-card">',
        '<div class="stp-resource-head">',
        '<div>',
        '<h3>' + escapeHtml(label) + "</h3>",
        '<span class="stp-chip stp-chip-' + escapeHtml(tone) + '">' + escapeHtml(stateLabel) + "</span>",
        "</div>",
        "</div>",
        '<p class="stp-resource-path">' + escapeHtml(path || "Noch keine Datei verbunden.") + "</p>",
        '<div class="stp-button-row">',
        '<button class="stp-secondary-button" type="button" data-pick-resource="' + escapeAttribute(resourceKey) + '"' + (busyKey === "pick-" + resourceKey ? ' disabled="disabled"' : "") + '>Datei waehlen</button>',
        '<button class="stp-ghost-button" type="button" data-clear-resource="' + escapeAttribute(resourceKey) + '">Loesen</button>',
        "</div>",
        "</section>"
    ].join("");
}

function getProviderOption(providerId) {
    for (let index = 0; index < PROVIDER_OPTIONS.length; index += 1) {
        if (PROVIDER_OPTIONS[index].id === providerId) return PROVIDER_OPTIONS[index];
    }
    return PROVIDER_OPTIONS[0];
}

function getProviderLabel(providerId) {
    return getProviderOption(providerId).label;
}

function getUiLanguageLabel(languageId) {
    for (let index = 0; index < UI_LANGUAGE_OPTIONS.length; index += 1) {
        if (UI_LANGUAGE_OPTIONS[index].id === languageId) return UI_LANGUAGE_OPTIONS[index].label;
    }
    return UI_LANGUAGE_OPTIONS[0].label;
}

function cloneSettings(value) {
    return JSON.parse(JSON.stringify(value || {}));
}

function buildOption(value, label, selectedValue) {
    const selected = value === selectedValue ? ' selected="selected"' : "";
    return '<option value="' + escapeAttribute(value) + '"' + selected + ">" + escapeHtml(label) + "</option>";
}

function escapeHtml(value) {
    return String(value === undefined || value === null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
}

module.exports = {
    renderPanel: renderPanel
};
