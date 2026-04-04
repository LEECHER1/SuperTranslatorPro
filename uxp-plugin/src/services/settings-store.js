"use strict";

function createSettingsStore(storageKey) {
    const storage = resolveStorage();

    function load() {
        if (!storage) return {};
        try {
            const raw = storage.getItem(storageKey);
            return raw ? JSON.parse(raw) : {};
        } catch (error) {
            return {};
        }
    }

    function save(value) {
        if (!storage) return;
        try {
            storage.setItem(storageKey, JSON.stringify(value || {}));
        } catch (error) {}
    }

    return {
        load: load,
        save: save
    };
}

function resolveStorage() {
    try {
        if (typeof localStorage !== "undefined" && localStorage) {
            return localStorage;
        }
    } catch (error) {}

    const memoryStore = {};
    return {
        getItem: function (key) {
            return memoryStore.hasOwnProperty(key) ? memoryStore[key] : null;
        },
        setItem: function (key, value) {
            memoryStore[key] = String(value);
        }
    };
}

module.exports = {
    createSettingsStore: createSettingsStore
};
