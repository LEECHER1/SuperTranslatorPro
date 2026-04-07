"use strict";

const { SECRET_KEYS, mergeSecrets, normalizeAppSettings, stripSecrets } = require("../config/settings-model");
const { createSettingsStore } = require("./settings-store");
const { createSecureStore } = require("./secure-store");
const { createFileAccessService } = require("./file-access");

function createConfigService(namespace) {
    const generalStore = createSettingsStore(namespace + ".general");
    const secureStore = createSecureStore(namespace + ".secure.");
    const fileAccess = createFileAccessService();

    async function loadSettings() {
        const storedGeneralSettings = normalizeAppSettings(generalStore.load());
        const secrets = await secureStore.loadMany(SECRET_KEYS);
        const hydratedSettings = await fileAccess.hydrateSettings(storedGeneralSettings);
        return mergeSecrets(hydratedSettings, secrets);
    }

    async function saveSettings(settings) {
        const normalized = normalizeAppSettings(settings);
        generalStore.save(stripSecrets(normalized));
        await secureStore.saveMany(normalized.secrets);
        return normalized;
    }

    async function chooseResource(settings, kind) {
        const normalized = normalizeAppSettings(settings);
        const selection = await fileAccess.chooseResource(kind);
        if (!selection) return normalized;

        const next = normalizeAppSettings(normalized);
        next.resources = Object.assign({}, next.resources);

        if (kind === "glossary") {
            next.resources.glossaryToken = selection.token;
            next.resources.glossaryPath = selection.path;
            next.resources.glossaryStatus = selection.status;
        } else if (kind === "memory") {
            next.resources.memoryToken = selection.token;
            next.resources.memoryPath = selection.path;
            next.resources.memoryStatus = selection.status;
        }

        return saveSettings(next);
    }

    async function clearResource(settings, kind) {
        const next = normalizeAppSettings(settings);
        next.resources = Object.assign({}, next.resources);

        if (kind === "glossary") {
            next.resources.glossaryToken = "";
            next.resources.glossaryPath = "";
            next.resources.glossaryStatus = "empty";
        } else if (kind === "memory") {
            next.resources.memoryToken = "";
            next.resources.memoryPath = "";
            next.resources.memoryStatus = "empty";
        }

        return saveSettings(next);
    }

    return {
        chooseResource: chooseResource,
        clearResource: clearResource,
        loadSettings: loadSettings,
        saveSettings: saveSettings
    };
}

module.exports = {
    createConfigService: createConfigService
};
