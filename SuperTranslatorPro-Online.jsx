#targetengine "SuperTranslatorPRO_Loader"

// ==============================================
// SUPER ÜBERSETZER PRO - CLOUD LOADER (CACHE-FIX)
// Lädt immer die absolut aktuellste Version von GitHub
// ==============================================

// Der Cache-Buster: Zwingt GitHub, immer die neueste Version zu laden!
var cacheBuster = new Date().getTime();
var scriptURL = "https://raw.githubusercontent.com/LEECHER1/SuperTranslatorPro/refs/heads/main/SuperTranslatorPro_v1.jsx?t=" + cacheBuster;

try {
    var scriptContent = "";
    
    // 1. SKRIPT VOM SERVER LADEN (Mac & Windows Kompatibel)
    if (File.fs === "Macintosh") {
        // Mac: cURL via AppleScript
        var asCode = 'do shell script "curl -s -L \\"' + scriptURL + '\\""';
        scriptContent = app.doScript(asCode, ScriptLanguage.APPLESCRIPT_LANGUAGE);
    } else {
        // Windows: PowerShell
        var tempFile = new File(Folder.temp.fsName + "/ST_Pro_Temp.jsx");
        var psCmd = 'powershell -NoProfile -Command "(New-Object Net.WebClient).DownloadString(\'' + scriptURL + '\') | Out-File -FilePath \'' + tempFile.fsName + '\' -Encoding UTF8"';
        var vbsCode = 'Set objShell = CreateObject("WScript.Shell")\nobjShell.Run "' + psCmd + '", 0, True';
        app.doScript(vbsCode, ScriptLanguage.VISUAL_BASIC_SCRIPT);
        
        if (tempFile.exists) {
            tempFile.encoding = "UTF-8";
            tempFile.open("r");
            scriptContent = tempFile.read();
            tempFile.close();
            tempFile.remove(); // Aufräumen
        }
    }
    
    // 2. SKRIPT AUSFÜHREN
    if (scriptContent && scriptContent.length > 100) {
        eval(scriptContent);
    } else {
        alert("Verbindungsfehler: Das Skript konnte nicht von GitHub geladen werden.\nBitte prüfe deine Internetverbindung oder den Link.");
    }
    
} catch(e) {
    alert("Kritischer Lade-Fehler:\n" + e.message);
}