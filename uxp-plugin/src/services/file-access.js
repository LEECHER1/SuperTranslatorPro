"use strict";

let fileSystemProvider = null;

try {
    const uxpModule = require("uxp");
    if (uxpModule && uxpModule.storage && uxpModule.storage.localFileSystem) {
        fileSystemProvider = uxpModule.storage.localFileSystem;
    }
} catch (error) {
    fileSystemProvider = null;
}

function createFileAccessService() {
    async function hydrateSettings(settings) {
        const next = cloneSettings(settings);
        next.resources = Object.assign({}, next.resources);

        const glossaryInfo = await resolvePersistentResource(next.resources.glossaryToken, next.resources.glossaryPath);
        next.resources.glossaryPath = glossaryInfo.path;
        next.resources.glossaryStatus = glossaryInfo.status;

        const memoryInfo = await resolvePersistentResource(next.resources.memoryToken, next.resources.memoryPath);
        next.resources.memoryPath = memoryInfo.path;
        next.resources.memoryStatus = memoryInfo.status;

        return next;
    }

    async function chooseResource(kind) {
        if (!fileSystemProvider || !fileSystemProvider.isFileSystemProvider) {
            throw new Error("Dateizugriff ist in dieser Umgebung nicht verfuegbar.");
        }

        let entry = null;
        if (kind === "glossary") {
            entry = await fileSystemProvider.getFileForOpening({ types: ["csv"] });
        } else if (kind === "memory") {
            entry = await fileSystemProvider.getFileForSaving("SuperTranslatorPRO_Memory.json", { types: ["json"] });
        } else {
            throw new Error("Unbekannter Ressourcen-Typ.");
        }

        if (!entry) return null;

        const token = await fileSystemProvider.createPersistentToken(entry);
        return {
            token: token,
            path: resolveEntryPath(entry),
            status: "ready"
        };
    }

    return {
        chooseResource: chooseResource,
        hydrateSettings: hydrateSettings
    };
}

async function resolvePersistentResource(token, fallbackPath) {
    const normalizedToken = String(token || "");
    const normalizedPath = String(fallbackPath || "");

    if (!normalizedToken || !fileSystemProvider || !fileSystemProvider.isFileSystemProvider) {
        return {
            path: normalizedPath,
            status: normalizedPath ? "missing" : "empty"
        };
    }

    try {
        const entry = await fileSystemProvider.getEntryForPersistentToken(normalizedToken);
        return {
            path: resolveEntryPath(entry) || normalizedPath,
            status: "ready"
        };
    } catch (error) {
        return {
            path: normalizedPath,
            status: normalizedPath ? "missing" : "error"
        };
    }
}

function resolveEntryPath(entry) {
    if (!entry) return "";
    if (entry.nativePath) return String(entry.nativePath);
    if (entry.name) return String(entry.name);
    return "";
}

function cloneSettings(value) {
    return JSON.parse(JSON.stringify(value || {}));
}

module.exports = {
    createFileAccessService: createFileAccessService
};
