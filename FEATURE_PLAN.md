# SuperTranslatorPro Checkliste

> Diese Datei zeigt, was bereits umgesetzt ist und welche Punkte aktuell noch offen sind.

## Aktueller Status
- **Version:** 28.2
- **Datum:** 4. April 2026
- **Status:** Produktiv nutzbare Basis. Fokus aktuell auf Feinschliff, Provider-Stabilisierung, Hybrid-Modus, echten InDesign-Tests und UXP-Planung.

---

## Kurzstatus

### Bereits umgesetzt
- [x] Quellsprachen-Prüfung inkl. Korrekturdialog, automatischer Spracherkennung und Noise-Filter
- [x] Verlinken von Referenzen und Web-URLs
- [x] Live-Auslesen der Sprach-/Seitenzuordnung von Seite 1 für Hyperlinks
- [x] Hauptfenster mit Live-Refresh für Status, Preflight und Button-Aktivierung
- [x] Automatische Musterseiten-Generierung inkl. Erkennung, Auswahl/Abwahl und Reihenfolge
- [x] Wörterbuch-/Glossar-System inkl. Erststart-Setup, Template, Migration und verständlicher Erklärungen
- [x] Glossar-CSV für parallele Nutzung robuster gemacht, inkl. stabilerer Reads, Backup-Fallback und gesichertem Template-Schreiben
- [x] Robustes Translation Memory mit Sperrlogik, Delta-Merge, Backup und atomarem Schreiben für parallele Nutzung
- [x] UI-Sprache im Settings-Tab wählbar: `Auto (Systemsprache)`, `DE`, `EN`
- [x] Nachbearbeitung technischer Tokens wie `M5*15`, damit Leerzeichen sauber bleiben
- [x] Provider-Abstraktion mit DeepL als Default und OpenAI als optionalem Phase-1-Provider
- [x] Hyperlink-, Einstellungs- und Fortschrittsdialoge visuell überarbeitet und resizable gemacht
- [x] Intelligente Copyfitting-Logik mit Tracking-, Scale- und Rahmen-Fallback
- [x] Konfigurierbare Schrift-Fallbacks im Tab `Typografie` fuer nicht-lateinische Zielschriften und kuenftige Sprachskripte

### Noch offen
- [ ] Optionaler Hybrid-Modus zwischen DeepL und LLMs
- [ ] Migration auf UXP / Plugin-Architektur
- [ ] Erweiterte End-to-End-Tests mit echten InDesign-Dokumenten
- [ ] Qualitätssicherung nach der Übersetzung (GREP-/Format-Prüfung)
- [ ] Kontext-Awareness per Whole-Page Context als optionale Menü-Funktion
- [ ] Cross-App Automatisierung für verknüpfte Illustrator-Dateien
- [ ] Review-Modus für Side-by-Side Lektorat in InDesign

---

## Übersicht
- [x] Quellsprachen-Prüfung
- [x] Intelligente Copyfitting-Logik
- [x] Automatische Musterseiten-Generierung (Legacy-Fallback)
- [x] Andere LLMs (ChatGPT / Gemini / Claude)
- [ ] Migration auf UXP
- [ ] UI/UX Optimierung
- [x] Verlinken (Linking Features)
- [x] Wörterbuch / Glossar-System
- [x] Translation Memory / Mehrbenutzer-Schutz
- [ ] Qualitätssicherung (QA)
- [ ] Kontext-Awareness (Whole-Page Context)
- [ ] Cross-App Automatisierung (Illustrator / BridgeTalk)
- [ ] Review-Modus (Side-by-Side)

---

## 1. Quellsprachen-Prüfung
- [x] UI-Button für die Quellsprachen-Prüfung eingebaut
- [x] Quellsprache automatisch über Sprachmarker, Musterseite oder Kontext erkennen
- [x] Zugehörige Dokumentseiten der erkannten Quellsprache prüfen
- [x] Korrekturhinweise und Dialog zur Übernahme/Überspringen anzeigen
- [x] Hinweise zu Leerzeichen, Typografie und reinem Noise ignorieren
- [x] Korrekturdialog kleiner, klarer und mit Positionsspeicherung umgesetzt
- [x] Ergebnisse sauber zusammenfassen
- [ ] Optional: Direkten Sprung zur ersten Auffälligkeit weiter verbessern

**Notizen:**
- Funktion ist produktiv nutzbar und nicht mehr auf Deutsch fest verdrahtet. Sinnvoll wären noch mehr Praxistests mit unterschiedlichen Layout-Strukturen und Quellsprachen.

---

## 2. Intelligente Copyfitting-Logik
- [x] Neue Helper-Funktion `applySmartCopyfit(textFrame)` erstellen
- [x] Priorität 1: Tracking (Laufweite) schrittweise bis -10 reduzieren
- [x] Priorität 2: Horizontal Scale (Zeichenbreite) schrittweise bis 98% reduzieren
- [x] Priorität 3: Rahmenvergrößerung nur als letzter Fallback anwenden
- [x] Overflow-Fix innerhalb von `executeTranslation` ersetzen

**Notizen:**
- Smart Copyfit ist jetzt im Übersetzungsablauf integriert: zuerst Tracking, dann Horizontal Scale, erst danach Rahmenwachstum. Im Tab `Typografie` sind inzwischen Ein/Aus, Tracking-Limit, Scale-Limit sowie beide Schrittweiten konfigurierbar; Standard bleibt Tracking bis `-10`, Horizontal Scale bis `98%`, Tracking-Schrittweite `2`, Scale-Schrittweite `1`. Offen bleiben vor allem Praxistests mit echten InDesign-Dokumenten und unterschiedlichen Layouts.

---

## 3. Automatische Musterseiten-Generierung (Legacy-Fallback)
- [x] In `runBDAMode` prüfen, ob zielsprachige Masterseiten fehlen
- [x] Deutsche `-de` Masterseite identifizieren
- [x] UI-Dialog für Zielsprachen implementieren
- [x] Bereits erkannte Zielsprachen automatisch aktivieren
- [x] Sprachen manuell auswählen oder abwählen
- [x] Reihenfolge pro Sprache über Eingabefeld festlegen
- [x] Deutsche Masterseite für fehlende Sprachen duplizieren
- [x] Neue Masters korrekt umbenennen (`-en`, `-fr`, etc.)
- [x] Bereits vorhandene und neue Musterseiten passend neu anordnen
- [x] Danach normalen BDA-Automatikfluss fortsetzen
- [ ] End-to-End-Test mit mehreren echten BDA-Dokumenten abschließen

**Notizen:**
- Der Legacy-Fallback ist umgesetzt und deutlich flexibler als in der ersten Planung.

---

## 4. Andere LLMs (ChatGPT / Gemini / Claude)
- [x] Provider-Interface für Übersetzungen definieren
- [x] DeepL als Default behalten
- [x] OpenAI-Adapter für XML-/Tag-sichere Übersetzungen ergänzen
- [x] Adapter für Google / Gemini ergänzen
- [x] Adapter für Anthropic / Claude ergänzen
- [x] Lokalen OpenAI-kompatiblen Provider für LM Studio / Ollama ergänzen
- [x] UI für Provider-Auswahl und API-Key-Felder hinzufügen

**Notizen:**
- DeepL bleibt Standard; OpenAI, Gemini, Claude und lokale OpenAI-kompatible Server hängen jetzt an derselben XML-/Tag-validierten Provider-Schicht.
- Offene Folgeschritte sind vor allem Live-Tests in echten InDesign-Dokumenten sowie später ein optionaler Hybrid-/Polish-Modus.

---

## 5. Migration auf UXP
- [ ] Kernlogik / UI klar trennen
- [ ] UXP-Plugin-Struktur planen (`manifest.json`, HTML/CSS/JS)
- [ ] UXP-UI-Portierung vorbereiten

**Notizen:**
- Aktuell noch Zukunftsthema.

---

## 6. UI/UX Optimierung
- [x] UI-Sprache über eigenen Settings-Tab wählbar (`Auto`, `DE`, `EN`) inkl. System-Fallback
- [x] Hauptfenster mit klarerem Modus-Flow, Status- und Preflight-Bereichen aufgebaut
- [x] Live-Validierung und Live-Refresh des Hauptfensters ohne Fokuswechsel ergänzt
- [x] Legacy-Dialogtext verbessert, damit auch erkannte Sprachen verständlich erklärt werden
- [x] Auswahl-/Abwahl-Logik im Musterseiten-Dialog erweitert
- [x] Reihenfolge-Feld pro Sprache im Musterseiten-Dialog ergänzt
- [x] Einstellungsfenster vergrößert, strukturiert und rechts am Hauptfenster angedockt
- [x] Hyperlink-Dialog mit persistenter Zuordnung und resizable Layout überarbeitet
- [x] Quellsprachen-Korrekturdialog und Fortschrittsfenster optisch aufgeräumt
- [x] Grüner Erfolgsstatus im Fortschrittsfenster ergänzt
- [ ] Weitere UI-Feinschliffe und Usability-Tests in InDesign

**Notizen:**
- UI wurde in mehreren Phasen deutlich überarbeitet: Das Hauptfenster reagiert live auf Auswahländerungen, Dialoge sind strukturierter und resizable, die UI-Sprache ist nun separat über `Auto/DE/EN` steuerbar, und das Fortschrittsfenster zeigt einen sichtbaren Erfolgsstatus. Offen bleiben vor allem Praxistests in InDesign und weitere visuelle Feinschliffe.

---

## 7. Verlinken (Linking Features)
- [x] System für Referenz-Symbole in Einstellungen integriert (Standard `[]`)
- [x] Button "Hyperlinks" im manuellen Modus implementiert
- [x] Automatische Erkennung und Verlinkung von Web-URLs integriert
- [x] Sprach-/Seitenzuordnung live von Seite 1 auslesen
- [x] Automatische Referenz-Hyperlinks im BDA-Modus integriert
- [x] Fehlende Sprachen beim Auto-Linking ignorieren statt fehlerhaft zu verlinken
- [ ] Zukunft: Weitere Cross-Reference- oder Paket-Referenz-Logik ausbauen

**Notizen:**
- Verlinken ist inzwischen deutlich weiter als im ursprünglichen Plan.

---

## 8. Wörterbuch / Glossar-System
- [x] Erststart-Dialog: neues Wörterbuch erstellen oder bestehendes auswählen
- [x] Glossar-Template automatisch erzeugen
- [x] Alle unterstützten Sprachspalten im Template ergänzen
- [x] Meta-Spalten `_SOURCE`, `_INFO`, `_FLAGS`, `_ALIASES` integrieren
- [x] `_SOURCE` mit leerem Feld = Standard `DE`
- [x] Bestehendes Wörterbuch auf neues Format migrieren
- [x] Erklärungen und Beispiele für andere Nutzer verständlicher machen
- [x] Glossar-Lesezugriffe bei parallelem Speichern robuster gemacht
- [x] Template-Erstellung mit Sperrlogik, Backup und atomarem Schreiben abgesichert
- [x] Backup-Fallback für beschädigte oder unvollständig geschriebene Glossar-Dateien ergänzt
- [ ] Praxis-Test mit zwei Clients bzw. externen CSV-Editoren auf Netzlaufwerk durchführen
- [ ] Optional: CSV-Validierung oder Glossar-Prüfung ergänzen

**Notizen:**
- Dieser Bereich ist inzwischen produktiv nutzbar und war im alten Plan noch gar nicht vollständig erfasst. Neu ist zusätzlich ein robusterer Mehrbenutzer-Schutz für CSV-Zugriffe: Das Script liest stabiler bei parallelem Speichern, kann auf eine Sicherung zurückfallen und schreibt neue Template-Dateien abgesichert.

---

## 9. Translation Memory / Mehrbenutzer-Schutz
- [x] Translation Memory als gemeinsame JSON-Datei konfigurierbar
- [x] Schreibzugriffe mit Sperrlogik abgesichert
- [x] Vor dem Speichern aktuellen Stand frisch laden und neue Einträge mergen
- [x] Nur Delta des aktuellen Laufs speichern statt altes Komplett-Snapshot zurückzuschreiben
- [x] Atomisches Schreiben über Temp-Datei plus Backup ergänzt
- [x] Backup-Fallback und Sicherung beschädigter Hauptdateien ergänzt
- [x] `Memory leeren` auf dieselbe sichere Schreiblogik umgestellt
- [ ] Parallele Praxis-Tests mit zwei Clients auf Netzlaufwerk durchführen
- [ ] Optional später: zentrale TM-Datenhaltung statt einzelner JSON-Datei prüfen

**Notizen:**
- Das Risiko für Datenverlust bei zwei gleichzeitigen Nutzern ist jetzt deutlich reduziert. Offen bleibt vor allem der Fall, dass zwei Personen exakt denselben neuen Text nahezu gleichzeitig erstmals übersetzen; dabei können weiterhin doppelte API-Calls entstehen, auch wenn die Datei selbst geschützt ist.

---

## 10. Qualitätssicherung (QA)
- [ ] GREP-/Format-Prüfung nach der Übersetzung ergänzen
- [ ] Verlust wichtiger GREP-Stile oder Sonderzeichen automatisch erkennen
- [ ] Geschützte Leerzeichen vor Einheiten wie `kg`, `cm`, `mm` oder ähnlichen Mustern automatisch wiederherstellen
- [ ] Typografische Korrekturen als sicheren Post-Processing-Schritt definieren
- [ ] Praxis-Tests mit typografisch sensiblen Dokumenten durchführen

**Notizen:**
- Ziel ist eine automatische Nachkontrolle direkt nach der Übersetzung, damit typische Formatverluste nicht erst im Lektorat auffallen. Besonders wichtig sind GREP-getriebene Feinheiten und Sonderzeichen wie geschützte Leerzeichen vor Maßeinheiten.

---

## 11. Kontext-Awareness (Whole-Page Context)
- [ ] Gesamten Seiteninhalt als reinen Lese-Kontext ohne XML-Tags an KI-Provider übergeben
- [ ] Kontext nur als optionale Menü-/Settings-Funktion anbieten
- [ ] Funktion standardmäßig deaktiviert lassen
- [ ] Mehrdeutige Begriffe wie `Bank`, `Absatz` oder `Leiter` mit Seitenthematik evaluieren
- [ ] Token-/Kosten-Auswirkungen sowie Provider-Kompatibilität testen

**Notizen:**
- Die eigentliche Übersetzung soll weiterhin XML-/tag-sicher pro Textrahmen laufen. Neu wäre nur zusätzlicher Seitenkontext als Lesekontext für bessere semantische Entscheidungen, ohne das Standardverhalten ungefragt zu verändern.

---

## 12. Cross-App Automatisierung (Illustrator / BridgeTalk)
- [ ] BridgeTalk-Kommunikation zwischen InDesign und Illustrator konzipieren
- [ ] Verknüpfte `.ai`- und `.eps`-Dateien im Dokument identifizieren
- [ ] Text-Ebenen in verknüpften Illustrator-Dateien automatisiert auslesen und übersetzen
- [ ] Zielsprachige Ableger wie `_FR.ai` erzeugen und im InDesign-Dokument neu verknüpfen
- [ ] Fehlerfälle für fehlende Schriften, gesperrte Dateien, verknüpfte Assets und Rückspeicherung testen

**Notizen:**
- Dieser Punkt ist bewusst als Zukunfts-Feature markiert, weil er technisch und organisatorisch deutlich größer ist als die restlichen Verbesserungen. Gleichzeitig wäre er im DTP-Alltag ein enormer Hebel, gerade bei Handbüchern mit beschrifteten Explosionszeichnungen oder Diagrammen.

---

## 13. Review-Modus (Side-by-Side)
- [ ] Kleines Bedienfeld in InDesign für Review und Lektorat entwerfen
- [ ] Beim Klick auf einen übersetzten Textrahmen Originaltext und Zieltext im Bedienfeld anzeigen
- [ ] Original oben und Übersetzung unten klar lesbar darstellen
- [ ] Datenquelle für den Originaltext im Review-Modus sauber definieren
- [ ] Mit realen Review-Workflows in Agentur oder Lektorat testen

**Notizen:**
- Das Ziel ist ein deutlich angenehmerer Review-Flow direkt in InDesign, ohne ständig zwischen PDFs, Layout-Versionen oder mehreren Bildschirmen wechseln zu müssen.

---

## Prioritäten
1. UI/UX Feinschliff und echte InDesign-Tests
2. Optionaler Hybrid-Modus zwischen DeepL und LLMs
3. Weitere Provider-Live-Tests
4. Migration auf UXP
5. Zusätzliche Cross-Reference- und Glossar-Validierung
6. QA-/Formatprüfung und Whole-Page Context evaluieren
7. Review-Modus und Cross-App Automatisierung konzipieren

---

## Offene ToDo-Punkte
- [ ] Legacy-BDA, Auto-Hyperlinks und Glossar-Flow in echten Projekten breit testen
- [ ] Gemini-/Claude-Live-Tests inkl. Grenzfällen mit XML, Tabellen und langen BDA-Läufen durchführen
- [ ] Lokale LLM-Live-Tests mit LM Studio und Ollama durchführen
- [ ] Optionalen Hybrid-Modus (z. B. DeepL + LLM-Polish) konzipieren
- [ ] Glossar-Mehrbenutzerlauf mit zwei Rechnern bzw. externem CSV-Editor auf Netzlaufwerk testen
- [ ] Translation-Memory-Mehrbenutzerlauf mit zwei Rechnern auf Netzlaufwerk testen
- [ ] QA-Post-Processing für GREP-/Formatverluste und geschützte Leerzeichen konzipieren
- [ ] Whole-Page-Context als optionalen, standardmäßig deaktivierten Menüpunkt planen
- [ ] BridgeTalk-Prototyp für Illustrator-/InDesign-Automatisierung evaluieren
- [ ] Review-Bedienfeld für Side-by-Side Lektorat in InDesign entwerfen
- [ ] UXP-Refactoring-Plan erstellen
- [ ] Glossar-Validator für fehlerhafte CSV-Struktur ergänzen
- [ ] Optionalen Pfad Richtung zentrale TM-Datenhaltung oder Service evaluieren
- [ ] Erweiterte Cross-Reference-Logik für Spezialfälle ausbauen

---

## Änderungslog
- 4. April 2026: Plan um QA-/Formatprüfung, Whole-Page Context, Cross-App Automatisierung für Illustrator und Review-Modus erweitert
- 4. April 2026: Glossar-CSV für Mehrbenutzerbetrieb robuster gemacht, inklusive stabilerer Lesezugriffe, Backup-Fallback und gesichertem Template-Schreiben
- 4. April 2026: Translation Memory für Mehrbenutzerbetrieb abgesichert, inklusive Sperrlogik, Delta-Merge, Backup-Fallback und atomarem Schreiben
- 4. April 2026: Konfigurierbare Schrift-Fallbacks im Tab `Typografie` ergänzt, inklusive Script-Erkennung und Regeln für z. B. Kyrillisch, Arabisch, Hebräisch, Devanagari und CJK
- 3. April 2026: `Typografie`-Tab erweitert um Smart-Copyfit Ein/Aus sowie konfigurierbare Tracking- und Scale-Schrittweiten
- 3. April 2026: Smart-Copyfit-Einstellungen ergänzt, damit Tracking-Limit und minimale Horizontal Scale im Einstellungsdialog manuell anpassbar sind (Default `-10` / `98%`)
- 3. April 2026: Intelligente Copyfitting-Logik umgesetzt (`applySmartCopyfit`) mit Tracking bis `-10`, Horizontal Scale bis `98%` und Rahmenwachstum als letztem Fallback
- 3. April 2026: UI-Sprache als eigener Settings-Tab ergänzt (`UI-Sprache` mit `Auto`, `DE`, `EN`) und im Einstellungsdialog nach rechts verschoben
- 3. April 2026: UI/UX-Phasen 1-5 umgesetzt (klareres Hauptfenster, Live-Validierung, überarbeitete Settings-/Hyperlink-Dialoge, Button-Hierarchie und Fortschrittsfenster-Polish)
- 3. April 2026: Hauptfenster live aktualisiert, Quellsprachen-Prüfung verallgemeinert und Fortschrittsfenster um grünen Erfolgsstatus erweitert
- 2. April 2026: Gemini- und Claude-Adapter auf die gemeinsame XML-/Tag-sichere Provider-Schicht gehängt, inklusive UI-Feldern für Keys/Modelle und DeepL-Fallback
- 2. April 2026: Lokalen OpenAI-kompatiblen Provider für LM Studio/Ollama ergänzt (Base URL, Modell, optionaler Key)
- 1. April 2026: Phase 1 der Provider-Erweiterung umgesetzt (Provider-Interface, OpenAI-Adapter, UI für Provider- und API-Key-Auswahl)
- 31. März 2026: Plan auf realen Entwicklungsstand aktualisiert, Glossar-System ergänzt, Hyperlink- und Legacy-Fallback-Fortschritt eingetragen
- 31. März 2026: UI/UX-Optimierung und Verlinken als neue Hauptpunkte ergänzt
- 29. März 2026: Checkliste erstellt und als `FEATURE_PLAN.md` abgelegt
