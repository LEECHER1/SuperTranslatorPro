#targetengine "SuperTranslatorPRO282"

// ==============================================
// SUPER ÜBERSETZER PRO - VERSION 28.2 (API-KEY ENTFERNT)
// ==============================================

// --- 0. EINSTELLUNGEN (API-KEY, CSV-PFAD & TM-PFAD) ---
var DEEPL_KEY_LABEL = "SuperTranslatorPRO_DeepL_API_Key";
var OPENAI_KEY_LABEL = "SuperTranslatorPRO_OpenAI_API_Key";
var OPENAI_MODEL_LABEL = "SuperTranslatorPRO_OpenAI_Model";
var GEMINI_KEY_LABEL = "SuperTranslatorPRO_Gemini_API_Key";
var GEMINI_MODEL_LABEL = "SuperTranslatorPRO_Gemini_Model";
var CLAUDE_KEY_LABEL = "SuperTranslatorPRO_Claude_API_Key";
var CLAUDE_MODEL_LABEL = "SuperTranslatorPRO_Claude_Model";
var LOCAL_LLM_BASE_URL_LABEL = "SuperTranslatorPRO_LocalLLM_BaseURL";
var LOCAL_LLM_API_KEY_LABEL = "SuperTranslatorPRO_LocalLLM_API_Key";
var LOCAL_LLM_MODEL_LABEL = "SuperTranslatorPRO_LocalLLM_Model";
var TRANSLATION_PROVIDER_LABEL = "SuperTranslatorPRO_TranslationProvider";
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
    settings_help: { de: "Einstellungen, Glossar, Memory und Provider", en: "Settings, glossary, memory, and provider" },
    manual_mode: { de: "Manueller Modus", en: "Manual mode" },
    mode_title: { de: "Modus", en: "Mode" },
    selection_mode: { de: "Aktuelle Auswahl im Dokument", en: "Current selection in document" },
    selection_settings: { de: "Auswahl übersetzen", en: "Translate selection" },
    selection_hint: { de: "Übersetzt die aktuell markierten Rahmen, Texte oder Tabellen.", en: "Translates the currently selected frames, texts, or tables." },
    pages_mode: { de: "Bestimmte Seiten", en: "Specific pages" },
    pages_settings: { de: "Seiten übersetzen", en: "Translate pages" },
    pages_label: { de: "Seiten:", en: "Pages:" },
    pages_help: { de: "Beispiel: 1, 3, 5-8", en: "Example: 1, 3, 5-8" },
    target_language_manual: { de: "Zielsprache:", en: "Target language:" },
    target_language_short: { de: "Zielsprache:", en: "Target language:" },
    lang_group_favorites: { de: "--- FAVORITEN ---", en: "--- FAVORITES ---" },
    lang_group_other_eu: { de: "--- SONSTIGE EU SPRACHEN ---", en: "--- OTHER EU LANGUAGES ---" },
    auto_mode: { de: "Vollautomatik (BDA)", en: "Full automatic (BDA)" },
    auto_settings: { de: "Automatik-Optionen", en: "Automatic options" },
    original_pages: { de: "Quellseiten:", en: "Source pages:" },
    auto_source_help: { de: "Übersetzt die Quellsprache automatisch in die ausgewählten Sprachen.", en: "Automatically translates the source language into the selected languages." },
    toc_checkbox: { de: "Inhaltsverzeichnis in Klammern aktualisieren", en: "Update table of contents in brackets" },
    auto_hyperlink_checkbox: { de: "Hyperlinks erstellen", en: "Create hyperlinks" },
    auto_hyperlink_symbols: { de: "Klammern/Symbole:", en: "Brackets/symbols:" },
    auto_hyperlink_help: { de: "Verwendet die Sprachcodes und Seitenzahlen von Seite 1, z. B. fr (33) und en (22).", en: "Uses the language codes and page numbers from page 1, for example fr (33) and en (22)." },
    back_page_tracker_label: { de: "Rückseiten-Suche:", en: "Back-page search:" },
    back_page_tracker_help: { de: "Text zur Erkennung der Rückseite. Standard: ©. Mehrere Begriffe mit |, ; oder Zeilenumbruch trennen. Wenn © mehrfach vorkommt, wird zusätzlich automatisch nach 'Steinbach International GmbH' gesucht.", en: "Text used to detect the back page. Default: ©. Separate multiple terms with |, ; or a line break. If © appears multiple times, 'Steinbach International GmbH' is checked automatically as an extra filter." },
    back_page_not_found_notice: { de: "Hinweis: Es konnte keine Rückseite sicher erkannt werden.\nDer Automatiklauf wird trotzdem fortgesetzt.\nWenn nötig, bitte die Rückseiten-Suche in den Einstellungen anpassen.", en: "Note: No back page could be identified with confidence.\nThe automatic run will continue anyway.\nIf needed, adjust the back-page search in the settings." },
    only_text_update: { de: "Nur Textänderungen übernehmen", en: "Only update changed text" },
    translate_start: { de: "Übersetzung starten", en: "Start Translation" },
    spellcheck_button: { de: "Quellsprache prüfen", en: "Check source language" },
    spellcheck_help: { de: "Prüft Texte auf Seiten der automatisch erkannten Quellsprache.", en: "Checks text on pages of the automatically detected source language." },
    close_button: { de: "Schließen", en: "Close" },
    status_title: { de: "Aktueller Status", en: "Current status" },
    status_provider: { de: "Provider:", en: "Provider:" },
    status_glossary: { de: "Glossar:", en: "Glossary:" },
    status_memory: { de: "Memory:", en: "Memory:" },
    status_links: { de: "Auto-Links:", en: "Auto links:" },
    status_symbols: { de: "Symbole:", en: "Symbols:" },
    status_not_set: { de: "nicht gesetzt", en: "not set" },
    status_on: { de: "an", en: "on" },
    status_off: { de: "aus", en: "off" },
    status_settings_required: { de: "Einstellungen prüfen", en: "check settings" },
    validation_title: { de: "Vor dem Start", en: "Before starting" },
    validation_ready: { de: "Alles ist bereit. Du kannst die Uebersetzung direkt starten.", en: "Everything is ready. You can start the translation now." },
    validation_needs_attention: { de: "Bitte zuerst pruefen:", en: "Please check first:" },
    selection_state_ready: { de: "Auswahl erkannt. Bereit zum Uebersetzen.", en: "Selection detected. Ready to translate." },
    pages_state_ready: { de: "Seitenangabe erkannt: {pages}", en: "Page input detected: {pages}" },
    language_state_ready: { de: "Zielsprache aktiv: {lang}", en: "Active target language: {lang}" },
    bda_state_ready: { de: "Quellseiten fuer Vollautomatik: {pages}", en: "Source pages for full automation: {pages}" },
    settings_provider_validation_ready: { de: "Provider-Konfiguration ist vollstaendig.", en: "Provider configuration is complete." },
    settings_overview_title: { de: "Übersicht", en: "Overview" },
    settings_tab_data_hint: { de: "Glossar, Memory und Übersetzungsoptionen gelten dokumentübergreifend.", en: "Glossary, memory, and translation options apply across documents." },
    settings_tab_provider_hint: { de: "Wähle den aktiven Übersetzungsanbieter und hinterlege die passenden Zugangsdaten.", en: "Choose the active translation provider and enter the relevant credentials." },
    settings_tab_auto_hint: { de: "Diese Optionen steuern die BDA-Vollautomatik und das automatische Verlinken.", en: "These options control BDA full automation and automatic hyperlinking." },
    settings_section_resources: { de: "Dateien", en: "Files" },
    settings_section_translation: { de: "Übersetzung", en: "Translation" },
    settings_section_provider_setup: { de: "Provider-Auswahl", en: "Provider selection" },
    settings_section_provider_credentials: { de: "Zugangsdaten", en: "Credentials" },
    settings_section_auto_options: { de: "Automatik", en: "Automation" },
    settings_provider_deepl_hint: { de: "DeepL ist der Standardanbieter. Für andere Provider kann der DeepL-Key als Fallback hinterlegt bleiben.", en: "DeepL is the default provider. For other providers, the DeepL key can remain as a fallback." },
    settings_provider_llm_hint: { de: "Für Cloud-LLMs werden API-Key und Modellname benötigt. Der DeepL-Key bleibt optional als Fallback erhalten.", en: "Cloud LLMs require an API key and model name. The DeepL key can remain as an optional fallback." },
    settings_provider_local_hint: { de: "Für lokale Modelle werden Base URL und Modellname benötigt. Ein API-Key ist nur optional.", en: "Local models require a base URL and model name. An API key is optional." },
    no_document_open: { de: "Kein Dokument offen!", en: "No document is open." },
    spellcheck_error: { de: "Fehler bei der Rechtschreibprüfung:\n{message}", en: "Spell-check error:\n{message}" },
    settings_title: { de: "⚙️ Einstellungen", en: "⚙️ Settings" },
    settings_tab_provider: { de: "Provider", en: "Provider" },
    settings_tab_data: { de: "Daten", en: "Data" },
    settings_tab_auto: { de: "Auto", en: "Auto" },
    log_file: { de: "📄 Logdatei", en: "📄 Log File" },
    debug_log_file: { de: "Debug-Log", en: "Debug Log" },
    debug_tables_images: { de: "Debug-Log für Tabellen/Bilder", en: "Debug log for tables/images" },
    debug_tables_images_help: { de: "Schreibt einen ausführlichen Diagnose-Log für das Parken und Wiederherstellen von Tabellen/Bildern.", en: "Writes a detailed diagnostic log for parking and restoring tables/images." },
    info: { de: "ℹ️ Info", en: "ℹ️ Info" },
    translation_provider: { de: "Übersetzungsanbieter:", en: "Translation provider:" },
    provider_deepl: { de: "DeepL (Standard)", en: "DeepL (default)" },
    provider_openai: { de: "ChatGPT / OpenAI", en: "ChatGPT / OpenAI" },
    provider_gemini: { de: "Google / Gemini", en: "Google / Gemini" },
    provider_claude: { de: "Anthropic / Claude", en: "Anthropic / Claude" },
    provider_local: { de: "Lokales LLM (LM Studio / Ollama)", en: "Local LLM (LM Studio / Ollama)" },
    deepl_api_key: { de: "DeepL Pro API-Key:", en: "DeepL Pro API key:" },
    deepl_fallback_api_key: { de: "DeepL Fallback API-Key (optional):", en: "DeepL fallback API key (optional):" },
    openai_api_key: { de: "OpenAI API-Key:", en: "OpenAI API key:" },
    openai_model: { de: "OpenAI Modell:", en: "OpenAI model:" },
    gemini_api_key: { de: "Gemini API-Key:", en: "Gemini API key:" },
    gemini_model: { de: "Gemini Modell:", en: "Gemini model:" },
    claude_api_key: { de: "Claude API-Key:", en: "Claude API key:" },
    claude_model: { de: "Claude Modell:", en: "Claude model:" },
    local_llm_base_url: { de: "Lokale Base URL:", en: "Local base URL:" },
    local_llm_api_key: { de: "Lokaler API-Key (optional):", en: "Local API key (optional):" },
    local_llm_model: { de: "Lokales Modell:", en: "Local model:" },
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
    formality_default: { de: "Standard", en: "Default" },
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
    no_debug_log_file: { de: "Es wurde noch keine Debug-Logdatei erstellt.", en: "No debug log file has been created yet." },
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
    hyperlink_dialog_hint: { de: "Die Seitenzuordnungen von Seite 1 werden vorbefüllt. Du kannst sie hier anpassen oder ergänzen, bevor die Verlinkung ausgeführt wird.", en: "Page mappings from page 1 are prefilled here. You can adjust or extend them before hyperlinking runs." },
    hyperlink_detected_title: { de: "Erkannt auf Seite 1", en: "Detected on page 1" },
    hyperlink_detected_none: { de: "Auf Seite 1 wurden noch keine Sprach-/Seitenzuordnungen erkannt.", en: "No language/page mappings were detected on page 1 yet." },
    hyperlink_reload_from_cover: { de: "Von Seite 1 neu laden", en: "Reload from page 1" },
    hyperlink_source_cover: { de: "Seite 1", en: "page 1" },
    hyperlink_source_manual: { de: "manuell", en: "manual" },
    hyperlink_source_override: { de: "manuell ueberschreibt", en: "manual override" },
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
    german_frame_dialog_title: { de: "Suchen/Ersetzen Quellsprache {current}/{total}", en: "Find/Replace Source Language {current}/{total}" },
    german_frame_hint_count: { de: "{count} konkrete Hinweis(e) in diesem Textrahmen", en: "{count} specific suggestion(s) in this text frame" },
    german_frame_action_hint: { de: "Nur echte Schreibtreffer werden angezeigt. Enter übernimmt den Vorschlag.", en: "Only actual spelling suggestions are shown. Press Enter to apply the suggestion." },
    german_findings: { de: "Auffälligkeiten:", en: "Findings:" },
    german_current_hit: { de: "Aktueller Treffer", en: "Current Match" },
    german_hint: { de: "Hinweis:", en: "Hint:" },
    german_keep: { de: "Behalten", en: "Keep" },
    german_apply: { de: "Übernehmen", en: "Apply" },
    german_finish: { de: "Beenden", en: "Finish" },
    german_replace_failed: { de: "Die Stelle konnte nicht übernommen werden:\n{location}", en: "This location could not be applied:\n{location}" },
    german_dialog_title: { de: "Quellsprache korrigieren {current}/{total}", en: "Correct Source Language {current}/{total}" },
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
    german_no_targets: { de: "Keine Texte auf automatisch erkannten Quellsprach-Seiten gefunden.", en: "No text was found on automatically detected source-language pages." },
    german_progress_title: { de: "Rechtschreibprüfung Quellsprache", en: "Source Language Spell Check" },
    german_prepare_check: { de: "Bereite Prüfung vor...", en: "Preparing check..." },
    german_check_progress: { de: "Prüfe Quellsprache {lang}: Text {current} von {total}...", en: "Checking source language {lang}: text {current} of {total}..." },
    german_check_ok: { de: "Korrekturprüfung für die erkannte Quellsprache ({lang}) abgeschlossen. Keine Änderungen vorgeschlagen.", en: "Correction check for the detected source language ({lang}) completed. No changes suggested." },
    german_check_notice_skipped: { de: "\n\nHinweis: {count} Textblöcke konnten nicht geprüft werden.", en: "\n\nNote: {count} text block(s) could not be checked." },
    german_check_notice_skipped_with_reason: { de: "\n\nHinweis: {count} Textblöcke konnten nicht geprüft werden.\nGrund: {reason}", en: "\n\nNote: {count} text block(s) could not be checked.\nReason: {reason}" },
    german_check_failed_all_skipped: { de: "Die Quellsprachen-Prüfung konnte nicht ausgeführt werden.\n\nAlle {count} Textblöcke wurden übersprungen.\nGrund: {reason}\n\nDie Funktion nutzt LanguageTool per externem Aufruf.", en: "The source-language check could not be completed.\n\nAll {count} text block(s) were skipped.\nReason: {reason}\n\nThis feature uses LanguageTool via an external call." },
    source_lang_not_detected: { de: "Die Quellsprache konnte nicht automatisch erkannt werden.", en: "The source language could not be detected automatically." },
    languagetool_lang_not_supported: { de: "Die Quellsprache {lang} wird für die Prüfung noch nicht unterstützt.", en: "The source language {lang} is not yet supported for checking." },
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
    validation_enter_api_key: { de: "Bitte trage zuerst den API-Key für den aktiven Übersetzungsanbieter in den Einstellungen (⚙️) ein.", en: "Please enter the API key for the active translation provider in the settings (⚙️) first." },
    validation_enter_deepl_key: { de: "Bitte trage zuerst deinen DeepL API-Key in den Einstellungen (⚙️) ein.", en: "Please enter your DeepL API key in the settings (⚙️) first." },
    validation_enter_openai_key: { de: "Bitte trage zuerst deinen OpenAI API-Key in den Einstellungen (⚙️) ein.", en: "Please enter your OpenAI API key in the settings (⚙️) first." },
    validation_enter_gemini_key: { de: "Bitte trage zuerst deinen Gemini API-Key in den Einstellungen (⚙️) ein.", en: "Please enter your Gemini API key in the settings (⚙️) first." },
    validation_enter_claude_key: { de: "Bitte trage zuerst deinen Claude API-Key in den Einstellungen (⚙️) ein.", en: "Please enter your Claude API key in the settings (⚙️) first." },
    validation_enter_local_llm_base_url: { de: "Bitte trage zuerst die lokale Base URL in den Einstellungen (⚙️) ein.", en: "Please enter the local base URL in the settings (⚙️) first." },
    validation_enter_local_llm_model: { de: "Bitte trage zuerst den lokalen Modellnamen in den Einstellungen (⚙️) ein.", en: "Please enter the local model name in the settings (⚙️) first." },
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
    openai_unknown_response: { de: "Unbekannte Antwort von OpenAI.", en: "Unknown response from OpenAI." },
    openai_request_blocks: { de: "OpenAI Anfrage: Sende Blöcke {start} bis {end} von {total}...", en: "OpenAI request: sending blocks {start} to {end} of {total}..." },
    openai_parse_error: { de: "OpenAI-Antwort konnte nicht gelesen werden.", en: "The OpenAI response could not be read." },
    openai_error_prefix: { de: "OpenAI-Fehler: {message}", en: "OpenAI error: {message}" },
    openai_incomplete: { de: "OpenAI lieferte unvollständige Ergebnisse zurück.", en: "OpenAI returned incomplete results." },
    openai_connection_error: { de: "OpenAI-Verbindungsfehler: {message}", en: "OpenAI connection error: {message}" },
    openai_refusal: { de: "OpenAI hat die Anfrage abgelehnt: {message}", en: "OpenAI refused the request: {message}" },
    openai_repair_block: { de: "OpenAI Reparatur: Korrigiere XML-Struktur für Block {index}...", en: "OpenAI repair: fixing XML structure for block {index}..." },
    openai_retry_block: { de: "OpenAI Retry: Übersetze Block {index} einzeln neu...", en: "OpenAI retry: retranslating block {index} individually..." },
    openai_fallback_deepl_block: { de: "Fallback: Übersetze Block {index} mit DeepL...", en: "Fallback: translating block {index} with DeepL..." },
    openai_invalid_xml: { de: "OpenAI lieferte für Block {index} ein ungültiges XML-/Tag-Ergebnis zurück.", en: "OpenAI returned an invalid XML/tag result for block {index}." },
    gemini_unknown_response: { de: "Unbekannte Antwort von Gemini.", en: "Unknown response from Gemini." },
    gemini_request_blocks: { de: "Gemini Anfrage: Sende Blöcke {start} bis {end} von {total}...", en: "Gemini request: sending blocks {start} to {end} of {total}..." },
    gemini_parse_error: { de: "Gemini-Antwort konnte nicht gelesen werden.", en: "The Gemini response could not be read." },
    gemini_error_prefix: { de: "Gemini-Fehler: {message}", en: "Gemini error: {message}" },
    gemini_incomplete: { de: "Gemini lieferte unvollständige Ergebnisse zurück.", en: "Gemini returned incomplete results." },
    gemini_connection_error: { de: "Gemini-Verbindungsfehler: {message}", en: "Gemini connection error: {message}" },
    gemini_refusal: { de: "Gemini hat die Anfrage blockiert: {message}", en: "Gemini blocked the request: {message}" },
    gemini_repair_block: { de: "Gemini Reparatur: Korrigiere XML-Struktur für Block {index}...", en: "Gemini repair: fixing XML structure for block {index}..." },
    gemini_retry_block: { de: "Gemini Retry: Übersetze Block {index} einzeln neu...", en: "Gemini retry: retranslating block {index} individually..." },
    gemini_fallback_deepl_block: { de: "Fallback: Übersetze Block {index} mit DeepL...", en: "Fallback: translating block {index} with DeepL..." },
    gemini_invalid_xml: { de: "Gemini lieferte für Block {index} ein ungültiges XML-/Tag-Ergebnis zurück.", en: "Gemini returned an invalid XML/tag result for block {index}." },
    claude_unknown_response: { de: "Unbekannte Antwort von Claude.", en: "Unknown response from Claude." },
    claude_request_blocks: { de: "Claude Anfrage: Sende Blöcke {start} bis {end} von {total}...", en: "Claude request: sending blocks {start} to {end} of {total}..." },
    claude_parse_error: { de: "Claude-Antwort konnte nicht gelesen werden.", en: "The Claude response could not be read." },
    claude_error_prefix: { de: "Claude-Fehler: {message}", en: "Claude error: {message}" },
    claude_incomplete: { de: "Claude lieferte unvollständige Ergebnisse zurück.", en: "Claude returned incomplete results." },
    claude_connection_error: { de: "Claude-Verbindungsfehler: {message}", en: "Claude connection error: {message}" },
    claude_refusal: { de: "Claude hat die Anfrage abgelehnt: {message}", en: "Claude refused the request: {message}" },
    claude_repair_block: { de: "Claude Reparatur: Korrigiere XML-Struktur für Block {index}...", en: "Claude repair: fixing XML structure for block {index}..." },
    claude_retry_block: { de: "Claude Retry: Übersetze Block {index} einzeln neu...", en: "Claude retry: retranslating block {index} individually..." },
    claude_fallback_deepl_block: { de: "Fallback: Übersetze Block {index} mit DeepL...", en: "Fallback: translating block {index} with DeepL..." },
    claude_invalid_xml: { de: "Claude lieferte für Block {index} ein ungültiges XML-/Tag-Ergebnis zurück.", en: "Claude returned an invalid XML/tag result for block {index}." },
    local_unknown_response: { de: "Unbekannte Antwort vom lokalen LLM.", en: "Unknown response from the local LLM." },
    local_request_blocks: { de: "Lokales LLM: Sende Blöcke {start} bis {end} von {total}...", en: "Local LLM: sending blocks {start} to {end} of {total}..." },
    local_parse_error: { de: "Die Antwort des lokalen LLM konnte nicht gelesen werden.", en: "The local LLM response could not be read." },
    local_error_prefix: { de: "Lokales LLM-Fehler: {message}", en: "Local LLM error: {message}" },
    local_incomplete: { de: "Das lokale LLM lieferte unvollständige Ergebnisse zurück.", en: "The local LLM returned incomplete results." },
    local_connection_error: { de: "Lokales LLM-Verbindungsfehler: {message}", en: "Local LLM connection error: {message}" },
    local_refusal: { de: "Das lokale LLM hat die Anfrage abgelehnt: {message}", en: "The local LLM refused the request: {message}" },
    local_repair_block: { de: "Lokales LLM Reparatur: Korrigiere XML-Struktur für Block {index}...", en: "Local LLM repair: fixing XML structure for block {index}..." },
    local_retry_block: { de: "Lokales LLM Retry: Übersetze Block {index} einzeln neu...", en: "Local LLM retry: retranslating block {index} individually..." },
    local_fallback_deepl_block: { de: "Fallback: Übersetze Block {index} mit DeepL...", en: "Fallback: translating block {index} with DeepL..." },
    local_invalid_xml: { de: "Das lokale LLM lieferte für Block {index} ein ungültiges XML-/Tag-Ergebnis zurück.", en: "The local LLM returned an invalid XML/tag result for block {index}." },
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
        infoText += "Ein professionelles Übersetzungstool für InDesign mit DeepL als Standard und optionalen Providern für OpenAI, Gemini, Claude und lokale OpenAI-kompatible Server.\n\n";
        infoText += "Kernfunktionen:\n";
        infoText += "• Nahtloser Erhalt von Textformatierungen, Tabellen und verankerten Bildern\n";
        infoText += "• Integriertes Translation Memory (JSON) zur API-Kostenersparnis\n";
        infoText += "• Netzwerk-Glossar (CSV) für den Schutz von Fachbegriffen\n";
        infoText += "• Formelle/Informelle Anrede & DNT-Format Ignorierung\n";
        infoText += "• Cross-Platform (macOS & Windows) API-Anbindung\n";
        infoText += "• Intelligente Auto-Fit Korrektur gegen Textrahmen-Übersatz";
    } else {
        infoText += "A professional translation tool for InDesign powered by DeepL by default with optional OpenAI, Gemini, Claude, and local OpenAI-compatible providers.\n\n";
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

function normalizeTranslationProvider(providerId) {
    var normalized = String(providerId || "").replace(/^\s+|\s+$/g, "").toLowerCase();
    if (normalized === "local" || normalized === "local_llm" || normalized.indexOf("lm studio") !== -1 || normalized.indexOf("ollama") !== -1) return "local";
    if (normalized === "gemini" || normalized === "google" || normalized.indexOf("gemini") !== -1) return "gemini";
    if (normalized === "claude" || normalized === "anthropic" || normalized.indexOf("claude") !== -1) return "claude";
    if (normalized === "openai" || normalized === "chatgpt") return "openai";
    return "deepl";
}

function normalizeOpenAIModel(modelName) {
    var normalized = String(modelName || "").replace(/^\s+|\s+$/g, "");
    return normalized !== "" ? normalized : "gpt-5.4-mini";
}

function normalizeGeminiModel(modelName) {
    var normalized = String(modelName || "").replace(/^\s+|\s+$/g, "");
    return normalized !== "" ? normalized : "gemini-2.5-flash";
}

function normalizeClaudeModel(modelName) {
    var normalized = String(modelName || "").replace(/^\s+|\s+$/g, "");
    return normalized !== "" ? normalized : "claude-sonnet-4-6";
}

function normalizeLocalLLMModel(modelName) {
    return String(modelName || "").replace(/^\s+|\s+$/g, "");
}

function normalizeLocalLLMBaseURL(url) {
    var normalized = String(url || "").replace(/^\s+|\s+$/g, "");
    if (normalized === "") return "";
    normalized = normalized.replace(/\/+$/g, "");
    normalized = normalized.replace(/\/(responses|chat\/completions)$/i, "");
    normalized = normalized.replace(/\/api$/i, "");
    if (!/\/v\d+$/i.test(normalized)) normalized += "/v1";
    return normalized;
}

function getTranslationProviderDisplayName(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "local") return t("provider_local");
    if (normalized === "openai") return t("provider_openai");
    if (normalized === "gemini") return t("provider_gemini");
    if (normalized === "claude") return t("provider_claude");
    return t("provider_deepl");
}

function getActiveTranslationProvider() {
    return normalizeTranslationProvider(translationProviderSetting);
}

function getProviderValidationMessage(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "openai") {
        return (!openAIKey || openAIKey === "") ? t("validation_enter_openai_key") : "";
    }
    if (normalized === "gemini") {
        return (!geminiKey || geminiKey === "") ? t("validation_enter_gemini_key") : "";
    }
    if (normalized === "claude") {
        return (!claudeKey || claudeKey === "") ? t("validation_enter_claude_key") : "";
    }
    if (normalized === "local") {
        if (!localLLMBaseURL || localLLMBaseURL === "") return t("validation_enter_local_llm_base_url");
        if (!localLLMModel || localLLMModel === "") return t("validation_enter_local_llm_model");
        return "";
    }
    return (!apiKey || apiKey === "") ? t("validation_enter_deepl_key") : "";
}

function getStructuredProviderModel(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "local") return normalizeLocalLLMModel(localLLMModel);
    if (normalized === "openai") return normalizeOpenAIModel(openAIModel);
    if (normalized === "gemini") return normalizeGeminiModel(geminiModel);
    if (normalized === "claude") return normalizeClaudeModel(claudeModel);
    return "";
}

function getProviderStringKey(providerId, suffix) {
    var normalized = normalizeTranslationProvider(providerId);
    return normalized + "_" + suffix;
}

function getProviderDebugPrefix(providerId) {
    return normalizeTranslationProvider(providerId);
}

function isStructuredLLMProvider(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    return normalized === "local" || normalized === "openai" || normalized === "gemini" || normalized === "claude";
}

function isProviderBrandedError(providerId, message) {
    var providerName = getTranslationProviderDisplayName(providerId);
    var raw = String(message || "");
    return raw.indexOf(providerName) === 0 ||
        raw.indexOf("Local LLM") === 0 ||
        raw.indexOf("Lokales LLM") === 0 ||
        raw.indexOf("OpenAI") === 0 ||
        raw.indexOf("Gemini") === 0 ||
        raw.indexOf("Claude") === 0;
}

function getDefaultProviderTargetLangCode(code) {
    var normalized = String(code || "").toUpperCase();
    if (normalized === "EN") return "EN-GB";
    if (normalized === "PT") return "PT-PT";
    return normalized;
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

function mergeHyperlinkPageMappings(baseMappings, overrideMappings) {
    var merged = normalizeHyperlinkPageMappings(baseMappings);
    var override = normalizeHyperlinkPageMappings(overrideMappings);
    for (var key in override) {
        if (!override.hasOwnProperty(key)) continue;
        merged[key] = override[key];
    }
    return merged;
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

function serializeHyperlinkPageMappings(pageMappings) {
    var mappings = normalizeHyperlinkPageMappings(pageMappings);
    var parts = [];
    for (var key in mappings) {
        if (!mappings.hasOwnProperty(key)) continue;
        var safeKey = String(key).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        var safeValue = String(mappings[key]).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        parts.push('"' + safeKey + '":"' + safeValue + '"');
    }
    return "{" + parts.join(",") + "}";
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
    if (pageMappings) {
        hyperlinkPageMappings = normalizeHyperlinkPageMappings(pageMappings);
        app.insertLabel(HYPERLINK_PAGE_MAP_LABEL, serializeHyperlinkPageMappings(hyperlinkPageMappings));
    }
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
    return mergeHyperlinkPageMappings(collectCoverHyperlinkPageMappings(doc), hyperlinkPageMappings);
}

function getRuntimeHyperlinkPageMappings(doc, explicitMappings) {
    return mergeHyperlinkPageMappings(collectCoverHyperlinkPageMappings(doc), explicitMappings ? explicitMappings : hyperlinkPageMappings);
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

function getSelectionParentPageSafe(item) {
    if (!item || !item.isValid) return null;
    try {
        if (item.parentPage && item.parentPage.isValid) return item.parentPage;
    } catch (e) {}
    try {
        var textPage = getTextObjectParentPage(item);
        if (textPage && textPage.isValid) return textPage;
    } catch (e2) {}
    try {
        if (item.parent && item.parent.parentPage && item.parent.parentPage.isValid) return item.parent.parentPage;
    } catch (e3) {}
    return null;
}

function addUniquePageById(targetPages, seenPageIds, page) {
    if (!page || !page.isValid) return;
    var pageId = null;
    try { pageId = page.id; } catch (e) { pageId = null; }
    var pageKey = (pageId !== null) ? String(pageId) : String(page.name || targetPages.length);
    if (seenPageIds[pageKey]) return;
    seenPageIds[pageKey] = true;
    targetPages.push(page);
}

function getPagesFromCurrentSpellcheckContext(doc) {
    var pages = [];
    var seen = {};
    if (!doc || !doc.isValid) return pages;

    if (radioSelection && radioSelection.value) {
        try {
            var selectionItems = app.selection || [];
            for (var i = 0; i < selectionItems.length; i++) {
                addUniquePageById(pages, seen, getSelectionParentPageSafe(selectionItems[i]));
            }
        } catch (eSel) {}
        if (pages.length > 0) return pages;
    }

    if (radioPages && radioPages.value) {
        try {
            var manualPages = getPagesFromString(doc, editPages.text);
            for (var j = 0; j < manualPages.length; j++) addUniquePageById(pages, seen, manualPages[j]);
        } catch (ePages) {}
        if (pages.length > 0) return pages;
    }

    if (radioBDA && radioBDA.value) {
        var rawSourcePages = String(bdaSourceInput && bdaSourceInput.text ? bdaSourceInput.text : "").replace(/^\s+|\s+$/g, "");
        if (rawSourcePages !== "" && rawSourcePages.toUpperCase() !== "AUTO") {
            try {
                var bdaPages = getPagesFromString(doc, rawSourcePages);
                for (var k = 0; k < bdaPages.length; k++) addUniquePageById(pages, seen, bdaPages[k]);
            } catch (eBda) {}
            if (pages.length > 0) return pages;
        }
    }

    return pages;
}

function detectSourceLanguageCode(doc) {
    var contextualPages = getPagesFromCurrentSpellcheckContext(doc);
    var i;
    for (i = 0; i < contextualPages.length; i++) {
        var contextualCode = getPageLanguageCode(contextualPages[i]);
        if (contextualCode) return String(contextualCode).toUpperCase();
    }
    for (i = 0; i < doc.pages.length; i++) {
        var code = getPageLanguageCode(doc.pages[i]);
        if (code) return String(code).toUpperCase();
    }
    return "";
}

function getLanguageToolCodeForLanguage(langCode) {
    var upper = String(langCode || "").toUpperCase();
    var map = {
        DE: "de-DE",
        EN: "en-GB",
        FR: "fr",
        IT: "it",
        ES: "es",
        CS: "cs",
        HU: "hu",
        BG: "bg",
        DA: "da",
        EL: "el",
        ET: "et",
        FI: "fi",
        LT: "lt",
        LV: "lv",
        NL: "nl",
        PL: "pl",
        PT: "pt-PT",
        RO: "ro",
        RU: "ru",
        SK: "sk",
        SL: "sl",
        SV: "sv"
    };
    return map[upper] || "";
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
var openAIKey = app.extractLabel(OPENAI_KEY_LABEL) || "";
var openAIModel = normalizeOpenAIModel(app.extractLabel(OPENAI_MODEL_LABEL) || "gpt-5.4-mini");
var geminiKey = app.extractLabel(GEMINI_KEY_LABEL) || "";
var geminiModel = normalizeGeminiModel(app.extractLabel(GEMINI_MODEL_LABEL) || "gemini-2.5-flash");
var claudeKey = app.extractLabel(CLAUDE_KEY_LABEL) || "";
var claudeModel = normalizeClaudeModel(app.extractLabel(CLAUDE_MODEL_LABEL) || "claude-sonnet-4-6");
var localLLMBaseURL = normalizeLocalLLMBaseURL(app.extractLabel(LOCAL_LLM_BASE_URL_LABEL) || "");
var localLLMApiKey = app.extractLabel(LOCAL_LLM_API_KEY_LABEL) || "";
var localLLMModel = normalizeLocalLLMModel(app.extractLabel(LOCAL_LLM_MODEL_LABEL) || "");
var translationProviderSetting = normalizeTranslationProvider(app.extractLabel(TRANSLATION_PROVIDER_LABEL) || "deepl");

var csvPathSettingRaw = app.extractLabel(CSV_PATH_LABEL) || "";
var csvPath = resolveCSVPath(csvPathSettingRaw);
var tmPath = app.extractLabel(TM_PATH_LABEL) || (Folder.userData + "/SuperTranslatorPRO_Memory.json"); 
var refSymbolsSetting = normalizeRefSymbols(app.extractLabel(REF_SYMBOLS_LABEL) || "[]");
var hyperlinkPageMappings = loadHyperlinkPageMappings(app.extractLabel(HYPERLINK_PAGE_MAP_LABEL) || "");
var autoBDAHyperlinksSetting = (app.extractLabel(AUTO_HYPERLINKS_LABEL) === "1");
var backPageTrackerSetting = normalizeBackPageTrackerSetting(app.extractLabel(BACK_PAGE_TRACKER_LABEL) || "©");

var FORMALITY_LABEL = "SuperTranslatorPRO_Formality";
var DNT_LABEL = "SuperTranslatorPRO_DNT_Styles";
var DEBUG_TABLE_RESTORE_LABEL = "SuperTranslatorPRO_DebugTableRestore";
var formalitySetting = app.extractLabel(FORMALITY_LABEL) || "default";
var dntStyles = app.extractLabel(DNT_LABEL) || "";
var tableRestoreDebugEnabled = (app.extractLabel(DEBUG_TABLE_RESTORE_LABEL) === "1");

var globalStats = { apiChars: 0, savedChars: 0, fittedFrames: 0 };
var progressWin, progressBar, progressText;
var overallBar, overallText, etaText, btnStopProgress;
var cancelFlag = false;
var startTime = 0;
var germanHighlightState = null;
var germanFocusState = { activePageKey: null, fittedPageKey: null };
var germanSpellDialogLocation = null;
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
var debugLogPath = Folder.temp + "/SuperTranslatorPRO_DebugLog.txt";
var debugSessionId = "";

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

function writeDebugLog(message, type) {
    if (!tableRestoreDebugEnabled) return;
    try {
        var f = new File(debugLogPath);
        var d = new Date();
        var timeStr = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0"+d.getDate()).slice(-2) + " " + ("0"+d.getHours()).slice(-2) + ":" + ("0"+d.getMinutes()).slice(-2) + ":" + ("0"+d.getSeconds()).slice(-2);
        var prefix = type ? "[" + type + "]" : "[DEBUG]";
        var sessionStr = debugSessionId ? "[SESSION " + debugSessionId + "] " : "";
        f.encoding = "UTF-8";
        f.open(f.exists ? 'e' : 'w');
        if (f.exists) f.seek(0, 2);
        f.writeln(timeStr + " " + prefix + " " + sessionStr + message);
        f.close();
    } catch (e) {}
}

function beginDebugSession(doc, config) {
    if (!tableRestoreDebugEnabled) return;
    debugSessionId = String(new Date().getTime()) + "_" + String(Math.floor(Math.random() * 100000));
    writeDebugLog("=== DEBUG-SESSION GESTARTET ===");
    try {
        writeDebugLog("Dokument: " + (doc && doc.name ? doc.name : "(unbekannt)") +
            " | Modus: " + (config && config.mode ? config.mode : "") +
            " | Zielsprache: " + (config && config.lang ? config.lang : "") +
            " | Seitenmodus: " + ((config && config.sourcePages) ? config.sourcePages : "") +
            " | BDA-Quelle: " + ((config && config.bdaSourcePages) ? config.bdaSourcePages : ""));
    } catch (e1) {}
    try {
        writeDebugLog("CSV: " + (csvPath || "(leer)") + " | TM: " + (tmPath || "(leer)") + " | Debug-Log: " + debugLogPath);
    } catch (e2) {}
}

function normalizeDebugSnippet(text, limit) {
    var maxLen = limit || 120;
    var normalized = String(text === null || text === undefined ? "" : text)
        .replace(/[\r\n\t]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/^\s+|\s+$/g, "");
    if (normalized.length > maxLen) normalized = normalized.substring(0, maxLen) + "...";
    return normalized;
}

function getDebugPageLabel(page) {
    if (!page || !page.isValid) return "(keine Seite)";
    var pageName = "";
    var docOffset = "";
    try { pageName = String(page.name || ""); } catch (e) { pageName = ""; }
    try { docOffset = String(page.documentOffset); } catch (e2) { docOffset = ""; }
    return pageName !== "" ? (pageName + (docOffset !== "" ? " [idx " + docOffset + "]" : "")) : ("idx " + docOffset);
}

function getDebugTextTargetLabel(textObj) {
    if (!textObj || !textObj.isValid) return "(ungueltiges Textziel)";
    var parts = [];
    try {
        var rangeKey = getTextObjectRangeKey(textObj);
        if (rangeKey !== "") parts.push("key=" + rangeKey);
    } catch (e) {}
    try {
        var page = getTextObjectParentPage(textObj);
        if (page) parts.push("page=" + getDebugPageLabel(page));
    } catch (e2) {}
    try {
        parts.push('text="' + normalizeDebugSnippet(textObj.contents, 90) + '"');
    } catch (e3) {}
    return parts.join(" | ");
}

function getTableDebugSummary(tbl) {
    if (!tbl || !tbl.isValid) return "rows=? cols=? cells=?";
    var rows = "?";
    var cols = "?";
    var cells = "?";
    try { rows = String(tbl.rows.length); } catch (e) {}
    try { cols = String(tbl.columns.length); } catch (e2) {}
    try { cells = String(tbl.cells.length); } catch (e3) {}
    return "rows=" + rows + " cols=" + cols + " cells=" + cells;
}

function isValidDocumentPage(page) {
    if (!page || !page.isValid) return false;
    try {
        if (page.documentOffset !== undefined && page.documentOffset !== null && page.documentOffset >= 0) return true;
    } catch (e) {}
    try {
        if (page.parent && page.parent.isValid && page.parent.constructor && page.parent.constructor.name === "Spread") return true;
    } catch (e2) {}
    return false;
}

function getDebugMarkerLocation(textObj) {
    if (!textObj || !textObj.isValid) return "(ungueltige Position)";
    var parts = [];
    try {
        var parentPage = getTextObjectParentPage(textObj);
        if (parentPage) parts.push("page=" + getDebugPageLabel(parentPage));
    } catch (e) {}
    try {
        var parentFrames = textObj.parentTextFrames;
        if (parentFrames && parentFrames.length > 0 && parentFrames[0] && parentFrames[0].isValid) {
            var layerName = "";
            try { layerName = String(parentFrames[0].itemLayer.name || ""); } catch (layerErr) { layerName = ""; }
            if (layerName !== "") parts.push("layer=" + layerName);
        }
    } catch (e2) {}
    try {
        parts.push('text="' + normalizeDebugSnippet(textObj.contents, 80) + '"');
    } catch (e3) {}
    return parts.join(" | ");
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
            var firstNonEmpty = "";
            for (var firstIdx = 0; firstIdx < cols.length; firstIdx++) {
                firstNonEmpty = sanitizeCSVContent(cols[firstIdx]).replace(/^\s+|\s+$/g, '');
                if (firstNonEmpty !== "") break;
            }
            if (firstNonEmpty === "") continue;
            if (isGlossaryCommentRow(firstNonEmpty)) continue;

            var entry = {};
            var meta = {};
            for (var j = 0; j < cols.length; j++) {
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

            var sourceText = "";
            if (entry.hasOwnProperty(entry.__sourceLang)) {
                sourceText = String(entry[entry.__sourceLang] || "").replace(/^\s+|\s+$/g, "");
            }
            if (sourceText === "" && entry.__sourceLang !== "DE" && entry.hasOwnProperty("DE")) {
                sourceText = String(entry.DE || "").replace(/^\s+|\s+$/g, "");
            }
            if (sourceText === "") {
                for (var headerIdx = 0; headerIdx < headers.length; headerIdx++) {
                    if (columnKinds[headerIdx] !== "lang") continue;
                    if (entry.hasOwnProperty(headers[headerIdx])) {
                        sourceText = String(entry[headers[headerIdx]] || "").replace(/^\s+|\s+$/g, "");
                        if (sourceText !== "") break;
                    }
                }
            }
            if (sourceText === "") continue;
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

    chunk = chunk.replace(/###(TBL_\d+|IMG_\d+)###/g, '<nt>###$1###</nt>');
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
var myWindow = new Window("palette", SCRIPT_NAME + " v" + SCRIPT_VERSION, undefined, { resizeable: true });
myWindow.orientation = "column";
myWindow.alignChildren = ["fill", "top"];
myWindow.spacing = 10;
myWindow.margins = 14;
myWindow.minimumSize = [780, 420];
myWindow.preferredSize = [900, 500];

var headerGroup = myWindow.add("group");
headerGroup.orientation = "row";
headerGroup.alignment = "fill";
headerGroup.alignChildren = ["fill", "center"];
headerGroup.spacing = 10;

var mainTitle = headerGroup.add("statictext", undefined, t("main_title"));
mainTitle.alignment = ["left", "center"];
mainTitle.graphics.font = ScriptUI.newFont(mainTitle.graphics.font.family, "BOLD", 16);

var headerSpacer = headerGroup.add("statictext", undefined, "");
headerSpacer.alignment = ["fill", "center"];
headerSpacer.minimumSize.width = 0;

var btnSettings = headerGroup.add("button", undefined, t("settings_button"));
btnSettings.helpTip = t("settings_help");
btnSettings.alignment = ["right", "center"];
btnSettings.preferredSize = [150, 30];

var summaryRow = myWindow.add("group");
summaryRow.orientation = "row";
summaryRow.alignment = "fill";
summaryRow.alignChildren = ["fill", "fill"];
summaryRow.spacing = 10;

var statusPanel = summaryRow.add("panel", undefined, t("status_title"));
statusPanel.orientation = "column";
statusPanel.alignChildren = ["fill", "top"];
statusPanel.alignment = ["fill", "fill"];
statusPanel.margins = 12;
statusPanel.preferredSize.width = 480;
var statusSummaryText = statusPanel.add("statictext", undefined, " ", { multiline: true });
statusSummaryText.preferredSize = [430, 74];
statusSummaryText.minimumSize = [430, 74];

var validationPanel = summaryRow.add("panel", undefined, t("validation_title"));
validationPanel.orientation = "column";
validationPanel.alignChildren = ["fill", "top"];
validationPanel.alignment = ["fill", "fill"];
validationPanel.margins = 12;
validationPanel.preferredSize.width = 360;
var validationText = validationPanel.add("statictext", undefined, " ", { multiline: true });
validationText.preferredSize = [320, 68];
validationText.minimumSize = [320, 68];

var modePanel = myWindow.add("panel", undefined, t("mode_title"));
modePanel.orientation = "column";
modePanel.alignChildren = ["left", "top"];
modePanel.margins = 12;
var modeOptionsRow = modePanel.add("group");
modeOptionsRow.orientation = "row";
modeOptionsRow.alignChildren = ["left", "center"];
modeOptionsRow.spacing = 18;

var radioSelection = modeOptionsRow.add("radiobutton", undefined, t("selection_mode"));
var radioPages = modeOptionsRow.add("radiobutton", undefined, t("pages_mode"));
var radioBDA = modeOptionsRow.add("radiobutton", undefined, t("auto_mode"));

var contentPanel = myWindow.add("panel", undefined, "");
contentPanel.orientation = "column";
contentPanel.alignChildren = ["fill", "top"];
contentPanel.margins = 15;
contentPanel.spacing = 10;
contentPanel.minimumSize = [700, 160];

var selectionModeGroup = contentPanel.add("group");
selectionModeGroup.orientation = "column";
selectionModeGroup.alignChildren = ["fill", "top"];
selectionModeGroup.alignment = "fill";
selectionModeGroup.add("statictext", undefined, t("selection_hint"), { multiline: true }).preferredSize.width = 500;
var selectionStateText = selectionModeGroup.add("statictext", undefined, "", { multiline: true });
selectionStateText.preferredSize.width = 500;

var pagesModeGroup = contentPanel.add("group");
pagesModeGroup.orientation = "column";
pagesModeGroup.alignChildren = ["fill", "top"];
pagesModeGroup.alignment = "fill";
var pagesRow = pagesModeGroup.add("group");
pagesRow.alignment = "fill";
pagesRow.alignChildren = ["left", "center"];
pagesRow.add("statictext", undefined, t("pages_label"));
var editPages = pagesRow.add("edittext", undefined, "");
editPages.characters = 14;
editPages.helpTip = t("pages_help");
var pagesHint = pagesModeGroup.add("statictext", undefined, t("pages_help"));
pagesHint.preferredSize.width = 500;
var pagesStateText = pagesModeGroup.add("statictext", undefined, "", { multiline: true });
pagesStateText.preferredSize.width = 500;

var manualTargetGroup = contentPanel.add("group");
manualTargetGroup.orientation = "column";
manualTargetGroup.alignChildren = ["fill", "top"];
manualTargetGroup.alignment = "fill";
manualTargetGroup.add("statictext", undefined, t("target_language_short"));
var langList = buildManualLanguageList();
var dropdownLang = manualTargetGroup.add("dropdownlist", undefined, langList);
dropdownLang.alignment = "fill";
dropdownLang.selection = 1;
var languageStateText = manualTargetGroup.add("statictext", undefined, "", { multiline: true });
languageStateText.preferredSize.width = 500;

var autoModeGroup = contentPanel.add("group");
autoModeGroup.orientation = "column";
autoModeGroup.alignChildren = ["fill", "top"];
autoModeGroup.alignment = "fill";
autoModeGroup.add("statictext", undefined, t("auto_source_help"), { multiline: true }).preferredSize.width = 500;
var grpBDASource = autoModeGroup.add("group");
grpBDASource.alignment = "fill";
grpBDASource.alignChildren = ["left", "center"];
grpBDASource.add("statictext", undefined, t("original_pages"));
var bdaSourceInput = grpBDASource.add("edittext", undefined, "AUTO");
bdaSourceInput.characters = 10;
bdaSourceInput.helpTip = t("auto_source_help");
var bdaSourceStateText = autoModeGroup.add("statictext", undefined, "", { multiline: true });
bdaSourceStateText.preferredSize.width = 500;
var checkTOC = autoModeGroup.add("checkbox", undefined, t("toc_checkbox"));
checkTOC.value = true;
var checkAutoBDAHyperlinks = autoModeGroup.add("checkbox", undefined, t("auto_hyperlink_checkbox"));
checkAutoBDAHyperlinks.value = autoBDAHyperlinksSetting;
checkAutoBDAHyperlinks.helpTip = t("auto_hyperlink_help");
var cbOnlyTextUpdate = autoModeGroup.add("checkbox", undefined, t("only_text_update"));
cbOnlyTextUpdate.value = false;
cbOnlyTextUpdate.enabled = false;

function updateBDAHyperlinkControls(enabled) {
    checkAutoBDAHyperlinks.enabled = !!enabled;
}

var groupButtons = myWindow.add("group");
groupButtons.alignment = "fill";
groupButtons.alignChildren = ["left", "center"];
groupButtons.spacing = 8;
var btnTranslate = groupButtons.add("button", undefined, t("translate_start"));
btnTranslate.preferredSize = [180, 32];
var buttonSpacer = groupButtons.add("statictext", undefined, "");
buttonSpacer.alignment = "fill";
var rightButtonGroup = groupButtons.add("group");
rightButtonGroup.alignment = ["right", "center"];
rightButtonGroup.alignChildren = ["left", "center"];
rightButtonGroup.spacing = 8;
var btnLinkReferences = rightButtonGroup.add("button", undefined, t("hyperlink_settings_button"));
btnLinkReferences.helpTip = t("hyperlink_settings_help");
btnLinkReferences.preferredSize = [130, 28];
var btnSpellCheck = rightButtonGroup.add("button", undefined, t("spellcheck_button"));
btnSpellCheck.helpTip = t("spellcheck_help");
btnSpellCheck.preferredSize = [130, 28];
var btnCancel = rightButtonGroup.add("button", undefined, t("close_button"));
btnCancel.preferredSize = [120, 28];

function setMainGroupVisible(group, isVisible) {
    group.visible = !!isVisible;
    if (isVisible) {
        group.maximumSize = [10000, 10000];
        group.minimumSize = [0, 0];
        group.preferredSize = [-1, -1];
    } else {
        group.maximumSize = [0, 0];
        group.minimumSize = [0, 0];
        group.preferredSize = [0, 0];
    }
}

function getStatusPathLabel(pathValue) {
    var normalized = String(pathValue || "").replace(/^\s+|\s+$/g, "");
    if (normalized === "") return t("status_not_set");
    try {
        var fileObj = new File(normalized);
        if (fileObj && fileObj.name) return fileObj.name;
    } catch (e) {}
    return normalized.replace(/^.*[\/\\]/, "");
}

function getProviderStatusSummaryText() {
    var providerId = getActiveTranslationProvider();
    var display = getTranslationProviderDisplayName(providerId);
    var validationMessage = getProviderValidationMessage(providerId);
    return validationMessage === "" ? display : (display + " (" + t("status_settings_required") + ")");
}

function getActiveDocumentSafe() {
    try {
        return app.activeDocument;
    } catch (e) {
        return null;
    }
}

function hasDocumentSelectionSafe() {
    try {
        return !!(app.selection && app.selection.length > 0);
    } catch (e) {
        return false;
    }
}

function getDocumentSelectionCountSafe() {
    try {
        return app.selection ? app.selection.length : 0;
    } catch (e) {
        return 0;
    }
}

function getSelectedLanguageCodeSafe() {
    normalizeLanguageDropdownSelection();
    return extractLanguageCodeFromOption(dropdownLang && dropdownLang.selection ? dropdownLang.selection.text : "");
}

function refreshMainStatusUI() {
    var autoLinksEnabled = checkAutoBDAHyperlinks ? !!checkAutoBDAHyperlinks.value : !!autoBDAHyperlinksSetting;
    statusSummaryText.text =
        t("status_provider") + " " + getProviderStatusSummaryText() + "   |   " + t("status_glossary") + " " + getStatusPathLabel(csvPath) + "\n" +
        t("status_memory") + " " + getStatusPathLabel(tmPath) + "\n" +
        t("status_links") + " " + (autoLinksEnabled ? t("status_on") : t("status_off")) + "   |   " + t("status_symbols") + " " + normalizeRefSymbols(refSymbolsSetting);
    try { myWindow.layout.layout(true); } catch (layoutErr) {}
}

function getBoundsCoordinate(boundsObj, propertyName, fallbackIndex, fallbackValue) {
    if (!boundsObj) return fallbackValue;
    try {
        if (typeof boundsObj[propertyName] !== "undefined") return boundsObj[propertyName];
    } catch (e) {}
    try {
        if (typeof boundsObj[fallbackIndex] !== "undefined") return boundsObj[fallbackIndex];
    } catch (e2) {}
    return fallbackValue;
}

function positionDialogRightOfMainWindow(dialog, dialogWidth, dialogHeight) {
    if (!dialog || !myWindow) return;
    try {
        var anchorBounds = myWindow.bounds;
        var left = getBoundsCoordinate(anchorBounds, "right", 2, 0) + 12;
        var top = getBoundsCoordinate(anchorBounds, "top", 1, 0);

        try {
            if ($.screens && $.screens.length > 0) {
                var screenBounds = $.screens[0].visibleBounds || $.screens[0].bounds;
                var screenLeft = getBoundsCoordinate(screenBounds, "left", 0, 0);
                var screenTop = getBoundsCoordinate(screenBounds, "top", 1, 0);
                var screenRight = getBoundsCoordinate(screenBounds, "right", 2, left + dialogWidth);
                var screenBottom = getBoundsCoordinate(screenBounds, "bottom", 3, top + dialogHeight);
                if (left + dialogWidth > screenRight) {
                    left = Math.max(screenLeft + 20, getBoundsCoordinate(anchorBounds, "left", 0, 0) - dialogWidth - 12);
                }
                if (top + dialogHeight > screenBottom) {
                    top = Math.max(screenTop + 20, screenBottom - dialogHeight - 20);
                }
            }
        } catch (screenErr) {}

        dialog.location = [left, top];
    } catch (e3) {}
}

function refreshMainInlineHints() {
    var doc = getActiveDocumentSafe();
    var hasDoc = !!(doc && doc.isValid);
    var selectedLangText = dropdownLang && dropdownLang.selection ? dropdownLang.selection.text : "";
    var selectedLangCode = getSelectedLanguageCodeSafe();
    var selectionCount = getDocumentSelectionCountSafe();
    var trimmedPages = String(editPages.text || "").replace(/^\s+|\s+$/g, "");
    var trimmedBDAPages = String(bdaSourceInput.text || "").replace(/^\s+|\s+$/g, "");

    selectionStateText.text = "";
    pagesStateText.text = "";
    languageStateText.text = "";
    bdaSourceStateText.text = "";

    if (!hasDoc) {
        selectionStateText.text = t("no_document_open");
        pagesStateText.text = t("no_document_open");
        languageStateText.text = t("no_document_open");
        bdaSourceStateText.text = t("no_document_open");
        return;
    }

    if (radioSelection.value) {
        selectionStateText.text = selectionCount > 0 ? t("selection_state_ready") : t("validation_select_something");
    }

    if (radioPages.value) {
        pagesStateText.text = trimmedPages !== "" ? t("pages_state_ready", { pages: trimmedPages }) : t("validation_enter_pages");
    }

    if (!radioBDA.value) {
        languageStateText.text = (!selectedLangText || isLanguageSeparatorText(selectedLangText) || selectedLangText.indexOf("-") !== -1)
            ? t("validation_invalid_lang")
            : t("language_state_ready", { lang: selectedLangCode });
    }

    if (radioBDA.value) {
        bdaSourceStateText.text = trimmedBDAPages !== "" ? t("bda_state_ready", { pages: trimmedBDAPages }) : t("validation_enter_pages_or_auto");
    }
}

function getMainValidationIssues() {
    var issues = [];
    normalizeLanguageDropdownSelection();

    var doc = getActiveDocumentSafe();
    if (!doc || !doc.isValid) {
        issues.push(t("no_document_open"));
    } else {
        if (radioSelection.value && !hasDocumentSelectionSafe()) issues.push(t("validation_select_something"));
        if (radioPages.value && String(editPages.text || "").replace(/\s/g, "") === "") issues.push(t("validation_enter_pages"));
        if (radioBDA.value && String(bdaSourceInput.text || "").replace(/\s/g, "") === "") issues.push(t("validation_enter_pages_or_auto"));
    }

    if (!radioBDA.value) {
        var selectedLangText = dropdownLang.selection ? dropdownLang.selection.text : "";
        if (!dropdownLang.selection || isLanguageSeparatorText(selectedLangText) || String(selectedLangText || "").indexOf("-") !== -1) {
            issues.push(t("validation_invalid_lang"));
        }
    }

    var providerValidationMessage = getProviderValidationMessage(getActiveTranslationProvider());
    if (providerValidationMessage !== "") issues.push(providerValidationMessage || t("validation_enter_api_key"));

    return issues;
}

function refreshMainValidationUI() {
    var issues = getMainValidationIssues();
    var doc = getActiveDocumentSafe();
    var hasDoc = !!(doc && doc.isValid);

    btnSpellCheck.enabled = hasDoc;
    btnLinkReferences.enabled = hasDoc;
    btnTranslate.enabled = (issues.length === 0);

    if (issues.length === 0) {
        validationText.text = t("validation_ready");
    } else {
        validationText.text = t("validation_needs_attention") + "\n- " + issues.join("\n- ");
    }

    refreshMainInlineHints();
    try { myWindow.layout.layout(true); } catch (layoutErr) {}
}

function isLanguageSeparatorText(itemText) {
    return String(itemText || "").indexOf("---") === 0;
}

function normalizeLanguageDropdownSelection() {
    if (!dropdownLang || !dropdownLang.selection) return;
    if (!isLanguageSeparatorText(dropdownLang.selection.text)) return;

    var candidateIndex = dropdownLang.selection.index + 1;
    while (candidateIndex < dropdownLang.items.length && isLanguageSeparatorText(dropdownLang.items[candidateIndex].text)) candidateIndex++;

    if (candidateIndex >= dropdownLang.items.length) {
        candidateIndex = dropdownLang.selection.index - 1;
        while (candidateIndex >= 0 && isLanguageSeparatorText(dropdownLang.items[candidateIndex].text)) candidateIndex--;
    }

    if (candidateIndex >= 0 && candidateIndex < dropdownLang.items.length) dropdownLang.selection = candidateIndex;
}

function setActiveMainMode(mode) {
    var normalizedMode = (mode === "BDA" || mode === "PAGES") ? mode : "SELECTION";
    radioSelection.value = (normalizedMode === "SELECTION");
    radioPages.value = (normalizedMode === "PAGES");
    radioBDA.value = (normalizedMode === "BDA");

    setMainGroupVisible(selectionModeGroup, normalizedMode === "SELECTION");
    setMainGroupVisible(pagesModeGroup, normalizedMode === "PAGES");
    setMainGroupVisible(manualTargetGroup, normalizedMode !== "BDA");
    setMainGroupVisible(autoModeGroup, normalizedMode === "BDA");

    dropdownLang.enabled = normalizedMode !== "BDA";
    bdaSourceInput.enabled = normalizedMode === "BDA";
    checkTOC.enabled = normalizedMode === "BDA";
    cbOnlyTextUpdate.enabled = normalizedMode === "BDA";
    if (normalizedMode !== "BDA") cbOnlyTextUpdate.value = false;
    updateBDAHyperlinkControls(normalizedMode === "BDA");

    if (normalizedMode === "SELECTION") contentPanel.text = t("selection_settings");
    else if (normalizedMode === "PAGES") contentPanel.text = t("pages_settings");
    else contentPanel.text = t("auto_settings");

    try { myWindow.layout.layout(true); } catch (layoutErr) {}
    refreshMainValidationUI();
}

radioSelection.onClick = function() {
    setActiveMainMode("SELECTION");
};

radioPages.onClick = function() {
    setActiveMainMode("PAGES");
};

radioBDA.onClick = function() {
    setActiveMainMode("BDA");
};

dropdownLang.onChange = function() {
    normalizeLanguageDropdownSelection();
    refreshMainValidationUI();
};

editPages.onActivate = function() {
    setActiveMainMode("PAGES");
};
editPages.onChanging = refreshMainValidationUI;

bdaSourceInput.onActivate = function() {
    setActiveMainMode("BDA");
};
bdaSourceInput.onChanging = refreshMainValidationUI;

checkAutoBDAHyperlinks.onClick = function() {
    updateBDAHyperlinkControls(radioBDA.value);
    refreshMainStatusUI();
    refreshMainValidationUI();
};

setActiveMainMode("SELECTION");
normalizeLanguageDropdownSelection();
refreshMainStatusUI();
refreshMainValidationUI();

myWindow.onResizing = myWindow.onResize = function() {
    this.layout.resize();
};
myWindow.onShow = myWindow.onActivate = function() {
    refreshMainStatusUI();
    refreshMainValidationUI();
};

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
    var dlg = new Window("dialog", t("hyperlink_dialog_title"), undefined, { resizeable: true });
    dlg.orientation = "column";
    dlg.alignChildren = ["fill", "top"];
    dlg.spacing = 10;
    dlg.minimumSize = [540, 500];
    dlg.preferredSize = [580, 520];

    var introText = dlg.add("statictext", undefined, t("hyperlink_dialog_hint"), { multiline: true });
    introText.preferredSize.width = 520;

    dlg.add("statictext", undefined, t("reference_symbols"));
    var refSymbolsInput = dlg.add("edittext", undefined, refSymbolsSetting);
    refSymbolsInput.alignment = "fill";
    refSymbolsInput.characters = 20;

    var coverMappings = collectCoverHyperlinkPageMappings(doc);
    var hyperlinkMappingsDraft = normalizeHyperlinkPageMappings(hyperlinkPageMappings);

    var detectedPanel = dlg.add("panel", undefined, t("hyperlink_detected_title"));
    detectedPanel.orientation = "column";
    detectedPanel.alignChildren = ["fill", "top"];
    detectedPanel.margins = 12;
    var detectedView = detectedPanel.add("edittext", undefined, hasOwnMappings(coverMappings) ? formatHyperlinkPageMappings(coverMappings) : t("hyperlink_detected_none"), { multiline: true, readonly: true, scrolling: true });
    detectedView.preferredSize = [520, 90];

    var hyperlinkPanel = dlg.add("panel", undefined, t("hyperlink_group_title"));
    hyperlinkPanel.orientation = "column";
    hyperlinkPanel.alignChildren = ["fill", "top"];
    hyperlinkPanel.margins = 12;
    hyperlinkPanel.spacing = 8;

    var hyperlinkLangGroup = hyperlinkPanel.add("group");
    hyperlinkLangGroup.alignment = "fill";
    hyperlinkLangGroup.alignChildren = ["left", "center"];
    hyperlinkLangGroup.add("statictext", undefined, t("hyperlink_language"));
    var hyperlinkLangDropdown = hyperlinkLangGroup.add("dropdownlist", undefined, buildHyperlinkLanguageList());
    hyperlinkLangDropdown.selection = 0;
    hyperlinkLangDropdown.preferredSize.width = 180;

    var hyperlinkPageGroup = hyperlinkPanel.add("group");
    hyperlinkPageGroup.alignment = "fill";
    hyperlinkPageGroup.alignChildren = ["left", "center"];
    hyperlinkPageGroup.add("statictext", undefined, t("hyperlink_target_page"));
    var hyperlinkPageInput = hyperlinkPageGroup.add("edittext", undefined, "");
    hyperlinkPageInput.preferredSize.width = 120;
    hyperlinkPageInput.characters = 10;

    var hyperlinkButtonGroup = hyperlinkPanel.add("group");
    hyperlinkButtonGroup.alignment = "fill";
    hyperlinkButtonGroup.spacing = 8;
    var btnSaveHyperlinkMapping = hyperlinkButtonGroup.add("button", undefined, t("hyperlink_save_mapping"));
    btnSaveHyperlinkMapping.preferredSize = [150, 28];
    var btnRemoveHyperlinkMapping = hyperlinkButtonGroup.add("button", undefined, t("hyperlink_remove_mapping"));
    btnRemoveHyperlinkMapping.preferredSize = [150, 28];
    var btnReloadFromCover = hyperlinkButtonGroup.add("button", undefined, t("hyperlink_reload_from_cover"));
    btnReloadFromCover.preferredSize = [170, 28];

    hyperlinkPanel.add("statictext", undefined, t("hyperlink_saved_mappings"));
    var hyperlinkMappingsView = hyperlinkPanel.add("listbox", undefined, [], { multiselect: false });
    hyperlinkMappingsView.preferredSize = [520, 150];
    var hyperlinkMappingsMeta = [];

    function getEffectiveHyperlinkMappings() {
        return mergeHyperlinkPageMappings(coverMappings, hyperlinkMappingsDraft);
    }

    function buildHyperlinkMappingsMeta() {
        var effectiveMappings = getEffectiveHyperlinkMappings();
        var entries = getHyperlinkLanguageEntries();
        var meta = [];
        var seen = {};
        for (var i = 0; i < entries.length; i++) {
            var code = entries[i].code;
            if (!effectiveMappings.hasOwnProperty(code)) continue;
            var sourceLabel = coverMappings.hasOwnProperty(code)
                ? (hyperlinkMappingsDraft.hasOwnProperty(code) ? t("hyperlink_source_override") : t("hyperlink_source_cover"))
                : t("hyperlink_source_manual");
            meta.push({ code: code, page: effectiveMappings[code], source: sourceLabel });
            seen[code] = true;
        }
        for (var key in effectiveMappings) {
            if (!effectiveMappings.hasOwnProperty(key) || seen[key]) continue;
            meta.push({ code: key, page: effectiveMappings[key], source: hyperlinkMappingsDraft.hasOwnProperty(key) ? t("hyperlink_source_manual") : t("hyperlink_source_cover") });
        }
        return meta;
    }

    function applyHyperlinkDraftValue(selectedCode, pageValue) {
        if (!selectedCode) return;
        var normalizedPageValue = String(pageValue || "").replace(/^\s+|\s+$/g, "");
        if (normalizedPageValue === "") {
            if (hyperlinkMappingsDraft.hasOwnProperty(selectedCode)) delete hyperlinkMappingsDraft[selectedCode];
            return;
        }
        if (coverMappings.hasOwnProperty(selectedCode) && coverMappings[selectedCode] === normalizedPageValue) {
            if (hyperlinkMappingsDraft.hasOwnProperty(selectedCode)) delete hyperlinkMappingsDraft[selectedCode];
            return;
        }
        hyperlinkMappingsDraft[selectedCode] = normalizedPageValue;
    }

    var refreshHyperlinkMappingsView = function() {
        hyperlinkMappingsMeta = buildHyperlinkMappingsMeta();
        hyperlinkMappingsView.removeAll();
        for (var i = 0; i < hyperlinkMappingsMeta.length; i++) {
            hyperlinkMappingsView.add("item", hyperlinkMappingsMeta[i].code + " -> " + hyperlinkMappingsMeta[i].page + " [" + hyperlinkMappingsMeta[i].source + "]");
        }
    };

    var syncHyperlinkMappingInputs = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        if (hyperlinkMappingsView.selection && hyperlinkMappingsMeta[hyperlinkMappingsView.selection.index]) {
            selectedCode = hyperlinkMappingsMeta[hyperlinkMappingsView.selection.index].code;
            for (var i = 0; i < hyperlinkLangDropdown.items.length; i++) {
                if (extractLanguageCodeFromOption(hyperlinkLangDropdown.items[i].text) === selectedCode) {
                    hyperlinkLangDropdown.selection = i;
                    break;
                }
            }
        }
        var effectiveMappings = getEffectiveHyperlinkMappings();
        hyperlinkPageInput.text = (selectedCode && effectiveMappings.hasOwnProperty(selectedCode)) ? effectiveMappings[selectedCode] : "";
    };

    hyperlinkLangDropdown.onChange = function() {
        hyperlinkMappingsView.selection = null;
        syncHyperlinkMappingInputs();
    };
    hyperlinkMappingsView.onChange = syncHyperlinkMappingInputs;

    btnSaveHyperlinkMapping.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        var pageValue = String(hyperlinkPageInput.text || "").replace(/^\s+|\s+$/g, "");
        if (!selectedCode) return;
        if (pageValue === "") {
            alert(t("hyperlink_page_required", { language: selectedCode }));
            return;
        }
        applyHyperlinkDraftValue(selectedCode, pageValue);
        refreshHyperlinkMappingsView();
        syncHyperlinkMappingInputs();
    };

    btnRemoveHyperlinkMapping.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        if (!selectedCode) return;
        if (hyperlinkMappingsDraft.hasOwnProperty(selectedCode)) delete hyperlinkMappingsDraft[selectedCode];
        hyperlinkMappingsView.selection = null;
        syncHyperlinkMappingInputs();
        refreshHyperlinkMappingsView();
    };

    btnReloadFromCover.onClick = function() {
        coverMappings = collectCoverHyperlinkPageMappings(doc);
        detectedView.text = hasOwnMappings(coverMappings) ? formatHyperlinkPageMappings(coverMappings) : t("hyperlink_detected_none");
        hyperlinkMappingsView.selection = null;
        refreshHyperlinkMappingsView();
        syncHyperlinkMappingInputs();
    };

    refreshHyperlinkMappingsView();
    syncHyperlinkMappingInputs();

    var buttonRow = dlg.add("group");
    buttonRow.alignment = "fill";
    buttonRow.spacing = 10;
    var buttonSpacer = buttonRow.add("statictext", undefined, "");
    buttonSpacer.alignment = "fill";
    var btnRun = buttonRow.add("button", undefined, t("hyperlink_execute"), { name: "ok" });
    btnRun.preferredSize = [150, 30];
    var btnClose = buttonRow.add("button", undefined, t("cancel"), { name: "cancel" });
    btnClose.preferredSize = [120, 28];

    btnRun.onClick = function() {
        var selectedCode = extractLanguageCodeFromOption(hyperlinkLangDropdown.selection ? hyperlinkLangDropdown.selection.text : "");
        var pageValue = String(hyperlinkPageInput.text || "").replace(/^\s+|\s+$/g, "");
        applyHyperlinkDraftValue(selectedCode, pageValue);
        saveHyperlinkSettings(refSymbolsInput.text, hyperlinkMappingsDraft);
        dlg.close(1);
    };

    btnClose.onClick = function() { dlg.close(0); };
    dlg.onResizing = dlg.onResize = function() {
        this.layout.resize();
    };
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
    refreshMainStatusUI();
    refreshMainValidationUI();
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
    var setWin = new Window("dialog", t("settings_title"), undefined, { resizeable: true });
    setWin.orientation = "column";
    setWin.alignChildren = ["fill", "top"];
    setWin.spacing = 10;
    setWin.minimumSize = [760, 620];
    setWin.preferredSize = [760, 620];
    
    var topGrp = setWin.add("group");
    topGrp.alignment = "fill";
    topGrp.alignChildren = ["right", "center"];
    topGrp.spacing = 8;
    var btnLog = topGrp.add("button", undefined, t("log_file"));
    btnLog.preferredSize = [110, 28];
    var btnDebugLog = topGrp.add("button", undefined, t("debug_log_file"));
    btnDebugLog.preferredSize = [110, 28];
    var btnInfo = topGrp.add("button", undefined, t("info"));
    btnInfo.preferredSize = [90, 28];

    var overviewPanel = setWin.add("panel", undefined, t("settings_overview_title"));
    overviewPanel.orientation = "column";
    overviewPanel.alignChildren = ["fill", "top"];
    overviewPanel.margins = 12;
    var settingsOverviewText = overviewPanel.add("statictext", undefined, "", { multiline: true });
    settingsOverviewText.preferredSize.width = 700;

    var tabs = setWin.add("tabbedpanel");
    tabs.alignment = ["fill", "fill"];
    tabs.alignChildren = ["fill", "fill"];
    tabs.minimumSize = [700, 420];
    tabs.preferredSize = [700, 420];

    var dataTab = tabs.add("tab", undefined, t("settings_tab_data"));
    dataTab.orientation = "column";
    dataTab.alignChildren = ["fill", "top"];

    var autoTab = tabs.add("tab", undefined, t("settings_tab_auto"));
    autoTab.orientation = "column";
    autoTab.alignChildren = ["fill", "top"];

    var providerTab = tabs.add("tab", undefined, t("settings_tab_provider"));
    providerTab.orientation = "column";
    providerTab.alignChildren = ["fill", "top"];

    function createSettingsField(parent, labelText, value, chars) {
        var fieldGroup = parent.add("group");
        fieldGroup.orientation = "column";
        fieldGroup.alignChildren = ["fill", "top"];
        fieldGroup.alignment = "fill";
        var label = fieldGroup.add("statictext", undefined, labelText);
        var input = fieldGroup.add("edittext", undefined, value);
        input.characters = chars;
        input.alignment = ["fill", "top"];
        return { group: fieldGroup, label: label, input: input };
    }

    function createProviderFieldsGroup(parent, fields) {
        var group = parent.add("group");
        group.orientation = "column";
        group.alignChildren = ["fill", "top"];
        group.alignment = "fill";
        var inputs = {};
        for (var i = 0; i < fields.length; i++) {
            var field = createSettingsField(group, fields[i].label, fields[i].value, fields[i].chars);
            inputs[fields[i].name] = field.input;
        }
        return { group: group, inputs: inputs };
    }

    function setSettingsGroupVisible(group, isVisible) {
        group.visible = !!isVisible;
        if (isVisible) {
            group.maximumSize = [10000, 10000];
            group.minimumSize = [0, 0];
            group.preferredSize = [-1, -1];
        } else {
            group.maximumSize = [0, 0];
            group.minimumSize = [0, 0];
            group.preferredSize = [0, 0];
        }
    }

    function createPathInputRow(parent, labelText, value, browseHandler) {
        parent.add("statictext", undefined, labelText);
        var row = parent.add("group");
        row.alignment = "fill";
        row.alignChildren = ["fill", "center"];
        var input = row.add("edittext", undefined, value);
        input.alignment = ["fill", "center"];
        input.characters = 40;
        var button = row.add("button", undefined, t("browse"));
        button.preferredSize = [160, 28];
        button.onClick = browseHandler;
        return input;
    }

    function createDialogHint(parent, hintText) {
        var hint = parent.add("statictext", undefined, hintText, { multiline: true });
        hint.preferredSize.width = 660;
        return hint;
    }

    function createSettingsSection(parent, title) {
        var panel = parent.add("panel", undefined, title);
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.alignment = "fill";
        panel.margins = 12;
        panel.spacing = 8;
        return panel;
    }

    createDialogHint(providerTab, t("settings_tab_provider_hint"));
    var providerSetupSection = createSettingsSection(providerTab, t("settings_section_provider_setup"));
    providerSetupSection.add("statictext", undefined, t("translation_provider"));
    var providerIds = ["deepl", "openai", "gemini", "claude", "local"];
    var providerLabels = [t("provider_deepl"), t("provider_openai"), t("provider_gemini"), t("provider_claude"), t("provider_local")];
    var providerDrop = providerSetupSection.add("dropdownlist", undefined, providerLabels);
    providerDrop.alignment = "fill";
    var providerHintText = providerSetupSection.add("statictext", undefined, "", { multiline: true });
    providerHintText.preferredSize.width = 640;
    var activeProviderId = getActiveTranslationProvider();
    var activeProviderIndex = 0;
    for (var providerIndex = 0; providerIndex < providerIds.length; providerIndex++) {
        if (providerIds[providerIndex] === activeProviderId) {
            activeProviderIndex = providerIndex;
            break;
        }
    }
    providerDrop.selection = activeProviderIndex;

    var providerCredentialsSection = createSettingsSection(providerTab, t("settings_section_provider_credentials"));
    var providerSettingsGroup = providerCredentialsSection.add("group");
    providerSettingsGroup.orientation = "column";
    providerSettingsGroup.alignChildren = ["fill", "top"];
    providerSettingsGroup.alignment = "fill";

    var deepLField = createSettingsField(providerSettingsGroup, t("deepl_api_key"), apiKey, 40);

    var providerSpecificGroup = providerSettingsGroup.add("group");
    providerSpecificGroup.orientation = "column";
    providerSpecificGroup.alignChildren = ["fill", "top"];
    providerSpecificGroup.alignment = "fill";

    var openAIProviderFields = createProviderFieldsGroup(providerSpecificGroup, [
        { name: "openAIKey", label: t("openai_api_key"), value: openAIKey, chars: 40 },
        { name: "openAIModel", label: t("openai_model"), value: openAIModel, chars: 30 }
    ]);
    var geminiProviderFields = createProviderFieldsGroup(providerSpecificGroup, [
        { name: "geminiKey", label: t("gemini_api_key"), value: geminiKey, chars: 40 },
        { name: "geminiModel", label: t("gemini_model"), value: geminiModel, chars: 30 }
    ]);
    var claudeProviderFields = createProviderFieldsGroup(providerSpecificGroup, [
        { name: "claudeKey", label: t("claude_api_key"), value: claudeKey, chars: 40 },
        { name: "claudeModel", label: t("claude_model"), value: claudeModel, chars: 30 }
    ]);
    var localProviderFields = createProviderFieldsGroup(providerSpecificGroup, [
        { name: "localLLMBaseURL", label: t("local_llm_base_url"), value: localLLMBaseURL, chars: 40 },
        { name: "localLLMApiKey", label: t("local_llm_api_key"), value: localLLMApiKey, chars: 40 },
        { name: "localLLMModel", label: t("local_llm_model"), value: localLLMModel, chars: 30 }
    ]);

    var keyInput = deepLField.input;
    var openAIKeyInput = openAIProviderFields.inputs.openAIKey;
    var openAIModelInput = openAIProviderFields.inputs.openAIModel;
    var geminiKeyInput = geminiProviderFields.inputs.geminiKey;
    var geminiModelInput = geminiProviderFields.inputs.geminiModel;
    var claudeKeyInput = claudeProviderFields.inputs.claudeKey;
    var claudeModelInput = claudeProviderFields.inputs.claudeModel;
    var localLLMBaseURLInput = localProviderFields.inputs.localLLMBaseURL;
    var localLLMApiKeyInput = localProviderFields.inputs.localLLMApiKey;
    var localLLMModelInput = localProviderFields.inputs.localLLMModel;
    var providerValidationText = providerCredentialsSection.add("statictext", undefined, "", { multiline: true });
    providerValidationText.preferredSize.width = 640;

    function getDraftProviderValidationMessage() {
        var selectedProviderIndex = (providerDrop.selection && providerDrop.selection.index >= 0) ? providerDrop.selection.index : 0;
        var selectedProviderId = providerIds[selectedProviderIndex] || "deepl";
        if (selectedProviderId === "openai") return String(openAIKeyInput.text || "").replace(/^\s+|\s+$/g, "") === "" ? t("validation_enter_openai_key") : "";
        if (selectedProviderId === "gemini") return String(geminiKeyInput.text || "").replace(/^\s+|\s+$/g, "") === "" ? t("validation_enter_gemini_key") : "";
        if (selectedProviderId === "claude") return String(claudeKeyInput.text || "").replace(/^\s+|\s+$/g, "") === "" ? t("validation_enter_claude_key") : "";
        if (selectedProviderId === "local") {
            if (normalizeLocalLLMBaseURL(localLLMBaseURLInput.text) === "") return t("validation_enter_local_llm_base_url");
            if (normalizeLocalLLMModel(localLLMModelInput.text) === "") return t("validation_enter_local_llm_model");
            return "";
        }
        return String(keyInput.text || "").replace(/^\s+|\s+$/g, "") === "" ? t("validation_enter_deepl_key") : "";
    }

    function refreshProviderValidationUI() {
        var validationMessage = getDraftProviderValidationMessage();
        providerValidationText.text = validationMessage === "" ? t("settings_provider_validation_ready") : validationMessage;
    }

    function refreshProviderSettingsUI() {
        var selectedProviderIndex = (providerDrop.selection && providerDrop.selection.index >= 0) ? providerDrop.selection.index : 0;
        var selectedProviderId = providerIds[selectedProviderIndex] || "deepl";
        deepLField.label.text = (selectedProviderId === "deepl") ? t("deepl_api_key") : t("deepl_fallback_api_key");
        providerHintText.text = (selectedProviderId === "deepl")
            ? t("settings_provider_deepl_hint")
            : (selectedProviderId === "local" ? t("settings_provider_local_hint") : t("settings_provider_llm_hint"));
        setSettingsGroupVisible(providerSpecificGroup, selectedProviderId !== "deepl");
        setSettingsGroupVisible(openAIProviderFields.group, selectedProviderId === "openai");
        setSettingsGroupVisible(geminiProviderFields.group, selectedProviderId === "gemini");
        setSettingsGroupVisible(claudeProviderFields.group, selectedProviderId === "claude");
        setSettingsGroupVisible(localProviderFields.group, selectedProviderId === "local");
        try { providerSettingsGroup.layout.layout(true); } catch (layoutErr) {}
        try { setWin.layout.layout(true); } catch (winLayoutErr) {}
    }

    providerDrop.onChange = function() {
        refreshProviderSettingsUI();
        refreshProviderValidationUI();
    };
    keyInput.onChanging = refreshProviderValidationUI;
    openAIKeyInput.onChanging = refreshProviderValidationUI;
    openAIModelInput.onChanging = refreshProviderValidationUI;
    geminiKeyInput.onChanging = refreshProviderValidationUI;
    geminiModelInput.onChanging = refreshProviderValidationUI;
    claudeKeyInput.onChanging = refreshProviderValidationUI;
    claudeModelInput.onChanging = refreshProviderValidationUI;
    localLLMBaseURLInput.onChanging = refreshProviderValidationUI;
    localLLMApiKeyInput.onChanging = refreshProviderValidationUI;
    localLLMModelInput.onChanging = refreshProviderValidationUI;
    refreshProviderSettingsUI();
    refreshProviderValidationUI();

    tabs.selection = dataTab;

    createDialogHint(dataTab, t("settings_tab_data_hint"));
    var dataResourcesSection = createSettingsSection(dataTab, t("settings_section_resources"));
    var csvInput = createPathInputRow(dataResourcesSection, t("glossary_path"), csvPath, function() {
        var chosenGlossaryPath = promptForGlossaryPath(csvInput.text, true);
        if (chosenGlossaryPath && chosenGlossaryPath !== "") {
            csvInput.text = chosenGlossaryPath;
            try { refreshSettingsOverview(); } catch (overviewErr1) {}
        }
    });

    var tmInput = createPathInputRow(dataResourcesSection, t("memory_path"), tmPath, function() {
        var f = File.openDialog(t("memory_select"), "*.json");
        if (f) {
            tmInput.text = f.fsName;
            try { refreshSettingsOverview(); } catch (overviewErr2) {}
        } else {
            var saveF = File.saveDialog(t("memory_save_new"), "*.json");
            if (saveF) {
                tmInput.text = saveF.fsName;
                try { refreshSettingsOverview(); } catch (overviewErr3) {}
            }
        }
    });

    var dataTranslationSection = createSettingsSection(dataTab, t("settings_section_translation"));
    dataTranslationSection.add("statictext", undefined, t("formality"));
    var formDrop = dataTranslationSection.add("dropdownlist", undefined, buildFormalityOptions());
    formDrop.alignment = "fill";
    if (formalitySetting === "more") formDrop.selection = 1; else if (formalitySetting === "less") formDrop.selection = 2; else formDrop.selection = 0;
    
    dataTranslationSection.add("statictext", undefined, t("ignored_styles"));
    var dntInput = dataTranslationSection.add("edittext", undefined, dntStyles);
    dntInput.characters = 40;
    dntInput.alignment = "fill";

    createDialogHint(autoTab, t("settings_tab_auto_hint"));
    var autoSection = createSettingsSection(autoTab, t("settings_section_auto_options"));
    autoSection.add("statictext", undefined, t("auto_hyperlink_symbols"));
    var autoHyperlinkSymbolsInput = autoSection.add("edittext", undefined, refSymbolsSetting);
    autoHyperlinkSymbolsInput.characters = 20;
    autoHyperlinkSymbolsInput.alignment = "fill";
    autoHyperlinkSymbolsInput.helpTip = t("reference_symbols");
    autoSection.add("statictext", undefined, t("back_page_tracker_label"));
    var backPageTrackerInput = autoSection.add("edittext", undefined, backPageTrackerSetting);
    backPageTrackerInput.characters = 40;
    backPageTrackerInput.alignment = "fill";
    backPageTrackerInput.helpTip = t("back_page_tracker_help");
    var debugTableRestoreCheckbox = autoSection.add("checkbox", undefined, t("debug_tables_images"));
    debugTableRestoreCheckbox.value = tableRestoreDebugEnabled;
    debugTableRestoreCheckbox.helpTip = t("debug_tables_images_help");

    function refreshSettingsOverview() {
        var selectedProviderIndex = (providerDrop.selection && providerDrop.selection.index >= 0) ? providerDrop.selection.index : 0;
        var selectedProviderId = providerIds[selectedProviderIndex] || "deepl";
        settingsOverviewText.text =
            t("status_provider") + " " + getTranslationProviderDisplayName(selectedProviderId) +
            "   |   " + t("status_glossary") + " " + getStatusPathLabel(csvInput.text) + "\n" +
            t("status_memory") + " " + getStatusPathLabel(tmInput.text) +
            "   |   " + t("status_symbols") + " " + normalizeRefSymbols(autoHyperlinkSymbolsInput.text);
    }

    providerDrop.onChange = function() {
        refreshProviderSettingsUI();
        refreshProviderValidationUI();
        refreshSettingsOverview();
    };
    csvInput.onChanging = refreshSettingsOverview;
    tmInput.onChanging = refreshSettingsOverview;
    autoHyperlinkSymbolsInput.onChanging = refreshSettingsOverview;
    refreshSettingsOverview();

    var g = setWin.add("group");
    g.alignment = "fill";
    g.alignChildren = ["fill", "center"];
    g.margins.top = 8;
    g.spacing = 10;
    
    var leftGrp = g.add("group");
    leftGrp.alignment = "left";
    leftGrp.spacing = 10;
    var btnClearTM = leftGrp.add("button", undefined, t("clear_memory"));
    btnClearTM.preferredSize = [140, 28];
    var btnFeedbackReport = leftGrp.add("button", undefined, t("feedback_report"));
    btnFeedbackReport.preferredSize = [150, 28];
    
    var spacer = g.add("statictext", undefined, "");
    spacer.alignment = "fill";
    
    var rightGrp = g.add("group");
    rightGrp.alignment = ["right", "center"];
    rightGrp.alignChildren = ["right", "center"];
    rightGrp.spacing = 10;
    var btnSave = rightGrp.add("button", undefined, t("save"), { name: "ok" });
    btnSave.preferredSize = [130, 30];
    var btnCancelSet = rightGrp.add("button", undefined, t("cancel"), { name: "cancel" });
    btnCancelSet.preferredSize = [120, 28];
    
    btnSave.onClick = function() {
        var selectedProviderIndex = (providerDrop.selection && providerDrop.selection.index >= 0) ? providerDrop.selection.index : 0;
        translationProviderSetting = normalizeTranslationProvider(providerIds[selectedProviderIndex] || "deepl");
        apiKey = String(keyInput.text || "").replace(/^\s+|\s+$/g, "");
        openAIKey = String(openAIKeyInput.text || "").replace(/^\s+|\s+$/g, "");
        openAIModel = normalizeOpenAIModel(openAIModelInput.text);
        geminiKey = String(geminiKeyInput.text || "").replace(/^\s+|\s+$/g, "");
        geminiModel = normalizeGeminiModel(geminiModelInput.text);
        claudeKey = String(claudeKeyInput.text || "").replace(/^\s+|\s+$/g, "");
        claudeModel = normalizeClaudeModel(claudeModelInput.text);
        localLLMBaseURL = normalizeLocalLLMBaseURL(localLLMBaseURLInput.text);
        localLLMApiKey = String(localLLMApiKeyInput.text || "").replace(/^\s+|\s+$/g, "");
        localLLMModel = normalizeLocalLLMModel(localLLMModelInput.text);
        csvPath = csvInput.text;
        csvPathSettingRaw = csvPath;
        tmPath = tmInput.text;
        refSymbolsSetting = normalizeRefSymbols(autoHyperlinkSymbolsInput.text);
        backPageTrackerSetting = normalizeBackPageTrackerSetting(backPageTrackerInput.text);
        app.insertLabel(DEEPL_KEY_LABEL, apiKey); 
        app.insertLabel(OPENAI_KEY_LABEL, openAIKey);
        app.insertLabel(OPENAI_MODEL_LABEL, openAIModel);
        app.insertLabel(GEMINI_KEY_LABEL, geminiKey);
        app.insertLabel(GEMINI_MODEL_LABEL, geminiModel);
        app.insertLabel(CLAUDE_KEY_LABEL, claudeKey);
        app.insertLabel(CLAUDE_MODEL_LABEL, claudeModel);
        app.insertLabel(LOCAL_LLM_BASE_URL_LABEL, localLLMBaseURL);
        app.insertLabel(LOCAL_LLM_API_KEY_LABEL, localLLMApiKey);
        app.insertLabel(LOCAL_LLM_MODEL_LABEL, localLLMModel);
        app.insertLabel(TRANSLATION_PROVIDER_LABEL, translationProviderSetting);
        app.insertLabel(CSV_PATH_LABEL, csvPath); 
        app.insertLabel(TM_PATH_LABEL, tmPath); 
        app.insertLabel(REF_SYMBOLS_LABEL, refSymbolsSetting);
        app.insertLabel(BACK_PAGE_TRACKER_LABEL, backPageTrackerSetting);
        tableRestoreDebugEnabled = !!debugTableRestoreCheckbox.value;
        app.insertLabel(DEBUG_TABLE_RESTORE_LABEL, tableRestoreDebugEnabled ? "1" : "0");
        
        var selForm = "default";
        if (formDrop.selection.index === 1) selForm = "more"; else if (formDrop.selection.index === 2) selForm = "less";
        app.insertLabel(FORMALITY_LABEL, selForm); formalitySetting = selForm;
        app.insertLabel(DNT_LABEL, dntInput.text); dntStyles = dntInput.text;
        refreshMainStatusUI();
        refreshMainValidationUI();
        
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
    btnDebugLog.onClick = function() {
        var f = new File(debugLogPath);
        if (f.exists) { f.execute(); } else { alert(t("no_debug_log_file")); }
    };
    btnInfo.onClick = function() {
        alert(buildAboutText(), t("about_title"));
    };
    btnCancelSet.onClick = function() { setWin.close(); };
    setWin.onShow = function() {
        positionDialogRightOfMainWindow(setWin, 760, 620);
    };
    setWin.onResizing = setWin.onResize = function() {
        this.layout.resize();
    };
    setWin.show();
};

btnCancel.onClick = function() { myWindow.close(); }

function isGermanMasterName(name) {
    return getMasterLang(name) === "de";
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
    var hasPreferredCodes = !!(preferredCodes && preferredCodes.length > 0);
    if (hasPreferredCodes) {
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
    if (!hasPreferredCodes) {
        for (var extraCode in tasksByCode) {
            if (tasksByCode.hasOwnProperty(extraCode) && !seen[extraCode]) tasks.push(tasksByCode[extraCode]);
        }
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
    var lettersOnly = normalized.replace(/[^A-Za-zÀ-ÖØ-öø-ÿĀ-žА-Яа-яЁёΆ-ώ]/g, "");
    return lettersOnly.length >= 3;
}

function addGermanSpellTarget(targets, textObj, story, locationLabel, page, frame, langCode) {
    if (!textObj || !textObj.isValid) return;
    if (!story || !story.isValid) return;
    var storyText = "";
    try { storyText = textObj.contents; } catch (e) { storyText = ""; }
    if (!shouldCheckGermanText(storyText)) return;

    targets.push({ textObj: textObj, story: story, text: storyText, location: locationLabel, page: page || null, frame: frame || null, langCode: String(langCode || "").toUpperCase() });
}

function collectGermanSpellTargets(doc, sourceLangCode) {
    var targets = [];
    var normalizedSourceLang = String(sourceLangCode || "").toUpperCase();
    if (normalizedSourceLang === "") return targets;

    for (var pageIndex = 0; pageIndex < doc.pages.length; pageIndex++) {
        var page = doc.pages[pageIndex];
        if (getPageLanguageCode(page) !== normalizedSourceLang) continue;
        var masterName = "";
        try { masterName = (page.appliedMaster && page.appliedMaster.isValid) ? String(page.appliedMaster.name) : "ohne Musterseite"; } catch (eMaster) { masterName = "ohne Musterseite"; }

        var pageItems = [];
        try { pageItems = page.allPageItems; } catch (e) { pageItems = []; }
        for (var pf = 0; pf < pageItems.length; pf++) {
            if (!pageItems[pf] || !pageItems[pf].isValid) continue;
            if (pageItems[pf].constructor.name !== "TextFrame") continue;
            var pageStory = getTextFrameStory(pageItems[pf]);
            var textObj = null;
            try { if (pageItems[pf].texts && pageItems[pf].texts.length > 0) textObj = pageItems[pf].texts[0]; } catch (e2) { textObj = null; }
            addGermanSpellTarget(targets, textObj, pageStory, "Dokumentseite " + (page.name || (pageIndex + 1)) + " / Musterseite " + masterName, page, pageItems[pf], normalizedSourceLang);
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

function runLanguageToolGermanFrameCheck(text, langCode) {
    var endpoint = "https://api.languagetool.org/v2/check";
    var languageToolCode = getLanguageToolCodeForLanguage(langCode);
    if (languageToolCode === "") {
        return { ok: false, error: t("languagetool_lang_not_supported", { lang: getLocalizedLanguageName(langCode) }) };
    }
    var requestId = new Date().getTime() + "_" + Math.floor(Math.random() * 100000);
    var payloadFile = new File(Folder.temp + "/lt_payload_" + requestId + ".txt");
    var outFile = new File(Folder.temp + "/lt_out_" + requestId + ".json");
    var motherTongue = languageToolCode.substring(0, 2).toLowerCase();
    var payload = "language=" + encodeURIComponent(languageToolCode) + "&motherTongue=" + encodeURIComponent(motherTongue) + "&level=picky&text=" + encodeURIComponent(String(text).replace(/\r/g, "\n"));

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

function normalizeSpellcheckComparableText(text) {
    return String(text || "").replace(/\s+$/g, "").replace(/^\s+/g, "");
}

function normalizeSpellcheckLetterText(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9à-öø-ÿā-žа-яёά-ώ]/g, "");
}

function getLanguageToolIssueType(matchObj) {
    try {
        if (matchObj && matchObj.rule && matchObj.rule.issueType) return String(matchObj.rule.issueType).toLowerCase();
    } catch (e) {}
    return "";
}

function getLanguageToolRuleFingerprint(matchObj) {
    var parts = [];
    try { if (matchObj && matchObj.rule && matchObj.rule.id) parts.push(String(matchObj.rule.id)); } catch (e) {}
    try { if (matchObj && matchObj.rule && matchObj.rule.category && matchObj.rule.category.id) parts.push(String(matchObj.rule.category.id)); } catch (e2) {}
    try { if (matchObj && matchObj.rule && matchObj.rule.category && matchObj.rule.category.name) parts.push(String(matchObj.rule.category.name)); } catch (e3) {}
    try { if (matchObj && matchObj.message) parts.push(String(matchObj.message)); } catch (e4) {}
    return parts.join(" ").toLowerCase();
}

function shouldIgnoreLanguageToolEdit(matchObj, issueText, replacementText) {
    var issueRaw = String(issueText || "");
    var replacementRaw = String(replacementText || "");
    if (issueRaw === "" || replacementRaw === "") return true;
    if (issueRaw === replacementRaw) return true;
    if (normalizeSpellcheckComparableText(issueRaw) === normalizeSpellcheckComparableText(replacementRaw) && issueRaw.replace(/\s/g, "") === replacementRaw.replace(/\s/g, "")) {
        return true;
    }
    if (normalizeSpellcheckLetterText(issueRaw) === normalizeSpellcheckLetterText(replacementRaw)) {
        return true;
    }

    var issueType = getLanguageToolIssueType(matchObj);
    var fingerprint = getLanguageToolRuleFingerprint(matchObj);
    if (issueType !== "" && issueType !== "misspelling") return true;
    if (fingerprint.match(/whitespace|typograph|duplication|double.?space|ellipsis|dash|quotation|quotes|style|grammar|register|locale|punctuat/)) {
        return true;
    }
    return false;
}

function buildLanguageToolEdits(originalText, matches) {
    var rawEdits = [];
    if (!matches || matches.length === 0) return rawEdits;

    for (var i = 0; i < matches.length; i++) {
        var matchObj = matches[i];
        if (!matchObj || !matchObj.replacements || matchObj.replacements.length === 0) continue;
        if (matchObj.offset === undefined || matchObj.length === undefined) continue;

        var issueText = originalText.substring(matchObj.offset, matchObj.offset + matchObj.length);
        var replacementText = String(matchObj.replacements[0].value || "");
        if (shouldIgnoreLanguageToolEdit(matchObj, issueText, replacementText)) continue;
        rawEdits.push({
            offset: matchObj.offset,
            length: matchObj.length,
            replacement: replacementText,
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
        langCode: item.langCode || "",
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
        var response = runLanguageToolGermanFrameCheck(currentText, correction.langCode || "");
        if (!response.ok || !response.data) return null;
        return buildGermanFrameCorrection({
            langCode: correction.langCode || "",
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

            var dlg = new Window("dialog", t("german_frame_dialog_title", { current: (i + 1), total: corrections.length }), undefined, { resizeable: true });
            dlg.orientation = "column";
            dlg.alignChildren = ["fill", "top"];
            dlg.spacing = 10;
            dlg.minimumSize = [560, 440];
            dlg.preferredSize = [620, 500];

            var headerPanel = dlg.add("panel", undefined, correction.location);
            headerPanel.orientation = "column";
            headerPanel.alignChildren = ["fill", "top"];
            headerPanel.margins = 12;
            headerPanel.spacing = 6;
            var summaryText = headerPanel.add("statictext", undefined, t("german_frame_hint_count", { count: correction.issueCount }));
            summaryText.preferredSize.width = 560;
            var actionHint = headerPanel.add("statictext", undefined, t("german_frame_action_hint"), { multiline: true });
            actionHint.preferredSize.width = 560;

            var listPanel = dlg.add("panel", undefined, t("german_findings"));
            listPanel.orientation = "column";
            listPanel.alignChildren = ["fill", "top"];
            listPanel.margins = 12;
            var issueList = listPanel.add("listbox", undefined, [], { multiselect: false });
            issueList.preferredSize = [560, 130];
            for (var issueIndex = 0; issueIndex < correction.edits.length; issueIndex++) {
                var issue = correction.edits[issueIndex];
                issueList.add("item", (issueIndex + 1) + ". " + makeGermanTextVisible(issue.issueText) + " -> " + makeGermanTextVisible(issue.replacement));
            }

            var detailPanel = dlg.add("panel", undefined, t("german_current_hit"));
            detailPanel.orientation = "column";
            detailPanel.alignChildren = ["fill", "top"];
            detailPanel.margins = 12;
            detailPanel.spacing = 8;

            detailPanel.add("statictext", undefined, t("german_find_label"));
            var issueBox = detailPanel.add("edittext", undefined, "", { readonly: true });
            issueBox.preferredSize.width = 560;

            detailPanel.add("statictext", undefined, t("german_replace_label"));
            var replacementBox = detailPanel.add("edittext", undefined, "", { readonly: true });
            replacementBox.preferredSize.width = 560;

            detailPanel.add("statictext", undefined, t("german_hint"));
            var messageBox = detailPanel.add("edittext", undefined, "", { multiline: true, readonly: true });
            messageBox.preferredSize = [560, 52];

            detailPanel.add("statictext", undefined, t("german_context"));
            var contextBox = detailPanel.add("edittext", undefined, "", { multiline: true, readonly: true, scrolling: true });
            contextBox.preferredSize = [560, 90];

            var selectedEditIndex = 0;
            function updateIssuePreview() {
                if (!issueList.selection) return;
                selectedEditIndex = issueList.selection.index;
                var selectedIssue = correction.edits[selectedEditIndex];
                issueBox.text = makeGermanTextVisible(selectedIssue.issueText);
                replacementBox.text = makeGermanTextVisible(selectedIssue.replacement);
                messageBox.text = selectedIssue.message;
                contextBox.text = selectedIssue.contextParts.before + "[" + selectedIssue.contextParts.issue + "]" + selectedIssue.contextParts.after;
                highlightGermanIssue(correction, selectedIssue);
            }
            if (issueList.items.length > 0) {
                issueList.selection = 0;
                updateIssuePreview();
            }
            issueList.onChange = updateIssuePreview;

            var btnGroup = dlg.add("group");
            btnGroup.alignment = "fill";
            btnGroup.spacing = 10;
            var btnSkip = btnGroup.add("button", undefined, t("german_keep"), { name: "cancel" });
            btnSkip.preferredSize = [120, 28];
            var btnSpacer = btnGroup.add("statictext", undefined, "");
            btnSpacer.alignment = "fill";
            var btnReplace = btnGroup.add("button", undefined, t("german_apply"), { name: "ok" });
            btnReplace.preferredSize = [140, 30];
            var btnStop = btnGroup.add("button", undefined, t("german_finish"));
            btnStop.preferredSize = [120, 28];

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
                try {
                    germanSpellDialogLocation = [
                        getBoundsCoordinate(this.bounds, "left", 0, 0),
                        getBoundsCoordinate(this.bounds, "top", 1, 0)
                    ];
                } catch (locationErr) {}
                clearGermanIssueHighlight();
                return true;
            };
            dlg.onShow = function() {
                if (germanSpellDialogLocation && germanSpellDialogLocation.length === 2) {
                    try {
                        dlg.location = [germanSpellDialogLocation[0], germanSpellDialogLocation[1]];
                        return;
                    } catch (storedLocationErr) {}
                }
                positionDialogRightOfMainWindow(dlg, 620, 500);
            };
            dlg.onResizing = dlg.onResize = function() {
                this.layout.resize();
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
    var sourceLangCode = detectSourceLanguageCode(doc);
    if (sourceLangCode === "") {
        alert(t("source_lang_not_detected"));
        return;
    }
    var sourceLangLabel = getLocalizedLanguageName(sourceLangCode);
    var targets = collectGermanSpellTargets(doc, sourceLangCode);
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
    var firstCheckError = "";

    for (var i = 0; i < targets.length; i++) {
        var item = targets[i];
        progressBarLocal.value = i + 1;
        progressTextLocal.text = t("german_check_progress", { lang: sourceLangLabel, current: (i + 1), total: targets.length });
        progressWin.update();
        try {
            var response = runLanguageToolGermanFrameCheck(item.text, sourceLangCode);
            if (!response.ok || !response.data) {
                skippedTexts++;
                if (!firstCheckError && response && response.error) firstCheckError = String(response.error);
                continue;
            }
            var matches = response.data.matches || [];
            var correction = buildGermanFrameCorrection(item, matches);
            if (correction) corrections.push(correction);
        } catch (e) {
            skippedTexts++;
            if (!firstCheckError) firstCheckError = (e && e.message) ? String(e.message) : String(e);
        }
    }

    progressWin.close();

    if (corrections.length === 0) {
        if (skippedTexts === targets.length && firstCheckError !== "") {
            alert(t("german_check_failed_all_skipped", { count: skippedTexts, reason: firstCheckError }));
            return;
        }
        var okMessage = t("german_check_ok", { lang: sourceLangLabel });
        if (skippedTexts > 0) {
            okMessage += firstCheckError !== ""
                ? t("german_check_notice_skipped_with_reason", { count: skippedTexts, reason: firstCheckError })
                : t("german_check_notice_skipped", { count: skippedTexts });
        }
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
    refreshMainValidationUI();
    var validationIssues = getMainValidationIssues();
    if (validationIssues.length > 0) {
        alert(validationIssues[0]);
        return;
    }

    var doc = getActiveDocumentSafe();
    if (!doc || !doc.isValid) {
        alert(t("no_document_open"));
        return;
    }

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
    
    // Prüfen, ob API-Key des aktiven Providers hinterlegt ist
    var providerValidationMessage = getProviderValidationMessage(getActiveTranslationProvider());
    if (providerValidationMessage !== "") {
        alert(providerValidationMessage || t("validation_enter_api_key"));
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
    writeLog("Dokument: " + doc.name + " | Modus: " + config.mode + " | Zielsprache: " + config.lang + " | Provider: " + getTranslationProviderDisplayName(getActiveTranslationProvider()));
    beginDebugSession(doc, config);

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
            reportFile.writeln("Übersetzungsanbieter: " + getTranslationProviderDisplayName(getActiveTranslationProvider()));
            reportFile.writeln("DeepL-Key gesetzt: " + ((apiKey && apiKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("OpenAI-Key gesetzt: " + ((openAIKey && openAIKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("OpenAI-Modell: " + (openAIModel || "(leer)"));
            reportFile.writeln("Gemini-Key gesetzt: " + ((geminiKey && geminiKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("Gemini-Modell: " + (geminiModel || "(leer)"));
            reportFile.writeln("Claude-Key gesetzt: " + ((claudeKey && claudeKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("Claude-Modell: " + (claudeModel || "(leer)"));
            reportFile.writeln("Lokale Base URL: " + (localLLMBaseURL || "(leer)"));
            reportFile.writeln("Lokaler API-Key gesetzt: " + ((localLLMApiKey && localLLMApiKey !== "") ? "Ja" : "Nein"));
            reportFile.writeln("Lokales Modell: " + (localLLMModel || "(leer)"));
            reportFile.writeln("CSV-Pfad: " + (csvPath || "(leer)"));
            reportFile.writeln("TM-Pfad: " + (tmPath || "(leer)"));
            reportFile.writeln("Referenz-Symbole: " + (refSymbolsSetting || "[]"));
            reportFile.writeln("Formality: " + (formalitySetting || "default"));
            reportFile.writeln("DNT Styles: " + (dntStyles || "(leer)"));
            reportFile.writeln("Debug Tabellen/Bilder: " + (tableRestoreDebugEnabled ? "Ja" : "Nein"));
            reportFile.writeln("Debug-Log Pfad: " + debugLogPath);
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
    var normalized = String(masterName || "").replace(/^\s+|\s+$/g, "");
    if (/^[a-z]{2}$/i.test(normalized)) return normalized.toLowerCase();
    var match = normalized.match(/(?:^|[-_])([a-z]{2})(?:[-_]|$)/i);
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
    return getDefaultProviderTargetLangCode(code);
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
        var translated = translateBatchWithProvider(texts, deepLLang, 10, 20);
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
    saveHyperlinkSettings(normalizedSymbols);

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

function restoreParkedTablesAndImages(doc, storageEnv, globalParkedTables, globalParkedImages) {
    var unresolvedTables = [];
    var unresolvedImages = [];
    var unresolvedImageIds = {};
    var restoredImageIds = {};
    var leftoverMarkerCount = 0;
    writeDebugLog("restore:start parkedTables=" + globalParkedTables.length +
        " parkedImages=" + globalParkedImages.length +
        " storagePage=" + getDebugPageLabel(storageEnv ? storageEnv.page : null));
    try {
        if (storageEnv && storageEnv.frame && storageEnv.frame.isValid) {
            writeDebugLog("restore:storage frameValid=true storageItems=" + storageEnv.frame.allPageItems.length);
        } else {
            writeDebugLog("restore:storage frameValid=false", "WARNUNG");
        }
    } catch (storageInfoErr) {}
    try {
        app.findGrepPreferences = NothingEnum.nothing;
        app.changeGrepPreferences = NothingEnum.nothing;
    } catch (prefErr) {}

    try {
        for (var i = globalParkedTables.length - 1; i >= 0; i--) {
            var parked = globalParkedTables[i];
            var tableRestored = false;
            app.findGrepPreferences.findWhat = "###TBL_\\s*" + parked.id + "\\s*###";
            var results = doc.findGrep();
            writeDebugLog("restore:table marker=" + parked.marker +
                " sourceKey=" + (parked.sourceKey || "") +
                " matches=" + results.length);
            if (results.length > 0) {
                try {
                    parked.frame.characters.item(0).move(LocationOptions.AFTER, results[0].insertionPoints.item(0));
                    results[0].remove();
                    tableRestored = true;
                    writeDebugLog("restore:table success marker=" + parked.marker);
                } catch (e1) {}
            }
            if (!tableRestored) {
                unresolvedTables.push(parked);
                writeLog("Tabellen-Platzhalter konnte nicht sicher wiederhergestellt werden (" + parked.marker + "). Die Tabelle bleibt im Layer TEMP_TRANS_IMAGES.", "WARNUNG");
                writeDebugLog("restore:table unresolved marker=" + parked.marker, "WARNUNG");
            } else {
                try { if (parked.frame && parked.frame.isValid) parked.frame.remove(); } catch (e3) {}
            }
        }

        try { if (storageEnv.frame && storageEnv.frame.isValid) storageEnv.frame.itemLayer.visible = true; } catch (e4) {}

        var restorePasses = 0;
        var restoreLimit = Math.max(10000, (globalParkedImages && globalParkedImages.length ? globalParkedImages.length * 4 : 0));
        while (restorePasses < restoreLimit) {
            app.findGrepPreferences.findWhat = "###IMG_\\s*\\d+\\s*###";
            var allFoundImages = doc.findGrep();
            if (!allFoundImages || allFoundImages.length === 0) break;
            writeDebugLog("restore:image pass=" + restorePasses + " placeholders=" + allFoundImages.length);

            var restoredOne = false;
            for (var f = allFoundImages.length - 1; f >= 0; f--) {
                var placeholderRange = allFoundImages[f];
                if (!placeholderRange || !placeholderRange.isValid) continue;

                var match = placeholderRange.contents.match(/IMG_\s*(\d+)/);
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
                writeDebugLog("restore:image marker=###IMG_" + imgID + "### storageFound=" + (targetImageInStorage !== null));
                if (targetImageInStorage === null) {
                    if (!unresolvedImageIds[imgID]) {
                        unresolvedImageIds[imgID] = true;
                        writeLog("Geparktes Bild/Objekt wurde im Temp-Speicher nicht gefunden (###IMG_" + imgID + "###).", "WARNUNG");
                    }
                    continue;
                }

                try {
                    var targetChar = targetImageInStorage.parent;
                    while (targetChar && targetChar.constructor.name !== "Character" && targetChar.constructor.name !== "Story" && targetChar.constructor.name !== "Application") targetChar = targetChar.parent;
                    if (targetChar && targetChar.constructor.name === "Character") {
                        targetChar.move(LocationOptions.AFTER, placeholderRange.insertionPoints.item(0));
                        placeholderRange.remove();
                        restoredImageIds[imgID] = true;
                        restoredOne = true;
                        writeDebugLog("restore:image success marker=###IMG_" + imgID + "### via=character");
                        break;
                    } else if (targetImageInStorage.parent && targetImageInStorage.parent.isValid) {
                        targetImageInStorage.parent.move(LocationOptions.AFTER, placeholderRange.insertionPoints.item(0));
                        placeholderRange.remove();
                        restoredImageIds[imgID] = true;
                        restoredOne = true;
                        writeDebugLog("restore:image success marker=###IMG_" + imgID + "### via=parent");
                        break;
                    }
                } catch (e5) {
                    if (!unresolvedImageIds[imgID]) {
                        unresolvedImageIds[imgID] = true;
                        writeLog("Bild/Objekt konnte nicht wiederhergestellt werden (###IMG_" + imgID + "###).", "WARNUNG");
                    }
                    writeDebugLog("restore:image failed marker=###IMG_" + imgID + "### error=" + (e5.message || e5), "WARNUNG");
                }
            }

            if (!restoredOne) {
                writeDebugLog("restore:image stalled pass=" + restorePasses + " no placeholder could be restored.", "WARNUNG");
                break;
            }
            restorePasses++;
        }

        if (globalParkedImages && globalParkedImages.length > 0) {
            for (var p = 0; p < globalParkedImages.length; p++) {
                var parkedImage = globalParkedImages[p];
                if (!parkedImage) continue;
                if (!restoredImageIds[parkedImage.id]) {
                    unresolvedImages.push(parkedImage);
                    if (!unresolvedImageIds[parkedImage.id]) {
                        unresolvedImageIds[parkedImage.id] = true;
                        writeLog("Bild/Objekt konnte nicht vollstaendig wiederhergestellt werden (" + parkedImage.marker + "). Es bleibt im Layer TEMP_TRANS_IMAGES.", "WARNUNG");
                    }
                }
            }
        }

        app.findGrepPreferences.findWhat = "###(?:IMG|TBL)_\\s*\\d+\\s*###";
        var leftoverMarkers = doc.findGrep();
        leftoverMarkerCount = leftoverMarkers ? leftoverMarkers.length : 0;
        if (leftoverMarkerCount > 0) {
            var markerSamples = [];
            for (var lm = 0; lm < leftoverMarkers.length && lm < 10; lm++) {
                var markerInfo = leftoverMarkers[lm].contents;
                try { markerInfo += " {" + getDebugMarkerLocation(leftoverMarkers[lm]) + "}"; } catch (markerInfoErr) {}
                markerSamples.push(markerInfo);
            }
            writeLog("Nach dem Restore verbleiben " + leftoverMarkerCount + " Platzhalter im Dokument" + (markerSamples.length ? ": " + markerSamples.join(", ") : "") + ".", "WARNUNG");
            writeDebugLog("restore:leftoverMarkers count=" + leftoverMarkerCount + (markerSamples.length ? " samples=" + markerSamples.join(", ") : ""), "WARNUNG");
        }
    } catch (restoreErr) {
        writeLog("Fehler beim Wiederherstellen von Tabellen/Bildern: " + (restoreErr.message || restoreErr), "WARNUNG");
        writeDebugLog("restore:error " + (restoreErr.message || restoreErr), "WARNUNG");
    } finally {
        try { app.findGrepPreferences = NothingEnum.nothing; } catch (e6) {}
        try { app.changeGrepPreferences = NothingEnum.nothing; } catch (e7) {}
        writeDebugLog("restore:end unresolvedTables=" + unresolvedTables.length +
            " unresolvedImages=" + unresolvedImages.length +
            " leftoverMarkers=" + leftoverMarkerCount);
        if (unresolvedTables.length === 0 && unresolvedImages.length === 0 && leftoverMarkerCount === 0) {
            try { if (storageEnv.frame && storageEnv.frame.isValid) storageEnv.frame.remove(); } catch (e8) {}
            try { doc.layers.itemByName("TEMP_TRANS_IMAGES").visible = false; } catch (e9) {}
        } else {
            try { if (storageEnv.frame && storageEnv.frame.isValid) storageEnv.frame.itemLayer.visible = true; } catch (e10) {}
            writeLog("TEMP_TRANS_IMAGES wurde beibehalten, da " + unresolvedTables.length + " Tabellen, " + unresolvedImages.length + " Bilder/Objekte und " + leftoverMarkerCount + " Platzhalter offen sind.", "WARNUNG");
        }
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

    writeDebugLog("executeTranslation:start lang=" + selectedLang +
        " pagesMode=" + pagesMode +
        " rawTargets=" + textTargetsRaw.length +
        " dedupedTargets=" + textTargets.length +
        " pageSpec=" + (pagesMode ? pagesString : "(selection)"));
    for (var targetDebugIndex = 0; targetDebugIndex < textTargets.length && targetDebugIndex < 20; targetDebugIndex++) {
        writeDebugLog("executeTranslation:target[" + targetDebugIndex + "] " + getDebugTextTargetLabel(textTargets[targetDebugIndex]));
    }
    if (textTargets.length > 20) writeDebugLog("executeTranslation:weitere Ziele=" + (textTargets.length - 20));

    var globalParkedTables = []; var globalParkedImages = []; var tableCounter = 0; var imageCounter = 0;

    try {
        for (var i = 0; i < textTargets.length; i++) {
            if (cancelFlag) throw new Error("CANCELLED");
            var currentText = textTargets[i];
            if (!currentText.isValid || currentText.characters.length === 0) continue;
            
            if (currentText.tables && currentText.tables.length > 0) {
                var tables = currentText.tables.everyItem().getElements();
                for (var tableReverseIndex = tables.length - 1; tableReverseIndex >= 0; tableReverseIndex--) {
                    var tbl = tables[tableReverseIndex]; var tblId = ++tableCounter; 
                    var marker = "###TBL_" + tblId + "###";
                    var tmpFrame = storageEnv.page.textFrames.add({itemLayer: storageEnv.layer, geometricBounds: [0,-100, 50, -50]});
                    var sourceKey = getTextObjectRangeKey(currentText);
                    writeDebugLog("table_park:start marker=" + marker +
                        " sourceKey=" + sourceKey +
                        " | " + getTableDebugSummary(tbl) +
                        " | " + getDebugTextTargetLabel(currentText));
                    
                    var p = tbl.storyOffset.parent; var idx = tbl.storyOffset.index;
                    p.characters.item(idx).move(LocationOptions.AFTER, tmpFrame.insertionPoints.item(0));
                    globalParkedTables.push({ id: tblId, marker: marker, frame: tmpFrame, sourceKey: sourceKey });
                    p.insertionPoints.item(idx).contents = marker;
                    
                    var pastedTbl = tmpFrame.tables[0];
                    if (pastedTbl) {
                        var cells = pastedTbl.cells.everyItem().getElements();
                        for (var c = 0; c < cells.length; c++) addTarget(cells[c].texts[0]);
                        writeDebugLog("table_park:done marker=" + marker + " nestedCellTargets=" + cells.length);
                    } else {
                        writeDebugLog("table_park:warning marker=" + marker + " pastedTbl fehlt nach dem Parken.", "WARNUNG");
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
                    var imgLabel = "TMP_IMG_" + imgID;
                    var anchoredItem = null;
                    try {
                        if (anchorChar.pageItems.length > 0) anchoredItem = anchorChar.pageItems[0];
                        else if (anchorChar.allPageItems.length > 0) anchoredItem = anchorChar.allPageItems[0];
                    } catch (anchorLookupErr) { anchoredItem = null; }
                    if (!anchoredItem || !anchoredItem.isValid) {
                        writeLog("Verankertes Objekt konnte nicht sicher geparkt werden (" + marker + ").", "WARNUNG");
                        writeDebugLog("image_park:missing marker=" + marker + " | " + getDebugTextTargetLabel(currentText), "WARNUNG");
                        continue;
                    }
                    try {
                        anchoredItem.label = imgLabel;
                    } catch (anchorLabelErr) {
                        writeLog("Verankertes Objekt konnte nicht gelabelt werden (" + marker + ").", "WARNUNG");
                        writeDebugLog("image_park:label_failed marker=" + marker + " error=" + (anchorLabelErr.message || anchorLabelErr), "WARNUNG");
                        continue;
                    }
                    writeDebugLog("image_park:start marker=" + marker +
                        " label=" + imgLabel +
                        " type=" + anchoredItem.constructor.name +
                        " | " + getDebugTextTargetLabel(currentText));
                    
                    var p = anchorChar.parent; var idx = anchorChar.index;
                    anchorChar.move(LocationOptions.AFTER, storageEnv.frame.insertionPoints.item(-1));
                    p.insertionPoints.item(idx).contents = marker;
                    globalParkedImages.push({ id: imgID, marker: marker, label: imgLabel, sourceKey: getTextObjectRangeKey(currentText) });

                    try {
                        var sItems = storageEnv.frame.allPageItems; var movedItem = null;
                        for(var j = sItems.length - 1; j >= 0; j--){ if(sItems[j].label === imgLabel) { movedItem = sItems[j]; break; } }
                        if (movedItem) {
                            var safeAddNestedTarget = function(tfItem) { var nStory; try { nStory = tfItem.parentStory; } catch(e) { nStory = tfItem.texts[0]; } addTarget(nStory); };
                            if (movedItem.constructor.name === "TextFrame") safeAddNestedTarget(movedItem);
                            if (movedItem.hasOwnProperty("allPageItems")) {
                                var nestedItems = movedItem.allPageItems;
                                for (var ni = 0; ni < nestedItems.length; ni++) { if (nestedItems[ni].constructor.name === "TextFrame") safeAddNestedTarget(nestedItems[ni]); }
                            }
                        }
                    } catch(e) {}
                    writeDebugLog("image_park:done marker=" + marker + " label=" + imgLabel);
                }
            } catch (e) {}
        }

        writeDebugLog("parking:summary tables=" + globalParkedTables.length + " images=" + globalParkedImages.length + " targetsNow=" + textTargets.length);
    
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

        var translationQueue = [];
        var finalTranslations = new Array(textTargets.length);
        var tmHitCount = 0;
        var exactGlossaryHitCount = 0;
        var emptyCount = 0;

        for (var i = 0; i < textTargets.length; i++) {
            if (!textTargets[i].isValid || textTargets[i].characters.length === 0) { finalTranslations[i] = ""; emptyCount++; continue; }

            var sourceContents = "";
            try { sourceContents = String(textTargets[i].contents); } catch (e0) { sourceContents = ""; }
            var glossaryMatchInText = glossaryAffectsText(sourceContents, glossaryRuntime);
            var exactGlossaryOverride = getExactGlossaryOverrideForText(parsedGlossary, sourceContents, selectedLang);
            if (exactGlossaryOverride !== null) {
                var exactReplacement = (exactGlossaryOverride === "###DNT###") ? sourceContents : exactGlossaryOverride;
                finalTranslations[i] = buildStyledPlainTextXML(textTargets[i], exactReplacement);
                globalStats.savedChars += normalizeGlossaryLookupText(sourceContents).replace(/[\s\d.,:;"'!?\-+*\/=()[\]{}&%$§<>|\\~`]/g, '').length;
                exactGlossaryHitCount++;
                continue;
            }
            
            var xml = buildXMLWithGlossary(textTargets[i]);
            var textOnlyLength = xml.replace(/<[^>]+>/g, '').replace(/###(?:IMG|TBL)_\d+###/g, '').replace(/[\s\d.,:;"'!?\-+*\/=()[\]{}&%$§<>|\\~`]/g, '').length; 
            
            if (xml === "<root></root>" || xml === "" || textOnlyLength === 0) { 
                finalTranslations[i] = ""; 
                emptyCount++;
            } else if (!glossaryMatchInText && tm[selectedLang][xml]) {
                finalTranslations[i] = normalizeTranslatedXML(tm[selectedLang][xml]);
                globalStats.savedChars += textOnlyLength;
                tmHitCount++;
            } else {
                translationQueue.push({ index: i, xml: xml, len: textOnlyLength });
                finalTranslations[i] = null;
            }
        }
        writeDebugLog("translation:summary exactGlossaryHits=" + exactGlossaryHitCount +
            " tmHits=" + tmHitCount +
            " provider=" + getActiveTranslationProvider() +
            " translationQueue=" + translationQueue.length +
            " emptyTargets=" + emptyCount);
        
        if (translationQueue.length > 0) {
            var justXMLs = [];
            for(var q=0; q < translationQueue.length; q++) justXMLs.push(translationQueue[q].xml);
            
            var translatedBatch = translateBatchWithProvider(justXMLs, selectedLang, overStartPct, overEndPct);
            if (!translatedBatch || translatedBatch.length !== translationQueue.length) {
                throw new Error(t(getProviderStringKey(getActiveTranslationProvider(), "incomplete")));
            }

            var tmUpdated = false;
            for(var q=0; q < translationQueue.length; q++) {
                var trXML = translatedBatch[q];
                if (trXML) { 
                    trXML = normalizeTranslatedXML(trXML);
                    finalTranslations[translationQueue[q].index] = trXML;
                    tm[selectedLang][translationQueue[q].xml] = trXML;
                    tmUpdated = true;
                    globalStats.apiChars += translationQueue[q].len;
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
        restoreParkedTablesAndImages(doc, storageEnv, globalParkedTables, globalParkedImages);
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

function compareStringArrays(arrA, arrB) {
    if (arrA.length !== arrB.length) return false;
    for (var i = 0; i < arrA.length; i++) {
        if (String(arrA[i]) !== String(arrB[i])) return false;
    }
    return true;
}

function stripMarkdownCodeFence(text) {
    var raw = String(text || "").replace(/^\s+|\s+$/g, "");
    if (/^```/.test(raw)) {
        raw = raw.replace(/^```[a-z0-9_-]*\s*/i, "").replace(/\s*```$/i, "");
    }
    return raw.replace(/^\s+|\s+$/g, "");
}

function canonicalizeTTagAttributes(xml) {
    var order = { f: 0, s: 1, z: 2, p: 3, l: 4, c: 5, k: 6, a: 7, li: 8, fi: 9, b: 10 };
    return String(xml || "").replace(/<t\b([^>]*)>/gi, function(fullMatch, attrText) {
        var attrs = [];
        var match = null;
        var regex = /([a-z]+)\s*=\s*"([^"]*)"/gi;
        while ((match = regex.exec(attrText)) !== null) {
            attrs.push({ name: String(match[1] || "").toLowerCase(), value: String(match[2] || "") });
        }
        if (attrs.length === 0) return "<t>";
        attrs.sort(function(a, b) {
            var aOrder = order.hasOwnProperty(a.name) ? order[a.name] : 100;
            var bOrder = order.hasOwnProperty(b.name) ? order[b.name] : 100;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0);
        });
        var parts = [];
        for (var i = 0; i < attrs.length; i++) {
            parts.push(attrs[i].name + '="' + attrs[i].value + '"');
        }
        return "<t " + parts.join(" ") + ">";
    });
}

function normalizeStructuredXMLCandidate(xml, sourceXML) {
    var raw = stripMarkdownCodeFence(xml);
    raw = raw.replace(/<\?xml[\s\S]*?\?>/gi, "");
    raw = raw.replace(/<(tab|pbr|lbr)\s*>\s*<\/\1>/gi, function(fullMatch, tagName) {
        return "<" + String(tagName || "").toLowerCase() + "/>";
    });
    raw = raw.replace(/<(tab|pbr|lbr)\s*\/\s*>/gi, function(fullMatch, tagName) {
        return "<" + String(tagName || "").toLowerCase() + "/>";
    });
    raw = raw.replace(/<(\/?)root\b[^>]*>/gi, function(fullMatch, slash) {
        return slash ? "</root>" : "<root>";
    });
    raw = raw.replace(/<(\/?)nt\b[^>]*>/gi, function(fullMatch, slash) {
        return slash ? "</nt>" : "<nt>";
    });
    raw = raw.replace(/<\/t\b[^>]*>/gi, "</t>");
    raw = canonicalizeTTagAttributes(raw);
    if (sourceXML && /<root>/i.test(String(sourceXML)) && !/<root>/i.test(raw) && /<t\b/i.test(raw)) {
        raw = "<root>" + raw + "</root>";
    }
    return normalizeTranslatedXML(raw);
}

function getXMLTagTokens(xml) {
    var matches = String(xml || "").match(/<[^>]+>/g);
    return matches ? matches : [];
}

function getNoTranslateSegments(xml) {
    var matches = [];
    var regex = /<nt>([\s\S]*?)<\/nt>/g;
    var match = null;
    var raw = String(xml || "");
    while ((match = regex.exec(raw)) !== null) matches.push(match[1]);
    return matches;
}

function getProtectedMarkerTokens(xml) {
    var matches = String(xml || "").match(/###(?:IMG|TBL)_\d+###/g);
    return matches ? matches : [];
}

function validateStructuredXMLTranslation(sourceXML, translatedXML) {
    var sourceNorm = normalizeStructuredXMLCandidate(sourceXML, sourceXML);
    var translatedNorm = normalizeStructuredXMLCandidate(translatedXML, sourceXML);
    if (sourceNorm === "" || translatedNorm === "") return false;
    if (!compareStringArrays(getXMLTagTokens(sourceNorm), getXMLTagTokens(translatedNorm))) return false;
    if (!compareStringArrays(getNoTranslateSegments(sourceNorm), getNoTranslateSegments(translatedNorm))) return false;
    if (!compareStringArrays(getProtectedMarkerTokens(sourceNorm), getProtectedMarkerTokens(translatedNorm))) return false;
    return true;
}

function extractOpenAIFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.error && parsedObj.error.message) msg = parsedObj.error.message;
        else if (parsedObj && parsedObj.message) msg = parsedObj.message;
        else if (parsedObj && parsedObj.status && parsedObj.status !== "completed") msg = "status=" + parsedObj.status;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("openai_unknown_response");
    return msg;
}

function extractOpenAIOutputText(parsedObj) {
    try {
        if (parsedObj && parsedObj.output_text) return String(parsedObj.output_text);
    } catch (e) {}

    var parts = [];
    var output = (parsedObj && parsedObj.output) ? parsedObj.output : [];
    for (var i = 0; i < output.length; i++) {
        var message = output[i];
        var content = (message && message.content) ? message.content : [];
        for (var j = 0; j < content.length; j++) {
            var item = content[j];
            if (!item) continue;
            if (item.type === "refusal") {
                throw new Error(t("openai_refusal", { message: (item.refusal || t("openai_unknown_response")) }));
            }
            if (item.type === "output_text" && item.text !== undefined && item.text !== null) {
                parts.push(String(item.text));
            }
        }
    }
    return parts.join("");
}

function buildStructuredBatchTranslationPrompt(textsArray, targetLangCode) {
    var prompt = "";
    prompt += "Target language code: " + targetLangCode + "\n";
    prompt += "Translate each XML fragment into the target language.\n";
    prompt += "Preserve every XML tag and every attribute exactly as provided.\n";
    prompt += "Only translate human-readable text nodes.\n";
    prompt += "Do not translate or alter text inside <nt>...</nt>.\n";
    prompt += "Do not change placeholders like ###IMG_1### or ###TBL_1###.\n";
    prompt += "Keep entities and structure such as <root>, <t>, <tab/>, <pbr/>, and <lbr/> unchanged.\n";
    if (formalitySetting === "more") prompt += "Use a formal and polite register where the target language supports it.\n";
    else if (formalitySetting === "less") prompt += "Use an informal and direct register where the target language supports it.\n";
    else prompt += "Use the most natural default register for the target language.\n";
    prompt += "Return JSON only with a translations array that has the same order and length as the input.\n\n";
    for (var i = 0; i < textsArray.length; i++) {
        prompt += "[" + (i + 1) + "]\n" + String(textsArray[i] || "") + "\n\n";
    }
    return prompt;
}

function buildOpenAITranslationPrompt(textsArray, targetLangCode) {
    return buildStructuredBatchTranslationPrompt(textsArray, targetLangCode);
}

function buildStructuredRepairPrompt(sourceXML, candidateXML, targetLangCode) {
    var prompt = "";
    prompt += "Target language code: " + targetLangCode + "\n";
    prompt += "You will receive a source XML fragment and a candidate translation.\n";
    prompt += "Repair the candidate so that it matches the exact XML/tag/attribute structure of the source.\n";
    prompt += "Keep the translated wording from the candidate where possible.\n";
    prompt += "Do not translate or alter text inside <nt>...</nt>.\n";
    prompt += "Do not change placeholders like ###IMG_1### or ###TBL_1###.\n";
    prompt += "Use exactly the same tags and attributes as the source, including <root>, <t>, <tab/>, <pbr/>, and <lbr/>.\n";
    prompt += "Return JSON only with one property named translation.\n\n";
    prompt += "[SOURCE]\n" + String(sourceXML || "") + "\n\n";
    prompt += "[CANDIDATE]\n" + String(candidateXML || "") + "\n";
    return prompt;
}

function buildOpenAIRepairPrompt(sourceXML, candidateXML, targetLangCode) {
    return buildStructuredRepairPrompt(sourceXML, candidateXML, targetLangCode);
}

function buildStructuredSingleTranslationPrompt(sourceXML, targetLangCode) {
    var prompt = "";
    prompt += "Target language code: " + targetLangCode + "\n";
    prompt += "Translate this single XML fragment into the target language.\n";
    prompt += "Preserve every XML tag and every attribute exactly as provided.\n";
    prompt += "Only translate human-readable text nodes.\n";
    prompt += "Do not translate or alter text inside <nt>...</nt>.\n";
    prompt += "Do not change placeholders like ###IMG_1### or ###TBL_1###.\n";
    prompt += "Keep entities and structure such as <root>, <t>, <tab/>, <pbr/>, and <lbr/> unchanged.\n";
    if (formalitySetting === "more") prompt += "Use a formal and polite register where the target language supports it.\n";
    else if (formalitySetting === "less") prompt += "Use an informal and direct register where the target language supports it.\n";
    else prompt += "Use the most natural default register for the target language.\n";
    prompt += "Return JSON only with one property named translation.\n\n";
    prompt += String(sourceXML || "") + "\n";
    return prompt;
}

function buildOpenAISingleTranslationPrompt(sourceXML, targetLangCode) {
    return buildStructuredSingleTranslationPrompt(sourceXML, targetLangCode);
}

function getBatchTranslationJSONSchema() {
    return {
        type: "object",
        properties: {
            translations: {
                type: "array",
                items: { type: "string" }
            }
        },
        required: ["translations"],
        additionalProperties: false
    };
}

function getSingleTranslationJSONSchema() {
    return {
        type: "object",
        properties: {
            translation: { type: "string" }
        },
        required: ["translation"],
        additionalProperties: false
    };
}

function requestOpenAIResponseObject(payloadObj) {
    var endpoint = "https://api.openai.com/v1/responses";
    var payloadFile = new File(Folder.temp + "/oai_pay_" + new Date().getTime() + ".json");
    var outFile = null;
    payloadFile.encoding = "UTF-8";
    payloadFile.open("w");
    payloadFile.write(serializeJSON(payloadObj));
    payloadFile.close();

    try {
        var resultJSON = "";
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Content-Type: application/json' -H 'Authorization: Bearer " + openAIKey + "' --data-binary @'" + payloadFile.fsName + "'";
            resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            outFile = new File(Folder.temp + "/oai_out_" + new Date().getTime() + ".json");
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Content-Type: application/json"" -H ""Authorization: Bearer ' + openAIKey + '"" --data-binary @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultJSON = outFile.read();
                outFile.close();
                try { outFile.remove(); } catch (outRemoveErr) {}
                outFile = null;
            }
        }

        var parsedObj = null;
        try {
            parsedObj = eval("(" + resultJSON + ")");
        } catch (parseError) {
            throw new Error(t("openai_parse_error"));
        }
        if (!parsedObj || parsedObj.error) {
            throw new Error(t("openai_error_prefix", { message: extractOpenAIFailureMessage(resultJSON, parsedObj) }));
        }
        return parsedObj;
    } finally {
        try { payloadFile.remove(); } catch (payloadRemoveErr) {}
        try { if (outFile && outFile.exists) outFile.remove(); } catch (outCleanupErr) {}
    }
}

function extractLocalLLMFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.error && parsedObj.error.message) msg = parsedObj.error.message;
        else if (parsedObj && parsedObj.message) msg = parsedObj.message;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("local_unknown_response");
    return msg;
}

function requestLocalLLMChatCompletionObject(payloadObj) {
    var baseURL = normalizeLocalLLMBaseURL(localLLMBaseURL);
    var endpoint = baseURL + "/chat/completions";
    var payloadFile = new File(Folder.temp + "/loc_pay_" + new Date().getTime() + ".json");
    var outFile = null;
    payloadFile.encoding = "UTF-8";
    payloadFile.open("w");
    payloadFile.write(serializeJSON(payloadObj));
    payloadFile.close();

    try {
        var resultJSON = "";
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Content-Type: application/json'";
            if (localLLMApiKey && localLLMApiKey !== "") curlCmd += " -H 'Authorization: Bearer " + localLLMApiKey + "'";
            curlCmd += " --data-binary @'" + payloadFile.fsName + "'";
            resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            outFile = new File(Folder.temp + "/loc_out_" + new Date().getTime() + ".json");
            var authHeaderPart = (localLLMApiKey && localLLMApiKey !== "") ? ' -H ""Authorization: Bearer ' + localLLMApiKey + '""' : '';
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Content-Type: application/json""' + authHeaderPart + ' --data-binary @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultJSON = outFile.read();
                outFile.close();
                try { outFile.remove(); } catch (outRemoveErr) {}
                outFile = null;
            }
        }

        var parsedObj = null;
        try {
            parsedObj = eval("(" + resultJSON + ")");
        } catch (parseError) {
            throw new Error(t("local_parse_error"));
        }
        if (!parsedObj || parsedObj.error) {
            throw new Error(t("local_error_prefix", { message: extractLocalLLMFailureMessage(resultJSON, parsedObj) }));
        }
        return parsedObj;
    } finally {
        try { payloadFile.remove(); } catch (payloadRemoveErr) {}
        try { if (outFile && outFile.exists) outFile.remove(); } catch (outCleanupErr) {}
    }
}

function parseLocalLLMStructuredOutput(parsedObj) {
    var outputText = "";
    try {
        if (parsedObj && parsedObj.choices && parsedObj.choices.length > 0 &&
            parsedObj.choices[0].message && parsedObj.choices[0].message.content !== undefined &&
            parsedObj.choices[0].message.content !== null) {
            outputText = String(parsedObj.choices[0].message.content);
        }
    } catch (e) {}
    outputText = stripMarkdownCodeFence(outputText);
    if (!outputText || outputText === "") {
        throw new Error(t("local_error_prefix", { message: extractLocalLLMFailureMessage("", parsedObj) }));
    }

    var structuredObj = null;
    try {
        structuredObj = eval("(" + outputText + ")");
    } catch (structuredParseError) {
        throw new Error(t("local_parse_error"));
    }
    return structuredObj;
}

function parseOpenAIStructuredOutput(parsedObj) {
    var outputText = stripMarkdownCodeFence(extractOpenAIOutputText(parsedObj));
    if (!outputText || outputText === "") {
        throw new Error(t("openai_error_prefix", { message: extractOpenAIFailureMessage("", parsedObj) }));
    }

    var structuredObj = null;
    try {
        structuredObj = eval("(" + outputText + ")");
    } catch (structuredParseError) {
        throw new Error(t("openai_parse_error"));
    }
    return structuredObj;
}

function extractGeminiFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.error && parsedObj.error.message) msg = parsedObj.error.message;
        else if (parsedObj && parsedObj.promptFeedback && parsedObj.promptFeedback.blockReason) msg = "blockReason=" + parsedObj.promptFeedback.blockReason;
        else if (parsedObj && parsedObj.candidates && parsedObj.candidates.length > 0 && parsedObj.candidates[0].finishReason && parsedObj.candidates[0].finishReason !== "STOP") msg = "finishReason=" + parsedObj.candidates[0].finishReason;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("gemini_unknown_response");
    return msg;
}

function extractGeminiOutputText(parsedObj) {
    try {
        if (parsedObj && parsedObj.promptFeedback && parsedObj.promptFeedback.blockReason) {
            throw new Error(t("gemini_refusal", { message: parsedObj.promptFeedback.blockReason }));
        }
    } catch (e) {
        if (e && e.message) throw e;
    }

    var parts = [];
    var candidates = (parsedObj && parsedObj.candidates) ? parsedObj.candidates : [];
    for (var i = 0; i < candidates.length; i++) {
        var content = (candidates[i] && candidates[i].content) ? candidates[i].content : null;
        var textParts = (content && content.parts) ? content.parts : [];
        for (var j = 0; j < textParts.length; j++) {
            if (textParts[j] && textParts[j].text !== undefined && textParts[j].text !== null) {
                parts.push(String(textParts[j].text));
            }
        }
    }
    return parts.join("");
}

function requestGeminiResponseObject(modelName, payloadObj) {
    var endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(modelName) + ":generateContent";
    var payloadFile = new File(Folder.temp + "/gem_pay_" + new Date().getTime() + ".json");
    var outFile = null;
    payloadFile.encoding = "UTF-8";
    payloadFile.open("w");
    payloadFile.write(serializeJSON(payloadObj));
    payloadFile.close();

    try {
        var resultJSON = "";
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Content-Type: application/json' -H 'x-goog-api-key: " + geminiKey + "' --data-binary @'" + payloadFile.fsName + "'";
            resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            outFile = new File(Folder.temp + "/gem_out_" + new Date().getTime() + ".json");
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Content-Type: application/json"" -H ""x-goog-api-key: ' + geminiKey + '"" --data-binary @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultJSON = outFile.read();
                outFile.close();
                try { outFile.remove(); } catch (outRemoveErr) {}
                outFile = null;
            }
        }

        var parsedObj = null;
        try {
            parsedObj = eval("(" + resultJSON + ")");
        } catch (parseError) {
            throw new Error(t("gemini_parse_error"));
        }
        if (!parsedObj || parsedObj.error) {
            throw new Error(t("gemini_error_prefix", { message: extractGeminiFailureMessage(resultJSON, parsedObj) }));
        }
        return parsedObj;
    } finally {
        try { payloadFile.remove(); } catch (payloadRemoveErr) {}
        try { if (outFile && outFile.exists) outFile.remove(); } catch (outCleanupErr) {}
    }
}

function parseGeminiStructuredOutput(parsedObj) {
    var outputText = stripMarkdownCodeFence(extractGeminiOutputText(parsedObj));
    if (!outputText || outputText === "") {
        throw new Error(t("gemini_error_prefix", { message: extractGeminiFailureMessage("", parsedObj) }));
    }

    var structuredObj = null;
    try {
        structuredObj = eval("(" + outputText + ")");
    } catch (structuredParseError) {
        throw new Error(t("gemini_parse_error"));
    }
    return structuredObj;
}

function extractClaudeFailureMessage(resultJSON, parsedObj) {
    var msg = "";
    try {
        if (parsedObj && parsedObj.error && parsedObj.error.message) msg = parsedObj.error.message;
        else if (parsedObj && parsedObj.type && parsedObj.type !== "message") msg = "type=" + parsedObj.type;
        else if (parsedObj && parsedObj.stop_reason && parsedObj.stop_reason !== "tool_use" && parsedObj.stop_reason !== "end_turn") msg = "stop_reason=" + parsedObj.stop_reason;
    } catch (e) {}
    if (msg === "" && resultJSON && resultJSON !== "") {
        msg = String(resultJSON).replace(/[\r\n]+/g, " ").replace(/^\s+|\s+$/g, "");
        if (msg.length > 220) msg = msg.substring(0, 220) + "...";
    }
    if (msg === "") msg = t("claude_unknown_response");
    return msg;
}

function extractClaudeStructuredToolInput(parsedObj, toolName) {
    var content = (parsedObj && parsedObj.content) ? parsedObj.content : [];
    var textParts = [];
    for (var i = 0; i < content.length; i++) {
        var item = content[i];
        if (!item) continue;
        if (item.type === "tool_use" && item.name === toolName) return item.input;
        if (item.type === "text" && item.text !== undefined && item.text !== null) textParts.push(String(item.text));
    }
    var refusalText = textParts.join(" ").replace(/^\s+|\s+$/g, "");
    if (refusalText !== "") throw new Error(t("claude_refusal", { message: refusalText }));
    throw new Error(t("claude_parse_error"));
}

function requestClaudeResponseObject(payloadObj) {
    var endpoint = "https://api.anthropic.com/v1/messages";
    var payloadFile = new File(Folder.temp + "/cla_pay_" + new Date().getTime() + ".json");
    var outFile = null;
    payloadFile.encoding = "UTF-8";
    payloadFile.open("w");
    payloadFile.write(serializeJSON(payloadObj));
    payloadFile.close();

    try {
        var resultJSON = "";
        if (File.fs === "Macintosh") {
            var curlCmd = "curl -sS -X POST '" + endpoint + "' -H 'Content-Type: application/json' -H 'x-api-key: " + claudeKey + "' -H 'anthropic-version: 2023-06-01' --data-binary @'" + payloadFile.fsName + "'";
            resultJSON = app.doScript('do shell script "' + curlCmd.replace(/"/g, '\\"') + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
        } else {
            outFile = new File(Folder.temp + "/cla_out_" + new Date().getTime() + ".json");
            var vbs = 'Dim WshShell\nSet WshShell = CreateObject("WScript.Shell")\n' +
                      'WshShell.Run "cmd.exe /c curl -sS -X POST """ & "' + endpoint + '" & """ -H ""Content-Type: application/json"" -H ""x-api-key: ' + claudeKey + '"" -H ""anthropic-version: 2023-06-01"" --data-binary @""" & "' + payloadFile.fsName + '" & """ > """ & "' + outFile.fsName + '" & """", 0, True\n';
            app.doScript(vbs, ScriptLanguage.VISUAL_BASIC_SCRIPT);
            if (outFile.exists) {
                outFile.encoding = "UTF-8";
                outFile.open("r");
                resultJSON = outFile.read();
                outFile.close();
                try { outFile.remove(); } catch (outRemoveErr) {}
                outFile = null;
            }
        }

        var parsedObj = null;
        try {
            parsedObj = eval("(" + resultJSON + ")");
        } catch (parseError) {
            throw new Error(t("claude_parse_error"));
        }
        if (!parsedObj || parsedObj.error) {
            throw new Error(t("claude_error_prefix", { message: extractClaudeFailureMessage(resultJSON, parsedObj) }));
        }
        return parsedObj;
    } finally {
        try { payloadFile.remove(); } catch (payloadRemoveErr) {}
        try { if (outFile && outFile.exists) outFile.remove(); } catch (outCleanupErr) {}
    }
}

function requestStructuredProviderObject(providerId, schemaName, schemaDef, promptText, systemInstruction) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "local") {
        var localPayloadObj = {
            model: getStructuredProviderModel(normalized),
            messages: [
                { role: "system", content: systemInstruction + " Output only valid JSON that matches the requested schema." },
                { role: "user", content: promptText }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: schemaName,
                    strict: true,
                    schema: schemaDef
                }
            },
            stream: false,
            temperature: 0
        };
        return parseLocalLLMStructuredOutput(requestLocalLLMChatCompletionObject(localPayloadObj));
    }

    if (normalized === "openai") {
        var openAIPayloadObj = {
            model: getStructuredProviderModel(normalized),
            instructions: systemInstruction,
            input: promptText,
            text: {
                format: {
                    type: "json_schema",
                    name: schemaName,
                    schema: schemaDef
                }
            }
        };
        return parseOpenAIStructuredOutput(requestOpenAIResponseObject(openAIPayloadObj));
    }

    if (normalized === "gemini") {
        var geminiPayloadObj = {
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseJsonSchema: schemaDef
            }
        };
        return parseGeminiStructuredOutput(requestGeminiResponseObject(getStructuredProviderModel(normalized), geminiPayloadObj));
    }

    if (normalized === "claude") {
        var claudePayloadObj = {
            model: getStructuredProviderModel(normalized),
            max_tokens: 12000,
            system: systemInstruction + " Always answer by calling the provided tool exactly once.",
            messages: [{ role: "user", content: promptText }],
            tools: [{
                name: schemaName,
                description: "Return the translation result for Adobe InDesign XML fragments using this schema only. Do not answer with plain text. The fields must contain translated XML strings that preserve the exact XML/tag/attribute structure.",
                input_schema: schemaDef,
                strict: true
            }],
            tool_choice: { type: "tool", name: schemaName }
        };
        return extractClaudeStructuredToolInput(requestClaudeResponseObject(claudePayloadObj), schemaName);
    }

    throw new Error("Unsupported provider: " + normalized);
}

function repairStructuredProviderInvalidTranslation(providerId, sourceXML, candidateXML, targetLangCode, blockIndex, overPct) {
    var normalized = normalizeTranslationProvider(providerId);
    var debugPrefix = getProviderDebugPrefix(normalized);
    if (overPct !== null && overPct !== undefined) {
        updateProgress(null, t(getProviderStringKey(normalized, "repair_block"), { index: blockIndex }), overPct, null);
    }
    writeDebugLog(debugPrefix + ":repair:start block=" + blockIndex +
        " source=" + String(sourceXML || "").substring(0, 500) +
        " candidate=" + String(candidateXML || "").substring(0, 500), "WARNUNG");

    var structuredObj = requestStructuredProviderObject(
        normalized,
        "translation_repair",
        getSingleTranslationJSONSchema(),
        buildStructuredRepairPrompt(sourceXML, candidateXML, targetLangCode),
        "You repair XML structure for Adobe InDesign translation fragments. Preserve the exact source XML/tag/attribute structure and output only the requested JSON object."
    );
    if (!structuredObj || typeof structuredObj.translation !== "string") {
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    var repairedXML = normalizeStructuredXMLCandidate(structuredObj.translation, sourceXML);
    if (!validateStructuredXMLTranslation(sourceXML, repairedXML)) {
        writeDebugLog(debugPrefix + ":repair:failed block=" + blockIndex +
            " repaired=" + String(repairedXML || "").substring(0, 500), "WARNUNG");
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    writeDebugLog(debugPrefix + ":repair:success block=" + blockIndex);
    return repairedXML;
}

function retrySingleBlockStructuredProviderTranslation(providerId, sourceXML, targetLangCode, blockIndex, overPct) {
    var normalized = normalizeTranslationProvider(providerId);
    var debugPrefix = getProviderDebugPrefix(normalized);
    if (overPct !== null && overPct !== undefined) {
        updateProgress(null, t(getProviderStringKey(normalized, "retry_block"), { index: blockIndex }), overPct, null);
    }
    writeDebugLog(debugPrefix + ":retry_single:start block=" + blockIndex +
        " source=" + String(sourceXML || "").substring(0, 500), "WARNUNG");

    var structuredObj = requestStructuredProviderObject(
        normalized,
        "single_translation",
        getSingleTranslationJSONSchema(),
        buildStructuredSingleTranslationPrompt(sourceXML, targetLangCode),
        "You translate a single Adobe InDesign XML fragment. Preserve the exact XML/tag/attribute structure and output only the requested JSON object."
    );
    if (!structuredObj || typeof structuredObj.translation !== "string") {
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    var translatedXML = normalizeStructuredXMLCandidate(structuredObj.translation, sourceXML);
    if (!validateStructuredXMLTranslation(sourceXML, translatedXML)) {
        writeDebugLog(debugPrefix + ":retry_single:failed block=" + blockIndex +
            " candidate=" + String(translatedXML || "").substring(0, 500), "WARNUNG");
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    writeDebugLog(debugPrefix + ":retry_single:success block=" + blockIndex);
    return translatedXML;
}

function translateSingleBlockDeepLFallbackForProvider(providerId, sourceXML, targetLangCode, blockIndex, overPct) {
    var normalized = normalizeTranslationProvider(providerId);
    var debugPrefix = getProviderDebugPrefix(normalized);
    if (!apiKey || apiKey === "") {
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }
    if (overPct !== null && overPct !== undefined) {
        updateProgress(null, t(getProviderStringKey(normalized, "fallback_deepl_block"), { index: blockIndex }), overPct, null);
    }
    writeDebugLog(debugPrefix + ":fallback_deepl:start block=" + blockIndex +
        " source=" + String(sourceXML || "").substring(0, 500), "WARNUNG");

    var translated = translateBatchDeepL([sourceXML], targetLangCode, overPct, overPct);
    if (!translated || translated.length !== 1) {
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    var translatedXML = normalizeStructuredXMLCandidate(translated[0], sourceXML);
    if (!validateStructuredXMLTranslation(sourceXML, translatedXML)) {
        writeDebugLog(debugPrefix + ":fallback_deepl:failed block=" + blockIndex +
            " candidate=" + String(translatedXML || "").substring(0, 500), "WARNUNG");
        throw new Error(t(getProviderStringKey(normalized, "invalid_xml"), { index: blockIndex }));
    }

    writeDebugLog(debugPrefix + ":fallback_deepl:success block=" + blockIndex);
    return translatedXML;
}

function repairOpenAIInvalidTranslation(sourceXML, candidateXML, targetLangCode, blockIndex, overPct) {
    return repairStructuredProviderInvalidTranslation("openai", sourceXML, candidateXML, targetLangCode, blockIndex, overPct);
}

function retrySingleBlockOpenAITranslation(sourceXML, targetLangCode, blockIndex, overPct) {
    return retrySingleBlockStructuredProviderTranslation("openai", sourceXML, targetLangCode, blockIndex, overPct);
}

function translateSingleBlockDeepLFallback(sourceXML, targetLangCode, blockIndex, overPct) {
    return translateSingleBlockDeepLFallbackForProvider("openai", sourceXML, targetLangCode, blockIndex, overPct);
}

function translateBatchWithProvider(textsArray, targetLangCode, overStartPct, overEndPct, providerId) {
    var activeProvider = normalizeTranslationProvider(providerId || getActiveTranslationProvider());
    if (activeProvider === "local") {
        return translateBatchLocalLLM(textsArray, targetLangCode, overStartPct, overEndPct);
    }
    if (activeProvider === "openai") {
        return translateBatchOpenAI(textsArray, targetLangCode, overStartPct, overEndPct);
    }
    if (activeProvider === "gemini") {
        return translateBatchGemini(textsArray, targetLangCode, overStartPct, overEndPct);
    }
    if (activeProvider === "claude") {
        return translateBatchClaude(textsArray, targetLangCode, overStartPct, overEndPct);
    }
    return translateBatchDeepL(textsArray, targetLangCode, overStartPct, overEndPct);
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

function getStructuredProviderBatchSize(providerId) {
    var normalized = normalizeTranslationProvider(providerId);
    if (normalized === "local") return 6;
    if (normalized === "claude") return 6;
    if (normalized === "gemini") return 10;
    return 8;
}

function translateBatchStructuredLLM(providerId, textsArray, targetLangCode, overStartPct, overEndPct) {
    var normalized = normalizeTranslationProvider(providerId);
    var translated = [];
    var batchSize = getStructuredProviderBatchSize(normalized);
    var requestLabelKey = getProviderStringKey(normalized, "request_blocks");
    var incompleteKey = getProviderStringKey(normalized, "incomplete");
    var invalidKey = getProviderStringKey(normalized, "invalid_xml");
    var connectionKey = getProviderStringKey(normalized, "connection_error");
    var debugPrefix = getProviderDebugPrefix(normalized);

    for (var b = 0; b < textsArray.length; b += batchSize) {
        if (cancelFlag) throw new Error("CANCELLED");

        var batchPct = (b / textsArray.length);
        var currentTaskPct = 20 + Math.round(batchPct * 60);
        var currentOverPct = overStartPct ? (overStartPct + (batchPct * (overEndPct - overStartPct) * 0.8)) : null;
        var endBatch = Math.min(b + batchSize, textsArray.length);
        updateProgress(currentTaskPct, t(requestLabelKey, { start: (b + 1), end: endBatch, total: textsArray.length }), currentOverPct, null);

        var batchTexts = [];
        for (var j = b; j < endBatch; j++) batchTexts.push(String(textsArray[j] || ""));

        try {
            var structuredObj = requestStructuredProviderObject(
                normalized,
                "translation_batch",
                getBatchTranslationJSONSchema(),
                buildStructuredBatchTranslationPrompt(batchTexts, targetLangCode),
                "You are a translation engine for Adobe InDesign XML fragments. Preserve the exact XML/tag/attribute structure and output only the requested JSON object."
            );

            if (!structuredObj || !structuredObj.translations || structuredObj.translations.length !== batchTexts.length) {
                throw new Error(t(incompleteKey));
            }

            for (var k = 0; k < structuredObj.translations.length; k++) {
                var blockIndex = b + k + 1;
                var translatedXML = normalizeStructuredXMLCandidate(structuredObj.translations[k], batchTexts[k]);
                if (!validateStructuredXMLTranslation(batchTexts[k], translatedXML)) {
                    writeDebugLog(debugPrefix + ":invalid_xml block=" + blockIndex +
                        " source=" + String(batchTexts[k] || "").substring(0, 500) +
                        " candidate=" + String(translatedXML || "").substring(0, 500), "WARNUNG");
                    try {
                        translatedXML = repairStructuredProviderInvalidTranslation(normalized, batchTexts[k], translatedXML, targetLangCode, blockIndex, currentOverPct);
                    } catch (repairErr) {
                        writeDebugLog(debugPrefix + ":repair:error block=" + blockIndex + " error=" + (repairErr.message || repairErr), "WARNUNG");
                        try {
                            translatedXML = retrySingleBlockStructuredProviderTranslation(normalized, batchTexts[k], targetLangCode, blockIndex, currentOverPct);
                        } catch (retryErr) {
                            writeDebugLog(debugPrefix + ":retry_single:error block=" + blockIndex + " error=" + (retryErr.message || retryErr), "WARNUNG");
                            translatedXML = translateSingleBlockDeepLFallbackForProvider(normalized, batchTexts[k], targetLangCode, blockIndex, currentOverPct);
                        }
                    }
                }
                if (!validateStructuredXMLTranslation(batchTexts[k], translatedXML)) {
                    throw new Error(t(invalidKey, { index: blockIndex }));
                }
                translated.push(translatedXML);
            }
        } catch (e) {
            if (e.message === "CANCELLED") throw e;
            throw new Error(isProviderBrandedError(normalized, e.message) ? e.message : t(connectionKey, { message: (e.message || "Request failed.") }));
        }
    }

    return translated;
}

function translateBatchOpenAI(textsArray, targetLangCode, overStartPct, overEndPct) {
    return translateBatchStructuredLLM("openai", textsArray, targetLangCode, overStartPct, overEndPct);
}

function translateBatchLocalLLM(textsArray, targetLangCode, overStartPct, overEndPct) {
    return translateBatchStructuredLLM("local", textsArray, targetLangCode, overStartPct, overEndPct);
}

function translateBatchGemini(textsArray, targetLangCode, overStartPct, overEndPct) {
    return translateBatchStructuredLLM("gemini", textsArray, targetLangCode, overStartPct, overEndPct);
}

function translateBatchClaude(textsArray, targetLangCode, overStartPct, overEndPct) {
    return translateBatchStructuredLLM("claude", textsArray, targetLangCode, overStartPct, overEndPct);
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
    if ((!story || !story.isValid) && textObj.constructor && textObj.constructor.name === "Story") story = textObj;
    if (!story || !story.isValid) return null;
    try {
        var startIndex = 0;
        var endIndex = 0;
        if (textObj.constructor && textObj.constructor.name === "Story") {
            startIndex = 0;
            endIndex = story.insertionPoints.length > 0 ? story.insertionPoints[story.insertionPoints.length - 1].index : 0;
        } else {
            startIndex = textObj.insertionPoints[0].index;
            endIndex = textObj.insertionPoints[textObj.insertionPoints.length - 1].index;
        }
        return {
            storyId: story.id,
            start: startIndex,
            end: endIndex
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

        chunk = chunk.replace(/###(TBL_\d+|IMG_\d+)###/g, '<nt>###$1###</nt>');
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
    var currentPage = doc.pages[0];
    try {
        if (app.activeWindow.activePage && isValidDocumentPage(app.activeWindow.activePage)) currentPage = app.activeWindow.activePage;
    } catch(e) {}
    writeDebugLog("storage:setup page=" + getDebugPageLabel(currentPage) + " layer=" + tempLayer.name);
    var storageFrame = currentPage.textFrames.add({itemLayer: tempLayer, geometricBounds: [0,-2000, 2000, -50], contents: ""});
    try { storageFrame.label = "TEMP_TRANS_STORAGE"; } catch (e2) {}
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
