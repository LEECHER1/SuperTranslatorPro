#targetengine "SuperTranslatorPRO_Loader"

// ==============================================
// SUPER ÜBERSETZER PRO - CLOUD LOADER (CACHE-FIX)
// Lädt immer die absolut aktuellste Version von GitHub
// Unterstützt auch externe #include Dateien
// ==============================================

var cacheBuster = new Date().getTime();
var baseURL = "https://raw.githubusercontent.com/LEECHER1/SuperTranslatorPro/refs/heads/main/";
var scriptURL = baseURL + "SuperTranslatorPro_v1.jsx?t=" + cacheBuster;

function fetchURL(url) {
    var content = "";
    if (File.fs === "Macintosh") {
        // Mac: cURL via AppleScript
        var asCode = 'do shell script "curl -s -L \\"' + url + '\\""';
        content = app.doScript(asCode, ScriptLanguage.APPLESCRIPT_LANGUAGE);
    } else {
        // Windows: PowerShell
        var tempFile = new File(Folder.temp.fsName + "/ST_Pro_Temp_" + new Date().getTime() + "_" + Math.floor(Math.random()*1000) + ".jsx");
        var psCmd = 'powershell -NoProfile -Command "(New-Object Net.WebClient).DownloadString(\'' + url + '\') | Out-File -FilePath \'' + tempFile.fsName + '\' -Encoding UTF8"';
        var vbsCode = 'Set objShell = CreateObject("WScript.Shell")\nobjShell.Run "' + psCmd + '", 0, True';
        app.doScript(vbsCode, ScriptLanguage.VISUAL_BASIC_SCRIPT);
        
        if (tempFile.exists) {
            tempFile.encoding = "UTF-8";
            tempFile.open("r");
            content = tempFile.read();
            tempFile.close();
            tempFile.remove(); // Aufräumen
        }
    }
    return content;
}

try {
    var scriptContent = fetchURL(scriptURL);
    
    // 2. SKRIPT & INCLUDES VERARBEITEN
    if (scriptContent && scriptContent.length > 100) {
        
        // Suche nach #include "..." oder #include '...'
        var includeRegex = /#include\s+["']([^"']+)["']/g;
        var match;
        var includesToReplace = [];
        
        // Matches sammeln
        while ((match = includeRegex.exec(scriptContent)) !== null) {
            includesToReplace.push({ fullMatch: match[0], path: match[1] });
        }
        
        // Includes herunterladen und ersetzen
        for (var i = 0; i < includesToReplace.length; i++) {
            var inc = includesToReplace[i];
            var includeURL = baseURL + inc.path + "?t=" + cacheBuster;
            var incContent = fetchURL(includeURL);
            
            if (incContent && incContent.length > 0) {
                scriptContent = scriptContent.replace(inc.fullMatch, incContent);
            } else {
                alert("Warnung: Include-Datei konnte nicht geladen werden: " + inc.path);
            }
        }
        
        // Direktiven entfernen, da sie in eval() zu Syntaxfehlern führen
        scriptContent = scriptContent.replace(/^#targetengine\b.*$/gm, "");
        scriptContent = scriptContent.replace(/^#target\b.*$/gm, "");

        // 3. SKRIPT AUSFÜHREN
        eval(scriptContent);
    } else {
        alert("Verbindungsfehler: Das Skript konnte nicht von GitHub geladen werden.\nBitte prüfe deine Internetverbindung oder den Link.");
    }
    
} catch(e) {
    alert("Kritischer Lade-Fehler:\n" + e.message);
}