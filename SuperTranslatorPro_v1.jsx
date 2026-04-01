#targetengine "SuperTranslatorPRO282"

// ==============================================
// SUPER ÜBERSETZER PRO - VERSION 28.2 (API-KEY ENTFERNT)
// ==============================================

// --- 0. EINSTELLUNGEN (API-KEY, CSV-PFAD & TM-PFAD) ---
var DEEPL_KEY_LABEL = "SuperTranslatorPRO_DeepL_API_Key";
var CSV_PATH_LABEL = "SuperTranslatorPRO_CSV_Path";
var TM_PATH_LABEL = "SuperTranslatorPRO_TM_Path"; 
var REF_SYMBOLS_LABEL = "SuperTranslatorPRO_RefSymbols";
var HYPERLINK_PAGE_MAP_LABEL = "SuperTranslatorPRO_HyperlinkPageMap";
var AUTO_HYPERLINKS_LABEL = "SuperTranslatorPRO_BDAAutoHyperlinks";
var BACK_PAGE_TRACKER_LABEL = "SuperTranslatorPRO_BackPageTracker";

function detectUILanguage() {
    var localeText = "";
    try { localeText = String(app.locale || ""); } catch (e) { localeText = ""; }
    localeText = localeText.replace(/^\s+|\s+$/g, "").toLowerCase();
    if (localeText.indexOf("de") === 0) return "de";
    if (localeText.indexOf("german") !== -1 || localeText.indexOf("deutsch") !== -1) return "de";
    return "en";
}

var UI_LANG = detectUILanguage();
var UI_IS_GERMAN = (UI_LANG === "de");
var UI_STRINGS = {
    main_title: { de: "Was soll übersetzt werden?", en: "What should be translated?" },
    settings_button: { de: "⚙️ Einstellungen", en: "⚙️ Settings" },
    settings_help: { de: "Einstellungen, Wörterbuch & API-Key", en: "Settings, glossary & API key" },
    manual_mode: { de: "Manueller Modus", en: "Manual Mode" },
    selection_mode: { de: "Aktuelle Auswahl (Rahmen/Texte/Tabellen)", en: "Current selection (frames/texts/tables)" },
    pages_mode: { de: "Bestimmte Seiten übersetzen:", en: "Translate specific pages:" },
    pages_help: { de: "Z.B. 1, 3, 5-8", en: "E.g. 1, 3, 5-8" },
    target_language_manual: { de: "Zielsprache (Für Manuelle Auswahl / Einzelne Seiten)", en: "Target language (for manual selection / selected pages)" },
    lang_group_favorites: { de: "--- FAVORITEN ---", en: "--- FAVORITES ---" },
    lang_group_other_eu: { de: "--- SONSTIGE EU SPRACHEN ---", en: "--- OTHER EU LANGUAGES ---" },
    auto_mode: { de: "Voll Automatik Modus", en: "Full Automatic Mode" },
    auto_settings: { de: "Einstellungen (Automatik Modus)", en: "Settings (Automatic Mode)" },
    original_pages: { de: "Originalseiten:", en: "Source pages:" },
    auto_source_help: { de: "AUTO sucht selbst nach der deutschen Musterseite über das schwarze Sprachkästchen", en: "AUTO detects the German master via the black language badge" },
    toc_checkbox: { de: "Titelseite (Seite 1): Start-Seitenzahlen aktualisieren", en: "Title page (page 1): update start page numbers" },
    auto_hyperlink_checkbox: { de: "Referenz-Hyperlinks automatisch erstellen", en: "Create reference hyperlinks automatically" },
    auto_hyperlink_symbols: { de: "Klammern/Symbole:", en: "Brackets/symbols:" },
    auto_hyperlink_help: { de: "Verwendet die Sprachcodes und Seitenzahlen von Seite 1, z. B. fr (33) und en (22).", en: "Uses the language codes and page numbers from page 1, for example fr (33) and en (22)." },
    back_page_tracker_label: { de: "Rückseiten-Suche:", en: "Back-page search:" },
    back_page_tracker_help: { de: "Text zur Erkennung der Rückseite. Standard: ©. Mehrere Begriffe mit |, ; oder Zeilenumbruch trennen. Wenn © mehrfach vorkommt, wird zusätzlich automatisch nach 'Steinbach International GmbH' gesucht.", en: "Text used to detect the back page. Default: ©. Separate multiple terms with |, ; or a line break. If © appears multiple times, 'Steinbach International GmbH' is checked automatically as an extra filter." },
    back_page_not_found_notice: { de: "Hinweis: Es konnte keine Rückseite sicher erkannt werden.\nDer Automatiklauf wird trotzdem fortgesetzt.\nWenn nötig, bitte die Rückseiten-Suche in den Einstellungen anpassen.", en: "Note: No back page could be identified with confidence.\nThe automatic run will continue anyway.\nIf needed, adjust the back-page search in the settings." },
    only_text_update: { de: "Nur bei Textupdate", en: "Text update only" },
    translate_start: { de: "Übersetzung starten", en: "Start Translation" },
    spellcheck_button: { de: "Deutsch prüfen", en: "Check German" },
    spellcheck_help: { de: "Prüft deutsche Texte auf -de-Masterseiten und deren Dokumentseiten.", en: "Checks German text on -de masters and the document pages based on them." },
    close_button: { de: "Schließen", en: "Close" },
    no_document_open: { de: "Kein Dokument offen!", en: "No document is open." },
    spellcheck_error: { de: "Fehler bei der Rechtschreibprüfung:\n{message}", en: "Spell-check error:\n{message}" },
    settings_title: { de: "⚙️ Einstellungen", en: "⚙️ Settings" },
    log_file: { de: "📄 Logdatei", en: "📄 Log File" },
    info: { de: "ℹ️ Info", en: "ℹ️ Info" },
    deepl_api_key: { de: "DeepL Pro API-Key:", en: "DeepL Pro API key:" },
    glossary_path: { de: "Netzwerk-Wörterbuch (CSV Pfad):", en: "Network glossary (CSV path):" },
    browse: { de: "Durchsuchen...", en: "Browse..." },
    glossary_select: { de: "Bitte wähle die Wörterbuch CSV-Datei aus", en: "Please choose the glossary CSV file" },
    glossary_create_select: { de: "Speicherort für neues Wörterbuch wählen", en: "Choose where to save the new glossary" },
    glossary_setup_title: { de: "Wörterbuch einrichten", en: "Set up glossary" },
    glossary_setup_message: { de: "Beim ersten Start kann ein neues Wörterbuch-Template erstellt oder ein bestehendes Wörterbuch ausgewählt werden.", en: "On first launch you can create a new glossary template or choose an existing glossary." },
    glossary_setup_create: { de: "Neu erstellen", en: "Create new" },
    glossary_setup_choose: { de: "Bestehend wählen", en: "Choose existing" },
    glossary_setup_later: { de: "Später", en: "Later" },
    glossary_setup_current_path: { de: "Aktueller Pfad:", en: "Current path:" },
    glossary_template_created: { de: "Wörterbuch-Template erstellt:\n{path}", en: "Glossary template created:\n{path}" },
    glossary_template_failed: { de: "Wörterbuch-Template konnte nicht erstellt werden:\n{message}", en: "Glossary template could not be created:\n{message}" },
    formality: { de: "Anrede-Form (für unterstützte Sprachen):", en: "Formality (for supported languages):" },
    formality_default: { de: "Standard (DeepL entscheidet)", en: "Default (DeepL decides)" },
    formality_formal: { de: "Formell (Sie)", en: "Formal" },
    formality_informal: { de: "Informell (Du)", en: "Informal" },
    ignored_styles: { de: "Ignorierte Absatz-/Zeichenformate (DNT, kommagetrennt):", en: "Ignored paragraph/character styles (DNT, comma-separated):" },
    memory_path: { de: "Netzwerk-Memory (JSON Pfad):", en: "Network memory (JSON path):" },
    memory_select: { de: "Bitte wähle die Memory JSON-Datei aus", en: "Please choose the memory JSON file" },
    memory_save_new: { de: "Speicherort für neues Memory wählen", en: "Choose a location for a new memory file" },
    reference_symbols: { de: "Referenz-Symbole (z. B. [], (), {}):", en: "Reference symbols (e.g. [], (), {}):" },
    clear_memory: { de: "Memory leeren", en: "Clear Memory" },
    feedback_report: { de: "Feedback-Report", en: "Feedback Report" },
    save: { de: "Speichern", en: "Save" },
    cancel: { de: "Abbrechen", en: "Cancel" },
    settings_saved: { de: "Einstellungen erfolgreich gespeichert!", en: "Settings saved successfully." },
    clear_memory_confirm: { de: "Bist du sicher? Das aktuell ausgewählte Memory wird geleert.", en: "Are you sure? The currently selected memory file will be cleared." },
    clear_memory_done: { de: "Translation Memory wurde geleert.", en: "Translation memory has been cleared." },
    no_log_file: { de: "Es wurde noch keine Logdatei erstellt.", en: "No log file has been created yet." },
    about_title: { de: "Über Super Translator Pro", en: "About Super Translator Pro" },
    memory_write_warning: { de: "Memory-Warnung: Datei konnte nicht geschrieben werden.", en: "Memory warning: the file could not be written." },
    legacy_missing_title: { de: "Fehlende Musterseiten erzeugen", en: "Create Missing Master Pages" },
    legacy_missing_info: { de: "Zielsprachen auswählen oder abwählen.\nBereits erkannte Sprachen sind automatisch aktiviert.\nMit Reihenfolge bestimmst du die Position der Musterseiten (1 = zuerst).", en: "Select or deselect target languages.\nDetected languages are enabled automatically.\nUse the order field to control the master-page position (1 = first)." },
    legacy_create: { de: "Übernehmen", en: "Apply" },
    legacy_language_label: { de: "Sprache", en: "Language" },
    legacy_order_label: { de: "Reihenfolge", en: "Order" },
    legacy_no_german_master: { de: "Keine deutsche Musterseite erkannt. Erwartet wurde ein schwarzes Kästchen mit 'de'.", en: "No German master page detected. Expected a black badge with 'de'." },
    legacy_creation_cancelled: { de: "Musterseiten-Erzeugung abgebrochen.", en: "Master-page creation cancelled." },
    legacy_no_languages_selected: { de: "Keine Zielsprachen für die automatische Musterseiten-Generierung ausgewählt.", en: "No target languages selected for automatic master-page creation." },
    hyperlink_settings_button: { de: "Hyperlinks", en: "Hyperlinks" },
    hyperlink_settings_help: { de: "Öffnet den Hyperlinks-Dialog für Referenzen und Web-URLs.", en: "Opens the hyperlink dialog for references and web URLs." },
    hyperlink_dialog_title: { de: "Hyperlinks", en: "Hyperlinks" },
    hyperlink_group_title: { de: "Hyperlinks", en: "Hyperlinks" },
    hyperlink_language: { de: "Sprache:", en: "Language:" },
    hyperlink_target_page: { de: "Zielseite:", en: "Target page:" },
    hyperlink_save_mapping: { de: "Zuordnung speichern", en: "Save mapping" },
    hyperlink_remove_mapping: { de: "Zuordnung entfernen", en: "Remove mapping" },
    hyperlink_saved_mappings: { de: "Aktuelle Zuordnungen:", en: "Current mappings:" },
    hyperlink_no_mappings_saved: { de: "Keine Sprach-Zielseiten gespeichert.", en: "No language page mappings saved." },
    hyperlink_execute: { de: "Verlinken", en: "Link" },
    link_working: { de: "Referenz-Hyperlinks werden erstellt...", en: "Creating reference hyperlinks..." },
    link_summary: { de: "Hyperlinks aktualisiert.\n\nSymbole: {symbols}\nZielseiten:\n{mappingSummary}\nReferenz-Links erstellt/aktualisiert: {links}\nWeb-Links erstellt: {urlLinks}\nÜbersprungen: {skipped}", en: "Hyperlinks updated.\n\nSymbols: {symbols}\nTarget pages:\n{mappingSummary}\nReference links created/updated: {links}\nWeb links created: {urlLinks}\nSkipped: {skipped}" },
    link_invalid_page: { de: "Die Zielseite '{page}' für {language} wurde im Dokument nicht gefunden.", en: "The target page '{page}' for {language} was not found in the document." },
    link_no_matches: { de: "Es wurden weder Referenzen mit den definierten Symbolen noch Web-URLs im Dokument gefunden.", en: "Neither references using the configured symbols nor web URLs were found in the document." },
    hyperlink_page_required: { de: "Bitte trage eine Zielseite für {language} ein.", en: "Please enter a target page for {language}." },
    link_error: { de: "Hyperlink-Verarbeitung fehlgeschlagen:\n{message}", en: "Hyperlink processing failed:\n{message}" },
    german_frame_dialog_title: { de: "Suchen/Ersetzen Deutsch {current}/{total}", en: "Find/Replace German {current}/{total}" },
    german_frame_hint_count: { de: "{count} konkrete Hinweis(e) in diesem Textrahmen", en: "{count} specific suggestion(s) in this text frame" },
    german_findings: { de: "Auffälligkeiten:", en: "Findings:" },
    german_current_hit: { de: "Aktueller Treffer", en: "Current Match" },
    german_hint: { de: "Hinweis:", en: "Hint:" },
    german_keep: { de: "Behalten", en: "Keep" },
    german_apply: { de: "Übernehmen", en: "Apply" },
    german_finish: { de: "Beenden", en: "Finish" },
    german_replace_failed: { de: "Die Stelle konnte nicht übernommen werden:\n{location}", en: "This location could not be applied:\n{location}" },
    german_dialog_title: { de: "Deutsch korrigieren {current}/{total}", en: "Correct German {current}/{total}" },
    german_match: { de: "Treffer: {text}", en: "Match: {text}" },
    german_context: { de: "Kontext:", en: "Context:" },
    german_find_label: { de: "Suchen nach:", en: "Find:" },
    german_replace_label: { de: "Ersetzen durch:", en: "Replace with:" },
    languagetool_temp_file_error: { de: "Temporäre Anfrage-Datei konnte nicht erstellt werden.", en: "Temporary request file could not be created." },
    languagetool_call_failed: { de: "LanguageTool-Aufruf fehlgeschlagen.", en: "LanguageTool call failed." },
    languagetool_no_response: { de: "Keine Antwort von LanguageTool erhalten.", en: "No response received from LanguageTool." },
    languagetool_parse_error: { de: "Antwort von LanguageTool konnte nicht gelesen werden.", en: "The LanguageTool response could not be read." },
    languagetool_hint: { de: "LanguageTool-Hinweis", en: "LanguageTool hint" },
    languagetool_correction: { de: "LanguageTool-Korrektur", en: "LanguageTool correction" },
    german_skip: { de: "Überspringen", en: "Skip" },
    german_replace: { de: "Ersetzen", en: "Replace" },
    german_auto_replace_failed: { de: "Die Stelle konnte nicht automatisch ersetzt werden:\n{summary}", en: "This location could not be replaced automatically:\n{summary}" },
    german_no_targets: { de: "Keine Texte auf Dokumentseiten mit deutscher Musterseite gefunden.", en: "No text was found on document pages based on the German master." },
    german_progress_title: { de: "Deutsche Rechtschreibprüfung", en: "German Spell Check" },
    german_prepare_check: { de: "Bereite Prüfung vor...", en: "Preparing check..." },
    german_check_progress: { de: "Prüfe Dokumentseiten mit deutscher Musterseite: Text {current} von {total}...", en: "Checking document pages based on the German master: text {current} of {total}..." },
    german_check_ok: { de: "Korrekturprüfung für Dokumentseiten mit deutscher Musterseite abgeschlossen. Keine Änderungen vorgeschlagen.", en: "Correction check for document pages based on the German master completed. No changes suggested." },
    german_check_notice_skipped: { de: "\n\nHinweis: {count} Textblöcke konnten nicht geprüft werden.", en: "\n\nNote: {count} text block(s) could not be checked." },
    german_dialog_done: { de: "Korrekturdialog beendet.\nErsetzt: {replaced}\nÜbersprungen: {skipped}", en: "Correction dialog finished.\nReplaced: {replaced}\nSkipped: {skipped}" },
    german_dialog_done_stopped: { de: "\nVorzeitig beendet.", en: "\nStopped early." },
    progress_title: { de: "Übersetzung läuft...", en: "Translation in Progress..." },
    progress_current_step: { de: "Aktueller Schritt:", en: "Current step:" },
    progress_preparing: { de: "Vorbereitung...", en: "Preparing..." },
    progress_overall: { de: "Gesamter Vorgang:", en: "Overall progress:" },
    progress_complete_pct: { de: "{pct}% abgeschlossen", en: "{pct}% completed" },
    progress_eta_calc: { de: "Restzeit: Berechne...", en: "Remaining time: calculating..." },
    progress_cancel: { de: "Abbrechen", en: "Cancel" },
    progress_close: { de: "Schließen", en: "Close" },
    progress_cancel_requested: { de: "Abbruch angefordert... bitte warten.", en: "Cancel requested... please wait." },
    progress_cancelling: { de: "Wird abgebrochen...", en: "Cancelling..." },
    progress_eta: { de: "Restzeit: ca. {mins} Min. {secs} Sek.", en: "Remaining time: about {mins} min {secs} sec." },
    progress_done: { de: "Verarbeitung abgeschlossen.", en: "Processing completed." },
    progress_success: { de: "✅ Erfolgreich abgeschlossen!", en: "✅ Completed successfully!" },
    progress_duration: { de: "Dauer: {mins} Min. {secs} Sek. | API gespart: {saved} Z. | Rahmen gefixt: {frames}", en: "Duration: {mins} min {secs} sec | API saved: {saved} chars | Frames fixed: {frames}" },
    validation_invalid_lang: { de: "Bitte wähle eine gültige Zielsprache aus, keine Trennlinie.", en: "Please select a valid target language, not a separator." },
    validation_select_something: { de: "Bitte markiere zuerst etwas im Dokument.", en: "Please select something in the document first." },
    validation_enter_pages: { de: "Bitte Seitenzahlen eintragen.", en: "Please enter page numbers." },
    validation_enter_pages_or_auto: { de: "Bitte gib die Seiten an oder nutze AUTO.", en: "Please enter pages or use AUTO." },
    validation_enter_api_key: { de: "Bitte trage zuerst deinen DeepL API-Key in den Einstellungen (⚙️) ein.", en: "Please enter your DeepL API key in the settings (⚙️) first." },
    process_cancelled: { de: "⚠️ Vorgang abgebrochen!\n\nTipp: Drücke jetzt Cmd+Z (Rückgängig), um alle bisherigen Änderungen in einem Rutsch zu verwerfen.", en: "⚠️ Process cancelled.\n\nTip: press Cmd+Z (Undo) now to revert all changes made so far in one step." },
    process_error: { de: "Ein Fehler ist aufgetreten:\n{message}", en: "An error occurred:\n{message}" },
    undo_translation: { de: "Super Übersetzer: {mode}", en: "Super Translator: {mode}" },
    all_translations_done: { de: "Alle Übersetzungen fehlerfrei beendet.", en: "All translations completed successfully." },
    read_textframes: { de: "Lese Textrahmen aus...", en: "Reading text frames..." },
    preparation: { de: "Vorbereitung", en: "Preparation" },
    result_selection_pages: { de: "Markierung/Seiten in {lang} übersetzt.", en: "Selection/pages translated to {lang}." },
    bda_check_masters: { de: "Prüfe Musterseiten...", en: "Checking master pages..." },
    bda_analyze_doc: { de: "Analysiere Dokument...", en: "Analyzing document..." },
    bda_create_missing: { de: "Erzeuge fehlende Musterseiten...", en: "Creating missing master pages..." },
    bda_create_legacy: { de: "Erzeuge Legacy-Fallback...", en: "Creating legacy fallback..." },
    bda_search_templates: { de: "Suche Mustervorlagen...", en: "Searching master templates..." },
    bda_no_templates: { de: "Keine anderssprachigen Mustervorlagen (z.B. -en-) gefunden.", en: "No non-German master templates found (for example -en-)." },
    bda_no_original_pages: { de: "Keine deutschen Originalseiten gefunden.", en: "No German source pages found." },
    bda_finished: { de: "BDA-Automatik beendet für {count} Sprachen.\n", en: "BDA automatic mode finished for {count} languages.\n" },
    bda_update_cover: { de: "Aktualisiere Titelseite für DE...", en: "Updating title page for DE..." },
    bda_adjust_toc: { de: "Passe TOC an...", en: "Updating TOC..." },
    bda_create_doc_lang: { de: "Erstelle Dokument für: {lang}...", en: "Creating document for: {lang}..." },
    bda_language_progress: { de: "Sprache {current} von {total}: {lang}", en: "Language {current} of {total}: {lang}" },
    bda_save_backup: { de: "Speichere temporäres Backup...", en: "Saving temporary backup..." },
    bda_save_progress: { de: "Sichere Fortschritt...", en: "Saving progress..." },
    bda_move_back_page: { de: "Verschiebe Original-Rückseite ans Ende...", en: "Moving original back page to the end..." },
    bda_cleanup_pages: { de: "Räume Seiten auf...", en: "Cleaning up pages..." },
    bda_cleanup_backups: { de: "Räume temporäre Backups auf...", en: "Cleaning up temporary backups..." },
    bda_almost_done: { de: "Fast fertig...", en: "Almost done..." },
    sync_no_source_pages: { de: "Keine deutschen Originalseiten zum Vergleich gefunden.", en: "No German source pages were found for comparison." },
    sync_state_saved: { de: "BDA-Textupdate: Ausgangszustand gespeichert. Ändere jetzt den deutschen Text und starte erneut.", en: "BDA text update: initial state saved. Change the German text and start again." },
    sync_no_target_pages: { de: "Keine Zielseiten in anderen Sprachen gefunden.", en: "No target pages in other languages were found." },
    sync_no_changes: { de: "Keine geänderten Textblöcke oder Bilder gefunden.", en: "No changed text blocks or images were found." },
    sync_translate_changed: { de: "Übersetze geänderte Inhalte in {lang}...", en: "Translating changed content into {lang}..." },
    sync_updated: { de: "BDA-Textupdate ausgeführt für {count} geänderte Elemente.", en: "BDA text update executed for {count} changed item(s)." },
    feedback_created: { de: "Feedback-Report erstellt:\n{path}", en: "Feedback report created:\n{path}" },
    feedback_failed: { de: "Feedback-Report konnte nicht erstellt werden:\n{message}", en: "Feedback report could not be created:\n{message}" },
    deepl_unknown_response: { de: "Unbekannte Antwort von DeepL.", en: "Unknown response from DeepL." },
    deepl_request_blocks: { de: "DeepL Anfrage: Sende Blöcke {start} bis {end} von {total}...", en: "DeepL request: sending blocks {start} to {end} of {total}..." },
    deepl_request_text_blocks: { de: "DeepL Anfrage: Sende Textblöcke {start} bis {end} von {total}...", en: "DeepL request: sending text blocks {start} to {end} of {total}..." },
    deepl_parse_error: { de: "DeepL-Antwort konnte nicht gelesen werden.", en: "The DeepL response could not be read." },
    deepl_error_prefix: { de: "DeepL-Fehler: {message}", en: "DeepL error: {message}" },
    deepl_incomplete: { de: "DeepL lieferte unvollständige Ergebnisse zurück.", en: "DeepL returned incomplete results." },
    deepl_connection_error: { de: "DeepL-Verbindungsfehler: {message}", en: "DeepL connection error: {message}" },
    deepl_windows_plain_not_implemented: { de: "DeepL Plain Batch ist unter Windows nicht implementiert.", en: "DeepL plain batch is not implemented on Windows." },
    applying_formatting: { de: "Wende Formatierungen an...", en: "Applying formatting..." },
    restoring_tables_images: { de: "Stelle Tabellen und Bilder wieder her...", en: "Restoring tables and images..." },
    checking_overflow: { de: "Prüfe auf Textübersatz (Auto-Fit)...", en: "Checking for overset text (auto-fit)..." }
};

function t(key, params) {
    var entry = UI_STRINGS[key];
    var text = entry ? (entry[UI_LANG] || entry.en || entry.de || key) : key;
    if (!params) return text;
    for (var name in params) {
        if (!params.hasOwnProperty(name)) continue;
        text = text.replace(new RegExp("\\{" + name + "\\}", "g"), String(params[name]));
    }
    return text;
}

function buildAboutText() {
    var infoText = SCRIPT_NAME + " v" + SCRIPT_VERSION + "\n";
    infoText += "© " + new Date().getFullYear() + " Andreas Schwarz\n\n";
    if (UI_IS_GERMAN) {
        infoText += "Ein professionelles Übersetzungstool für InDesign in Verbindung mit der DeepL API.\n\n";
        infoText += "Kernfunktionen:\n";
        infoText += "• Nahtloser Erhalt von Textformatierungen, Tabellen und verankerten Bildern\n";
        infoText += "• Integriertes Translation Memory (JSON) zur API-Kostenersparnis\n";
        infoText += "• Netzwerk-Glossar (CSV) für den Schutz von Fachbegriffen\n";
        infoText += "• Formelle/Informelle Anrede & DNT-Format Ignorierung\n";
        infoText += "• Cross-Platform (macOS & Windows) API-Anbindung\n";
        infoText += "• Intelligente Auto-Fit Korrektur gegen Textrahmen-Übersatz";
    } else {
        infoText += "A professional translation tool for InDesign powered by the DeepL API.\n\n";
        infoText += "Core features:\n";
        infoText += "• Preserves text formatting, tables, and anchored images\n";
        infoText += "• Integrated translation memory (JSON) to reduce API costs\n";
        infoText += "• Network glossary (CSV) to protect terminology\n";
        infoText += "• Formal/informal tone and DNT style exclusions\n";
        infoText += "• Cross-platform API integration (macOS & Windows)\n";
        infoText += "• Smart auto-fit correction for overset text frames";
    }
    return infoText;
}

function normalizeRefSymbols(symbols) {
    var raw = (symbols === null || symbols === undefined) ? "" : String(symbols);
    raw = raw.replace(/^\s+|\s+$/g, "");
    if (raw === "") raw = "[]";

    var compact = raw.replace(/\s+/g, "");
    var tokens = [];
    if (/[;,|]/.test(compact)) {
        tokens = compact.split(/[;,|]+/);
    } else if (compact.length >= 2 && compact.length % 2 === 0) {
        for (var i = 0; i < compact.length; i += 2) tokens.push(compact.substr(i, 2));
    } else {
        tokens = [compact];
    }

    var normalized = [];
    var seen = {};
    for (var j = 0; j < tokens.length; j++) {
        var token = tokens[j];
        if (!token || token.length < 2) continue;
        var openChar = token.charAt(0);
        var closeChar = token.charAt(token.length - 1);
        var pair = openChar + closeChar;
        if (!seen[pair]) {
            normalized.push(pair);
            seen[pair] = true;
        }
    }
    if (normalized.length === 0) normalized.push("[]");
    return normalized.join(", ");
}

function normalizeBackPageTrackerSetting(value) {
    var raw = (value === null || value === undefined) ? "" : String(value);
    raw = raw.replace(/^\s+|\s+$/g, "");
    if (raw === "") raw = "©";
    return raw;
}

function getReferenceSymbolPairs(symbols) {
    var normalized = normalizeRefSymbols(symbols);
    var parts = normalized.split(/\s*,\s*/);
    var pairs = [];
    for (var i = 0; i < parts.length; i++) {
        if (!parts[i] || parts[i].length < 2) continue;
        pairs.push({ token: parts[i], open: parts[i].charAt(0), close: parts[i].charAt(parts[i].length - 1) });
    }
    if (pairs.length === 0) pairs.push({ token: "[]", open: "[", close: "]" });
    return pairs;
}

function escapeGrepLiteral(text) {
    return String(text).replace(/([\\\^\$\.\|\?\*\+\(\)\[\]\{\}\-])/g, "\\$1");
}

function buildReferenceMarkerPattern(symbols) {
    var pairs = getReferenceSymbolPairs(symbols);
    var patterns = [];
    for (var i = 0; i < pairs.length; i++) {
        patterns.push(escapeGrepLiteral(pairs[i].open) + "\\s*\\d+\\s*" + escapeGrepLiteral(pairs[i].close));
    }
    if (patterns.length === 0) return "(\\[[0-9]+\\])";
    return "(" + patterns.join("|") + ")";
}

function extractReferenceNumber(text) {
    var match = String(text || "").match(/\d+/);
    if (!match) return "";
    return String(parseInt(match[0], 10));
}

function getLocalizedLanguageName(code) {
    var upper = String(code || "").toUpperCase();
    if (upper === "DE") return UI_IS_GERMAN ? "Deutsch" : "German";
    for (var i = 0; i < LEGACY_BDA_LANGUAGE_OPTIONS.length; i++) {
        if (LEGACY_BDA_LANGUAGE_OPTIONS[i].code === upper) {
            return UI_IS_GERMAN ? LEGACY_BDA_LANGUAGE_OPTIONS[i].labelDe : LEGACY_BDA_LANGUAGE_OPTIONS[i].labelEn;
        }
    }
    return upper;
}

function buildManualLanguageList() {
    return [
        t("lang_group_favorites"),
        "EN (" + getLocalizedLanguageName("EN") + ")",
        "FR (" + getLocalizedLanguageName("FR") + ")",
        "IT (" + getLocalizedLanguageName("IT") + ")",
        "ES (" + getLocalizedLanguageName("ES") + ")",
        "CS (" + getLocalizedLanguageName("CS") + ")",
        "HU (" + getLocalizedLanguageName("HU") + ")",
        "DE (" + getLocalizedLanguageName("DE") + ")",
        t("lang_group_other_eu"),
        "BG (" + getLocalizedLanguageName("BG") + ")",
        "DA (" + getLocalizedLanguageName("DA") + ")",
        "EL (" + getLocalizedLanguageName("EL") + ")",
        "ET (" + getLocalizedLanguageName("ET") + ")",
        "FI (" + getLocalizedLanguageName("FI") + ")",
        "LT (" + getLocalizedLanguageName("LT") + ")",
        "LV (" + getLocalizedLanguageName("LV") + ")",
        "NL (" + getLocalizedLanguageName("NL") + ")",
        "PL (" + getLocalizedLanguageName("PL") + ")",
        "PT (" + getLocalizedLanguageName("PT") + ")",
        "RO (" + getLocalizedLanguageName("RO") + ")",
        "RU (" + getLocalizedLanguageName("RU") + ")",
        "SK (" + getLocalizedLanguageName("SK") + ")",
        "SL (" + getLocalizedLanguageName("SL") + ")",
        "SV (" + getLocalizedLanguageName("SV") + ")"
    ];
}

function getHyperlinkLanguageEntries() {
    var entries = [{ code: "DE", label: getLocalizedLanguageName("DE") }];
    for (var i = 0; i < LEGACY_BDA_LANGUAGE_OPTIONS.length; i++) {
        entries.push({
            code: LEGACY_BDA_LANGUAGE_OPTIONS[i].code,
            label: getLocalizedLanguageName(LEGACY_BDA_LANGUAGE_OPTIONS[i].code)
        });
    }
    return entries;
}

function buildHyperlinkLanguageList() {
    var entries = getHyperlinkLanguageEntries();
    var list = [];
    for (var i = 0; i < entries.length; i++) {
        list.push(entries[i].code + " (" + entries[i].label + ")");
    }
    return list;
}

function extractLanguageCodeFromOption(optionText) {
    var match = String(optionText || "").match(/^[A-Za-z]{2}/);
    return match ? match[0].toUpperCase() : "";
}

function normalizeHyperlinkPageMappings(rawMappings) {
    var normalized = {};
    if (!rawMappings) return normalized;
    for (var key in rawMappings) {
        if (!rawMappings.hasOwnProperty(key)) continue;
        var code = String(key || "").replace(/^\s+|\s+$/g, "").toUpperCase();
        if (!code.match(/^[A-Z]{2}$/)) continue;
        var pageValue = String(rawMappings[key] === null || rawMappings[key] === undefined ? "" : rawMappings[key]).replace(/^\s+|\s+$/g, "");
        if (pageValue === "") continue;
        normalized[code] = pageValue;
    }
    return normalized;
}

function loadHyperlinkPageMappings(rawText) {
    var content = String(rawText || "").replace(/^\s+|\s+$/g, "");
    if (content === "") return {};
    try {
        return normalizeHyperlinkPageMappings(eval("(" + content + ")"));
    } catch (e) {
        return {};
    }
}

function formatHyperlinkPageMappings(pageMappings) {
    var mappings = normalizeHyperlinkPageMappings(pageMappings);
    var entries = getHyperlinkLanguageEntries();
    var lines = [];
    var seen = {};
    for (var i = 0; i < entries.length; i++) {
        var code = entries[i].code;
        if (!mappings.hasOwnProperty(code)) continue;
        lines.push(code + " -> " + mappings[code]);
        seen[code] = true;
    }
    for (var key in mappings) {
        if (!mappings.hasOwnProperty(key) || seen[key]) continue;
        lines.push(key + " -> " + mappings[key]);
    }
    if (lines.length === 0) return t("hyperlink_no_mappings_saved");
    return lines.join("\r");
}

function hasOwnMappings(map) {
    if (!map) return false;
    for (var key in map) {
        if (map.hasOwnProperty(key)) return true;
    }
    return false;
}

function saveHyperlinkSettings(symbols, pageMappings) {
    refSymbolsSetting = normalizeRefSymbols(symbols || refSymbolsSetting);
    app.insertLabel(REF_SYMBOLS_LABEL, refSymbolsSetting);
    if (pageMappings) hyperlinkPageMappings = normalizeHyperlinkPageMappings(pageMappings);
}

function collectTOCTextEntries(page) {
    var items = [];
    if (!page || !page.isValid) return items;
    var allPageItems = [];
    try { allPageItems = page.allPageItems; } catch (e) { allPageItems = []; }
    for (var i = 0; i < allPageItems.length; i++) {
        if (!allPageItems[i] || !allPageItems[i].isValid || allPageItems[i].constructor.name !== "TextFrame") continue;
        items.push({ type: "frame", obj: allPageItems[i] });
        try {
            var tables = allPageItems[i].tables;
            for (var tIndex = 0; tIndex < tables.length; tIndex++) {
                var cells = tables[tIndex].cells;
                for (var c = 0; c < cells.length; c++) items.push({ type: "cell", obj: cells[c] });
            }
        } catch (tableErr) {}
    }
    return items;
}

function getTOCItemContents(itemEntry) {
    var textObj = getHyperlinkTextObjectFromItemEntry(itemEntry);
    if (!textObj || !textObj.isValid) return "";
    try { return String(textObj.contents); } catch (e) { return ""; }
}

function extractTOCLanguageCodeFromItem(itemEntry) {
    var rawText = getTOCItemContents(itemEntry);
    var compact = String(rawText || "").replace(/[\s\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, "").toUpperCase();
    if (!compact.match(/^[A-Z]{2}$/) || !isSupportedLegacyLanguageCode(compact)) return "";
    return compact;
}

function hasTOCPageMarkerText(text) {
    return /\([^()]*\)/.test(String(text || ""));
}

function extractTOCPageSetting(text) {
    var match = String(text || "").match(/\(([^()]*)\)/);
    if (!match) return "";
    var value = String(match[1] || "").replace(/^\s+|\s+$/g, "");
    if (value === "" || /^[Xx]+$/.test(value)) return "";
    return value;
}

function findTOCPageTargetItem(items, markerItem) {
    if (!items || !markerItem) return null;
    if (markerItem.type === "cell") {
        try {
            var rowCells = markerItem.obj.parentRow.cells;
            for (var c = 0; c < rowCells.length; c++) {
                if (rowCells[c] === markerItem.obj) continue;
                if (hasTOCPageMarkerText(getTOCItemContents({ type: "cell", obj: rowCells[c] }))) {
                    return { type: "cell", obj: rowCells[c] };
                }
            }
        } catch (e) {}
        return null;
    }

    var markerBounds = null;
    try { markerBounds = markerItem.obj.geometricBounds; } catch (boundsErr) { markerBounds = null; }
    if (!markerBounds) return null;
    var markerCenterY = (markerBounds[0] + markerBounds[2]) / 2;
    for (var i = 0; i < items.length; i++) {
        if (items[i].type !== "frame" || items[i].obj === markerItem.obj) continue;
        var frameBounds = null;
        try { frameBounds = items[i].obj.geometricBounds; } catch (e2) { frameBounds = null; }
        if (!frameBounds) continue;
        var frameCenterY = (frameBounds[0] + frameBounds[2]) / 2;
        if (Math.abs(markerCenterY - frameCenterY) >= 10) continue;
        if (hasTOCPageMarkerText(getTOCItemContents(items[i]))) return items[i];
    }
    return null;
}

function collectCoverHyperlinkPageMappings(doc) {
    var mappings = {};
    if (!doc || !doc.isValid || doc.pages.length === 0) return mappings;
    var items = collectTOCTextEntries(doc.pages[0]);
    for (var i = 0; i < items.length; i++) {
        var langCode = extractTOCLanguageCodeFromItem(items[i]);
        if (!langCode || mappings.hasOwnProperty(langCode)) continue;
        var targetItem = findTOCPageTargetItem(items, items[i]);
        if (!targetItem) continue;
        var pageSetting = extractTOCPageSetting(getTOCItemContents(targetItem));
        if (pageSetting !== "") mappings[langCode] = pageSetting;
    }
    return mappings;
}

function getHyperlinkPageMappingsForDialog(doc) {
    return collectCoverHyperlinkPageMappings(doc);
}

function getRuntimeHyperlinkPageMappings(doc, explicitMappings) {
    var liveMappings = collectCoverHyperlinkPageMappings(doc);
    if (hasOwnMappings(liveMappings)) return liveMappings;
    if (explicitMappings) return normalizeHyperlinkPageMappings(explicitMappings);
    return {};
}

function getTextObjectParentPage(textObj) {
    if (!textObj || !textObj.isValid) return null;
    try {
        var parentFrames = textObj.parentTextFrames;
        if (parentFrames && parentFrames.length > 0) {
            for (var i = 0; i < parentFrames.length; i++) {
                if (parentFrames[i] && parentFrames[i].isValid && parentFrames[i].parentPage && parentFrames[i].parentPage.isValid) {
                    return parentFrames[i].parentPage;
                }
            }
        }
    } catch (e) {}
    try {
        var story = textObj.parentStory;
        if (story && story.isValid && story.textContainers && story.textContainers.length > 0) {
            for (var j = 0; j < story.textContainers.length; j++) {
                var container = story.textContainers[j];
                if (container && container.isValid && container.parentPage && container.parentPage.isValid) {
                    return container.parentPage;
                }
            }
        }
    } catch (e2) {}
    return null;
}

function findPageLanguageBadgeCode(page) {
    if (!page || !page.isValid) return "";
    var frames = getTextFramesFromContainer(page);
    var best = null;
    for (var i = 0; i < frames.length; i++) {
        var tf = frames[i];
        var textObj = null;
        try { if (tf.texts && tf.texts.length > 0) textObj = tf.texts[0]; } catch (e) { textObj = null; }
        if (!textObj || !textObj.isValid) {
            var story = getTextFrameStory(tf);
            if (!story) continue;
            textObj = story;
        }
        var code = normalizeLanguageBadgeText(textObj.contents);
        if (code.length !== 2 || !isSupportedLegacyLanguageCode(code)) continue;
        var score = 0;
        try { if (hasBlackBadgeBackground(tf)) score += 40; } catch (e2) {}
        try {
            var bounds = tf.geometricBounds;
            var pageBounds = page.bounds;
            var frameCenterX = (bounds[1] + bounds[3]) / 2;
            var frameCenterY = (bounds[0] + bounds[2]) / 2;
            var pageCenterX = (pageBounds[1] + pageBounds[3]) / 2;
            var pageCenterY = (pageBounds[0] + pageBounds[2]) / 2;
            if (frameCenterX >= pageCenterX) score += 20;
            if (frameCenterY <= pageCenterY) score += 20;
        } catch (e3) {}
        if (!best || score > best.score) best = { code: code, score: score };
    }
    return best ? String(best.code).toUpperCase() : "";
}

function getPageLanguageCode(page) {
    if (!page || !page.isValid) return "";
    try {
        if (page.appliedMaster && page.appliedMaster.isValid) {
            var masterLang = getMasterLang(page.appliedMaster.name);
            if (masterLang) return String(masterLang).toUpperCase();
        }
    } catch (e) {}
    var pageBadgeCode = findPageLanguageBadgeCode(page);
    if (pageBadgeCode) return pageBadgeCode;
    try {
        if (page.appliedMaster && page.appliedMaster.isValid) {
            var masterBadge = findMasterLanguageBadge(page.appliedMaster, null);
            if (masterBadge && masterBadge.code) return String(masterBadge.code).toUpperCase();
        }
    } catch (e2) {}
    return "";
}

function buildFormalityOptions() {
    return [t("formality_default"), t("formality_formal"), t("formality_informal")];
}

function normalizeExistingFilePath(path) {
    if (!path || path === "") return "";
    try {
        var f = new File(path);
        if (f.exists) return f.fsName;
    } catch (e) {}
    return "";
}

function getFileModifiedTick(path) {
    if (!path || path === "") return 0;
    try {
        var f = new File(path);
        if (!f.exists) return 0;
        var modified = f.modified;
        if (modified && modified.getTime) return modified.getTime();
        return new Date(modified).getTime() || 0;
    } catch (e) {
        return 0;
    }
}

function resolveCSVPath(preferredPath) {
    var resolved = normalizeExistingFilePath(preferredPath);
    var candidates = [];
    try {
        candidates.push(Folder.desktop.fsName + "/Woerterbuch.csv");
        candidates.push(Folder.desktop.fsName + "/Wörterbuch.csv");
    } catch (e) {}

    for (var i = 0; i < candidates.length; i++) {
        var candidate = normalizeExistingFilePath(candidates[i]);
        if (!candidate) continue;
        if (!resolved) {
            resolved = candidate;
            continue;
        }
        if (getFileModifiedTick(candidate) >= getFileModifiedTick(resolved)) {
            resolved = candidate;
        }
    }

    return resolved || preferredPath || "";
}

var SCRIPT_NAME = "Super Translator Pro";
var SCRIPT_VERSION = "28.2";
var apiKey = app.extractLabel(DEEPL_KEY_LABEL);
if (!apiKey || apiKey === "") {
    apiKey = ""; // HIER WURDE DER FALLBACK-KEY ENTFERNT
}

var csvPathSettingRaw = app.extractLabel(CSV_PATH_LABEL) || "";
var csvPath = resolveCSVPath(csvPathSettingRaw);
var tmPath = app.extractLabel(TM_PATH_LABEL) || (Folder.userData + "/SuperTranslatorPRO_Memory.json"); 
var refSymbolsSetting = normalizeRefSymbols(app.extractLabel(REF_SYMBOLS_LABEL) || "[]");
var hyperlinkPageMappings = {};
var autoBDAHyperlinksSetting = (app.extractLabel(AUTO_HYPERLINKS_LABEL) === "1");
var backPageTrackerSetting = normalizeBackPageTrackerSetting(app.extractLabel(BACK_PAGE_TRACKER_LABEL) || "©");

var FORMALITY_LABEL = "SuperTranslatorPRO_Formality";
var DNT_LABEL = "SuperTranslatorPRO_DNT_Styles";
var formalitySetting = app.extractLabel(FORMALITY_LABEL) || "default";
var dntStyles = app.extractLabel(DNT_LABEL) || "";

var globalStats = { apiChars: 0, savedChars: 0, fittedFrames: 0 };
var progressWin, progressBar, progressText;
var overallBar, overallText, etaText, btnStopProgress;
var cancelFlag = false;
var startTime = 0;
var germanHighlightState = null;
var germanFocusState = { activePageKey: null, fittedPageKey: null };
var LEGACY_BDA_LANGUAGE_OPTIONS = [
    { code: "EN", labelDe: "Englisch", labelEn: "English" },
    { code: "FR", labelDe: "Französisch", labelEn: "French" },
    { code: "IT", labelDe: "Italienisch", labelEn: "Italian" },
    { code: "ES", labelDe: "Spanisch", labelEn: "Spanish" },
    { code: "CS", labelDe: "Tschechisch", labelEn: "Czech" },
    { code: "HU", labelDe: "Ungarisch", labelEn: "Hungarian" },
    { code: "BG", labelDe: "Bulgarisch", labelEn: "Bulgarian" },
    { code: "DA", labelDe: "Dänisch", labelEn: "Danish" },
    { code: "EL", labelDe: "Griechisch", labelEn: "Greek" },
    { code: "ET", labelDe: "Estnisch", labelEn: "Estonian" },
    { code: "FI", labelDe: "Finnisch", labelEn: "Finnish" },
    { code: "LT", labelDe: "Litauisch", labelEn: "Lithuanian" },
    { code: "LV", labelDe: "Lettisch", labelEn: "Latvian" },
    { code: "NL", labelDe: "Niederländisch", labelEn: "Dutch" },
    { code: "PL", labelDe: "Polnisch", labelEn: "Polish" },
    { code: "PT", labelDe: "Portugiesisch", labelEn: "Portuguese" },
    { code: "RO", labelDe: "Rumänisch", labelEn: "Romanian" },
    { code: "RU", labelDe: "Russisch", labelEn: "Russian" },
    { code: "SK", labelDe: "Slowakisch", labelEn: "Slovak" },
    { code: "SL", labelDe: "Slowenisch", labelEn: "Slovenian" },
    { code: "SV", labelDe: "Schwedisch", labelEn: "Swedish" }
];

function getSupportedGlossaryLanguageHeaders() {
    var headers = ["DE"];
    var seen = { DE: true };
    for (var i = 0; i < LEGACY_BDA_LANGUAGE_OPTIONS.length; i++) {
        var code = String(LEGACY_BDA_LANGUAGE_OPTIONS[i].code || "").toUpperCase();
        if (code === "" || seen[code]) continue;
        headers.push(code);
        seen[code] = true;
    }
    return headers;
}

function normalizeGlossaryLanguageCode(code) {
    return String(code || "").replace(/^\s+|\s+$/g, "").toUpperCase();
}

function getGlossaryLanguageShortCode(code) {
    var upper = normalizeGlossaryLanguageCode(code);
    return upper.length >= 2 ? upper.substring(0, 2) : upper;
}

function isMatchingGlossaryLanguageCode(a, b) {
    var upperA = normalizeGlossaryLanguageCode(a);
    var upperB = normalizeGlossaryLanguageCode(b);
    if (upperA === "" || upperB === "") return false;
    return upperA === upperB || getGlossaryLanguageShortCode(upperA) === getGlossaryLanguageShortCode(upperB);
}

function isSupportedGlossaryLanguageHeader(header) {
    var upper = normalizeGlossaryLanguageCode(header);
    if (upper === "DE" || upper === "EN-US" || upper === "EN-GB" || upper === "PT-PT") return true;
    for (var i = 0; i < LEGACY_BDA_LANGUAGE_OPTIONS.length; i++) {
        if (LEGACY_BDA_LANGUAGE_OPTIONS[i].code === upper) return true;
    }
    return false;
}

function isGlossaryMetaHeader(header) {
    return /^_(INFO|FLAGS|ALIASES|CATEGORY|SOURCE|NOTE|NOTES|COMMENT|COMMENTS)$/i.test(String(header || ""));
}

function isGlossaryCommentRow(value) {
    var trimmed = String(value || "").replace(/^\s+|\s+$/g, "");
    if (trimmed === "") return false;
    return trimmed.indexOf("#") === 0 || trimmed.indexOf("//") === 0;
}

function parseGlossaryFlags(value) {
    var flags = {};
    var raw = String(value || "").replace(/^\s+|\s+$/g, "");
    if (raw === "") return flags;
    var parts = raw.split(/[;,|]+/);
    for (var i = 0; i < parts.length; i++) {
        var token = String(parts[i] || "").replace(/^\s+|\s+$/g, "").toUpperCase();
        if (token !== "") flags[token] = true;
    }
    return flags;
}

function parseGlossaryAliases(value) {
    var aliases = [];
    var seen = {};
    var raw = String(value || "").replace(/^\s+|\s+$/g, "");
    if (raw === "") return aliases;
    var parts = raw.split(/[|;,]+/);
    for (var i = 0; i < parts.length; i++) {
        var alias = String(parts[i] || "").replace(/^\s+|\s+$/g, "");
        if (alias === "" || seen[alias]) continue;
        aliases.push(alias);
        seen[alias] = true;
    }
    return aliases;
}

function createGlossaryTemplateRow(headers, values) {
    var row = [];
    for (var i = 0; i < headers.length; i++) {
        row.push(values.hasOwnProperty(headers[i]) ? values[headers[i]] : "");
    }
    return row;
}

function escapeCSVField(value, separator) {
    var text = String(value === null || value === undefined ? "" : value);
    if (text.indexOf('"') !== -1) text = text.replace(/"/g, '""');
    if (text.indexOf(separator) !== -1 || text.indexOf('"') !== -1 || text.indexOf("\n") !== -1 || text.indexOf("\r") !== -1) {
        text = '"' + text + '"';
    }
    return text;
}

function buildGlossaryTemplateCSV() {
    var separator = ";";
    var headers = ["_SOURCE", "_INFO", "_FLAGS", "_ALIASES"].concat(getSupportedGlossaryLanguageHeaders());
    var rows = [];

    rows.push(headers);
    rows.push(["# Super Translator Pro Glossary Template"]);
    rows.push(["# SO WIRD DIE DATEI VERWENDET:"]);
    rows.push(["# EN / FR / IT / ES ... = gewuenschte Zieluebersetzung fuer genau diese Sprache."]);
    rows.push(["# Leere Sprachzellen bedeuten: kein Glossar-Eintrag fuer diese Sprache, DeepL darf normal uebersetzen."]);
    rows.push(["# DNT in einer Sprachzelle bedeutet: in genau dieser Sprache nicht uebersetzen, Originaltext beibehalten."]);
    rows.push(["# _FLAGS=DNT (DNT = Do Not Translate) bedeutet: in allen Sprachen nicht uebersetzen, z. B. bei technischen Codes wie M5*15."]);
    rows.push(["# _ALIASES = alternative Schreibweisen in der Quellsprache dieser Zeile, mit | trennen, z. B. Duschwanne|Duschtasse."]);
    rows.push(["# _SOURCE = Quellsprache dieser Zeile. Leer = Standard DE. Wenn die Quelle z. B. Englisch ist, hier EN eintragen."]);
    rows.push(["# _INFO = Infos & Erklaerung"]);
    rows.push(["# TIPP: Wenn mehrere Varianten derselben Quellsprache denselben Zielbegriff bekommen sollen, den Hauptbegriff in der Quellspalte pflegen und Varianten in _ALIASES eintragen."]);
    rows.push(["# TIPP: Fuer feste Produktnamen oder Artikelcodes am besten DNT oder eine feste Zieluebersetzung verwenden."]);
    rows.push([""]);

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Warnung!",
        EN: "Warning!",
        FR: "Avertissement !",
        IT: "Avvertimento!",
        ES: "Advertencia!",
        CS: "Varovani!",
        HU: "Figyelmeztetes!",
        _INFO: "Beispiel fuer UI-Hinweis"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Lieferumfang",
        EN: "Scope of delivery",
        FR: "Contenu de la livraison",
        IT: "Contenuto della fornitura",
        ES: "Alcance de la entrega",
        CS: "Rozsah dodavky",
        HU: "Szallitasi terjedelem",
        _INFO: "Produkt-/Dokumentbegriff"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Montagebox",
        EN: "Mounting box",
        _INFO: "Produktbegriff, bei Bedarf manuell fuer weitere Sprachen pflegen"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "M5*15",
        _FLAGS: "DNT",
        _INFO: "Technischer Code, in allen Sprachen unveraendert lassen"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Duschunterteil",
        EN: "Shower base",
        _ALIASES: "Duschwanne|Duschtasse",
        _INFO: "Beispiel mit Aliasen"
    }));

    rows.push(createGlossaryTemplateRow(headers, {
        DE: "Montagebox",
        EN: "Mounting box",
        _SOURCE: "EN",
        _INFO: "Beispiel: Quelle ist Englisch, Ziel kann z. B. DE sein"
    }));

    var lines = [];
    for (var r = 0; r < rows.length; r++) {
        var cols = rows[r];
        var lineParts = [];
        for (var c = 0; c < cols.length; c++) lineParts.push(escapeCSVField(cols[c], separator));
        lines.push(lineParts.join(separator));
    }
    return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

function writeGlossaryTemplateFile(path) {
    var file = new File(path);
    try {
        file.encoding = "UTF-8";
        if (!file.open("w")) return false;
        file.write(buildGlossaryTemplateCSV());
        file.close();
        return true;
    } catch (e) {
        try { if (file.opened) file.close(); } catch (closeErr) {}
        return false;
    }
}

function promptForGlossaryPath(currentPath, allowLater) {
    var dlg = new Window("dialog", t("glossary_setup_title"));
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.margins = 16;

    dlg.add("statictext", undefined, t("glossary_setup_message"), { multiline: true });
    if (currentPath && currentPath !== "") {
        dlg.add("statictext", undefined, t("glossary_setup_current_path"));
        var currentPathView = dlg.add("edittext", undefined, currentPath, { readonly: true });
        currentPathView.characters = 42;
    }

    var buttonRow = dlg.add("group");
    buttonRow.alignment = "center";
    var btnCreate = buttonRow.add("button", undefined, t("glossary_setup_create"));
    var btnChoose = buttonRow.add("button", undefined, t("glossary_setup_choose"));
    var btnLater = null;
    if (allowLater) btnLater = buttonRow.add("button", undefined, t("glossary_setup_later"));

    var resultPath = "";

    btnCreate.onClick = function() {
        var suggestedPath = currentPath && currentPath !== "" ? currentPath : "";
        var saveFile = File.saveDialog(t("glossary_create_select"), "*.csv");
        if (!saveFile) return;
        if (!writeGlossaryTemplateFile(saveFile.fsName)) {
            alert(t("glossary_template_failed", { message: saveFile.fsName }));
            return;
        }
        resultPath = saveFile.fsName;
        dlg.close(1);
    };

    btnChoose.onClick = function() {
        var existingFile = File.openDialog(t("glossary_select"), "*.csv");
        if (!existingFile) return;
        resultPath = existingFile.fsName;
        dlg.close(1);
    };

    if (btnLater) {
        btnLater.onClick = function() {
            dlg.close(0);
        };
    }

    if (dlg.show() !== 1) return "";
    return resultPath;
}

function ensureGlossaryPathConfigured(currentResolvedPath, storedPath) {
    var stored = String(storedPath || "").replace(/^\s+|\s+$/g, "");
    var resolved = resolveCSVPath(currentResolvedPath || stored);
    var hasStoredPath = stored !== "";
    var hasValidStoredFile = false;
    if (hasStoredPath) {
        try {
            var storedFile = new File(resolveCSVPath(stored) || stored);
            hasValidStoredFile = storedFile.exists;
        } catch (e) { hasValidStoredFile = false; }
    }

    if (hasStoredPath && hasValidStoredFile) return resolveCSVPath(stored) || stored;

    var chosenPath = promptForGlossaryPath(resolved, true);
    if (chosenPath && chosenPath !== "") {
        csvPathSettingRaw = chosenPath;
        app.insertLabel(CSV_PATH_LABEL, chosenPath);
        return resolveCSVPath(chosenPath) || chosenPath;
    }
    return resolved || "";
}

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
            if (!success) alert(t("memory_write_warning"));
        }
    } catch(e) {}
}

function guessCSVSeparator(content) {
    var firstRow = "";
    var inQuotes = false;
    for (var i = 0; i < content.length; i++) {
        var ch = content.charAt(i);
        if (ch === '"') {
            if (inQuotes && i + 1 < content.length && content.charAt(i + 1) === '"') {
                firstRow += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (!inQuotes && (ch === "\r" || ch === "\n")) break;
        firstRow += ch;
    }

    var commaCount = 0;
    var semicolonCount = 0;
    var tabCount = 0;
    inQuotes = false;
    for (var j = 0; j < firstRow.length; j++) {
        var rowChar = firstRow.charAt(j);
        if (rowChar === '"') {
            if (inQuotes && j + 1 < firstRow.length && firstRow.charAt(j + 1) === '"') {
                j++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (!inQuotes) {
            if (rowChar === ';') semicolonCount++;
            else if (rowChar === ',') commaCount++;
            else if (rowChar === '\t') tabCount++;
        }
    }
    if (tabCount > semicolonCount && tabCount > commaCount) return '\t';
    return semicolonCount > commaCount ? ';' : ',';
}

function parseCSVRows(content, separator) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;

    for (var i = 0; i < content.length; i++) {
        var ch = content.charAt(i);
        if (ch === '"') {
            if (inQuotes && i + 1 < content.length && content.charAt(i + 1) === '"') {
                field += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (!inQuotes && ch === separator) {
            row.push(field);
            field = "";
        } else if (!inQuotes && (ch === "\r" || ch === "\n")) {
            row.push(field);
            if (row.length > 1 || row[0] !== "") rows.push(row);
            row = [];
            field = "";
            if (ch === "\r" && i + 1 < content.length && content.charAt(i + 1) === "\n") i++;
        } else {
            field += ch;
        }
    }

    if (field !== "" || row.length > 0) {
        row.push(field);
        if (row.length > 1 || row[0] !== "") rows.push(row);
    }
    return rows;
}

function sanitizeCSVContent(content) {
    if (content === null || content === undefined) return "";
    return String(content)
        .replace(/^\uFEFF/, '')
        .replace(/\u0000/g, '');
}

function tryReadCSVContent(path, encoding) {
    var f = new File(path);
    if (!f.exists) return null;
    try {
        if (encoding && encoding !== "") f.encoding = encoding;
        f.open('r');
        var content = f.read();
        f.close();
        return sanitizeCSVContent(content);
    } catch (e) {
        try { if (f.opened) f.close(); } catch (closeErr) {}
        return null;
    }
}

function countSuspiciousCSVDecodeChars(content) {
    if (!content) return 0;
    // Typical mojibake artifacts when legacy CSVs are read with the wrong code page.
    // We keep the list intentionally small so legitimate accented text is not penalized.
    return (String(content).match(/[ƒ‡ˆŠ‹ŒŽ˜™š›žŸ]/g) || []).length;
}

function getCSVDecodeScore(content, rows) {
    if (!content || !rows || rows.length < 2) return 999999;

    var score = 0;
    var header = rows[0] || [];
    if (header.length < 2) score += 10000;

    var header0 = "";
    try { header0 = sanitizeCSVContent(header[0]).replace(/^\s+|\s+$/g, '').toUpperCase(); } catch (e) {}
    if (header0 !== "DE") score += 5000;

    var replacementChars = (String(content).match(/\uFFFD/g) || []).length;
    score += replacementChars * 100;

    var controlChars = (String(content).match(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
    score += controlChars * 10;

    var suspiciousDecodeChars = countSuspiciousCSVDecodeChars(content);
    score += suspiciousDecodeChars * 25;

    return score;
}

function loadCSVGlossary(path) {
    path = resolveCSVPath(path);
    if (!path || path === "") return null;
    var f = new File(path);
    if (!f.exists) return null;
    var glossary = {};
    try {
        var rows = null;
        var bestScore = 999999;
        var encodings = ["UTF-8", "CP1252", "Macintosh", "UTF-16", "UTF-16LE", "UTF-16BE", ""];
        for (var encIdx = 0; encIdx < encodings.length; encIdx++) {
            var candidateContent = tryReadCSVContent(path, encodings[encIdx]);
            if (!candidateContent || candidateContent === "") continue;
            var candidateSep = guessCSVSeparator(candidateContent);
            var candidateRows = parseCSVRows(candidateContent, candidateSep);
            var candidateScore = getCSVDecodeScore(candidateContent, candidateRows);
            if (candidateRows.length >= 2 && candidateRows[0] && candidateRows[0].length >= 2 && candidateScore < bestScore) {
                bestScore = candidateScore;
                rows = candidateRows;
            }
        }
        if (!rows) return null;
        if (rows.length < 2) return null;

        var headers = rows[0];
        var columnKinds = [];
        for (var h = 0; h < headers.length; h++) {
            headers[h] = sanitizeCSVContent(headers[h]).replace(/^\s+|\s+$/g, '').toUpperCase();
            if (isSupportedGlossaryLanguageHeader(headers[h])) columnKinds[h] = "lang";
            else if (isGlossaryMetaHeader(headers[h])) columnKinds[h] = "meta";
            else columnKinds[h] = "ignore";
        }

        for (var i = 1; i < rows.length; i++) {
            var cols = rows[i];
            if (!cols || cols.length === 0) continue;
            var original = sanitizeCSVContent(cols[0]).replace(/^\s+|\s+$/g, '');
            if (original === "") continue;
            if (isGlossaryCommentRow(original)) continue;

            var entry = {};
            var meta = {};
            for (var j = 1; j < cols.length; j++) {
                if (j >= headers.length) continue;
                var val = sanitizeCSVContent(cols[j]).replace(/^\s+|\s+$/g, '');
                if (val === "") continue;
                if (columnKinds[j] === "lang") entry[headers[j]] = val;
                else if (columnKinds[j] === "meta") meta[headers[j]] = val;
            }

            var hasEntryData = false;
            for (var entryKey in entry) {
                if (entry.hasOwnProperty(entryKey)) { hasEntryData = true; break; }
            }
            for (var metaKey in meta) {
                if (meta.hasOwnProperty(metaKey)) { hasEntryData = true; break; }
            }
            if (!hasEntryData) continue;

            if (meta.hasOwnProperty("_FLAGS")) entry.__flags = parseGlossaryFlags(meta._FLAGS);
            if (meta.hasOwnProperty("_ALIASES")) entry.__aliases = parseGlossaryAliases(meta._ALIASES);
            entry.__sourceLang = "DE";
            if (meta.hasOwnProperty("_SOURCE")) {
                var sourceCandidate = normalizeGlossaryLanguageCode(meta._SOURCE);
                if (isSupportedGlossaryLanguageHeader(sourceCandidate)) entry.__sourceLang = sourceCandidate;
            }
            if (hasOwnMappings(meta)) entry.__meta = meta;

            var sourceText = original;
            if (entry.__sourceLang !== "DE" && entry.hasOwnProperty(entry.__sourceLang)) {
                sourceText = String(entry[entry.__sourceLang] || "").replace(/^\s+|\s+$/g, "");
            }
            if (sourceText === "") sourceText = original;
            entry.__sourceText = sourceText;

            glossary[sourceText] = entry;

            if (entry.__aliases && entry.__aliases.length > 0) {
                for (var aliasIdx = 0; aliasIdx < entry.__aliases.length; aliasIdx++) {
                    var alias = entry.__aliases[aliasIdx];
                    if (alias && alias !== "" && !glossary.hasOwnProperty(alias)) glossary[alias] = entry;
                }
            }
        }
        return glossary;
    } catch(e) { return null; }
}

function getGlossaryOverrideForTarget(entry, targetUpper, shortTarget) {
    if (!entry) return null;
    var rawValue = null;
    var sourceLang = entry.__sourceLang ? normalizeGlossaryLanguageCode(entry.__sourceLang) : "DE";

    if ((!entry.__flags || !entry.__flags.DNT) && (isMatchingGlossaryLanguageCode(sourceLang, targetUpper) || isMatchingGlossaryLanguageCode(sourceLang, shortTarget))) {
        return null;
    }

    if (entry.hasOwnProperty(targetUpper)) rawValue = entry[targetUpper];
    else if (entry.hasOwnProperty(shortTarget)) rawValue = entry[shortTarget];
    else if (entry.__flags && entry.__flags.DNT) return "###DNT###";

    if (rawValue === null || rawValue === undefined) return null;

    var trimmed = String(rawValue).replace(/^\s+|\s+$/g, "");
    if (trimmed === "") return null;
    if (trimmed === "###DNT###" || trimmed.toUpperCase() === "DNT") return "###DNT###";
    return String(rawValue);
}

function buildGlossaryRuntime(parsedGlossary, selectedLang) {
    var runtime = { map: {}, regex: null };
    if (!parsedGlossary || !selectedLang) return runtime;

    var terms = [];
    var targetUpper = String(selectedLang).toUpperCase();
    var shortTarget = targetUpper.substring(0, 2);

    for (var key in parsedGlossary) {
        if (!parsedGlossary.hasOwnProperty(key)) continue;
        var glossaryOverride = getGlossaryOverrideForTarget(parsedGlossary[key], targetUpper, shortTarget);
        if (glossaryOverride !== null) {
            terms.push(key);
            runtime.map[key.toLowerCase()] = glossaryOverride;
        }
    }

    if (terms.length > 0) {
        terms.sort(function(a, b) { return b.length - a.length; });
        for (var termIndex = 0; termIndex < terms.length; termIndex++) {
            terms[termIndex] = terms[termIndex].replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }
        runtime.regex = new RegExp("(^|[^\\wäöüÄÖÜßéèêáàâíìîóòôúùûñ])(" + terms.join("|") + ")(?=[^\\wäöüÄÖÜßéèêáàâíìîóòôúùûñ]|$)", "gi");
    }

    return runtime;
}

function glossaryAffectsText(text, glossaryRuntime) {
    if (!text || !glossaryRuntime || !glossaryRuntime.regex) return false;
    var probe = normalizeGlossaryLookupText(text);
    if (probe === "") return false;
    glossaryRuntime.regex.lastIndex = 0;
    return glossaryRuntime.regex.test(probe);
}

function applyGlossaryRuntimeToChunk(chunk, glossaryRuntime) {
    if (!chunk || !glossaryRuntime || !glossaryRuntime.regex) return chunk;

    return chunk.replace(glossaryRuntime.regex, function(match, prefix, term, offset, string) {
        if (offset >= 7 && (string.substring(offset - 7, offset) === "###TBL_" || string.substring(offset - 7, offset) === "###IMG_")) return match;

        var lowerMatch = term.toLowerCase();
        var mappedVal = glossaryRuntime.map[lowerMatch];
        var replacement = term;
        if (mappedVal === "###DNT###") replacement = '<nt>' + term + '</nt>';
        else if (mappedVal && mappedVal !== "") replacement = '<nt>' + escapeDeepLXMLText(mappedVal) + '</nt>';
        return prefix + replacement;
    });
}

function getTechnicalTokenRegex() {
    return /\b([A-Z]+[0-9]+[A-Z0-9]*(?:[\*xX\/-][0-9]+[A-Z0-9]*)*|[0-9]+[A-Z]+[A-Z0-9]*(?:[\*xX\/-][0-9]+[A-Z0-9]*)*|[0-9]{4,})\b/g;
}

function protectChunkNonTranslatables(chunk) {
    if (!chunk || chunk === "") return chunk;

    var regexArt = getTechnicalTokenRegex();
    chunk = chunk.replace(regexArt, function(match, p1, offset, string) {
        var before = string.substring(0, offset);
        var openTags = (before.match(/<nt>/g) || []).length;
        var closeTags = (before.match(/<\/nt>/g) || []).length;
        if (openTags > closeTags) return match;

        if (offset >= 7 && (string.substring(offset - 7, offset) === "###TBL_" || string.substring(offset - 7, offset) === "###IMG_")) return match;
        return '<nt>' + match + '</nt>';
    });

    chunk = chunk.replace(/###((?:TBL|IMG)_[0-9_]+)###/g, '<nt>###$1###</nt>');
    return chunk;
}

function buildPlainTranslationXML(text, glossaryRuntime) {
    var chunk = escapeDeepLXMLText(text);
    chunk = applyGlossaryRuntimeToChunk(chunk, glossaryRuntime);
    chunk = protectChunkNonTranslatables(chunk);
    return "<root>" + chunk + "</root>";
}

function normalizeGlossaryLookupText(text) {
    if (text === null || text === undefined) return "";
    return String(text)
        .replace(/[\x00-\x1F\x7F-\x9F\u200B-\u200D\uFEFF]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/^\s+|\s+$/g, "");
}

function getExactGlossaryOverrideForText(parsedGlossary, text, selectedLang) {
    if (!parsedGlossary) return null;

    var lookup = normalizeGlossaryLookupText(text);
    if (lookup === "") return null;

    var targetUpper = String(selectedLang).toUpperCase();
    var shortTarget = targetUpper.substring(0, 2);

    if (parsedGlossary.hasOwnProperty(lookup)) {
        return getGlossaryOverrideForTarget(parsedGlossary[lookup], targetUpper, shortTarget);
    }

    var lowerLookup = lookup.toLowerCase();
    for (var key in parsedGlossary) {
        if (!parsedGlossary.hasOwnProperty(key)) continue;
        if (normalizeGlossaryLookupText(key).toLowerCase() !== lowerLookup) continue;
        return getGlossaryOverrideForTarget(parsedGlossary[key], targetUpper, shortTarget);
    }

    return null;
}

function buildStyledPlainTextXML(textObj, replacementText) {
    var fFamily = "Arial";
    var fStyle = "Regular";
    var pSize = "12";
    var pStyleNameRaw = "";
    var ldingStr = "AUTO";
    var fColor = "";
    var cStyleRaw = "";
    var pAlign = "";
    var lInd = "0";
    var fInd = "0";
    var bList = "";

    try {
        var ranges = textObj.textStyleRanges;
        if (ranges && ranges.length > 0) {
            var firstRange = ranges[0];
            try { fFamily = String(firstRange.appliedFont.fontFamily); } catch (e1) {}
            try { fStyle = String(firstRange.fontStyle); } catch (e2) {}
            try { pSize = String(firstRange.pointSize); } catch (e3) {}
            try { pStyleNameRaw = String(firstRange.appliedParagraphStyle.name); } catch (e4) {}
            try { if (firstRange.leading !== Leading.AUTO) ldingStr = String(firstRange.leading); } catch (e5) {}
            try { fColor = String(firstRange.fillColor.name); } catch (e6) {}
            try { cStyleRaw = String(firstRange.appliedCharacterStyle.name); } catch (e7) {}
            try { pAlign = String(firstRange.justification); } catch (e8) {}
            try { lInd = String(firstRange.leftIndent); } catch (e9) {}
            try { fInd = String(firstRange.firstLineIndent); } catch (e10) {}
            try { bList = String(firstRange.bulletsAndNumberingListType); } catch (e11) {}
        }
    } catch (e) {}

    var chunk = escapeDeepLXMLText(replacementText);
    return '<root><t f="' + escapeXMLAttr(fFamily) + '" s="' + escapeXMLAttr(fStyle) + '" z="' + escapeXMLAttr(pSize) + '" p="' + escapeXMLAttr(pStyleNameRaw) + '" l="' + escapeXMLAttr(ldingStr) + '" c="' + escapeXMLAttr(fColor) + '" k="' + escapeXMLAttr(cStyleRaw) + '" a="' + escapeXMLAttr(pAlign) + '" li="' + escapeXMLAttr(lInd) + '" fi="' + escapeXMLAttr(fInd) + '" b="' + escapeXMLAttr(bList) + '">' + chunk + '</t></root>';
}

function getInDesignLanguageCandidates(deepLCode) {
    var map = {
        "EN-US": ["Englisch: USA", "English: USA", "English: US"],
        "EN-GB": ["Englisch: Großbritannien", "English: UK", "English: Great Britain"],
        "EN": ["Englisch: Großbritannien", "English: UK", "English: Great Britain"],
        "FR": ["Französisch", "French"],
        "IT": ["Italienisch", "Italian"],
        "ES": ["Spanisch", "Spanish"],
        "CS": ["Tschechisch", "Czech"],
        "HU": ["Ungarisch", "Hungarian"],
        "NL": ["Niederländisch", "Dutch"],
        "PL": ["Polnisch", "Polish"],
        "PT": ["Portugiesisch", "Portuguese"],
        "PT-PT": ["Portugiesisch", "Portuguese"],
        "RO": ["Rumänisch", "Romanian"],
        "RU": ["Russisch", "Russian"],
        "SK": ["Slowakisch", "Slovak"],
        "SL": ["Slowenisch", "Slovenian"],
        "SV": ["Schwedisch", "Swedish"],
        "DA": ["Dänisch", "Danish"],
        "FI": ["Finnisch", "Finnish"],
        "EL": ["Griechisch", "Greek"],
        "BG": ["Bulgarisch", "Bulgarian"],
        "ET": ["Estnisch", "Estonian"],
        "LT": ["Litauisch", "Lithuanian"],
        "LV": ["Lettisch", "Latvian"]
    };
    return map[String(deepLCode || "").toUpperCase()] || [];
}

function getInDesignLanguageName(deepLCode) {
    var candidates = getInDesignLanguageCandidates(deepLCode);
    return candidates.length > 0 ? candidates[0] : "";
}

function normalizeLanguageLookupKey(name) {
    return String(name || "").toLowerCase().replace(/[^a-z]/g, "");
}

function resolveInDesignLanguageObject(doc, deepLCode) {
    var candidates = getInDesignLanguageCandidates(deepLCode);
    if (candidates.length === 0) return null;

    var collections = [];
    try { collections.push(doc.languagesWithVendors); } catch (e) {}
    try { collections.push(app.languagesWithVendors); } catch (e2) {}

    for (var c = 0; c < collections.length; c++) {
        var coll = collections[c];
        if (!coll) continue;
        for (var i = 0; i < candidates.length; i++) {
            try {
                var exact = coll.itemByName(candidates[i]);
                if (exact && exact.isValid) return exact;
            } catch (exactErr) {}
        }
        var wanted = {};
        for (var j = 0; j < candidates.length; j++) wanted[normalizeLanguageLookupKey(candidates[j])] = true;
        try {
            for (var k = 0; k < coll.length; k++) {
                var lang = coll[k];
                if (!lang || !lang.isValid) continue;
                var langName = "";
                try { langName = String(lang.name); } catch (nameErr) { langName = ""; }
                if (wanted[normalizeLanguageLookupKey(langName)]) return lang;
            }
        } catch (scanErr) {}
    }
    return null;
}

function getCurrentArticleVersionLabel() {
    var d = new Date();
    var year = d.getFullYear() % 100;
    var month = d.getMonth() + 1;
    var version = "v" + ("0" + year).slice(-2) + ("0" + month).slice(-2);
    return "Artikelnummer_" + version;
}

csvPath = ensureGlossaryPathConfigured(csvPath, csvPathSettingRaw);

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

// --- 1. BENUTZEROBERFLÄCHE (UI) ---
var myWindow = new Window("palette", SCRIPT_NAME + " v" + SCRIPT_VERSION);
myWindow.orientation = "column";
myWindow.alignChildren = ["fill", "top"];

// --- KOPFBEREICH (MAC LAYOUT FIX) ---
var headerGroup = myWindow.add("group");
headerGroup.orientation = "row";
headerGroup.alignChildren = ["left", "center"];

var mainTitle = headerGroup.add("statictext", undefined, t("main_title"));
mainTitle.graphics.font = ScriptUI.newFont(mainTitle.graphics.font.family, "BOLD", 16);
mainTitle.preferredSize.width = 300; 

var btnSettings = headerGroup.add("button", undefined, t("settings_button")); 
btnSettings.helpTip = t("settings_help");

// --- PANEL 1: MANUELLER MODUS ---
var panelManual = myWindow.add("panel", undefined, ""); 
panelManual.orientation = "column"; 
panelManual.alignChildren = "left";
panelManual.margins = 15;

var lblManual = panelManual.add("statictext", undefined, t("manual_mode"));
lblManual.graphics.font = ScriptUI.newFont(lblManual.graphics.font.family, "BOLD", lblManual.graphics.font.size);

var radioSelection = panelManual.add("radiobutton", undefined, t("selection_mode"));
var radioPages = panelManual.add("radiobutton", undefined, t("pages_mode"));

var editPages = panelManual.add("edittext", undefined, "");
editPages.characters = 12; 
editPages.helpTip = t("pages_help");
editPages.indent = 20;

panelManual.add("statictext", undefined, ""); 

var lblLang = panelManual.add("statictext", undefined, t("target_language_manual"));
var langList = buildManualLanguageList();
var dropdownLang = panelManual.add("dropdownlist", undefined, langList);
dropdownLang.selection = 1; 

panelManual.add("statictext", undefined, "");
var btnLinkReferences = panelManual.add("button", undefined, t("hyperlink_settings_button"));
btnLinkReferences.helpTip = t("hyperlink_settings_help");

// --- PANEL 2: AUTOMATIK MODUS ---
var panelBDA = myWindow.add("panel", undefined, ""); 
panelBDA.orientation = "column"; 
panelBDA.alignChildren = "left";
panelBDA.margins = 15;

var radioBDA = panelBDA.add("radiobutton", undefined, t("auto_mode"));
radioBDA.graphics.font = ScriptUI.newFont(radioBDA.graphics.font.family, "BOLD", radioBDA.graphics.font.size);

panelBDA.add("statictext", undefined, ""); 

var lblBDA = panelBDA.add("statictext", undefined, t("auto_settings"));
lblBDA.graphics.font = ScriptUI.newFont(lblBDA.graphics.font.family, "BOLD", lblBDA.graphics.font.size);

var grpBDASource = panelBDA.add("group");
grpBDASource.indent = 20;
grpBDASource.add("statictext", undefined, t("original_pages"));
var bdaSourceInput = grpBDASource.add("edittext", undefined, "AUTO");
bdaSourceInput.characters = 8;
bdaSourceInput.helpTip = t("auto_source_help");

var checkTOC = panelBDA.add("checkbox", undefined, t("toc_checkbox"));
checkTOC.indent = 20;
checkTOC.value = true;

var checkAutoBDAHyperlinks = panelBDA.add("checkbox", undefined, t("auto_hyperlink_checkbox"));
checkAutoBDAHyperlinks.indent = 20;
checkAutoBDAHyperlinks.value = autoBDAHyperlinksSetting;
checkAutoBDAHyperlinks.helpTip = t("auto_hyperlink_help");

var cbOnlyTextUpdate = panelBDA.add("checkbox", undefined, t("only_text_update"));
cbOnlyTextUpdate.indent = 20;
cbOnlyTextUpdate.value = false;
cbOnlyTextUpdate.enabled = false;

function updateBDAHyperlinkControls(enabled) {
    checkAutoBDAHyperlinks.enabled = !!enabled;
}

// START-ZUSTAND FESTLEGEN
radioSelection.value = true;
bdaSourceInput.enabled = false;
checkTOC.enabled = false;
cbOnlyTextUpdate.enabled = false;
updateBDAHyperlinkControls(false);

// --- UI INTERAKTIONEN ---
radioSelection.onClick = function() {
    radioPages.value = false;
    radioBDA.value = false;
    dropdownLang.enabled = true;
    bdaSourceInput.enabled = false;
    checkTOC.enabled = false;
    cbOnlyTextUpdate.enabled = false;
    cbOnlyTextUpdate.value = false;
    updateBDAHyperlinkControls(false);
}

radioPages.onClick = function() {
    radioSelection.value = false;
    radioBDA.value = false;
    dropdownLang.enabled = true;
    bdaSourceInput.enabled = false;
    checkTOC.enabled = false;
    cbOnlyTextUpdate.enabled = false;
    cbOnlyTextUpdate.value = false;
    updateBDAHyperlinkControls(false);
}

radioBDA.onClick = function() {
    radioSelection.value = false;
    radioPages.value = false;
    dropdownLang.enabled = false;
    bdaSourceInput.enabled = true;
    checkTOC.enabled = true;
    cbOnlyTextUpdate.enabled = true;
    updateBDAHyperlinkControls(true);
}

editPages.onActivate = function() {
    radioPages.value = true;
    radioSelection.value = false;
    radioBDA.value = false;
    dropdownLang.enabled = true;
    bdaSourceInput.enabled = false;
    checkTOC.enabled = false;
    cbOnlyTextUpdate.enabled = false;
    cbOnlyTextUpdate.value = false;
    updateBDAHyperlinkControls(false);
}

bdaSourceInput.onActivate = function() {
    radioBDA.value = true;
    radioSelection.value = false;
    radioPages.value = false;
    dropdownLang.enabled = false;
    bdaSourceInput.enabled = true;
    checkTOC.enabled = true;
    cbOnlyTextUpdate.enabled = true;
    updateBDAHyperlinkControls(true);
}

checkAutoBDAHyperlinks.onClick = function() {
    updateBDAHyperlinkControls(radioBDA.value);
};

// --- BUTTONS UNTEN ---
var groupButtons = myWindow.add("group"); 
groupButtons.alignment = "center";
var btnTranslate = groupButtons.add("button", undefined, t("translate_start"));
var btnSpellCheck = groupButtons.add("button", undefined, t("spellcheck_button"));
btnSpellCheck.helpTip = t("spellcheck_help");
var btnCancel = groupButtons.add("button", undefined, t("close_button"));

btnSpellCheck.onClick = function() {
    var doc = null;
    try { doc = app.activeDocument; } catch (e) { alert(t("no_document_open")); return; }
    try {
        runMasterSpellingCheck(doc);
    } catch (e) {
        alert(t("spellcheck_error", { message: e.message }));
    }
};

function showHyperlinkDialog(doc) {
    var dlg = new Window("dialog", t("hyperlink_dialog_title"));
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];

    dlg.add("statictext", undefined, t("reference_symbols"));
    var refSymbolsInput = dlg.add("edittext", undefined, refSymbolsSetting);
    refSymbolsInput.characters = 20;

    var hyperlinkMappingsDraft = getHyperlinkPageMappingsForDialog(doc);
    var hyperlinkPanel = dlg.add("panel", undefined, t("hyperlink_group_title"));
    hyperlinkPanel.orientation = "column";
    hyperlinkPanel.alignChildren = ["fill", "top"];
    hyperlinkPanel.margins = 12;

    var hyperlinkLangGroup = hyperlinkPanel.add("group");
    hyperlinkLangGroup.add("statictext", undefined, t("hyperlink_language"));
    var hyperlinkLangDropdown = hyperlinkLangGroup.add("dropdownlist", undefined, buildHyperlinkLanguageList());
    hyperlinkLangDropdown.selection = 0;

    var hyperlinkPageGroup = hyperlinkPanel.add("group");
    hyperlinkPageGroup.add("statictext", undefined, t("hyperlink_target_page"));
    var hyperlinkPageInput = hyperlinkPageGroup.add("edittext", undefined, "");
    hyperlinkPageInput.characters = 10;

    var hyperlinkButtonGroup = hyperlinkPanel.add("group");
    var btnSaveHyperlinkMapping = hyperlinkButtonGroup.add("button", undefined, t("hyperlink_save_mapping"));
    var btnRemoveHyperlinkMapping = hyperlinkButtonGroup.add("button", undefined, t("hyperlink_remove_mapping"));

    hyperlinkPanel.add("statictext", undefined, t("hyperlink_saved_mappings"));
    var hyperlinkMappingsView = hyperlinkPanel.add("edittext", undefined, "", { multiline: true, readonly: true, scrolling: true });
    hyperlinkMappingsView.preferredSize = [320, 90];

    var refreshHyperlinkMappingsView = function() {
        hyperlinkMappingsView.text = formatHyperlinkPageMappings(hyperlinkMappingsDraft);
    };

    var syncHyperlinkMappingInputs = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        hyperlinkPageInput.text = (selectedCode && hyperlinkMappingsDraft.hasOwnProperty(selectedCode)) ? hyperlinkMappingsDraft[selectedCode] : "";
    };

    hyperlinkLangDropdown.onChange = syncHyperlinkMappingInputs;

    btnSaveHyperlinkMapping.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        var pageValue = String(hyperlinkPageInput.text || "").replace(/^\s+|\s+$/g, "");
        if (!selectedCode) return;
        if (pageValue === "") {
            alert(t("hyperlink_page_required", { language: selectedCode }));
            return;
        }
        hyperlinkMappingsDraft[selectedCode] = pageValue;
        refreshHyperlinkMappingsView();
    };

    btnRemoveHyperlinkMapping.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        if (!selectedCode) return;
        if (hyperlinkMappingsDraft.hasOwnProperty(selectedCode)) delete hyperlinkMappingsDraft[selectedCode];
        syncHyperlinkMappingInputs();
        refreshHyperlinkMappingsView();
    };

    refreshHyperlinkMappingsView();
    syncHyperlinkMappingInputs();

    var buttonRow = dlg.add("group");
    buttonRow.alignment = "right";
    var btnRun = buttonRow.add("button", undefined, t("hyperlink_execute"));
    var btnClose = buttonRow.add("button", undefined, t("cancel"));

    btnRun.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        var pageValue = String(hyperlinkPageInput.text || "").replace(/^\s+|\s+$/g, "");
        if (selectedCode && pageValue !== "") {
            hyperlinkMappingsDraft[selectedCode] = pageValue;
        }
        saveHyperlinkSettings(refSymbolsInput.text, hyperlinkMappingsDraft);
        dlg.close(1);
    };

    btnClose.onClick = function() { dlg.close(0); };
    if (dlg.show() !== 1) return null;
    return {
        symbols: refSymbolsSetting,
        pageMappings: normalizeHyperlinkPageMappings(hyperlinkMappingsDraft)
    };
}

btnLinkReferences.onClick = function() {
    var doc = null;
    try { doc = app.activeDocument; } catch (e) { alert(t("no_document_open")); return; }
    var hyperlinkConfig = showHyperlinkDialog(doc);
    if (!hyperlinkConfig) return;
    try {
        app.doScript(
            function() {
                var result = linkPackageReferences(doc, hyperlinkConfig.symbols, hyperlinkConfig.pageMappings);
                alert(t("link_summary", {
                    symbols: result.symbols,
                    mappingSummary: result.mappingSummary,
                    links: result.links,
                    urlLinks: result.urlLinks,
                    skipped: result.skipped
                }));
            },
            ScriptLanguage.JAVASCRIPT,
            undefined,
            UndoModes.ENTIRE_SCRIPT,
            t("hyperlink_settings_button")
        );
    } catch (e2) {
        alert(t("link_error", { message: e2.message || e2 }));
    }
};

// --- EINSTELLUNGEN FENSTER ---
btnSettings.onClick = function() {
    var setWin = new Window("dialog", t("settings_title"));
    setWin.orientation = "column";
    setWin.alignChildren = ["fill", "top"];
    
    var topGrp = setWin.add("group");
    topGrp.alignment = "fill";
    topGrp.alignChildren = ["right", "center"];
    var btnLog = topGrp.add("button", undefined, t("log_file"));
    btnLog.preferredSize = [90, 25];
    var btnInfo = topGrp.add("button", undefined, t("info"));
    btnInfo.preferredSize = [80, 25];
    
    setWin.add("statictext", undefined, t("deepl_api_key"));
    var keyInput = setWin.add("edittext", undefined, apiKey);
    keyInput.characters = 40;
    
    setWin.add("panel", undefined, ""); 
    
    setWin.add("statictext", undefined, t("glossary_path"));
    var grpCSV = setWin.add("group");
    var csvInput = grpCSV.add("edittext", undefined, csvPath);
    csvInput.characters = 30;
    var btnBrowse = grpCSV.add("button", undefined, t("browse"));
    
    btnBrowse.onClick = function() {
        var chosenGlossaryPath = promptForGlossaryPath(csvInput.text, true);
        if (chosenGlossaryPath && chosenGlossaryPath !== "") csvInput.text = chosenGlossaryPath;
    };

    setWin.add("panel", undefined, "");
    setWin.add("statictext", undefined, t("formality"));
    var formDrop = setWin.add("dropdownlist", undefined, buildFormalityOptions());
    if (formalitySetting === "more") formDrop.selection = 1; else if (formalitySetting === "less") formDrop.selection = 2; else formDrop.selection = 0;
    
    setWin.add("statictext", undefined, t("ignored_styles"));
    var dntInput = setWin.add("edittext", undefined, dntStyles);
    dntInput.characters = 40;

    setWin.add("panel", undefined, ""); 

    setWin.add("statictext", undefined, t("memory_path"));
    var grpTM = setWin.add("group");
    var tmInput = grpTM.add("edittext", undefined, tmPath);
    tmInput.characters = 30;
    var btnBrowseTM = grpTM.add("button", undefined, t("browse"));
    
    btnBrowseTM.onClick = function() {
        var f = File.openDialog(t("memory_select"), "*.json");
        if (f) {
            tmInput.text = f.fsName;
        } else {
            var saveF = File.saveDialog(t("memory_save_new"), "*.json");
            if (saveF) tmInput.text = saveF.fsName;
        }
    };

    setWin.add("panel", undefined, "");
    var autoSettingsLabel = setWin.add("statictext", undefined, t("auto_settings"));
    autoSettingsLabel.graphics.font = ScriptUI.newFont(autoSettingsLabel.graphics.font.family, "BOLD", autoSettingsLabel.graphics.font.size);
    setWin.add("statictext", undefined, t("auto_hyperlink_symbols"));
    var autoHyperlinkSymbolsInput = setWin.add("edittext", undefined, refSymbolsSetting);
    autoHyperlinkSymbolsInput.characters = 20;
    autoHyperlinkSymbolsInput.helpTip = t("reference_symbols");
    setWin.add("statictext", undefined, t("back_page_tracker_label"));
    var backPageTrackerInput = setWin.add("edittext", undefined, backPageTrackerSetting);
    backPageTrackerInput.characters = 40;
    backPageTrackerInput.helpTip = t("back_page_tracker_help");

    var g = setWin.add("group");
    g.alignment = "fill";
    g.alignChildren = ["fill", "center"];
    g.margins.top = 15;
    
    var leftGrp = g.add("group");
    leftGrp.alignment = "left";
    var btnClearTM = leftGrp.add("button", undefined, t("clear_memory"));
    btnClearTM.preferredSize = [110, 25];
    var btnFeedbackReport = leftGrp.add("button", undefined, t("feedback_report"));
    btnFeedbackReport.preferredSize = [110, 25];
    
    var spacer = g.add("statictext", undefined, "");
    spacer.alignment = "fill";
    
    var rightGrp = g.add("group");
    rightGrp.alignment = ["fill", "center"];
    rightGrp.alignChildren = ["right", "center"];
    var btnSave = rightGrp.add("button", undefined, t("save"));
    var btnSpacer = rightGrp.add("statictext", undefined, "");
    btnSpacer.alignment = "fill";
    var btnCancelSet = rightGrp.add("button", undefined, t("cancel"));
    
    btnSave.onClick = function() {
        apiKey = keyInput.text;
        csvPath = csvInput.text;
        csvPathSettingRaw = csvPath;
        tmPath = tmInput.text;
        refSymbolsSetting = normalizeRefSymbols(autoHyperlinkSymbolsInput.text);
        backPageTrackerSetting = normalizeBackPageTrackerSetting(backPageTrackerInput.text);
        app.insertLabel(DEEPL_KEY_LABEL, apiKey); 
        app.insertLabel(CSV_PATH_LABEL, csvPath); 
        app.insertLabel(TM_PATH_LABEL, tmPath); 
        app.insertLabel(REF_SYMBOLS_LABEL, refSymbolsSetting);
        app.insertLabel(BACK_PAGE_TRACKER_LABEL, backPageTrackerSetting);
        
        var selForm = "default";
        if (formDrop.selection.index === 1) selForm = "more"; else if (formDrop.selection.index === 2) selForm = "less";
        app.insertLabel(FORMALITY_LABEL, selForm); formalitySetting = selForm;
        app.insertLabel(DNT_LABEL, dntInput.text); dntStyles = dntInput.text;
        
        alert(t("settings_saved"));
        setWin.close();
    };
    btnClearTM.onClick = function() {
        if(confirm(t("clear_memory_confirm"))) {
            var f = getTMFile();
            if (f.exists) f.remove();
            alert(t("clear_memory_done"));
        }
    }
    btnFeedbackReport.onClick = function() {
        createFeedbackReport();
    }
    btnLog.onClick = function() {
        var f = new File(logPath);
        if (f.exists) { f.execute(); } else { alert(t("no_log_file")); }
    };
    btnInfo.onClick = function() {
        alert(buildAboutText(), t("about_title"));
    };
    btnCancelSet.onClick = function() { setWin.close(); };
    setWin.show();
};

btnCancel.onClick = function() { myWindow.close(); }

function isGermanMasterName(name) {
    return !!(name && name.match(/[-_]de(?:[-_]|$)/i));
}

function normalizeLanguageBadgeText(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(/^\s+|\s+$/g, "").replace(/[\r\n\t ]+/g, "").replace(/[^A-Za-z]/g, "").toLowerCase();
}

function isSupportedLegacyLanguageCode(code) {
    if (!code) return false;
    var upper = String(code).toUpperCase();
    if (upper === "DE") return true;
    for (var i = 0; i < LEGACY_BDA_LANGUAGE_OPTIONS.length; i++) {
        if (LEGACY_BDA_LANGUAGE_OPTIONS[i].code === upper) return true;
    }
    return false;
}

function isBlackLikeSwatch(swatch) {
    if (!swatch || !swatch.isValid) return false;
    try {
        var swatchName = String(swatch.name).toLowerCase();
        if (swatchName === "black" || swatchName === "schwarz") return true;
    } catch (e) {}
    try {
        var values = swatch.colorValue;
        if (values && values.length >= 4 && Number(values[0]) <= 10 && Number(values[1]) <= 10 && Number(values[2]) <= 10 && Number(values[3]) >= 90) {
            return true;
        }
    } catch (e2) {}
    return false;
}

function hasBlackBadgeBackground(item) {
    if (!item || !item.isValid) return false;
    try {
        if (item.fillColor && isBlackLikeSwatch(item.fillColor)) return true;
    } catch (e) {}
    try {
        var parent = item.parent;
        if (parent && parent.isValid && parent.constructor && parent.constructor.name === "Group" && parent.allPageItems) {
            var siblings = parent.allPageItems;
            for (var i = 0; i < siblings.length; i++) {
                var sibling = siblings[i];
                if (!sibling || !sibling.isValid || sibling === item) continue;
                try {
                    if (sibling.fillColor && isBlackLikeSwatch(sibling.fillColor)) return true;
                } catch (e2) {}
            }
        }
    } catch (e3) {}
    return false;
}

function getTextFramesFromContainer(container) {
    var frames = [];
    if (!container) return frames;
    var items = [];
    try { items = container.allPageItems; } catch (e) { items = []; }
    for (var i = 0; i < items.length; i++) {
        if (items[i] && items[i].isValid && items[i].constructor.name === "TextFrame") frames.push(items[i]);
    }
    return frames;
}

function collectMasterLanguageBadges(masterSpread, preferredCode) {
    var matches = [];
    if (!masterSpread || !masterSpread.isValid) return matches;
    var preferred = preferredCode ? String(preferredCode).toLowerCase() : "";
    for (var p = 0; p < masterSpread.pages.length; p++) {
        var page = masterSpread.pages[p];
        var frames = getTextFramesFromContainer(page);
        for (var f = 0; f < frames.length; f++) {
            var tf = frames[f];
            var textObj = null;
            try { if (tf.texts && tf.texts.length > 0) textObj = tf.texts[0]; } catch (e2) { textObj = null; }
            if (!textObj || !textObj.isValid) {
                var story = getTextFrameStory(tf);
                if (!story) continue;
                textObj = story;
            }
            var code = normalizeLanguageBadgeText(textObj.contents);
            if (code.length !== 2 || !isSupportedLegacyLanguageCode(code)) continue;
            if (preferred !== "" && code !== preferred) continue;

            var score = 0;
            try { if (hasBlackBadgeBackground(tf)) score += 40; } catch (e3) {}
            try {
                var bounds = tf.geometricBounds;
                var pageBounds = page.bounds;
                var frameCenterX = (bounds[1] + bounds[3]) / 2;
                var frameCenterY = (bounds[0] + bounds[2]) / 2;
                var pageCenterX = (pageBounds[1] + pageBounds[3]) / 2;
                var pageCenterY = (pageBounds[0] + pageBounds[2]) / 2;
                if (frameCenterX >= pageCenterX) score += 20;
                if (frameCenterY <= pageCenterY) score += 20;
                if ((bounds[3] - bounds[1]) <= 120) score += 10;
                if ((bounds[2] - bounds[0]) <= 60) score += 10;
            } catch (e4) {}
            if (code === "de") score += 5;
            matches.push({ code: code, textObj: textObj, frame: tf, page: page, score: score });
        }
    }
    return matches;
}

function findMasterLanguageBadge(masterSpread, preferredCode) {
    var matches = collectMasterLanguageBadges(masterSpread, preferredCode);
    var best = null;
    for (var i = 0; i < matches.length; i++) {
        if (!best || matches[i].score > best.score) best = matches[i];
    }
    return best;
}

function buildLegacyMasterBaseName(langCode) {
    return String(langCode).toLowerCase() + "-Musterseite";
}

function makeAlphabeticIndex(index) {
    var n = index + 1;
    var result = "";
    while (n > 0) {
        var remainder = (n - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        n = Math.floor((n - 1) / 26);
    }
    return result;
}

function setMasterSpreadLanguageNaming(masterSpread, prefixLetter, langCode) {
    if (!masterSpread || !masterSpread.isValid) return "";
    var baseName = buildLegacyMasterBaseName(langCode);
    try {
        masterSpread.baseName = baseName;
    } catch (e) {
        try { masterSpread.properties = { baseName: baseName }; } catch (e2) {}
    }
    try {
        masterSpread.namePrefix = prefixLetter;
    } catch (e3) {
        try { masterSpread.properties = { namePrefix: prefixLetter }; } catch (e4) {}
    }
    return String(masterSpread.name);
}

function replaceMasterLanguageBadgeText(masterSpread, langCode) {
    var badges = collectMasterLanguageBadges(masterSpread, "de");
    if (badges.length === 0) badges = collectMasterLanguageBadges(masterSpread, null);
    if (badges.length === 0) return false;
    var changed = 0;
    var handledIds = {};
    for (var i = 0; i < badges.length; i++) {
        var badge = badges[i];
        if (!badge || !badge.textObj || !badge.textObj.isValid) continue;
        var textId = null;
        try { textId = badge.textObj.id; } catch (eId) { textId = null; }
        if (textId !== null && handledIds[textId]) continue;
        try {
            badge.textObj.contents = String(langCode).toLowerCase();
            changed++;
            if (textId !== null) handledIds[textId] = true;
        } catch (e) {}
    }
    return changed > 0;
}

function findGermanLegacyMasterSpread(doc) {
    for (var i = 0; i < doc.masterSpreads.length; i++) {
        if (isGermanMasterName(doc.masterSpreads[i].name)) return doc.masterSpreads[i];
    }
    for (var j = 0; j < doc.masterSpreads.length; j++) {
        var badge = findMasterLanguageBadge(doc.masterSpreads[j], "de");
        if (badge && badge.code === "de") return doc.masterSpreads[j];
    }
    return null;
}

function promptLegacyTargetLanguageSelection(preselectedCodes, doc) {
    var dlg = new Window("dialog", t("legacy_missing_title"));
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];

    var info = dlg.add("statictext", undefined, t("legacy_missing_info"), { multiline: true });
    info.preferredSize.width = 360;

    var listGroup = dlg.add("group");
    listGroup.orientation = "column";
    listGroup.alignChildren = ["left", "top"];

    var defaultMap = { en: true, fr: true, it: true, es: true, cs: true, hu: true };
    var selectedMap = {};
    if (preselectedCodes && preselectedCodes.length > 0) {
        for (var pre = 0; pre < preselectedCodes.length; pre++) {
            var preCode = String(preselectedCodes[pre] || "").toLowerCase();
            if (preCode !== "") selectedMap[preCode] = true;
        }
    } else {
        for (var fallbackCode in defaultMap) {
            if (defaultMap.hasOwnProperty(fallbackCode)) selectedMap[fallbackCode] = true;
        }
    }
    var orderMap = buildLegacyLanguageOrderMap(doc);
    var headerRow = listGroup.add("group");
    headerRow.orientation = "row";
    headerRow.alignChildren = ["left", "center"];
    var languageHeader = headerRow.add("statictext", undefined, t("legacy_language_label"));
    languageHeader.preferredSize.width = 220;
    var orderHeader = headerRow.add("statictext", undefined, t("legacy_order_label"));
    orderHeader.preferredSize.width = 90;

    var rows = [];
    for (var i = 0; i < LEGACY_BDA_LANGUAGE_OPTIONS.length; i++) {
        var opt = LEGACY_BDA_LANGUAGE_OPTIONS[i];
        var row = listGroup.add("group");
        row.orientation = "row";
        row.alignChildren = ["left", "center"];
        var cb = row.add("checkbox", undefined, opt.code + " (" + getLocalizedLanguageName(opt.code) + ")");
        cb.preferredSize.width = 220;
        cb.value = !!selectedMap[opt.code.toLowerCase()];
        var orderInput = row.add("edittext", undefined, String(orderMap[opt.code.toLowerCase()] || (i + 1)));
        orderInput.characters = 4;
        orderInput.justify = "center";
        rows.push({ code: opt.code.toLowerCase(), box: cb, orderField: orderInput });
    }

    var buttonRow = dlg.add("group");
    buttonRow.alignment = "right";
    var btnOk = buttonRow.add("button", undefined, t("legacy_create"));
    var btnCancel = buttonRow.add("button", undefined, t("cancel"));

    var action = "cancel";
    btnOk.onClick = function() { action = "ok"; dlg.close(); };
    btnCancel.onClick = function() { action = "cancel"; dlg.close(); };

    dlg.show();
    if (action !== "ok") return null;

    var entries = [];
    for (var j = 0; j < rows.length; j++) {
        var rowInfo = rows[j];
        entries.push({
            code: rowInfo.code,
            enabled: !!rowInfo.box.value,
            order: normalizeLegacyOrderValue(rowInfo.orderField.text, orderMap[rowInfo.code] || (j + 1))
        });
    }
    return buildLegacyLanguageSelectionResult(entries, orderMap);
}

function collectLegacyBDALanguageTasks(doc, preferredCodes) {
    var tasksByCode = {};
    for (var m = 0; m < doc.masterSpreads.length; m++) {
        var master = doc.masterSpreads[m];
        var code = getMasterLang(master.name);
        if (!code || code === "de" || tasksByCode[code]) continue;
        tasksByCode[code] = { code: code, deepLCode: getDeepLLangCode(code), master: master };
    }

    var orderedCodes = [];
    if (preferredCodes && preferredCodes.length > 0) {
        for (var i = 0; i < preferredCodes.length; i++) orderedCodes.push(String(preferredCodes[i]).toLowerCase());
    } else {
        for (var j = 0; j < LEGACY_BDA_LANGUAGE_OPTIONS.length; j++) orderedCodes.push(LEGACY_BDA_LANGUAGE_OPTIONS[j].code.toLowerCase());
    }

    var tasks = [];
    var seen = {};
    for (var k = 0; k < orderedCodes.length; k++) {
        var codeKey = orderedCodes[k];
        if (tasksByCode[codeKey]) {
            tasks.push(tasksByCode[codeKey]);
            seen[codeKey] = true;
        }
    }
    for (var extraCode in tasksByCode) {
        if (tasksByCode.hasOwnProperty(extraCode) && !seen[extraCode]) tasks.push(tasksByCode[extraCode]);
    }
    return tasks;
}

function collectLegacyMasterCodesInDocumentOrder(doc) {
    var codes = [];
    var seen = {};
    try {
        for (var i = 0; i < doc.masterSpreads.length; i++) {
            var code = getMasterLang(doc.masterSpreads[i].name);
            if (!code || code === "de" || seen[code] || !isSupportedLegacyLanguageCode(code)) continue;
            seen[code] = true;
            codes.push(code);
        }
    } catch (e) {}
    return codes;
}

function buildLegacyLanguageOrderMap(doc) {
    var orderMap = {};
    var nextOrder = 1;
    var existingCodes = collectLegacyMasterCodesInDocumentOrder(doc);
    for (var i = 0; i < existingCodes.length; i++) {
        orderMap[existingCodes[i]] = nextOrder++;
    }
    for (var j = 0; j < LEGACY_BDA_LANGUAGE_OPTIONS.length; j++) {
        var code = String(LEGACY_BDA_LANGUAGE_OPTIONS[j].code || "").toLowerCase();
        if (!orderMap[code]) orderMap[code] = nextOrder++;
    }
    return orderMap;
}

function normalizeLegacyOrderValue(rawValue, fallbackValue) {
    var parsed = parseInt(String(rawValue || "").replace(/^\s+|\s+$/g, ""), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
    return fallbackValue;
}

function buildLegacyLanguageSelectionResult(entries, fallbackOrderMap) {
    var sorted = [];
    for (var i = 0; i < entries.length; i++) sorted.push(entries[i]);
    sorted.sort(function(a, b) {
        if (a.order !== b.order) return a.order - b.order;
        var aFallback = fallbackOrderMap[a.code] || 9999;
        var bFallback = fallbackOrderMap[b.code] || 9999;
        if (aFallback !== bFallback) return aFallback - bFallback;
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
    });

    var selectedCodes = [];
    var orderedCodes = [];
    for (var j = 0; j < sorted.length; j++) {
        orderedCodes.push(sorted[j].code);
        if (sorted[j].enabled) selectedCodes.push(sorted[j].code);
    }
    return { entries: sorted, selectedCodes: selectedCodes, orderedCodes: orderedCodes };
}

function getMasterSpreadPrefix(masterSpread) {
    if (!masterSpread || !masterSpread.isValid) return "";
    try {
        if (masterSpread.namePrefix) return String(masterSpread.namePrefix);
    } catch (e) {}
    try {
        return getMasterPrefix(String(masterSpread.name || ""));
    } catch (e2) {}
    return "";
}

function parseAlphabeticIndex(prefixText) {
    var clean = String(prefixText || "").toUpperCase().replace(/[^A-Z]/g, "");
    if (clean === "") return -1;
    var value = 0;
    for (var i = 0; i < clean.length; i++) {
        value = (value * 26) + (clean.charCodeAt(i) - 64);
    }
    return value - 1;
}

function getLegacyMasterCreationState(germanMaster, langTasks) {
    var spreads = [germanMaster];
    for (var i = 0; i < langTasks.length; i++) {
        if (langTasks[i] && langTasks[i].master) spreads.push(langTasks[i].master);
    }

    var anchor = germanMaster;
    var maxIndex = parseAlphabeticIndex(getMasterSpreadPrefix(germanMaster));
    if (maxIndex < 0) maxIndex = 1;

    for (var j = 0; j < spreads.length; j++) {
        var spread = spreads[j];
        if (!spread || !spread.isValid) continue;
        var prefixIndex = parseAlphabeticIndex(getMasterSpreadPrefix(spread));
        if (prefixIndex > maxIndex) {
            maxIndex = prefixIndex;
            anchor = spread;
        }
    }

    return { anchor: anchor, nextPrefixIndex: maxIndex + 1 };
}

function reorderLegacyTargetMasters(doc, germanMaster, orderedCodes) {
    if (!doc || !doc.isValid || !germanMaster || !germanMaster.isValid) return;

    var mastersByCode = {};
    for (var i = 0; i < doc.masterSpreads.length; i++) {
        var master = doc.masterSpreads[i];
        var code = getMasterLang(master.name);
        if (!code || code === "de" || mastersByCode[code]) continue;
        mastersByCode[code] = master;
    }

    var anchor = germanMaster;
    for (var j = 0; j < orderedCodes.length; j++) {
        var orderCode = String(orderedCodes[j] || "").toLowerCase();
        if (orderCode === "" || orderCode === "de") continue;
        var targetMaster = mastersByCode[orderCode];
        if (!targetMaster || !targetMaster.isValid) continue;
        try { targetMaster.move(LocationOptions.AFTER, anchor); } catch (moveErr) {}
        anchor = targetMaster;
    }
}

function createLegacyTargetMasters(doc, germanMaster, selectedCodes, anchorMaster, startPrefixIndex) {
    var created = [];
    var anchor = (anchorMaster && anchorMaster.isValid) ? anchorMaster : germanMaster;
    var prefixIndex = (startPrefixIndex !== undefined && startPrefixIndex !== null) ? startPrefixIndex : 2;
    for (var i = 0; i < selectedCodes.length; i++) {
        var code = String(selectedCodes[i]).toLowerCase();
        if (code === "de") continue;

        var duplicated = null;
        try { duplicated = germanMaster.duplicate(LocationOptions.AFTER, anchor); } catch (dupErr) { duplicated = null; }
        if (!duplicated || !duplicated.isValid) {
            try { duplicated = germanMaster.duplicate(); } catch (dupErr2) { duplicated = null; }
        }
        if (!duplicated || !duplicated.isValid) throw new Error((UI_IS_GERMAN ? "Musterseite für " : "Master page for ") + code.toUpperCase() + (UI_IS_GERMAN ? " konnte nicht dupliziert werden." : " could not be duplicated."));

        try { duplicated.move(LocationOptions.AFTER, anchor); } catch (moveErr) {}
        setMasterSpreadLanguageNaming(duplicated, makeAlphabeticIndex(prefixIndex), code);
        if (!replaceMasterLanguageBadgeText(duplicated, code)) {
            try { if (duplicated.isValid) duplicated.remove(); } catch (cleanupErr) {}
            throw new Error((UI_IS_GERMAN ? "Sprachkästchen auf der neuen Musterseite für " : "Language badge on the new master page for ") + code.toUpperCase() + (UI_IS_GERMAN ? " konnte nicht aktualisiert werden." : " could not be updated."));
        }
        created.push(duplicated);
        anchor = duplicated;
        prefixIndex++;
    }
    return created;
}

function prepareLegacyMasterSpreads(doc, allowCreation) {
    updateProgress(4, t("bda_check_masters"), 4, t("bda_analyze_doc"));

    var germanMaster = findGermanLegacyMasterSpread(doc);
    if (!germanMaster) {
        throw new Error(t("legacy_no_german_master"));
    }

    setMasterSpreadLanguageNaming(germanMaster, "B", "de");
    replaceMasterLanguageBadgeText(germanMaster, "de");

    var langTasks = collectLegacyBDALanguageTasks(doc);
    if (allowCreation) {
        var detectedCodes = [];
        var detectedMap = {};
        for (var i = 0; i < langTasks.length; i++) {
            var detectedCode = String(langTasks[i].code || "").toLowerCase();
            if (detectedCode !== "" && !detectedMap[detectedCode]) {
                detectedMap[detectedCode] = true;
                detectedCodes.push(detectedCode);
            }
        }

        var selection = promptLegacyTargetLanguageSelection(detectedCodes, doc);
        if (selection === null) throw new Error(t("legacy_creation_cancelled"));
        if (!selection.selectedCodes || selection.selectedCodes.length === 0) throw new Error(t("legacy_no_languages_selected"));

        var missingCodes = [];
        for (var j = 0; j < selection.selectedCodes.length; j++) {
            var selectedCode = String(selection.selectedCodes[j] || "").toLowerCase();
            if (selectedCode !== "" && !detectedMap[selectedCode]) missingCodes.push(selectedCode);
        }

        if (missingCodes.length > 0) {
            updateProgress(7, t("bda_create_missing"), 7, t("bda_create_legacy"));
            var creationState = getLegacyMasterCreationState(germanMaster, langTasks);
            createLegacyTargetMasters(doc, germanMaster, missingCodes, creationState.anchor, creationState.nextPrefixIndex);
        }
        reorderLegacyTargetMasters(doc, germanMaster, selection.orderedCodes || []);
        langTasks = collectLegacyBDALanguageTasks(doc, selection.selectedCodes);
    }

    return { germanMaster: germanMaster, langTasks: langTasks };
}

function shouldCheckGermanText(text) {
    if (text === null || text === undefined) return false;
    var normalized = String(text).replace(/[\r\n\t]/g, " ").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
    if (normalized.length < 3) return false;
    if (normalized.match(/^#+(?:TBL|IMG)_\d+#+$/)) return false;
    var lettersOnly = normalized.replace(/[^A-Za-zÄÖÜäöüß]/g, "");
    return lettersOnly.length >= 3;
}

function addGermanSpellTarget(targets, textObj, story, locationLabel, page, frame) {
    if (!textObj || !textObj.isValid) return;
    if (!story || !story.isValid) return;
    var storyText = "";
    try { storyText = textObj.contents; } catch (e) { storyText = ""; }
    if (!shouldCheckGermanText(storyText)) return;

    targets.push({ textObj: textObj, story: story, text: storyText, location: locationLabel, page: page || null, frame: frame || null });
}

function collectGermanSpellTargets(doc) {
    var targets = [];

    for (var pageIndex = 0; pageIndex < doc.pages.length; pageIndex++) {
        var page = doc.pages[pageIndex];
        if (!page.appliedMaster || !page.appliedMaster.isValid) continue;
        if (!isGermanMasterName(page.appliedMaster.name)) continue;

        var pageItems = [];
        try { pageItems = page.allPageItems; } catch (e) { pageItems = []; }
        for (var pf = 0; pf < pageItems.length; pf++) {
            if (!pageItems[pf] || !pageItems[pf].isValid) continue;
            if (pageItems[pf].constructor.name !== "TextFrame") continue;
            var pageStory = getTextFrameStory(pageItems[pf]);
            var textObj = null;
            try { if (pageItems[pf].texts && pageItems[pf].texts.length > 0) textObj = pageItems[pf].texts[0]; } catch (e2) { textObj = null; }
            addGermanSpellTarget(targets, textObj, pageStory, "Dokumentseite " + (page.name || (pageIndex + 1)) + " / Musterseite " + page.appliedMaster.name, page, pageItems[pf]);
        }
    }

    return targets;
}

function getGermanSpellLanguage(doc) {
    var exactNames = [
        "Deutsch",
        "Deutsch: Rechtschreibreform 2006",
        "German",
        "German: 2006 Reform"
    ];
    var collections = [];
    try { collections.push(doc.languagesWithVendors); } catch (e) {}
    try { collections.push(app.languagesWithVendors); } catch (e2) {}

    for (var c = 0; c < collections.length; c++) {
        var coll = collections[c];
        if (!coll) continue;
        for (var i = 0; i < exactNames.length; i++) {
            try {
                var candidate = coll.itemByName(exactNames[i]);
                if (candidate && candidate.isValid) return candidate;
            } catch (e3) {}
        }
        try {
            for (var j = 0; j < coll.length; j++) {
                var lang = coll[j];
                if (!lang || !lang.isValid) continue;
                var langName = "";
                try { langName = String(lang.name); } catch (e4) { langName = ""; }
                if (langName.match(/deutsch|german/i)) return lang;
            }
        } catch (e5) {}
    }
    return null;
}

function applyGermanLanguageToTextTarget(item, germanLanguage) {
    if (!item || !item.textObj || !item.textObj.isValid || !germanLanguage || !germanLanguage.isValid) return false;
    try {
        item.textObj.appliedLanguage = germanLanguage;
        try { item.textObj.textStyleRanges.everyItem().appliedLanguage = germanLanguage; } catch (e1) {}
        return true;
    } catch (e) {
        try {
            item.textObj.texts[0].appliedLanguage = germanLanguage;
            try { item.textObj.textStyleRanges.everyItem().appliedLanguage = germanLanguage; } catch (e2) {}
            return true;
        } catch (e3) {
            return false;
        }
    }
}

function getTextObjectStoryRange(textObj) {
    if (!textObj || !textObj.isValid) return null;
    try {
        var startIndex = textObj.insertionPoints[0].index;
        var endIndex = textObj.insertionPoints[textObj.insertionPoints.length - 1].index;
        return { start: startIndex, end: endIndex };
    } catch (e) {
        return null;
    }
}

function buildSpellingFindingsForTarget(item, errors) {
    var findings = [];
    if (!item || !item.textObj || !item.textObj.isValid || !errors || errors.length === 0) return findings;
    var textRange = getTextObjectStoryRange(item.textObj);
    if (!textRange) return findings;

    for (var i = 0; i < errors.length; i++) {
        try {
            var errorText = errors[i];
            if (!errorText || !errorText.isValid) continue;
            var errStart = errorText.insertionPoints[0].index;
            if (errStart < textRange.start || errStart >= textRange.end) continue;
            var finding = buildInDesignSpellingFinding(item, errorText);
            if (!finding.issueText || finding.issueText === "") continue;
            findings.push(finding);
        } catch (e) {}
    }
    return findings;
}

function buildInDesignSpellingFinding(item, errorText) {
    var originalText = "";
    var issueText = "";
    var offset = 0;
    var length = 0;

    try { originalText = String(item.story.contents); } catch (e) { originalText = ""; }
    try { issueText = String(errorText.contents); } catch (e2) { issueText = ""; }
    try { offset = errorText.insertionPoints[0].index; } catch (e3) { offset = 0; }
    length = issueText.length;

    return {
        textObj: item.textObj,
        story: item.story,
        errorText: errorText,
        page: item.page,
        frame: item.frame,
        location: item.location,
        originalText: originalText,
        issueText: issueText,
        replacement: issueText,
        message: "InDesign-Rechtschreibprüfung",
        offset: offset,
        length: length
    };
}

function runLanguageToolGermanFrameCheck(text) {
    var endpoint = "https://api.languagetool.org/v2/check";
    var requestId = new Date().getTime() + "_" + Math.floor(Math.random() * 100000);
    var payloadFile = new File(Folder.temp + "/lt_payload_" + requestId + ".txt");
    var outFile = new File(Folder.temp + "/lt_out_" + requestId + ".json");
    var payload = "language=de-DE&motherTongue=de&level=picky&text=" + encodeURIComponent(String(text).replace(/\r/g, "\n"));

    payloadFile.encoding = "UTF-8";
    if (!payloadFile.open("w")) {
        return { ok: false, error: t("languagetool_temp_file_error") };
    }
    payloadFile.write(payload);
    payloadFile.close();

    var resultStr = "";
    try {
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -d @'" + payloadFile.fsName + "'";
            resultStr = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -d @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultStr = outFile.read();
                outFile.close();
            }
        }
    } catch (e) {
        return { ok: false, error: e.message || t("languagetool_call_failed") };
    } finally {
        try { if (payloadFile.exists) payloadFile.remove(); } catch (e2) {}
        try { if (outFile.exists) outFile.remove(); } catch (e3) {}
    }

    if (!resultStr || resultStr === "") {
        return { ok: false, error: t("languagetool_no_response") };
    }

    try {
        return { ok: true, data: eval("(" + resultStr + ")") };
    } catch (e4) {
        return { ok: false, error: t("languagetool_parse_error") };
    }
}

function buildLanguageToolCorrectedText(originalText, matches) {
    var edits = buildLanguageToolEdits(originalText, matches);
    if (edits.length === 0) return originalText;
    var corrected = String(originalText);
    for (var e = edits.length - 1; e >= 0; e--) {
        var edit = edits[e];
        corrected = corrected.substring(0, edit.offset) + edit.replacement + corrected.substring(edit.offset + edit.length);
    }
    return corrected;
}

function buildGermanContextParts(originalText, offset, length) {
    var start = Math.max(0, offset - 45);
    var end = Math.min(originalText.length, offset + length + 45);
    return {
        before: makeGermanTextVisible(originalText.substring(start, offset)),
        issue: makeGermanTextVisible(originalText.substring(offset, offset + length)),
        after: makeGermanTextVisible(originalText.substring(offset + length, end))
    };
}

function buildLanguageToolEdits(originalText, matches) {
    var rawEdits = [];
    if (!matches || matches.length === 0) return rawEdits;

    for (var i = 0; i < matches.length; i++) {
        var matchObj = matches[i];
        if (!matchObj || !matchObj.replacements || matchObj.replacements.length === 0) continue;
        if (matchObj.offset === undefined || matchObj.length === undefined) continue;

        var issueText = originalText.substring(matchObj.offset, matchObj.offset + matchObj.length);
        rawEdits.push({
            offset: matchObj.offset,
            length: matchObj.length,
            replacement: matchObj.replacements[0].value,
            issueText: issueText,
            message: matchObj.message || t("languagetool_hint"),
            contextParts: buildGermanContextParts(originalText, matchObj.offset, matchObj.length)
        });
    }

    rawEdits.sort(function(a, b) { return a.offset - b.offset; });
    var filteredEdits = [];
    var lastEnd = -1;
    for (var r = 0; r < rawEdits.length; r++) {
        var edit = rawEdits[r];
        if (edit.offset < lastEnd) continue;
        filteredEdits.push(edit);
        lastEnd = edit.offset + edit.length;
    }

    return filteredEdits;
}

function buildGermanFrameCorrection(item, matches) {
    var originalText = item.text || "";
    var edits = buildLanguageToolEdits(originalText, matches);
    if (edits.length === 0) return null;

    return {
        textObj: item.textObj,
        story: item.story,
        page: item.page,
        frame: item.frame,
        location: item.location,
        originalText: originalText,
        message: t("languagetool_correction"),
        issueCount: edits.length,
        edits: edits
    };
}

function refreshGermanFrameCorrection(correction) {
    if (!correction || !correction.textObj || !correction.textObj.isValid) return null;
    var currentText = "";
    try { currentText = String(correction.textObj.contents); } catch (e) { currentText = ""; }
    if (currentText === "") return null;

    try {
        var response = runLanguageToolGermanFrameCheck(currentText);
        if (!response.ok || !response.data) return null;
        return buildGermanFrameCorrection({
            textObj: correction.textObj,
            story: correction.story,
            page: correction.page,
            frame: correction.frame,
            location: correction.location,
            text: currentText
        }, response.data.matches || []);
    } catch (e) {
        return null;
    }
}

function getGermanHighlightSwatch(doc) {
    if (!doc) return null;
    try {
        var existing = doc.colors.itemByName("STP_Temp_Magenta");
        if (existing && existing.isValid) return existing;
    } catch (e) {}
    try {
        return doc.colors.add({
            name: "STP_Temp_Magenta",
            model: ColorModel.PROCESS,
            space: ColorSpace.CMYK,
            colorValue: [0, 100, 0, 0]
        });
    } catch (e2) {
        try {
            var fallback = doc.swatches.itemByName("Magenta");
            if (fallback && fallback.isValid) return fallback;
        } catch (e3) {}
    }
    return null;
}

function clearGermanIssueHighlight() {
    if (!germanHighlightState || !germanHighlightState.story || !germanHighlightState.story.isValid) {
        germanHighlightState = null;
        return;
    }
    try {
        for (var i = 0; i < germanHighlightState.entries.length; i++) {
            var entry = germanHighlightState.entries[i];
            try {
                var ch = germanHighlightState.story.characters.item(entry.index);
                if (ch && ch.isValid) ch.fillColor = entry.fillColor;
            } catch (e) {}
        }
    } catch (e2) {}
    germanHighlightState = null;
}

function getGermanEditTextRange(correction, edit) {
    if (!correction || !edit || !correction.textObj || !correction.textObj.isValid || !correction.story || !correction.story.isValid) return null;
    var textRange = getTextObjectStoryRange(correction.textObj);
    if (!textRange) return null;
    var startIndex = textRange.start + edit.offset;
    if (startIndex < textRange.start) startIndex = textRange.start;
    var endIndex = startIndex + Math.max(1, edit.length) - 1;
    if (endIndex >= textRange.end) endIndex = textRange.end - 1;
    try {
        return correction.story.characters.itemByRange(startIndex, endIndex);
    } catch (e) {
        return null;
    }
}

function getGermanTargetPage(finding) {
    if (!finding) return null;
    var targetPage = finding.page;
    if ((!targetPage || !targetPage.isValid) && finding.frame) {
        try { targetPage = finding.frame.parentPage; } catch (e) { targetPage = null; }
    }
    return targetPage;
}

function getGermanPageKey(page) {
    if (!page || !page.isValid) return "";
    try {
        if (page.id !== undefined && page.id !== null) return String(page.id);
    } catch (e) {}
    try {
        return String(page.documentOffset) + ":" + String(page.name);
    } catch (e2) {}
    return "";
}

function activateGermanPage(targetPage) {
    var win = getGermanLayoutWindow();
    if (!win || !targetPage || !targetPage.isValid) return false;

    var targetKey = getGermanPageKey(targetPage);
    var currentKey = "";
    try { currentKey = getGermanPageKey(win.activePage); } catch (e) { currentKey = ""; }
    if (targetKey !== "" && currentKey === targetKey) {
        germanFocusState.activePageKey = targetKey;
        return false;
    }

    try { win.activeSpread = targetPage.parent; } catch (e1) {}
    try { win.activePage = targetPage; } catch (e2) {}
    germanFocusState.activePageKey = targetKey;
    return true;
}

function highlightGermanIssue(correction, edit) {
    clearGermanIssueHighlight();
    if (!correction || !edit || !correction.story || !correction.story.isValid) return;
    var targetPage = getGermanTargetPage(correction);
    var pageChanged = activateGermanPage(targetPage);
    var targetKey = getGermanPageKey(targetPage);
    var needsFit = pageChanged || (targetKey !== "" && germanFocusState.fittedPageKey !== targetKey);

    var range = getGermanEditTextRange(correction, edit);
    if (!range || !range.isValid) return;

    try {
        var doc = app.activeDocument;
        var magenta = getGermanHighlightSwatch(doc);
        if (!magenta || !magenta.isValid) {
            app.select(range);
            return;
        }

        var textRange = getTextObjectStoryRange(correction.textObj);
        if (!textRange) return;
        var startIndex = textRange.start + edit.offset;
        var endIndex = startIndex + Math.max(1, edit.length) - 1;
        if (endIndex >= textRange.end) endIndex = textRange.end - 1;

        var entries = [];
        for (var idx = startIndex; idx <= endIndex; idx++) {
            try {
                var ch = correction.story.characters.item(idx);
                if (!ch || !ch.isValid) continue;
                entries.push({ index: idx, fillColor: ch.fillColor });
                ch.fillColor = magenta;
            } catch (e2) {}
        }
        germanHighlightState = { story: correction.story, entries: entries };
        app.select(range);
        if (needsFit) {
            try { $.sleep(25); } catch (e4) {}
            fitGermanPageInWindow(targetPage, true);
        }
    } catch (e3) {}
}

function applyGermanSingleEdit(correction, editIndex) {
    if (!correction || !correction.edits || editIndex < 0 || editIndex >= correction.edits.length) return false;
    var edit = correction.edits[editIndex];
    var range = getGermanEditTextRange(correction, edit);
    if (!range || !range.isValid) return false;
    clearGermanIssueHighlight();
    try {
        range.contents = edit.replacement;
        return true;
    } catch (e) {
        return false;
    }
}

function openGermanFrameCorrectionDialog(corrections) {
    if (!corrections || corrections.length === 0) return { replaced: 0, skipped: 0, stopped: false };

    var replacedCount = 0;
    var skippedCount = 0;
    var stopped = false;
    germanFocusState = { activePageKey: null, fittedPageKey: null };

    for (var i = 0; i < corrections.length; i++) {
        var correction = corrections[i];
        while (correction && correction.edits && correction.edits.length > 0) {
            if (!correction.textObj || !correction.textObj.isValid) {
                skippedCount++;
                break;
            }

            var dlg = new Window("dialog", t("german_frame_dialog_title", { current: (i + 1), total: corrections.length }));
            dlg.orientation = "column";
            dlg.alignChildren = "fill";

            dlg.add("statictext", undefined, correction.location);
            var summaryText = dlg.add("statictext", undefined, t("german_frame_hint_count", { count: correction.issueCount }));
            summaryText.preferredSize.width = 440;

            dlg.add("statictext", undefined, t("german_findings"));
            var issueList = dlg.add("listbox", undefined, [], { multiselect: false });
            issueList.preferredSize = [440, 120];
            for (var issueIndex = 0; issueIndex < correction.edits.length; issueIndex++) {
                var issue = correction.edits[issueIndex];
                issueList.add("item", (issueIndex + 1) + ". " + makeGermanTextVisible(issue.issueText) + " -> " + makeGermanTextVisible(issue.replacement));
            }

            var detailPanel = dlg.add("panel", undefined, t("german_current_hit"));
            detailPanel.orientation = "column";
            detailPanel.alignChildren = "fill";

            detailPanel.add("statictext", undefined, t("german_hint"));
            var messageBox = detailPanel.add("edittext", undefined, "", { multiline: true, readonly: true });
            messageBox.preferredSize = [440, 70];

            var selectedEditIndex = 0;
            function updateIssuePreview() {
                if (!issueList.selection) return;
                selectedEditIndex = issueList.selection.index;
                var selectedIssue = correction.edits[selectedEditIndex];
                messageBox.text = "Fehler: " + makeGermanTextVisible(selectedIssue.issueText) + "\nVorschlag: " + makeGermanTextVisible(selectedIssue.replacement) + "\nHinweis: " + selectedIssue.message;
                highlightGermanIssue(correction, selectedIssue);
            }
            if (issueList.items.length > 0) {
                issueList.selection = 0;
                updateIssuePreview();
            }
            issueList.onChange = updateIssuePreview;

            var btnGroup = dlg.add("group");
            btnGroup.alignment = "right";
            var btnSkip = btnGroup.add("button", undefined, t("german_keep"));
            var btnReplace = btnGroup.add("button", undefined, t("german_apply"));
            var btnStop = btnGroup.add("button", undefined, t("german_finish"));

            var action = "skip";
            btnSkip.onClick = function() {
                action = "skip";
                clearGermanIssueHighlight();
                dlg.close();
            };
            btnReplace.onClick = function() {
                action = "replace";
                clearGermanIssueHighlight();
                dlg.close();
            };
            btnStop.onClick = function() {
                action = "stop";
                clearGermanIssueHighlight();
                dlg.close();
            };
            dlg.onClose = function() {
                clearGermanIssueHighlight();
                return true;
            };

            dlg.show();

            if (action === "stop") {
                stopped = true;
                break;
            }
            if (action === "skip") {
                correction.edits.splice(selectedEditIndex, 1);
                correction.issueCount = correction.edits.length;
                skippedCount++;
                continue;
            }

            if (applyGermanSingleEdit(correction, selectedEditIndex)) {
                replacedCount++;
                correction = refreshGermanFrameCorrection(correction);
            } else {
                alert(t("german_replace_failed", { location: correction.location }));
                skippedCount++;
                correction.edits.splice(selectedEditIndex, 1);
                correction.issueCount = correction.edits.length;
            }
        }
        if (stopped) break;
    }

    clearGermanIssueHighlight();
    germanFocusState = { activePageKey: null, fittedPageKey: null };
    return { replaced: replacedCount, skipped: skippedCount, stopped: stopped };
}

function makeGermanTextVisible(text) {
    if (text === null || text === undefined) return "";
    return String(text).replace(/ /g, "·").replace(/\t/g, "→").replace(/\r/g, "¶").replace(/\n/g, "¶");
}

function buildLanguageToolFindingSummary(finding) {
    return finding.location + ': "' + makeGermanTextVisible(finding.issueText) + '" -> ' + makeGermanTextVisible(finding.replacement) + " (" + finding.message + ")";
}

function refreshGermanFinding(finding) {
    if (!finding || !finding.story || !finding.story.isValid) return;
    var currentText = "";
    try { currentText = String(finding.story.contents); } catch (e) { currentText = ""; }
    finding.originalText = currentText;
    if (finding.errorText && finding.errorText.isValid) {
        try { finding.issueText = String(finding.errorText.contents); } catch (e2) {}
        try { finding.offset = finding.errorText.insertionPoints[0].index; } catch (e3) {}
        finding.length = finding.issueText ? finding.issueText.length : 0;
    }
}

function buildGermanFindingContext(finding) {
    refreshGermanFinding(finding);
    var start = Math.max(0, finding.offset - 50);
    var end = Math.min(finding.originalText.length, finding.offset + finding.length + 50);
    return finding.originalText.substring(start, end);
}

function getGermanLayoutWindow() {
    try {
        if (app.activeWindow && app.activeWindow.activePage !== undefined) return app.activeWindow;
    } catch (e) {}
    try {
        if (app.layoutWindows && app.layoutWindows.length > 0) return app.layoutWindows[0];
    } catch (e2) {}
    return null;
}

function fitGermanPageInWindow(targetPage, forceFit) {
    var win = getGermanLayoutWindow();
    if (!win) return;
    var targetKey = getGermanPageKey(targetPage);
    if (!forceFit && targetKey !== "" && germanFocusState.fittedPageKey === targetKey) return;

    try {
        if (targetPage && targetPage.isValid) {
            try { win.activeSpread = targetPage.parent; } catch (e1) {}
            try { win.activePage = targetPage; } catch (e2) {}
        }
        try { $.sleep(forceFit ? 25 : 15); } catch (e3) {}
        try {
            win.zoom(ZoomOptions.FIT_PAGE);
            germanFocusState.fittedPageKey = targetKey;
            return;
        } catch (e4) {}
        try {
            win.zoom(ZoomOptions.fitPage);
            germanFocusState.fittedPageKey = targetKey;
            return;
        } catch (e5) {}
    } catch (e6) {}
}

function focusGermanFinding(finding) {
    if (!finding) return;
    var targetPage = getGermanTargetPage(finding);
    var pageChanged = activateGermanPage(targetPage);
    var targetKey = getGermanPageKey(targetPage);
    var needsFit = pageChanged || (targetKey !== "" && germanFocusState.fittedPageKey !== targetKey);

    try {
        if (finding.errorText && finding.errorText.isValid) {
            app.select(finding.errorText);
            if (needsFit) {
                try { $.sleep(25); } catch (e3a) {}
                fitGermanPageInWindow(targetPage, true);
            }
            return;
        }
    } catch (e3) {}

    try {
        if (finding.frame && finding.frame.isValid) app.select(finding.frame);
    } catch (e4) {}
    if (needsFit) {
        try { $.sleep(25); } catch (e5) {}
        fitGermanPageInWindow(targetPage, true);
    }
}

function replaceGermanFinding(finding, replacementText) {
    if (!finding || !finding.story || !finding.story.isValid) return false;

    try {
        if (!finding.errorText || !finding.errorText.isValid) return false;
        finding.errorText.contents = replacementText;
        finding.replacement = replacementText;
        refreshGermanFinding(finding);
        return true;
    } catch (e) {
        return false;
    }
}

function openGermanCorrectionDialog(findings) {
    if (!findings || findings.length === 0) return { replaced: 0, skipped: 0, stopped: false };

    var replacedCount = 0;
    var skippedCount = 0;
    var stopped = false;

    for (var i = 0; i < findings.length; i++) {
        var finding = findings[i];
        if (!finding.story || !finding.story.isValid) {
            skippedCount++;
            continue;
        }
        focusGermanFinding(finding);
        refreshGermanFinding(finding);

        var dlg = new Window("dialog", t("german_dialog_title", { current: (i + 1), total: findings.length }));
        dlg.orientation = "column";
        dlg.alignChildren = "fill";

        dlg.add("statictext", undefined, finding.location);
        var msgText = dlg.add("statictext", undefined, finding.message);
        msgText.preferredSize.width = 420;
        var matchText = dlg.add("statictext", undefined, t("german_match", { text: makeGermanTextVisible(finding.issueText) }));
        matchText.preferredSize.width = 420;

        dlg.add("statictext", undefined, t("german_context"));
        var ctxInput = dlg.add("edittext", undefined, buildGermanFindingContext(finding), { multiline: true, readonly: true });
        ctxInput.preferredSize = [420, 90];

        dlg.add("statictext", undefined, t("german_find_label"));
        var findInput = dlg.add("edittext", undefined, finding.issueText);
        findInput.preferredSize.width = 420;

        dlg.add("statictext", undefined, t("german_replace_label"));
        var replaceInput = dlg.add("edittext", undefined, finding.replacement);
        replaceInput.preferredSize.width = 420;

        var btnGroup = dlg.add("group");
        btnGroup.alignment = "right";
        var btnSkip = btnGroup.add("button", undefined, t("german_skip"));
        var btnReplace = btnGroup.add("button", undefined, t("german_replace"));
        var btnStop = btnGroup.add("button", undefined, t("german_finish"));

        var action = "skip";
        btnSkip.onClick = function() {
            action = "skip";
            dlg.close();
        };
        btnReplace.onClick = function() {
            action = "replace";
            dlg.close();
        };
        btnStop.onClick = function() {
            action = "stop";
            dlg.close();
        };

        dlg.show();

        if (action === "stop") {
            stopped = true;
            break;
        }
        if (action === "skip") {
            skippedCount++;
            continue;
        }

        var replacementText = replaceInput.text;
        if (replaceGermanFinding(finding, replacementText)) {
            replacedCount++;
        } else {
            alert(t("german_auto_replace_failed", { summary: buildLanguageToolFindingSummary(finding) }));
            skippedCount++;
        }
    }

    return { replaced: replacedCount, skipped: skippedCount, stopped: stopped };
}

function runMasterSpellingCheck(doc) {
    var targets = collectGermanSpellTargets(doc);
    if (targets.length === 0) {
        alert(t("german_no_targets"));
        return;
    }

    var progressWin = new Window("palette", t("german_progress_title"));
    progressWin.orientation = "column";
    progressWin.alignChildren = "fill";
    var progressTextLocal = progressWin.add("statictext", undefined, t("german_prepare_check"));
    progressTextLocal.preferredSize.width = 380;
    var progressBarLocal = progressWin.add("progressbar", undefined, 0, targets.length);
    progressWin.show();

    var corrections = [];
    var skippedTexts = 0;

    for (var i = 0; i < targets.length; i++) {
        var item = targets[i];
        progressBarLocal.value = i + 1;
        progressTextLocal.text = t("german_check_progress", { current: (i + 1), total: targets.length });
        progressWin.update();
        try {
            var response = runLanguageToolGermanFrameCheck(item.text);
            if (!response.ok || !response.data) {
                skippedTexts++;
                continue;
            }
            var matches = response.data.matches || [];
            var correction = buildGermanFrameCorrection(item, matches);
            if (correction) corrections.push(correction);
        } catch (e) {
            skippedTexts++;
        }
    }

    progressWin.close();

    if (corrections.length === 0) {
        var okMessage = t("german_check_ok");
        if (skippedTexts > 0) okMessage += t("german_check_notice_skipped", { count: skippedTexts });
        alert(okMessage);
        return;
    }

    var correctionResult = openGermanFrameCorrectionDialog(corrections);
    var finalMessage = t("german_dialog_done", { replaced: correctionResult.replaced, skipped: correctionResult.skipped });
    if (correctionResult.stopped) finalMessage += t("german_dialog_done_stopped");
    alert(finalMessage);
}

// --- 2. FORTSCHRITTS-FENSTER LOGIK ---
function createProgressWindow() {
    cancelFlag = false;
    startTime = new Date().getTime();
    globalStats = { apiChars: 0, savedChars: 0, fittedFrames: 0 }; 
    
    progressWin = new Window("palette", t("progress_title"));
    progressWin.orientation = "column";
    progressWin.alignChildren = "fill";
    
    progressWin.add("statictext", undefined, t("progress_current_step"));
    progressText = progressWin.add("statictext", undefined, t("progress_preparing"));
    progressText.preferredSize.width = 350;
    progressBar = progressWin.add("progressbar", undefined, 0, 100);
    progressBar.preferredSize.width = 350;
    
    progressWin.add("statictext", undefined, t("progress_overall"));
    overallText = progressWin.add("statictext", undefined, t("progress_complete_pct", { pct: 0 }));
    overallBar = progressWin.add("progressbar", undefined, 0, 100);
    overallBar.preferredSize.width = 350;
    
    etaText = progressWin.add("statictext", undefined, t("progress_eta_calc"));
    etaText.justify = "center";
    
    btnStopProgress = progressWin.add("button", undefined, t("progress_cancel"));
    btnStopProgress.onClick = function() {
        if (btnStopProgress.text === t("progress_close")) progressWin.close(); 
        else {
            cancelFlag = true;
            progressText.text = t("progress_cancel_requested");
            overallText.text = t("progress_cancelling");
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
            overallText.text = overallMsg ? overallMsg : t("progress_complete_pct", { pct: Math.round(overallPct) });
            
            if (overallPct > 0 && overallPct < 100) {
                var elapsed = new Date().getTime() - startTime;
                var totalEst = elapsed / (overallPct / 100);
                var remaining = totalEst - elapsed;
                
                var secs = Math.round(remaining / 1000);
                var mins = Math.floor(secs / 60);
                secs = secs % 60;
                
                var secStr = (secs < 10) ? "0" + secs : secs;
                etaText.text = t("progress_eta", { mins: mins, secs: secStr });
            } else if (overallPct >= 100) {
                etaText.text = t("progress_done");
            }
        }
        progressWin.update(); 
    }
}

function showSuccessScreen(finalMessage) {
    if (progressWin) {
        progressBar.value = 100;
        overallBar.value = 100;
        progressText.text = t("progress_success");
        overallText.text = finalMessage;
        
        var elapsedTotal = new Date().getTime() - startTime;
        var totalSecs = Math.round(elapsedTotal / 1000);
        var totalMins = Math.floor(totalSecs / 60);
        
        etaText.text = t("progress_duration", {
            mins: totalMins,
            secs: (totalSecs % 60),
            saved: globalStats.savedChars,
            frames: globalStats.fittedFrames
        });
        
        btnStopProgress.text = t("progress_close");
        progressWin.update();
    }
}

function closeProgressWindow() {
    if (progressWin) progressWin.close();
}


// --- 3. KLICK-LOGIK & START ---
btnTranslate.onClick = function() {
    var doc = null;
    try { doc = app.activeDocument; } catch(e) { alert(t("no_document_open")); return; }

    var config = {
        mode: radioBDA.value ? "BDA" : (radioPages.value ? "PAGES" : "SELECTION"),
        sourcePages: editPages.text,
        bdaSourcePages: bdaSourceInput.text,
        updateTOC: checkTOC.value,
        lang: dropdownLang.selection.text.substring(0, 2),
        onlyTextUpdate: cbOnlyTextUpdate ? cbOnlyTextUpdate.value : false,
        autoReferenceLinks: checkAutoBDAHyperlinks ? checkAutoBDAHyperlinks.value : false,
        autoReferenceSymbols: refSymbolsSetting,
        backPageTracker: backPageTrackerSetting
    };

    if (config.mode !== "BDA" && config.lang.indexOf("-") !== -1) {
        alert(t("validation_invalid_lang"));
        return;
    }

    if (config.mode === "SELECTION" && app.selection.length === 0) { alert(t("validation_select_something")); return; }
    if (config.mode === "PAGES" && config.sourcePages.replace(/\s/g, "") === "") { alert(t("validation_enter_pages")); return; }
    if (config.mode === "BDA" && config.bdaSourcePages.replace(/\s/g, "") === "") { alert(t("validation_enter_pages_or_auto")); return; }
    
    // Prüfen, ob API-Key hinterlegt ist
    if (!apiKey || apiKey === "") {
        alert(t("validation_enter_api_key"));
        return;
    }

    if (config.lang === "EN") config.lang = "EN-GB"; 
    if (config.lang === "PT") config.lang = "PT-PT";

    if (config.mode === "BDA") {
        autoBDAHyperlinksSetting = !!config.autoReferenceLinks;
        app.insertLabel(AUTO_HYPERLINKS_LABEL, autoBDAHyperlinksSetting ? "1" : "0");
        backPageTrackerSetting = normalizeBackPageTrackerSetting(config.backPageTracker);
        app.insertLabel(BACK_PAGE_TRACKER_LABEL, backPageTrackerSetting);
        if (config.autoReferenceLinks) {
            refSymbolsSetting = normalizeRefSymbols(config.autoReferenceSymbols);
            app.insertLabel(REF_SYMBOLS_LABEL, refSymbolsSetting);
        }
    }

    createProgressWindow();

    writeLog("=== NEUER VORGANG GESTARTET ===");
    writeLog("Dokument: " + doc.name + " | Modus: " + config.mode + " | Zielsprache: " + config.lang);

    app.doScript(
        function() { 
            try {
                var resultMsg = runMainProcess(doc, config); 
                writeLog("Erfolgreich beendet. (API genutzt: " + globalStats.apiChars + " Z., API gespart: " + globalStats.savedChars + " Z., Auto-Fit: " + globalStats.fittedFrames + " Rahmen)");
                showSuccessScreen(resultMsg ? resultMsg : t("all_translations_done"));
            } catch(e) {
                closeProgressWindow();
                if (e.message === "CANCELLED") {
                    writeLog("Vorgang durch Benutzer abgebrochen.", "WARNUNG");
                    alert(t("process_cancelled"));
                } else {
                    writeLog("FEHLER: " + e.message, "ERROR");
                    alert(t("process_error", { message: e.message }));
                }
            }
        }, 
        ScriptLanguage.JAVASCRIPT, 
        undefined, 
        UndoModes.ENTIRE_SCRIPT, 
        t("undo_translation", { mode: config.mode })
    );
}

// --- 4. HAUPTSTEUERUNG ---
function runMainProcess(doc, config) {
    var preparedLegacy = null;
    if (config.mode === "BDA") {
        preparedLegacy = prepareLegacyMasterSpreads(doc, !config.onlyTextUpdate);
    }
    if (config.mode === "BDA" && config.onlyTextUpdate) {
        updateLanguageMasterVersionLabels(doc);
        syncMasterTextChanges(doc);
        var updateMsg = syncBDATextChanges(doc, config);
        runAutomaticHyperlinksForBDA(doc, config);
        return updateMsg;
    }
    updateLanguageMasterVersionLabels(doc);
    syncMasterTextChanges(doc);
    if (config.mode === "BDA") {
        return runBDAMode(doc, config, preparedLegacy);
    } else {
        updateProgress(5, t("read_textframes"), 5, t("preparation"));
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
        return t("result_selection_pages", { lang: config.lang });
    }
}

// --- 5. BDA AUTOMATIK LOGIK ---
function normalizeBackPageSearchTerm(term) {
    return String(term || "").toLowerCase().replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
}

function parseBackPageTrackerTerms(settingValue) {
    var raw = normalizeBackPageTrackerSetting(settingValue);
    var parts = raw.split(/[\r\n|;,]+/);
    var terms = [];
    var seen = {};
    for (var i = 0; i < parts.length; i++) {
        var term = String(parts[i] || "").replace(/^\s+|\s+$/g, "");
        if (term === "") continue;
        var normalized = normalizeBackPageSearchTerm(term);
        if (normalized === "" || seen[normalized]) continue;
        seen[normalized] = true;
        terms.push(term);
    }
    if (terms.length === 0) terms.push("©");
    return terms;
}

function getPageSearchableText(page) {
    if (!page || !page.isValid) return "";
    var textFrames = getTextFramesFromContainer(page);
    var fragments = [];
    var seenStories = {};
    for (var i = 0; i < textFrames.length; i++) {
        var story = getTextFrameStory(textFrames[i]);
        if (!story || !story.isValid) continue;
        var storyId = null;
        try { storyId = story.id; } catch (eId) { storyId = null; }
        if (storyId !== null && seenStories[storyId]) continue;
        if (storyId !== null) seenStories[storyId] = true;
        try {
            var contents = String(story.contents || "");
            if (contents !== "") fragments.push(contents);
        } catch (e) {}
    }
    return normalizeBackPageSearchTerm(fragments.join(" "));
}

function collectBackPageCandidates(doc) {
    var candidates = [];
    if (!doc || !doc.isValid) return candidates;
    for (var i = 0; i < doc.pages.length; i++) {
        var page = doc.pages[i];
        candidates.push({ page: page, index: i, text: getPageSearchableText(page) });
    }
    return candidates;
}

function isBackMasterName(name) {
    return !!(name && String(name).match(/back/i));
}

function setBackMasterSpreadNaming(masterSpread) {
    if (!masterSpread || !masterSpread.isValid) return "";
    try {
        masterSpread.baseName = "Back-Musterseite";
    } catch (e) {
        try { masterSpread.properties = { baseName: "Back-Musterseite" }; } catch (e2) {}
    }
    return String(masterSpread.name || "");
}

function getMasterSpreadSearchableText(masterSpread) {
    if (!masterSpread || !masterSpread.isValid) return "";
    var fragments = [];
    var seenStories = {};
    for (var p = 0; p < masterSpread.pages.length; p++) {
        var frames = getTextFramesFromContainer(masterSpread.pages[p]);
        for (var f = 0; f < frames.length; f++) {
            var story = getTextFrameStory(frames[f]);
            if (!story || !story.isValid) continue;
            var storyId = null;
            try { storyId = story.id; } catch (eId) { storyId = null; }
            if (storyId !== null && seenStories[storyId]) continue;
            if (storyId !== null) seenStories[storyId] = true;
            try {
                var contents = String(story.contents || "");
                if (contents !== "") fragments.push(contents);
            } catch (e) {}
        }
    }
    return normalizeBackPageSearchTerm(fragments.join(" "));
}

function collectBackMasterCandidates(doc) {
    var candidates = [];
    if (!doc || !doc.isValid) return candidates;
    for (var i = 0; i < doc.masterSpreads.length; i++) {
        var master = doc.masterSpreads[i];
        candidates.push({ master: master, index: i, text: getMasterSpreadSearchableText(master) });
    }
    return candidates;
}

function findBackMasterByTracker(doc, trackerSetting) {
    var candidates = collectBackMasterCandidates(doc);
    if (candidates.length === 0) return null;

    var terms = ensureAutomaticBackPageFallbackTerms(parseBackPageTrackerTerms(trackerSetting), candidates);
    var filtered = candidates.slice(0);
    var matchedAny = false;

    for (var i = 0; i < terms.length; i++) {
        var normalizedTerm = normalizeBackPageSearchTerm(terms[i]);
        if (normalizedTerm === "") continue;
        var matches = [];
        for (var j = 0; j < filtered.length; j++) {
            if (filtered[j].text.indexOf(normalizedTerm) !== -1) matches.push(filtered[j]);
        }
        if (matches.length === 1) return matches[0].master;
        if (matches.length > 0) {
            filtered = matches;
            matchedAny = true;
        }
    }

    if (matchedAny && filtered.length > 0) return filtered[filtered.length - 1].master;

    var best = null;
    for (var c = 0; c < candidates.length; c++) {
        var score = 0;
        for (var tIndex = 0; tIndex < terms.length; tIndex++) {
            var scoreTerm = normalizeBackPageSearchTerm(terms[tIndex]);
            if (scoreTerm !== "" && candidates[c].text.indexOf(scoreTerm) !== -1) score++;
        }
        if (score > 0 && (!best || score > best.score || (score === best.score && candidates[c].index > best.index))) {
            best = { master: candidates[c].master, score: score, index: candidates[c].index };
        }
    }
    return best ? best.master : null;
}

function findNamedBackMasterSpread(doc) {
    if (!doc || !doc.isValid) return null;
    for (var i = doc.masterSpreads.length - 1; i >= 0; i--) {
        if (isBackMasterName(doc.masterSpreads[i].name)) return doc.masterSpreads[i];
    }
    return null;
}

function getPagesUsingMasterSpread(doc, masterSpread) {
    var pages = [];
    if (!doc || !doc.isValid || !masterSpread || !masterSpread.isValid) return pages;
    var masterId = null;
    try { masterId = masterSpread.id; } catch (eId) { masterId = null; }
    for (var i = 0; i < doc.pages.length; i++) {
        try {
            var applied = doc.pages[i].appliedMaster;
            if (!applied || !applied.isValid) continue;
            if (masterId !== null) {
                var appliedId = null;
                try { appliedId = applied.id; } catch (eAppliedId) { appliedId = null; }
                if (appliedId === masterId) pages.push(doc.pages[i]);
            } else if (String(applied.name || "") === String(masterSpread.name || "")) {
                pages.push(doc.pages[i]);
            }
        } catch (e) {}
    }
    return pages;
}

function getAppliedMasterSpread(page) {
    if (!page || !page.isValid) return null;
    try {
        if (page.appliedMaster && page.appliedMaster.isValid) return page.appliedMaster;
    } catch (e) {}
    return null;
}

function createBackMasterSpread(doc, sourceMaster) {
    var master = null;
    if (sourceMaster && sourceMaster.isValid) {
        try { master = sourceMaster.duplicate(LocationOptions.AFTER, sourceMaster); } catch (dupErr) { master = null; }
        if (!master || !master.isValid) {
            try { master = sourceMaster.duplicate(); } catch (dupErr2) { master = null; }
        }
    }
    if ((!master || !master.isValid) && doc && doc.isValid) {
        try { master = doc.masterSpreads.add(); } catch (addErr) { master = null; }
    }
    if (master && master.isValid) setBackMasterSpreadNaming(master);
    return master;
}

function ensureBackMasterForPage(doc, backPage, preferredMaster) {
    if (!doc || !doc.isValid || !backPage || !backPage.isValid) return null;

    var currentMaster = getAppliedMasterSpread(backPage);
    if (currentMaster && currentMaster.isValid && isBackMasterName(currentMaster.name)) {
        setBackMasterSpreadNaming(currentMaster);
        return currentMaster;
    }

    var existingBackMaster = findNamedBackMasterSpread(doc);
    if (existingBackMaster && existingBackMaster.isValid) {
        setBackMasterSpreadNaming(existingBackMaster);
        try { backPage.appliedMaster = existingBackMaster; } catch (assignExistingErr) {}
        return existingBackMaster;
    }

    var candidateMaster = currentMaster && currentMaster.isValid ? currentMaster : preferredMaster;
    if (candidateMaster && candidateMaster.isValid) {
        var usingPages = getPagesUsingMasterSpread(doc, candidateMaster);
        var canRenameExisting = false;
        if (usingPages.length === 0) {
            canRenameExisting = true;
        } else if (usingPages.length === 1) {
            try { canRenameExisting = (usingPages[0].id === backPage.id); } catch (eSingle) { canRenameExisting = (usingPages[0] === backPage); }
        }

        if (canRenameExisting) {
            setBackMasterSpreadNaming(candidateMaster);
            try { backPage.appliedMaster = candidateMaster; } catch (assignCandidateErr) {}
            return candidateMaster;
        }
    }

    var newBackMaster = createBackMasterSpread(doc, candidateMaster);
    if (newBackMaster && newBackMaster.isValid) {
        try { backPage.appliedMaster = newBackMaster; } catch (assignNewErr) {}
        return newBackMaster;
    }
    return currentMaster;
}

function ensureAutomaticBackPageFallbackTerms(terms, candidates) {
    var result = [];
    var seen = {};
    for (var i = 0; i < terms.length; i++) {
        var normalized = normalizeBackPageSearchTerm(terms[i]);
        if (normalized === "" || seen[normalized]) continue;
        seen[normalized] = true;
        result.push(terms[i]);
    }
    if (result.length === 0) result.push("©");

    var firstNormalized = normalizeBackPageSearchTerm(result[0]);
    if (firstNormalized === normalizeBackPageSearchTerm("©")) {
        var copyrightMatches = 0;
        for (var j = 0; j < candidates.length; j++) {
            if (candidates[j].text.indexOf(firstNormalized) !== -1) copyrightMatches++;
        }
        var companyTerm = "Steinbach International GmbH";
        var companyNormalized = normalizeBackPageSearchTerm(companyTerm);
        if (copyrightMatches >= 2 && !seen[companyNormalized]) result.push(companyTerm);
    }
    return result;
}

function findBackPageByTracker(doc, trackerSetting) {
    var candidates = collectBackPageCandidates(doc);
    if (candidates.length === 0) return null;

    var terms = ensureAutomaticBackPageFallbackTerms(parseBackPageTrackerTerms(trackerSetting), candidates);
    var filtered = candidates.slice(0);
    var matchedAny = false;

    for (var i = 0; i < terms.length; i++) {
        var normalizedTerm = normalizeBackPageSearchTerm(terms[i]);
        if (normalizedTerm === "") continue;
        var matches = [];
        for (var j = 0; j < filtered.length; j++) {
            if (filtered[j].text.indexOf(normalizedTerm) !== -1) matches.push(filtered[j]);
        }
        if (matches.length === 1) return matches[0].page;
        if (matches.length > 0) {
            filtered = matches;
            matchedAny = true;
        }
    }

    if (matchedAny && filtered.length > 0) return filtered[filtered.length - 1].page;

    var best = null;
    for (var c = 0; c < candidates.length; c++) {
        var score = 0;
        for (var tIndex = 0; tIndex < terms.length; tIndex++) {
            var scoreTerm = normalizeBackPageSearchTerm(terms[tIndex]);
            if (scoreTerm !== "" && candidates[c].text.indexOf(scoreTerm) !== -1) score++;
        }
        if (score > 0 && (!best || score > best.score || (score === best.score && candidates[c].index > best.index))) {
            best = { page: candidates[c].page, score: score, index: candidates[c].index };
        }
    }
    return best ? best.page : null;
}

function findOriginalBackPage(doc, trackerSetting) {
    if (!doc || !doc.isValid) return null;
    for (var p = doc.pages.length - 1; p >= 0; p--) {
        try {
            if (doc.pages[p].appliedMaster && doc.pages[p].appliedMaster.name.match(/back/i)) return doc.pages[p];
        } catch (e) {}
    }
    return findBackPageByTracker(doc, trackerSetting);
}

function findOriginalBackPageInfo(doc, trackerSetting) {
    if (!doc || !doc.isValid) return { page: null, master: null };

    var namedBackMaster = findNamedBackMasterSpread(doc);
    var namedBackMasterPages = getPagesUsingMasterSpread(doc, namedBackMaster);
    if (namedBackMasterPages.length > 0) {
        return { page: namedBackMasterPages[namedBackMasterPages.length - 1], master: namedBackMaster };
    }

    var namedPage = findOriginalBackPage(doc, trackerSetting);
    if (namedPage && namedPage.isValid) {
        return { page: namedPage, master: getAppliedMasterSpread(namedPage) || namedBackMaster };
    }

    var trackedMaster = findBackMasterByTracker(doc, trackerSetting);
    var trackedMasterPages = getPagesUsingMasterSpread(doc, trackedMaster);
    if (trackedMasterPages.length > 0) {
        return { page: trackedMasterPages[trackedMasterPages.length - 1], master: trackedMaster };
    }

    return { page: null, master: trackedMaster || namedBackMaster || null };
}

function runBDAMode(doc, config, preparedLegacy) {
    updateProgress(5, t("bda_search_templates"), 5, t("bda_analyze_doc"));
    var langTasks = (preparedLegacy && preparedLegacy.langTasks) ? preparedLegacy.langTasks : collectLegacyBDALanguageTasks(doc);

    if (!config.onlyTextUpdate) updateLanguageMasterVersionLabels(doc);
    if (langTasks.length === 0) { throw new Error(t("bda_no_templates")); }

    var backPageInfo = findOriginalBackPageInfo(doc, config.backPageTracker || backPageTrackerSetting);
    var originalBackPage = backPageInfo.page;
    if (originalBackPage && originalBackPage.isValid) {
        ensureBackMasterForPage(doc, originalBackPage, backPageInfo.master);
    } else {
        alert(t("back_page_not_found_notice"));
    }

    var originalPages = getBDAOriginalPages(doc, config);
    if (originalBackPage && originalBackPage.isValid) {
        var filteredOriginalPages = [];
        var backPageId = null;
        try { backPageId = originalBackPage.id; } catch (eBackId) { backPageId = null; }
        for (var op = 0; op < originalPages.length; op++) {
            var samePage = false;
            try {
                if (backPageId !== null && originalPages[op] && originalPages[op].isValid && originalPages[op].id === backPageId) samePage = true;
            } catch (eSameId) {}
            if (!samePage && originalPages[op] === originalBackPage) samePage = true;
            if (!samePage) filteredOriginalPages.push(originalPages[op]);
        }
        originalPages = filteredOriginalPages;
    }

    if (originalPages.length === 0) { throw new Error(t("bda_no_original_pages")); }

    var resultMsg = t("bda_finished", { count: langTasks.length });

    if (config.updateTOC) {
        updateProgress(8, t("bda_update_cover"), 8, t("bda_adjust_toc"));
        updateTOCForLanguage(doc, "de", originalPages[0].name);
    }

    var createdBackups = [];

    for (var i = 0; i < langTasks.length; i++) {
        if (cancelFlag) throw new Error("CANCELLED");
        
        var task = langTasks[i];
        
        var overallStartPct = 10 + (i / langTasks.length) * 85;
        var overallEndPct = 10 + ((i + 1) / langTasks.length) * 85;
        
        updateProgress(10, t("bda_create_doc_lang", { lang: task.code.toUpperCase() }), overallStartPct, t("bda_language_progress", { current: (i + 1), total: langTasks.length, lang: task.code.toUpperCase() }));
        
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

        try {
            executeTranslation(doc, targetTextObjArray, false, "", task.deepLCode, overallStartPct, overallEndPct);
        } catch (langError) {
            for (var rp = newPagesForThisLang.length - 1; rp >= 0; rp--) {
                try { if (newPagesForThisLang[rp] && newPagesForThisLang[rp].isValid) newPagesForThisLang[rp].remove(); } catch (cleanupErr) {}
            }
            throw langError;
        }
        
        if (config.updateTOC) {
            updateTOCForLanguage(doc, task.code, startPageStr);
        }

        try {
            if (doc.saved) {
                updateProgress(95, t("bda_save_backup"), overallEndPct, t("bda_save_progress"));
                var docFolder = doc.filePath.fsName;
                var docName = doc.name.replace(/\.indd$/i, "");
                var backupFile = new File(docFolder + "/" + docName + "_TempBackup_" + task.code.toUpperCase() + ".indd");
                doc.saveACopy(backupFile);
                createdBackups.push(backupFile);
            }
        } catch(e) {} 
    }

    updateProgress(98, t("bda_move_back_page"), 98, t("bda_cleanup_pages"));
    var backPageMoved = false;
    if (originalBackPage && originalBackPage.isValid) {
        try {
            originalBackPage.move(LocationOptions.AT_END);
            backPageMoved = true;
        } catch (moveBackErr) {}
    }
    if (!backPageMoved) {
        for (var p = doc.pages.length - 1; p >= 0; p--) {
            if (doc.pages[p].appliedMaster && doc.pages[p].appliedMaster.name.match(/back/i)) {
                doc.pages[p].move(LocationOptions.AT_END);
                backPageMoved = true;
                break;
            }
        }
    }
    
    updateProgress(99, t("bda_cleanup_backups"), 99, t("bda_almost_done"));
    for (var b = 0; b < createdBackups.length; b++) {
        if (createdBackups[b].exists) {
            try { createdBackups[b].remove(); } catch(e) {}
        }
    }

    try {
        var originalPages = getBDAOriginalPages(doc, config);
        if (originalPages && originalPages.length > 0) {
            saveBDASnapshot(doc, buildBDASnapshotPayload(originalPages));
        }
        var snapshotPages = getBDAOriginalPages(doc, config);
        if (snapshotPages && snapshotPages.length > 0) {
            saveBDASnapshot(doc, buildBDASnapshotPayload(snapshotPages));
        }
    } catch (e) {}

    runAutomaticHyperlinksForBDA(doc, config);

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

function getMasterSnapshotFile() {
    return new File(Folder.userData + "/SuperTranslatorPRO_MasterSnapshot.json");
}

function getDocSnapshotKey(doc) {
    try {
        if (doc.fullName && doc.fullName !== "") return doc.fullName.fsName;
    } catch (e) {}
    return "UNSAVED_" + doc.name;
}

function getGlossaryVersionToken(path) {
    path = resolveCSVPath(path);
    if (!path || path === "") return "";
    try {
        var f = new File(path);
        if (!f.exists) return "";
        return f.fsName + "|" + String(f.modified);
    } catch (e) {
        return String(path);
    }
}

function loadMasterSnapshot(doc) {
    var file = getMasterSnapshotFile();
    if (!file.exists) return null;
    try {
        file.encoding = "UTF-8";
        file.open("r");
        var content = file.read();
        file.close();
        if (!content || content === "") return null;
        var data = eval("(" + content + ")");
        var key = getDocSnapshotKey(doc);
        if (data[key]) return data[key];
        if (doc.fullName && doc.fullName !== "") {
            var alt = "UNSAVED_" + doc.name;
            if (data[alt]) return data[alt];
        }
        return null;
    } catch (e) {
        return null;
    }
}

function saveMasterSnapshot(doc, snapshot) {
    var file = getMasterSnapshotFile();
    var data = {};
    if (file.exists) {
        try {
            file.encoding = "UTF-8";
            file.open("r");
            var content = file.read();
            file.close();
            if (content && content !== "") data = eval("(" + content + ")");
        } catch (e) {
            data = {};
        }
    }
    data[getDocSnapshotKey(doc)] = snapshot;
    try {
        file.encoding = "UTF-8";
        file.open("w");
        file.write(serializeJSON(data));
        file.close();
    } catch (e) {}
}

function getBDASnapshotFile() {
    return new File(Folder.userData + "/SuperTranslatorPRO_BDAChangeSnapshot.json");
}

function loadBDASnapshot(doc) {
    var file = getBDASnapshotFile();
    if (!file.exists) return null;
    try {
        file.encoding = "UTF-8";
        file.open("r");
        var content = file.read();
        file.close();
        if (!content || content === "") return null;
        var data = eval("(" + content + ")");
        var key = getDocSnapshotKey(doc);
        if (data[key]) return data[key];
        if (doc.fullName && doc.fullName !== "") {
            var alt = "UNSAVED_" + doc.name;
            if (data[alt]) return data[alt];
        }
        return null;
    } catch (e) {
        return null;
    }
}

function saveBDASnapshot(doc, snapshot) {
    var file = getBDASnapshotFile();
    var data = {};
    if (file.exists) {
        try {
            file.encoding = "UTF-8";
            file.open("r");
            var content = file.read();
            file.close();
            if (content && content !== "") data = eval("(" + content + ")");
        } catch (e) {
            data = {};
        }
    }
    data[getDocSnapshotKey(doc)] = snapshot;
    try {
        file.encoding = "UTF-8";
        file.open("w");
        file.write(serializeJSON(data));
        file.close();
    } catch (e) {}
}

function getBDAOriginalPages(doc, config) {
    if (config.bdaSourcePages && config.bdaSourcePages.toUpperCase() !== "AUTO") {
        return getPagesFromString(doc, config.bdaSourcePages);
    }
    var pages = [];
    for (var i = 0; i < doc.pages.length; i++) {
        try {
            var applied = doc.pages[i].appliedMaster;
            if (applied && applied.name.match(/[-_]de(?:[-_]|$)/i)) {
                pages.push(doc.pages[i]);
            }
        } catch (e) {}
    }
    return pages;
}

function getItemSignature(item) {
    if (!item || !item.isValid) return "";
    var sig = item.constructor.name;
    try {
        if (sig === "TextFrame") {
            var story = null;
            try { story = item.parentStory; } catch (e) { story = null; }
            if ((!story || !story.isValid) && item.texts && item.texts.length > 0) story = item.texts[0];
            if (story && story.isValid) sig += ":" + story.contents;
        } else if (sig === "Rectangle" || sig === "Polygon" || sig === "Oval") {
            if (item.allGraphics && item.allGraphics.length > 0) {
                try {
                    var link = item.allGraphics[0].itemLink;
                    if (link && link.isValid) sig += ":" + link.filePath;
                } catch (e) {}
            }
        } else if (sig === "Group") {
            try {
                var children = item.allPageItems.everyItem().getElements();
                for (var c = 0; c < children.length; c++) {
                    sig += "|" + getItemSignature(children[c]);
                }
            } catch (e) {}
        }
    } catch (e) {}
    return sig;
}

function normalizeBounds(bounds) {
    if (!bounds || bounds.length !== 4) return null;
    return [parseFloat(bounds[0]), parseFloat(bounds[1]), parseFloat(bounds[2]), parseFloat(bounds[3])];
}

function getItemDescriptor(item) {
    var desc = { type: null, bounds: null, textLen: 0, graphicPath: null };
    if (!item || !item.isValid) return desc;
    desc.type = item.constructor.name;
    try {
        desc.bounds = normalizeBounds(item.geometricBounds);
    } catch (e) { desc.bounds = null; }
    try {
        if (desc.type === "TextFrame") {
            var story = getTextFrameStory(item);
            if (story) desc.textLen = story.contents.length;
        } else if (item.allGraphics && item.allGraphics.length > 0) {
            try {
                var link = item.allGraphics[0].itemLink;
                if (link && link.isValid) desc.graphicPath = link.filePath;
            } catch (e) {}
        }
    } catch (e) {}
    return desc;
}

function boundsDistance(a, b) {
    if (!a || !b) return Number.MAX_VALUE;
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3]);
}

function findBestMatchingTargetItem(sourceItem, targetItems, fallbackIndex) {
    if (!sourceItem || !targetItems || targetItems.length === 0) return null;
    var sourceDesc = getItemDescriptor(sourceItem);
    var bestMatch = null;
    var bestScore = Number.MAX_VALUE;
    for (var i = 0; i < targetItems.length; i++) {
        var targetItem = targetItems[i];
        if (!targetItem || !targetItem.isValid) continue;
        var targetDesc = getItemDescriptor(targetItem);
        if (targetDesc.type !== sourceDesc.type) continue;
        var score = 0;
        if (sourceDesc.graphicPath && targetDesc.graphicPath) {
            if (sourceDesc.graphicPath === targetDesc.graphicPath) score -= 1000;
            else score += 1000;
        }
        if (sourceDesc.bounds && targetDesc.bounds) {
            score += boundsDistance(sourceDesc.bounds, targetDesc.bounds);
        } else {
            score += 500;
        }
        if (sourceDesc.type === "TextFrame") {
            score += Math.abs(sourceDesc.textLen - targetDesc.textLen);
        }
        if (score < bestScore) {
            bestScore = score;
            bestMatch = targetItem;
        }
    }
    if (bestMatch) return bestMatch;
    if (fallbackIndex !== undefined && fallbackIndex !== null && fallbackIndex < targetItems.length) {
        return targetItems[fallbackIndex];
    }
    return null;
}

function buildBDAChangeSnapshot(pages) {
    var snapshot = [];
    for (var p = 0; p < pages.length; p++) {
        var pageData = [];
        try {
            var items = pages[p].pageItems.everyItem().getElements();
            for (var i = 0; i < items.length; i++) {
                pageData.push(getItemSignature(items[i]));
            }
        } catch (e) {}
        snapshot.push(pageData);
    }
    return snapshot;
}

function buildBDASnapshotPayload(pages) {
    return {
        pages: buildBDAChangeSnapshot(pages),
        glossaryVersion: getGlossaryVersionToken(csvPath)
    };
}

function getBDASnapshotPages(snapshot) {
    if (!snapshot) return null;
    if (snapshot instanceof Array) return snapshot;
    return snapshot.pages || [];
}

function getBDASnapshotGlossaryVersion(snapshot) {
    if (!snapshot || snapshot instanceof Array) return "";
    return snapshot.glossaryVersion || "";
}

function getBDATargetPagesByLang(doc) {
    var pagesByLang = {};
    for (var i = 0; i < doc.pages.length; i++) {
        try {
            var applied = doc.pages[i].appliedMaster;
            if (!applied) continue;
            var match = applied.name.match(/[-_]([a-z]{2})(?:[-_]|$)/i);
            if (!match) continue;
            var code = match[1].toLowerCase();
            if (code === "de") continue;
            if (!pagesByLang[code]) pagesByLang[code] = [];
            pagesByLang[code].push(doc.pages[i]);
        } catch (e) {}
    }
    return pagesByLang;
}

function replacePageFrameText(page, frameIndex, contents) {
    try {
        var frames = page.textFrames.everyItem().getElements();
        if (frameIndex >= frames.length) return false;
        var tf = frames[frameIndex];
        var story = null;
        try { story = tf.parentStory; } catch (e) { story = null; }
        if ((!story || !story.isValid) && tf.texts && tf.texts.length > 0) story = tf.texts[0];
        if (!story || !story.isValid) return false;
        story.contents = contents;
        if (story.characters && story.characters.length > 0) normalizePostTranslationSpacing(story);
        return true;
    } catch (e) { return false; }
}

function getTextFrameStory(tf) {
    if (!tf || !tf.isValid) return null;
    var story = null;
    try { story = tf.parentStory; } catch (e) { story = null; }
    if ((!story || !story.isValid) && tf.texts && tf.texts.length > 0) story = tf.texts[0];
    if (!story || !story.isValid) return null;
    return story;
}

function findAndReplaceTextInStory(story, findString, replaceString) {
    if (!story || !findString || findString === "" || replaceString === undefined || replaceString === null) return false;
    try {
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
        app.findTextPreferences.findWhat = findString;
        var found = story.findText();
        if (!found || found.length === 0) return false;
        for (var i = 0; i < found.length; i++) {
            try { found[i].contents = replaceString; } catch (e) {}
        }
        return true;
    } catch (e) {
        return false;
    } finally {
        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
    }
}

function normalizeInDesignText(text) {
    if (text === null || text === undefined) return text;
    return String(text).replace(/\r\n/g, '\r').replace(/\n/g, '\r');
}

function replacePageFrameSegmentText(page, frameIndex, oldText, newText) {
    if (!page || !oldText || oldText === "" || newText === undefined || newText === null) return false;
    var searchText = normalizeInDesignText(oldText);
    var replaceText = normalizeInDesignText(newText);
    try {
        var frames = page.textFrames.everyItem().getElements();
        if (frameIndex >= frames.length) return false;
        var targetFrame = frames[frameIndex];
        if (!targetFrame.isValid) return false;
        var frameScope = null;
        try { if (targetFrame.texts && targetFrame.texts.length > 0) frameScope = targetFrame.texts[0]; } catch (e) {}
        if (!frameScope) frameScope = getTextFrameStory(targetFrame);
        if (!frameScope) return false;

        app.findTextPreferences = NothingEnum.nothing;
        app.changeTextPreferences = NothingEnum.nothing;
        app.findTextPreferences.findWhat = searchText;
        app.changeTextPreferences.changeTo = replaceText;
        var changedRanges = frameScope.changeText();
        if (changedRanges && changedRanges.length > 0) {
            return true;
        }

        for (var i = 0; i < frames.length; i++) {
            var fallbackScope = null;
            try { if (frames[i].texts && frames[i].texts.length > 0) fallbackScope = frames[i].texts[0]; } catch (e) {}
            if (!fallbackScope) fallbackScope = getTextFrameStory(frames[i]);
            if (!fallbackScope) continue;
            app.findTextPreferences.findWhat = searchText;
            app.changeTextPreferences.changeTo = replaceText;
            changedRanges = fallbackScope.changeText();
            if (changedRanges && changedRanges.length > 0) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    } finally {
        try { app.findTextPreferences = NothingEnum.nothing; } catch (e) {}
        try { app.changeTextPreferences = NothingEnum.nothing; } catch (e) {}
    }
}

function getChangedTextSegment(oldText, newText) {
    if (oldText === newText) return null;
    var prefix = 0; var minLen = Math.min(oldText.length, newText.length);
    while (prefix < minLen && oldText.charAt(prefix) === newText.charAt(prefix)) prefix++;
    var oldRest = oldText.substring(prefix);
    var newRest = newText.substring(prefix);
    var suffix = 0; var minRest = Math.min(oldRest.length, newRest.length);
    while (suffix < minRest && oldRest.charAt(oldRest.length - 1 - suffix) === newRest.charAt(newRest.length - 1 - suffix)) suffix++;
    var oldSegment = oldRest.substring(0, oldRest.length - suffix);
    var newSegment = newRest.substring(0, newRest.length - suffix);
    if (oldSegment === "" && newSegment === "") return null;
    if (oldSegment === "") {
        oldSegment = oldRest;
        newSegment = newRest;
    }
    return { oldSegment: oldSegment, newSegment: newSegment };
}

function syncBDATextChanges(doc, config) {
    var sourcePages = getBDAOriginalPages(doc, config);
    if (!sourcePages || sourcePages.length === 0) {
        throw new Error(t("sync_no_source_pages"));
    }
    var prevSnapshotData = loadBDASnapshot(doc);
    var prevSnapshot = getBDASnapshotPages(prevSnapshotData);
    var currentSnapshot = buildBDASnapshotPayload(sourcePages);
    var currentSnapshotPages = currentSnapshot.pages;
    var forceGlossaryRefresh = false;
    if (prevSnapshotData) {
        forceGlossaryRefresh = (getBDASnapshotGlossaryVersion(prevSnapshotData) !== currentSnapshot.glossaryVersion);
    }
    if (!prevSnapshotData) {
        saveBDASnapshot(doc, currentSnapshot);
        return t("sync_state_saved");
    }

    var targetsByLang = getBDATargetPagesByLang(doc);
    var langCodes = [];
    for (var key in targetsByLang) {
        if (targetsByLang.hasOwnProperty(key)) {
            langCodes.push(key);
        }
    }
    if (langCodes.length === 0) {
        throw new Error(t("sync_no_target_pages"));
    }

    var changeBlocks = [];
    for (var p = 0; p < currentSnapshotPages.length; p++) {
        var currentItems = currentSnapshotPages[p] || [];
        var previousItems = prevSnapshot[p] || [];
        var maxItems = Math.max(currentItems.length, previousItems.length);
        for (var i = 0; i < maxItems; i++) {
            var currentSig = currentItems[i] || "";
            var previousSig = previousItems[i] || "";
            if (forceGlossaryRefresh || currentSig !== previousSig) {
                changeBlocks.push({ pageIndex: p, itemIndex: i });
            }
        }
    }

    if (changeBlocks.length === 0) {
        saveBDASnapshot(doc, currentSnapshot);
        return t("sync_no_changes");
    }

    var anyUpdated = false;

    for (var li = 0; li < langCodes.length; li++) {
        if (cancelFlag) throw new Error("CANCELLED");
        var langCode = langCodes[li];
        var targetPages = targetsByLang[langCode];
        targetPages.sort(function(a,b){ return a.documentOffset - b.documentOffset; });
        var deepLLang = getDeepLLangCode(langCode);
        var targetTextObjArray = [];
        var pendingReplacements = [];
        var reservedTargetItemIds = {};

        for (var bi = 0; bi < changeBlocks.length; bi++) {
            if (cancelFlag) throw new Error("CANCELLED");
            var block = changeBlocks[bi];
            var sourcePage = sourcePages[block.pageIndex];
            var targetPage = targetPages[block.pageIndex];
            if (!sourcePage || !targetPage) continue;

            var sourceItems = sourcePage.pageItems.everyItem().getElements();
            var targetItems = targetPage.pageItems.everyItem().getElements();
            if (block.itemIndex >= sourceItems.length) continue;

            var sourceItem = sourceItems[block.itemIndex];
            if (!sourceItem) continue;

            var candidateItems = [];
            for (var ti = 0; ti < targetItems.length; ti++) {
                var candidate = targetItems[ti];
                var candidateId = null;
                try { candidateId = candidate.id; } catch (eId) { candidateId = null; }
                if (candidateId !== null && reservedTargetItemIds[candidateId]) continue;
                candidateItems.push(candidate);
            }

            var oldTargetItem = findBestMatchingTargetItem(sourceItem, candidateItems, null);
            if (!oldTargetItem) continue;

            try {
                var duplicated = sourceItem.duplicate(targetPage);
                if (duplicated && duplicated.isValid) {
                    anyUpdated = true;
                    var oldTargetId = null;
                    var duplicatedId = null;
                    try { oldTargetId = oldTargetItem.id; } catch (eId2) { oldTargetId = null; }
                    try { duplicatedId = duplicated.id; } catch (eId3) { duplicatedId = null; }
                    if (oldTargetId !== null) reservedTargetItemIds[oldTargetId] = true;
                    if (duplicatedId !== null) reservedTargetItemIds[duplicatedId] = true;

                    try {
                        if (oldTargetItem.itemLayer && oldTargetItem.itemLayer.isValid) duplicated.itemLayer = oldTargetItem.itemLayer;
                    } catch (eLayer) {}
                    try {
                        if (duplicated.hasOwnProperty("geometricBounds") && oldTargetItem.hasOwnProperty("geometricBounds")) {
                            duplicated.geometricBounds = oldTargetItem.geometricBounds;
                        }
                    } catch (eBounds) {}

                    pendingReplacements.push({ oldItem: oldTargetItem, newItem: duplicated });
                    var newFrames = [];
                    if (duplicated.constructor.name === "TextFrame") {
                        newFrames.push(duplicated);
                    } else if (duplicated.allPageItems && duplicated.allPageItems.length > 0) {
                        var nested = duplicated.allPageItems;
                        for (var n = 0; n < nested.length; n++) {
                            if (nested[n].constructor.name === "TextFrame") {
                                newFrames.push(nested[n]);
                            }
                        }
                    }
                    for (var nf = 0; nf < newFrames.length; nf++) {
                        var st = getTextFrameStory(newFrames[nf]);
                        if (st) targetTextObjArray.push(st);
                    }
                }
            } catch (e) {}
        }

        if (pendingReplacements.length > 0) {
            var overallStartPct = 10 + (li / langCodes.length) * 85;
            var overallEndPct = 10 + ((li + 1) / langCodes.length) * 85;
            try {
                if (targetTextObjArray.length > 0) {
                    updateProgress(10, t("sync_translate_changed", { lang: langCode.toUpperCase() }), overallStartPct, t("bda_language_progress", { current: (li + 1), total: langCodes.length, lang: langCode.toUpperCase() }));
                    executeTranslation(doc, targetTextObjArray, false, "", deepLLang, overallStartPct, overallEndPct);
                }

                for (var pr = 0; pr < pendingReplacements.length; pr++) {
                    var replacement = pendingReplacements[pr];
                    try {
                        if (replacement.newItem && replacement.newItem.isValid && replacement.oldItem && replacement.oldItem.isValid) {
                            replacement.newItem.move(LocationOptions.BEFORE, replacement.oldItem);
                        }
                    } catch (moveErr) {}
                    try { if (replacement.oldItem && replacement.oldItem.isValid) replacement.oldItem.remove(); } catch (removeErr) {}
                }
            } catch (syncError) {
                for (var cleanupIndex = pendingReplacements.length - 1; cleanupIndex >= 0; cleanupIndex--) {
                    var pending = pendingReplacements[cleanupIndex];
                    try { if (pending.newItem && pending.newItem.isValid) pending.newItem.remove(); } catch (cleanupErr) {}
                }
                throw syncError;
            }
        }
    }

    saveBDASnapshot(doc, currentSnapshot);
    return anyUpdated ? t("sync_updated", { count: changeBlocks.length }) : t("sync_no_changes");
}

function createFeedbackReport() {
    var folder = Folder.desktop;
    if (!folder || !folder.exists) folder = Folder.temp;
    var fileName = "SuperTranslatorPRO_FeedbackReport_" + (new Date().getTime()) + ".txt";
    var reportFile = new File(folder.fsName + "/" + fileName);
    try {
        reportFile.encoding = "UTF-8";
        if (reportFile.open("w")) {
            reportFile.writeln(SCRIPT_NAME + " Feedback Report");
            reportFile.writeln("Version: " + SCRIPT_VERSION);
            reportFile.writeln("Datum: " + new Date());
            reportFile.writeln("OS: " + ($.os || "unbekannt"));
            try { reportFile.writeln("InDesign-Version: " + app.version); } catch (e) { reportFile.writeln("InDesign-Version: unbekannt"); }
            try { reportFile.writeln("Dokument: " + (app.activeDocument ? app.activeDocument.name : "Kein Dokument offen")); } catch (e) { reportFile.writeln("Dokument: unbekannt"); }
            reportFile.writeln("API-Key gesetzt: " + ((apiKey && apiKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("CSV-Pfad: " + (csvPath || "(leer)"));
            reportFile.writeln("TM-Pfad: " + (tmPath || "(leer)"));
            reportFile.writeln("Referenz-Symbole: " + (refSymbolsSetting || "[]"));
            reportFile.writeln("Formality: " + (formalitySetting || "default"));
            reportFile.writeln("DNT Styles: " + (dntStyles || "(leer)"));
            reportFile.writeln("\n--- Bitte hier beschreiben: \n");
            reportFile.close();
            alert(t("feedback_created", { path: reportFile.fsName }));
            try { reportFile.execute(); } catch (e) {}
        }
    } catch (e) {
        alert(t("feedback_failed", { message: e.message }));
    }
}

function serializeJSON(obj) {
    if (obj === null) return "null";
    if (typeof obj === "string") return '"' + obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"';
    if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
    if (obj instanceof Array) {
        var items = [];
        for (var i = 0; i < obj.length; i++) items.push(serializeJSON(obj[i]));
        return "[" + items.join(",") + "]";
    }
    var pairs = [];
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        pairs.push(serializeJSON(key) + ":" + serializeJSON(obj[key]));
    }
    return "{" + pairs.join(",") + "}";
}

function getMasterLang(masterName) {
    var match = masterName.match(/[-_]([a-z]{2})(?:[-_]|$)/i);
    return match ? match[1].toLowerCase() : null;
}

function getMasterPrefix(masterName) {
    var match = masterName.match(/^(.*?)(?:[-_][a-z]{2})(?:[-_]|$)/i);
    return match ? match[1] : masterName;
}

function buildMasterTextSnapshot(doc) {
    var snapshot = {};
    var masterSpreads = doc.masterSpreads;
    for (var m = 0; m < masterSpreads.length; m++) {
        var master = masterSpreads[m];
        var pages = master.pages;
        var pagesData = [];
        for (var p = 0; p < pages.length; p++) {
            var texts = [];
            try {
                var frames = pages[p].textFrames.everyItem().getElements();
                for (var f = 0; f < frames.length; f++) {
                    var tf = frames[f];
                    try {
                        var story = null;
                        try { story = tf.parentStory; } catch (e) { story = null; }
                        if ((!story || !story.isValid) && tf.texts && tf.texts.length > 0) story = tf.texts[0];
                        if (story && story.isValid) texts.push(story.contents);
                    } catch (e) {}
                }
            } catch (e) {}
            pagesData.push(texts);
        }
        snapshot[master.name] = pagesData;
    }
    return snapshot;
}

function getRelatedTargetMasterSpreads(doc, sourceMasterName) {
    var sourcePrefix = getMasterPrefix(sourceMasterName);
    var result = [];
    var masterSpreads = doc.masterSpreads;
    for (var m = 0; m < masterSpreads.length; m++) {
        var masterName = masterSpreads[m].name;
        if (masterName === sourceMasterName) continue;
        if (getMasterPrefix(masterName) !== sourcePrefix) continue;
        var lang = getMasterLang(masterName);
        if (!lang || lang === "de") continue;
        result.push(masterSpreads[m]);
    }
    return result;
}

function getDeepLLangCode(code) {
    var deepLLang = code.toUpperCase();
    if (deepLLang === "EN") return "EN-GB";
    if (deepLLang === "PT") return "PT-PT";
    return deepLLang;
}

function replaceMasterFrameText(masterSpread, pageIndex, frameIndex, contents) {
    try {
        var page = masterSpread.pages[pageIndex];
        if (!page) return false;
        var frames = page.textFrames.everyItem().getElements();
        if (frameIndex >= frames.length) return false;
        var tf = frames[frameIndex];
        var story = null;
        try { story = tf.parentStory; } catch (e) { story = null; }
        if ((!story || !story.isValid) && tf.texts && tf.texts.length > 0) story = tf.texts[0];
        if (!story || !story.isValid) return false;
        story.contents = contents;
        if (story.characters && story.characters.length > 0) normalizePostTranslationSpacing(story);
        return true;
    } catch (e) { return false; }
}

function syncMasterTextChanges(doc) {
    var prevSnapshot = loadMasterSnapshot(doc);
    var currentSnapshot = buildMasterTextSnapshot(doc);
    var parsedGlossary = loadCSVGlossary(csvPath);
    var glossaryRuntimeByLang = {};
    var glossaryVersion = getGlossaryVersionToken(csvPath);
    var forceGlossaryRefresh = false;
    if (prevSnapshot) {
        forceGlossaryRefresh = ((prevSnapshot.__glossaryVersion || "") !== glossaryVersion);
    }
    currentSnapshot.__glossaryVersion = glossaryVersion;
    if (!prevSnapshot) {
        saveMasterSnapshot(doc, currentSnapshot);
        return;
    }
    var changesByLang = {};
    for (var masterName in currentSnapshot) {
        if (!currentSnapshot.hasOwnProperty(masterName)) continue;
        if (!masterName.match(/[-_]de(?:[-_]|$)/i)) continue;
        var currentPages = currentSnapshot[masterName];
        var previousPages = prevSnapshot[masterName] || [];
        for (var p = 0; p < currentPages.length; p++) {
            var currentFrames = currentPages[p] || [];
            var previousFrames = previousPages[p] || [];
            for (var f = 0; f < currentFrames.length; f++) {
                var currentText = currentFrames[f] || "";
                var previousText = previousFrames[f] || "";
                if (forceGlossaryRefresh || currentText !== previousText) {
                    var targets = getRelatedTargetMasterSpreads(doc, masterName);
                    for (var targetIndex = 0; targetIndex < targets.length; targetIndex++) {
                        var targetMaster = targets[targetIndex];
                        var lang = getMasterLang(targetMaster.name);
                        if (!lang) continue;
                        if (!changesByLang[lang]) changesByLang[lang] = [];
                        changesByLang[lang].push({ master: targetMaster, pageIndex: p, frameIndex: f, text: currentText });
                    }
                }
            }
        }
    }
    for (var langCode in changesByLang) {
        if (!changesByLang.hasOwnProperty(langCode)) continue;
        var blocks = changesByLang[langCode];
        if (blocks.length === 0) continue;
        var deepLLang = getDeepLLangCode(langCode);
        if (!glossaryRuntimeByLang[deepLLang]) glossaryRuntimeByLang[deepLLang] = buildGlossaryRuntime(parsedGlossary, deepLLang);
        var glossaryRuntime = glossaryRuntimeByLang[deepLLang];
        var texts = [];
        for (var b = 0; b < blocks.length; b++) texts.push(buildPlainTranslationXML(blocks[b].text, glossaryRuntime));
        var translated = translateBatchDeepL(texts, deepLLang, 10, 20);
        if (!translated) continue;
        for (var b = 0; b < blocks.length; b++) {
            if (!translated[b]) continue;
            replaceMasterFrameText(blocks[b].master, blocks[b].pageIndex, blocks[b].frameIndex, decodeDeepLXMLText(translated[b]));
        }
    }
    saveMasterSnapshot(doc, currentSnapshot);
}

// --- 5B. TOC RÖNTGEN-UPDATE LOGIK ---
function updateTOCForLanguage(doc, langCode, newStartPage) {
    try {
        var page = doc.pages[0];
        var items = collectTOCTextEntries(page);
        var markerItem = null;
        for (var i = 0; i < items.length; i++) {
            if (extractTOCLanguageCodeFromItem(items[i]) === String(langCode || "").toUpperCase()) {
                markerItem = items[i];
                break;
            }
        }

        if (markerItem === null) return;

        var targetItem = findTOCPageTargetItem(items, markerItem);

        if (targetItem !== null) {
            var targetText = getHyperlinkTextObjectFromItemEntry(targetItem);
            if (!targetText || !targetText.isValid) return;
            var oldText = getTOCItemContents(targetItem);
            var newText = oldText.replace(/\([^()]*\)/, "(" + newStartPage + ")");
            targetText.contents = newText;
            createOrUpdateTOCLanguageHyperlink(doc, targetItem, langCode, newStartPage);
        }
    } catch(e) {}
}

function runAutomaticHyperlinksForBDA(doc, config) {
    if (!config || !config.autoReferenceLinks) return null;

    var pageMappings = collectCoverHyperlinkPageMappings(doc);
    if (!hasOwnMappings(pageMappings)) return null;

    var normalizedSymbols = normalizeRefSymbols(config.autoReferenceSymbols || refSymbolsSetting);
    saveHyperlinkSettings(normalizedSymbols, pageMappings);

    try {
        updateProgress(99, t("link_working"), 99, t("link_working"));
    } catch (progressErr) {}

    try {
        return linkPackageReferences(doc, normalizedSymbols, pageMappings, { throwOnNoMatches: false });
    } catch (e) {
        writeLog("Auto-Hyperlinks konnten nicht erstellt werden: " + (e.message || e), "WARNUNG");
    }
    return null;
}

function getParkedTableAnchorCharacter(frame) {
    if (!frame || !frame.isValid) return null;
    try {
        if (frame.tables && frame.tables.length > 0) {
            var table = frame.tables[0];
            if (table && table.isValid && table.storyOffset && table.storyOffset.isValid) {
                var parentText = table.storyOffset.parent;
                var anchorIndex = table.storyOffset.index;
                if (parentText && parentText.isValid && anchorIndex !== undefined && anchorIndex !== null) {
                    var anchorChar = parentText.characters.item(anchorIndex);
                    if (anchorChar && anchorChar.isValid) return anchorChar;
                }
            }
        }
    } catch (e) {}
    try {
        var fallbackChar = frame.characters.item(0);
        if (fallbackChar && fallbackChar.isValid) return fallbackChar;
    } catch (e2) {}
    return null;
}

function restoreInlineMarkerRange(placeholderRange, moveCallback) {
    if (!placeholderRange || !placeholderRange.isValid || !moveCallback) return false;

    var targetStory = null;
    var startIndex = -1;
    var endIndex = -1;
    try {
        targetStory = placeholderRange.parentStory;
        if (!targetStory || !targetStory.isValid) return false;
        startIndex = placeholderRange.characters.item(0).index;
        endIndex = placeholderRange.characters.item(-1).index;
    } catch (e) {
        return false;
    }

    if (startIndex < 0 || endIndex < startIndex) return false;

    try {
        var targetInsertionPoint = targetStory.insertionPoints.item(endIndex + 1);
        moveCallback(targetInsertionPoint);
        targetStory.characters.itemByRange(startIndex, endIndex).remove();
        return true;
    } catch (e2) {
        return false;
    }
}

function buildTranslationMarkerKey(runToken, localId) {
    return String(runToken || "") + "_" + String(localId || 0);
}

function buildTranslationMarker(prefix, markerKey) {
    return "###" + String(prefix || "") + "_" + String(markerKey || "") + "###";
}

function findTranslationMarkerMatches(doc, preferredScope, markerText, includeOuterWhitespace) {
    var pattern = (includeOuterWhitespace ? "[ \\t]*" : "") + escapeGrepLiteral(markerText) + (includeOuterWhitespace ? "[ \\t]*" : "");
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = pattern;
        if (preferredScope && preferredScope.isValid && preferredScope.findGrep) {
            var scopedMatches = preferredScope.findGrep();
            if (scopedMatches && scopedMatches.length > 0) return scopedMatches;
        }
    } catch (e) {}
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = pattern;
        return doc.findGrep();
    } catch (e2) {
        return [];
    }
}

function getFirstParkedTable(frame) {
    if (!frame || !frame.isValid) return null;
    try {
        if (frame.tables && frame.tables.length > 0) {
            var table = frame.tables[0];
            if (table && table.isValid) return table;
        }
    } catch (e) {}
    return null;
}

function restoreParkedTableAtMarker(parked, placeholderRange) {
    var parkedTable = getFirstParkedTable(parked ? parked.frame : null);
    var anchorChar = null;
    try {
        if (parked && parked.anchorChar && parked.anchorChar.isValid) anchorChar = parked.anchorChar;
    } catch (e) { anchorChar = null; }
    if (!anchorChar) anchorChar = getParkedTableAnchorCharacter(parked ? parked.frame : null);

    return restoreInlineMarkerRange(placeholderRange, function(targetInsertionPoint) {
        var restored = false;
        if (parkedTable && parkedTable.isValid) {
            try {
                parkedTable.duplicate(LocationOptions.AFTER, targetInsertionPoint);
                restored = true;
            } catch (dupErr) {}
            if (!restored) {
                try {
                    parkedTable.move(LocationOptions.AFTER, targetInsertionPoint);
                    restored = true;
                } catch (moveErr) {}
            }
        }
        if (!restored && anchorChar && anchorChar.isValid) {
            anchorChar.move(LocationOptions.AFTER, targetInsertionPoint);
            restored = true;
        }
        if (!restored) throw new Error("TABLE_RESTORE_FAILED");
    });
}

function restoreParkedTablesAndImages(doc, storageEnv, globalParkedTables, textTargets) {
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
    } catch (prefErr) {}

    try {
        for (var i = globalParkedTables.length - 1; i >= 0; i--) {
            var parked = globalParkedTables[i];
            var results = findTranslationMarkerMatches(doc, parked.hostText, parked.marker, true);
            if (results.length > 0) {
                var tableRestored = false;
                try {
                    tableRestored = restoreParkedTableAtMarker(parked, results[0]);
                } catch (e1) {}
                if (!tableRestored) {
                    try { writeLog("Tabelle konnte nicht exakt wiederhergestellt werden: " + parked.marker, "WARNUNG"); } catch (eWarn) {}
                }
            } else {
                try { writeLog("Tabellen-Marker nicht gefunden: " + parked.marker, "WARNUNG"); } catch (e2) {}
            }
            try { if (parked.frame && parked.frame.isValid) parked.frame.remove(); } catch (e3) {}
        }

        try { if (storageEnv.frame && storageEnv.frame.isValid) storageEnv.frame.itemLayer.visible = true; } catch (e4) {}

        var restorePasses = 0;
        var restoreLimit = 10000;
        while (restorePasses < restoreLimit) {
            app.findGrepPreferences.findWhat = "###IMG_[0-9_]+###";
            var allFoundImages = doc.findGrep();
            if (!allFoundImages || allFoundImages.length === 0) break;

            var restoredOne = false;
            for (var f = allFoundImages.length - 1; f >= 0; f--) {
                var placeholderRange = allFoundImages[f];
                if (!placeholderRange || !placeholderRange.isValid) continue;

                var match = placeholderRange.contents.match(/IMG_([0-9_]+)/);
                if (!match) continue;

                var imgID = match[1];
                var targetImageInStorage = null;
                var storageItems = storageEnv.frame.allPageItems;
                for (var j = storageItems.length - 1; j >= 0; j--) {
                    if (storageItems[j].label === "TMP_IMG_" + imgID) {
                        targetImageInStorage = storageItems[j];
                        break;
                    }
                }
                if (targetImageInStorage === null) continue;

                try {
                    var targetChar = targetImageInStorage.parent;
                    while (targetChar && targetChar.constructor.name !== "Character" && targetChar.constructor.name !== "Story" && targetChar.constructor.name !== "Application") targetChar = targetChar.parent;
                    if (targetChar && targetChar.constructor.name === "Character") {
                        restoredOne = restoreInlineMarkerRange(placeholderRange, function(targetInsertionPoint) {
                            targetChar.move(LocationOptions.AFTER, targetInsertionPoint);
                        });
                        break;
                    } else if (targetImageInStorage.parent && targetImageInStorage.parent.isValid) {
                        restoredOne = restoreInlineMarkerRange(placeholderRange, function(targetInsertionPoint) {
                            targetImageInStorage.parent.move(LocationOptions.AFTER, targetInsertionPoint);
                        });
                        break;
                    }
                } catch (e5) {}
            }

            if (!restoredOne) break;
            restorePasses++;
        }
    } catch (restoreErr) {
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (e6) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (e7) {}
        try { if (storageEnv.frame && storageEnv.frame.isValid) storageEnv.frame.remove(); } catch (e8) {}
        try { doc.layers.itemByName("TEMP_TRANS_IMAGES").visible = false; } catch (e9) {}
    }
}

// --- 6. KERN-ÜBERSETZUNGS-LOGIK MIT TM, WÖRTERBUCH & AUTO-FIT ---
function executeTranslation(doc, textTargetsRaw, pagesMode, pagesString, selectedLang, overStartPct, overEndPct) {
    var storageEnv = setupTempImageStorage(doc);
    var textTargets = [];
    var storyIds = {};
    var inDesignLangCode = String(selectedLang || "").toUpperCase(); 

    var tm = loadTM();
    if (!tm[selectedLang]) tm[selectedLang] = {};
    
    var glossaryRuntime = null;
    var glossaryMap = {};
    var glossaryRegex = null;
    var parsedGlossary = loadCSVGlossary(csvPath);

    if (parsedGlossary) {
        glossaryRuntime = buildGlossaryRuntime(parsedGlossary, selectedLang);
        glossaryMap = glossaryRuntime.map;
        glossaryRegex = glossaryRuntime.regex;
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
    var markerRunToken = String(new Date().getTime()) + "_" + String(Math.floor(Math.random() * 1000000));

    try {
        for (var i = 0; i < textTargets.length; i++) {
            if (cancelFlag) throw new Error("CANCELLED");
            var currentText = textTargets[i];
            if (!currentText.isValid || currentText.characters.length === 0) continue;
            
            if (currentText.tables && currentText.tables.length > 0) {
                var tables = currentText.tables.everyItem().getElements();
                for (var tableReverseIndex = tables.length - 1; tableReverseIndex >= 0; tableReverseIndex--) {
                    var tbl = tables[tableReverseIndex]; var tblId = ++tableCounter; 
                    var tblKey = buildTranslationMarkerKey(markerRunToken, tblId);
                    var marker = buildTranslationMarker("TBL", tblKey);
                    var tmpFrame = storageEnv.page.textFrames.add({itemLayer: storageEnv.layer, geometricBounds: [0,-100, 50, -50]});
                    
                    var p = tbl.storyOffset.parent; var idx = tbl.storyOffset.index;
                    var tableAnchorChar = p.characters.item(idx);
                    tableAnchorChar.move(LocationOptions.AFTER, tmpFrame.insertionPoints.item(0));
                    globalParkedTables.push({ id: tblKey, marker: marker, frame: tmpFrame, hostText: currentText, anchorChar: tableAnchorChar });
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
                    var imgKey = buildTranslationMarkerKey(markerRunToken, imgID);
                    var marker = buildTranslationMarker("IMG", imgKey);
                    
                    if (anchorChar.pageItems.length > 0) anchorChar.pageItems[0].label = "TMP_IMG_" + imgKey;
                    else if (anchorChar.allPageItems.length > 0) anchorChar.allPageItems[0].label = "TMP_IMG_" + imgKey;
                    
                    var p = anchorChar.parent; var idx = anchorChar.index;
                    anchorChar.move(LocationOptions.AFTER, storageEnv.frame.insertionPoints.item(-1));
                    p.insertionPoints.item(idx).contents = marker;

                    try {
                        var sItems = storageEnv.frame.allPageItems; var movedItem = null;
                        for(var j = sItems.length - 1; j >= 0; j--){ if(sItems[j].label === "TMP_IMG_" + imgKey) { movedItem = sItems[j]; break; } }
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
            var fFamily = "Arial"; try { fFamily = String(ranges[r].appliedFont.fontFamily); } catch(e) {}
            var fStyle = "Regular"; try { fStyle = String(ranges[r].fontStyle); } catch(e) {}
            var pSize = "12"; try { pSize = String(ranges[r].pointSize); } catch(e) {}
            var pStyleNameRaw = ""; try { pStyleNameRaw = String(ranges[r].appliedParagraphStyle.name); } catch(e) {}
            var ldingStr = "AUTO"; try { if (ranges[r].leading !== Leading.AUTO) ldingStr = String(ranges[r].leading); } catch(e) {}
            var fColor = ""; try { fColor = String(ranges[r].fillColor.name); } catch(e) {}
            var cStyleRaw = ""; try { cStyleRaw = String(ranges[r].appliedCharacterStyle.name); } catch(e) {}
            var pAlign = ""; try { pAlign = String(ranges[r].justification); } catch(e) {}
            var lInd = "0"; try { lInd = String(ranges[r].leftIndent); } catch(e) {}
            var fInd = "0"; try { fInd = String(ranges[r].firstLineIndent); } catch(e) {}
            var bList = ""; try { bList = String(ranges[r].bulletsAndNumberingListType); } catch(e) {}
            
            chunk = chunk.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
            chunk = chunk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            var dntArr = dntStyles.split(",");
            var isDNT = false;
            for (var d=0; d<dntArr.length; d++) {
                var trimDNT = dntArr[d].replace(/^\s+|\s+$/g, '');
                if (trimDNT !== "" && (trimDNT === pStyleNameRaw || trimDNT === cStyleRaw)) { isDNT = true; break; }
            }
            
            if (isDNT) {
                chunk = '<nt>' + chunk + '</nt>';
            } else {
                if (glossaryRegex) chunk = applyGlossaryRuntimeToChunk(chunk, { map: glossaryMap, regex: glossaryRegex });
                chunk = protectChunkNonTranslatables(chunk);
            }

            chunk = chunk.replace(/\r/g, '<pbr/>').replace(/\n/g, '<lbr/>').replace(/\t/g, '<tab/>');
            if (chunk !== "") {
                xmlString += '<t f="' + escapeXMLAttr(fFamily) + '" s="' + escapeXMLAttr(fStyle) + '" z="' + escapeXMLAttr(pSize) + '" p="' + escapeXMLAttr(pStyleNameRaw) + '" l="' + escapeXMLAttr(ldingStr) + '" c="' + escapeXMLAttr(fColor) + '" k="' + escapeXMLAttr(cStyleRaw) + '" a="' + escapeXMLAttr(pAlign) + '" li="' + escapeXMLAttr(lInd) + '" fi="' + escapeXMLAttr(fInd) + '" b="' + escapeXMLAttr(bList) + '">' + chunk + '</t>';
            }
        }
        return xmlString + "</root>";
    };

        var deepLQueue = [];
        var finalTranslations = new Array(textTargets.length);

        for (var i = 0; i < textTargets.length; i++) {
            if (!textTargets[i].isValid || textTargets[i].characters.length === 0) { finalTranslations[i] = ""; continue; }

            var sourceContents = "";
            try { sourceContents = String(textTargets[i].contents); } catch (e0) { sourceContents = ""; }
            var glossaryMatchInText = glossaryAffectsText(sourceContents, glossaryRuntime);
            var exactGlossaryOverride = getExactGlossaryOverrideForText(parsedGlossary, sourceContents, selectedLang);
            if (exactGlossaryOverride !== null) {
                var exactReplacement = (exactGlossaryOverride === "###DNT###") ? sourceContents : exactGlossaryOverride;
                finalTranslations[i] = buildStyledPlainTextXML(textTargets[i], exactReplacement);
                globalStats.savedChars += normalizeGlossaryLookupText(sourceContents).replace(/[\s\d.,:;"'!?\-+*\/=()[\]{}&%$§<>|\\~`]/g, '').length;
                continue;
            }
            
            var xml = buildXMLWithGlossary(textTargets[i]);
            var textOnlyLength = xml.replace(/<[^>]+>/g, '').replace(/###(?:IMG|TBL)_[0-9_]+###/g, '').replace(/[\s\d.,:;"'!?\-+*\/=()[\]{}&%$§<>|\\~`]/g, '').length; 
            
            if (xml === "<root></root>" || xml === "" || textOnlyLength === 0) { 
                finalTranslations[i] = ""; 
            } else if (!glossaryMatchInText && tm[selectedLang][xml]) {
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
            if (!translatedBatch || translatedBatch.length !== deepLQueue.length) {
                throw new Error(t("deepl_incomplete"));
            }

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
        
        var formatPct = overStartPct + ((overEndPct - overStartPct) * 0.9);
        updateProgress(90, t("applying_formatting"), formatPct, null);
        for (var i = 0; i < textTargets.length; i++) {
            if (cancelFlag) throw new Error("CANCELLED");
            if (finalTranslations[i]) applyXMLtoInDesign(textTargets[i], finalTranslations[i], inDesignLangCode);
        }

        updateProgress(95, t("restoring_tables_images"), overEndPct, null);
    } finally {
        restoreParkedTablesAndImages(doc, storageEnv, globalParkedTables, textTargets);
    }

    updateProgress(98, t("checking_overflow"), overEndPct, null);
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
function extractDeepLFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.message) msg = parsedObj.message;
        else if (parsedObj && parsedObj.detail) msg = parsedObj.detail;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("deepl_unknown_response");
    return msg;
}

function translateBatchDeepL(textsArray, targetLangCode, overStartPct, overEndPct) {
    var endpoint = (apiKey.indexOf(":fx") !== -1) ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
    var translated = []; var batchSize = 25; 
    for (var b = 0; b < textsArray.length; b += batchSize) {
        if (cancelFlag) throw new Error("CANCELLED");
        
        var batchPct = (b / textsArray.length);
        var currentTaskPct = 20 + Math.round(batchPct * 60);
        
        var currentOverPct = overStartPct ? (overStartPct + (batchPct * (overEndPct - overStartPct) * 0.8)) : null;
        
        var endBatch = Math.min(b + batchSize, textsArray.length);
        updateProgress(currentTaskPct, t("deepl_request_blocks", { start: (b + 1), end: endBatch, total: textsArray.length }), currentOverPct, null);
        
        var payloadStr = "target_lang=" + targetLangCode + "&tag_handling=xml&ignore_tags=tab,nt&splitting_tags=pbr,lbr";
        if (formalitySetting === "more" || formalitySetting === "less") {
            payloadStr += "&formality=" + formalitySetting;
        }
        for (var j = b; j < endBatch; j++) {
            var safeText = textsArray[j];
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
            
            var parsedObj = null;
            try {
                parsedObj = eval("(" + resultJSON + ")");
            } catch (parseError) {
                throw new Error(t("deepl_parse_error"));
            }
            if (!parsedObj || !parsedObj.translations) {
                throw new Error(t("deepl_error_prefix", { message: extractDeepLFailureMessage(resultJSON, parsedObj) }));
            }
            if (parsedObj.translations.length !== (endBatch - b)) {
                throw new Error(t("deepl_incomplete"));
            }
            for (var k = 0; k < parsedObj.translations.length; k++) {
                translated.push(normalizeTranslatedXML(parsedObj.translations[k].text));
            }
        } catch (e) {
            if (e.message === "CANCELLED") throw e;
            throw new Error(e.message && e.message.indexOf("DeepL") === 0 ? e.message : t("deepl_connection_error", { message: (e.message || "Request failed.") }));
        }
        finally { try { payloadFile.remove(); } catch(e){} }
    }
    return translated;
}

function translateBatchDeepLPlain(textsArray, targetLangCode, overStartPct, overEndPct) {
    var endpoint = (apiKey.indexOf(":fx") !== -1) ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
    var translated = []; var batchSize = 25;
    for (var b = 0; b < textsArray.length; b += batchSize) {
        if (cancelFlag) throw new Error("CANCELLED");
        var batchPct = (b / textsArray.length);
        var currentTaskPct = 20 + Math.round(batchPct * 60);
        var currentOverPct = overStartPct ? (overStartPct + (batchPct * (overEndPct - overStartPct) * 0.8)) : null;
        var endBatch = Math.min(b + batchSize, textsArray.length);
        updateProgress(currentTaskPct, t("deepl_request_text_blocks", { start: (b + 1), end: endBatch, total: textsArray.length }), currentOverPct, null);
        var payloadStr = "target_lang=" + targetLangCode;
        if (formalitySetting === "more" || formalitySetting === "less") {
            payloadStr += "&formality=" + formalitySetting;
        }
        for (var j = b; j < endBatch; j++) {
            var safeText = textsArray[j];
            if (safeText === null || safeText === undefined) safeText = "";
            safeText = String(safeText).replace(/'/g, "'\\''");
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
                throw new Error(t("deepl_windows_plain_not_implemented"));
            }
            var parsedObj = null;
            try {
                parsedObj = eval("(" + resultJSON + ")");
            } catch (parseError) {
                throw new Error(t("deepl_parse_error"));
            }
            if (!parsedObj || !parsedObj.translations) {
                throw new Error(t("deepl_error_prefix", { message: extractDeepLFailureMessage(resultJSON, parsedObj) }));
            }
            if (parsedObj.translations.length !== (endBatch - b)) {
                throw new Error(t("deepl_incomplete"));
            }
            for (var k = 0; k < parsedObj.translations.length; k++) translated.push(parsedObj.translations[k].text);
        } catch (e) {
            if (e.message === "CANCELLED") throw e;
            throw new Error(e.message && e.message.indexOf("DeepL") === 0 ? e.message : t("deepl_connection_error", { message: (e.message || "Request failed.") }));
        }
        finally { try { payloadFile.remove(); } catch(e){} }
    }
    return translated;
}

function normalizeTranslatedXML(xml) {
    if (!xml || xml === "") return xml;
    return String(xml).replace(/^\s+|\s+$/g, '')
                      .replace(/>\s+</g, '><');
}

function normalizeTechnicalTokenSpacingInString(text) {
    if (text === null || text === undefined || text === "") return text;
    return String(text).replace(/([a-z\u00DF-\u00F6\u00F8-\u00FF])((?:[A-Z]+[0-9]+[A-Z0-9]*|[0-9]+[A-Z]+[A-Z0-9]*)(?:[\*xX\/-][0-9]+[A-Z0-9]*)+)/g, "$1 $2");
}

function normalizeTechnicalTokenSpacing(textScope) {
    if (!textScope || !textScope.isValid) return false;
    var changed = false;
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;

        app.findGrepPreferences.findWhat = "([\\l])((?:[A-Z]+\\d+[A-Z0-9]*|\\d+[A-Z]+[A-Z0-9]*)(?:[\\*xX/\\-]\\d+[A-Z0-9]*)+)";
        app.changeGrepPreferences.changeTo = "$1 $2";
        changed = !!(textScope.changeGrep() || []).length || changed;
    } catch (e) {
        return changed;
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (e2) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (e3) {}
    }
    return changed;
}

function normalizePostTranslationSpacing(textScope, symbols) {
    var changed = false;
    changed = normalizeTechnicalTokenSpacing(textScope) || changed;
    changed = normalizeReferenceSpacing(textScope, symbols) || changed;
    return changed;
}

function normalizeReferenceSpacing(textScope, symbols) {
    if (!textScope || !textScope.isValid) return false;
    var changed = false;
    var referenceTextCharPattern = "([\\u\\l\\d])";
    var referenceMarkerPattern = buildReferenceMarkerPattern(symbols || refSymbolsSetting);
    var inlineWhitespacePattern = "[ \\t]";
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;

        app.findGrepPreferences.findWhat = referenceTextCharPattern + inlineWhitespacePattern + "*" + referenceMarkerPattern;
        app.changeGrepPreferences.changeTo = "$1 $2";
        changed = !!(textScope.changeGrep() || []).length || changed;

        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = referenceMarkerPattern + inlineWhitespacePattern + "+([\\.,;:!\\?])";
        app.changeGrepPreferences.changeTo = "$1$2";
        changed = !!(textScope.changeGrep() || []).length || changed;

        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = referenceMarkerPattern + inlineWhitespacePattern + "*" + referenceTextCharPattern;
        app.changeGrepPreferences.changeTo = "$1 $2";
        changed = !!(textScope.changeGrep() || []).length || changed;
    } catch (e) {
        return changed;
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (e2) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (e3) {}
    }
    return changed;
}

function getStoryRangeSignature(textObj) {
    if (!textObj || !textObj.isValid) return null;
    var story = null;
    try { story = textObj.parentStory; } catch (e) { story = null; }
    if (!story || !story.isValid) return null;
    try {
        return {
            storyId: story.id,
            start: textObj.insertionPoints[0].index,
            end: textObj.insertionPoints[textObj.insertionPoints.length - 1].index
        };
    } catch (e2) {
        return null;
    }
}

function isSameStoryRange(a, b) {
    if (!a || !b) return false;
    return a.storyId === b.storyId && a.start === b.start && a.end === b.end;
}

function sanitizeHyperlinkName(value) {
    var safe = String(value || "").replace(/[^A-Za-z0-9]+/g, "_");
    if (safe.length > 40) safe = safe.substring(0, 40);
    if (safe === "") safe = "LINK";
    return safe;
}

function resolvePageBySetting(doc, pageSetting) {
    var raw = String(pageSetting || "").replace(/^\s+|\s+$/g, "");
    if (raw === "") return null;

    try {
        var namedPage = doc.pages.itemByName(raw);
        if (namedPage && namedPage.isValid) return namedPage;
    } catch (e) {}

    if (/^\d+$/.test(raw)) {
        var pageIndex = parseInt(raw, 10) - 1;
        if (pageIndex >= 0 && pageIndex < doc.pages.length) {
            try {
                var indexedPage = doc.pages[pageIndex];
                if (indexedPage && indexedPage.isValid) return indexedPage;
            } catch (e2) {}
        }
    }

    return null;
}

function getOrCreatePageDestination(doc, targetPage, languageCode, pageSetting) {
    var destinationName = "STP_REF_PAGE_" + languageCode + "_" + sanitizeHyperlinkName(pageSetting);
    var destination = null;
    try {
        destination = doc.hyperlinkPageDestinations.itemByName(destinationName);
        if (destination && !destination.isValid) destination = null;
    } catch (e) { destination = null; }

    if (!destination || !destination.isValid) {
        destination = doc.hyperlinkPageDestinations.add(targetPage);
        try { destination.name = destinationName; } catch (nameErr) {}
    }

    try {
        if (typeof HyperlinkDestinationPageSetting !== "undefined") {
            destination.viewSetting = HyperlinkDestinationPageSetting.FIT_WINDOW;
        }
    } catch (viewErr) {}

    return destination;
}

function normalizeURLDestination(urlText) {
    var url = String(urlText || "").replace(/^\s+|\s+$/g, "");
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    return url;
}

function buildStoryRangeKey(rangeSignature) {
    if (!rangeSignature) return "";
    return String(rangeSignature.storyId) + ":" + String(rangeSignature.start) + ":" + String(rangeSignature.end);
}

function getTextObjectRangeKey(textObj) {
    return buildStoryRangeKey(getStoryRangeSignature(textObj));
}

function buildExistingHyperlinkSourceMap(doc) {
    var map = {};
    try {
        var hyperlinks = doc.hyperlinks.everyItem().getElements();
        for (var i = 0; i < hyperlinks.length; i++) {
            var hyperlink = hyperlinks[i];
            if (!hyperlink || !hyperlink.isValid || !hyperlink.source || !hyperlink.source.isValid) continue;
            if (hyperlink.source.constructor.name !== "HyperlinkTextSource") continue;
            var sourceText = null;
            try { sourceText = hyperlink.source.sourceText; } catch (e) { sourceText = null; }
            var key = getTextObjectRangeKey(sourceText);
            if (key !== "") map[key] = hyperlink;
        }
    } catch (e2) {}
    return map;
}

function isManagedReferenceHyperlink(hyperlink) {
    if (!hyperlink || !hyperlink.isValid) return false;
    var name = "";
    try { name = String(hyperlink.name || ""); } catch (e) { name = ""; }
    return name.indexOf("STP_REF_LINK_") === 0;
}

function isManagedUrlHyperlink(hyperlink) {
    if (!hyperlink || !hyperlink.isValid) return false;
    var name = "";
    try { name = String(hyperlink.name || ""); } catch (e) { name = ""; }
    return name.indexOf("STP_URL_LINK_") === 0;
}

function isManagedTOCHyperlink(hyperlink) {
    if (!hyperlink || !hyperlink.isValid) return false;
    var name = "";
    try { name = String(hyperlink.name || ""); } catch (e) { name = ""; }
    return name.indexOf("STP_TOC_LINK_") === 0;
}

function removeManagedHyperlink(hyperlink) {
    if (!hyperlink || !hyperlink.isValid) return;
    var source = null;
    try { source = hyperlink.source; } catch (e) { source = null; }
    try { hyperlink.remove(); } catch (e2) {}
    try { if (source && source.isValid) source.remove(); } catch (e3) {}
}

function getHyperlinkTextObjectFromItemEntry(itemEntry) {
    if (!itemEntry || !itemEntry.obj || !itemEntry.obj.isValid) return null;
    try {
        if (itemEntry.obj.texts && itemEntry.obj.texts.length > 0 && itemEntry.obj.texts[0].isValid) {
            return itemEntry.obj.texts[0];
        }
    } catch (e) {}
    if (itemEntry.type === "frame") return getTextFrameStory(itemEntry.obj);
    return null;
}

function createOrUpdateTOCLanguageHyperlink(doc, targetItem, langCode, pageSetting) {
    if (!doc || !doc.isValid || !targetItem) return false;
    var targetText = getHyperlinkTextObjectFromItemEntry(targetItem);
    if (!targetText || !targetText.isValid) return false;

    var targetPage = resolvePageBySetting(doc, pageSetting);
    if (!targetPage || !targetPage.isValid) return false;

    var destination = getOrCreatePageDestination(doc, targetPage, langCode, pageSetting);
    if (!destination || !destination.isValid) return false;

    var sourceKey = getTextObjectRangeKey(targetText);
    if (sourceKey === "") return false;

    var existingHyperlinksBySource = buildExistingHyperlinkSourceMap(doc);
    var existingHyperlink = existingHyperlinksBySource[sourceKey];
    if (existingHyperlink && existingHyperlink.isValid) {
        if (!isManagedTOCHyperlink(existingHyperlink)) return false;
        try {
            existingHyperlink.destination = destination;
            try { existingHyperlink.name = "STP_TOC_LINK_" + String(langCode || "").toUpperCase(); } catch (renameErr) {}
            return true;
        } catch (updateErr) {
            return false;
        }
    }

    try {
        var source = doc.hyperlinkTextSources.add(targetText);
        var hyperlink = doc.hyperlinks.add(source, destination);
        try { hyperlink.name = "STP_TOC_LINK_" + String(langCode || "").toUpperCase(); } catch (nameErr) {}
        return true;
    } catch (createErr) {
        return false;
    }
}

function buildURLDestinationCache(doc) {
    var cache = {};
    try {
        var destinations = doc.hyperlinkURLDestinations.everyItem().getElements();
        for (var i = 0; i < destinations.length; i++) {
            var destination = destinations[i];
            if (!destination || !destination.isValid) continue;
            try {
                cache[String(destination.destinationURL)] = destination;
            } catch (e) {}
        }
    } catch (e2) {}
    return cache;
}

function getOrCreateURLDestination(doc, urlText, destinationCache) {
    var normalizedUrl = normalizeURLDestination(urlText);
    if (destinationCache && destinationCache[normalizedUrl] && destinationCache[normalizedUrl].isValid) return destinationCache[normalizedUrl];

    var newDestination = doc.hyperlinkURLDestinations.add(normalizedUrl);
    try { newDestination.name = "STP_URL_DEST_" + sanitizeHyperlinkName(normalizedUrl); } catch (nameErr) {}
    if (destinationCache) destinationCache[normalizedUrl] = newDestination;
    return newDestination;
}

function collectUrlMatchesForStory(story) {
    var matches = [];
    if (!story || !story.isValid) return matches;
    var contents = "";
    try { contents = String(story.contents); } catch (e) { contents = ""; }
    if (contents === "") return matches;

    var urlRegex = /(?:https?:\/\/|www\.)?(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}(?:\/[A-Za-z0-9\-._~:\/?#@!$&'*+,=%]*)?/g;
    var match;
    while ((match = urlRegex.exec(contents)) !== null) {
        var start = match.index;
        var end = start + match[0].length - 1;
        var beforeChar = start > 0 ? contents.charAt(start - 1) : "";
        var afterChar = end + 1 < contents.length ? contents.charAt(end + 1) : "";

        if (beforeChar && /[A-Za-z0-9@]/.test(beforeChar)) continue;
        if (afterChar && /[A-Za-z0-9]/.test(afterChar)) continue;

        matches.push({ start: start, end: end, text: match[0] });
    }
    return matches;
}

function linkDocumentUrls(doc, existingHyperlinksBySource, destinationCache) {
    var linksCreated = 0;
    var skipped = 0;
    var found = 0;
    var stories = [];
    try { stories = doc.stories.everyItem().getElements(); } catch (e) { stories = []; }

    for (var i = 0; i < stories.length; i++) {
        var story = stories[i];
        var storyMatches = collectUrlMatchesForStory(story);
        for (var j = 0; j < storyMatches.length; j++) {
            var urlMatch = storyMatches[j];
            found++;
            try {
                var urlText = story.characters.itemByRange(urlMatch.start, urlMatch.end);
                if (!urlText || !urlText.isValid) {
                    skipped++;
                    continue;
                }
                var sourceKey = getTextObjectRangeKey(urlText);
                var existingHyperlink = sourceKey !== "" ? existingHyperlinksBySource[sourceKey] : null;
                if (existingHyperlink && existingHyperlink.isValid) {
                    if (isManagedUrlHyperlink(existingHyperlink)) {
                        skipped++;
                        continue;
                    }
                    skipped++;
                    continue;
                }

                var source = doc.hyperlinkTextSources.add(urlText);
                var destination = getOrCreateURLDestination(doc, urlMatch.text, destinationCache);
                var hyperlink = doc.hyperlinks.add(source, destination);
                try { hyperlink.name = "STP_URL_LINK_" + i + "_" + j; } catch (nameErr) {}
                if (sourceKey !== "") existingHyperlinksBySource[sourceKey] = hyperlink;
                linksCreated++;
            } catch (linkErr) {
                skipped++;
            }
        }
    }

    return { links: linksCreated, skipped: skipped, found: found };
}

function getReferencePageDestinationForLanguage(doc, langCode, pageMappings, destinationCache) {
    if (destinationCache.hasOwnProperty(langCode)) return destinationCache[langCode];
    var pageValue = pageMappings[langCode];
    if (!pageValue) {
        destinationCache[langCode] = null;
        return null;
    }
    var targetPage = resolvePageBySetting(doc, pageValue);
    if (!targetPage || !targetPage.isValid) throw new Error(t("link_invalid_page", { language: langCode, page: pageValue }));
    destinationCache[langCode] = getOrCreatePageDestination(doc, targetPage, langCode, pageValue);
    return destinationCache[langCode];
}

function linkPackageReferences(doc, symbols, pageMappings, options) {
    if (!doc || !doc.isValid) throw new Error(t("no_document_open"));

    var mappings = getRuntimeHyperlinkPageMappings(doc, pageMappings);
    var normalizedSymbols = normalizeRefSymbols(symbols || refSymbolsSetting);
    var throwOnNoMatches = true;
    if (options && options.hasOwnProperty("throwOnNoMatches")) throwOnNoMatches = !!options.throwOnNoMatches;
    var existingHyperlinksBySource = buildExistingHyperlinkSourceMap(doc);
    var pageDestinationCache = {};
    var urlDestinationCache = buildURLDestinationCache(doc);
    var matchedReferences = [];
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
        app.findGrepPreferences.findWhat = buildReferenceMarkerPattern(normalizedSymbols);
        matchedReferences = doc.findGrep() || [];
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (prefErr1) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (prefErr2) {}
    }

    var linksCreated = 0;
    var skipped = 0;
    for (var i = 0; i < matchedReferences.length; i++) {
        var refText = matchedReferences[i];
        if (!refText || !refText.isValid) {
            skipped++;
            continue;
        }
        var sourceKey = getTextObjectRangeKey(refText);
        if (sourceKey === "") {
            skipped++;
            continue;
        }
        var existingHyperlink = existingHyperlinksBySource[sourceKey];
        var parentPage = getTextObjectParentPage(refText);
        var langCode = getPageLanguageCode(parentPage);
        if (!langCode) {
            if (existingHyperlink && existingHyperlink.isValid && isManagedReferenceHyperlink(existingHyperlink)) {
                removeManagedHyperlink(existingHyperlink);
                delete existingHyperlinksBySource[sourceKey];
            }
            skipped++;
            continue;
        }
        var pageDestination = getReferencePageDestinationForLanguage(doc, langCode, mappings, pageDestinationCache);
        if (!pageDestination || !pageDestination.isValid) {
            if (existingHyperlink && existingHyperlink.isValid && isManagedReferenceHyperlink(existingHyperlink)) {
                removeManagedHyperlink(existingHyperlink);
                delete existingHyperlinksBySource[sourceKey];
            }
            skipped++;
            continue;
        }
        if (existingHyperlink && existingHyperlink.isValid) {
            if (isManagedReferenceHyperlink(existingHyperlink)) {
                try {
                    existingHyperlink.destination = pageDestination;
                    try { existingHyperlink.name = "STP_REF_LINK_" + langCode + "_" + i; } catch (renameErr) {}
                    linksCreated++;
                    continue;
                } catch (updateErr) {
                    skipped++;
                    continue;
                }
            }
            skipped++;
            continue;
        }
        try {
            var source = doc.hyperlinkTextSources.add(refText);
            var hyperlink = doc.hyperlinks.add(source, pageDestination);
            try { hyperlink.name = "STP_REF_LINK_" + langCode + "_" + i; } catch (nameErr) {}
            existingHyperlinksBySource[sourceKey] = hyperlink;
            linksCreated++;
        } catch (linkErr) {
            skipped++;
        }
    }

    var urlResult = linkDocumentUrls(doc, existingHyperlinksBySource, urlDestinationCache);
    if (matchedReferences.length === 0 && urlResult.found === 0) {
        if (throwOnNoMatches) throw new Error(t("link_no_matches"));
        return {
            symbols: normalizedSymbols,
            links: 0,
            urlLinks: 0,
            skipped: 0,
            mappingSummary: formatHyperlinkPageMappings(mappings),
            noMatches: true
        };
    }

    return {
        symbols: normalizedSymbols,
        links: linksCreated,
        urlLinks: urlResult.links,
        skipped: skipped + urlResult.skipped,
        mappingSummary: formatHyperlinkPageMappings(mappings)
    };
}

function escapeDeepLXMLText(text) {
    if (text === null || text === undefined) return "";
    var result = String(text);
    result = result.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    result = result.replace(/\r\n/g, '<pbr/>').replace(/\r/g, '<pbr/>').replace(/\n/g, '<lbr/>').replace(/\t/g, '<tab/>');
    return result;
}

function decodeDeepLXMLText(xml) {
    if (!xml) return "";
    xml = xml.replace(/^<root>/, '').replace(/<\/root>$/, '');
    xml = xml.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    xml = xml.replace(/<pbr\/>/gi, '\r').replace(/<lbr\/>/gi, '\n').replace(/<tab\/>/gi, '\t');
    return normalizeTechnicalTokenSpacingInString(xml);
}

function escapeXMLAttr(value) {
    if (value === null || value === undefined) return "";
    var escaped = String(value);
    escaped = escaped.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
                     .replace(/"/g, '&quot;')
                     .replace(/'/g, '&apos;');
    return escaped;
}

function decodeXMLValue(value) {
    if (value === null || value === undefined) return "";
    return String(value).replace(/&quot;/g, '"')
                        .replace(/&apos;/g, "'")
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&');
}

function decodeXMLAttr(value) {
    return decodeXMLValue(value);
}

function buildTextObjectXML(textObj) {
    var xmlString = "<root>";
    var ranges = textObj.textStyleRanges;
    for (var r = 0; r < ranges.length; r++) {
        var chunk = ranges[r].contents;
        var fFamily = "Arial"; try { fFamily = escapeXMLAttr(ranges[r].appliedFont.fontFamily); } catch(e) {}
        var fStyle = "Regular"; try { fStyle = escapeXMLAttr(ranges[r].fontStyle); } catch(e) {}
        var pSize = 12; try { pSize = ranges[r].pointSize; } catch(e) {}
        var pStyleName = ""; try { pStyleName = escapeXMLAttr(ranges[r].appliedParagraphStyle.name); } catch(e) {}
        var ldingStr = "AUTO"; try { if (ranges[r].leading !== Leading.AUTO) ldingStr = escapeXMLAttr(ranges[r].leading.toString()); } catch(e) {}
        var fColor = ""; try { fColor = escapeXMLAttr(ranges[r].fillColor.name); } catch(e) {}
        var cStyle = ""; try { cStyle = escapeXMLAttr(ranges[r].appliedCharacterStyle.name); } catch(e) {}
        var pAli = ""; try { pAli = escapeXMLAttr(ranges[r].justification.toString()); } catch(e) {}
        var lInd = "0"; try { lInd = escapeXMLAttr(ranges[r].leftIndent.toString()); } catch(e) {}
        var fInd = "0"; try { fInd = escapeXMLAttr(ranges[r].firstLineIndent.toString()); } catch(e) {}
        var bList = ""; try { bList = escapeXMLAttr(ranges[r].bulletsAndNumberingListType.toString()); } catch(e) {}

        chunk = chunk.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
        chunk = chunk.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        var dntArr = dntStyles.split(",");
        var isDNT = false;
        for (var d = 0; d < dntArr.length; d++) {
            var trimDNT = dntArr[d].replace(/^\s+|\s+$/g, '');
            if (trimDNT !== "" && (trimDNT === pStyleName || trimDNT === cStyle)) { isDNT = true; break; }
        }

        if (!isDNT) {
            var regexArt = getTechnicalTokenRegex();
            chunk = chunk.replace(regexArt, function(match, p1, offset, string) {
                var before = string.substring(0, offset);
                var openTags = (before.match(/<nt>/g) || []).length;
                var closeTags = (before.match(/<\/nt>/g) || []).length;
                if (openTags > closeTags) return match;
                if (offset >= 7 && (string.substring(offset - 7, offset) === "###TBL_" || string.substring(offset - 7, offset) === "###IMG_")) return match;
                return '<nt>' + match + '</nt>';
            });
        }

        chunk = chunk.replace(/###((?:TBL|IMG)_[0-9_]+)###/g, '<nt>###$1###</nt>');
        chunk = chunk.replace(/\r/g, '<pbr/>').replace(/\n/g, '<lbr/>').replace(/\t/g, '<tab/>');
        if (chunk !== "") {
            xmlString += '<t f="' + fFamily + '" s="' + fStyle + '" z="' + pSize + '" p="' + pStyleName + '" l="' + ldingStr + '" c="' + fColor + '" k="' + cStyle + '" a="' + pAli + '" li="' + lInd + '" fi="' + fInd + '" b="' + bList + '">' + chunk + '</t>';
        }
    }
    return xmlString + "</root>";
}

function applyXMLtoInDesign(targetTextObj, translatedXML, inDesignLangCode) {
    if (!translatedXML || translatedXML === "") return;
    // Preserve tabs/line breaks between consecutive placeholders so inline image rows keep their original layout.
    translatedXML = normalizeTranslatedXML(translatedXML);
    var isPartial = false; var textFlow = null; var currentIdx = 0;
    var normalizeStartIndex = 0;
    try {
        if (targetTextObj.constructor.name === "Story") { isPartial = false; textFlow = targetTextObj; } 
        else if (targetTextObj.parent && targetTextObj.parent.constructor.name === "Cell") {
            textFlow = targetTextObj.parent.texts[0]; isPartial = (targetTextObj.characters.length < textFlow.characters.length);
        } else { isPartial = true; textFlow = targetTextObj.parentStory; }
    } catch(e) { isPartial = false; textFlow = targetTextObj; }

    if (isPartial) {
        try { currentIdx = targetTextObj.insertionPoints.item(0).index; } catch(e){}
        normalizeStartIndex = currentIdx;
        try { targetTextObj.remove(); } catch(e){}
    }
    else { try { textFlow.contents = ""; } catch(e){} currentIdx = 0; }

    var regex = /<t([^>]*)>([\s\S]*?)<\/t>/gi; var match;
    while ((match = regex.exec(translatedXML)) !== null) {
        var attrs = match[1]; var textContent = match[2];
        var getAttr = function(str, name) { var m = new RegExp(name + '="([^"]*)"').exec(str); return m ? m[1] : ""; };
        var fFam = decodeXMLAttr(getAttr(attrs, "f")); var fSty = decodeXMLAttr(getAttr(attrs, "s")); var fSiz = parseFloat(decodeXMLAttr(getAttr(attrs, "z")));
        var pSty = decodeXMLAttr(getAttr(attrs, "p")); var lead = decodeXMLAttr(getAttr(attrs, "l")); var fCol = decodeXMLAttr(getAttr(attrs, "c"));
        var cSty = decodeXMLAttr(getAttr(attrs, "k")); var pAli = decodeXMLAttr(getAttr(attrs, "a")); var lInd = decodeXMLAttr(getAttr(attrs, "li"));
        var fInd = decodeXMLAttr(getAttr(attrs, "fi")); var bLis = decodeXMLAttr(getAttr(attrs, "b"));
        
        textContent = decodeXMLValue(textContent).replace(/<pbr\/>/gi, '\r').replace(/<lbr\/>/gi, '\n').replace(/<tab\/>/gi, '\t').replace(/<\/?nt[^>]*>/gi, '');
        textContent = normalizeTechnicalTokenSpacingInString(textContent);
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
                    if (inDesignLangCode !== "") {
                        var langObj = resolveInDesignLanguageObject(doc, inDesignLangCode);
                        if (langObj && langObj.isValid) appliedRange.appliedLanguage = langObj;
                    }
                } catch(e) {}
            }
        }
    }

    if (textFlow && textFlow.isValid) {
        try {
            if (isPartial) {
                var normalizeEndIndex = currentIdx - 1;
                if (normalizeEndIndex >= normalizeStartIndex) {
                    var scopeStartIndex = Math.max(0, normalizeStartIndex - 1);
                    var scopeEndIndex = Math.min(textFlow.characters.length - 1, normalizeEndIndex + 1);
                    var insertedRange = textFlow.characters.itemByRange(scopeStartIndex, scopeEndIndex);
                    normalizePostTranslationSpacing(insertedRange);
                }
            } else {
                normalizePostTranslationSpacing(textFlow);
            }
        } catch (e5) {}
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
