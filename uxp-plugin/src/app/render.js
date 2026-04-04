"use strict";

function renderPanel(rootNode, state, dispatch) {
    rootNode.innerHTML = buildMarkup(state);
    bindActions(rootNode, dispatch);
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
    return [
        '<section class="stp-grid stp-grid-two">',
        '<article class="stp-card stp-card-hero">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Arbeitsflaeche</span>',
        '<h2>UXP-Panel fuer den Alltag</h2>',
        "</div>",
        '<p>Das hier ist die neue Huelle fuer SuperTranslatorPro: klarer, kompakter und spaeter ohne Dialog-Chaos bedienbar. Die erste produktive Migrationswelle ist der manuelle Uebersetzungsfluss.</p>',
        '<div class="stp-action-grid">',
        buildActionButton("translate-selection", "Auswahl uebersetzen", host.hasDocument),
        buildActionButton("translate-pages", "Seitenlauf starten", host.hasDocument),
        buildActionButton("run-bda", "BDA-Automatik", host.hasDocument),
        buildActionButton("source-check", "Quellsprache pruefen", host.hasDocument),
        "</div>",
        '<div class="stp-inline-note">',
        '<strong>Migration zuerst:</strong> Host-Snapshot, Settings, Provider, Glossar und Memory werden vorbereitet, bevor die komplexen Text-Workflows umziehen.',
        "</div>",
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Mini Bar</span>',
        '<h2>Kompakter Modus</h2>',
        "</div>",
        '<p>Die Mini-Leiste reduziert das Panel auf Status, Quick Actions und den letzten Hinweis. So bleibt das Werkzeug auch in vollen Layout-Sessions leichtgewichtig.</p>',
        '<ul class="stp-list">',
        "<li>Dockbar oder floating verwendbar</li>",
        "<li>Weniger vertikale Hoehe durch einklappbare Inhalte</li>",
        "<li>Schnelle Rueckkehr ins Full Panel per Toggle</li>",
        "</ul>",
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Host Snapshot</span>',
        '<h2>InDesign-Zustand</h2>',
        "</div>",
        '<ul class="stp-list">',
        "<li>Host-Version: " + escapeHtml(host.appVersion) + "</li>",
        "<li>Dokument: " + escapeHtml(host.documentName || "Keins") + "</li>",
        "<li>Aktive Seite: " + escapeHtml(host.activePage) + "</li>",
        "<li>Auswahl: " + escapeHtml(host.selectionLabel) + "</li>",
        "</ul>",
        '<button class="stp-secondary-button" data-action="refresh-host">Status neu laden</button>',
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Architektur</span>',
        '<h2>Schichten</h2>',
        "</div>",
        '<div class="stp-layer-stack">',
        '<span>ui</span><span>host</span><span>core</span><span>services</span>',
        "</div>",
        '<p>Die eigentliche Übersetzungslogik bleibt spaeter im `core`, waehrend `host` nur InDesign-Zugriffe kapselt und `services` Remote- und Persistenzthemen uebernimmt.</p>',
        "</article>",
        "</section>"
    ].join("");
}

function buildActionButton(actionId, label, enabled) {
    const disabledAttr = enabled ? "" : ' disabled="disabled"';
    return '<button class="stp-action-button" data-quick-action="' + escapeHtml(actionId) + '"' + disabledAttr + ">" + escapeHtml(label) + "</button>";
}

function buildSetupSurface(state) {
    return [
        '<section class="stp-grid stp-grid-two">',
        '<article class="stp-card stp-card-hero">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Remote Basis</span>',
        '<h2>Thin-Shell + Remote-Konfiguration</h2>',
        "</div>",
        '<p>Die lokale Installation bleibt klein. Provider-Metadaten, Feature-Flags, Update-Kanaele und spaeter einzelne Module koennen online gepflegt werden, waehrend ein stabiler lokaler Kern als Fallback bereitsteht.</p>',
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
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Installation</span>',
        '<h2>Einfache Auslieferung</h2>',
        "</div>",
        '<ul class="stp-list">',
        "<li>Entwicklung lokal per UXP Developer Tool</li>",
        "<li>Auslieferung spaeter als signiertes `.ccx`</li>",
        "<li>Moeglichst wenig lokale Abhaengigkeiten</li>",
        "<li>Last-known-good-Konfiguration fuer Offline-Betrieb</li>",
        "</ul>",
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Migrationswellen</span>',
        '<h2>Reihenfolge</h2>',
        "</div>",
        '<ol class="stp-list stp-list-numbered">',
        "<li>Panel und Design-System</li>",
        "<li>Settings, Provider, Glossar, Memory</li>",
        "<li>Manueller Uebersetzungsmodus</li>",
        "<li>BDA, Hyperlinks und Copyfit</li>",
        "<li>Stabilisierung und Packaging</li>",
        "</ol>",
        "</article>",
        '<article class="stp-card">',
        '<div class="stp-card-head">',
        '<span class="stp-section-kicker">Leitlinie</span>',
        '<h2>Was lokal bleibt</h2>',
        "</div>",
        '<p>Manifest, Panel-Basis, Host-Bruecke und der Sicherheits-Fallback bleiben lokal versioniert. Alles, was haeufiger angepasst wird und sicher remote geladen werden kann, wird spaeter entkoppelt.</p>',
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
        '<ul class="stp-list">',
        "<li>Remote zuerst, Cache wenn vorhanden, sonst lokaler Kern</li>",
        "<li>Klare Rollback-Punkte fuer produktive Nutzer</li>",
        "<li>Keine harte Abhaengigkeit vom Netzwerk fuer das Starten des Panels</li>",
        "</ul>",
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
        '<ul class="stp-list">',
        "<li>Provider-Status und API-Key-Maske</li>",
        "<li>Persistente Settings fuer Glossar und Memory</li>",
        "<li>Manueller Uebersetzungs-Start ueber die Host-Bruecke</li>",
        "</ul>",
        "</article>",
        "</section>"
    ].join("");
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

function bindActions(rootNode, dispatch) {
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
