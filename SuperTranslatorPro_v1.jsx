#targetengine "SuperTranslatorPRO281"

// ==============================================
// SUPER ÜBERSETZER PRO - VERSION 28.1 (API-KEY ENTFERNT)
// ==============================================

// --- 0. EINSTELLUNGEN (API-KEY, CSV-PFAD & TM-PFAD) ---
var DEEPL_KEY_LABEL = "SuperTranslatorPRO_DeepL_API_Key";
var CSV_PATH_LABEL = "SuperTranslatorPRO_CSV_Path";
var TM_PATH_LABEL = "SuperTranslatorPRO_TM_Path"; 

var apiKey = app.extractLabel(DEEPL_KEY_LABEL);
if (!apiKey || apiKey === "") {
    apiKey = ""; // HIER WURDE DER FALLBACK-KEY ENTFERNT
}

var csvPath = app.extractLabel(CSV_PATH_LABEL) || "";
var tmPath = app.extractLabel(TM_PATH_LABEL) || (Folder.userData + "/SuperTranslatorPRO_Memory.json"); 

var FORMALITY_LABEL = "SuperTranslatorPRO_Formality";
var DNT_LABEL = "SuperTranslatorPRO_DNT_Styles";
var formalitySetting = app.extractLabel(FORMALITY_LABEL) || "default";
var dntStyles = app.extractLabel(DNT_LABEL) || "";

var globalStats = { apiChars: 0, savedChars: 0, fittedFrames: 0 };
var progressWin, progressBar, progressText;
var overallBar, overallText, etaText, btnStopProgress;
var cancelFlag = false;
var startTime = 0;

var logPath = Folder.temp + "/SuperTranslatorPRO_Log.txt";

// --- 0A. PROTOKOLL (LOGGING) ---
function writeLog(message, type) {
    try {
        var f = new File(logPath);
        var d = new Date();
        var timeStr = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0"+d.getDate()).slice(-2) + " " + ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2) + ":" + ("0"+d.getSeconds()).slice(-2);
        var prefix = type ? "[" + type + "]" : "[INFO]";
        f.encoding = "UTF-8";
        f.open(f.exists ? 'e' : 'w');
        if (f.exists) f.seek(0, 2); // Ans Ende der Datei springen
        f.writeln(timeStr + " " + prefix + " " + message);
        f.close();
    } catch(e) {}
}

// --- 0B. TRANSLATION MEMORY & CSV LOGIK ---
function getTMFile() { 
    if (tmPath && tmPath !== "") return new File(tmPath);
    return new File(Folder.userData + "/SuperTranslatorPRO_Memory.json"); 
}

function loadTM() {
    var f = getTMFile();
    if (f.exists) {
        try { 
            f.encoding = "UTF-8";
            f.open('r'); 
            var content = f.read(); 
            f.close(); 
            if (content === "") return {};
            return eval("(" + content + ")"); 
        } catch(e) { return {}; }
    }
    return {};
}

function saveTM(tmObj) {
    var f = getTMFile();
    try {
        var str = "{\n"; var langs = [];
        for (var l in tmObj) {
            if (tmObj.hasOwnProperty(l)) {
                var keys = [];
                for (var k in tmObj[l]) {
                    if (tmObj[l].hasOwnProperty(k) && tmObj[l][k]) {
                        var ek = String(k).replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                        var ev = String(tmObj[l][k]).replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                        keys.push('"' + ek + '":"' + ev + '"');
                    }
                }
                langs.push('"' + l + '":{' + keys.join(',') + '}');
            }
        }
        str += langs.join(",\n") + "\n}";
        
        f.encoding = "UTF-8";
        if (f.open('w')) {
            var success = f.write(str);
            f.close();
            if (!success) alert("Memory-Warnung: Datei konnte nicht geschrieben werden.");
        }
    } catch(e) {}
}

function loadCSVGlossary(path) {
    if (!path || path === "") return null;
    var f = new File(path);
    if (!f.exists) return null;
    var glossary = {};
    try {
        f.encoding = "UTF-8";
        f.open('r');
        var content = f.read();
        f.close();
        content = content.replace(/^\uFEFF/, '');
        var lines = content.split(/[\r\n]+/);
        if (lines.length < 2) return null;
        
        var sep = lines[0].indexOf(';') !== -1 ? ';' : ','; 
        var headers = lines[0].split(sep);
        for (var h=0; h<headers.length; h++) headers[h] = headers[h].replace(/(^"|"$|\s)/g, '').toUpperCase();

        for (var i=1; i<lines.length; i++) {
            if (lines[i].replace(/\s/g, '') === "") continue;
            var cols = lines[i].split(sep);
            var original = cols[0].replace(/(^"|"$)/g, '');
            if (original === "") continue;
            
            var translations = {};
            for (var j=1; j<cols.length; j++) {
                if (j < headers.length) {
                    var val = cols[j].replace(/(^"|"$)/g, '');
                    if (val !== "") translations[headers[j]] = val;
                }
            }
            glossary[original] = translations;
        }
        return glossary;
    } catch(e) { return null; }
}

function getInDesignLanguageName(deepLCode) {
    var map = {
        "EN-US": "Englisch: USA", "EN-GB": "Englisch: Großbritannien", "EN": "Englisch: USA",
        "FR": "Französisch", "IT": "Italienisch", "ES": "Spanisch",
        "CS": "Tschechisch", "HU": "Ungarisch", "NL": "Niederländisch",
        "PL": "Polnisch", "PT": "Portugiesisch", "PT-PT": "Portugiesisch",
        "RO": "Rumänisch", "RU": "Russisch", "SK": "Slowakisch",
        "SL": "Slowenisch", "SV": "Schwedisch", "DA": "Dänisch",
        "FI": "Finnisch", "EL": "Griechisch", "BG": "Bulgarisch",
        "ET": "Estnisch", "LT": "Litauisch", "LV": "Lettisch"
    };
    return map[deepLCode.toUpperCase()] || "";
}

function getCurrentArticleVersionLabel() {
    var d = new Date();
    var year = d.getFullYear() % 100;
    var month = d.getMonth() + 1;
    var version = "v" + ("0" + year).slice(-2) + ("0" + month).slice(-2);
    return "Artikelnummer_" + version;
}

function updateLanguageMasterVersionLabels(doc) {
    var versionLabel = getCurrentArticleVersionLabel();
    var masterSpreads = doc.masterSpreads;
    for (var m = 0; m < masterSpreads.length; m++) {
        var masterName = masterSpreads[m].name;
        if (!masterName.match(/[-_]([a-z]{2})(?:[-_]|$)/i)) continue;
        var pages = masterSpreads[m].pages;
        for (var p = 0; p < pages.length; p++) {
            var allItems = pages[p].allPageItems;
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                if (item.constructor.name !== "TextFrame") continue;
                try {
                    var story = item.parentStory;
                    if (!story || !story.isValid) continue;
                    var text = story.contents;
                    var newText = text;
                    if (/Artikelnummer(_| )?v?\d{4}/i.test(newText)) {
                        newText = newText.replace(/Artikelnummer(_| )?v?\d{4}/ig, versionLabel);
                    }
                    if (/%VERSION%/i.test(newText)) {
                        newText = newText.replace(/%VERSION%/gi, versionLabel);
                    }
                    if (newText !== text) {
                        story.contents = newText;
                    }
                } catch (e) {}
            }
        }
    }
}

// --- 1. BENUTZEROBERFLÄCHE (UI) ---
var myWindow = new Window("palette", "Super Translator Pro v1.2");
myWindow.orientation = "column";
myWindow.alignChildren = ["fill", "top"];

// --- KOPFBEREICH (MAC LAYOUT FIX) ---
var headerGroup = myWindow.add("group");
headerGroup.orientation = "row";
headerGroup.alignChildren = ["left", "center"];

var mainTitle = headerGroup.add("statictext", undefined, "Was soll übersetzt werden?");
mainTitle.graphics.font = ScriptUI.newFont(mainTitle.graphics.font.family, "BOLD", 16);
mainTitle.preferredSize.width = 300; 

var btnSettings = headerGroup.add("button", undefined, "⚙️ Einstellungen"); 
btnSettings.helpTip = "Einstellungen, Wörterbuch & API-Key";

// --- PANEL 1: MANUELLER MODUS ---
var panelManual = myWindow.add("panel", undefined, ""); 
panelManual.orientation = "column"; 
panelManual.alignChildren = "left";
panelManual.margins = 15;

var lblManual = panelManual.add("statictext", undefined, "Manueller Modus");
lblManual.graphics.font = ScriptUI.newFont(lblManual.graphics.font.family, "BOLD", lblManual.graphics.font.size);

var radioSelection = panelManual.add("radiobutton", undefined, "Aktuelle Auswahl (Rahmen/Texte/Tabellen)");
var radioPages = panelManual.add("radiobutton", undefined, "Bestimmte Seiten übersetzen:");

var editPages = panelManual.add("edittext", undefined, "");
editPages.characters = 12; 
editPages.helpTip = "Z.B. 1, 3, 5-8";
editPages.indent = 20;

panelManual.add("statictext", undefined, ""); 

var lblLang = panelManual.add("statictext", undefined, "Zielsprache (Für Manuelle Auswahl / Einzelne Seiten)");
var langList = [
    "--- FAVORITEN ---", "EN (Englisch)", "FR (Französisch)", "IT (Italienisch)", "ES (Spanisch)", "CS (Tschechisch)", "HU (Ungarisch)", "DE (Deutsch)",
    "--- SONSTIGE EU SPRACHEN ---", "BG (Bulgarisch)", "DA (Dänisch)", "EL (Griechisch)", "ET (Estnisch)", "FI (Finnisch)", "LT (Litauisch)", "LV (Lettisch)", "NL (Niederländisch)", "PL (Polnisch)", "PT (Portugiesisch)", "RO (Rumänisch)", "RU (Russisch)", "SK (Slowakisch)", "SL (Slowenisch)", "SV (Schwedisch)"
];
var dropdownLang = panelManual.add("dropdownlist", undefined, langList);
dropdownLang.selection = 1; 

// --- PANEL 2: AUTOMATIK MODUS ---
var panelBDA = myWindow.add("panel", undefined, ""); 
panelBDA.orientation = "column"; 
panelBDA.alignChildren = "left";
panelBDA.margins = 15;

var radioBDA = panelBDA.add("radiobutton", undefined, "Voll Automatik Modus");
radioBDA.graphics.font = ScriptUI.newFont(radioBDA.graphics.font.family, "BOLD", radioBDA.graphics.font.size);

panelBDA.add("statictext", undefined, ""); 

var lblBDA = panelBDA.add("statictext", undefined, "Einstellungen (Automatik Modus)");
lblBDA.graphics.font = ScriptUI.newFont(lblBDA.graphics.font.family, "BOLD", lblBDA.graphics.font.size);

var grpBDASource = panelBDA.add("group");
grpBDASource.indent = 20;
grpBDASource.add("statictext", undefined, "Originalseiten:");
var bdaSourceInput = grpBDASource.add("edittext", undefined, "AUTO");
bdaSourceInput.characters = 8;
bdaSourceInput.helpTip = "AUTO sucht selbst nach -de- Musterseiten";

var checkTOC = panelBDA.add("checkbox", undefined, "Titelseite (Seite 1): Start-Seitenzahlen aktualisieren");
checkTOC.indent = 20;
checkTOC.value = true;

// START-ZUSTAND FESTLEGEN
radioSelection.value = true;
bdaSourceInput.enabled = false;
checkTOC.enabled = false;

// --- UI INTERAKTIONEN ---
radioSelection.onClick = function() {
    radioPages.value = false;
    radioBDA.value = false;
    dropdownLang.enabled = true;
    bdaSourceInput.enabled = false;
    checkTOC.enabled = false;
}

radioPages.onClick = function() {
    radioSelection.value = false;
    radioBDA.value = false;
    dropdownLang.enabled = true;
    bdaSourceInput.enabled = false;
    checkTOC.enabled = false;
}

radioBDA.onClick = function() {
    radioSelection.value = false;
    radioPages.value = false;
    dropdownLang.enabled = false;
    bdaSourceInput.enabled = true;
    checkTOC.enabled = true;
}

editPages.onActivate = function() {
    radioPages.value = true;
    radioSelection.value = false;
    radioBDA.value = false;
    dropdownLang.enabled = true;
    bdaSourceInput.enabled = false;
    checkTOC.enabled = false;
}

bdaSourceInput.onActivate = function() {
    radioBDA.value = true;
    radioSelection.value = false;
    radioPages.value = false;
    dropdownLang.enabled = false;
    bdaSourceInput.enabled = true;
    checkTOC.enabled = true;
}

// --- BUTTONS UNTEN ---
var groupButtons = myWindow.add("group"); 
groupButtons.alignment = "center";
var btnTranslate = groupButtons.add("button", undefined, "Übersetzung starten");
var btnCancel = groupButtons.add("button", undefined, "Schließen");

// --- EINSTELLUNGEN FENSTER ---
btnSettings.onClick = function() {
    var setWin = new Window("dialog", "⚙️ Einstellungen");
    setWin.orientation = "column";
    setWin.alignChildren = ["fill", "top"];
    
    var topGrp = setWin.add("group");
    topGrp.alignment = "fill";
    topGrp.alignChildren = ["right", "center"];
    var btnLog = topGrp.add("button", undefined, "📄 Logdatei");
    btnLog.preferredSize = [90, 25];
    var btnInfo = topGrp.add("button", undefined, "ℹ️ Info");
    btnInfo.preferredSize = [80, 25];
    
    setWin.add("statictext", undefined, "DeepL Pro API-Key:");
    var keyInput = setWin.add("edittext", undefined, apiKey);
    keyInput.characters = 40;
    
    setWin.add("panel", undefined, ""); 
    
    setWin.add("statictext", undefined, "Netzwerk-Wörterbuch (CSV Pfad):");
    var grpCSV = setWin.add("group");
    var csvInput = grpCSV.add("edittext", undefined, csvPath);
    csvInput.characters = 30;
    var btnBrowse = grpCSV.add("button", undefined, "Durchsuchen...");
    
    btnBrowse.onClick = function() {
        var f = File.openDialog("Bitte wähle die Wörterbuch CSV-Datei aus", "*.csv");
        if (f) csvInput.text = f.fsName;
    };

    setWin.add("panel", undefined, "");
    setWin.add("statictext", undefined, "Anrede-Form (für unterstützte Sprachen):");
    var formDrop = setWin.add("dropdownlist", undefined, ["Standard (DeepL entscheidet)", "Formell (Sie)", "Informell (Du)"]);
    if (formalitySetting === "more") formDrop.selection = 1; else if (formalitySetting === "less") formDrop.selection = 2; else formDrop.selection = 0;
    
    setWin.add("statictext", undefined, "Ignorierte Absatz-/Zeichenformate (DNT, kommagetrennt):");
    var dntInput = setWin.add("edittext", undefined, dntStyles);
    dntInput.characters = 40;

    setWin.add("panel", undefined, ""); 

    setWin.add("statictext", undefined, "Netzwerk-Memory (JSON Pfad):");
    var grpTM = setWin.add("group");
    var tmInput = grpTM.add("edittext", undefined, tmPath);
    tmInput.characters = 30;
    var btnBrowseTM = grpTM.add("button", undefined, "Durchsuchen...");
    
    btnBrowseTM.onClick = function() {
        var f = File.openDialog("Bitte wähle die Memory JSON-Datei aus", "*.json");
        if (f) {
            tmInput.text = f.fsName;
        } else {
            var saveF = File.saveDialog("Speicherort für neues Memory wählen", "*.json");
            if (saveF) tmInput.text = saveF.fsName;
        }
    };
    
    var g = setWin.add("group");
    g.alignment = "fill";
    g.alignChildren = ["fill", "center"];
    g.margins.top = 15;
    
    var leftGrp = g.add("group");
    leftGrp.alignment = "left";
    var btnClearTM = leftGrp.add("button", undefined, "Memory leeren");
    btnClearTM.preferredSize = [110, 25];
    
    var spacer = g.add("statictext", undefined, "");
    spacer.alignment = "fill";
    
    var rightGrp = g.add("group");
    rightGrp.alignment = ["fill", "center"];
    rightGrp.alignChildren = ["right", "center"];
    var btnSave = rightGrp.add("button", undefined, "Speichern");
    var btnSpacer = rightGrp.add("statictext", undefined, "");
    btnSpacer.alignment = "fill";
    var btnCancelSet = rightGrp.add("button", undefined, "Abbrechen");
    
    btnSave.onClick = function() {
        apiKey = keyInput.text;
        csvPath = csvInput.text;
        tmPath = tmInput.text;
        app.insertLabel(DEEPL_KEY_LABEL, apiKey); 
        app.insertLabel(CSV_PATH_LABEL, csvPath); 
        app.insertLabel(TM_PATH_LABEL, tmPath); 
        
        var selForm = "default";
        if (formDrop.selection.index === 1) selForm = "more"; else if (formDrop.selection.index === 2) selForm = "less";
        app.insertLabel(FORMALITY_LABEL, selForm); formalitySetting = selForm;
        app.insertLabel(DNT_LABEL, dntInput.text); dntStyles = dntInput.text;
        
        alert("Einstellungen erfolgreich gespeichert!");
        setWin.close();
    };
    btnClearTM.onClick = function() {
        if(confirm("Bist du sicher? Das aktuell ausgewählte Memory wird geleert.")) {
            var f = getTMFile();
            if (f.exists) f.remove();
            alert("Translation Memory wurde geleert.");
        }
    }
    btnLog.onClick = function() {
        var f = new File(logPath);
        if (f.exists) { f.execute(); } else { alert("Es wurde noch keine Logdatei erstellt."); }
    };
    btnInfo.onClick = function() {
        var infoText = "Super Translator Pro v1.2\n";
        infoText += "© " + new Date().getFullYear() + " Andreas Schwarz\n\n";
        infoText += "Ein professionelles Übersetzungstool für InDesign in Verbindung mit der DeepL API.\n\n";
        infoText += "Kernfunktionen:\n";
        infoText += "• Nahtloser Erhalt von Textformatierungen, Tabellen und verankerten Bildern\n";
        infoText += "• Integriertes Translation Memory (JSON) zur API-Kostenersparnis\n";
        infoText += "• Netzwerk-Glossar (CSV) für den Schutz von Fachbegriffen\n";
        infoText += "• Formelle/Informelle Anrede & DNT-Format Ignorierung\n";
        infoText += "• Cross-Platform (macOS & Windows) API-Anbindung\n";
        infoText += "• Intelligente Auto-Fit Korrektur gegen Textrahmen-Übersatz";
        alert(infoText, "Über Super Translator Pro");
    };
    btnCancelSet.onClick = function() { setWin.close(); };
    setWin.show();
};

btnCancel.onClick = function() { myWindow.close(); }


// --- 2. FORTSCHRITTS-FENSTER LOGIK ---
function createProgressWindow() {
    cancelFlag = false;
    startTime = new Date().getTime();
    globalStats = { apiChars: 0, savedChars: 0, fittedFrames: 0 }; 
    
    progressWin = new Window("palette", "Übersetzung läuft...");
    progressWin.orientation = "column";
    progressWin.alignChildren = "fill";
    
    progressWin.add("statictext", undefined, "Aktueller Schritt:");
    progressText = progressWin.add("statictext", undefined, "Vorbereitung...");
    progressText.preferredSize.width = 350;
    progressBar = progressWin.add("progressbar", undefined, 0, 100);
    progressBar.preferredSize.width = 350;
    
    progressWin.add("statictext", undefined, "Gesamter Vorgang:");
    overallText = progressWin.add("statictext", undefined, "0% abgeschlossen");
    overallBar = progressWin.add("progressbar", undefined, 0, 100);
    overallBar.preferredSize.width = 350;
    
    etaText = progressWin.add("statictext", undefined, "Restzeit: Berechne...");
    etaText.justify = "center";
    
    btnStopProgress = progressWin.add("button", undefined, "Abbrechen");
    btnStopProgress.onClick = function() {
        if (btnStopProgress.text === "Schließen") progressWin.close(); 
        else {
            cancelFlag = true;
            progressText.text = "Abbruch angefordert... bitte warten.";
            overallText.text = "Wird abgebrochen...";
            progressWin.update();
        }
    };
    
    progressWin.show();
    progressWin.update();
}

function updateProgress(taskPct, taskMsg, overallPct, overallMsg) {
    if (progressWin) {
        if (taskPct !== null) progressBar.value = taskPct;
        if (taskMsg !== null) progressText.text = taskMsg;
        
        if (overallPct !== null) {
            overallBar.value = overallPct;
            overallText.text = overallMsg ? overallMsg : Math.round(overallPct) + "% abgeschlossen";
            
            if (overallPct > 0 && overallPct < 100) {
                var elapsed = new Date().getTime() - startTime;
                var totalEst = elapsed / (overallPct / 100);
                var remaining = totalEst - elapsed;
                
                var secs = Math.round(remaining / 1000);
                var mins = Math.floor(secs / 60);
                secs = secs % 60;
                
                var secStr = (secs < 10) ? "0" + secs : secs;
                etaText.text = "Restzeit: ca. " + mins + " Min. " + secStr + " Sek.";
            } else if (overallPct >= 100) {
                etaText.text = "Verarbeitung abgeschlossen.";
            }
        }
        progressWin.update(); 
    }
}

function showSuccessScreen(finalMessage) {
    if (progressWin) {
        progressBar.value = 100;
        overallBar.value = 100;
        progressText.text = "✅ Erfolgreich abgeschlossen!";
        overallText.text = finalMessage;
        
        var elapsedTotal = new Date().getTime() - startTime;
        var totalSecs = Math.round(elapsedTotal / 1000);
        var totalMins = Math.floor(totalSecs / 60);
        
        etaText.text = "Dauer: " + totalMins + " Min. " + (totalSecs % 60) + " Sek. | API gespart: " + globalStats.savedChars + " Z. | Rahmen gefixt: " + globalStats.fittedFrames;
        
        btnStopProgress.text = "Schließen";
        progressWin.update();
    }
}

function closeProgressWindow() {
    if (progressWin) progressWin.close();
}


// --- 3. KLICK-LOGIK & START ---
btnTranslate.onClick = function() {
    var doc = null;
    try { doc = app.activeDocument; } catch(e) { alert("Kein Dokument offen!"); return; }

    var config = {
        mode: radioBDA.value ? "BDA" : (radioPages.value ? "PAGES" : "SELECTION"),
        sourcePages: editPages.text,
        bdaSourcePages: bdaSourceInput.text,
        updateTOC: checkTOC.value,
        lang: dropdownLang.selection.text.substring(0, 2)
    };

    if (config.mode !== "BDA" && config.lang.indexOf("-") !== -1) {
        alert("Bitte wähle eine gültige Zielsprache aus, keine Trennlinie.");
        return;
    }

    if (config.mode === "SELECTION" && app.selection.length === 0) { alert("Bitte markiere zuerst etwas im Dokument."); return; }
    if (config.mode === "PAGES" && config.sourcePages.replace(/\s/g, "") === "") { alert("Bitte Seitenzahlen eintragen."); return; }
    if (config.mode === "BDA" && config.bdaSourcePages.replace(/\s/g, "") === "") { alert("Bitte gib die Seiten an oder nutze AUTO."); return; }
    
    // Prüfen, ob API-Key hinterlegt ist
    if (!apiKey || apiKey === "") {
        alert("Bitte trage zuerst deinen DeepL API-Key in den Einstellungen (⚙️) ein.");
        return;
    }

    if (config.lang === "EN") config.lang = "EN-US"; 
    if (config.lang === "PT") config.lang = "PT-PT";

    createProgressWindow();

    writeLog("=== NEUER VORGANG GESTARTET ===");
    writeLog("Dokument: " + doc.name + " | Modus: " + config.mode + " | Zielsprache: " + config.lang);

    app.doScript(
        function() { 
            try {
                var resultMsg = runMainProcess(doc, config); 
                writeLog("Erfolgreich beendet. (API genutzt: " + globalStats.apiChars + " Z., API gespart: " + globalStats.savedChars + " Z., Auto-Fit: " + globalStats.fittedFrames + " Rahmen)");
                showSuccessScreen(resultMsg ? resultMsg : "Alle Übersetzungen fehlerfrei beendet.");
            } catch(e) {
                closeProgressWindow();
                if (e.message === "CANCELLED") {
                    writeLog("Vorgang durch Benutzer abgebrochen.", "WARNUNG");
                    alert("⚠️ Vorgang abgebrochen!\n\nTipp: Drücke jetzt Cmd+Z (Rückgängig), um alle bisherigen Änderungen in einem Rutsch zu verwerfen.");
                } else {
                    writeLog("FEHLER: " + e.message, "ERROR");
                    alert("Ein Fehler ist aufgetreten:\n" + e.message);
                }
            }
        }, 
        ScriptLanguage.JAVASCRIPT, 
        undefined, 
        UndoModes.ENTIRE_SCRIPT, 
        "Super Übersetzer: " + config.mode
    );
}


// --- 4. HAUPTSTEUERUNG ---
function runMainProcess(doc, config) {
    updateLanguageMasterVersionLabels(doc);
    if (config.mode === "BDA") {
        return runBDAMode(doc, config);
    } else {
        updateProgress(5, "Lese Textrahmen aus...", 5, "Vorbereitung");
        var targetTextObjArray = [];
        if (config.mode === "SELECTION") {
            for (var i = 0; i < app.selection.length; i++) {
                if (cancelFlag) throw new Error("CANCELLED");
                var mySel = app.selection[i];
                if (mySel.constructor.name === "TextFrame") targetTextObjArray.push(mySel.parentStory); 
                else if (mySel.constructor.name === "Cell") targetTextObjArray.push(mySel.texts[0]);
                else if (mySel.constructor.name === "Group") {
                    for (var g=0; g<mySel.allPageItems.length; g++) {
                        if (mySel.allPageItems[g].constructor.name === "TextFrame") targetTextObjArray.push(mySel.allPageItems[g].parentStory);
                    }
                } else if (mySel.hasOwnProperty("baseline")) targetTextObjArray.push(mySel);
            }
        }
        executeTranslation(doc, targetTextObjArray, (config.mode === "PAGES"), config.sourcePages, config.lang, 10, 90);
        return "Markierung/Seiten in " + config.lang + " übersetzt.";
    }
}

// --- 5. BDA AUTOMATIK LOGIK ---
function runBDAMode(doc, config) {
    updateProgress(5, "Suche Mustervorlagen...", 5, "Analysiere Dokument...");
    var masterSpreads = doc.masterSpreads;
    var langTasks = [];
    
    for (var m = 0; m < masterSpreads.length; m++) {
        var mName = masterSpreads[m].name;
        var match = mName.match(/[-_]([a-z]{2})(?:[-_]|$)/i); 
        if (match) {
            var code = match[1].toLowerCase();
            if (code !== "de") { 
                var deepLLang = code.toUpperCase();
                if (deepLLang === "EN") deepLLang = "EN-US";
                if (deepLLang === "PT") deepLLang = "PT-PT";
                langTasks.push({ code: code, deepLCode: deepLLang, master: masterSpreads[m] });
            }
        }
    }

    updateLanguageMasterVersionLabels(doc);
    if (langTasks.length === 0) { throw new Error("Keine anderssprachigen Mustervorlagen (z.B. -en-) gefunden."); }
    
    var originalPages = [];
    if (config.bdaSourcePages.toUpperCase() === "AUTO") {
        for (var p = 0; p < doc.pages.length; p++) {
            if (doc.pages[p].appliedMaster && doc.pages[p].appliedMaster.name.match(/-de[-_]/i)) {
                originalPages.push(doc.pages[p]);
            }
        }
    } else {
        originalPages = getPagesFromString(doc, config.bdaSourcePages);
    }

    if (originalPages.length === 0) { throw new Error("Keine deutschen Originalseiten gefunden."); }

    var resultMsg = "BDA-Automatik beendet für " + langTasks.length + " Sprachen.\n";

    if (config.updateTOC) {
        updateProgress(8, "Aktualisiere Titelseite für DE...", 8, "Passe TOC an...");
        updateTOCForLanguage(doc, "de", originalPages[0].name);
    }

    var createdBackups = [];

    for (var i = 0; i < langTasks.length; i++) {
        if (cancelFlag) throw new Error("CANCELLED");
        
        var task = langTasks[i];
        
        var overallStartPct = 10 + (i / langTasks.length) * 85;
        var overallEndPct = 10 + ((i + 1) / langTasks.length) * 85;
        
        updateProgress(10, "Erstelle Dokument für: " + task.code.toUpperCase() + "...", overallStartPct, "Sprache " + (i+1) + " von " + langTasks.length + ": " + task.code.toUpperCase());
        
        var newPagesForThisLang = [];
        for (var p = 0; p < originalPages.length; p++) {
            var newPage = originalPages[p].duplicate(LocationOptions.AT_END);
            try { newPage.appliedMaster = task.master; } catch(e) {}
            newPagesForThisLang.push(newPage);
        }
        
        var startPageStr = newPagesForThisLang[0].name; 
        var targetTextObjArray = [];
        for (var np = 0; np < newPagesForThisLang.length; np++) {
            var pItems = newPagesForThisLang[np].allPageItems;
            for(var tf=0; tf<pItems.length; tf++) {
                if (pItems[tf].constructor.name === "TextFrame") {
                    var st; try { st = pItems[tf].parentStory; } catch(e) { st = pItems[tf].texts[0]; }
                    targetTextObjArray.push(st);
                }
            }
        }
        
        executeTranslation(doc, targetTextObjArray, false, "", task.deepLCode, overallStartPct, overallEndPct);
        
        if (config.updateTOC) {
            updateTOCForLanguage(doc, task.code, startPageStr);
        }

        try {
            if (doc.saved) {
                updateProgress(95, "Speichere temporäres Backup...", overallEndPct, "Sichere Fortschritt...");
                var docFolder = doc.filePath.fsName;
                var docName = doc.name.replace(/\.indd$/i, "");
                var backupFile = new File(docFolder + "/" + docName + "_TempBackup_" + task.code.toUpperCase() + ".indd");
                doc.saveACopy(backupFile);
                createdBackups.push(backupFile);
            }
        } catch(e) {} 
    }

    updateProgress(98, "Verschiebe Original-Rückseite ans Ende...", 98, "Räume Seiten auf...");
    var backPageMoved = false;
    for (var p = doc.pages.length - 1; p >= 0; p--) {
        if (doc.pages[p].appliedMaster && doc.pages[p].appliedMaster.name.match(/back/i)) {
            doc.pages[p].move(LocationOptions.AT_END);
            backPageMoved = true;
            break; 
        }
    }
    
    updateProgress(99, "Räume temporäre Backups auf...", 99, "Fast fertig...");
    for (var b = 0; b < createdBackups.length; b++) {
        if (createdBackups[b].exists) {
            try { createdBackups[b].remove(); } catch(e) {}
        }
    }

    return resultMsg;
}

function getCurrentArticleVersionLabel() {
    var d = new Date();
    var year = d.getFullYear() % 100;
    var month = d.getMonth() + 1;
    var versionId = "v" + ("0" + year).slice(-2) + ("0" + month).slice(-2);
    return "Artikelnummer_" + versionId;
}

function getCurrentVersionToken() {
    var d = new Date();
    var year = d.getFullYear() % 100;
    var month = d.getMonth() + 1;
    return "v" + ("0" + year).slice(-2) + ("0" + month).slice(-2);
}

function updateVersionStrings(text, versionLabel) {
    if (!text) return text;
    var versionToken = versionLabel.split("_").pop();
    text = text.replace(/Artikelnummer(_| )?v?\d{4}/ig, versionLabel);
    text = text.replace(/_?V\d{4}\b/ig, function(match) {
        var out = versionToken;
        if (match.charAt(match[0] === '_' ? 1 : 0) === 'V') out = versionToken.toUpperCase();
        return match.charAt(0) === '_' ? '_' + out : out;
    });
    return text;
}

function updateLanguageMasterVersionLabels(doc) {
    var versionLabel = getCurrentArticleVersionLabel();
    var masterSpreads = doc.masterSpreads;
    for (var m = 0; m < masterSpreads.length; m++) {
        var masterName = masterSpreads[m].name;
        if (!masterName.match(/[-_]([a-z]{2})(?:[-_]|$)/i)) continue;
        var pages = masterSpreads[m].pages;
        for (var p = 0; p < pages.length; p++) {
            var allItems = pages[p].allPageItems;
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                if (item.constructor.name !== "TextFrame") continue;
                try {
                    var story = null;
                    try { story = item.parentStory; } catch (e) { story = null; }
                    if ((!story || !story.isValid) && item.texts && item.texts.length > 0) {
                        story = item.texts[0];
                    }
                    if (!story || !story.isValid) continue;
                    var text = story.contents;
                    var newText = updateVersionStrings(text, versionLabel);
                    if (newText !== text) {
                        story.contents = newText;
                    }
                } catch (e) {}
            }
        }
        // Aktualisiere auch Seiten, die diese Masterseiten verwenden,
        // falls Elemente überschrieben wurden.
        for (var p2 = 0; p2 < doc.pages.length; p2++) {
            if (!doc.pages[p2].appliedMaster || doc.pages[p2].appliedMaster.name !== masterName) continue;
            var pageItems = doc.pages[p2].allPageItems;
            for (var j = 0; j < pageItems.length; j++) {
                var pageItem = pageItems[j];
                if (pageItem.constructor.name !== "TextFrame") continue;
                try {
                    var pageStory = null;
                    try { pageStory = pageItem.parentStory; } catch (e) { pageStory = null; }
                    if ((!pageStory || !pageStory.isValid) && pageItem.texts && pageItem.texts.length > 0) {
                        pageStory = pageItem.texts[0];
                    }
                    if (!pageStory || !pageStory.isValid) continue;
                    var pageText = pageStory.contents;
                    var newPageText = updateVersionStrings(pageText, versionLabel);
                    if (newPageText !== pageText) {
                        pageStory.contents = newPageText;
                    }
                } catch (e) {}
            }
        }
    }
}

// --- 5B. TOC RÖNTGEN-UPDATE LOGIK ---
function updateTOCForLanguage(doc, langCode, newStartPage) {
    try {
        var page = doc.pages[0]; 
        var items = [];
        var allPI = page.allPageItems;
        for (var i = 0; i < allPI.length; i++) {
            if (allPI[i].constructor.name === "TextFrame") {
                items.push({ type: "frame", obj: allPI[i] });
                if (allPI[i].tables.length > 0) {
                    var tbs = allPI[i].tables;
                    for (var t = 0; t < tbs.length; t++) {
                        var cls = tbs[t].cells;
                        for (var c = 0; c < cls.length; c++) {
                            items.push({ type: "cell", obj: cls[c] });
                        }
                    }
                }
            }
        }

        var markerItem = null;
        for (var i = 0; i < items.length; i++) {
            var rawText = "";
            try { rawText = items[i].obj.texts[0].contents; } catch(e) { continue; }
            if (typeof rawText !== "string") rawText = String(rawText);
            var txt = rawText.replace(/[\s\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, "").toLowerCase();
            if (txt === langCode.toLowerCase()) { markerItem = items[i]; break; }
        }

        if (markerItem === null) return;

        var targetItem = null;
        if (markerItem.type === "cell") {
            var rowCells = markerItem.obj.parentRow.cells;
            for (var c = 0; c < rowCells.length; c++) {
                if (rowCells[c] === markerItem.obj) continue; 
                var cStr = "";
                try { cStr = String(rowCells[c].texts[0].contents); } catch(e){}
                if (cStr.match(/\([Xx\d]*\)/)) {
                    targetItem = { type: "cell", obj: rowCells[c] }; break;
                }
            }
        } else {
            var mBounds = markerItem.obj.geometricBounds;
            var markerCenterY = (mBounds[0] + mBounds[2]) / 2;
            for (var j = 0; j < items.length; j++) {
                if (items[j].type !== "frame" || items[j].obj === markerItem.obj) continue;
                var fBounds = items[j].obj.geometricBounds;
                var frameCenterY = (fBounds[0] + fBounds[2]) / 2;
                if (Math.abs(markerCenterY - frameCenterY) < 10) {
                    var str = "";
                    try { str = String(items[j].obj.texts[0].contents); } catch(e){}
                    if (str.match(/\([Xx\d]*\)/)) { targetItem = items[j]; break; }
                }
            }
        }

        if (targetItem !== null) {
            var oldText = targetItem.obj.texts[0].contents;
            var newText = oldText.replace(/\([Xx\d]*\)/, "(" + newStartPage + ")");
            targetItem.obj.texts[0].contents = newText;
        }
    } catch(e) {}
}

// --- 6. KERN-ÜBERSETZUNGS-LOGIK MIT TM, WÖRTERBUCH & AUTO-FIT ---
function executeTranslation(doc, textTargetsRaw, pagesMode, pagesString, selectedLang, overStartPct, overEndPct) {
    var storageEnv = setupTempImageStorage(doc);
    var textTargets = [];
    var storyIds = {};
    var inDesignLangName = getInDesignLanguageName(selectedLang); 

    var tm = loadTM();
    if (!tm[selectedLang]) tm[selectedLang] = {};
    
    var glossaryMap = {};
    var glossaryRegex = null;
    var parsedGlossary = loadCSVGlossary(csvPath);

    if (parsedGlossary) {
        var terms = [];
        var targetUpper = selectedLang.toUpperCase();
        var shortTarget = targetUpper.substring(0,2); 

        for (var key in parsedGlossary) {
            terms.push(key);
            if (parsedGlossary[key][targetUpper]) {
                glossaryMap[key.toLowerCase()] = parsedGlossary[key][targetUpper];
            } else if (parsedGlossary[key][shortTarget]) {
                glossaryMap[key.toLowerCase()] = parsedGlossary[key][shortTarget];
            } else {
                glossaryMap[key.toLowerCase()] = "###DNT###"; 
            }
        }
        if (terms.length > 0) {
            terms.sort(function(a,b){return b.length - a.length}); 
            for(var t=0; t<terms.length; t++) {
                terms[t] = terms[t].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); 
            }
            glossaryRegex = new RegExp("(^|[^\\wäöüÄÖÜßéèêáàâíìîóòôúùûñ])(" + terms.join("|") + ")(?=[^\\wäöüÄÖÜßéèêáàâíìîóòôúùûñ]|$)", "gi");
        }
    }

    var addTarget = function(st) {
        try { if (!st || !st.isValid) return; } catch(e) { return; }
        var stId = null; try { stId = st.id; } catch(e) {}
        if (stId !== null && stId !== undefined) {
            if (!storyIds[stId]) { storyIds[stId] = true; textTargets.push(st); }
        } else { textTargets.push(st); }
    };

    if (pagesMode) {
        var pagesToProcess = getPagesFromString(doc, pagesString);
        for(var p=0; p<pagesToProcess.length; p++) {
            var pItems = pagesToProcess[p].allPageItems;
            for(var tf=0; tf<pItems.length; tf++) {
                if (pItems[tf].constructor.name === "TextFrame") {
                    var st; try { st = pItems[tf].parentStory; } catch(e) { st = pItems[tf].texts[0]; }
                    addTarget(st);
                }
            }
        }
    } else {
        for (var s = 0; s < textTargetsRaw.length; s++) addTarget(textTargetsRaw[s]);
    }

    var globalParkedTables = []; var tableCounter = 0; var imageCounter = 0;

    for (var i = 0; i < textTargets.length; i++) {
        if (cancelFlag) throw new Error("CANCELLED");
        var currentText = textTargets[i];
        if (!currentText.isValid || currentText.characters.length === 0) continue;
        
        if (currentText.tables && currentText.tables.length > 0) {
            var tables = currentText.tables.everyItem().getElements();
            for (var t = tables.length - 1; t >= 0; t--) {
                var tbl = tables[t]; var tblId = ++tableCounter; 
                var marker = "###TBL_" + tblId + "###";
                var tmpFrame = storageEnv.page.textFrames.add({itemLayer: storageEnv.layer, geometricBounds: [0,-100, 50, -50]});
                
                var p = tbl.storyOffset.parent; var idx = tbl.storyOffset.index;
                p.characters.item(idx).move(LocationOptions.AFTER, tmpFrame.insertionPoints.item(0));
                globalParkedTables.push({ id: tblId, frame: tmpFrame });
                p.insertionPoints.item(idx).contents = marker;
                
                var pastedTbl = tmpFrame.tables[0];
                if (pastedTbl) {
                    var cells = pastedTbl.cells.everyItem().getElements();
                    for (var c = 0; c < cells.length; c++) textTargets.push(cells[c].texts[0]);
                }
            }
        }

        try {
            app.findTextPreferences = NothingEnum.nothing; app.changeTextPreferences = NothingEnum.nothing;
            app.findTextPreferences.findWhat = "^a"; 
            var foundAnchors = currentText.findText();
            for (var a = foundAnchors.length - 1; a >= 0; a--) {
                var anchorChar = foundAnchors[a].characters[0]; var imgID = ++imageCounter; 
                var marker = "###IMG_" + imgID + "###";
                
                if (anchorChar.pageItems.length > 0) anchorChar.pageItems[0].label = "TMP_IMG_" + imgID;
                else if (anchorChar.allPageItems.length > 0) anchorChar.allPageItems[0].label = "TMP_IMG_" + imgID;
                
                var p = anchorChar.parent; var idx = anchorChar.index;
                anchorChar.move(LocationOptions.AFTER, storageEnv.frame.insertionPoints.item(-1));
                p.insertionPoints.item(idx).contents = marker;

                try {
                    var sItems = storageEnv.frame.allPageItems; var movedItem = null;
                    for(var j = sItems.length - 1; j >= 0; j--){ if(sItems[j].label === "TMP_IMG_" + imgID) { movedItem = sItems[j]; break; } }
                    if (movedItem) {
                        var safeAddNestedTarget = function(tfItem) { var nStory; try { nStory = tfItem.parentStory; } catch(e) { nStory = tfItem.texts[0]; } addTarget(nStory); };
                        if (movedItem.constructor.name === "TextFrame") safeAddNestedTarget(movedItem);
                        if (movedItem.hasOwnProperty("allPageItems")) {
                            var nestedItems = movedItem.allPageItems;
                            for (var ni = 0; ni < nestedItems.length; ni++) { if (nestedItems[ni].constructor.name === "TextFrame") safeAddNestedTarget(nestedItems[ni]); }
                        }
                    }
                } catch(e) {}
            }
        } catch (e) {}
    }
    
    var buildXMLWithGlossary = function(textObj) {
        var xmlString = "<root>"; var ranges = textObj.textStyleRanges;
        for (var r = 0; r < ranges.length; r++) {
            var chunk = ranges[r].contents;
            var fFamily = "Arial"; try { fFamily = ranges[r].appliedFont.fontFamily; } catch(e) {}
            var fStyle = "Regular"; try { fStyle = ranges[r].fontStyle; } catch(e) {}
            var pSize = 12; try { pSize = ranges[r].pointSize; } catch(e) {}
            var pStyleName = ""; try { pStyleName = ranges[r].appliedParagraphStyle.name; } catch(e) {}
            var ldingStr = "AUTO"; try { if (ranges[r].leading !== Leading.AUTO) ldingStr = ranges[r].leading.toString(); } catch(e) {}
            var fColor = ""; try { fColor = ranges[r].fillColor.name.replace(/"/g, ''); } catch(e) {}
            var cStyle = ""; try { cStyle = ranges[r].appliedCharacterStyle.name.replace(/"/g, ''); } catch(e) {}
            var pAlign = ""; try { pAlign = ranges[r].justification.toString(); } catch(e) {}
            var lInd = "0"; try { lInd = ranges[r].leftIndent.toString(); } catch(e) {}
            var fInd = "0"; try { fInd = ranges[r].firstLineIndent.toString(); } catch(e) {}
            var bList = ""; try { bList = ranges[r].bulletsAndNumberingListType.toString(); } catch(e) {}
            
            chunk = chunk.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
            chunk = chunk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            var dntArr = dntStyles.split(",");
            var isDNT = false;
            for (var d=0; d<dntArr.length; d++) {
                var trimDNT = dntArr[d].replace(/^\s+|\s+$/g, '');
                if (trimDNT !== "" && (trimDNT === pStyleName || trimDNT === cStyle)) { isDNT = true; break; }
            }
            
            if (isDNT) {
                chunk = '<nt>' + chunk + '</nt>';
            } else {
                if (glossaryRegex) {
                    chunk = chunk.replace(glossaryRegex, function(match, prefix, term, offset, string) {
                        if (offset >= 7 && (string.substring(offset - 7, offset) === "###TBL_" || string.substring(offset - 7, offset) === "###IMG_")) return match; 
                        
                        var lowerMatch = term.toLowerCase();
                        var mappedVal = glossaryMap[lowerMatch];
                        var replacement = term;
                        if (mappedVal === "###DNT###") replacement = '<nt>' + term + '</nt>'; 
                        else if (mappedVal && mappedVal !== "") replacement = '<nt>' + mappedVal + '</nt>'; 
                        return prefix + replacement;
                    });
                }
                
                var regexArt = /\b([A-Z]+[0-9]+[A-Z0-9]*|[0-9]+[A-Z]+[A-Z0-9]*|[0-9]{4,})\b/g;
                chunk = chunk.replace(regexArt, function(match, p1, offset, string) {
                    var before = string.substring(0, offset);
                    var openTags = (before.match(/<nt>/g) || []).length;
                    var closeTags = (before.match(/<\/nt>/g) || []).length;
                    if (openTags > closeTags) return match; 

                    if (offset >= 7 && (string.substring(offset - 7, offset) === "###TBL_" || string.substring(offset - 7, offset) === "###IMG_")) return match; 
                    return '<nt>' + match + '</nt>';
                });
            }

            chunk = chunk.replace(/###(TBL_\d+|IMG_\d+)###/g, '<nt>###$1###</nt>');
            chunk = chunk.replace(/\r/g, '<pbr/>').replace(/\n/g, '<lbr/>').replace(/\t/g, '<tab/>');
            if (chunk !== "") xmlString += '<t f="' + fFamily + '" s="' + fStyle + '" z="' + pSize + '" p="' + pStyleName + '" l="' + ldingStr + '" c="' + fColor + '" k="' + cStyle + '" a="' + pAlign + '" li="' + lInd + '" fi="' + fInd + '" b="' + bList + '">' + chunk + '</t>';
        }
        return xmlString + "</root>";
    };

    var deepLQueue = [];
    var finalTranslations = new Array(textTargets.length);

    for (var i = 0; i < textTargets.length; i++) {
        if (!textTargets[i].isValid || textTargets[i].characters.length === 0) { finalTranslations[i] = ""; continue; }
        
        var xml = buildXMLWithGlossary(textTargets[i]);
        var textOnlyLength = xml.replace(/<[^>]+>/g, '').replace(/###(?:IMG|TBL)_\d+###/g, '').replace(/[\s\d.,:;"'!?\-+*\/=()[\]{}&%$§<>|\\~`]/g, '').length; 
        
        if (xml === "<root></root>" || xml === "" || textOnlyLength === 0) { 
            finalTranslations[i] = ""; 
        } else if (tm[selectedLang][xml]) {
            finalTranslations[i] = normalizeTranslatedXML(tm[selectedLang][xml]);
            globalStats.savedChars += textOnlyLength;
        } else {
            deepLQueue.push({ index: i, xml: xml, len: textOnlyLength });
            finalTranslations[i] = null;
        }
    }
    
    if (deepLQueue.length > 0) {
        var justXMLs = [];
        for(var q=0; q < deepLQueue.length; q++) justXMLs.push(deepLQueue[q].xml);
        
        var translatedBatch = translateBatchDeepL(justXMLs, selectedLang, overStartPct, overEndPct);
        
        if (translatedBatch !== null) {
            var tmUpdated = false;
            for(var q=0; q < deepLQueue.length; q++) {
                var trXML = translatedBatch[q];
                if (trXML) { 
                    trXML = normalizeTranslatedXML(trXML);
                    finalTranslations[deepLQueue[q].index] = trXML;
                    tm[selectedLang][deepLQueue[q].xml] = trXML;
                    tmUpdated = true;
                    globalStats.apiChars += deepLQueue[q].len;
                }
            }
            if (tmUpdated) saveTM(tm); 
        }
    }
    
    var formatPct = overStartPct + ((overEndPct - overStartPct) * 0.9);
    updateProgress(90, "Wende Formatierungen an...", formatPct, null);
    for (var i = 0; i < textTargets.length; i++) {
        if (cancelFlag) throw new Error("CANCELLED");
        if (finalTranslations[i]) applyXMLtoInDesign(textTargets[i], finalTranslations[i], inDesignLangName);
    }
    
    updateProgress(95, "Stelle Tabellen und Bilder wieder her...", overEndPct, null);
    app.findGrepPreferences = NothingEnum.nothing; app.changeGrepPreferences = NothingEnum.nothing;
    for (var i = globalParkedTables.length - 1; i >= 0; i--) {
        var parked = globalParkedTables[i];
        app.findGrepPreferences.findWhat = "[ \t]*###TBL_\\s*" + parked.id + "\\s*###[ \t]*"; 
        var results = doc.findGrep();
        if (results.length > 0) {
            try { parked.frame.characters.item(0).move(LocationOptions.AFTER, results[0].insertionPoints.item(0)); results[0].remove(); } catch(e) {}
        } else {
            try { parked.frame.characters.item(0).move(LocationOptions.AFTER, textTargets[0].insertionPoints.item(-1)); } catch(e) {}
        }
        try { if (parked.frame.isValid) parked.frame.remove(); } catch(e) {}
    }
    storageEnv.frame.itemLayer.visible = true;
    
    app.findGrepPreferences.findWhat = "###IMG_\\s*\\d+\\s*###"; var allFoundImages = doc.findGrep();
    for (var f = allFoundImages.length - 1; f >= 0; f--) {
        var placeholderRange = allFoundImages[f]; var match = placeholderRange.contents.match(/IMG_\s*(\d+)/);
        if (!match) continue;
        var imgID = match[1]; var targetImageInStorage = null; var storageItems = storageEnv.frame.allPageItems;
        for (var j=0; j<storageItems.length; j++) { if (storageItems[j].label === "TMP_IMG_" + imgID) { targetImageInStorage = storageItems[j]; break; } }
        if (targetImageInStorage !== null) {
            try {
                var targetChar = targetImageInStorage.parent; 
                while (targetChar && targetChar.constructor.name !== "Character" && targetChar.constructor.name !== "Story" && targetChar.constructor.name !== "Application") targetChar = targetChar.parent;
                if (targetChar && targetChar.constructor.name === "Character") {
                    targetChar.move(LocationOptions.AFTER, placeholderRange.insertionPoints.item(0)); placeholderRange.remove();
                } else {
                    targetImageInStorage.parent.move(LocationOptions.AFTER, placeholderRange.insertionPoints.item(0)); placeholderRange.remove();
                }
            } catch(e) {}
        }
    }
    try { if (storageEnv.frame.isValid) storageEnv.frame.remove(); } catch(e) {}
    try { doc.layers.itemByName("TEMP_TRANS_IMAGES").visible = false; } catch(e) {}

    updateProgress(98, "Prüfe auf Textübersatz (Auto-Fit)...", overEndPct, null);
    var checkedFrameIds = {};
    for (var i = 0; i < textTargets.length; i++) {
        var st = textTargets[i];
        if (!st || !st.isValid) continue;
        var tFrames = [];
        try {
            if (st.constructor.name === "Story") tFrames = st.textContainers;
            else if (st.parentTextFrames) tFrames = st.parentTextFrames;
        } catch(e) {}
        
        for (var j = 0; j < tFrames.length; j++) {
            var tf = tFrames[j];
            if (tf && tf.isValid && tf.constructor.name === "TextFrame") {
                if (!checkedFrameIds[tf.id]) {
                    checkedFrameIds[tf.id] = true;
                    if (tf.overflows) {
                        var bounds = tf.geometricBounds;
                        var attempts = 0;
                        while (tf.overflows && attempts < 20) { 
                            bounds[2] += 5; 
                            tf.geometricBounds = bounds;
                            attempts++;
                        }
                        globalStats.fittedFrames++;
                    }
                }
            }
        }
    }
}

// === HILFSFUNKTIONEN FÜR DEEPL & CO ===
function translateBatchDeepL(textsArray, targetLangCode, overStartPct, overEndPct) {
    var endpoint = (apiKey.indexOf(":fx") !== -1) ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
    var translated = []; var batchSize = 25; 
    for (var b = 0; b < textsArray.length; b += batchSize) {
        if (cancelFlag) throw new Error("CANCELLED");
        
        var batchPct = (b / textsArray.length);
        var currentTaskPct = 20 + Math.round(batchPct * 60);
        
        var currentOverPct = overStartPct ? (overStartPct + (batchPct * (overEndPct - overStartPct) * 0.8)) : null;
        
        var endBatch = Math.min(b + batchSize, textsArray.length);
        updateProgress(currentTaskPct, "DeepL Anfrage: Sende Blöcke " + (b+1) + " bis " + endBatch + " von " + textsArray.length + "...", currentOverPct, null);
        
        var payloadStr = "target_lang=" + targetLangCode + "&tag_handling=xml&ignore_tags=tab,nt&splitting_tags=pbr,lbr";
        if (formalitySetting === "more" || formalitySetting === "less") {
            payloadStr += "&formality=" + formalitySetting;
        }
        for (var j = b; j < endBatch; j++) {
            var safeText = textsArray[j].replace(/'/g, "'\\''").replace(/\r/g, ' ').replace(/\n/g, ' ');
            payloadStr += "&text=" + encodeURIComponent(safeText);
        }
        
        var payloadFile = new File(Folder.temp + "/dl_pay_" + new Date().getTime() + ".txt");
        payloadFile.encoding = "UTF-8";
        payloadFile.open("w");
        payloadFile.write(payloadStr);
        payloadFile.close();

        try {
            var resultJSON = "";
            if (File.fs === "Macintosh") {
                var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Authorization: DeepL-Auth-Key " + apiKey + "' -d @'" + payloadFile.fsName + "'";
                resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
            } else {
                var outFile = new File(Folder.temp + "/dl_out_" + new Date().getTime() + ".json");
                var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                          'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Authorization: DeepL-Auth-Key ' + apiKey + '"" -d @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
                app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
                if (outFile.exists) {
                    outFile.encoding = "UTF-8"; outFile.open("r"); resultJSON = outFile.read(); outFile.close(); try { outFile.remove(); } catch(e){}
                }
            }
            
            var parsedObj = eval("(" + resultJSON + ")");
            if (parsedObj && parsedObj.translations) { for (var k = 0; k < parsedObj.translations.length; k++) translated.push(normalizeTranslatedXML(parsedObj.translations[k].text)); } 
            else { alert("Fehler bei DeepL Batch:\n" + resultJSON); return null; }
        } catch (e) { alert("Verbindungsfehler im Batch!\n" + e.message); return null; }
        finally { try { payloadFile.remove(); } catch(e){} }
    }
    return translated;
}

function normalizeTranslatedXML(xml) {
    if (!xml || xml === "") return xml;
    return xml.replace(/<root>\s+/g, '<root>')
              .replace(/(<(?:t|nt)[^>]*>)\s+/g, '$1')
              .replace(/(<root>)\s+/g, '$1');
}

function applyXMLtoInDesign(targetTextObj, translatedXML, inDesignLangName) {
    if (!translatedXML || translatedXML === "") return;
    translatedXML = translatedXML.replace(/[\r\n]+/g, '')
                                 .replace(/(<(?:t|nt)[^>]*>)\s+/g, '$1')
                                 .replace(/(###(?:IMG|TBL)_\d+###)\s+(?=###(?:IMG|TBL)_\d+###)/g, '$1');
    var isPartial = false; var textFlow = null; var currentIdx = 0;
    try {
        if (targetTextObj.constructor.name === "Story") { isPartial = false; textFlow = targetTextObj; } 
        else if (targetTextObj.parent && targetTextObj.parent.constructor.name === "Cell") {
            textFlow = targetTextObj.parent.texts[0]; isPartial = (targetTextObj.characters.length < textFlow.characters.length);
        } else { isPartial = true; textFlow = targetTextObj.parentStory; }
    } catch(e) { isPartial = false; textFlow = targetTextObj; }

    if (isPartial) { try { currentIdx = targetTextObj.insertionPoints.item(0).index; } catch(e){} try { targetTextObj.remove(); } catch(e){} } 
    else { try { textFlow.contents = ""; } catch(e){} currentIdx = 0; }

    var regex = /<t([^>]*)>([\s\S]*?)<\/t>/gi; var match;
    while ((match = regex.exec(translatedXML)) !== null) {
        var attrs = match[1]; var textContent = match[2];
        var getAttr = function(str, name) { var m = new RegExp(name + '="([^"]*)"').exec(str); return m ? m[1] : ""; };
        var fFam = getAttr(attrs, "f"); var fSty = getAttr(attrs, "s"); var fSiz = parseFloat(getAttr(attrs, "z"));
        var pSty = getAttr(attrs, "p"); var lead = getAttr(attrs, "l"); var fCol = getAttr(attrs, "c");
        var cSty = getAttr(attrs, "k"); var pAli = getAttr(attrs, "a"); var lInd = getAttr(attrs, "li");
        var fInd = getAttr(attrs, "fi"); var bLis = getAttr(attrs, "b");
        
        textContent = textContent.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<pbr\/>/g, '\r').replace(/<lbr\/>/g, '\n').replace(/<tab\/>/g, '\t').replace(/<\/?nt[^>]*>/gi, '');
        if (textContent.length > 0) {
            var appliedRange = null; var doc = app.activeDocument;
            try {
                if (isPartial) {
                    textFlow.insertionPoints.item(currentIdx).contents = textContent;
                    var endIdx = currentIdx + textContent.length - 1;
                    if (endIdx >= currentIdx) appliedRange = textFlow.characters.itemByRange(currentIdx, endIdx);
                    currentIdx += textContent.length; 
                } else {
                    var lenBefore = textFlow.characters.length; textFlow.insertionPoints.item(-1).contents = textContent;
                    var sIdx = lenBefore; var eIdx = textFlow.characters.length - 1;
                    if (eIdx >= sIdx) appliedRange = textFlow.characters.itemByRange(sIdx, eIdx);
                }
            } catch(e) { continue; }
            
            if (appliedRange !== null) {
                try { var myPStyle = doc.paragraphStyles.itemByName(pSty); if (myPStyle && myPStyle.isValid) appliedRange.applyParagraphStyle(myPStyle, false); } catch(e) {}
                try { if (bLis !== "") appliedRange.bulletsAndNumberingListType = ListType[bLis]; } catch(e) {}
                try { appliedRange.appliedFont = fFam; } catch(e) {}
                try { appliedRange.fontStyle = fSty; } catch(e) { try { appliedRange.fontStyle = "Regular"; } catch(e2) {} }
                try { appliedRange.pointSize = fSiz; } catch(e) {}
                try { appliedRange.leading = (lead === "AUTO") ? Leading.AUTO : parseFloat(lead); } catch(e) {}
                try { if (fCol !== "") { var myColor = doc.swatches.itemByName(fCol); if (myColor.isValid) appliedRange.fillColor = myColor; } } catch(e) {}
                try { if (cSty !== "" && cSty !== "[None]" && cSty !== "[Ohne]") { var myCStyle = doc.characterStyles.itemByName(cSty); if (myCStyle.isValid) appliedRange.applyCharacterStyle(myCStyle, false); } } catch(e) {}
                try { if (pAli !== "") appliedRange.justification = Justification[pAli]; } catch(e) {}
                try { appliedRange.leftIndent = parseFloat(lInd); } catch(e) {}
                try { appliedRange.firstLineIndent = parseFloat(fInd); } catch(e) {}
                
                try {
                    if (inDesignLangName !== "") {
                        var langObj = doc.languagesWithVendors.itemByName(inDesignLangName);
                        if (!langObj.isValid) langObj = app.languagesWithVendors.itemByName(inDesignLangName);
                        if (langObj && langObj.isValid) appliedRange.appliedLanguage = langObj;
                    }
                } catch(e) {}
            }
        }
    }
}

function setupTempImageStorage(doc) {
    var tempLayer = doc.layers.itemByName("TEMP_TRANS_IMAGES");
    if (!tempLayer.isValid) tempLayer = doc.layers.add({name: "TEMP_TRANS_IMAGES", visible: true, locked: false});
    else { tempLayer.locked = false; tempLayer.visible = true; }
    var currentPage = doc.pages[0]; try { if (app.activeWindow.activePage) currentPage = app.activeWindow.activePage; } catch(e) {}
    var storageFrame = currentPage.textFrames.add({itemLayer: tempLayer, geometricBounds: [0,-2000, 2000, -50], contents: ""});
    return { layer: tempLayer, page: currentPage, frame: storageFrame };
}

function getPagesFromString(doc, pageStr) {
    var pages = []; var parts = pageStr.split(",");
    for(var i=0; i<parts.length; i++) {
        var part = parts[i].replace(/\s/g, "");
        if(part.indexOf("-") !== -1) {
            var range = part.split("-");
            var startPage = doc.pages.itemByName(range[0]); var endPage = doc.pages.itemByName(range[1]);
            if(startPage.isValid && endPage.isValid) {
                var startIndex = startPage.documentOffset; var endIndex = endPage.documentOffset;
                var step = (startIndex <= endIndex) ? 1 : -1;
                for(var j=startIndex; (step === 1 ? j<=endIndex : j>=endIndex); j+=step) { pages.push(doc.pages[j]); }
            }
        } else { var p = doc.pages.itemByName(part); if(p.isValid) pages.push(p); }
    }
    return pages;
}

// === START ===
myWindow.show();
